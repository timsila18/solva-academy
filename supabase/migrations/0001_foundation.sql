create extension if not exists "pgcrypto";

create table public.account_statuses (
  code text primary key,
  label text not null,
  is_active boolean not null default false,
  sort_order integer not null default 0
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  display_name text,
  avatar_path text,
  headline text,
  biography text,
  email text not null,
  phone text,
  country text not null default 'KE',
  county text,
  preferred_language text not null default 'en',
  time_zone text not null default 'Africa/Nairobi',
  age_bracket text not null default 'adult',
  account_status text not null default 'email_unverified' references public.account_statuses(code),
  onboarding_status text not null default 'started',
  public_profile_visibility text not null default 'limited' check (public_profile_visibility in ('private', 'limited', 'public')),
  is_founding_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  active_role_assignment_id uuid,
  active_workspace_id uuid,
  recent_workspace_ids uuid[] not null default '{}',
  notifications jsonb not null default '{}',
  accessibility jsonb not null default '{}',
  privacy jsonb not null default '{}',
  low_data_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  scope text not null check (scope in ('own', 'assigned', 'course', 'academy', 'organization', 'school', 'platform')),
  is_system boolean not null default false,
  is_protected boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (code ~ '^[a-z0-9_]+\.[a-z0-9_]+\.(own|assigned|course|academy|organization|school|platform)$'),
  resource text not null,
  action text not null,
  scope text not null check (scope in ('own', 'assigned', 'course', 'academy', 'organization', 'school', 'platform')),
  description text,
  is_system boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('personal_learning', 'tutor', 'academy', 'organization', 'platform_admin')),
  owner_id uuid references public.profiles(id),
  status text not null default 'active' check (status in ('draft', 'active', 'limited', 'restricted', 'suspended', 'archived')),
  branding jsonb not null default '{}',
  tenant_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('invited', 'active', 'limited', 'suspended', 'left')),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.user_role_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  scope text not null check (scope in ('own', 'assigned', 'course', 'academy', 'organization', 'school', 'platform')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active', 'inactive', 'expired', 'revoked')),
  assigned_by uuid references public.profiles(id),
  reason text,
  created_at timestamptz not null default now()
);

create table public.workspace_role_assignments (
  id uuid primary key default gen_random_uuid(),
  workspace_member_id uuid not null references public.workspace_members(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (workspace_member_id, role_id)
);

create table public.workspace_settings (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  settings jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  status text not null default 'draft' check (status in ('draft', 'active', 'hidden', 'archived', 'retired')),
  visibility text not null default 'public' check (visibility in ('public', 'hidden', 'admin_only')),
  display_order integer not null default 0,
  icon_path text,
  banner_path text,
  seo jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  parent_id uuid references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  status text not null default 'draft',
  visibility text not null default 'public',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, parent_id, slug)
);

