create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  product_type text not null check (product_type in ('course','membership','event','marketplace')),
  name text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','active','inactive','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_prices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  currency text not null default 'KES',
  amount_minor integer not null check (amount_minor >= 0),
  promotional_amount_minor integer check (promotional_amount_minor >= 0),
  tax_mode text not null default 'inclusive',
  access_duration_days integer,
  refund_policy text,
  enrollment_available boolean not null default true,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'active' check (status in ('active','inactive','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.course_products (
  course_id uuid not null references public.courses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  published_version_id uuid references public.course_versions(id),
  primary key (course_id, product_id)
);

create table if not exists public.billing_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  country text not null default 'KE',
  county text,
  organization text,
  tax_identifier text,
  billing_address text,
  preferred_payment_phone text,
  consent_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percentage','fixed_amount','free_access')),
  percentage_off numeric(5,2),
  amount_minor integer,
  currency text default 'KES',
  funding_source text not null default 'platform',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  total_usage_limit integer,
  per_user_limit integer not null default 1,
  minimum_order_minor integer not null default 0,
  maximum_discount_minor integer,
  active boolean not null default true,
  stackable boolean not null default false,
  created_by uuid references public.profiles(id),
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.coupon_eligibility (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  billing_profile_id uuid references public.billing_profiles(id),
  workspace_id uuid references public.workspaces(id),
  currency text not null default 'KES',
  subtotal_minor integer not null default 0,
  discount_total_minor integer not null default 0,
  tax_total_minor integer not null default 0,
  provider_fee_minor integer not null default 0,
  grand_total_minor integer not null default 0,
  status text not null default 'draft' check (status in ('draft','pending_payment','payment_initiated','paid','partially_paid','failed','cancelled','expired','refunded','partially_refunded','disputed','under_review','voided')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','initiated','pending','paid','failed','cancelled','timed_out','refunded','under_review')),
  source text not null default 'checkout',
  coupon_id uuid references public.coupons(id),
  coupon_snapshot jsonb,
  metadata jsonb not null default '{}',
  paid_at timestamptz,
  cancelled_at timestamptz,
  expires_at timestamptz not null default (now() + interval '1 day'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  course_id uuid references public.courses(id) on delete restrict,
  published_course_version_id uuid references public.course_versions(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  unit_price_minor integer not null,
  discount_minor integer not null default 0,
  tax_minor integer not null default 0,
  total_minor integer not null,
  access_duration_days integer,
  refund_policy_snapshot text,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_providers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  status text not null default 'active',
  config jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.payment_providers(id),
  slug text unique not null,
  name text not null,
  status text not null default 'active'
);

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  method text not null,
  amount_minor integer not null,
  currency text not null default 'KES',
  phone text,
  status text not null default 'created' check (status in ('created','initiated','pending','successful','failed','cancelled','timed_out','reversed','under_review','unmatched')),
  merchant_request_id text,
  checkout_request_id text,
  provider_reference text,
  failure_code text,
  failure_message text,
  callback_received boolean not null default false,
  retry_number integer not null default 0,
  idempotency_key text unique not null,
  raw_response jsonb,
  reconciliation_status text not null default 'pending',
  initiated_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_callbacks (
  id uuid primary key default gen_random_uuid(),
  payment_attempt_id uuid references public.payment_attempts(id) on delete set null,
  provider text not null,
  checkout_request_id text,
  merchant_request_id text,
  result_code text,
  result_description text,
  raw_payload jsonb not null,
  processed boolean not null default false,
  duplicate boolean not null default false,
  received_at timestamptz not null default now(),
  unique (provider, checkout_request_id, result_code, received_at)
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  beneficiary_user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id),
  course_id uuid not null references public.courses(id) on delete cascade,
  course_version_id uuid references public.course_versions(id),
  source_type text not null,
  source_order_id uuid references public.orders(id),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'active' check (status in ('pending','active','suspended','expired','revoked','refunded','cancelled')),
  access_type text not null default 'course_access',
  revocation_reason text,
  suspension_reason text,
  created_by uuid references public.profiles(id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}',
  unique (beneficiary_user_id, course_id, source_order_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  course_version_id uuid references public.course_versions(id),
  entitlement_id uuid not null references public.entitlements(id),
  status text not null default 'active' check (status in ('pending','active','not_started','in_progress','completed','failed','withdrawn','suspended','expired','refunded','revoked')),
  enrolled_at timestamptz not null default now(),
  started_at timestamptz,
  last_activity_at timestamptz,
  completed_at timestamptz,
  completion_percentage numeric(5,2) not null default 0,
  completion_state text not null default 'not_started',
  access_ends_at timestamptz,
  source text not null,
  certificate_eligible boolean not null default false,
  withdrawal_reason text,
  version_migration_status text not null default 'current',
  unique (learner_id, course_id)
);

create table if not exists public.saved_courses (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','started','completed')),
  progress_percentage numeric(5,2) not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  last_position_seconds integer,
  updated_at timestamptz not null default now(),
  unique (enrollment_id, lesson_id)
);

create table if not exists public.learner_course_positions (
  enrollment_id uuid primary key references public.enrollments(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid references public.course_lessons(id),
  position_seconds integer,
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  attempt_number integer not null,
  status text not null default 'in_progress' check (status in ('in_progress','submitted','graded','manual_review','passed','failed','invalidated')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric(8,2),
  max_score numeric(8,2),
  passed boolean,
  unique (enrollment_id, quiz_id, attempt_number)
);

create table if not exists public.quiz_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  answer jsonb not null default '{}',
  is_correct boolean,
  score numeric(8,2),
  feedback text,
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  attempt_number integer not null default 1,
  status text not null default 'draft' check (status in ('draft','submitted','returned','resubmission_requested','graded','passed','failed')),
  response_text text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, assignment_id, attempt_number)
);

create table if not exists public.assignment_grades (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.assignment_submissions(id) on delete cascade,
  grader_id uuid not null references public.profiles(id),
  score numeric(8,2),
  max_score numeric(8,2),
  passed boolean,
  feedback text,
  private_note text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.course_completion_records (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid unique not null references public.enrollments(id) on delete cascade,
  course_id uuid not null references public.courses(id),
  learner_id uuid not null references public.profiles(id),
  completed_at timestamptz not null default now(),
  completion_percentage numeric(5,2) not null default 100,
  evidence jsonb not null default '{}',
  status text not null default 'completed'
);

create table if not exists public.certificate_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  template jsonb not null default '{}',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id),
  learner_id uuid not null references public.profiles(id),
  course_id uuid not null references public.courses(id),
  certificate_number text unique not null,
  verification_code text unique not null default encode(gen_random_bytes(16), 'hex'),
  snapshot jsonb not null,
  status text not null default 'issued' check (status in ('issued','corrected','replaced','revoked','expired')),
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  replaced_by uuid references public.certificates(id),
  revoked_at timestamptz,
  revocation_reason text,
  unique (enrollment_id, status) deferrable initially immediate
);

create table if not exists public.certificate_files (
  id uuid primary key default gen_random_uuid(),
  certificate_id uuid not null references public.certificates(id) on delete cascade,
  file_path text not null,
  file_type text not null default 'pdf',
  generated_at timestamptz not null default now()
);

create table if not exists public.refund_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id),
  payment_attempt_id uuid references public.payment_attempts(id),
  course_id uuid references public.courses(id),
  requester_id uuid not null references public.profiles(id),
  reason text not null,
  explanation text,
  evidence jsonb not null default '{}',
  requested_amount_minor integer,
  requested_resolution text,
  status text not null default 'requested' check (status in ('requested','auto_eligible','under_review','more_information_needed','approved','partially_approved','rejected','refunded','credited','closed','appealed')),
  reviewer_id uuid references public.profiles(id),
  decision text,
  decision_reason text,
  submitted_at timestamptz not null default now(),
  decided_at timestamptz
);

insert into public.payment_providers (slug, name) values ('mpesa', 'M-Pesa') on conflict (slug) do nothing;
insert into public.payment_methods (provider_id, slug, name)
select id, 'mpesa_stk', 'M-Pesa STK Push' from public.payment_providers where slug = 'mpesa'
on conflict (slug) do nothing;

insert into public.permissions (code, resource, action, scope, description) values
('order.view.own', 'order', 'view', 'own', 'View own orders.'),
('payment.view.own', 'payment', 'view', 'own', 'View own payments.'),
('payment.manage.platform', 'payment', 'manage', 'platform', 'Manage platform payments.'),
('entitlement.view.own', 'entitlement', 'view', 'own', 'View own entitlements.'),
('entitlement.manage.platform', 'entitlement', 'manage', 'platform', 'Manage entitlements.'),
('enrollment.view.own', 'enrollment', 'view', 'own', 'View own enrollments.'),
('enrollment.manage.platform', 'enrollment', 'manage', 'platform', 'Manage enrollments.'),
('certificate.view.own', 'certificate', 'view', 'own', 'View own certificates.'),
('certificate.manage.platform', 'certificate', 'manage', 'platform', 'Manage certificates.'),
('refund.create.own', 'refund', 'create', 'own', 'Request own refund.'),
('refund.manage.platform', 'refund', 'manage', 'platform', 'Manage refunds.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on
  (r.slug = 'learner' and p.code in ('order.view.own','payment.view.own','entitlement.view.own','enrollment.view.own','certificate.view.own','refund.create.own'))
  or (r.slug in ('finance-officer','platform-administrator','super-admin','founding-super-admin') and p.code in ('payment.manage.platform','entitlement.manage.platform','enrollment.manage.platform','certificate.manage.platform','refund.manage.platform'))
on conflict do nothing;

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique not null references public.orders(id) on delete cascade,
  receipt_number text unique not null,
  verification_code text unique not null,
  file_path text,
  snapshot jsonb not null,
  issued_at timestamptz not null default now(),
  reissued_at timestamptz
);

create or replace function public.complete_order_access(target_order_id uuid, actor uuid)
returns uuid
security definer
set search_path = public
language plpgsql
as $$
declare
  ord public.orders%rowtype;
  item public.order_items%rowtype;
  entitlement_id uuid;
  enrollment_id uuid;
  receipt_number text;
begin
  select * into ord from public.orders where id = target_order_id for update;
  if ord.id is null then raise exception 'Order not found'; end if;
  if ord.status = 'paid' then
    select id into enrollment_id from public.enrollments where learner_id = ord.customer_id and course_id = (select course_id from public.order_items where order_id = ord.id limit 1);
    return enrollment_id;
  end if;

  select * into item from public.order_items where order_id = ord.id limit 1;
  update public.orders set status = 'paid', payment_status = 'paid', paid_at = now() where id = ord.id;

  insert into public.entitlements (beneficiary_user_id, product_id, course_id, course_version_id, source_type, source_order_id, ends_at, created_by)
  values (ord.customer_id, item.product_id, item.course_id, item.published_course_version_id, case when ord.grand_total_minor = 0 then 'free_enrollment' else 'paid_order' end, ord.id, case when item.access_duration_days is null then null else now() + (item.access_duration_days || ' days')::interval end, actor)
  on conflict (beneficiary_user_id, course_id, source_order_id) do update set status = 'active'
  returning id into entitlement_id;

  insert into public.enrollments (learner_id, course_id, course_version_id, entitlement_id, status, source, access_ends_at)
  values (ord.customer_id, item.course_id, item.published_course_version_id, entitlement_id, 'active', case when ord.grand_total_minor = 0 then 'free' else 'paid' end, case when item.access_duration_days is null then null else now() + (item.access_duration_days || ' days')::interval end)
  on conflict (learner_id, course_id) do update set status = 'active', entitlement_id = excluded.entitlement_id
  returning id into enrollment_id;

  receipt_number := 'SA-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(ord.id::text, 1, 8));
  insert into public.receipts (order_id, receipt_number, verification_code, snapshot)
  values (ord.id, receipt_number, encode(gen_random_bytes(12), 'hex'), jsonb_build_object('order', to_jsonb(ord), 'item', to_jsonb(item)))
  on conflict (order_id) do nothing;

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, success)
  values (coalesce(actor, ord.customer_id), 'order_access_completed', 'order', ord.id::text, true);

  return enrollment_id;
