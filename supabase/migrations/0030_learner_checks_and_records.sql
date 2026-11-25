do $migration$ begin
alter table public.quiz_attempts add column question_snapshot jsonb not null default '[]';
alter table public.quiz_attempts add column delivery_rules jsonb not null default '{}';
alter table public.quiz_attempts add column draft_answers jsonb not null default '{}';

-- Learner-owned records are readable, but scoring and completion are server-written.
do $$ declare t text; begin
 foreach t in array array['quiz_attempts','quiz_attempt_answers','lesson_progress','learner_course_positions','course_completion_records','certificates'] loop
  execute format('create policy learning_insert_server on public.%I as restrictive for insert to authenticated with check (false)',t);
  execute format('create policy learning_update_server on public.%I as restrictive for update to authenticated using (false) with check (false)',t);
  execute format('create policy learning_delete_server on public.%I as restrictive for delete to authenticated using (false)',t);
 end loop;
end $$;
-- Snapshot answer keys must never be selected by a browser database client.
revoke select on public.quiz_attempts from authenticated,anon;
grant select(id,enrollment_id,quiz_id,attempt_number,status,started_at,submitted_at,score,max_score,passed) on public.quiz_attempts to authenticated;
-- Keep published assessment requirements immutable through direct database clients.
do $$ declare t text; predicate text; begin
 foreach t in array array['assessments','quizzes','quiz_questions','quiz_question_options','quiz_scoring_rules'] loop
  predicate:=case t
   when 'assessments' then 'public.studio_can_edit_course(course_id)'
   when 'quizzes' then 'exists(select 1 from public.assessments a where a.id=assessment_id and public.studio_can_edit_course(a.course_id))'
   when 'quiz_questions' then 'exists(select 1 from public.quizzes z join public.assessments a on a.id=z.assessment_id where z.id=quiz_id and public.studio_can_edit_course(a.course_id))'
   else 'exists(select 1 from public.quiz_questions x join public.quizzes z on z.id=x.quiz_id join public.assessments a on a.id=z.assessment_id where x.id=question_id and public.studio_can_edit_course(a.course_id))' end;
  execute format('create policy learning_author_insert_guard on public.%I as restrictive for insert to authenticated with check (%s)',t,predicate);
  execute format('create policy learning_author_update_guard on public.%I as restrictive for update to authenticated using (%s) with check (%s)',t,predicate,predicate);
  execute format('create policy learning_author_delete_guard on public.%I as restrictive for delete to authenticated using (%s)',t,predicate);
 end loop;
end $$;

create function public.learning_check_access(target_enrollment uuid, subject uuid)
returns public.enrollments language plpgsql security definer set search_path=public as $$
declare e public.enrollments%rowtype;
begin
 select * into e from public.enrollments where id=target_enrollment and learner_id=subject;
 if e.id is null or e.status not in ('active','not_started','in_progress','completed')
  or e.course_version_id is null or (e.access_ends_at is not null and e.access_ends_at<=now())
  or not exists(select 1 from public.entitlements t where t.id=e.entitlement_id and t.beneficiary_user_id=subject and t.status='active' and (t.starts_at is null or t.starts_at<=now()) and (t.ends_at is null or t.ends_at>now()))
 then raise exception 'Learning access required'; end if;
 return e;
end $$;

