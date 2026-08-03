create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  audience text not null check (audience in ('individual','instructor','academy','organization','government','university','custom_enterprise')),
  description text,
  features jsonb not null default '{}',
  limits jsonb not null default '{}',
  storage_limit_mb integer,
  ai_credit_limit integer,
  live_session_capacity integer,
  course_limit integer,
  instructor_limit integer,
  enterprise_limit integer,
  branding jsonb not null default '{}',
  api_access_placeholder boolean not null default false,
  currency text not null default 'KES',
  price_minor integer not null default 0 check (price_minor >= 0),
  billing_interval text not null default 'monthly' check (billing_interval in ('free','monthly','annual','custom')),
  trial_days integer not null default 0 check (trial_days >= 0),
  tax_mode text not null default 'exclusive' check (tax_mode in ('exclusive','inclusive','none')),
  status text not null default 'draft' check (status in ('draft','active','archived')),
  version integer not null default 1,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  subscriber_user_id uuid references public.profiles(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  customer_name text not null,
  customer_email text,
  currency text not null default 'KES',
  billing_interval text not null default 'monthly' check (billing_interval in ('free','monthly','annual','custom')),
  price_minor integer not null default 0,
  status text not null default 'draft' check (status in ('draft','trial','active','grace_period','past_due','suspended','cancelled','expired','upgraded','downgraded','renewed')),
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  cancelled_at timestamptz,
  metadata jsonb not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (subscriber_user_id is not null or workspace_id is not null or academy_id is not null or organization_id is not null)
);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  from_status text,
  to_status text,
  amount_minor integer not null default 0,
  currency text not null default 'KES',
  idempotency_key text unique,
  payload jsonb not null default '{}',
  success boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  customer_user_id uuid references public.profiles(id),
  workspace_id uuid references public.workspaces(id),
  academy_id uuid references public.academies(id),
  organization_id uuid references public.organizations(id),
  customer_name text not null,
  customer_email text,
  billing_period_start timestamptz,
  billing_period_end timestamptz,
  currency text not null default 'KES',
  subtotal_minor integer not null default 0,
  discount_minor integer not null default 0,
  tax_minor integer not null default 0,
  total_minor integer not null default 0,
  amount_paid_minor integer not null default 0,
  balance_minor integer not null default 0,
  status text not null default 'draft' check (status in ('draft','issued','sent','paid','partially_paid','void','overdue','refunded','cancelled')),
  payment_reference text,
  pdf_path text,
  snapshot jsonb not null default '{}',
  issued_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_amount_minor integer not null default 0,
  discount_minor integer not null default 0,
  tax_minor integer not null default 0,
  total_minor integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.revenue_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scope text not null check (scope in ('platform','academy','course','instructor','organization','marketplace')),
  academy_id uuid references public.academies(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  instructor_id uuid references public.profiles(id) on delete cascade,
  beneficiary_type text not null check (beneficiary_type in ('platform','instructor','academy','enterprise','affiliate')),
  percentage numeric(7,4) not null default 0 check (percentage >= 0 and percentage <= 100),
  fixed_amount_minor integer not null default 0 check (fixed_amount_minor >= 0),
  minimum_payout_minor integer not null default 0,
  currency text not null default 'KES',
  priority integer not null default 100,
  version integer not null default 1,
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  status text not null default 'active' check (status in ('draft','active','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.earnings (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  rule_id uuid references public.revenue_rules(id) on delete set null,
  beneficiary_type text not null check (beneficiary_type in ('platform','instructor','academy','enterprise','affiliate')),
  beneficiary_user_id uuid references public.profiles(id) on delete set null,
  academy_id uuid references public.academies(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  gross_minor integer not null default 0,
  platform_share_minor integer not null default 0,
  instructor_share_minor integer not null default 0,
  academy_share_minor integer not null default 0,
  tax_minor integer not null default 0,
  refund_adjustment_minor integer not null default 0,
  net_minor integer not null default 0,
  currency text not null default 'KES',
  status text not null default 'pending' check (status in ('pending','eligible','on_hold','paid','reversed','cancelled')),
  calculation_snapshot jsonb not null default '{}',
  earned_at timestamptz not null default now(),
  eligible_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payout_batches (
  id uuid primary key default gen_random_uuid(),
  batch_number text unique not null,
  method text not null default 'manual' check (method in ('manual','bank_transfer','mpesa_b2c','international_transfer')),
  currency text not null default 'KES',
  total_minor integer not null default 0,
  transaction_count integer not null default 0,
  status text not null default 'pending' check (status in ('pending','eligible','requested','approved','processing','paid','rejected','returned','cancelled')),
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  processed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.payout_transactions (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.payout_batches(id) on delete set null,
  payout_request_id uuid references public.payout_requests(id) on delete set null,
  earning_id uuid references public.earnings(id) on delete set null,
  beneficiary_user_id uuid references public.profiles(id) on delete set null,
  academy_id uuid references public.academies(id) on delete set null,
  amount_minor integer not null check (amount_minor > 0),
  currency text not null default 'KES',
  method text not null default 'manual',
  destination_label text not null,
  provider_reference text,
  idempotency_key text unique,
  status text not null default 'pending' check (status in ('pending','eligible','requested','approved','processing','paid','rejected','returned','cancelled')),
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('course','coaching','live_event','template','resource','digital_download')),
  title text not null,
  slug text unique not null,
  description text,
  product_id uuid references public.products(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  academy_id uuid references public.academies(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  visibility text not null default 'private' check (visibility in ('private','unlisted','public')),
  moderation_status text not null default 'draft' check (moderation_status in ('draft','submitted','approved','rejected','suspended','archived')),
  seo jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text unique not null,
  requester_id uuid references public.profiles(id) on delete set null,
  workspace_id uuid references public.workspaces(id) on delete set null,
  category text not null default 'general',
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  subject text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','waiting_on_customer','waiting_on_support','escalated','resolved','closed')),
  assigned_to uuid references public.profiles(id) on delete set null,
  sla_due_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  message_type text not null default 'customer_reply' check (message_type in ('customer_reply','support_reply','internal_note','system')),
  body text not null,
  attachments jsonb not null default '[]',
  visibility text not null default 'customer' check (visibility in ('customer','internal')),
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_base_articles (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  slug text unique not null,
  title text not null,
  excerpt text,
  body text not null,
  related_article_ids uuid[] not null default '{}',
  version integer not null default 1,
  visibility text not null default 'public' check (visibility in ('public','authenticated','support','admin','draft')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  id uuid primary key default gen_random_uuid(),
  flag_key text not null,
  description text,
  enabled boolean not null default false,
  scope text not null default 'global' check (scope in ('global','workspace','user','beta_group')),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  beta_group text,
  rollout_percentage integer not null default 100 check (rollout_percentage between 0 and 100),
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  unique (flag_key, scope, workspace_id, user_id, beta_group)
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  event_type text not null,
  severity text not null default 'info' check (severity in ('info','low','medium','high','critical')),
  ip_address inet,
  device jsonb not null default '{}',
  location jsonb not null default '{}',
  status text not null default 'open' check (status in ('open','acknowledged','resolved','dismissed')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.mfa_factors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  factor_type text not null check (factor_type in ('totp','backup_code','recovery')),
  label text not null,
  status text not null default 'pending' check (status in ('pending','verified','disabled','revoked')),
  secret_reference text,
  verified_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  session_fingerprint text not null,
  ip_address inet,
  device jsonb not null default '{}',
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoke_reason text,
  created_at timestamptz not null default now(),
  unique (user_id, session_fingerprint)
);

create table if not exists public.compliance_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles(id) on delete set null,
  request_type text not null check (request_type in ('data_export','data_deletion','privacy_question','consent_review','correction','objection')),
  jurisdiction text not null default 'KE',
  status text not null default 'submitted' check (status in ('submitted','identity_verification','in_review','approved','rejected','completed','cancelled')),
  description text not null,
  resolution text,
  assigned_to uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  consent_type text not null,
  version text not null default '1',
  granted boolean not null default false,
  source text not null default 'web',
  metadata jsonb not null default '{}',
  recorded_at timestamptz not null default now(),
  unique (user_id, consent_type, version)
);

create table if not exists public.data_retention_policies (
  id uuid primary key default gen_random_uuid(),
  resource_type text unique not null,
  minimum_retention_days integer not null default 0,
  workspace_override_allowed boolean not null default true,
  policy jsonb not null default '{}',
  status text not null default 'active' check (status in ('active','archived')),
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.backup_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null check (job_type in ('scheduled_backup','manual_backup','restore_test','point_in_time_recovery_test','disaster_recovery_drill')),
  provider text not null default 'supabase',
  scope text not null default 'database',
  status text not null default 'scheduled' check (status in ('scheduled','running','completed','failed','cancelled')),
  started_at timestamptz,
  completed_at timestamptz,
  retention_until timestamptz,
  restore_tested boolean not null default false,
  report jsonb not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.monitoring_events (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  metric_name text not null,
  metric_value numeric(14,4),
  unit text,
  severity text not null default 'info' check (severity in ('info','low','medium','high','critical')),
  status text not null default 'open' check (status in ('open','acknowledged','resolved')),
  metadata jsonb not null default '{}',
  observed_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.system_health_checks (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  check_name text not null,
  status text not null check (status in ('healthy','degraded','down','unknown')),
  latency_ms integer,
  details jsonb not null default '{}',
  checked_at timestamptz not null default now()
);

insert into public.subscription_plans (slug, name, audience, description, features, limits, price_minor, billing_interval, trial_days, status) values
('individual', 'Individual', 'individual', 'Affordable learner plan.', '{"learning":true,"certificates":true}', '{"ai_credits":50,"live_sessions":5}', 0, 'free', 0, 'active'),
('instructor-pro', 'Instructor Pro', 'instructor', 'Instructor tools, AI drafting, and analytics.', '{"ai_course_creator":true,"storefront":true}', '{"courses":20,"ai_credits":500}', 150000, 'monthly', 14, 'active'),
('academy-starter', 'Academy Starter', 'academy', 'Starter plan for academy owners.', '{"academy_branding":true,"team":true}', '{"courses":25,"instructors":5}', 300000, 'monthly', 14, 'active'),
('academy-growth', 'Academy Growth', 'academy', 'Growth plan for larger academy teams.', '{"academy_branding":true,"advanced_analytics":true}', '{"courses":100,"instructors":25}', 900000, 'monthly', 14, 'active'),
('organization-starter', 'Organization Starter', 'organization', 'Enterprise learning starter workspace.', '{"enterprise_learning":true}', '{"employees":100,"assignments":500}', 1200000, 'monthly', 30, 'active'),
('organization-professional', 'Organization Professional', 'organization', 'Professional enterprise LMS plan.', '{"enterprise_learning":true,"compliance":true,"reports":true}', '{"employees":1000,"assignments":10000}', 4500000, 'monthly', 30, 'active'),
('government', 'Government', 'government', 'Government contract plan.', '{"custom_contract":true}', '{"custom":true}', 0, 'custom', 0, 'active'),
('university', 'University', 'university', 'University and TVET learning plan.', '{"campus_learning":true}', '{"custom":true}', 0, 'custom', 0, 'active'),
('custom-enterprise', 'Custom Enterprise', 'custom_enterprise', 'Negotiated enterprise plan.', '{"custom_contract":true,"api_access_placeholder":true}', '{"custom":true}', 0, 'custom', 0, 'active')
on conflict (slug) do nothing;

insert into public.revenue_rules (name, scope, beneficiary_type, percentage, priority, status) values
('Default platform share placeholder', 'platform', 'platform', 0, 10, 'active'),
('Default instructor share placeholder', 'instructor', 'instructor', 0, 20, 'active'),
('Default academy share placeholder', 'academy', 'academy', 0, 30, 'active')
on conflict do nothing;

insert into public.data_retention_policies (resource_type, minimum_retention_days, workspace_override_allowed, policy) values
('audit_logs', 2555, false, '{"reason":"financial_security_legal_audit"}'),
('financial_records', 2555, false, '{"reason":"tax_and_finance"}'),
('certificates', 3650, false, '{"reason":"verification"}'),
('ai_conversations', 365, true, '{"reason":"learning_support"}'),
('support_tickets', 1095, true, '{"reason":"customer_support"}'),
('live_recordings', 180, true, '{"reason":"learning_replay"}'),
('chat', 365, true, '{"reason":"safety_and_support"}')
on conflict (resource_type) do nothing;

insert into public.permissions (code, resource, action, scope, description) values
('subscription.manage.platform', 'subscription', 'manage', 'platform', 'Manage platform subscription plans and subscriptions.'),
('subscription.view.own', 'subscription', 'view', 'own', 'View own subscriptions.'),
('billing.manage.platform', 'billing', 'manage', 'platform', 'Manage invoices, billing events, and adjustments.'),
('billing.view.organization', 'billing', 'view', 'organization', 'View organization billing.'),
('revenue.manage.platform', 'revenue', 'manage', 'platform', 'Manage revenue rules and earnings.'),
('marketplace.manage.platform', 'marketplace', 'manage', 'platform', 'Moderate marketplace listings.'),
('support.create.own', 'support', 'create', 'own', 'Create own support tickets.'),
('support.manage.assigned', 'support', 'manage', 'assigned', 'Manage assigned support tickets.'),
('security.view.own', 'security', 'view', 'own', 'View own security center.'),
('security.manage.platform', 'security', 'manage', 'platform', 'Manage platform security events.'),
('monitoring.view.platform', 'monitoring', 'view', 'platform', 'View monitoring, health, and backup status.'),
('compliance.manage.platform', 'compliance', 'manage', 'platform', 'Manage compliance and privacy requests.'),
('feature_flag.manage.platform', 'feature_flag', 'manage', 'platform', 'Manage runtime feature flags.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on
  (r.slug in ('learner','instructor','academy-owner','organization-administrator') and p.code in ('subscription.view.own','support.create.own','security.view.own'))
  or (r.slug in ('organization-administrator','hr-learning-manager') and p.code = 'billing.view.organization')
  or (r.slug in ('support-agent','platform-administrator','super-admin','founding-super-admin') and p.code = 'support.manage.assigned')
  or (r.slug in ('finance-officer','platform-administrator','super-admin','founding-super-admin') and p.code in ('billing.manage.platform','revenue.manage.platform','subscription.manage.platform'))
  or (r.slug in ('platform-administrator','super-admin','founding-super-admin') and p.code in ('marketplace.manage.platform','security.manage.platform','monitoring.view.platform','compliance.manage.platform','feature_flag.manage.platform'))
on conflict do nothing;

create or replace function public.current_user_can_view_subscription(target_subscription_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.subscriptions s where s.id = target_subscription_id and s.subscriber_user_id = auth.uid())
    or exists (select 1 from public.subscriptions s where s.id = target_subscription_id and s.organization_id is not null and public.current_user_in_organization(s.organization_id))
    or exists (select 1 from public.subscriptions s where s.id = target_subscription_id and s.academy_id is not null and public.current_user_manages_academy(s.academy_id))
    or public.current_user_has_permission('billing.manage.platform');
$$;

create or replace function public.current_user_can_view_invoice(target_invoice_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.invoices i where i.id = target_invoice_id and i.customer_user_id = auth.uid())
    or exists (select 1 from public.invoices i where i.id = target_invoice_id and i.organization_id is not null and public.current_user_in_organization(i.organization_id))
    or exists (select 1 from public.invoices i where i.id = target_invoice_id and i.academy_id is not null and public.current_user_manages_academy(i.academy_id))
    or public.current_user_has_permission('billing.manage.platform');
$$;

create or replace function public.subscription_status_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.billing_events (subscription_id, actor_id, event_type, to_status, amount_minor, currency, payload)
    values (new.id, new.created_by, 'subscription_created', new.status, new.price_minor, new.currency, jsonb_build_object('plan_id', new.plan_id));
    insert into public.audit_logs (actor_id, action, resource_type, resource_id, workspace_id, success, new_data)
    values (new.created_by, 'subscription_created', 'subscription', new.id::text, new.workspace_id, true, jsonb_build_object('status', new.status));
  elsif old.status is distinct from new.status then
    insert into public.billing_events (subscription_id, actor_id, event_type, from_status, to_status, amount_minor, currency)
    values (new.id, auth.uid(), 'subscription_status_changed', old.status, new.status, new.price_minor, new.currency);
    insert into public.audit_logs (actor_id, action, resource_type, resource_id, workspace_id, previous_data, new_data, success)
    values (auth.uid(), 'subscription_status_changed', 'subscription', new.id::text, new.workspace_id, jsonb_build_object('status', old.status), jsonb_build_object('status', new.status), true);
  end if;
  return new;
end;
$$;

drop trigger if exists subscription_status_audit_trigger on public.subscriptions;
create trigger subscription_status_audit_trigger
after insert or update of status on public.subscriptions
for each row execute function public.subscription_status_audit();

alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_events enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.revenue_rules enable row level security;
alter table public.earnings enable row level security;
alter table public.payout_batches enable row level security;
alter table public.payout_transactions enable row level security;
alter table public.marketplace_listings enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_messages enable row level security;
alter table public.knowledge_base_articles enable row level security;
alter table public.feature_flags enable row level security;
alter table public.security_events enable row level security;
alter table public.mfa_factors enable row level security;
alter table public.user_sessions enable row level security;
alter table public.compliance_requests enable row level security;
alter table public.consent_records enable row level security;
alter table public.data_retention_policies enable row level security;
alter table public.backup_jobs enable row level security;
alter table public.monitoring_events enable row level security;
alter table public.system_health_checks enable row level security;

create policy "plans_active_or_admin" on public.subscription_plans for select using (status = 'active' or public.current_user_has_permission('subscription.manage.platform'));
create policy "plans_admin_write" on public.subscription_plans for all using (public.current_user_has_permission('subscription.manage.platform')) with check (public.current_user_has_permission('subscription.manage.platform'));
create policy "subscriptions_visible" on public.subscriptions for select using (public.current_user_can_view_subscription(id));
create policy "subscriptions_admin_write" on public.subscriptions for all using (public.current_user_has_permission('subscription.manage.platform')) with check (public.current_user_has_permission('subscription.manage.platform'));
create policy "billing_events_visible" on public.billing_events for select using (public.current_user_has_permission('billing.manage.platform') or (subscription_id is not null and public.current_user_can_view_subscription(subscription_id)));
create policy "invoices_visible" on public.invoices for select using (public.current_user_can_view_invoice(id));
create policy "invoices_admin_write" on public.invoices for all using (public.current_user_has_permission('billing.manage.platform')) with check (public.current_user_has_permission('billing.manage.platform'));
create policy "invoice_items_visible" on public.invoice_items for select using (exists (select 1 from public.invoices i where i.id = invoice_id and public.current_user_can_view_invoice(i.id)));
create policy "revenue_rules_admin" on public.revenue_rules for all using (public.current_user_has_permission('revenue.manage.platform')) with check (public.current_user_has_permission('revenue.manage.platform'));
create policy "earnings_visible" on public.earnings for select using (beneficiary_user_id = auth.uid() or (academy_id is not null and public.current_user_manages_academy(academy_id)) or public.current_user_has_permission('revenue.manage.platform'));
create policy "payout_batches_finance" on public.payout_batches for select using (public.current_user_has_permission('finance_payout.manage.platform') or public.current_user_has_permission('revenue.manage.platform'));
create policy "payout_transactions_visible" on public.payout_transactions for select using (beneficiary_user_id = auth.uid() or (academy_id is not null and public.current_user_manages_academy(academy_id)) or public.current_user_has_permission('finance_payout.manage.platform'));
create policy "marketplace_public_or_manager" on public.marketplace_listings for select using ((visibility = 'public' and moderation_status = 'approved') or owner_id = auth.uid() or (academy_id is not null and public.current_user_manages_academy(academy_id)) or public.current_user_has_permission('marketplace.manage.platform'));
create policy "marketplace_owner_create" on public.marketplace_listings for insert with check (owner_id = auth.uid() or public.current_user_has_permission('marketplace.manage.platform'));
create policy "support_tickets_visible" on public.support_tickets for select using (requester_id = auth.uid() or assigned_to = auth.uid() or public.current_user_has_permission('support.manage.assigned'));
create policy "support_tickets_create" on public.support_tickets for insert with check (requester_id = auth.uid());
create policy "support_tickets_update_support" on public.support_tickets for update using (requester_id = auth.uid() or assigned_to = auth.uid() or public.current_user_has_permission('support.manage.assigned')) with check (requester_id = auth.uid() or assigned_to = auth.uid() or public.current_user_has_permission('support.manage.assigned'));
create policy "support_messages_visible" on public.support_messages for select using (exists (select 1 from public.support_tickets t where t.id = ticket_id and (t.requester_id = auth.uid() or t.assigned_to = auth.uid() or public.current_user_has_permission('support.manage.assigned')) and (visibility = 'customer' or t.assigned_to = auth.uid() or public.current_user_has_permission('support.manage.assigned'))));
create policy "support_messages_create" on public.support_messages for insert with check (sender_id = auth.uid());
create policy "kb_public" on public.knowledge_base_articles for select using ((status = 'published' and visibility in ('public','authenticated')) or public.current_user_has_permission('support.manage.assigned'));
create policy "kb_support_write" on public.knowledge_base_articles for all using (public.current_user_has_permission('support.manage.assigned')) with check (public.current_user_has_permission('support.manage.assigned'));
create policy "feature_flags_read" on public.feature_flags for select using (enabled = true or public.current_user_has_permission('feature_flag.manage.platform'));
create policy "feature_flags_admin_write" on public.feature_flags for all using (public.current_user_has_permission('feature_flag.manage.platform')) with check (public.current_user_has_permission('feature_flag.manage.platform'));
create policy "security_events_visible" on public.security_events for select using (user_id = auth.uid() or public.current_user_has_permission('security.manage.platform'));
create policy "mfa_factors_own" on public.mfa_factors for all using (user_id = auth.uid() or public.current_user_has_permission('security.manage.platform')) with check (user_id = auth.uid() or public.current_user_has_permission('security.manage.platform'));
create policy "sessions_own" on public.user_sessions for all using (user_id = auth.uid() or public.current_user_has_permission('security.manage.platform')) with check (user_id = auth.uid() or public.current_user_has_permission('security.manage.platform'));
create policy "compliance_requests_own_or_admin" on public.compliance_requests for select using (requester_id = auth.uid() or public.current_user_has_permission('compliance.manage.platform'));
create policy "compliance_requests_create" on public.compliance_requests for insert with check (requester_id = auth.uid());
create policy "consent_records_own_or_admin" on public.consent_records for select using (user_id = auth.uid() or public.current_user_has_permission('compliance.manage.platform'));
create policy "retention_admin_read" on public.data_retention_policies for select using (public.current_user_has_permission('compliance.manage.platform') or public.current_user_has_permission('monitoring.view.platform'));
create policy "backup_jobs_admin" on public.backup_jobs for select using (public.current_user_has_permission('monitoring.view.platform'));
create policy "monitoring_events_admin" on public.monitoring_events for select using (public.current_user_has_permission('monitoring.view.platform'));
create policy "health_checks_admin" on public.system_health_checks for select using (public.current_user_has_permission('monitoring.view.platform'));
