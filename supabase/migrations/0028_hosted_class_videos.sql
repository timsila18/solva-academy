do $migration$ begin
create table public.course_video_uploads (
 id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id),
 lesson_id uuid not null references public.course_lessons(id), actor_id uuid not null references public.profiles(id),
 status text not null default 'pending' check(status in ('pending','attached')),
 bytes bigint check(bytes between 1 and 350000000), sha256 text,
 expires_at timestamptz not null default now()+interval '4 hours', created_at timestamptz not null default now()
);
create index course_video_uploads_lesson on public.course_video_uploads(course_id,lesson_id,created_at);
alter table public.course_video_uploads enable row level security;
create policy video_uploads_read_own on public.course_video_uploads for select to authenticated using(actor_id=auth.uid());
create function public.studio_attach_hosted_video(upload_id uuid,verified_bytes bigint,verified_sha256 text)
returns void language plpgsql security definer set search_path=public as $$
declare ticket public.course_video_uploads%rowtype;
begin
 if auth.role() is distinct from 'service_role' then raise exception 'Verified storage service required'; end if;
 select * into ticket from public.course_video_uploads where id=upload_id;
 if ticket.id is null then raise exception 'Upload not found'; end if;
 perform 1 from public.courses where id=ticket.course_id for update;
 if not coalesce(public.studio_can_edit_course(ticket.course_id,ticket.actor_id),false) then raise exception 'Course is read-only or access expired'; end if;
 if ticket.status='attached' then return; end if;
 if ticket.expires_at<now() or verified_bytes not between 1 and 350000000 or verified_sha256 !~ '^[a-f0-9]{64}$' then raise exception 'Upload is invalid or expired'; end if;
 if not exists(select 1 from public.course_lessons l join public.course_versions v on v.id=l.version_id where l.id=ticket.lesson_id and l.course_id=ticket.course_id and l.status<>'archived' and v.status='draft') then raise exception 'Class is not editable'; end if;
 insert into public.lesson_content_blocks(lesson_id,block_type,content,display_order,visibility,status)
 values(ticket.lesson_id,'video',jsonb_build_object('provider','hostafrica','uploadId',ticket.id,'bytes',verified_bytes),1,'learner','active')
 on conflict(lesson_id,display_order) do update set block_type='video',content=excluded.content,status='active';
 update public.course_video_uploads set status='attached',bytes=verified_bytes,sha256=verified_sha256 where id=ticket.id;
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,new_data,success)
 select ticket.actor_id,'studio_hosted_video_attached','course',c.id::text,c.owning_workspace_id,jsonb_build_object('lesson_id',ticket.lesson_id,'upload_id',ticket.id,'bytes',verified_bytes),true from public.courses c where c.id=ticket.course_id;
end $$;
revoke all on function public.studio_attach_hosted_video(uuid,bigint,text) from public,anon,authenticated;
grant execute on function public.studio_attach_hosted_video(uuid,bigint,text) to service_role;
create function public.studio_video_block_ready(course_id uuid,lesson_id uuid,content jsonb)
returns boolean language sql stable security definer set search_path=public as $$
 select (content->>'provider'='hostafrica' and exists(select 1 from public.course_video_uploads u where u.id::text=content->>'uploadId' and u.course_id=$1 and u.lesson_id=$2 and u.status='attached'))
 or (content->>'bucket'='course-media' and content->>'path' like $1::text||'/'||$2::text||'/%' and exists(select 1 from storage.objects o where o.bucket_id='course-media' and o.name=content->>'path'));
$$;
revoke all on function public.studio_video_block_ready(uuid,uuid,jsonb) from public,anon,authenticated;
execute replace(pg_get_functiondef('public.studio_command(uuid,text,jsonb)'::regprocedure),
 'b.content->>''bucket''=''course-media'' and b.content->>''path'' like c.id::text||''/''||l.id::text||''/%''',
 'public.studio_video_block_ready(c.id,l.id,b.content)');
if position('public.studio_video_block_ready(c.id,l.id,b.content)' in pg_get_functiondef('public.studio_command(uuid,text,jsonb)'::regprocedure))=0 then raise exception 'Hosted video readiness update failed'; end if;
end $migration$;
