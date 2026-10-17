-- Keep provisioning atomic, but expose it only through an authenticated review.
do $migration$ begin
alter function public.approve_academy_application(uuid, uuid, text)
  rename to provision_approved_academy_internal;
revoke all on function public.provision_approved_academy_internal(uuid, uuid, text) from public, anon, authenticated, service_role;

create function public.approve_academy_application(application_id uuid, reviewer uuid, review_note text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare app public.academy_applications%rowtype;
begin
  if auth.uid() is null or reviewer is distinct from auth.uid()
    or not public.current_user_has_permission('application.review.platform') then
    raise exception 'Application review permission required.';
  end if;
  select * into app from public.academy_applications where id = application_id for update;
  if app.id is null or app.status not in ('submitted', 'under_review', 'changes_requested') then
    raise exception 'Application is not awaiting review.';
  end if;
  if exists (select 1 from public.academies where slug = app.slug)
    or exists (select 1 from public.workspaces where slug = 'academy-' || app.slug) then
    raise exception 'Academy address is already in use.';
  end if;
  return public.provision_approved_academy_internal(application_id, reviewer, review_note);
end;
$$;
revoke all on function public.approve_academy_application(uuid, uuid, text) from public, anon;
grant execute on function public.approve_academy_application(uuid, uuid, text) to authenticated;

create function public.review_academy_application(application_id uuid, decision text, review_note text default null)
returns void language plpgsql security definer set search_path = public as $$
declare app public.academy_applications%rowtype; next_status text;
begin
  if auth.uid() is null or not public.current_user_has_permission('application.review.platform') then
    raise exception 'Application review permission required.';
  end if;
  if decision not in ('approve', 'reject', 'request_changes') or decision is null
    or length(coalesce(review_note, '')) > 5000 then
    raise exception 'Invalid review decision.';
  end if;
  if decision = 'approve' then
    perform public.approve_academy_application(application_id, auth.uid(), review_note);
    return;
  end if;
  if nullif(trim(review_note), '') is null then raise exception 'A reason is required.'; end if;
  select * into app from public.academy_applications where id = application_id for update;
  if app.id is null or app.status not in ('submitted', 'under_review', 'changes_requested') then
    raise exception 'Application is not awaiting review.';
  end if;
  next_status := case decision when 'reject' then 'rejected' else 'changes_requested' end;
  update public.academy_applications set status = next_status, reviewer_id = auth.uid(),
    review_notes = review_note, reviewed_at = now() where id = application_id;
  update public.review_queue set status = next_status, assigned_to = auth.uid(), notes = review_note
    where resource_type = 'academy_application' and resource_id = application_id;
  insert into public.audit_logs(actor_id, action, resource_type, resource_id, reason, success)
    values(auth.uid(), 'academy_application_' || next_status, 'academy_application', application_id::text, review_note, true);
  perform public.notify_user(app.applicant_id, 'application_' || next_status,
    case decision when 'reject' then 'Academy application rejected' else 'Academy application needs changes' end,
    review_note, 'academy_application', application_id::text);
end;
$$;
revoke all on function public.review_academy_application(uuid, text, text) from public, anon;
grant execute on function public.review_academy_application(uuid, text, text) to authenticated;
end $migration$;
