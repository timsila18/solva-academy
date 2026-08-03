create table if not exists public.live_session_types (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  recommended_capacity integer,
  default_permissions jsonb not null default '{}',
  recording_policy jsonb not null default '{}',
  attendance_policy jsonb not null default '{}',
  chat_policy jsonb not null default '{}',
  breakout_available boolean not null default false,
  child_safety_requirements jsonb not null default '{}',
  registration_requirements jsonb not null default '{}',
  completion_behavior jsonb not null default '{}',
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_series (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  recurrence_rule jsonb not null default '{}',
  timezone text not null default 'Africa/Nairobi',
  update_policy text not null default 'entire_series' check (update_policy in ('this_occurrence','this_and_future','entire_series')),
  status text not null default 'active' check (status in ('active','paused','completed','cancelled','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  session_type_id uuid references public.live_session_types(id),
  series_id uuid references public.live_session_series(id) on delete set null,
  owner_workspace_id uuid not null references public.workspaces(id) on delete cascade,
  host_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  short_description text,
  full_description text,
  course_id uuid references public.courses(id) on delete set null,
  course_version_id uuid references public.course_versions(id) on delete set null,
  module_id uuid references public.course_modules(id) on delete set null,
  lesson_id uuid references public.course_lessons(id) on delete set null,
  academy_id uuid references public.academies(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  campaign_id uuid references public.enterprise_campaigns(id) on delete set null,
  learning_assignment_id uuid references public.enterprise_learning_assignments(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Africa/Nairobi',
  duration_minutes integer not null check (duration_minutes > 0),
  capacity integer,
  reserved_seats integer not null default 0,
  language text not null default 'en',
  target_audience text,
  age_group text,
  visibility text not null default 'private' check (visibility in ('private','workspace','course','academy','organization','public','unlisted')),
  registration_mode text not null default 'invitation_only' check (registration_mode in ('course_enrollment','manual','invitation_only','organization_assigned','academy_assigned','public','approval_required','paid_placeholder','private_link','closed_group')),
  recording_policy text not null default 'host_controlled' check (recording_policy in ('disabled','host_controlled','automatic','explicit_authorization_required')),
  attendance_rules jsonb not null default '{}',
  completion_effect jsonb not null default '{}',
  permissions jsonb not null default '{}',
  reminders jsonb not null default '{}',
  child_safety_enabled boolean not null default false,
  waiting_room_enabled boolean not null default true,
  code_of_conduct text,
  support_contact text,
  thumbnail_path text,
  banner_path text,
  seo jsonb not null default '{}',
  status text not null default 'draft' check (status in ('draft','scheduled','registration_open','registration_closed','ready','live','paused','ended','processing_recording','recording_available','cancelled','postponed','failed','archived','suspended')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.live_session_occurrences (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  series_id uuid references public.live_session_series(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Africa/Nairobi',
  status text not null default 'scheduled' check (status in ('scheduled','ready','live','paused','ended','processing_recording','recording_available','cancelled','postponed','failed','archived','suspended')),
  provider_room_id text,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.live_session_hosts (
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'host' check (role in ('host','co_host')),
  created_at timestamptz not null default now(),
  primary key (session_id, user_id, role)
);

create table if not exists public.live_session_presenters (
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table if not exists public.live_session_moderators (
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table if not exists public.live_session_registrations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  name text,
  email text,
  phone text,
  organization text,
  role text,
  questions jsonb not null default '{}',
  accessibility_needs text,
  guardian_consent boolean not null default false,
  terms_accepted boolean not null default false,
  status text not null default 'registered' check (status in ('invited','registered','pending_approval','approved','rejected','waitlisted','cancelled','attended','no_show','removed','banned','transferred')),
  approved_by uuid references public.profiles(id),
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, user_id),
  unique (session_id, email)
);

create table if not exists public.live_session_waitlists (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  registration_id uuid references public.live_session_registrations(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  position integer not null default 0,
  status text not null default 'waiting' check (status in ('waiting','promoted','expired','cancelled')),
  promoted_at timestamptz,
  promotion_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_rooms (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  provider text not null default 'mock',
  provider_room_id text,
  room_url text,
  room_config jsonb not null default '{}',
  status text not null default 'created' check (status in ('created','ready','live','ended','failed','deleted')),
  created_at timestamptz not null default now(),
  unique (provider, provider_room_id)
);

create table if not exists public.live_session_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  session_id uuid references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  event_type text not null,
  raw_payload jsonb not null default '{}',
  processed boolean not null default false,
  duplicate boolean not null default false,
  received_at timestamptz not null default now(),
  unique (provider, event_id)
);

create table if not exists public.live_session_join_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  registration_id uuid references public.live_session_registrations(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  participant_role text not null default 'attendee',
  event_type text not null check (event_type in ('join','leave','rejoin','waiting','admitted','denied','removed','connection_failed')),
  occurred_at timestamptz not null default now(),
  provider_participant_id text,
  metadata jsonb not null default '{}'
);

create table if not exists public.live_session_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  registration_id uuid references public.live_session_registrations(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  first_join_at timestamptz,
  last_leave_at timestamptz,
  attended_seconds integer not null default 0,
  attendance_percentage numeric(5,2) not null default 0,
  late_arrival boolean not null default false,
  early_departure boolean not null default false,
  host_confirmed boolean not null default false,
  status text not null default 'absent' check (status in ('present','partially_present','late','excused','absent','no_show','removed','technical_issue','manually_confirmed')),
  device jsonb not null default '{}',
  source text not null default 'system',
  manual_correction boolean not null default false,
  correction_reason text,
  updated_at timestamptz not null default now(),
  unique (occurrence_id, user_id)
);

create table if not exists public.live_session_attendance_events (
  id uuid primary key default gen_random_uuid(),
  attendance_id uuid not null references public.live_session_attendance(id) on delete cascade,
  event_type text not null,
  event_at timestamptz not null default now(),
  source text not null default 'provider',
  metadata jsonb not null default '{}'
);

create table if not exists public.live_session_attendance_corrections (
  id uuid primary key default gen_random_uuid(),
  attendance_id uuid not null references public.live_session_attendance(id) on delete cascade,
  actor_id uuid not null references public.profiles(id),
  original_status text not null,
  new_status text not null,
  reason text not null,
  evidence jsonb not null default '{}',
  approval_status text not null default 'approved',
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_resources (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  resource_type text not null check (resource_type in ('pdf','document','spreadsheet','presentation','image','audio','course_resource','external_link')),
  title text not null,
  file_path text,
  external_url text,
  file_size_bytes bigint,
  mime_type text,
  permissions jsonb not null default '{}',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_agendas (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_agenda_items (
  id uuid primary key default gen_random_uuid(),
  agenda_id uuid not null references public.live_session_agendas(id) on delete cascade,
  title text not null,
  duration_minutes integer,
  display_order integer not null default 0
);

create table if not exists public.live_session_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  parent_id uuid references public.live_session_chat_messages(id) on delete set null,
  message text not null,
  message_type text not null default 'chat' check (message_type in ('chat','host_announcement','system')),
  reactions jsonb not null default '{}',
  deleted_at timestamptz,
  deleted_by uuid references public.profiles(id),
  moderation_status text not null default 'visible' check (moderation_status in ('visible','hidden','deleted','flagged')),
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_chat_moderation (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.live_session_chat_messages(id) on delete cascade,
  moderator_id uuid not null references public.profiles(id),
  action text not null check (action in ('delete','hide','restore','mute_sender','lock_chat','unlock_chat')),
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_polls (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  created_by uuid references public.profiles(id),
  question text not null,
  poll_type text not null default 'single_choice' check (poll_type in ('single_choice','multiple_choice','true_false','rating','word_cloud_placeholder','open_response')),
  anonymous boolean not null default false,
  duration_seconds integer,
  results_visibility text not null default 'host_only' check (results_visibility in ('host_only','after_close','live','never')),
  correct_answer jsonb,
  learning_outcome_id uuid,
  status text not null default 'draft' check (status in ('draft','launched','closed','reopened','archived')),
  launched_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.live_session_polls(id) on delete cascade,
  label text not null,
  display_order integer not null default 0
);

create table if not exists public.live_session_poll_responses (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.live_session_polls(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  response jsonb not null default '{}',
  submitted_at timestamptz not null default now(),
  unique (poll_id, user_id)
);

create table if not exists public.live_session_quizzes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  quiz_id uuid references public.quizzes(id) on delete set null,
  mode text not null default 'practice' check (mode in ('practice','participation_evidence','graded','completion_evidence')),
  server_scored boolean not null default true,
  status text not null default 'draft' check (status in ('draft','launched','closed','archived')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_whiteboards (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  title text not null default 'Whiteboard',
  provider_board_id text,
  state jsonb not null default '{}',
  locked boolean not null default false,
  export_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.live_session_breakout_rooms (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  name text not null,
  provider_room_id text,
  timer_seconds integer,
  status text not null default 'draft' check (status in ('draft','open','closing','closed')),
  summary text,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_breakout_members (
  breakout_room_id uuid not null references public.live_session_breakout_rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  assigned_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  primary key (breakout_room_id, user_id)
);

create table if not exists public.live_session_recordings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  provider_recording_id text,
  status text not null default 'requested' check (status in ('requested','recording','uploading','processing','available','failed','removed','expired')),
  duration_seconds integer,
  file_size_bytes bigint,
  file_path text,
  playback_url text,
  thumbnail_path text,
  transcript_status text not null default 'not_requested',
  caption_status text not null default 'not_requested',
  access_policy text not null default 'participants_only' check (access_policy in ('participants_only','course_enrollees','organization_members','academy_members','selected_users','public','paid_replay_placeholder','disabled')),
  retention_until timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_recording_access (
  recording_id uuid not null references public.live_session_recordings(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  access_level text not null default 'view' check (access_level in ('view','download','manage')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_transcripts (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid references public.live_session_recordings(id) on delete cascade,
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  language text not null default 'en',
  status text not null default 'not_requested' check (status in ('not_requested','requested','processing','available','failed','removed')),
  file_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_reminders (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  reminder_type text not null,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending','sent','failed','cancelled')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_incidents (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reported_participant_id uuid references public.profiles(id) on delete set null,
  incident_type text not null check (incident_type in ('harassment','inappropriate_content','unauthorized_recording','disruption','impersonation','child_safety_concern','threat','spam','privacy_breach','technical_abuse','other')),
  description text not null,
  evidence_reference text,
  severity text not null default 'normal' check (severity in ('low','normal','high','critical')),
  status text not null default 'open' check (status in ('open','under_review','resolved','dismissed','escalated')),
  moderator_id uuid references public.profiles(id),
  resolution text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.live_session_incident_events (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.live_session_incidents(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  action text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.live_session_consent_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  consent_type text not null check (consent_type in ('recording','code_of_conduct','guardian','child_safety')),
  acknowledged boolean not null default false,
  acknowledged_at timestamptz,
  metadata jsonb not null default '{}',
  unique (occurrence_id, user_id, consent_type)
);

create table if not exists public.live_session_learning_hours (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  occurrence_id uuid references public.live_session_occurrences(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  eligible_seconds integer not null default 0,
  learning_hours numeric(8,2) not null default 0,
  source_attendance_id uuid references public.live_session_attendance(id) on delete set null,
  calculated_at timestamptz not null default now(),
  unique (occurrence_id, user_id)
);

create table if not exists public.live_session_makeups (
  id uuid primary key default gen_random_uuid(),
  original_session_id uuid not null references public.live_sessions(id) on delete cascade,
  makeup_session_id uuid references public.live_sessions(id) on delete set null,
  user_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  status text not null default 'assigned' check (status in ('assigned','completed','cancelled','expired')),
  assigned_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.coaching_session_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.live_sessions(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  participant_id uuid references public.profiles(id),
  visibility text not null default 'private' check (visibility in ('private','participant','host_team')),
  notes text not null,
  created_at timestamptz not null default now()
);

insert into public.live_session_types (slug, name, recommended_capacity, default_permissions, recording_policy, attendance_policy, chat_policy, breakout_available, child_safety_requirements, registration_requirements, completion_behavior) values
('live-class', 'Live Class', 40, '{"attendee_chat":true,"screen_share":false}', '{"default":"host_controlled"}', '{"minimum_percentage":75}', '{"moderated":true}', true, '{}', '{"mode":"course_enrollment"}', '{"can_complete_lesson":true}'),
('webinar', 'Webinar', 500, '{"attendee_chat":false,"qna":true}', '{"default":"host_controlled"}', '{"minimum_percentage":50}', '{"host_announcements":true}', false, '{}', '{"mode":"public"}', '{"participation_only":true}'),
('coaching-session', 'Coaching Session', 5, '{"attendee_chat":true,"screen_share":true}', '{"default":"disabled"}', '{"host_confirmation":true}', '{"moderated":true}', false, '{}', '{"mode":"invitation_only"}', '{"coaching_evidence":true}'),
('children-class', 'Children''s Class', 20, '{"private_chat":false,"file_share":false}', '{"default":"explicit_authorization_required"}', '{"minimum_percentage":80,"host_confirmation":true}', '{"private_chat":false,"moderated":true}', false, '{"waiting_room":true,"verified_host":true,"guardian_notice":true}', '{"guardian_consent":true}', '{"child_safe_completion":true}')
on conflict (slug) do nothing;

insert into public.permissions (code, resource, action, scope, description) values
('live_session.create.assigned', 'live_session', 'create', 'assigned', 'Create live sessions in assigned workspaces.'),
('live_session.manage.assigned', 'live_session', 'manage', 'assigned', 'Manage assigned live sessions.'),
('live_session.join.own', 'live_session', 'join', 'own', 'Join own registered or entitled sessions.'),
('live_attendance.manage.assigned', 'live_attendance', 'manage', 'assigned', 'Manage live attendance for assigned sessions.'),
('live_recording.manage.assigned', 'live_recording', 'manage', 'assigned', 'Manage recordings for assigned sessions.'),
('live_incident.manage.assigned', 'live_incident', 'manage', 'assigned', 'Manage incidents for assigned sessions.'),
('live_session.manage.platform', 'live_session', 'manage', 'platform', 'Manage live sessions platform-wide.')
on conflict (code) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on
  (r.slug in ('instructor','academy-owner','academy-administrator','corporate-trainer','hr-learning-manager','organization-administrator') and p.code in ('live_session.create.assigned','live_session.manage.assigned','live_attendance.manage.assigned','live_recording.manage.assigned','live_incident.manage.assigned'))
  or (r.slug in ('learner','corporate-learner') and p.code = 'live_session.join.own')
  or (r.slug in ('platform-administrator','super-admin','founding-super-admin') and p.code = 'live_session.manage.platform')
on conflict do nothing;

create or replace function public.current_user_can_manage_live_session(target_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.live_sessions s where s.id = target_session_id and (s.host_id = auth.uid() or s.created_by = auth.uid()))
    or exists (select 1 from public.live_session_hosts h where h.session_id = target_session_id and h.user_id = auth.uid())
    or exists (select 1 from public.live_session_moderators m where m.session_id = target_session_id and m.user_id = auth.uid())
    or exists (select 1 from public.live_sessions s join public.workspace_members wm on wm.workspace_id = s.owner_workspace_id where s.id = target_session_id and wm.user_id = auth.uid() and wm.status = 'active')
    or public.current_user_has_permission('live_session.manage.platform');
$$;

create or replace function public.current_user_can_view_live_session(target_session_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.live_sessions s where s.id = target_session_id and s.visibility = 'public')
    or public.current_user_can_manage_live_session(target_session_id)
    or exists (select 1 from public.live_session_registrations r where r.session_id = target_session_id and r.user_id = auth.uid() and r.status not in ('rejected','cancelled','removed','banned'))
    or exists (select 1 from public.live_sessions s join public.enrollments e on e.course_id = s.course_id where s.id = target_session_id and e.learner_id = auth.uid() and e.status = 'active')
    or exists (select 1 from public.live_sessions s where s.id = target_session_id and s.organization_id is not null and public.current_user_in_organization(s.organization_id));
$$;

create or replace function public.live_session_status_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs (actor_id, action, resource_type, resource_id, workspace_id, success)
    values (new.created_by, 'live_session_created', 'live_session', new.id::text, new.owner_workspace_id, true);
  elsif old.status is distinct from new.status then
    insert into public.audit_logs (actor_id, action, resource_type, resource_id, workspace_id, previous_data, new_data, success)
    values (auth.uid(), 'live_session_status_changed', 'live_session', new.id::text, new.owner_workspace_id, jsonb_build_object('status', old.status), jsonb_build_object('status', new.status), true);
  end if;
  return new;
end;
$$;

drop trigger if exists live_session_status_event_trigger on public.live_sessions;
create trigger live_session_status_event_trigger
after insert or update of status on public.live_sessions
for each row execute function public.live_session_status_event();

alter table public.live_session_types enable row level security;
alter table public.live_session_series enable row level security;
alter table public.live_sessions enable row level security;
alter table public.live_session_occurrences enable row level security;
alter table public.live_session_hosts enable row level security;
alter table public.live_session_presenters enable row level security;
alter table public.live_session_moderators enable row level security;
alter table public.live_session_registrations enable row level security;
alter table public.live_session_waitlists enable row level security;
alter table public.live_session_rooms enable row level security;
alter table public.live_session_provider_events enable row level security;
alter table public.live_session_join_events enable row level security;
alter table public.live_session_attendance enable row level security;
alter table public.live_session_attendance_events enable row level security;
alter table public.live_session_attendance_corrections enable row level security;
alter table public.live_session_resources enable row level security;
alter table public.live_session_agendas enable row level security;
alter table public.live_session_agenda_items enable row level security;
alter table public.live_session_chat_messages enable row level security;
alter table public.live_session_chat_moderation enable row level security;
alter table public.live_session_polls enable row level security;
alter table public.live_session_poll_options enable row level security;
alter table public.live_session_poll_responses enable row level security;
alter table public.live_session_quizzes enable row level security;
alter table public.live_session_whiteboards enable row level security;
alter table public.live_session_breakout_rooms enable row level security;
alter table public.live_session_breakout_members enable row level security;
alter table public.live_session_recordings enable row level security;
alter table public.live_session_recording_access enable row level security;
alter table public.live_session_transcripts enable row level security;
alter table public.live_session_reminders enable row level security;
alter table public.live_session_incidents enable row level security;
alter table public.live_session_incident_events enable row level security;
alter table public.live_session_consent_records enable row level security;
alter table public.live_session_learning_hours enable row level security;
alter table public.live_session_makeups enable row level security;
alter table public.coaching_session_notes enable row level security;

create policy "live_types_read" on public.live_session_types for select using (status = 'active' or public.current_user_has_permission('settings.manage.platform'));
create policy "live_sessions_view" on public.live_sessions for select using (public.current_user_can_view_live_session(id));
create policy "live_sessions_create" on public.live_sessions for insert with check (created_by = auth.uid() and exists (select 1 from public.workspace_members wm where wm.workspace_id = owner_workspace_id and wm.user_id = auth.uid() and wm.status = 'active'));
create policy "live_sessions_manage" on public.live_sessions for update using (public.current_user_can_manage_live_session(id)) with check (public.current_user_can_manage_live_session(id));
create policy "live_occurrences_view" on public.live_session_occurrences for select using (public.current_user_can_view_live_session(session_id));
create policy "live_occurrences_manage" on public.live_session_occurrences for all using (public.current_user_can_manage_live_session(session_id)) with check (public.current_user_can_manage_live_session(session_id));
create policy "live_roles_view" on public.live_session_hosts for select using (public.current_user_can_view_live_session(session_id));
create policy "live_presenters_view" on public.live_session_presenters for select using (public.current_user_can_view_live_session(session_id));
create policy "live_moderators_view" on public.live_session_moderators for select using (public.current_user_can_view_live_session(session_id));
create policy "live_registrations_own_or_manager" on public.live_session_registrations for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_registrations_create" on public.live_session_registrations for insert with check (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_waitlists_own_or_manager" on public.live_session_waitlists for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_rooms_manager_only" on public.live_session_rooms for select using (public.current_user_can_manage_live_session(session_id));
create policy "live_provider_events_admin" on public.live_session_provider_events for select using (public.current_user_has_permission('live_session.manage.platform'));
create policy "live_join_events_own_or_manager" on public.live_session_join_events for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_attendance_own_or_manager" on public.live_session_attendance for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_attendance_events_manager" on public.live_session_attendance_events for select using (exists (select 1 from public.live_session_attendance a where a.id = attendance_id and (a.user_id = auth.uid() or public.current_user_can_manage_live_session(a.session_id))));
create policy "live_attendance_corrections_manager" on public.live_session_attendance_corrections for select using (exists (select 1 from public.live_session_attendance a where a.id = attendance_id and public.current_user_can_manage_live_session(a.session_id)));
create policy "live_resources_view" on public.live_session_resources for select using (public.current_user_can_view_live_session(session_id));
create policy "live_resources_manage" on public.live_session_resources for all using (public.current_user_can_manage_live_session(session_id)) with check (public.current_user_can_manage_live_session(session_id));
create policy "live_agendas_view" on public.live_session_agendas for select using (public.current_user_can_view_live_session(session_id));
create policy "live_agenda_items_view" on public.live_session_agenda_items for select using (exists (select 1 from public.live_session_agendas a where a.id = agenda_id and public.current_user_can_view_live_session(a.session_id)));
create policy "live_chat_view" on public.live_session_chat_messages for select using (public.current_user_can_view_live_session(session_id) and moderation_status = 'visible');
create policy "live_chat_create" on public.live_session_chat_messages for insert with check (sender_id = auth.uid() and public.current_user_can_view_live_session(session_id));
create policy "live_chat_moderation_manager" on public.live_session_chat_moderation for select using (exists (select 1 from public.live_session_chat_messages m where m.id = message_id and public.current_user_can_manage_live_session(m.session_id)));
create policy "live_polls_view" on public.live_session_polls for select using (public.current_user_can_view_live_session(session_id));
create policy "live_polls_manage" on public.live_session_polls for all using (public.current_user_can_manage_live_session(session_id)) with check (public.current_user_can_manage_live_session(session_id));
create policy "live_poll_options_view" on public.live_session_poll_options for select using (exists (select 1 from public.live_session_polls p where p.id = poll_id and public.current_user_can_view_live_session(p.session_id)));
create policy "live_poll_responses_own_or_manager" on public.live_session_poll_responses for select using (user_id = auth.uid() or exists (select 1 from public.live_session_polls p where p.id = poll_id and public.current_user_can_manage_live_session(p.session_id)));
create policy "live_poll_responses_create" on public.live_session_poll_responses for insert with check (user_id = auth.uid() and exists (select 1 from public.live_session_polls p where p.id = poll_id and public.current_user_can_view_live_session(p.session_id)));
create policy "live_quizzes_view" on public.live_session_quizzes for select using (public.current_user_can_view_live_session(session_id));
create policy "live_whiteboards_view" on public.live_session_whiteboards for select using (public.current_user_can_view_live_session(session_id));
create policy "live_breakouts_view" on public.live_session_breakout_rooms for select using (public.current_user_can_view_live_session(session_id));
create policy "live_breakout_members_own_or_manager" on public.live_session_breakout_members for select using (user_id = auth.uid() or exists (select 1 from public.live_session_breakout_rooms b where b.id = breakout_room_id and public.current_user_can_manage_live_session(b.session_id)));
create policy "live_recordings_view" on public.live_session_recordings for select using (access_policy = 'public' or public.current_user_can_view_live_session(session_id));
create policy "live_recording_access_own" on public.live_session_recording_access for select using (user_id = auth.uid() or (workspace_id is not null and exists (select 1 from public.workspace_members wm where wm.workspace_id = live_session_recording_access.workspace_id and wm.user_id = auth.uid())));
create policy "live_transcripts_view" on public.live_session_transcripts for select using (public.current_user_can_view_live_session(session_id));
create policy "live_reminders_own_or_manager" on public.live_session_reminders for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_incidents_restricted" on public.live_session_incidents for select using (reporter_id = auth.uid() or public.current_user_can_manage_live_session(session_id) or public.current_user_has_permission('live_session.manage.platform'));
create policy "live_incidents_create" on public.live_session_incidents for insert with check (reporter_id = auth.uid() and public.current_user_can_view_live_session(session_id));
create policy "live_incident_events_restricted" on public.live_session_incident_events for select using (exists (select 1 from public.live_session_incidents i where i.id = incident_id and (i.reporter_id = auth.uid() or public.current_user_can_manage_live_session(i.session_id))));
create policy "live_consent_own_or_manager" on public.live_session_consent_records for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_learning_hours_own_or_manager" on public.live_session_learning_hours for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
create policy "live_makeups_own_or_manager" on public.live_session_makeups for select using (user_id = auth.uid() or public.current_user_can_manage_live_session(original_session_id));
create policy "coaching_notes_author_or_participant" on public.coaching_session_notes for select using (author_id = auth.uid() or participant_id = auth.uid() or public.current_user_can_manage_live_session(session_id));