create table public.academies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  owner_id uuid not null references public.profiles(id),
  workspace_id uuid not null references public.workspaces(id),
  status text not null default 'draft',
  visibility text not null default 'private',
  logo_path text,
  banner_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null,
  owner_id uuid not null references public.profiles(id),
  workspace_id uuid not null references public.workspaces(id),
  status text not null default 'draft',
  logo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.feature_flags (
  key text primary key,
  description text not null,
  enabled boolean not null default false,
  environment text not null default 'all',
  user_allowlist uuid[] not null default '{}',
  role_allowlist text[] not null default '{}',
  workspace_allowlist uuid[] not null default '{}',
  percentage_rollout integer not null default 0 check (percentage_rollout between 0 and 100),
  owner text,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.system_settings (
  key text primary key,
  value jsonb not null,
  is_sensitive boolean not null default false,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  email_enabled boolean not null default true,
  in_app_enabled boolean not null default true,
  sms_enabled boolean not null default false,
  preferences jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.support_access_sessions (
  id uuid primary key default gen_random_uuid(),
  support_user_id uuid not null references public.profiles(id),
  subject_user_id uuid not null references public.profiles(id),
  reason text not null,
  status text not null default 'requested',
  starts_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  workspace_id uuid,
  previous_data jsonb,
  new_data jsonb,
  reason text,
  correlation_id text,
  ip_metadata inet,
  success boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.account_statuses (code, label, is_active, sort_order) values
('invited', 'Invited', false, 10),
('registered', 'Registered', false, 20),
('email_unverified', 'Email Unverified', false, 30),
('active', 'Active', true, 40),
('limited', 'Limited', true, 50),
('under_review', 'Under Review', false, 60),
('temporarily_suspended', 'Temporarily Suspended', false, 70),
('suspended', 'Suspended', false, 80),
('deactivated', 'Deactivated', false, 90),
('archived', 'Archived', false, 100),
('deleted', 'Deleted', false, 110),
('anonymized', 'Anonymized', false, 120)
on conflict (code) do nothing;

insert into public.roles (slug, name, description, scope, is_system, is_protected) values
('learner', 'Learner', 'Personal learning capability.', 'own', true, true),
('parent-guardian', 'Parent or Guardian', 'Guardian controls for child learning.', 'own', true, true),
('child-learner', 'Child Learner', 'Age-appropriate child learning.', 'own', true, true),
('instructor', 'Instructor', 'Teaching and course creation capability.', 'assigned', true, true),
('teaching-assistant', 'Teaching Assistant', 'Assist assigned courses.', 'assigned', true, true),
('academy-owner', 'Academy Owner', 'Own and manage an academy.', 'academy', true, true),
('academy-administrator', 'Academy Administrator', 'Manage assigned academy operations.', 'academy', true, true),
('academy-finance-manager', 'Academy Finance Manager', 'View academy finance and payouts.', 'academy', true, true),
('academy-content-manager', 'Academy Content Manager', 'Manage academy content.', 'academy', true, true),
('academy-moderator', 'Academy Moderator', 'Moderate academy communities.', 'academy', true, true),
('corporate-learner', 'Corporate Learner', 'Learner inside organization workspace.', 'organization', true, true),
('corporate-trainer', 'Corporate Trainer', 'Teach inside organization workspace.', 'organization', true, true),
('organization-administrator', 'Organization Administrator', 'Manage organization learning workspace.', 'organization', true, true),
('hr-learning-manager', 'HR or Learning Manager', 'Manage people learning assignments.', 'organization', true, true),
('department-manager', 'Department Manager', 'Manage assigned department learning.', 'organization', true, true),
('course-reviewer', 'Course Reviewer', 'Review assigned courses.', 'assigned', true, true),
('quality-reviewer', 'Quality Reviewer', 'Review quality and safety.', 'assigned', true, true),
('platform-moderator', 'Platform Moderator', 'Moderate platform-wide activity.', 'platform', true, true),
('finance-officer', 'Finance Officer', 'View and manage platform finance controls.', 'platform', true, true),
('support-agent', 'Support Agent', 'Provide logged support access.', 'platform', true, true),
('content-curator', 'Content Curator', 'Curate platform content.', 'platform', true, true),
('platform-administrator', 'Platform Administrator', 'Manage platform operations.', 'platform', true, true),
('super-admin', 'Super Admin', 'Highest ordinary platform administration role.', 'platform', true, true),
('founding-super-admin', 'Founding Super Admin', 'Protected founding platform administrator.', 'platform', true, true)
on conflict (slug) do update set name = excluded.name, is_system = true, is_protected = true;

insert into public.permissions (code, resource, action, scope, description) values
('profile.view.own', 'profile', 'view', 'own', 'View own profile.'),
('profile.edit.own', 'profile', 'edit', 'own', 'Edit own profile.'),
('workspace.view.assigned', 'workspace', 'view', 'assigned', 'View assigned workspaces.'),
('workspace.switch.assigned', 'workspace', 'switch', 'assigned', 'Switch assigned workspace context.'),
('academy.create.own', 'academy', 'create', 'own', 'Start own academy application.'),
('academy.view.assigned', 'academy', 'view', 'academy', 'View assigned academy.'),
('academy.manage.assigned', 'academy', 'manage', 'academy', 'Manage assigned academy.'),
('organization.view.assigned', 'organization', 'view', 'organization', 'View assigned organization.'),
('organization.manage.assigned', 'organization', 'manage', 'organization', 'Manage assigned organization.'),
('course.create.own', 'course', 'create', 'own', 'Create own course drafts.'),
('course.review.assigned', 'course', 'review', 'assigned', 'Review assigned courses.'),
('user.view.platform', 'user', 'view', 'platform', 'View platform users.'),
('role.manage.platform', 'role', 'manage', 'platform', 'Manage roles and assignments.'),
('settings.manage.platform', 'settings', 'manage', 'platform', 'Manage system settings.'),
('audit.view.platform', 'audit', 'view', 'platform', 'View audit logs.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on
  (r.slug = 'learner' and p.code in ('profile.view.own','profile.edit.own','workspace.view.assigned','workspace.switch.assigned','academy.create.own','course.create.own'))
  or (r.slug in ('instructor','academy-owner','academy-administrator') and p.code in ('profile.view.own','profile.edit.own','workspace.view.assigned','workspace.switch.assigned','academy.view.assigned','academy.manage.assigned','course.create.own'))
  or (r.slug in ('organization-administrator','hr-learning-manager') and p.code in ('profile.view.own','workspace.view.assigned','workspace.switch.assigned','organization.view.assigned','organization.manage.assigned'))
  or (r.slug in ('course-reviewer','quality-reviewer') and p.code in ('workspace.view.assigned','workspace.switch.assigned','course.review.assigned'))
  or (r.slug in ('platform-administrator','super-admin','founding-super-admin') and p.code in ('profile.view.own','profile.edit.own','workspace.view.assigned','workspace.switch.assigned','user.view.platform','role.manage.platform','settings.manage.platform','audit.view.platform'))
on conflict do nothing;

insert into public.schools (name, slug, description, status, display_order) values
('Human Resources', 'human-resources', 'Practical HR, payroll, compliance, and people operations learning.', 'active', 10),
('Music', 'music', 'Music learning across instruments, theory, and performance.', 'active', 20),
('Dance', 'dance', 'Dance learning across styles, practice, and performance.', 'active', 30),
('Academic Tutoring', 'academic-tutoring', 'Academic support for learners and guardians.', 'active', 40),
('Business and Entrepreneurship', 'business-entrepreneurship', 'Business, entrepreneurship, operations, and growth skills.', 'active', 50),
('Technology and AI', 'technology-ai', 'Technology, AI, software, data, and digital skills.', 'active', 60)
on conflict (slug) do nothing;

insert into public.feature_flags (key, description, enabled) values
('academy_applications', 'Academy application workflow.', false),
('instructor_applications', 'Instructor application workflow.', false),
('course_builder', 'Course builder and curriculum engine.', false),
('solco_live_classes', 'Solco live classes and events.', false),
('ai_tutor', 'AI tutor and mentor.', false),
('ai_course_creator', 'AI course creator.', false),
('marketplace', 'Learning marketplace.', false),
('enterprise_learning', 'Organization learning engine.', false),
('scholarships', 'Scholarship and sponsorship workflows.', false),
('affiliate_program', 'Affiliate program.', false),
('custom_domains', 'Academy custom domains.', false)
on conflict (key) do nothing;

insert into public.system_settings (key, value) values
('platform_name', '"Solva Academy"'),
('public_url', '"https://academy.solvaone.co.ke"'),
('support_email', '"support@solvaone.co.ke"'),
('default_currency', '"KES"'),
('default_country', '"KE"'),
('default_language', '"en"'),
('registration_enabled', 'true'),
('instructor_applications_enabled', 'false'),
('academy_applications_enabled', 'false'),
('maintenance_mode', 'false')
on conflict (key) do nothing;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger roles_touch before update on public.roles for each row execute function public.touch_updated_at();
create trigger workspaces_touch before update on public.workspaces for each row execute function public.touch_updated_at();
create trigger schools_touch before update on public.schools for each row execute function public.touch_updated_at();
create trigger categories_touch before update on public.categories for each row execute function public.touch_updated_at();
create trigger academies_touch before update on public.academies for each row execute function public.touch_updated_at();
create trigger organizations_touch before update on public.organizations for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  learner_role_id uuid;
  personal_workspace_id uuid;
begin
  insert into public.profiles (id, full_name, display_name, email, country, preferred_language, age_bracket, account_status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'country', 'KE'),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'en'),
    coalesce(new.raw_user_meta_data->>'age_bracket', 'adult'),
    case when new.email_confirmed_at is null then 'email_unverified' else 'active' end
  )
  on conflict (id) do nothing;

  insert into public.workspaces (name, slug, type, owner_id, status)
  values (
    'Personal Learning',
    'personal-learning-' || new.id::text,
    'personal_learning',
    new.id,
    'active'
  )
  on conflict (slug) do nothing
  returning id into personal_workspace_id;

  if personal_workspace_id is null then
    select id into personal_workspace_id from public.workspaces where slug = 'personal-learning-' || new.id::text;
  end if;

  insert into public.workspace_members (workspace_id, user_id, status, joined_at)
  values (personal_workspace_id, new.id, 'active', now())
  on conflict (workspace_id, user_id) do nothing;

  select id into learner_role_id from public.roles where slug = 'learner';
  insert into public.user_role_assignments (user_id, role_id, workspace_id, scope, reason)
  values (new.id, learner_role_id, personal_workspace_id, 'own', 'automatic learner bootstrap')
  on conflict do nothing;

  insert into public.user_preferences (user_id, active_workspace_id)
  values (new.id, personal_workspace_id)
  on conflict (user_id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, success)
  values (new.id, 'user_registered', 'user', new.id::text, true);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.current_user_has_permission(permission_code text)
returns boolean
stable
security definer
set search_path = public
language sql
as $$
  select exists (
    select 1
    from public.user_role_assignments ura
    join public.role_permissions rp on rp.role_id = ura.role_id
    join public.permissions p on p.id = rp.permission_id
    join public.profiles pr on pr.id = ura.user_id
    where ura.user_id = auth.uid()
      and ura.status = 'active'
      and (ura.expires_at is null or ura.expires_at > now())
      and p.code = permission_code
      and pr.account_status in ('active', 'limited')
  );
$$;

create or replace function public.bootstrap_founding_super_admin(founder_email text default 'timsila18@gmail.com')
returns void
security definer
set search_path = public
language plpgsql
as $$
declare
  founder_user_id uuid;
  platform_workspace_id uuid;
  role_record record;
begin
  select id into founder_user_id from auth.users where lower(email) = lower(founder_email);
  if founder_user_id is null then
    raise exception 'Founding user must register before bootstrap.';
  end if;

  insert into public.workspaces (name, slug, type, owner_id, status)
  values ('Solva Academy Platform Administration', 'platform-administration', 'platform_admin', founder_user_id, 'active')
  on conflict (slug) do update set owner_id = excluded.owner_id, status = 'active'
  returning id into platform_workspace_id;

  update public.profiles
  set is_founding_admin = true, account_status = 'active'
  where id = founder_user_id;

  insert into public.workspace_members (workspace_id, user_id, status, joined_at)
  values (platform_workspace_id, founder_user_id, 'active', now())
  on conflict (workspace_id, user_id) do update set status = 'active';

  for role_record in
    select id, slug, scope from public.roles
    where slug in (
      'founding-super-admin','super-admin','platform-administrator','learner','instructor',
      'academy-owner','course-reviewer','quality-reviewer','platform-moderator','finance-officer',
      'organization-administrator','corporate-trainer','support-agent'
    )
  loop
    insert into public.user_role_assignments (user_id, role_id, workspace_id, scope, reason)
    values (founder_user_id, role_record.id, platform_workspace_id, role_record.scope, 'founding admin bootstrap')
    on conflict do nothing;
  end loop;

  update public.user_preferences
  set active_workspace_id = platform_workspace_id
  where user_id = founder_user_id;

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, workspace_id, reason, success)
  values (founder_user_id, 'founding_account_bootstrap', 'user', founder_user_id::text, platform_workspace_id, 'idempotent bootstrap', true);
end;
$$;

create or replace function public.prevent_founding_admin_lockout()
returns trigger
language plpgsql
as $$
declare
  founding_role_id uuid;
  remaining integer;
begin
  select id into founding_role_id from public.roles where slug = 'founding-super-admin';

  if old.role_id = founding_role_id and (tg_op = 'DELETE' or new.status <> 'active') then
    select count(*) into remaining
    from public.user_role_assignments
    where role_id = founding_role_id
      and status = 'active'
      and id <> old.id;

    if remaining < 1 then
      raise exception 'Cannot remove or revoke the last active Founding Super Admin.';
    end if;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger founding_admin_assignment_protect_update
before update on public.user_role_assignments
for each row execute function public.prevent_founding_admin_lockout();

create trigger founding_admin_assignment_protect_delete
before delete on public.user_role_assignments
for each row execute function public.prevent_founding_admin_lockout();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_role_assignments enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.workspace_role_assignments enable row level security;
alter table public.workspace_settings enable row level security;
alter table public.schools enable row level security;
alter table public.categories enable row level security;
alter table public.academies enable row level security;
alter table public.organizations enable row level security;
alter table public.feature_flags enable row level security;
alter table public.system_settings enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.support_access_sessions enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles_read_own_or_platform" on public.profiles for select
using (id = auth.uid() or public.current_user_has_permission('user.view.platform'));

create policy "profiles_update_own_safe" on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid() and is_founding_admin = (select is_founding_admin from public.profiles where id = auth.uid()));