end;
$$;

create or replace function public.issue_certificate_for_enrollment(target_enrollment_id uuid, actor uuid)
returns uuid
security definer
set search_path = public
language plpgsql
as $$
declare
  enr public.enrollments%rowtype;
  cert_id uuid;
begin
  select * into enr from public.enrollments where id = target_enrollment_id for update;
  if enr.id is null or enr.status <> 'completed' then raise exception 'Enrollment is not complete'; end if;

  insert into public.certificates (enrollment_id, learner_id, course_id, certificate_number, snapshot)
  values (enr.id, enr.learner_id, enr.course_id, 'CERT-' || upper(substr(enr.id::text, 1, 10)), jsonb_build_object('learner_id', enr.learner_id, 'course_id', enr.course_id, 'completed_at', enr.completed_at))
  on conflict do nothing
  returning id into cert_id;

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, success)
  values (actor, 'certificate_issued', 'enrollment', target_enrollment_id::text, true);
  return cert_id;
end;
$$;

create or replace function public.verify_certificate(code text)
returns table (
  certificate_number text,
  verification_code text,
  status text,
  issued_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  revocation_reason text,
  course_id uuid
)
security definer
set search_path = public
language sql
stable
as $$
  select
    c.certificate_number,
    c.verification_code,
    c.status,
    c.issued_at,
    c.expires_at,
    c.revoked_at,
    c.revocation_reason,
    c.course_id
  from public.certificates c
  where c.verification_code = code
    and c.status in ('issued','corrected','revoked','expired')
  limit 1;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;

