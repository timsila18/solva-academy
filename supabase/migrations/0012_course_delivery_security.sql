do $migration$ begin

alter table public.account_statuses enable row level security;
create policy account_statuses_read on public.account_statuses for select using (true);

create or replace function public.can_edit_course_delivery(target_course_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.courses c where c.id = target_course_id
    and c.owner_id = auth.uid() and c.status not in ('published','suspended','archived'));
$$;

-- Existing permissive metadata policies must never authorize curriculum writes.
do $$
declare t text;
begin
  foreach t in array array['course_versions','course_modules','course_lessons','course_learning_outcomes','course_resources','course_categories','course_skills','course_target_learners','course_completion_rules'] loop
    execute format('create policy delivery_insert_guard on public.%I as restrictive for insert to authenticated with check (public.can_edit_course_delivery(course_id))', t);
    execute format('create policy delivery_update_guard on public.%I as restrictive for update to authenticated using (public.can_edit_course_delivery(course_id)) with check (public.can_edit_course_delivery(course_id))', t);
    execute format('create policy delivery_delete_guard on public.%I as restrictive for delete to authenticated using (public.can_edit_course_delivery(course_id))', t);
  end loop;
end $$;

create policy lesson_content_read_guard on public.lesson_content_blocks as restrictive for select using (
  exists (select 1 from public.course_lessons l join public.courses c on c.id = l.course_id
    where l.id = lesson_id and (
      c.owner_id = auth.uid()
      or public.current_user_has_permission('settings.manage.platform')
      or (lesson_content_blocks.visibility = 'learner' and exists (
        select 1 from public.enrollments e join public.entitlements ent on ent.id = e.entitlement_id
        where e.course_id = c.id and e.learner_id = auth.uid()
          and e.course_version_id = l.version_id
          and e.status in ('active','not_started','in_progress','completed')
          and (e.access_ends_at is null or e.access_ends_at > now())
          and ent.status = 'active' and (ent.ends_at is null or ent.ends_at > now())
      ))
    ))
);
create policy lesson_content_insert_guard on public.lesson_content_blocks as restrictive for insert to authenticated with check (
  exists (select 1 from public.course_lessons l where l.id = lesson_id and public.can_edit_course_delivery(l.course_id)));
create policy lesson_content_update_guard on public.lesson_content_blocks as restrictive for update to authenticated using (
  exists (select 1 from public.course_lessons l where l.id = lesson_id and public.can_edit_course_delivery(l.course_id))) with check (
  exists (select 1 from public.course_lessons l where l.id = lesson_id and public.can_edit_course_delivery(l.course_id)));
create policy lesson_content_delete_guard on public.lesson_content_blocks as restrictive for delete to authenticated using (
  exists (select 1 from public.course_lessons l where l.id = lesson_id and public.can_edit_course_delivery(l.course_id)));

-- Money and entitlements are written by validated server paths only.
do $$
declare t text;
begin
  foreach t in array array['orders','order_items','payment_attempts','payment_callbacks','enrollments','entitlements'] loop
    execute format('create policy commerce_insert_guard on public.%I as restrictive for insert to authenticated with check (false)', t);
    execute format('create policy commerce_update_guard on public.%I as restrictive for update to authenticated using (false) with check (false)', t);
    execute format('create policy commerce_delete_guard on public.%I as restrictive for delete to authenticated using (false)', t);
  end loop;
end $$;
revoke execute on function public.complete_order_access(uuid,uuid) from public, anon, authenticated;
grant execute on function public.complete_order_access(uuid,uuid) to service_role;

end $migration$;
