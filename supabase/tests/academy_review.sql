do $$
declare founder uuid; app uuid; target uuid; denied boolean;
begin
  select user_id into founder from public.platform_founder;
  if has_function_privilege('authenticated', 'public.provision_approved_academy_internal(uuid,uuid,text)', 'execute')
    or has_function_privilege('anon', 'public.review_academy_application(uuid,text,text)', 'execute') then
    raise exception 'Review function privileges are unsafe';
  end if;
  -- This subtransaction rolls back every test record and notification.
  begin
    insert into public.academy_applications(applicant_id, academy_name, slug, short_description, why_teach, expected_audience, terms_accepted, status, submitted_at)
      values(founder, 'Temporary review test', 'review-test-' || gen_random_uuid(), 'Review test description', 'Review testing', 'Testing', true, 'submitted', now()) returning id into app;
    perform set_config('request.jwt.claim.sub', '', true);
    denied := false;
    begin
      perform public.review_academy_application(app, 'approve');
    exception when others then denied := sqlerrm like '%permission required%'; end;
    if not denied then raise exception 'Unauthenticated approval was allowed'; end if;
    perform set_config('request.jwt.claim.sub', founder::text, true);
    denied := false;
    begin
      perform public.approve_academy_application(app, gen_random_uuid());
    exception when others then denied := sqlerrm like '%permission required%'; end;
    if not denied then raise exception 'Reviewer spoofing was allowed'; end if;
    perform public.review_academy_application(app, 'request_changes', 'Please clarify the audience');
    if not exists(select 1 from public.academy_applications where id=app and status='changes_requested')
      or not exists(select 1 from public.review_queue where resource_id=app and status='changes_requested') then
      raise exception 'Change request did not update application and queue';
    end if;
    perform public.review_academy_application(app, 'approve', 'Test approval');
    select a.id into target from public.academies a join public.academy_applications p on p.slug=a.slug where p.id=app;
    if target is null or not exists(select 1 from public.academy_applications where id=app and status='approved') then
      raise exception 'Approved academy was not provisioned';
    end if;
    if not exists(select 1 from public.academies a join public.user_role_assignments r on r.workspace_id=a.workspace_id
      join public.roles role on role.id=r.role_id where a.id=target and r.user_id=founder and role.slug='academy-owner' and r.scope='academy') then
      raise exception 'Scoped academy ownership missing';
    end if;
    if not exists(select 1 from public.audit_logs where resource_id=app::text and action='academy_application_approved') then
      raise exception 'Approval audit missing';
    end if;
    denied := false;
    begin
      perform public.review_academy_application(app, 'approve');
    exception when others then denied := sqlerrm like '%not awaiting review%'; end;
    if not denied then raise exception 'Duplicate approval was allowed'; end if;
    raise exception using errcode='Z0001', message='Rollback successful review test';
  exception when sqlstate 'Z0001' then null;
  end;
end $$;
