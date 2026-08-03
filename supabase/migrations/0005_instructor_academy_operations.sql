create table if not exists public.earnings_ledger (
  id uuid primary key default gen_random_uuid(),
  beneficiary_user_id uuid references public.profiles(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  order_item_id uuid references public.order_items(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  entry_type text not null default 'sale' check (entry_type in ('sale','refund_adjustment','manual_adjustment','payout_hold','payout_release')),
  amount_minor integer not null,
  currency text not null default 'KES',
  gross_amount_minor integer not null default 0,
  platform_fee_minor integer not null default 0,
  tax_minor integer not null default 0,
  net_amount_minor integer not null default 0,
  status text not null default 'pending' check (status in ('pending','eligible','on_hold','paid','reversed','cancelled')),
  earned_at timestamptz not null default now(),
  eligible_at timestamptz,
  payout_request_id uuid,
  payout_reference text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.payout_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'KES',
  destination_label text not null,
  method text not null default 'manual',
  notes text,
  supporting_information jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','submitted','under_review','clarification_requested','approved','rejected','paid','cancelled')),
  requested_at timestamptz,
  decided_by uuid references public.profiles(id),
  decided_at timestamptz,
  decision_reason text,
  payment_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.earnings_ledger
  add constraint earnings_ledger_payout_fk foreign key (payout_request_id) references public.payout_requests(id) on delete set null;

create table if not exists public.payout_request_events (
  id uuid primary key default gen_random_uuid(),
  payout_request_id uuid not null references public.payout_requests(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  from_status text,
  to_status text not null,
  reason text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.academy_policies (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid unique not null references public.academies(id) on delete cascade,
  internal_review_required boolean not null default true,
  course_branding_rules text,
  assessment_rules text,
  assignment_defaults jsonb not null default '{}',
  certificate_branding jsonb not null default '{}',
  refund_guidance text,
  communication_preferences jsonb not null default '{}',
  learner_conduct text,
  instructor_expectations text,
  visibility text not null default 'internal' check (visibility in ('internal','public')),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_storefront_settings (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid unique not null references public.academies(id) on delete cascade,
  headline text,
  description text,
  featured_course_ids uuid[] not null default '{}',
  featured_instructor_ids uuid[] not null default '{}',
  theme jsonb not null default '{}',
  contact_blocks jsonb not null default '[]',
  seo jsonb not null default '{}',
  show_instructors boolean not null default true,
  show_certificates boolean not null default true,
  public_visibility text not null default 'public' check (public_visibility in ('private','public','unlisted')),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instructor_public_profiles (
  id uuid primary key default gen_random_uuid(),
  instructor_profile_id uuid unique not null references public.instructor_profiles(id) on delete cascade,
  teaching_philosophy text,
  experience_summary text,
  public_contact jsonb not null default '{}',
  badges jsonb not null default '[]',
  profile_completion jsonb not null default '{}',
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learner_course_activity_summary (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid unique not null references public.enrollments(id) on delete cascade,
  learner_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  progress_percentage numeric(5,2) not null default 0,
  completed_lessons integer not null default 0,
  total_lessons integer not null default 0,
  assignments_submitted integer not null default 0,
  assignments_pending_review integer not null default 0,
  quiz_attempts integer not null default 0,
  last_activity_at timestamptz,
  risk_flags text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.grading_activity (
  id uuid primary key default gen_random_uuid(),
  grader_id uuid not null references public.profiles(id) on delete restrict,
  course_id uuid references public.courses(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete cascade,
  assignment_submission_id uuid references public.assignment_submissions(id) on delete cascade,
  quiz_attempt_answer_id uuid references public.quiz_attempt_answers(id) on delete cascade,
  activity_type text not null check (activity_type in ('assignment_feedback_drafted','assignment_grade_published','assignment_returned','quiz_score_drafted','quiz_score_published','private_note_added')),
  score numeric(8,2),
  max_score numeric(8,2),
  learner_feedback text,
  private_note text,
  status text not null default 'draft' check (status in ('draft','published','returned')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_quality_metrics (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  metric_date date not null default current_date,
  course_quality_score numeric(5,2),
  review_turnaround_hours numeric(8,2),
  assessment_turnaround_hours numeric(8,2),
  completion_rate numeric(5,2),
  certificate_rate numeric(5,2),
  content_freshness_days numeric(8,2),
  reviewer_comment_count integer not null default 0,
  data_source text not null default 'system',
  created_at timestamptz not null default now(),
  unique (academy_id, metric_date)
);

create table if not exists public.instructor_dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  metric_date date not null default current_date,
  published_courses integer not null default 0,
  draft_courses integer not null default 0,
  courses_under_review integer not null default 0,
  learners integer not null default 0,
  assignments_awaiting_review integer not null default 0,
  quiz_attempts integer not null default 0,
  certificates_issued integer not null default 0,
  gross_sales_minor integer not null default 0,
  net_earnings_minor integer not null default 0,
  pending_payout_minor integer not null default 0,
  computed_at timestamptz not null default now(),
  unique (instructor_id, metric_date)
);

create table if not exists public.academy_dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  metric_date date not null default current_date,
  published_courses integer not null default 0,
  draft_courses integer not null default 0,
  active_instructors integer not null default 0,
  learners integer not null default 0,
  assignments_awaiting_review integer not null default 0,
  certificates_issued integer not null default 0,
  gross_sales_minor integer not null default 0,
  net_revenue_minor integer not null default 0,
  pending_payout_minor integer not null default 0,
  computed_at timestamptz not null default now(),
  unique (academy_id, metric_date)
);

create table if not exists public.instructor_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.permissions (code, resource, action, scope, description) values
('finance_payout.manage.platform', 'finance_payout', 'manage', 'platform', 'Review, approve, reject, and mark payout requests as paid.'),
('payout.request.own', 'payout', 'request', 'own', 'Request payout for own eligible earnings.'),
('earnings.view.own', 'earnings', 'view', 'own', 'View own earnings ledger.'),
('academy_payout.request.academy', 'academy_payout', 'request', 'academy', 'Request payout for academy eligible earnings.'),
('academy_policy.manage.academy', 'academy_policy', 'manage', 'academy', 'Manage academy policies.'),
('academy_storefront.manage.academy', 'academy_storefront', 'manage', 'academy', 'Manage academy storefront settings.'),
('grading.manage.assigned', 'grading', 'manage', 'assigned', 'Review assigned learner assessments.'),
('learner.view.assigned', 'learner', 'view', 'assigned', 'View learners assigned through courses.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on
  (r.slug in ('tutor-instructor','teaching-assistant') and p.code in ('earnings.view.own','payout.request.own','grading.manage.assigned','learner.view.assigned'))
  or (r.slug in ('academy-owner','academy-administrator') and p.code in ('academy_payout.request.academy','academy_policy.manage.academy','academy_storefront.manage.academy','grading.manage.assigned','learner.view.assigned'))
  or (r.slug in ('academy-finance-manager') and p.code in ('academy_payout.request.academy','earnings.view.own'))
  or (r.slug in ('finance-officer','platform-administrator','super-admin','founding-super-admin') and p.code = 'finance_payout.manage.platform')
on conflict do nothing;

create or replace function public.current_user_teaches_course(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.courses c
    where c.id = target_course_id and c.owner_id = auth.uid()
  ) or exists (
    select 1 from public.course_team_members ctm
    where ctm.course_id = target_course_id and ctm.user_id = auth.uid() and ctm.status = 'active'
  );
$$;

create or replace function public.current_user_manages_academy(target_academy_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.academies a
    where a.id = target_academy_id and a.owner_id = auth.uid()
  ) or exists (
    select 1 from public.academy_members am
    join public.workspace_members wm on wm.id = am.workspace_member_id
    where am.academy_id = target_academy_id and wm.user_id = auth.uid() and am.status = 'active' and wm.status = 'active'
      and am.role_label in ('Academy Owner','Academy Admin','Finance Manager','Content Manager','Reviewer','Support Agent')
  );
$$;

alter table public.earnings_ledger enable row level security;
alter table public.payout_requests enable row level security;
alter table public.payout_request_events enable row level security;
alter table public.academy_policies enable row level security;
alter table public.academy_storefront_settings enable row level security;
alter table public.instructor_public_profiles enable row level security;
alter table public.learner_course_activity_summary enable row level security;
alter table public.grading_activity enable row level security;
alter table public.academy_quality_metrics enable row level security;
alter table public.instructor_dashboard_metrics enable row level security;
alter table public.academy_dashboard_metrics enable row level security;
alter table public.instructor_notifications enable row level security;

create policy "earnings_own_academy_or_finance" on public.earnings_ledger for select using (
  beneficiary_user_id = auth.uid()
  or (academy_id is not null and public.current_user_manages_academy(academy_id))
  or public.current_user_has_permission('finance_payout.manage.platform')
);

create policy "payout_requests_visible" on public.payout_requests for select using (
  requester_id = auth.uid()
  or (academy_id is not null and public.current_user_manages_academy(academy_id))
  or public.current_user_has_permission('finance_payout.manage.platform')
);
create policy "payout_requests_create_own" on public.payout_requests for insert with check (requester_id = auth.uid());
create policy "payout_requests_update_governed" on public.payout_requests for update using (
  requester_id = auth.uid() or public.current_user_has_permission('finance_payout.manage.platform')
) with check (
  requester_id = auth.uid() or public.current_user_has_permission('finance_payout.manage.platform')
);

create policy "payout_events_visible" on public.payout_request_events for select using (
  exists (select 1 from public.payout_requests pr where pr.id = payout_request_id and (pr.requester_id = auth.uid() or public.current_user_has_permission('finance_payout.manage.platform') or (pr.academy_id is not null and public.current_user_manages_academy(pr.academy_id))))
);

create policy "academy_policies_staff" on public.academy_policies for select using (public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform'));
create policy "academy_policies_manage" on public.academy_policies for all using (public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform')) with check (public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform'));

create policy "storefront_public_or_staff" on public.academy_storefront_settings for select using (public_visibility = 'public' or public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform'));
create policy "storefront_manage" on public.academy_storefront_settings for all using (public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform')) with check (public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform'));

create policy "instructor_public_profiles_read" on public.instructor_public_profiles for select using (true);
create policy "instructor_public_profiles_manage" on public.instructor_public_profiles for all using (
  exists (select 1 from public.instructor_profiles ip where ip.id = instructor_profile_id and ip.user_id = auth.uid()) or public.current_user_has_permission('settings.manage.platform')
) with check (
  exists (select 1 from public.instructor_profiles ip where ip.id = instructor_profile_id and ip.user_id = auth.uid()) or public.current_user_has_permission('settings.manage.platform')
);

create policy "learner_activity_assigned" on public.learner_course_activity_summary for select using (
  learner_id = auth.uid()
  or public.current_user_teaches_course(course_id)
  or (academy_id is not null and public.current_user_manages_academy(academy_id))
  or public.current_user_has_permission('enrollment.manage.platform')
);

create policy "grading_activity_assigned" on public.grading_activity for select using (
  grader_id = auth.uid()
  or (course_id is not null and public.current_user_teaches_course(course_id))
  or public.current_user_has_permission('course.review.assigned')
);
create policy "grading_activity_create_assigned" on public.grading_activity for insert with check (grader_id = auth.uid() and (course_id is null or public.current_user_teaches_course(course_id)));

create policy "academy_quality_staff" on public.academy_quality_metrics for select using (public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform'));
create policy "instructor_metrics_own" on public.instructor_dashboard_metrics for select using (instructor_id = auth.uid() or public.current_user_has_permission('settings.manage.platform'));
create policy "academy_metrics_staff" on public.academy_dashboard_metrics for select using (public.current_user_manages_academy(academy_id) or public.current_user_has_permission('settings.manage.platform'));
create policy "instructor_notifications_own" on public.instructor_notifications for select using (user_id = auth.uid());

create or replace function public.create_payout_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.payout_request_events (payout_request_id, actor_id, to_status, reason)
    values (new.id, new.requester_id, new.status, 'Payout request created');
  elsif old.status is distinct from new.status then
    insert into public.payout_request_events (payout_request_id, actor_id, from_status, to_status, reason)
    values (new.id, coalesce(new.decided_by, new.requester_id), old.status, new.status, new.decision_reason);
  end if;
  return new;
end;
$$;

drop trigger if exists payout_request_event_trigger on public.payout_requests;
create trigger payout_request_event_trigger
after insert or update of status on public.payout_requests
for each row execute function public.create_payout_event();
