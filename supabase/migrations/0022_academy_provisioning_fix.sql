create or replace function public.provision_approved_academy_internal(application_id uuid, reviewer uuid, review_note text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  app public.academy_applications%rowtype;
  v_workspace_id uuid;
  v_academy_id uuid;
  v_role_id uuid;
  v_member_id uuid;
begin
  select * into app from public.academy_applications where id = application_id for update;
  if app.id is null then raise exception 'Academy application not found.'; end if;
  select id into v_role_id from public.roles where slug='academy-owner' and is_active;
  if v_role_id is null then raise exception 'Academy owner role is unavailable.'; end if;

  insert into public.workspaces(name,slug,type,owner_id,status)
    values(app.academy_name,'academy-' || app.slug,'academy',app.applicant_id,'active') returning id into v_workspace_id;
  insert into public.academies(name,slug,description,owner_id,workspace_id,status,visibility,logo_path,banner_path)
    values(app.academy_name,app.slug,app.short_description,app.applicant_id,v_workspace_id,'draft','private',app.logo_path,app.banner_path)
    returning id into v_academy_id;
  insert into public.academy_branding(academy_id,website,public_visibility,accent_color)
    values(v_academy_id,app.website,'private','#0066FF');
  insert into public.workspace_members(workspace_id,user_id,status,joined_at)
    values(v_workspace_id,app.applicant_id,'active',now()) returning id into v_member_id;
  insert into public.user_role_assignments(user_id,role_id,workspace_id,scope,assigned_by,reason)
    values(app.applicant_id,v_role_id,v_workspace_id,'academy',reviewer,'academy application approved');
  insert into public.academy_members(academy_id,workspace_member_id,role_label,status)
    values(v_academy_id,v_member_id,'Academy Owner','active');
  update public.academy_applications set status='approved',reviewer_id=reviewer,review_notes=review_note,reviewed_at=now()
    where id=application_id;
  update public.review_queue set status='approved',assigned_to=reviewer,notes=review_note
    where resource_type='academy_application' and resource_id=application_id;
  perform public.notify_user(app.applicant_id,'application_approved','Academy approved','Your academy workspace has been created.','academy',v_academy_id::text);
  insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,reason,success)
    values(reviewer,'academy_application_approved','academy_application',application_id::text,v_workspace_id,review_note,true);
  return v_academy_id;
end;
$$;
