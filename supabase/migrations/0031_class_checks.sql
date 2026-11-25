do $migration$ begin
alter table public.quiz_attempts alter column enrollment_id drop not null;
alter table public.quiz_attempts add column episode_entitlement_id uuid references public.episode_entitlements(id) on delete cascade;
alter table public.quiz_attempts add constraint quiz_attempt_one_access_source check(num_nonnulls(enrollment_id,episode_entitlement_id)=1);
create unique index quiz_attempt_episode_number on public.quiz_attempts(episode_entitlement_id,quiz_id,attempt_number) where episode_entitlement_id is not null;
grant select(episode_entitlement_id) on public.quiz_attempts to authenticated;
create policy class_attempts_read_own on public.quiz_attempts for select to authenticated using(exists(select 1 from public.episode_entitlements e where e.id=episode_entitlement_id and e.learner_id=auth.uid()));
create policy class_answers_read_own on public.quiz_attempt_answers for select to authenticated using(exists(select 1 from public.quiz_attempts a join public.episode_entitlements e on e.id=a.episode_entitlement_id where a.id=attempt_id and e.learner_id=auth.uid()));

-- A class entitlement is used as an access context, never as a full enrollment.
create function public.learning_check_source(target_access uuid,subject uuid)
returns public.enrollments language plpgsql security definer set search_path=public as $$
declare e public.enrollments%rowtype; ep public.episode_entitlements%rowtype;
begin
 if exists(select 1 from public.enrollments where id=target_access) then
  perform 1 from public.enrollments where id=target_access for update;
  return public.learning_check_access(target_access,subject);
 end if;
 select * into ep from public.episode_entitlements where id=target_access and learner_id=subject for update;
 if ep.id is null or ep.status<>'active' or (ep.ends_at is not null and ep.ends_at<=now()) or not exists(select 1 from public.course_lessons l where l.id=ep.lesson_id and l.course_id=ep.course_id and l.version_id=ep.version_id and l.status<>'archived') then raise exception 'Class access required';end if;
 e.id:=ep.id;e.learner_id:=ep.learner_id;e.course_id:=ep.course_id;e.course_version_id:=ep.version_id;
 return e;
end $$;
create function public.learning_attempt_access(target_attempt uuid,subject uuid)
returns void language plpgsql security definer set search_path=public as $$
declare attempt public.quiz_attempts%rowtype; context public.enrollments%rowtype;
begin
 select * into attempt from public.quiz_attempts where id=target_attempt;
 if attempt.id is null then raise exception 'Attempt not found';end if;
 context:=public.learning_check_source(coalesce(attempt.enrollment_id,attempt.episode_entitlement_id),subject);
 if not exists(select 1 from public.quizzes q join public.assessments a on a.id=q.assessment_id join public.course_lessons l on l.id=a.lesson_id where q.id=attempt.quiz_id and a.course_id=context.course_id and l.course_id=context.course_id and l.version_id=context.course_version_id and l.status<>'archived' and (attempt.episode_entitlement_id is null or l.id=(select lesson_id from public.episode_entitlements where id=attempt.episode_entitlement_id))) then raise exception 'Check access required';end if;
end $$;

create or replace function public.learning_start_check(target_enrollment uuid,target_quiz uuid,subject uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare e public.enrollments%rowtype; a public.assessments%rowtype; q public.quizzes%rowtype; existing uuid; n integer; next_number integer; snapshot jsonb; full_access boolean; purchased_lesson uuid;
begin
 e:=public.learning_check_source(target_enrollment,subject);
 full_access:=exists(select 1 from public.enrollments where id=e.id);
 if not full_access then select lesson_id into purchased_lesson from public.episode_entitlements where id=e.id;end if;
 select * into q from public.quizzes where id=target_quiz;
 select * into a from public.assessments where id=q.assessment_id and course_id=e.course_id and status='active' and review_method='automated';
 if a.id is null or a.lesson_id is null or (not full_access and a.lesson_id<>purchased_lesson) or not exists(select 1 from public.course_lessons l where l.id=a.lesson_id and l.course_id=e.course_id and l.version_id=e.course_version_id and l.status<>'archived') then raise exception 'Check unavailable for this class'; end if;
 select id into existing from public.quiz_attempts where (enrollment_id=e.id or episode_entitlement_id=e.id) and quiz_id=q.id and status='in_progress';
 if existing is not null then return existing;end if;
 select count(*) filter(where status<>'invalidated'),coalesce(max(attempt_number),0)+1 into n,next_number from public.quiz_attempts where (enrollment_id=e.id or episode_entitlement_id=e.id) and quiz_id=q.id;
 if q.attempts_allowed is not null and n>=q.attempts_allowed then raise exception 'Attempt limit reached';end if;
 if exists(select 1 from public.quiz_questions x where x.quiz_id=q.id and x.status='active' and (x.question_type<>'single_choice' or x.points<=0 or (select count(*) from public.quiz_question_options o where o.question_id=x.id and o.is_correct)<>1 or (select count(*) from public.quiz_question_options o where o.question_id=x.id)<2)) then raise exception 'Check needs instructor review';end if;
 select jsonb_agg(jsonb_build_object('id',x.id,'prompt',x.prompt,'points',x.points,'explanation',x.explanation,'options',(select jsonb_agg(jsonb_build_object('id',o.id,'text',o.option_text,'correct',o.is_correct) order by o.display_order) from public.quiz_question_options o where o.question_id=x.id)) order by x.display_order) into snapshot from public.quiz_questions x where x.quiz_id=q.id and x.status='active';
 if snapshot is null then raise exception 'No questions available';end if;
 insert into public.quiz_attempts(enrollment_id,episode_entitlement_id,quiz_id,attempt_number,question_snapshot,delivery_rules)
 values(case when full_access then e.id end,case when not full_access then e.id end,q.id,next_number,snapshot,jsonb_build_object('passingScore',coalesce(q.passing_score,70),'timeLimitMinutes',q.time_limit_minutes,'showCorrectAnswers',q.show_correct_answers,'showExplanations',q.show_explanations)) returning id into existing;
 insert into public.audit_logs(actor_id,action,resource_type,resource_id,new_data,success) values(subject,'learning_check_started','quiz_attempt',existing::text,jsonb_build_object('access_type',case when full_access then 'course' else 'class' end),true);
 return existing;
end $$;

-- Preserve the established transactional scoring and autosave implementation.
execute replace(pg_get_functiondef('public.learning_submit_check(uuid,uuid,jsonb)'::regprocedure),
 'e:=public.learning_check_access(attempt.enrollment_id,subject);','perform public.learning_attempt_access(attempt.id,subject);');
execute replace(pg_get_functiondef('public.learning_save_check(uuid,uuid,jsonb)'::regprocedure),
 'perform public.learning_check_access(attempt.enrollment_id,subject);','perform public.learning_attempt_access(attempt.id,subject);');
if position('learning_attempt_access(attempt.id,subject)' in pg_get_functiondef('public.learning_submit_check(uuid,uuid,jsonb)'::regprocedure))=0 or position('learning_attempt_access(attempt.id,subject)' in pg_get_functiondef('public.learning_save_check(uuid,uuid,jsonb)'::regprocedure))=0 then raise exception 'Class-check authorization update failed';end if;
revoke all on function public.learning_check_source(uuid,uuid),public.learning_attempt_access(uuid,uuid) from public,anon,authenticated;
grant execute on function public.learning_check_source(uuid,uuid),public.learning_attempt_access(uuid,uuid) to service_role;
end $migration$;