create function public.learning_start_check(target_enrollment uuid,target_quiz uuid,subject uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare e public.enrollments%rowtype; a public.assessments%rowtype; q public.quizzes%rowtype; existing uuid; n integer; snapshot jsonb;
begin
 perform 1 from public.enrollments where id=target_enrollment for update;
 e:=public.learning_check_access(target_enrollment,subject);
 select * into q from public.quizzes where id=target_quiz;
 select * into a from public.assessments where id=q.assessment_id and course_id=e.course_id and status='active' and review_method='automated';
 if a.id is null or a.lesson_id is null or not exists(select 1 from public.course_lessons l where l.id=a.lesson_id and l.course_id=e.course_id and l.version_id=e.course_version_id and l.status<>'archived') then raise exception 'Check unavailable'; end if;
 select id into existing from public.quiz_attempts where enrollment_id=e.id and quiz_id=q.id and status='in_progress';
 if existing is not null then return existing; end if;
 select count(*) into n from public.quiz_attempts where enrollment_id=e.id and quiz_id=q.id and status<>'invalidated';
 if q.attempts_allowed is not null and n>=q.attempts_allowed then raise exception 'Attempt limit reached'; end if;
 if exists(select 1 from public.quiz_questions x where x.quiz_id=q.id and x.status='active' and (x.question_type<>'single_choice' or x.points<=0 or (select count(*) from public.quiz_question_options o where o.question_id=x.id and o.is_correct)<>1 or (select count(*) from public.quiz_question_options o where o.question_id=x.id)<2)) then raise exception 'Check needs instructor review'; end if;
 select jsonb_agg(jsonb_build_object('id',x.id,'prompt',x.prompt,'points',x.points,'explanation',x.explanation,'options',(select jsonb_agg(jsonb_build_object('id',o.id,'text',o.option_text,'correct',o.is_correct) order by o.display_order) from public.quiz_question_options o where o.question_id=x.id)) order by x.display_order) into snapshot from public.quiz_questions x where x.quiz_id=q.id and x.status='active';
 if snapshot is null then raise exception 'No questions available'; end if;
 insert into public.quiz_attempts(enrollment_id,quiz_id,attempt_number,question_snapshot,delivery_rules)
 values(e.id,q.id,n+1,snapshot,jsonb_build_object('passingScore',coalesce(q.passing_score,70),'timeLimitMinutes',q.time_limit_minutes,'showCorrectAnswers',q.show_correct_answers,'showExplanations',q.show_explanations)) returning id into existing;
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,success) values(subject,'learning_check_started','quiz_attempt',existing::text,true);
 return existing;
end $$;

create function public.learning_submit_check(target_attempt uuid,subject uuid,responses jsonb)
returns void language plpgsql security definer set search_path=public as $$
declare attempt public.quiz_attempts%rowtype; e public.enrollments%rowtype; question jsonb; option jsonb; selected text; correct boolean; earned numeric:=0; possible numeric:=0; deadline timestamptz; total integer;
begin
 select * into attempt from public.quiz_attempts where id=target_attempt for update;
 if attempt.id is null then raise exception 'Attempt not found'; end if;
 e:=public.learning_check_access(attempt.enrollment_id,subject);
 if attempt.status in ('passed','failed') then return; end if;
 if attempt.status<>'in_progress' then raise exception 'Attempt is closed'; end if;
 if jsonb_typeof(responses)<>'object' or octet_length(responses::text)>64000 then raise exception 'Invalid answers'; end if;
 select count(*) into total from jsonb_object_keys(responses);
 if total<>jsonb_array_length(attempt.question_snapshot) then raise exception 'Answer every question'; end if;
 if (attempt.delivery_rules->>'timeLimitMinutes') is not null then deadline:=attempt.started_at+make_interval(mins=>(attempt.delivery_rules->>'timeLimitMinutes')::int); end if;
 for question in select value from jsonb_array_elements(attempt.question_snapshot) loop
  selected:=responses->>(question->>'id');
  select value into option from jsonb_array_elements(question->'options') where value->>'id'=selected;
  if selected is null or option is null then raise exception 'Invalid answer selection'; end if;
  correct:=coalesce((option->>'correct')::boolean,false) and (deadline is null or now()<=deadline);
  possible:=possible+(question->>'points')::numeric;
  if correct then earned:=earned+(question->>'points')::numeric; end if;
  insert into public.quiz_attempt_answers(attempt_id,question_id,answer,is_correct,score,feedback)
  values(attempt.id,(question->>'id')::uuid,jsonb_build_object('optionId',selected),correct,case when correct then (question->>'points')::numeric else 0 end,case when coalesce((attempt.delivery_rules->>'showExplanations')::boolean,false) then question->>'explanation' else null end);
 end loop;
 if possible<=0 then raise exception 'Check needs instructor review'; end if;
 correct:=earned*100/possible >= (attempt.delivery_rules->>'passingScore')::numeric;
 update public.quiz_attempts set status=case when correct then 'passed' else 'failed' end,score=earned,max_score=possible,passed=correct,submitted_at=now() where id=attempt.id;
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,new_data,success) values(subject,'learning_check_submitted','quiz_attempt',attempt.id::text,jsonb_build_object('score',earned,'max_score',possible,'passed',correct),true);
end $$;