create policy "preferences_own" on public.user_preferences for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "roles_read_authenticated" on public.roles for select to authenticated using (true);
create policy "roles_manage_platform" on public.roles for all
using (public.current_user_has_permission('role.manage.platform'))
with check (public.current_user_has_permission('role.manage.platform'));

create policy "permissions_read_authenticated" on public.permissions for select to authenticated using (true);
create policy "permissions_manage_platform" on public.permissions for all
using (public.current_user_has_permission('role.manage.platform'))
with check (public.current_user_has_permission('role.manage.platform'));

create policy "role_permissions_read_authenticated" on public.role_permissions for select to authenticated using (true);
create policy "role_permissions_manage_platform" on public.role_permissions for all
using (public.current_user_has_permission('role.manage.platform'))
with check (public.current_user_has_permission('role.manage.platform'));

create policy "user_roles_read_own_or_platform" on public.user_role_assignments for select
using (user_id = auth.uid() or public.current_user_has_permission('role.manage.platform'));

create policy "user_roles_manage_platform" on public.user_role_assignments for all
using (public.current_user_has_permission('role.manage.platform'))
with check (public.current_user_has_permission('role.manage.platform'));

create policy "workspaces_member_read" on public.workspaces for select
using (
  owner_id = auth.uid()
  or exists (select 1 from public.workspace_members wm where wm.workspace_id = id and wm.user_id = auth.uid() and wm.status = 'active')
  or public.current_user_has_permission('settings.manage.platform')
);

