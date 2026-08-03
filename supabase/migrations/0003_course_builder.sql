create table if not exists public.course_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active','archived')),
  rules jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.course_levels (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  display_order integer not null default 0,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  owning_workspace_id uuid not null references public.workspaces(id) on delete restrict,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  academy_id uuid references public.academies(id) on delete set null,
  platform_owned boolean not null default false,
  title text not null,
  slug text unique not null,
  subtitle text,
  short_description text not null,
  full_description text,
  school_id uuid references public.schools(id),
  primary_category_id uuid references public.categories(id),
  course_type_id uuid references public.course_types(id),
  level_id uuid references public.course_levels(id),
  language text not null default 'en',
  additional_languages text[] not null default '{}',
  country_relevance text[] not null default '{KE}',
  target_age_group text,
  target_profession text,
  target_learner text,
  prerequisites text,
  estimated_duration_minutes integer not null default 0 check (estimated_duration_minutes >= 0),
  delivery_format text not null default 'self_paced',
  thumbnail_path text,
  banner_path text,
  promotional_video_url text,
  visibility text not null default 'private' check (visibility in ('private','unlisted','public')),
  enrollment_status text not null default 'closed',
  certificate_available boolean not null default false,
  seo_title text,
  seo_description text,
  search_keywords text[] not null default '{}',
  preview_settings jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','in_development','ready_internal_review','submitted_review','under_review','changes_requested','resubmitted','approved','scheduled','published','unpublished','suspended','archived','rejected')),
  version_counter integer not null default 1,
  published_version_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_versions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  version_number integer not null,
  status text not null default 'draft' check (status in ('draft','under_review','approved','published','superseded','archived','rejected')),
  change_summary text,
  change_reason text,
  learner_migration_strategy text not null default 'keep_existing',
  compatibility jsonb not null default '{}',
  frozen_at timestamptz,
  published_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, version_number)
);

alter table public.courses
  add constraint courses_published_version_fk foreign key (published_version_id) references public.course_versions(id);

create table if not exists public.course_team_members (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_label text not null,
  role_slug text not null,
  status text not null default 'active' check (status in ('invited','active','removed','suspended')),
  created_at timestamptz not null default now(),
  unique (course_id, user_id, role_slug)
);

create table if not exists public.course_categories (
  course_id uuid not null references public.courses(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  primary key (course_id, category_id)
);

create table if not exists public.course_skills (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete restrict,
  target_proficiency text,
  importance text not null default 'secondary' check (importance in ('primary','secondary')),
  evidence_method text,
  public_display boolean not null default true,
  reviewer_note text,
  unique (course_id, skill_id)
);

create table if not exists public.course_learning_outcomes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  statement text not null,
  skill_id uuid references public.skills(id),
  competency_level text,
  assessment_linkage text,
  display_order integer not null default 0,
  required boolean not null default true,
  status text not null default 'active' check (status in ('active','archived'))
);

create table if not exists public.course_target_learners (
  course_id uuid primary key references public.courses(id) on delete cascade,
  who_for text,
  prior_knowledge text,
  gains text,
  not_for text,
  required_tools text,
  professional_background text,
  age_or_guardian text,
  device_capability text,
  required_software text
);

create table if not exists public.course_completion_rules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  rule_type text not null,
  config jsonb not null default '{}',
  required boolean not null default true,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  version_id uuid references public.course_versions(id) on delete cascade,
  title text not null,
  description text,
  learning_objectives text,
  estimated_duration_minutes integer not null default 0,
  display_order integer not null,
  required boolean not null default true,
  completion_rules jsonb not null default '{}',
  thumbnail_path text,
  instructor_notes text,
  learner_introduction text,
  status text not null default 'draft' check (status in ('draft','active','archived')),
  visibility text not null default 'private' check (visibility in ('private','preview','public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, version_id, display_order)
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.course_modules(id) on delete cascade,
  version_id uuid references public.course_versions(id) on delete cascade,
  title text not null,
  slug text not null,
  lesson_type text not null,
  short_summary text,
  learning_objective text,
  estimated_duration_minutes integer not null default 0,
  required boolean not null default true,
  preview_available boolean not null default false,
  completion_method text not null default 'view',
  instructor_notes text,
  learner_instructions text,
  transcript text,
  captions_path text,
  assessment_linkage text,
  status text not null default 'draft' check (status in ('draft','active','archived')),
  display_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug),
  unique (module_id, display_order)
);

