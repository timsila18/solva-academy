alter table public.organization_departments
  add column if not exists manager_id uuid references public.profiles(id),
  add column if not exists cost_center text,
  add column if not exists learning_coordinator_id uuid references public.profiles(id);

create table if not exists public.enterprise_employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  department_id uuid references public.organization_departments(id) on delete set null,
  manager_employee_id uuid references public.enterprise_employees(id) on delete set null,
  employee_number text,
  full_name text not null,
  email text not null,
  role_title text,
  location text,
  employment_type text not null default 'employee' check (employment_type in ('employee','contractor','intern','volunteer','student','external_trainee')),
  learning_status text not null default 'not_started' check (learning_status in ('not_started','active','overdue','completed','paused','archived')),
  status text not null default 'active' check (status in ('invited','active','limited','suspended','archived','offboarded')),
  started_at date,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, email),
  unique (organization_id, employee_number)
);

create table if not exists public.enterprise_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  department_id uuid references public.organization_departments(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  team_type text not null default 'team' check (team_type in ('team','project','committee','taskforce')),
  manager_employee_id uuid references public.enterprise_employees(id) on delete set null,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.enterprise_team_members (
  team_id uuid not null references public.enterprise_teams(id) on delete cascade,
  employee_id uuid not null references public.enterprise_employees(id) on delete cascade,
  role_label text not null default 'Member',
  created_at timestamptz not null default now(),
  primary key (team_id, employee_id)
);

create table if not exists public.enterprise_internal_academies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  academy_id uuid references public.academies(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  visibility text not null default 'private' check (visibility in ('private','organization','public','unlisted')),
  status text not null default 'draft' check (status in ('draft','active','suspended','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.enterprise_trainers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  trainer_type text not null default 'corporate_trainer' check (trainer_type in ('corporate_trainer','department_trainer','compliance_trainer','hr_trainer','guest_trainer','internal_reviewer')),
  department_id uuid references public.organization_departments(id) on delete set null,
  status text not null default 'active' check (status in ('active','limited','suspended','archived')),
  assigned_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, trainer_type)
);

create table if not exists public.enterprise_learning_paths (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  path_type text not null default 'role_path' check (path_type in ('role_path','onboarding','compliance','succession','custom')),
  completion_rules jsonb not null default '{}',
  certificate_pathway jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','active','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.enterprise_learning_path_items (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.enterprise_learning_paths(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  title text,
  display_order integer not null default 0,
  required boolean not null default true,
  completion_rule text not null default 'complete_course',
  created_at timestamptz not null default now()
);

create table if not exists public.enterprise_campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  campaign_type text not null default 'learning' check (campaign_type in ('learning','onboarding','compliance','skills','renewal')),
  starts_at timestamptz,
  ends_at timestamptz,
  target_audience jsonb not null default '{}',
  success_metrics jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','active','paused','completed','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.enterprise_learning_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  learning_path_id uuid references public.enterprise_learning_paths(id) on delete set null,
  campaign_id uuid references public.enterprise_campaigns(id) on delete set null,
  title text not null,
  target_type text not null check (target_type in ('employee','department','team','role','organization')),
  target_employee_id uuid references public.enterprise_employees(id) on delete cascade,
  target_department_id uuid references public.organization_departments(id) on delete cascade,
  target_team_id uuid references public.enterprise_teams(id) on delete cascade,
  target_role text,
  mandatory boolean not null default true,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  reason text,
  due_at timestamptz,
  reminder_schedule jsonb not null default '{}',
  certificate_required boolean not null default false,
  version_id uuid references public.course_versions(id) on delete set null,
  status text not null default 'assigned' check (status in ('assigned','started','in_progress','completed','overdue','expired','cancelled','waived','failed','reassigned')),
  assigned_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_assignment_events (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.enterprise_learning_assignments(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  from_status text,
  to_status text not null,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.enterprise_compliance_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid references public.enterprise_employees(id) on delete cascade,
  assignment_id uuid references public.enterprise_learning_assignments(id) on delete set null,
  compliance_type text not null,
  status text not null default 'assigned' check (status in ('assigned','completed','overdue','expiring','expired','waived','failed')),
  certificate_id uuid references public.certificates(id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz,
  risk_level text not null default 'normal' check (risk_level in ('low','normal','high','critical')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_skills (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  category text,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.enterprise_skill_requirements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  enterprise_skill_id uuid not null references public.enterprise_skills(id) on delete cascade,
  target_type text not null check (target_type in ('organization','department','team','role','employee')),
  department_id uuid references public.organization_departments(id) on delete cascade,
  team_id uuid references public.enterprise_teams(id) on delete cascade,
  employee_id uuid references public.enterprise_employees(id) on delete cascade,
  role_title text,
  requirement_level text not null default 'desired' check (requirement_level in ('required','desired')),
  created_at timestamptz not null default now()
);

create table if not exists public.enterprise_skill_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.enterprise_employees(id) on delete cascade,
  enterprise_skill_id uuid not null references public.enterprise_skills(id) on delete cascade,
  assessment_type text not null check (assessment_type in ('self','manager','trainer','certification','external_evidence')),
  evidence jsonb not null default '{}',
  status text not null default 'submitted' check (status in ('draft','submitted','reviewed','accepted','rejected')),
  assessed_by uuid references public.profiles(id),
  assessed_at timestamptz not null default now()
);

create table if not exists public.enterprise_transcripts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  employee_id uuid not null references public.enterprise_employees(id) on delete cascade,
  snapshot jsonb not null default '{}',
  generated_by uuid references public.profiles(id),
  generated_at timestamptz not null default now(),
  export_status text not null default 'ready' check (export_status in ('ready','queued','exported','failed')),
  unique (organization_id, employee_id, generated_at)
);

create table if not exists public.enterprise_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  report_type text not null check (report_type in ('completion','compliance','certificates','assignments','departments','learning_hours','trainer_activity','course_performance','employee_transcripts')),
  filters jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','queued','ready','failed','archived')),
  export_format text check (export_format in ('pdf','excel','csv')),
  file_path text,
  requested_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.enterprise_announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  campaign_id uuid references public.enterprise_campaigns(id) on delete set null,
  title text not null,
  body text not null,
  target_type text not null default 'organization' check (target_type in ('organization','department','team','employee')),
  department_id uuid references public.organization_departments(id) on delete cascade,
  team_id uuid references public.enterprise_teams(id) on delete cascade,
  employee_id uuid references public.enterprise_employees(id) on delete cascade,
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.enterprise_branding (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  logo_path text,
  banner_path text,
  accent_color text not null default '#0F766E',
  contact text,
  support text,
  welcome_message text,
  internal_homepage jsonb not null default '{}',
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_import_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_type text not null check (source_type in ('csv','excel','api','hr_integration')),
  file_path text,
  status text not null default 'draft' check (status in ('draft','preview','validated','importing','completed','failed','rolled_back')),
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  invalid_rows integer not null default 0,
  duplicate_emails integer not null default 0,
  duplicate_employee_numbers integer not null default 0,
  report jsonb not null default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.employee_import_results (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.employee_import_jobs(id) on delete cascade,
  row_number integer not null,
  email text,
  employee_number text,
  status text not null check (status in ('valid','invalid','imported','skipped','duplicate')),
  errors text[] not null default '{}',
  employee_id uuid references public.enterprise_employees(id) on delete set null,
  created_at timestamptz not null default now()
);

insert into public.permissions (code, resource, action, scope, description) values
('enterprise_employee.view.organization', 'enterprise_employee', 'view', 'organization', 'View organization employee learning records.'),
('enterprise_employee.manage.organization', 'enterprise_employee', 'manage', 'organization', 'Manage organization employees and imports.'),
('enterprise_assignment.manage.organization', 'enterprise_assignment', 'manage', 'organization', 'Manage organization learning assignments.'),
('enterprise_compliance.view.organization', 'enterprise_compliance', 'view', 'organization', 'View compliance dashboards.'),
('enterprise_report.view.organization', 'enterprise_report', 'view', 'organization', 'View enterprise reports.'),
('enterprise_skill.manage.organization', 'enterprise_skill', 'manage', 'organization', 'Manage organization skills.'),
('enterprise_trainer.manage.organization', 'enterprise_trainer', 'manage', 'organization', 'Manage organization trainers.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on
  (r.slug in ('organization-administrator','hr-learning-manager') and p.code in ('enterprise_employee.view.organization','enterprise_employee.manage.organization','enterprise_assignment.manage.organization','enterprise_compliance.view.organization','enterprise_report.view.organization','enterprise_skill.manage.organization','enterprise_trainer.manage.organization'))
  or (r.slug = 'department-manager' and p.code in ('enterprise_employee.view.organization','enterprise_assignment.manage.organization','enterprise_compliance.view.organization','enterprise_report.view.organization'))
  or (r.slug = 'corporate-trainer' and p.code in ('enterprise_employee.view.organization','enterprise_assignment.manage.organization'))
  or (r.slug in ('platform-administrator','super-admin','founding-super-admin') and p.code in ('enterprise_employee.view.organization','enterprise_report.view.organization'))
on conflict do nothing;

create or replace function public.current_user_in_organization(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organizations o
    join public.workspace_members wm on wm.workspace_id = o.workspace_id
    where o.id = target_organization_id and wm.user_id = auth.uid() and wm.status = 'active'
  ) or exists (
    select 1 from public.organizations o where o.id = target_organization_id and o.owner_id = auth.uid()
  );
$$;

create or replace function public.current_user_manages_organization(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.organizations o where o.id = target_organization_id and o.owner_id = auth.uid())
    or exists (
      select 1 from public.organizations o
      join public.organization_members om on om.organization_id = o.id
      join public.workspace_members wm on wm.id = om.workspace_member_id
      where o.id = target_organization_id and wm.user_id = auth.uid() and wm.status = 'active' and om.status = 'active'
        and om.role_label in ('Organization Admin','HR Manager','Learning Manager','Department Manager','Corporate Trainer','Support')
    )
    or public.current_user_has_permission('settings.manage.platform');
$$;

create or replace function public.current_user_employee_id(target_organization_id uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select ee.id from public.enterprise_employees ee where ee.organization_id = target_organization_id and ee.user_id = auth.uid() limit 1;
$$;

create or replace function public.current_user_manages_employee(target_employee_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.enterprise_employees employee
    join public.enterprise_employees manager on manager.id = employee.manager_employee_id
    where employee.id = target_employee_id and manager.user_id = auth.uid()
  );
$$;

alter table public.enterprise_employees enable row level security;
alter table public.enterprise_teams enable row level security;
alter table public.enterprise_team_members enable row level security;
alter table public.enterprise_internal_academies enable row level security;
alter table public.enterprise_trainers enable row level security;
alter table public.enterprise_learning_paths enable row level security;
alter table public.enterprise_learning_path_items enable row level security;
alter table public.enterprise_campaigns enable row level security;
alter table public.enterprise_learning_assignments enable row level security;
alter table public.enterprise_assignment_events enable row level security;
alter table public.enterprise_compliance_records enable row level security;
alter table public.enterprise_skills enable row level security;
alter table public.enterprise_skill_requirements enable row level security;
alter table public.enterprise_skill_assessments enable row level security;
alter table public.enterprise_transcripts enable row level security;
alter table public.enterprise_reports enable row level security;
alter table public.enterprise_announcements enable row level security;
alter table public.enterprise_branding enable row level security;
alter table public.employee_import_jobs enable row level security;
alter table public.employee_import_results enable row level security;

create policy "enterprise_employees_org_scope" on public.enterprise_employees for select using (
  user_id = auth.uid() or public.current_user_manages_employee(id) or public.current_user_manages_organization(organization_id)
);
create policy "enterprise_employees_manage" on public.enterprise_employees for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));

create policy "enterprise_teams_org_scope" on public.enterprise_teams for select using (public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_teams_manage" on public.enterprise_teams for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));
create policy "enterprise_team_members_org_scope" on public.enterprise_team_members for select using (exists (select 1 from public.enterprise_teams t where t.id = team_id and public.current_user_in_organization(t.organization_id)));

create policy "enterprise_internal_academies_org_scope" on public.enterprise_internal_academies for select using (visibility in ('organization','public') and public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_trainers_org_scope" on public.enterprise_trainers for select using (user_id = auth.uid() or public.current_user_manages_organization(organization_id));
create policy "enterprise_trainers_manage" on public.enterprise_trainers for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));

create policy "enterprise_paths_org_scope" on public.enterprise_learning_paths for select using (public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_paths_manage" on public.enterprise_learning_paths for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));
create policy "enterprise_path_items_org_scope" on public.enterprise_learning_path_items for select using (exists (select 1 from public.enterprise_learning_paths p where p.id = path_id and public.current_user_in_organization(p.organization_id)));

create policy "enterprise_campaigns_org_scope" on public.enterprise_campaigns for select using (public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_campaigns_manage" on public.enterprise_campaigns for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));

create policy "enterprise_assignments_scope" on public.enterprise_learning_assignments for select using (
  public.current_user_manages_organization(organization_id)
  or target_employee_id = public.current_user_employee_id(organization_id)
  or (target_employee_id is not null and public.current_user_manages_employee(target_employee_id))
);
create policy "enterprise_assignments_manage" on public.enterprise_learning_assignments for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));
create policy "enterprise_assignment_events_scope" on public.enterprise_assignment_events for select using (exists (select 1 from public.enterprise_learning_assignments a where a.id = assignment_id and (public.current_user_manages_organization(a.organization_id) or a.target_employee_id = public.current_user_employee_id(a.organization_id))));

create policy "enterprise_compliance_scope" on public.enterprise_compliance_records for select using (
  public.current_user_manages_organization(organization_id)
  or employee_id = public.current_user_employee_id(organization_id)
  or (employee_id is not null and public.current_user_manages_employee(employee_id))
);

create policy "enterprise_skills_org_scope" on public.enterprise_skills for select using (public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_skills_manage" on public.enterprise_skills for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));
create policy "enterprise_skill_requirements_scope" on public.enterprise_skill_requirements for select using (public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_skill_assessments_scope" on public.enterprise_skill_assessments for select using (public.current_user_manages_organization(organization_id) or employee_id = public.current_user_employee_id(organization_id) or public.current_user_manages_employee(employee_id));

create policy "enterprise_transcripts_scope" on public.enterprise_transcripts for select using (public.current_user_manages_organization(organization_id) or employee_id = public.current_user_employee_id(organization_id) or public.current_user_manages_employee(employee_id));
create policy "enterprise_reports_org_scope" on public.enterprise_reports for select using (public.current_user_manages_organization(organization_id));
create policy "enterprise_announcements_scope" on public.enterprise_announcements for select using (published_at is not null and public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_announcements_manage" on public.enterprise_announcements for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));
create policy "enterprise_branding_org_scope" on public.enterprise_branding for select using (public.current_user_in_organization(organization_id) or public.current_user_manages_organization(organization_id));
create policy "enterprise_branding_manage" on public.enterprise_branding for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));
create policy "employee_import_jobs_org_scope" on public.employee_import_jobs for select using (public.current_user_manages_organization(organization_id));
create policy "employee_import_jobs_manage" on public.employee_import_jobs for all using (public.current_user_manages_organization(organization_id)) with check (public.current_user_manages_organization(organization_id));
create policy "employee_import_results_org_scope" on public.employee_import_results for select using (exists (select 1 from public.employee_import_jobs j where j.id = import_job_id and public.current_user_manages_organization(j.organization_id)));

create or replace function public.create_enterprise_assignment_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.enterprise_assignment_events (assignment_id, actor_id, to_status, reason)
    values (new.id, new.assigned_by, new.status, 'Assignment created');
  elsif old.status is distinct from new.status then
    insert into public.enterprise_assignment_events (assignment_id, actor_id, from_status, to_status, reason)
    values (new.id, auth.uid(), old.status, new.status, 'Assignment status changed');
  end if;
  return new;
end;
$$;

drop trigger if exists enterprise_assignment_event_trigger on public.enterprise_learning_assignments;
create trigger enterprise_assignment_event_trigger
after insert or update of status on public.enterprise_learning_assignments
for each row execute function public.create_enterprise_assignment_event();
