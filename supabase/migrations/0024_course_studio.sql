do $migration$ begin
create table public.course_studio_templates (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null,
  course_type_id uuid references public.course_types(id), defaults jsonb not null default '{}',
  is_active boolean not null default true, display_order integer not null default 0
);
insert into public.course_studio_templates(slug,name,course_type_id,display_order)
select t.slug,t.name,t.id,row_number() over(order by t.name)::integer from public.course_types t
where t.status='active' and t.slug in ('self-paced','masterclass','short-course','workshop');
create table public.course_studio_settings (
  course_id uuid primary key references public.courses(id) on delete cascade,
  template_id uuid references public.course_studio_templates(id),
  sell_classes boolean not null default false,
  default_class_price_minor integer not null default 0 check(default_class_price_minor>=0)
);
insert into public.course_studio_settings(course_id,sell_classes,default_class_price_minor)
select c.id,exists(select 1 from public.episode_products e where e.course_id=c.id),
  coalesce((select p.amount_minor from public.episode_products e join public.product_prices p on p.product_id=e.product_id where e.course_id=c.id and p.status='active' order by p.created_at desc limit 1),0)
from public.courses c;

create function public.studio_workspace_allowed(workspace uuid, subject uuid default auth.uid())
returns boolean language sql stable security definer set search_path=public as $$
  select (subject=auth.uid() or auth.role()='service_role') and exists(
    select 1 from public.workspaces w join public.workspace_members m on m.workspace_id=w.id and m.user_id=subject and m.status='active'
    join public.profiles pr on pr.id=subject and pr.account_status='active'
    where w.id=workspace and w.status='active' and w.type in ('academy','tutor','organization')
    and (w.type<>'academy' or exists(select 1 from public.academies a where a.workspace_id=w.id and a.status not in ('suspended','archived','closed','restricted')))
    and (w.owner_id=subject or exists(select 1 from public.user_role_assignments r
      join public.roles role on role.id=r.role_id and role.is_active
      join public.role_permissions rp on rp.role_id=r.role_id join public.permissions p on p.id=rp.permission_id
      where r.user_id=subject and r.workspace_id=w.id and r.status='active' and r.starts_at<=now()
        and (r.expires_at is null or r.expires_at>now()) and p.code='course.create.own')));
$$;
create function public.studio_can_read_course(target_course_id uuid, subject uuid default auth.uid())
returns boolean language sql stable security definer set search_path=public as $$
 select (subject=auth.uid() or auth.role()='service_role') and exists(select 1 from public.courses c
  where c.id=target_course_id and c.owner_id=subject and public.studio_workspace_allowed(c.owning_workspace_id,subject));
$$;
create function public.studio_can_edit_course(target_course_id uuid, subject uuid default auth.uid())
returns boolean language sql stable security definer set search_path=public as $$
 select public.studio_can_read_course(target_course_id,subject) and exists(select 1 from public.courses c where c.id=target_course_id
  and c.status in ('draft','in_development','changes_requested') and c.published_version_id is null
  and exists(select 1 from public.course_versions v where v.course_id=c.id and v.status='draft')
  and not exists(select 1 from public.course_versions v where v.course_id=c.id and v.published_at is not null)
  and not exists(select 1 from public.enrollments e where e.course_id=c.id)
  and not exists(select 1 from public.episode_entitlements e where e.course_id=c.id)
  and not exists(select 1 from public.order_items o where o.course_id=c.id));
$$;
alter table public.course_studio_templates enable row level security;
alter table public.course_studio_settings enable row level security;
create policy studio_templates_read on public.course_studio_templates for select to authenticated using(is_active or public.current_user_has_permission('settings.manage.platform'));
create policy studio_templates_admin on public.course_studio_templates for all to authenticated using(public.current_user_has_permission('settings.manage.platform')) with check(public.current_user_has_permission('settings.manage.platform'));
create policy studio_settings_read on public.course_studio_settings for select to authenticated using(public.studio_can_read_course(course_id));

