-- One-time owner-authorized binding to Timothy's existing account; no password changes.
do $$
declare target uuid; platform uuid; assignment record;
begin
  select id into target from auth.users where id='7161f4bc-8119-4f0f-9448-6dc4f8e5869b' and lower(email)='timsila18@gmail.com';
  if target is null then raise exception 'Expected existing Timothy account was not found'; end if;
  insert into public.platform_founder(singleton,user_id) values(true,target) on conflict(singleton) do nothing;
  if not exists(select 1 from public.platform_founder where user_id=target) then raise exception 'A different founding account is already bound'; end if;
  perform public.bootstrap_founding_super_admin('timsila18@gmail.com');
  select id into platform from public.workspaces where slug='platform-administration';
  for assignment in select a.id,a.user_id,r.slug from public.user_role_assignments a join public.roles r on r.id=a.role_id
    where a.workspace_id=platform and a.status='active' and r.slug in ('learner','instructor','academy-owner','organization-administrator') loop
    update public.user_role_assignments set status='revoked' where id=assignment.id;
    insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,reason,success)
    values(target,'misplaced_role_revoked','user_role_assignment',assignment.id::text,platform,'Role belongs in a personal, teaching, academy, or organization workspace',true);
  end loop;
end $$;