create function public.learning_refresh_completion(target_enrollment uuid,subject uuid)
returns boolean language plpgsql security definer set search_path=public as $$
declare e public.enrollments%rowtype; needed integer; done integer; finished boolean;
begin
 perform 1 from public.enrollments where id=target_enrollment for update;
 e:=public.learning_check_access(target_enrollment,subject);
 select count(*),count(p.id) filter(where p.status='completed') into needed,done from public.course_lessons l left join public.lesson_progress p on p.lesson_id=l.id and p.enrollment_id=e.id where l.course_id=e.course_id and l.version_id=e.course_version_id and l.status<>'archived' and l.required;
 finished:=needed>0 and done=needed;
 -- Unsupported custom requirements fail closed rather than granting a credential.
 if exists(select 1 from public.course_completion_rules r where r.course_id=e.course_id and r.required and r.status='active' and (r.rule_type not in ('all_required_lessons','required_assessments') or r.config<>'{}'::jsonb)) then finished:=false; end if;
 if exists(select 1 from public.assessments a join public.course_lessons l on l.id=a.lesson_id where a.course_id=e.course_id and l.version_id=e.course_version_id and a.required and a.status='active' and (a.assessment_type<>'quiz' or not exists(select 1 from public.quizzes q join public.quiz_attempts t on t.quiz_id=q.id where q.assessment_id=a.id and t.enrollment_id=e.id and t.passed and t.status='passed'))) then finished:=false; end if;
 if exists(select 1 from public.assessments a where a.course_id=e.course_id and a.required and a.status='active' and a.lesson_id is null) then finished:=false; end if;
 update public.enrollments set last_activity_at=now(),completion_percentage=case when needed=0 then 0 else floor(done*100.0/needed) end,status=case when finished then 'completed' else 'in_progress' end,completion_state=case when finished then 'completed' else 'in_progress' end,completed_at=case when finished then coalesce(completed_at,now()) else null end,certificate_eligible=finished where id=e.id;
 if finished then
  insert into public.course_completion_records(enrollment_id,course_id,learner_id,evidence) values(e.id,e.course_id,subject,jsonb_build_object('required_lessons',needed,'completed_lessons',done,'version_id',e.course_version_id,'checks','server_verified')) on conflict(enrollment_id) do nothing;
 end if;
 return finished;
end $$;

create or replace function public.issue_certificate_for_enrollment(target_enrollment_id uuid,actor uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare e public.enrollments%rowtype; cert uuid; template jsonb;
begin
 if not public.learning_refresh_completion(target_enrollment_id,actor) then raise exception 'Required learning is incomplete'; end if;
 select * into e from public.enrollments where id=target_enrollment_id and learner_id=actor;
 select t.template into template from public.certificate_templates t where t.status='active' and t.template->>'course_id'=e.course_id::text and t.template->>'issuance_enabled'='true' and coalesce(t.template->>'specimen_only','false')='false' order by t.created_at desc limit 1;
 if template is null then raise exception 'Certificate issuance awaits instructor approval'; end if;
 select id into cert from public.certificates where enrollment_id=e.id and status='issued';
 if cert is not null then return cert; end if;
 insert into public.certificates(enrollment_id,learner_id,course_id,certificate_number,snapshot)
 select e.id,actor,e.course_id,'SA-'||upper(replace(e.id::text,'-','')),jsonb_build_object('learner_name',p.full_name,'course_title',c.title,'programme_title',coalesce(template->>'programme_title',c.title),'issuer',coalesce(template->>'issuer','Solva Academy'),'award_type','Certificate of Completion','completed_at',e.completed_at,'version_id',e.course_version_id,'hours',c.estimated_duration_minutes/60.0,'accreditation_claim',false)
 from public.profiles p join public.courses c on c.id=e.course_id where p.id=actor returning id into cert;
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,success) values(actor,'certificate_issued','certificate',cert::text,true);
 return cert;
end $$;

create function public.learning_save_check(target_attempt uuid,subject uuid,responses jsonb)
returns void language plpgsql security definer set search_path=public as $$
declare attempt public.quiz_attempts%rowtype; pair record;
begin
 select * into attempt from public.quiz_attempts where id=target_attempt for update;
 if attempt.id is null then raise exception 'Attempt not found'; end if;
 perform public.learning_check_access(attempt.enrollment_id,subject);
 if attempt.status<>'in_progress' or jsonb_typeof(responses)<>'object' or octet_length(responses::text)>64000 then raise exception 'Attempt cannot be saved'; end if;
 for pair in select * from jsonb_each_text(responses) loop
  if not exists(select 1 from jsonb_array_elements(attempt.question_snapshot) x cross join jsonb_array_elements(x->'options') o where x->>'id'=pair.key and o->>'id'=pair.value) then raise exception 'Invalid answer'; end if;
 end loop;
 update public.quiz_attempts set draft_answers=responses where id=attempt.id;
