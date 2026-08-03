create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text unique not null,
  scopes text[] not null default '{}',
  environment text not null default 'production' check (environment in ('development','staging','production')),
  status text not null default 'active' check (status in ('active','revoked','expired','rotated')),
  expires_at timestamptz,
  last_used_at timestamptz,
  last_used_ip inet,
  created_by uuid references public.profiles(id),
  revoked_by uuid references public.profiles(id),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (workspace_id is not null or academy_id is not null or organization_id is not null)
);

create table if not exists public.api_key_usage (
  id uuid primary key default gen_random_uuid(),
  api_key_id uuid references public.api_keys(id) on delete set null,
  route text not null,
  method text not null,
  status_code integer not null,
  latency_ms integer,
  idempotency_key text,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  url text not null,
  event_types text[] not null default '{}',
  secret_hash text not null,
  signing_version text not null default 'v1',
  status text not null default 'active' check (status in ('active','disabled','error','rotating_secret','archived')),
  retry_policy jsonb not null default '{"max_attempts":5,"backoff":"exponential"}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (workspace_id is not null or academy_id is not null or organization_id is not null)
);

create table if not exists public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid not null references public.webhook_endpoints(id) on delete cascade,
  event_type text not null,
  event_id text not null,
  payload jsonb not null default '{}',
  signature text,
  status text not null default 'pending' check (status in ('pending','delivering','delivered','failed','disabled','replayed')),
  attempt_count integer not null default 0,
  next_attempt_at timestamptz,
  response_status integer,
  response_body text,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  unique (endpoint_id, event_id)
);

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  provider text not null,
  category text not null check (category in ('calendar','identity','payment','email','sms','hr','payroll','crm','accounting','storage','analytics','video','productivity')),
  display_name text not null,
  status text not null default 'coming_later' check (status in ('available','configured','connected','error','coming_later','administrator_only')),
  configuration_status jsonb not null default '{}',
  scopes text[] not null default '{}',
  last_sync_at timestamptz,
  error_message text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maintenance_windows (
  id uuid primary key default gen_random_uuid(),
  scope text not null default 'platform' check (scope in ('platform','service','read_only')),
  service text,
  status text not null default 'scheduled' check (status in ('scheduled','active','completed','cancelled')),
  public_message text not null,
  expected_recovery_message text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  admin_bypass boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.launch_migration_jobs (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  job_type text not null check (job_type in ('dry_run','import','reconciliation','rollback')),
  status text not null default 'draft' check (status in ('draft','running','completed','failed','cancelled')),
  source_mapping jsonb not null default '{}',
  validation_report jsonb not null default '{}',
  error_report jsonb not null default '{}',
  duplicate_report jsonb not null default '{}',
  sign_off_by uuid references public.profiles(id),
  sign_off_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.product_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  workspace_id uuid references public.workspaces(id) on delete set null,
  feedback_type text not null check (feedback_type in ('platform_usability','course_experience','live_session','ai_assistance','support_experience','enterprise_admin')),
  rating integer check (rating between 1 and 5),
  comment text,
  consent_to_contact boolean not null default false,
  moderation_status text not null default 'private' check (moderation_status in ('private','review','approved','rejected','archived')),
  created_at timestamptz not null default now()
);

insert into public.permissions (code, resource, action, scope, description) values
('api_key.manage.organization', 'api_key', 'manage', 'organization', 'Manage organization API keys.'),
('api_key.manage.academy', 'api_key', 'manage', 'academy', 'Manage academy API keys.'),
('api_key.manage.platform', 'api_key', 'manage', 'platform', 'Manage all API keys.'),
('webhook.manage.organization', 'webhook', 'manage', 'organization', 'Manage organization webhooks.'),
('webhook.manage.academy', 'webhook', 'manage', 'academy', 'Manage academy webhooks.'),
('integration.manage.organization', 'integration', 'manage', 'organization', 'Manage organization integrations.'),
('integration.manage.platform', 'integration', 'manage', 'platform', 'Manage platform integrations.'),
('maintenance.manage.platform', 'maintenance', 'manage', 'platform', 'Manage maintenance mode.'),
('feedback.create.own', 'feedback', 'create', 'own', 'Create own product feedback.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on
  (r.slug in ('learner','instructor','academy-owner','organization-administrator') and p.code = 'feedback.create.own')
  or (r.slug in ('organization-administrator','hr-learning-manager') and p.code in ('api_key.manage.organization','webhook.manage.organization','integration.manage.organization'))
  or (r.slug in ('academy-owner','academy-administrator') and p.code in ('api_key.manage.academy','webhook.manage.academy'))
  or (r.slug in ('platform-administrator','super-admin','founding-super-admin') and p.code in ('api_key.manage.platform','integration.manage.platform','maintenance.manage.platform'))
on conflict do nothing;

insert into public.integration_connections (provider, category, display_name, status, configuration_status) values
('google-workspace', 'productivity', 'Google Workspace', 'coming_later', '{"requires_oauth":true}'),
('microsoft-365', 'productivity', 'Microsoft 365', 'coming_later', '{"requires_oauth":true}'),
('google-calendar', 'calendar', 'Google Calendar', 'coming_later', '{"requires_oauth":true}'),
('outlook-calendar', 'calendar', 'Microsoft Outlook Calendar', 'coming_later', '{"requires_oauth":true}'),
('zoom', 'video', 'Zoom', 'coming_later', '{"requires_oauth":true}'),
('teams', 'video', 'Microsoft Teams', 'coming_later', '{"requires_oauth":true}'),
('mpesa', 'payment', 'M-Pesa', 'available', '{"requires_daraja_credentials":true}'),
('email-provider', 'email', 'Transactional Email Provider', 'available', '{"requires_provider_key":true}'),
('sms-provider', 'sms', 'SMS Provider', 'coming_later', '{"requires_consent":true}'),
('hr-system', 'hr', 'HR System Connector', 'coming_later', '{"csv_excel_api_supported":true}'),
('payroll-system', 'payroll', 'Payroll System Connector', 'coming_later', '{"payroll_data_not_imported":true}'),
('accounting-system', 'accounting', 'Accounting Connector', 'coming_later', '{"requires_finance_review":true}'),
('analytics-provider', 'analytics', 'Analytics Provider', 'coming_later', '{"privacy_review_required":true}')
on conflict do nothing;

alter table public.api_keys enable row level security;
alter table public.api_key_usage enable row level security;
alter table public.webhook_endpoints enable row level security;
alter table public.webhook_deliveries enable row level security;
alter table public.integration_connections enable row level security;
alter table public.maintenance_windows enable row level security;
alter table public.launch_migration_jobs enable row level security;
alter table public.product_feedback enable row level security;

create policy "api_keys_visible" on public.api_keys for select using (
  public.current_user_has_permission('api_key.manage.platform')
  or (organization_id is not null and public.current_user_in_organization(organization_id))
  or (academy_id is not null and public.current_user_manages_academy(academy_id))
);
create policy "api_keys_create_scoped" on public.api_keys for insert with check (
  public.current_user_has_permission('api_key.manage.platform')
  or (organization_id is not null and public.current_user_in_organization(organization_id))
  or (academy_id is not null and public.current_user_manages_academy(academy_id))
);
create policy "api_key_usage_visible" on public.api_key_usage for select using (
  public.current_user_has_permission('api_key.manage.platform')
  or exists (select 1 from public.api_keys k where k.id = api_key_id and ((k.organization_id is not null and public.current_user_in_organization(k.organization_id)) or (k.academy_id is not null and public.current_user_manages_academy(k.academy_id))))
);
create policy "webhooks_visible" on public.webhook_endpoints for select using (
  public.current_user_has_permission('api_key.manage.platform')
  or (organization_id is not null and public.current_user_in_organization(organization_id))
  or (academy_id is not null and public.current_user_manages_academy(academy_id))
);
create policy "webhooks_create_scoped" on public.webhook_endpoints for insert with check (
  public.current_user_has_permission('api_key.manage.platform')
  or (organization_id is not null and public.current_user_in_organization(organization_id))
  or (academy_id is not null and public.current_user_manages_academy(academy_id))
);
create policy "webhook_deliveries_visible" on public.webhook_deliveries for select using (
  exists (select 1 from public.webhook_endpoints e where e.id = endpoint_id and (public.current_user_has_permission('api_key.manage.platform') or (e.organization_id is not null and public.current_user_in_organization(e.organization_id)) or (e.academy_id is not null and public.current_user_manages_academy(e.academy_id))))
);
create policy "integrations_visible" on public.integration_connections for select using (
  status in ('available','coming_later')
  or public.current_user_has_permission('integration.manage.platform')
  or (organization_id is not null and public.current_user_in_organization(organization_id))
);
create policy "integrations_manage" on public.integration_connections for all using (public.current_user_has_permission('integration.manage.platform') or (organization_id is not null and public.current_user_in_organization(organization_id))) with check (public.current_user_has_permission('integration.manage.platform') or (organization_id is not null and public.current_user_in_organization(organization_id)));
create policy "maintenance_public_read" on public.maintenance_windows for select using (status in ('scheduled','active') or public.current_user_has_permission('maintenance.manage.platform'));
create policy "maintenance_admin_write" on public.maintenance_windows for all using (public.current_user_has_permission('maintenance.manage.platform')) with check (public.current_user_has_permission('maintenance.manage.platform'));
create policy "migration_jobs_admin" on public.launch_migration_jobs for select using (public.current_user_has_permission('settings.manage.platform'));
create policy "feedback_own_or_admin" on public.product_feedback for select using (user_id = auth.uid() or public.current_user_has_permission('support.manage.assigned'));
create policy "feedback_create_own" on public.product_feedback for insert with check (user_id = auth.uid());