create policy "workspace_members_own_or_platform" on public.workspace_members for select
using (user_id = auth.uid() or public.current_user_has_permission('settings.manage.platform'));

create policy "workspace_settings_member_read" on public.workspace_settings for select
using (exists (select 1 from public.workspace_members wm where wm.workspace_id = workspace_settings.workspace_id and wm.user_id = auth.uid() and wm.status = 'active'));

create policy "schools_public_read" on public.schools for select using (visibility = 'public' and status = 'active' or public.current_user_has_permission('settings.manage.platform'));
create policy "schools_manage_platform" on public.schools for all
using (public.current_user_has_permission('settings.manage.platform'))
with check (public.current_user_has_permission('settings.manage.platform'));

create policy "categories_public_read" on public.categories for select using (visibility = 'public' or public.current_user_has_permission('settings.manage.platform'));
create policy "categories_manage_platform" on public.categories for all
using (public.current_user_has_permission('settings.manage.platform'))
with check (public.current_user_has_permission('settings.manage.platform'));

create policy "academies_public_or_member_read" on public.academies for select
using (
  visibility = 'public'
  or owner_id = auth.uid()
  or exists (select 1 from public.workspace_members wm where wm.workspace_id = academies.workspace_id and wm.user_id = auth.uid() and wm.status = 'active')
  or public.current_user_has_permission('settings.manage.platform')
);