end $$;
revoke all on function public.learning_check_access(uuid,uuid),public.learning_start_check(uuid,uuid,uuid),public.learning_submit_check(uuid,uuid,jsonb),public.learning_save_check(uuid,uuid,jsonb),public.learning_refresh_completion(uuid,uuid),public.issue_certificate_for_enrollment(uuid,uuid) from public,anon,authenticated;
grant execute on function public.learning_check_access(uuid,uuid),public.learning_start_check(uuid,uuid,uuid),public.learning_submit_check(uuid,uuid,jsonb),public.learning_save_check(uuid,uuid,jsonb),public.learning_refresh_completion(uuid,uuid),public.issue_certificate_for_enrollment(uuid,uuid) to service_role;
create function public.learning_publish_checks() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.status='published' and old.status is distinct from 'published' then
  update public.assessments a set status='active' where a.course_id=new.course_id and a.status='draft' and exists(select 1 from public.course_lessons l where l.id=a.lesson_id and l.version_id=new.id and l.status<>'archived');
 end if;
 return new;
end $$;
create trigger learning_checks_on_publish after update of status on public.course_versions for each row execute function public.learning_publish_checks();
revoke all on function public.learning_publish_checks() from public,anon,authenticated;
create function public.studio_learning_policy(target_course uuid,passing numeric,attempts integer,checks_required boolean,enable_certificate boolean)
returns void language plpgsql security definer set search_path=public as $$
declare c public.courses%rowtype; issuer text;
begin
 if auth.uid() is null or not public.studio_can_edit_course(target_course) then raise exception 'Course cannot be edited'; end if;
 select * into c from public.courses where id=target_course for update;
 if passing is null or attempts is null or passing not between 1 and 100 or attempts not between 1 and 20 or checks_required is null or enable_certificate is null then raise exception 'Invalid completion policy'; end if;
 if enable_certificate and (not checks_required or not exists(select 1 from public.assessments a join public.quizzes q on q.assessment_id=a.id join public.quiz_questions x on x.quiz_id=q.id where a.course_id=c.id and a.status='draft' and x.status='active')) then raise exception 'Add required knowledge checks before enabling certificates'; end if;
 update public.assessments set required=checks_required where course_id=c.id and status='draft' and assessment_type='quiz';
 update public.quizzes q set passing_score=passing,attempts_allowed=attempts from public.assessments a where a.id=q.assessment_id and a.course_id=c.id and a.status='draft';
 update public.courses set certificate_available=enable_certificate where id=c.id;
 select name into issuer from public.academies where id=c.academy_id;
 update public.certificate_templates set status='draft' where template->>'course_id'=c.id::text;
 insert into public.certificate_templates(name,template,status) values(c.title||' - Completion',jsonb_build_object('course_id',c.id,'programme_title',coalesce(nullif(c.subtitle,''),c.title),'issuer',coalesce(issuer,'Solva Academy'),'issuance_enabled',enable_certificate,'specimen_only',false,'award_type','Certificate of Completion','accreditation_claim',false),'active');
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,new_data,success) values(auth.uid(),'course_completion_policy_updated','course',c.id::text,jsonb_build_object('pass_mark',passing,'attempts',attempts,'required_checks',checks_required,'certificates',enable_certificate),true);
end $$;
revoke all on function public.studio_learning_policy(uuid,numeric,integer,boolean,boolean) from public,anon;
grant execute on function public.studio_learning_policy(uuid,numeric,integer,boolean,boolean) to authenticated;
create policy support_reply_scope_guard on public.support_messages as restrictive for insert to authenticated with check (
 sender_id=auth.uid() and exists(select 1 from public.support_tickets t where t.id=ticket_id and (
  (t.requester_id=auth.uid() and message_type='customer_reply' and visibility='customer')
  or t.assigned_to=auth.uid() or public.current_user_has_permission('support.manage.assigned'))));
create policy support_ticket_update_guard on public.support_tickets as restrictive for update to authenticated
 using(assigned_to=auth.uid() or public.current_user_has_permission('support.manage.assigned'))
 with check(assigned_to=auth.uid() or public.current_user_has_permission('support.manage.assigned'));
end $migration$;
