import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const checks = JSON.parse(await readFile(new URL("./content/hr-masterclass-checks.json", import.meta.url), "utf8"));
if (checks.length !== 16 || checks.some((c, i) => c.class !== i + 1 || c.questions.length !== 3 || c.questions.some(q => q.options.length !== 4 || !Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3 || !q.explanation))) throw new Error("Invalid knowledge-check content.");
const payload = JSON.stringify(checks).replaceAll("'", "''");
const sql = `do $setup$
declare c public.courses%rowtype; unit jsonb; question jsonb; opt text; a uuid; quiz uuid; q uuid; m uuid; l uuid; n integer; k integer;
begin
  perform pg_advisory_xact_lock(hashtext('hr-course-checks-setup'));
  select * into c from public.courses where slug='hr-practice-from-a-to-z';
  if c.id is null or c.status <> 'draft' or c.owner_id <> (select user_id from public.platform_founder) then raise exception 'Expected the founding owner''s draft course'; end if;
  for unit in select value from jsonb_array_elements('${payload}'::jsonb) loop
    if not exists(select 1 from public.assessments where course_id=c.id and attempt_rules->>'setup_key'='hr-check-' || (unit->>'class')) then
      select id into m from public.course_modules where course_id=c.id and display_order=(unit->>'class')::integer;
      select id into l from public.course_lessons where module_id=m and course_id=c.id and lesson_type='video';
      if m is null or l is null then raise exception 'Prepared class is missing'; end if;
      insert into public.assessments(course_id,module_id,lesson_id,assessment_type,title,stakes,review_method,required,attempt_rules,status)
        values(c.id,m,l,'quiz','Class ' || lpad(unit->>'class',2,'0') || ' knowledge check','practice','automated',false,
        jsonb_build_object('setup_key','hr-check-' || (unit->>'class'),'source','Owner-supplied 448-slide masterclass presentation'),'draft') returning id into a;
      insert into public.quizzes(assessment_id,instructions,practice_or_graded,time_limit_minutes,show_correct_answers,show_explanations,feedback_timing)
        values(a,'Choose one answer per question. These short practice checks support learning; they are not an accredited examination.','practice',null,true,true,'after_submission') returning id into quiz;
      n:=0;
      for question in select value from jsonb_array_elements(unit->'questions') loop
        n:=n+1;
        insert into public.quiz_questions(quiz_id,prompt,question_type,points,explanation,difficulty,reviewer_notes,display_order)
          values(quiz,question->>'prompt','single_choice',1,question->>'explanation','foundation','Draft for facilitator review; no regulatory qualification claim.',n) returning id into q;
        k:=0;
        for opt in select value from jsonb_array_elements_text(question->'options') loop
          insert into public.quiz_question_options(question_id,option_text,is_correct,display_order)
            values(q,opt,k=(question->>'correct')::integer,k+1);
          k:=k+1;
        end loop;
      end loop;
    end if;
  end loop;
  if not exists(select 1 from public.certificate_templates where template->>'course_id'=c.id::text and template->>'design_key'='solva-hr-completion-v1') then
    insert into public.certificate_templates(name,template,status) values('Solva HR Academy - Practical Human Resource Management',
      jsonb_build_object('course_id',c.id,'design_key','solva-hr-completion-v1','award_type','Certificate of Completion',
      'programme_title','Practical Human Resource Management','course_subtitle','HR Practice from A to Z','issuer','Solva HR Academy',
      'signatory_name','Timothy Sila','signatory_role','Programme Facilitator','page_size','A4 landscape',
      'primary_colour','#0066FF','background_colour','#FFFFFF','text_colour','#111111',
      'required_fields',jsonb_build_array('learner_name','issued_at','certificate_number','verification_code'),
      'issuance_enabled',false,'eligibility_policy_status','awaiting_owner_approval',
      'accreditation_claim',false,'specimen_only',true),'draft');
  end if;
  if not exists(select 1 from public.audit_logs where resource_id=c.id::text and action='course_checks_and_certificate_prepared') then
    insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,new_data,reason,success)
      values(c.owner_id,'course_checks_and_certificate_prepared','course',c.id::text,c.owning_workspace_id,
      jsonb_build_object('practice_checks',16,'questions',48,'certificate_status','draft'),
      'Owner requested brief slide-based tests and a professional certificate specimen.',true);
  end if;
end $setup$;`;
await mkdir(".vercel/content-setup", { recursive: true });
const file = ".vercel/content-setup/hr-checks.sql";
await writeFile(file, sql);
const result = spawnSync("powershell.exe", ["-NoProfile", "-Command", `& npx.cmd --yes supabase db query --db-url $env:DATABASE_URL --file ${file}`], { encoding: "utf8", env: process.env });
console.log(((result.stdout ?? "") + (result.stderr ?? "")).replaceAll(process.env.DATABASE_URL ?? "UNSET", "[redacted]"));
process.exitCode = result.status ?? 1;
