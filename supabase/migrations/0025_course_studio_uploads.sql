do $migration$ begin
create function public.studio_sync_class_order() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.display_order<>old.display_order and (select count(*) from public.course_lessons where module_id=new.id)=1 then
  update public.course_lessons set display_order=new.display_order where module_id=new.id;
 end if;return new;
end $$;
create trigger studio_class_order after update of display_order on public.course_modules for each row execute function public.studio_sync_class_order();

create function public.studio_attach_upload(target_course uuid,target_lesson uuid,object_path text,kind text,label text default null)
returns void language plpgsql security definer set search_path=public as $$
declare v uuid; object_metadata jsonb; bucket_name text; byte_limit bigint;
begin
 perform 1 from public.courses where id=target_course for update;
 if not coalesce(public.studio_can_edit_course(target_course),false) then raise exception 'Course is read-only or access was denied'; end if;
 select l.version_id into v from public.course_lessons l join public.course_versions cv on cv.id=l.version_id where l.id=target_lesson and l.course_id=target_course and l.status<>'archived' and cv.status='draft';
 if v is null then raise exception 'Class not found in this draft'; end if;
 if kind not in ('video','resource') then raise exception 'Unsupported upload'; end if;
 bucket_name:=case kind when 'video' then 'course-media' else 'course-resources' end;
 byte_limit:=case kind when 'video' then 104857600 else 52428800 end;
 if object_path not like target_course::text||'/'||target_lesson::text||'/%' or object_path like '%..%' then raise exception 'Invalid upload path'; end if;
 select metadata into object_metadata from storage.objects where bucket_id=bucket_name and name=object_path;
 if object_metadata is null or coalesce((object_metadata->>'size')::bigint,0) not between 1 and byte_limit then raise exception 'Upload is missing or exceeds the size limit'; end if;
 if kind='video' then
  if object_metadata->>'mimetype'<>'video/mp4' then raise exception 'Choose an MP4 video'; end if;
  insert into public.lesson_content_blocks(lesson_id,block_type,content,display_order,visibility,status)
  values(target_lesson,'video',jsonb_build_object('bucket',bucket_name,'path',object_path),1,'learner','active')
  on conflict(lesson_id,display_order) do update set block_type='video',content=excluded.content,status='active';
 else
  if nullif(trim(label),'') is null or length(label)>200 then raise exception 'Enter a resource title'; end if;
  if object_metadata->>'mimetype' not in ('application/pdf','application/vnd.openxmlformats-officedocument.presentationml.presentation','image/png','image/jpeg') then raise exception 'Unsupported resource file'; end if;
  insert into public.course_resources(course_id,lesson_id,title,resource_type,file_path,file_size_bytes,owner_id,copyright_declaration,metadata)
  values(target_course,target_lesson,trim(label),'practice_file',object_path,(object_metadata->>'size')::bigint,auth.uid(),'permission_granted',jsonb_build_object('bucket',bucket_name,'version_id',v));
 end if;
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,new_data,success)
 select auth.uid(),'studio_upload_'||kind,'course',c.id::text,c.owning_workspace_id,jsonb_build_object('lesson_id',target_lesson,'path',object_path),true from public.courses c where c.id=target_course;
end $$;
revoke all on function public.studio_attach_upload(uuid,uuid,text,text,text) from public,anon;
grant execute on function public.studio_attach_upload(uuid,uuid,text,text,text) to authenticated;

create or replace function public.create_course_review(target_course_id uuid,actor uuid,change_summary text default null)
returns uuid language plpgsql security definer set search_path=public as $$
declare review uuid;
begin
 if auth.uid() is null or actor<>auth.uid() then raise exception 'Access denied'; end if;
 perform public.studio_command(target_course_id,'submit','{}');
 select id into review from public.course_reviews where course_id=target_course_id order by created_at desc limit 1;
 return review;
end $$;
alter function public.publish_course_version(uuid,uuid,uuid,text) rename to publish_course_version_internal;
revoke all on function public.publish_course_version_internal(uuid,uuid,uuid,text) from public,anon,authenticated,service_role;
create function public.publish_course_version(target_course_id uuid,target_version_id uuid,actor uuid,reason text default null)
returns void language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is null or actor<>auth.uid() or not public.current_user_has_permission('settings.manage.platform') or not public.current_user_has_permission('course.publish.assigned') then raise exception 'Publication permission required'; end if;
 perform public.publish_course_version_internal(target_course_id,target_version_id,actor,reason);
end $$;
revoke all on function public.publish_course_version(uuid,uuid,uuid,text) from public,anon;
grant execute on function public.publish_course_version(uuid,uuid,uuid,text) to authenticated;
end $migration$;