create function public.studio_price_internal(target_course uuid,target_lesson uuid,amount integer)
returns void language plpgsql security definer set search_path=public as $$
declare product uuid; v uuid; label text; enabled boolean;
begin
 if amount<0 or amount>100000000 then raise exception 'Invalid price'; end if;
 select title into label from public.courses where id=target_course;
 if target_lesson is null then
  select product_id into product from public.course_products where course_id=target_course limit 1;
  enabled:=true;
 else
  select title,version_id into label,v from public.course_lessons where id=target_lesson and course_id=target_course;
  select product_id into product from public.episode_products where course_id=target_course and lesson_id=target_lesson and version_id=v;
  select sell_classes into enabled from public.course_studio_settings where course_id=target_course;
 end if;
 if product is null then
  insert into public.products(product_type,name,status) values('course',label,'active') returning id into product;
  if target_lesson is null then insert into public.course_products(course_id,product_id) values(target_course,product);
  else insert into public.episode_products(product_id,course_id,lesson_id,version_id) values(product,target_course,target_lesson,v); end if;
 end if;
 if exists(select 1 from public.product_prices where product_id=product and status='active' and amount_minor=amount and currency='KES') then
  update public.product_prices set enrollment_available=coalesce(enabled,false) where product_id=product and status='active'; return;
 end if;
 update public.product_prices set status='inactive' where product_id=product and status='active';
 insert into public.product_prices(product_id,amount_minor,currency,status,enrollment_available) values(product,amount,'KES','active',coalesce(enabled,false));
end $$;
revoke all on function public.studio_price_internal(uuid,uuid,integer) from public,anon,authenticated,service_role;

create function public.studio_add_class_internal(target_course uuid,title_text text)
returns uuid language plpgsql security definer set search_path=public as $$
declare v uuid; m uuid; l uuid; position integer; settings public.course_studio_settings%rowtype;
begin
 if length(trim(title_text))<3 or length(title_text)>200 then raise exception 'Class titles must contain 3 to 200 characters'; end if;
 select id into v from public.course_versions where course_id=target_course and status='draft' order by version_number desc limit 1;
 select coalesce(max(display_order),0)+1 into position from public.course_modules where course_id=target_course and version_id=v;
 insert into public.course_modules(course_id,version_id,title,display_order,required) values(target_course,v,trim(title_text),position,true) returning id into m;
 insert into public.course_lessons(course_id,module_id,version_id,title,slug,lesson_type,display_order,required)
 values(target_course,m,v,trim(title_text),'class-'||gen_random_uuid()::text,'video',position,true) returning id into l;
 select * into settings from public.course_studio_settings where course_id=target_course;
 if settings.sell_classes then perform public.studio_price_internal(target_course,l,settings.default_class_price_minor); end if;
 return l;
end $$;
revoke all on function public.studio_add_class_internal(uuid,text) from public,anon,authenticated,service_role;

create function public.studio_command(target_course uuid,command text,payload jsonb default '{}')
returns jsonb language plpgsql security definer set search_path=public as $$
declare c public.courses%rowtype; lesson public.course_lessons%rowtype; other public.course_modules%rowtype;
 template public.course_studio_templates%rowtype; workspace public.workspaces%rowtype; academy uuid;
 v uuid; l uuid; m public.course_modules%rowtype; t text; position integer; question uuid; quiz uuid; assessment uuid; idx integer; option_text text;
