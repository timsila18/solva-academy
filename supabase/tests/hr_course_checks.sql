do $$
declare c public.courses%rowtype; n integer; quiz uuid;
begin
  select * into c from public.courses where slug='hr-practice-from-a-to-z';
  select count(*) into n from public.assessments where course_id=c.id and status='draft' and stakes='practice' and required=false;
  if n<>16 then raise exception 'Expected 16 draft practice checks'; end if;
  select count(*) into n from public.quiz_questions q join public.quizzes z on z.id=q.quiz_id join public.assessments a on a.id=z.assessment_id where a.course_id=c.id;
  if n<>48 then raise exception 'Expected 48 questions'; end if;
  if exists(select 1 from public.quiz_questions q join public.quizzes z on z.id=q.quiz_id join public.assessments a on a.id=z.assessment_id
    where a.course_id=c.id and ((select count(*) from public.quiz_question_options o where o.question_id=q.id)<>4
      or (select count(*) from public.quiz_question_options o where o.question_id=q.id and o.is_correct)<>1)) then
    raise exception 'Each question must have four options and one correct answer';
  end if;
  if not exists(select 1 from public.certificate_templates where template->>'course_id'=c.id::text and status='draft' and template->>'issuance_enabled'='false')
    or c.certificate_available then raise exception 'Certificate must remain an inactive template'; end if;
  if exists(select 1 from storage.buckets where id='course-authoring' and public) then raise exception 'Authoring bucket is public'; end if;
  perform set_config('request.jwt.claim.sub',c.owner_id::text,true);
  execute 'set local role authenticated';
  select count(*) into n from public.quiz_questions q join public.quizzes z on z.id=q.quiz_id join public.assessments a on a.id=z.assessment_id where a.course_id=c.id;
  if n<>48 then raise exception 'Owner cannot review prepared questions'; end if;
  perform set_config('request.jwt.claim.sub','',true);
  execute 'set local role anon';
  select count(*) into n from public.quiz_question_options;
  if n<>0 then raise exception 'Anonymous user can read the answer key'; end if;
  select count(*) into n from storage.objects where bucket_id='course-authoring';
  if n<>0 then raise exception 'Anonymous user can read private instructor PDFs'; end if;
  execute 'reset role';
end $$;
