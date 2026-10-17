do $$
declare c public.courses%rowtype; total integer;
begin
  select * into c from public.courses where slug='hr-practice-from-a-to-z';
  if c.id is null or c.status <> 'draft' or c.visibility <> 'private' or c.enrollment_status <> 'closed' or c.published_version_id is not null then
    raise exception 'Masterclass must be an unpublished private draft with enrollment closed';
  end if;
  if not exists(select 1 from public.academies a where a.id=c.academy_id and a.owner_id=c.owner_id and a.workspace_id=c.owning_workspace_id and a.slug='solva-hr-academy') then
    raise exception 'Academy ownership mismatch';
  end if;
  select count(*) into total from public.course_lessons where course_id=c.id and lesson_type='video' and nullif(learning_objective,'') is not null and nullif(learner_instructions,'') is not null;
  if total<>16 then raise exception 'Expected 16 prepared video classes, received %',total; end if;
  select count(*) into total from public.course_modules where course_id=c.id;
  if total<>16 then raise exception 'Expected 16 ordered modules'; end if;
  select count(*) into total from public.course_learning_outcomes where course_id=c.id;
  if total<>16 then raise exception 'Expected class learning outcomes'; end if;
  select count(*) into total from public.episode_products e join public.product_prices p on p.product_id=e.product_id
    where e.course_id=c.id and p.amount_minor=100000 and p.currency='KES' and p.status='active';
  if total<>16 then raise exception 'Expected 16 individual class prices of KSh 1000'; end if;
  if not exists(select 1 from public.course_products cp join public.product_prices p on p.product_id=cp.product_id
    where cp.course_id=c.id and p.amount_minor=1600000 and p.currency='KES' and p.status='active') then
    raise exception 'Full programme price missing';
  end if;
  if not exists(select 1 from public.course_resources where course_id=c.id and resource_type='presentation' and visibility='private') then
    raise exception 'Private presentation resource missing';
  end if;
  perform set_config('request.jwt.claim.sub',c.owner_id::text,true);
  if not exists(select 1 from public.user_role_assignments r join public.roles role on role.id=r.role_id
    where r.user_id=c.owner_id and r.workspace_id=c.owning_workspace_id and role.slug='academy-owner' and r.status='active') then
    raise exception 'Academy owner access missing';
  end if;
end $$;