create policy "organizations_member_read" on public.organizations for select
using (
  owner_id = auth.uid()
  or exists (select 1 from public.workspace_members wm where wm.workspace_id = organizations.workspace_id and wm.user_id = auth.uid() and wm.status = 'active')
  or public.current_user_has_permission('settings.manage.platform')
);

create policy "feature_flags_read_authenticated" on public.feature_flags for select to authenticated using (true);
create policy "feature_flags_manage_platform" on public.feature_flags for all
using (public.current_user_has_permission('settings.manage.platform'))
with check (public.current_user_has_permission('settings.manage.platform'));

create policy "system_settings_read_public_safe" on public.system_settings for select
using (is_sensitive = false or public.current_user_has_permission('settings.manage.platform'));
create policy "system_settings_manage_platform" on public.system_settings for all
using (public.current_user_has_permission('settings.manage.platform'))
with check (public.current_user_has_permission('settings.manage.platform'));

create policy "notification_preferences_own" on public.notification_preferences for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "support_sessions_platform_only" on public.support_access_sessions for all
using (public.current_user_has_permission('user.view.platform'))
with check (public.current_user_has_permission('user.view.platform'));

create policy "audit_logs_platform_read" on public.audit_logs for select
using (public.current_user_has_permission('audit.view.platform'));

create policy "audit_logs_no_client_write" on public.audit_logs for insert
with check (false);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
('profile-avatars', 'profile-avatars', false, 2097152, array['image/png','image/jpeg','image/webp']),
('platform-branding', 'platform-branding', true, 2097152, array['image/png','image/jpeg','image/webp','image/svg+xml']),
('school-images', 'school-images', true, 5242880, array['image/png','image/jpeg','image/webp']),
('academy-branding', 'academy-branding', true, 5242880, array['image/png','image/jpeg','image/webp']),
('organization-branding', 'organization-branding', true, 5242880, array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;
