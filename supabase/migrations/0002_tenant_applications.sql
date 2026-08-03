alter table public.schools
  add column if not exists theme_color text default '#0F766E',
  add column if not exists featured boolean not null default false,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

alter table public.schools drop constraint if exists schools_status_check;
alter table public.schools
  add constraint schools_status_check check (status in ('draft', 'published', 'archived', 'active', 'hidden', 'retired'));

update public.schools set status = 'published' where status = 'active';

alter table public.categories
  add column if not exists icon_path text,
  add column if not exists merged_into_id uuid references public.categories(id),
  add column if not exists archived_at timestamptz,
  add column if not exists restored_at timestamptz;

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  school_id uuid references public.schools(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  academy_name text not null,
  slug text not null,
  short_description text not null,
  school_id uuid references public.schools(id),
  website text,
  experience text,
  country text not null default 'KE',
  county text,
  logo_path text,
  banner_path text,
  why_teach text not null,
  expected_audience text not null,
  terms_accepted boolean not null default false,
  status text not null default 'draft' check (status in ('draft','submitted','under_review','changes_requested','approved','rejected','suspended','archived','closed')),
  reviewer_id uuid references public.profiles(id),
  review_notes text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_branding (
  academy_id uuid primary key references public.academies(id) on delete cascade,
  accent_color text not null default '#0F766E',
  mission text,
  website text,
  social_links jsonb not null default '{}',
  contact_email text,
  phone text,
  location text,
  support_email text,
  public_visibility text not null default 'private' check (public_visibility in ('private','public','unlisted')),
  seo jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_members (
  id uuid primary key default gen_random_uuid(),
  academy_id uuid not null references public.academies(id) on delete cascade,
  workspace_member_id uuid not null references public.workspace_members(id) on delete cascade,
  role_label text not null,
  status text not null default 'active' check (status in ('invited','active','limited','suspended','removed')),
  created_at timestamptz not null default now(),
  unique (academy_id, workspace_member_id)
);

create table if not exists public.instructor_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  biography text not null,
  experience text,
  expertise text not null,
  school_id uuid references public.schools(id),
  skill_ids uuid[] not null default '{}',
  languages text[] not null default '{}',
  teaching_style text,
  portfolio_links jsonb not null default '[]',
  resume_path text,
  sample_lesson_url text,
  availability text,
  identity_confirmation boolean not null default false,
  child_teaching_preference text not null default 'not_requested',
  status text not null default 'draft' check (status in ('draft','submitted','review','approved','rejected','suspended','archived')),
  reviewer_id uuid references public.profiles(id),
  review_notes text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instructor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  slug text unique not null,
  photo_path text,
  biography text not null,
  verification_level text not null default 'unverified',
  school_ids uuid[] not null default '{}',
  skill_ids uuid[] not null default '{}',
  teaching_languages text[] not null default '{}',
  availability text,
  social_links jsonb not null default '{}',
  public_visibility text not null default 'public' check (public_visibility in ('private','public','unlisted')),
  status text not null default 'active' check (status in ('draft','active','suspended','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizations
  add column if not exists industry text,
  add column if not exists country text not null default 'KE',
  add column if not exists county text,
  add column if not exists description text,
  add column if not exists website text,
  add column if not exists primary_contact text,
  add column if not exists employee_size text,
  add column if not exists public_visibility text not null default 'private' check (public_visibility in ('private','public','unlisted'));

create table if not exists public.organization_departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  parent_id uuid references public.organization_departments(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  status text not null default 'active' check (status in ('active','archived')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, parent_id, slug)
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_member_id uuid not null references public.workspace_members(id) on delete cascade,
  department_id uuid references public.organization_departments(id) on delete set null,
  role_label text not null,
  status text not null default 'active' check (status in ('invited','active','limited','suspended','removed')),
  created_at timestamptz not null default now(),
  unique (organization_id, workspace_member_id)
);

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  academy_id uuid references public.academies(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  email text not null,
  role_id uuid not null references public.roles(id),
  role_label text not null,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','cancelled','expired')),
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  invited_by uuid not null references public.profiles(id),
  accepted_by uuid references public.profiles(id),
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, email, role_id, status)
);

create table if not exists public.review_queue (
  id uuid primary key default gen_random_uuid(),
  resource_type text not null check (resource_type in ('academy_application','instructor_application','organization','verification')),
  resource_id uuid not null,
  status text not null default 'open' check (status in ('open','under_review','changes_requested','approved','rejected','suspended','archived','closed')),
  assigned_to uuid references public.profiles(id),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (resource_type, resource_id)
);

create table if not exists public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  subject_user_id uuid not null references public.profiles(id) on delete cascade,
  instructor_profile_id uuid references public.instructor_profiles(id) on delete cascade,
  level_requested text not null,
  status text not null default 'submitted' check (status in ('draft','submitted','review','approved','rejected','expired')),
  evidence jsonb not null default '{}',
  reviewer_id uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  resource_type text,
  resource_id text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.permissions (code, resource, action, scope, description) values
('academy_settings.edit.academy', 'academy_settings', 'edit', 'academy', 'Edit academy settings.'),
('academy_team.invite.academy', 'academy_team', 'invite', 'academy', 'Invite academy team members.'),
('academy_brand.edit.academy', 'academy_brand', 'edit', 'academy', 'Edit academy branding.'),
('academy_analytics.view.academy', 'academy_analytics', 'view', 'academy', 'View academy analytics.'),
('academy_finance.view.academy', 'academy_finance', 'view', 'academy', 'View academy finance.'),
('academy_review.manage.academy', 'academy_review', 'manage', 'academy', 'Manage academy reviews.'),
('academy_course.publish.academy', 'academy_course', 'publish', 'academy', 'Publish academy courses after review.'),
('academy_student.view.academy', 'academy_student', 'view', 'academy', 'View academy learner records.'),
('academy_community.manage.academy', 'academy_community', 'manage', 'academy', 'Manage academy community.'),
('academy_events.manage.academy', 'academy_events', 'manage', 'academy', 'Manage academy events.'),
('academy_marketplace.manage.academy', 'academy_marketplace', 'manage', 'academy', 'Manage academy marketplace items.'),
('taxonomy.manage.platform', 'taxonomy', 'manage', 'platform', 'Manage schools, categories, and skills.'),
('application.review.platform', 'application', 'review', 'platform', 'Review academy and instructor applications.'),
('invitation.manage.assigned', 'invitation', 'manage', 'assigned', 'Manage assigned workspace invitations.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on
  (r.slug in ('academy-owner','academy-administrator') and p.code in (
    'academy_settings.edit.academy','academy_team.invite.academy','academy_brand.edit.academy',
    'academy_analytics.view.academy','academy_review.manage.academy','academy_course.publish.academy',
    'academy_student.view.academy','academy_community.manage.academy','academy_events.manage.academy',
    'academy_marketplace.manage.academy','invitation.manage.assigned'
  ))
  or (r.slug = 'academy-finance-manager' and p.code in ('academy_finance.view.academy'))
  or (r.slug in ('platform-administrator','super-admin','founding-super-admin') and p.code in (
    'taxonomy.manage.platform','application.review.platform','academy_settings.edit.academy',
    'academy_team.invite.academy','academy_brand.edit.academy','academy_analytics.view.academy',
    'academy_finance.view.academy','academy_review.manage.academy','academy_course.publish.academy',
    'academy_student.view.academy','academy_community.manage.academy','academy_events.manage.academy',
    'academy_marketplace.manage.academy','invitation.manage.assigned'
  ))
on conflict do nothing;

insert into public.skills (name, slug, description) values
('Payroll Processing', 'payroll-processing', 'Practical payroll processing skill.'),
('Labour Law', 'labour-law', 'Labour law awareness and application.'),
('Employee Relations', 'employee-relations', 'Employee relations and workplace communication.'),
('Recruitment', 'recruitment', 'Recruitment planning and execution.'),
('Excel', 'excel', 'Spreadsheet productivity and analysis.'),
('Leadership', 'leadership', 'Team leadership and decision-making.'),
('Conflict Resolution', 'conflict-resolution', 'Structured conflict resolution.'),
('Music Theory', 'music-theory', 'Music theory foundations.'),
('Guitar', 'guitar', 'Guitar practice and performance.'),
('Piano', 'piano', 'Piano practice and performance.'),
('Coding', 'coding', 'Software development foundations.'),
('Flutter', 'flutter', 'Flutter application development.'),
('Accounting', 'accounting', 'Accounting foundations.'),
('Business Planning', 'business-planning', 'Business planning and execution.')
on conflict (slug) do nothing;

create trigger skills_touch before update on public.skills for each row execute function public.touch_updated_at();
create trigger academy_applications_touch before update on public.academy_applications for each row execute function public.touch_updated_at();
create trigger instructor_applications_touch before update on public.instructor_applications for each row execute function public.touch_updated_at();
create trigger instructor_profiles_touch before update on public.instructor_profiles for each row execute function public.touch_updated_at();
create trigger organization_departments_touch before update on public.organization_departments for each row execute function public.touch_updated_at();
create trigger review_queue_touch before update on public.review_queue for each row execute function public.touch_updated_at();
create trigger verification_requests_touch before update on public.verification_requests for each row execute function public.touch_updated_at();

create or replace function public.notify_user(target_user_id uuid, event_type text, event_title text, event_body text, resource_type text default null, resource_id text default null)
returns void
security definer
set search_path = public
language sql
as $$
  insert into public.notifications (user_id, type, title, body, resource_type, resource_id)
  values (target_user_id, event_type, event_title, event_body, resource_type, resource_id);
$$;

create or replace function public.approve_academy_application(application_id uuid, reviewer uuid, review_note text default null)
returns uuid
security definer
set search_path = public
language plpgsql
as $$
declare
  app public.academy_applications%rowtype;
  academy_workspace_id uuid;
  academy_id uuid;
  owner_role_id uuid;
  member_id uuid;
begin
  select * into app from public.academy_applications where id = application_id for update;
  if app.id is null then
    raise exception 'Academy application not found.';
  end if;

  insert into public.workspaces (name, slug, type, owner_id, status)
  values (app.academy_name, 'academy-' || app.slug, 'academy', app.applicant_id, 'active')
  on conflict (slug) do update set status = 'active'
  returning id into academy_workspace_id;

  insert into public.academies (name, slug, description, owner_id, workspace_id, status, visibility, logo_path, banner_path)
  values (app.academy_name, app.slug, app.short_description, app.applicant_id, academy_workspace_id, 'draft', 'private', app.logo_path, app.banner_path)
  on conflict (slug) do update set status = 'draft'
  returning id into academy_id;

  insert into public.academy_branding (academy_id, website, public_visibility)
  values (academy_id, app.website, 'private')
  on conflict (academy_id) do nothing;

  insert into public.workspace_members (workspace_id, user_id, status, joined_at)
  values (academy_workspace_id, app.applicant_id, 'active', now())
  on conflict (workspace_id, user_id) do update set status = 'active'
  returning id into member_id;

  select id into owner_role_id from public.roles where slug = 'academy-owner';
  insert into public.user_role_assignments (user_id, role_id, workspace_id, scope, assigned_by, reason)
  values (app.applicant_id, owner_role_id, academy_workspace_id, 'academy', reviewer, 'academy application approved')
  on conflict do nothing;

  insert into public.academy_members (academy_id, workspace_member_id, role_label, status)
  values (academy_id, member_id, 'Academy Owner', 'active')
  on conflict do nothing;

  update public.academy_applications
  set status = 'approved', reviewer_id = reviewer, review_notes = review_note, reviewed_at = now()
  where id = application_id;

  update public.review_queue set status = 'approved', assigned_to = reviewer, notes = review_note where resource_type = 'academy_application' and resource_id = application_id;

  perform public.notify_user(app.applicant_id, 'application_approved', 'Academy approved', 'Your academy workspace has been created.', 'academy', academy_id::text);

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, workspace_id, reason, success)
  values (reviewer, 'academy_application_approved', 'academy_application', application_id::text, academy_workspace_id, review_note, true);

  return academy_id;
end;
$$;

create or replace function public.accept_workspace_invitation(invitation_token text, accepting_user uuid)
returns uuid
security definer
set search_path = public
language plpgsql
as $$
declare
  inv public.workspace_invitations%rowtype;
  member_id uuid;
begin
  select * into inv from public.workspace_invitations where token = invitation_token for update;
  if inv.id is null or inv.status <> 'pending' or inv.expires_at < now() then
    raise exception 'Invitation is not available.';
  end if;

  insert into public.workspace_members (workspace_id, user_id, status, joined_at)
  values (inv.workspace_id, accepting_user, 'active', now())
  on conflict (workspace_id, user_id) do update set status = 'active'
  returning id into member_id;

  insert into public.user_role_assignments (user_id, role_id, workspace_id, scope, assigned_by, reason)
  values (accepting_user, inv.role_id, inv.workspace_id, 'assigned', inv.invited_by, 'workspace invitation accepted')
  on conflict do nothing;

  update public.workspace_invitations
  set status = 'accepted', accepted_by = accepting_user, accepted_at = now()
  where id = inv.id;

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, workspace_id, success)
  values (accepting_user, 'workspace_invitation_accepted', 'workspace_invitation', inv.id::text, inv.workspace_id, true);

  return member_id;
end;
$$;

alter table public.skills enable row level security;
alter table public.academy_applications enable row level security;
alter table public.academy_branding enable row level security;
alter table public.academy_members enable row level security;
alter table public.instructor_applications enable row level security;
alter table public.instructor_profiles enable row level security;
alter table public.organization_departments enable row level security;
alter table public.organization_members enable row level security;
alter table public.workspace_invitations enable row level security;
alter table public.review_queue enable row level security;
alter table public.verification_requests enable row level security;
alter table public.notifications enable row level security;

create policy "skills_public_read" on public.skills for select using (status = 'active' or public.current_user_has_permission('taxonomy.manage.platform'));
create policy "skills_manage_platform" on public.skills for all using (public.current_user_has_permission('taxonomy.manage.platform')) with check (public.current_user_has_permission('taxonomy.manage.platform'));

create policy "academy_applications_owner_or_reviewer" on public.academy_applications for select using (applicant_id = auth.uid() or public.current_user_has_permission('application.review.platform'));
create policy "academy_applications_create_own" on public.academy_applications for insert with check (applicant_id = auth.uid() and terms_accepted = true);
create policy "academy_applications_update_owner_draft" on public.academy_applications for update using (applicant_id = auth.uid() and status in ('draft','changes_requested')) with check (applicant_id = auth.uid());
create policy "academy_applications_review_platform" on public.academy_applications for update using (public.current_user_has_permission('application.review.platform')) with check (public.current_user_has_permission('application.review.platform'));

create policy "academy_branding_member_read" on public.academy_branding for select using (
  public_visibility = 'public'
  or exists (select 1 from public.academies a join public.workspace_members wm on wm.workspace_id = a.workspace_id where a.id = academy_branding.academy_id and wm.user_id = auth.uid() and wm.status = 'active')
  or public.current_user_has_permission('settings.manage.platform')
);
create policy "academy_branding_member_edit" on public.academy_branding for update using (
  exists (select 1 from public.academies a where a.id = academy_branding.academy_id and a.owner_id = auth.uid())
  or public.current_user_has_permission('settings.manage.platform')
) with check (true);

create policy "academy_members_tenant_read" on public.academy_members for select using (
  exists (
    select 1 from public.academies a
    join public.workspace_members wm on wm.workspace_id = a.workspace_id
    where a.id = academy_members.academy_id and wm.user_id = auth.uid() and wm.status = 'active'
  )
  or public.current_user_has_permission('settings.manage.platform')
);

create policy "instructor_applications_owner_or_reviewer" on public.instructor_applications for select using (applicant_id = auth.uid() or public.current_user_has_permission('application.review.platform'));
create policy "instructor_applications_create_own" on public.instructor_applications for insert with check (applicant_id = auth.uid());
create policy "instructor_applications_update_owner_draft" on public.instructor_applications for update using (applicant_id = auth.uid() and status in ('draft','submitted')) with check (applicant_id = auth.uid());
create policy "instructor_applications_review_platform" on public.instructor_applications for update using (public.current_user_has_permission('application.review.platform')) with check (public.current_user_has_permission('application.review.platform'));

create policy "instructor_profiles_public_read" on public.instructor_profiles for select using (public_visibility = 'public' and status = 'active' or user_id = auth.uid() or public.current_user_has_permission('application.review.platform'));
create policy "instructor_profiles_owner_update" on public.instructor_profiles for update using (user_id = auth.uid() or public.current_user_has_permission('application.review.platform')) with check (true);

create policy "organization_departments_member_read" on public.organization_departments for select using (
  exists (select 1 from public.organizations o join public.workspace_members wm on wm.workspace_id = o.workspace_id where o.id = organization_departments.organization_id and wm.user_id = auth.uid() and wm.status = 'active')
  or public.current_user_has_permission('settings.manage.platform')
);

create policy "organization_departments_admin_write" on public.organization_departments for all using (
  exists (select 1 from public.organizations o where o.id = organization_departments.organization_id and o.owner_id = auth.uid())
  or public.current_user_has_permission('settings.manage.platform')
) with check (true);

create policy "organization_members_tenant_read" on public.organization_members for select using (
  exists (
    select 1 from public.organizations o
    join public.workspace_members wm on wm.workspace_id = o.workspace_id
    where o.id = organization_members.organization_id and wm.user_id = auth.uid() and wm.status = 'active'
  )
  or public.current_user_has_permission('settings.manage.platform')
);

create policy "workspace_invitations_tenant_read" on public.workspace_invitations for select using (
  invited_by = auth.uid()
  or accepted_by = auth.uid()
  or exists (select 1 from public.workspace_members wm where wm.workspace_id = workspace_invitations.workspace_id and wm.user_id = auth.uid() and wm.status = 'active')
  or public.current_user_has_permission('settings.manage.platform')
);
create policy "workspace_invitations_tenant_create" on public.workspace_invitations for insert with check (
  invited_by = auth.uid()
  and exists (select 1 from public.workspace_members wm where wm.workspace_id = workspace_invitations.workspace_id and wm.user_id = auth.uid() and wm.status = 'active')
);

create policy "review_queue_platform" on public.review_queue for all using (public.current_user_has_permission('application.review.platform')) with check (public.current_user_has_permission('application.review.platform'));
create policy "verification_requests_owner_or_reviewer" on public.verification_requests for select using (subject_user_id = auth.uid() or public.current_user_has_permission('application.review.platform'));
create policy "notifications_own" on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