alter table public.products enable row level security;
alter table public.product_prices enable row level security;
alter table public.course_products enable row level security;
alter table public.billing_profiles enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_eligibility enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_providers enable row level security;
alter table public.payment_methods enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.payment_callbacks enable row level security;
alter table public.entitlements enable row level security;
alter table public.enrollments enable row level security;
alter table public.saved_courses enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.learner_course_positions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_attempt_answers enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.assignment_grades enable row level security;
alter table public.course_completion_records enable row level security;
alter table public.certificate_templates enable row level security;
alter table public.certificates enable row level security;
alter table public.certificate_files enable row level security;
alter table public.refund_requests enable row level security;
alter table public.receipts enable row level security;

create policy "products_public_active" on public.products for select using (status = 'active' or public.current_user_has_permission('settings.manage.platform'));
create policy "prices_public_active" on public.product_prices for select using (status = 'active' or public.current_user_has_permission('settings.manage.platform'));
create policy "course_products_public" on public.course_products for select using (exists (select 1 from public.courses c where c.id = course_id and c.status = 'published' and c.visibility = 'public') or public.current_user_has_permission('settings.manage.platform'));
create policy "billing_profiles_own" on public.billing_profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "coupons_public_active" on public.coupons for select using (active = true or public.current_user_has_permission('payment.manage.platform'));
create policy "orders_own_or_finance" on public.orders for select using (customer_id = auth.uid() or public.current_user_has_permission('payment.manage.platform'));
create policy "orders_no_client_paid_update" on public.orders for update using (customer_id = auth.uid() and status in ('draft','pending_payment')) with check (customer_id = auth.uid() and status in ('draft','pending_payment'));
create policy "order_items_own_or_finance" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.current_user_has_permission('payment.manage.platform'))));
create policy "payment_config_read" on public.payment_providers for select using (true);
create policy "payment_methods_read" on public.payment_methods for select using (true);
create policy "payment_attempts_own_or_finance" on public.payment_attempts for select using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.current_user_has_permission('payment.manage.platform'))));
create policy "payment_callbacks_finance" on public.payment_callbacks for select using (public.current_user_has_permission('payment.manage.platform'));
create policy "entitlements_own_or_admin" on public.entitlements for select using (beneficiary_user_id = auth.uid() or public.current_user_has_permission('entitlement.manage.platform'));
create policy "enrollments_own_or_staff" on public.enrollments for select using (learner_id = auth.uid() or public.current_user_has_permission('enrollment.manage.platform') or exists (select 1 from public.course_team_members ctm where ctm.course_id = enrollments.course_id and ctm.user_id = auth.uid()));
create policy "saved_courses_own" on public.saved_courses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "lesson_progress_own" on public.lesson_progress for all using (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.learner_id = auth.uid())) with check (true);
create policy "course_positions_own" on public.learner_course_positions for all using (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.learner_id = auth.uid())) with check (true);
create policy "quiz_attempts_own" on public.quiz_attempts for all using (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.learner_id = auth.uid())) with check (true);
create policy "quiz_answers_own" on public.quiz_attempt_answers for all using (exists (select 1 from public.quiz_attempts qa join public.enrollments e on e.id = qa.enrollment_id where qa.id = attempt_id and e.learner_id = auth.uid())) with check (true);
create policy "assignment_submissions_own_or_grader" on public.assignment_submissions for select using (exists (select 1 from public.enrollments e where e.id = enrollment_id and e.learner_id = auth.uid()) or public.current_user_has_permission('course.review.assigned'));
create policy "assignment_grades_learner_published" on public.assignment_grades for select using (published_at is not null and exists (select 1 from public.assignment_submissions s join public.enrollments e on e.id = s.enrollment_id where s.id = submission_id and e.learner_id = auth.uid()) or public.current_user_has_permission('course.review.assigned'));
create policy "completion_records_own_or_staff" on public.course_completion_records for select using (learner_id = auth.uid() or public.current_user_has_permission('enrollment.manage.platform'));
create policy "certificates_own_or_admin" on public.certificates for select using (learner_id = auth.uid() or public.current_user_has_permission('certificate.manage.platform'));
create policy "certificate_files_private" on public.certificate_files for select using (exists (select 1 from public.certificates c where c.id = certificate_id and (c.learner_id = auth.uid() or public.current_user_has_permission('certificate.manage.platform'))));
create policy "receipts_own_or_finance" on public.receipts for select using (exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.current_user_has_permission('payment.manage.platform'))));
create policy "refund_requests_own_or_admin" on public.refund_requests for select using (requester_id = auth.uid() or public.current_user_has_permission('refund.manage.platform'));
create policy "refund_requests_create_own" on public.refund_requests for insert with check (requester_id = auth.uid());