create table if not exists public.lesson_content_blocks (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  block_type text not null,
  content jsonb not null default '{}',
  display_order integer not null,
  visibility text not null default 'learner' check (visibility in ('learner','instructor_only','reviewer_only')),
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, display_order)
);

create table if not exists public.lesson_prerequisites (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.course_lessons(id) on delete cascade,
  prerequisite_type text not null,
  prerequisite_lesson_id uuid references public.course_lessons(id) on delete restrict,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  check (lesson_id <> prerequisite_lesson_id)
);

create table if not exists public.course_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.course_modules(id) on delete set null,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  title text not null,
  description text,
  resource_type text not null,
  file_path text,
  external_url text,
  file_size_bytes bigint,
  owner_id uuid not null references public.profiles(id),
  download_permission text not null default 'enrolled',
  visibility text not null default 'private' check (visibility in ('private','preview','public')),
  version integer not null default 1,
  copyright_declaration text not null,
  attribution text,
  license text,
  status text not null default 'active' check (status in ('processing','active','failed','archived')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (file_path is not null or external_url is not null)
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid references public.course_modules(id) on delete set null,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  assessment_type text not null,
  title text not null,
  stakes text not null default 'practice',
  review_method text not null default 'automated',
  required boolean not null default false,
  passing_rule jsonb not null default '{}',
  attempt_rules jsonb not null default '{}',
  version integer not null default 1,
  completion_effect text,
  status text not null default 'draft' check (status in ('draft','active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid unique not null references public.assessments(id) on delete cascade,
  instructions text,
  practice_or_graded text not null default 'practice',
  passing_score numeric(5,2),
  attempts_allowed integer,
  time_limit_minutes integer,
  randomize_questions boolean not null default false,
  randomize_options boolean not null default false,
  feedback_timing text not null default 'after_submission',
  show_correct_answers boolean not null default false,
  show_explanations boolean not null default true,
  question_pool jsonb not null default '{}'
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  question_type text not null,
  points numeric(8,2) not null default 1,
  required boolean not null default true,
  scoring_criteria jsonb not null default '{}',
  explanation text,
  feedback_correct text,
  feedback_incorrect text,
  difficulty text,
  skill_id uuid references public.skills(id),
  learning_outcome_id uuid references public.course_learning_outcomes(id),
  media jsonb not null default '{}',
  tags text[] not null default '{}',
  reviewer_notes text,
  status text not null default 'active' check (status in ('active','archived')),
  display_order integer not null,
  unique (quiz_id, display_order)
);

create table if not exists public.quiz_question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  option_text text not null,
  match_value text,
  is_correct boolean not null default false,
  display_order integer not null,
  feedback text,
  unique (question_id, display_order)
);

create table if not exists public.quiz_scoring_rules (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  scoring_type text not null,
  config jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid unique not null references public.assessments(id) on delete cascade,
  instructions text not null,
  purpose text,
  allowed_submission_types text[] not null default '{}',
  file_restrictions jsonb not null default '{}',
  word_count_guidance text,
  resubmission_rules jsonb not null default '{}',
  academic_integrity_guidance text,
  due_date_rule jsonb not null default '{}'
);

create table if not exists public.rubrics (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  assignment_id uuid references public.assignments(id) on delete cascade,
  title text not null,
  description text,
  scoring_mode text not null default 'points',
  passing_threshold numeric(5,2),
  version integer not null default 1,
  status text not null default 'draft' check (status in ('draft','active','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.rubric_criteria (
  id uuid primary key default gen_random_uuid(),
  rubric_id uuid not null references public.rubrics(id) on delete cascade,
  name text not null,
  description text,
  weight numeric(6,2) not null default 0,
  learning_outcome_id uuid references public.course_learning_outcomes(id),
  skill_id uuid references public.skills(id),
  display_order integer not null,
  unique (rubric_id, display_order)
);

create table if not exists public.rubric_levels (
  id uuid primary key default gen_random_uuid(),
  criterion_id uuid not null references public.rubric_criteria(id) on delete cascade,
  label text not null,
  description text,
  points numeric(8,2) not null,
  display_order integer not null,
  unique (criterion_id, display_order)
);

create table if not exists public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  version_id uuid not null references public.course_versions(id) on delete cascade,
  review_type text not null default 'platform',
  status text not null default 'submitted' check (status in ('submitted','under_review','changes_requested','approved','rejected','escalated','closed')),
  submitted_by uuid not null references public.profiles(id),
  submitted_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.course_review_assignments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.course_reviews(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  role_label text not null default 'Reviewer',
  status text not null default 'assigned' check (status in ('assigned','in_progress','completed','declined')),
  due_at timestamptz,
  conflict_declaration text,
  created_at timestamptz not null default now(),
  unique (review_id, reviewer_id)
);

create table if not exists public.course_review_comments (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.course_reviews(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  comment_type text not null default 'general',
  body text not null,
  severity text not null default 'note' check (severity in ('note','minor','major','blocking')),
  status text not null default 'open' check (status in ('open','author_resolved','reviewer_closed')),
  attachment_path text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.course_review_checklists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school_id uuid references public.schools(id),
  course_type_id uuid references public.course_types(id),
  risk_level text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.course_review_checklist_items (
  id uuid primary key default gen_random_uuid(),
  checklist_id uuid not null references public.course_review_checklists(id) on delete cascade,
  label text not null,
  required boolean not null default true,
  display_order integer not null
);

create table if not exists public.course_review_responses (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.course_reviews(id) on delete cascade,
  checklist_item_id uuid not null references public.course_review_checklist_items(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id),
  response text not null check (response in ('pass','fail','not_applicable')),
  notes text,
  created_at timestamptz not null default now(),
  unique (review_id, checklist_item_id, reviewer_id)
);

create table if not exists public.course_risk_classifications (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  risk_level text not null default 'standard',
  reasons text[] not null default '{}',
  child_safety_review_required boolean not null default false,
  high_stakes_review_required boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.course_publication_events (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  version_id uuid not null references public.course_versions(id) on delete restrict,
  event_type text not null,
  actor_id uuid not null references public.profiles(id),
  scheduled_for timestamptz,
  occurred_at timestamptz not null default now(),
  snapshot jsonb not null default '{}',
  reason text
);

create table if not exists public.course_version_changes (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.course_versions(id) on delete cascade,
  change_type text not null,
  summary text not null,
  affected_resources jsonb not null default '{}',
  learner_impact text,
  regulatory_update boolean not null default false,
  urgency text not null default 'normal',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.course_preview_tokens (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  version_id uuid references public.course_versions(id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  created_by uuid not null references public.profiles(id),
  expires_at timestamptz not null default (now() + interval '7 days'),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.course_search_index (
  course_id uuid primary key references public.courses(id) on delete cascade,
  published_version_id uuid references public.course_versions(id),
  searchable_text text not null,
  indexed_at timestamptz not null default now()
);

create table if not exists public.course_analytics_events (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

insert into public.course_types (slug, name, description) values
('self-paced', 'Self-paced course', 'Learners progress through prepared content independently.'),
('cohort-based', 'Cohort-based course', 'Learners progress with a cohort.'),
('instructor-led', 'Instructor-led course', 'Instructor guides delivery.'),
('blended', 'Blended course', 'Self-paced and instructor-led learning.'),
('short-course', 'Short course', 'Focused short learning experience.'),
('masterclass', 'Masterclass', 'Expert-led deep dive.'),
('bootcamp', 'Bootcamp', 'Intensive practical training.'),
('professional-program', 'Professional program', 'Structured professional development.'),
('revision-course', 'Revision course', 'Exam or topic revision.'),
('workshop', 'Workshop', 'Practical workshop.'),
('compliance-course', 'Compliance course', 'Compliance learning.'),
('childrens-course', 'Children''s course', 'Child-oriented learning with safety review.')
on conflict (slug) do nothing;

insert into public.course_levels (slug, name, display_order) values
('beginner', 'Beginner', 10),
('foundation', 'Foundation', 20),
('intermediate', 'Intermediate', 30),
('advanced', 'Advanced', 40),
('professional', 'Professional', 50),
('expert', 'Expert', 60),
('all-levels', 'All Levels', 70)
on conflict (slug) do nothing;

insert into public.permissions (code, resource, action, scope, description) values
('course.view.assigned', 'course', 'view', 'assigned', 'View assigned courses.'),
('course.edit.assigned', 'course', 'edit', 'assigned', 'Edit assigned courses.'),
('course_curriculum.edit.assigned', 'course_curriculum', 'edit', 'assigned', 'Edit assigned curriculum.'),
('course_lesson.create.assigned', 'course_lesson', 'create', 'assigned', 'Create assigned course lessons.'),
('course_lesson.edit.assigned', 'course_lesson', 'edit', 'assigned', 'Edit assigned course lessons.'),
('course_resource.manage.assigned', 'course_resource', 'manage', 'assigned', 'Manage assigned course resources.'),
('course_quiz.manage.assigned', 'course_quiz', 'manage', 'assigned', 'Manage assigned course quizzes.'),
('course_assignment.manage.assigned', 'course_assignment', 'manage', 'assigned', 'Manage assigned course assignments.'),
('course_team.manage.assigned', 'course_team', 'manage', 'assigned', 'Manage course team.'),
('course.preview.assigned', 'course', 'preview', 'assigned', 'Preview assigned course.'),
('course.submit_review.assigned', 'course', 'submit_review', 'assigned', 'Submit course for review.'),
('course.approve.assigned', 'course', 'approve', 'assigned', 'Approve assigned course review.'),
('course.publish.assigned', 'course', 'publish', 'assigned', 'Publish approved course.'),
('course.archive.assigned', 'course', 'archive', 'assigned', 'Archive assigned course.'),
('course_version.create.assigned', 'course_version', 'create', 'assigned', 'Create new course version.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on
  (r.slug in ('instructor','academy-owner','academy-administrator','academy-content-manager') and p.code in (
    'course.create.own','course.view.assigned','course.edit.assigned','course_curriculum.edit.assigned',
    'course_lesson.create.assigned','course_lesson.edit.assigned','course_resource.manage.assigned',
    'course_quiz.manage.assigned','course_assignment.manage.assigned','course_team.manage.assigned',
    'course.preview.assigned','course.submit_review.assigned','course_version.create.assigned'
  ))
  or (r.slug in ('course-reviewer','quality-reviewer') and p.code in ('course.view.assigned','course.preview.assigned','course.review.assigned','course.approve.assigned'))
  or (r.slug in ('platform-administrator','super-admin','founding-super-admin') and p.code like 'course%')
on conflict do nothing;

create or replace function public.user_can_access_course(target_course_id uuid)
returns boolean
stable
security definer
set search_path = public
language sql
as $$
  select exists (
    select 1 from public.courses c
    where c.id = target_course_id
      and (
        (c.status = 'published' and c.visibility = 'public')
        or c.owner_id = auth.uid()
        or exists (select 1 from public.course_team_members ctm where ctm.course_id = c.id and ctm.user_id = auth.uid() and ctm.status = 'active')
        or exists (select 1 from public.workspace_members wm where wm.workspace_id = c.owning_workspace_id and wm.user_id = auth.uid() and wm.status = 'active')
        or public.current_user_has_permission('settings.manage.platform')
      )
  );
$$;

create or replace function public.course_readiness_errors(target_course_id uuid)
returns text[]
stable
security definer
set search_path = public
language plpgsql
as $$
declare
  errors text[] := '{}';
  course_record public.courses%rowtype;
  outcomes_count integer;
  modules_count integer;
  lessons_count integer;
begin
  select * into course_record from public.courses where id = target_course_id;
  if course_record.id is null then
    return array['Course not found'];
  end if;
  if length(coalesce(course_record.title, '')) < 3 then errors := errors || 'Course title is missing'; end if;
  if length(coalesce(course_record.short_description, '')) < 20 then errors := errors || 'Short description is too short'; end if;
  if course_record.school_id is null then errors := errors || 'School is required'; end if;
  if course_record.course_type_id is null then errors := errors || 'Course type is required'; end if;
  if course_record.level_id is null then errors := errors || 'Course level is required'; end if;

  select count(*) into outcomes_count from public.course_learning_outcomes where course_id = target_course_id and status = 'active';
  select count(*) into modules_count from public.course_modules where course_id = target_course_id and status <> 'archived';
  select count(*) into lessons_count from public.course_lessons where course_id = target_course_id and status <> 'archived';

  if outcomes_count < 1 then errors := errors || 'At least one learning outcome is required'; end if;
  if modules_count < 1 then errors := errors || 'At least one module is required'; end if;
  if lessons_count < 1 then errors := errors || 'At least one lesson is required'; end if;

  return errors;
end;
$$;

create or replace function public.create_course_review(target_course_id uuid, actor uuid, change_summary text default null)
returns uuid
security definer
set search_path = public
language plpgsql
as $$
declare
  active_version_id uuid;
  readiness text[];
  review_id uuid;
begin
  readiness := public.course_readiness_errors(target_course_id);
  if array_length(readiness, 1) is not null then
    raise exception 'Course is not ready for review: %', array_to_string(readiness, '; ');
  end if;

  select id into active_version_id from public.course_versions where course_id = target_course_id and status = 'draft' order by version_number desc limit 1;
  if active_version_id is null then
    raise exception 'Draft version not found.';
  end if;

  update public.course_versions set status = 'under_review', change_summary = coalesce(change_summary, change_summary), frozen_at = now() where id = active_version_id;
  update public.courses set status = 'submitted_review' where id = target_course_id;

  insert into public.course_reviews (course_id, version_id, submitted_by)
  values (target_course_id, active_version_id, actor)
  returning id into review_id;

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, reason, success)
  values (actor, 'course_submitted_review', 'course', target_course_id::text, change_summary, true);

  return review_id;
end;
$$;

create or replace function public.publish_course_version(target_course_id uuid, target_version_id uuid, actor uuid, reason text default null)
returns void
security definer
set search_path = public
language plpgsql
as $$
declare
  version_status text;
  snapshot jsonb;
begin
  select status into version_status from public.course_versions where id = target_version_id and course_id = target_course_id;
  if version_status <> 'approved' then
    raise exception 'Only approved versions may be published.';
  end if;

  select jsonb_build_object(
    'course', to_jsonb(c),
    'outcomes', coalesce((select jsonb_agg(to_jsonb(o) order by o.display_order) from public.course_learning_outcomes o where o.course_id = c.id and o.status = 'active'), '[]'::jsonb),
    'modules', coalesce((select jsonb_agg(to_jsonb(m) order by m.display_order) from public.course_modules m where m.course_id = c.id and m.status <> 'archived'), '[]'::jsonb)
  )
  into snapshot
  from public.courses c
  where c.id = target_course_id;

  update public.course_versions set status = 'superseded' where course_id = target_course_id and status = 'published';
  update public.course_versions set status = 'published', published_at = now() where id = target_version_id;
  update public.courses set status = 'published', visibility = 'public', published_version_id = target_version_id where id = target_course_id;

  insert into public.course_publication_events (course_id, version_id, event_type, actor_id, snapshot, reason)
  values (target_course_id, target_version_id, 'published', actor, snapshot, reason);

  insert into public.course_search_index (course_id, published_version_id, searchable_text)
  select c.id, target_version_id, lower(concat_ws(' ', c.title, c.subtitle, c.short_description, c.full_description, c.target_learner))
  from public.courses c
  where c.id = target_course_id
  on conflict (course_id) do update set published_version_id = excluded.published_version_id, searchable_text = excluded.searchable_text, indexed_at = now();

  insert into public.audit_logs (actor_id, action, resource_type, resource_id, reason, success)
  values (actor, 'course_published', 'course', target_course_id::text, reason, true);
end;
$$;

create trigger courses_touch before update on public.courses for each row execute function public.touch_updated_at();
create trigger course_versions_touch before update on public.course_versions for each row execute function public.touch_updated_at();
create trigger course_modules_touch before update on public.course_modules for each row execute function public.touch_updated_at();
create trigger course_lessons_touch before update on public.course_lessons for each row execute function public.touch_updated_at();
create trigger lesson_content_blocks_touch before update on public.lesson_content_blocks for each row execute function public.touch_updated_at();
create trigger course_resources_touch before update on public.course_resources for each row execute function public.touch_updated_at();
create trigger assessments_touch before update on public.assessments for each row execute function public.touch_updated_at();

alter table public.course_types enable row level security;
alter table public.course_levels enable row level security;
alter table public.courses enable row level security;
alter table public.course_versions enable row level security;
alter table public.course_team_members enable row level security;
alter table public.course_categories enable row level security;
alter table public.course_skills enable row level security;
alter table public.course_learning_outcomes enable row level security;
alter table public.course_target_learners enable row level security;
alter table public.course_completion_rules enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.lesson_content_blocks enable row level security;
alter table public.lesson_prerequisites enable row level security;
alter table public.course_resources enable row level security;
alter table public.assessments enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_question_options enable row level security;
alter table public.quiz_scoring_rules enable row level security;
alter table public.assignments enable row level security;
alter table public.rubrics enable row level security;
alter table public.rubric_criteria enable row level security;
alter table public.rubric_levels enable row level security;
alter table public.course_reviews enable row level security;
alter table public.course_review_assignments enable row level security;
alter table public.course_review_comments enable row level security;
alter table public.course_review_checklists enable row level security;
alter table public.course_review_checklist_items enable row level security;
alter table public.course_review_responses enable row level security;
alter table public.course_risk_classifications enable row level security;
alter table public.course_publication_events enable row level security;
alter table public.course_version_changes enable row level security;
alter table public.course_preview_tokens enable row level security;
alter table public.course_search_index enable row level security;
alter table public.course_analytics_events enable row level security;

create policy "course_config_read" on public.course_types for select using (status = 'active' or public.current_user_has_permission('settings.manage.platform'));
create policy "course_levels_read" on public.course_levels for select using (status = 'active' or public.current_user_has_permission('settings.manage.platform'));

create policy "courses_access" on public.courses for select using (public.user_can_access_course(id));
create policy "courses_create_member" on public.courses for insert with check (
  owner_id = auth.uid()
  and exists (select 1 from public.workspace_members wm where wm.workspace_id = owning_workspace_id and wm.user_id = auth.uid() and wm.status = 'active')
);
create policy "courses_update_authorized_draft" on public.courses for update using (
  (owner_id = auth.uid() or exists (select 1 from public.course_team_members ctm where ctm.course_id = courses.id and ctm.user_id = auth.uid() and ctm.status = 'active'))
  and status not in ('published','suspended','archived')
) with check (true);

create policy "course_versions_access" on public.course_versions for select using (public.user_can_access_course(course_id));
create policy "course_versions_author_edit" on public.course_versions for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));

create policy "course_team_access" on public.course_team_members for select using (public.user_can_access_course(course_id));
create policy "course_team_owner_manage" on public.course_team_members for all using (exists (select 1 from public.courses c where c.id = course_id and c.owner_id = auth.uid())) with check (true);

create policy "course_child_access" on public.course_categories for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "course_skills_access" on public.course_skills for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "course_outcomes_access" on public.course_learning_outcomes for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "course_targets_access" on public.course_target_learners for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "course_completion_access" on public.course_completion_rules for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "course_modules_access" on public.course_modules for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "course_lessons_access" on public.course_lessons for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "lesson_blocks_access" on public.lesson_content_blocks for all using (exists (select 1 from public.course_lessons l where l.id = lesson_id and public.user_can_access_course(l.course_id))) with check (true);
create policy "lesson_prereq_access" on public.lesson_prerequisites for all using (exists (select 1 from public.course_lessons l where l.id = lesson_id and public.user_can_access_course(l.course_id))) with check (true);
create policy "course_resources_access" on public.course_resources for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "assessments_access" on public.assessments for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "quiz_access" on public.quizzes for all using (exists (select 1 from public.assessments a where a.id = assessment_id and public.user_can_access_course(a.course_id))) with check (true);
create policy "quiz_questions_access" on public.quiz_questions for all using (exists (select 1 from public.quizzes q join public.assessments a on a.id = q.assessment_id where q.id = quiz_id and public.user_can_access_course(a.course_id))) with check (true);
create policy "quiz_options_access" on public.quiz_question_options for all using (exists (select 1 from public.quiz_questions qq join public.quizzes q on q.id = qq.quiz_id join public.assessments a on a.id = q.assessment_id where qq.id = question_id and public.user_can_access_course(a.course_id))) with check (true);
create policy "quiz_scoring_access" on public.quiz_scoring_rules for all using (exists (select 1 from public.quiz_questions qq join public.quizzes q on q.id = qq.quiz_id join public.assessments a on a.id = q.assessment_id where qq.id = question_id and public.user_can_access_course(a.course_id))) with check (true);
create policy "assignment_access" on public.assignments for all using (exists (select 1 from public.assessments a where a.id = assessment_id and public.user_can_access_course(a.course_id))) with check (true);
create policy "rubric_access" on public.rubrics for all using (public.user_can_access_course(course_id)) with check (public.user_can_access_course(course_id));
create policy "rubric_criteria_access" on public.rubric_criteria for all using (exists (select 1 from public.rubrics r where r.id = rubric_id and public.user_can_access_course(r.course_id))) with check (true);
create policy "rubric_levels_access" on public.rubric_levels for all using (exists (select 1 from public.rubric_criteria rc join public.rubrics r on r.id = rc.rubric_id where rc.id = criterion_id and public.user_can_access_course(r.course_id))) with check (true);

create policy "course_reviews_reviewer_or_author" on public.course_reviews for all using (public.user_can_access_course(course_id) or public.current_user_has_permission('course.review.assigned')) with check (true);
create policy "review_assignments_reviewer" on public.course_review_assignments for all using (reviewer_id = auth.uid() or public.current_user_has_permission('course.review.assigned')) with check (true);
create policy "review_comments_access" on public.course_review_comments for all using (public.user_can_access_course(course_id) or public.current_user_has_permission('course.review.assigned')) with check (true);
create policy "review_checklists_read" on public.course_review_checklists for select using (true);
create policy "review_checklist_items_read" on public.course_review_checklist_items for select using (true);
create policy "review_responses_reviewer" on public.course_review_responses for all using (reviewer_id = auth.uid() or public.current_user_has_permission('course.review.assigned')) with check (true);
create policy "course_risk_access" on public.course_risk_classifications for all using (public.user_can_access_course(course_id) or public.current_user_has_permission('course.review.assigned')) with check (true);
create policy "publication_events_access" on public.course_publication_events for select using (public.user_can_access_course(course_id));
create policy "version_changes_access" on public.course_version_changes for all using (exists (select 1 from public.course_versions cv where cv.id = version_id and public.user_can_access_course(cv.course_id))) with check (true);
create policy "preview_tokens_author" on public.course_preview_tokens for all using (created_by = auth.uid() or public.user_can_access_course(course_id)) with check (true);
create policy "course_search_public" on public.course_search_index for select using (exists (select 1 from public.courses c where c.id = course_id and c.status = 'published' and c.visibility = 'public'));
create policy "course_analytics_author" on public.course_analytics_events for insert with check (actor_id = auth.uid() or actor_id is null);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
('course-media', 'course-media', false, 104857600, array['image/png','image/jpeg','image/webp','audio/mpeg','audio/mp4','video/mp4','application/pdf']),
('course-resources', 'course-resources', false, 52428800, array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','image/png','image/jpeg','image/webp','text/plain','application/zip'])
on conflict (id) do nothing;