begin
 if auth.uid() is null or jsonb_typeof(payload)<>'object' then raise exception 'Sign in to use Course Studio'; end if;
 if command='create' then
  select * into workspace from public.workspaces where id=(payload->>'workspaceId')::uuid for update;
  if not public.studio_workspace_allowed(workspace.id) then raise exception 'Workspace access denied'; end if;
  select * into template from public.course_studio_templates where id=(payload->>'templateId')::uuid and is_active;
  if template.id is null then raise exception 'Choose an available template'; end if;
  select id into academy from public.academies where workspace_id=workspace.id;
  if length(trim(payload->>'title')) not between 3 and 200 or length(trim(payload->>'description')) not between 20 and 5000 then raise exception 'Check the course title and description'; end if;
  if not exists(select 1 from public.schools where id=(payload->>'schoolId')::uuid and status in ('active','published')) then raise exception 'Choose an available school'; end if;
  if not exists(select 1 from public.course_levels where id=(payload->>'levelId')::uuid and status='active') then raise exception 'Choose an available level'; end if;
  insert into public.courses(owning_workspace_id,owner_id,academy_id,title,slug,subtitle,short_description,school_id,course_type_id,level_id,language,target_learner,prerequisites,status,visibility,enrollment_status)
  values(workspace.id,auth.uid(),academy,trim(payload->>'title'),trim(both '-' from regexp_replace(lower(payload->>'title'),'[^a-z0-9]+','-','g'))||'-'||substr(gen_random_uuid()::text,1,8),payload->>'subtitle',trim(payload->>'description'),(payload->>'schoolId')::uuid,template.course_type_id,(payload->>'levelId')::uuid,coalesce(nullif(payload->>'language',''),'en'),payload->>'audience',payload->>'prerequisites','draft','private','closed') returning * into c;
  insert into public.course_versions(course_id,version_number,status,created_by) values(c.id,1,'draft',auth.uid()) returning id into v;
  insert into public.course_team_members(course_id,user_id,role_label,role_slug) values(c.id,auth.uid(),'Course Owner','course-owner');
  insert into public.course_studio_settings(course_id,template_id,sell_classes,default_class_price_minor)
  values(c.id,template.id,coalesce((payload->>'sellClasses')::boolean,false),coalesce((payload->>'classPriceMinor')::integer,0));
  perform public.studio_price_internal(c.id,null,coalesce((payload->>'coursePriceMinor')::integer,0));
 else
  select * into c from public.courses where id=target_course for update;
  if not coalesce(public.studio_can_edit_course(c.id),false) then raise exception 'Course is read-only or access was denied'; end if;
  select id into v from public.course_versions where course_id=c.id and status='draft' order by version_number desc limit 1;
 end if;
 if command in ('create','add') then
  if jsonb_typeof(payload->'titles')<>'array' or jsonb_array_length(payload->'titles')>100 then raise exception 'Add up to 100 class titles at a time'; end if;
  for t in select value from jsonb_array_elements_text(payload->'titles') loop l:=public.studio_add_class_internal(c.id,t); end loop;
 elsif command='details' then
  if length(trim(payload->>'title')) not between 3 and 200 or length(trim(payload->>'description')) not between 20 and 5000 then raise exception 'Check the course title and description'; end if;
  if not exists(select 1 from public.schools where id=(payload->>'schoolId')::uuid and status in ('active','published')) then raise exception 'Choose an available school'; end if;
  if not exists(select 1 from public.course_levels where id=(payload->>'levelId')::uuid and status='active') then raise exception 'Choose an available level'; end if;
  update public.courses set title=trim(payload->>'title'),subtitle=payload->>'subtitle',short_description=trim(payload->>'description'),school_id=(payload->>'schoolId')::uuid,level_id=(payload->>'levelId')::uuid,language=coalesce(nullif(payload->>'language',''),'en'),target_learner=payload->>'audience',prerequisites=payload->>'prerequisites' where id=c.id;
  update public.course_studio_settings set sell_classes=coalesce((payload->>'sellClasses')::boolean,false),default_class_price_minor=coalesce((payload->>'classPriceMinor')::integer,0) where course_id=c.id;
  perform public.studio_price_internal(c.id,null,coalesce((payload->>'coursePriceMinor')::integer,0));
  update public.product_prices set enrollment_available=coalesce((payload->>'sellClasses')::boolean,false)
    where product_id in(select product_id from public.episode_products where course_id=c.id) and status='active';
 elsif command in ('edit','duplicate','move_up','move_down','remove','restore') then
  select * into lesson from public.course_lessons where id=(payload->>'lessonId')::uuid and course_id=c.id and version_id=v for update;
  if lesson.id is null then raise exception 'Class not found in this draft'; end if;
  select * into m from public.course_modules where id=lesson.module_id;
  l:=lesson.id;
  if command='edit' then
   if length(trim(payload->>'title')) not between 3 and 200 then raise exception 'Check the class title'; end if;
   update public.course_lessons set title=trim(payload->>'title'),short_summary=left(payload->>'summary',5000),learning_objective=left(payload->>'outcomes',10000),learner_instructions=left(payload->>'exercise',10000),estimated_duration_minutes=greatest(0,coalesce((payload->>'minutes')::integer,0)) where id=lesson.id;
   if (select count(*) from public.course_lessons where module_id=m.id)=1 then update public.course_modules set title=trim(payload->>'title'),description=payload->>'summary',learning_objectives=payload->>'outcomes' where id=m.id; end if;
   perform public.studio_price_internal(c.id,l,coalesce((payload->>'priceMinor')::integer,0));
  elsif command='duplicate' then
   l:=public.studio_add_class_internal(c.id,left(lesson.title,190)||' (copy)');
   update public.course_lessons set short_summary=lesson.short_summary,learning_objective=lesson.learning_objective,learner_instructions=lesson.learner_instructions,estimated_duration_minutes=lesson.estimated_duration_minutes where id=l;
  elsif command in ('remove','restore') then
   update public.course_lessons set status=case command when 'remove' then 'archived' else 'draft' end where id=l;
   if not exists(select 1 from public.course_lessons where module_id=m.id and status<>'archived') then update public.course_modules set status='archived' where id=m.id;
   elsif command='restore' then update public.course_modules set status='draft' where id=m.id; end if;
   update public.product_prices set enrollment_available=(command='restore' and (select sell_classes from public.course_studio_settings where course_id=c.id)) where product_id in(select product_id from public.episode_products where lesson_id=l) and status='active';
  else
   if (select count(*) from public.course_lessons where module_id=m.id and status<>'archived')<>1 then raise exception 'Grouped modules must be reordered together'; end if;
   if command='move_up' then select * into other from public.course_modules where course_id=c.id and version_id=v and status<>'archived' and display_order<m.display_order order by display_order desc limit 1;
   else select * into other from public.course_modules where course_id=c.id and version_id=v and status<>'archived' and display_order>m.display_order order by display_order limit 1; end if;
   if other.id is not null then
    select coalesce(max(display_order),0)+1 into position from public.course_modules where course_id=c.id and version_id=v;
    update public.course_modules set display_order=position where id=m.id;
    update public.course_modules set display_order=m.display_order where id=other.id;
    update public.course_modules set display_order=other.display_order where id=m.id;
   end if;
  end if;
 elsif command='question_save' then
  select * into lesson from public.course_lessons where id=(payload->>'lessonId')::uuid and course_id=c.id and version_id=v and status<>'archived';
  if lesson.id is null then raise exception 'Class not found'; end if;
  if length(trim(payload->>'prompt'))<5 or jsonb_typeof(payload->'options')<>'array' or jsonb_array_length(payload->'options')<>4 or (payload->>'correct')::integer not between 0 and 3 then raise exception 'Check the question and answer options'; end if;
  if nullif(payload->>'questionId','') is not null then
   select q.id,q.quiz_id into question,quiz from public.quiz_questions q join public.quizzes z on z.id=q.quiz_id join public.assessments a on a.id=z.assessment_id where q.id=(payload->>'questionId')::uuid and a.course_id=c.id and a.lesson_id=lesson.id and a.status='draft';
   if question is null then raise exception 'Question not found in this draft'; end if;
   update public.quiz_questions set prompt=payload->>'prompt',explanation=payload->>'explanation' where id=question;
   delete from public.quiz_question_options where question_id=question;
  else
   select z.id into quiz from public.quizzes z join public.assessments a on a.id=z.assessment_id where a.lesson_id=lesson.id and a.course_id=c.id and a.status='draft' and a.stakes='practice' order by a.created_at limit 1;
   if quiz is null then
    insert into public.assessments(course_id,module_id,lesson_id,assessment_type,title,stakes,status) values(c.id,lesson.module_id,lesson.id,'quiz',lesson.title||' - Knowledge check','practice','draft') returning id into assessment;
    insert into public.quizzes(assessment_id,instructions,show_correct_answers) values(assessment,'Choose one answer for each question.',true) returning id into quiz;
   end if;
   select coalesce(max(display_order),0)+1 into position from public.quiz_questions where quiz_id=quiz;
   insert into public.quiz_questions(quiz_id,prompt,question_type,explanation,display_order) values(quiz,payload->>'prompt','single_choice',payload->>'explanation',position) returning id into question;
  end if;
  idx:=0;
  for option_text in select value from jsonb_array_elements_text(payload->'options') loop
   if length(trim(option_text))<1 then raise exception 'Every option needs text'; end if;
   insert into public.quiz_question_options(question_id,option_text,is_correct,display_order) values(question,option_text,idx=(payload->>'correct')::integer,idx+1); idx:=idx+1;
  end loop;
  l:=lesson.id;
 elsif command='question_remove' then
  update public.quiz_questions q set status='archived' from public.quizzes z,public.assessments a
    where q.id=(payload->>'questionId')::uuid and z.id=q.quiz_id and a.id=z.assessment_id and a.course_id=c.id and a.status='draft';
 elsif command='submit' then
  if not exists(select 1 from public.course_lessons where course_id=c.id and version_id=v and status<>'archived') then raise exception 'Add at least one class'; end if;
  if exists(select 1 from public.course_lessons l where l.course_id=c.id and l.version_id=v and l.status<>'archived' and
    (nullif(trim(l.learning_objective),'') is null or (l.lesson_type='video' and not exists(select 1 from public.lesson_content_blocks b where b.lesson_id=l.id and b.block_type='video' and b.status='active' and b.content->>'bucket'='course-media' and b.content->>'path' like c.id::text||'/'||l.id::text||'/%')))) then raise exception 'Every class needs learning outcomes and every video class needs its recording'; end if;
  update public.course_versions set status='under_review',frozen_at=now(),change_summary='Submitted through Course Studio' where id=v;
  update public.courses set status='submitted_review' where id=c.id;
  insert into public.course_reviews(course_id,version_id,submitted_by) values(c.id,v,auth.uid());
 else raise exception 'Unknown Studio command';
 end if;
 update public.courses set updated_at=now() where id=c.id;
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,new_data,success)
 values(auth.uid(),'studio_'||command,'course',c.id::text,c.owning_workspace_id,jsonb_build_object('lesson_id',l),true);
 return jsonb_build_object('courseId',c.id,'lessonId',l);
end $$;
revoke all on function public.studio_command(uuid,text,jsonb) from public,anon;
grant execute on function public.studio_command(uuid,text,jsonb) to authenticated;
create or replace function public.can_edit_course_delivery(target_course_id uuid)
returns boolean language sql stable security definer set search_path=public as $$ select public.studio_can_edit_course(target_course_id); $$;
create policy studio_course_insert_guard on public.courses as restrictive for insert to authenticated with check(public.studio_workspace_allowed(owning_workspace_id));
create policy studio_course_update_guard on public.courses as restrictive for update to authenticated
using(public.studio_can_edit_course(id)) with check(owner_id=auth.uid() and public.studio_workspace_allowed(owning_workspace_id) and status in ('draft','in_development','changes_requested') and published_version_id is null);
end $migration$;
