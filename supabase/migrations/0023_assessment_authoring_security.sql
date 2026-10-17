-- Raw authoring records include answer keys and explanations. Learner delivery
-- must use a server-side projection, not direct access to these authoring tables.
do $migration$ begin
create or replace function public.can_author_course_assessment(target_course_id uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select auth.uid() is not null and exists(select 1 from public.courses c where c.id=target_course_id and (
    c.owner_id=auth.uid() or public.current_user_has_permission('settings.manage.platform')
    or exists(select 1 from public.course_team_members t where t.course_id=c.id and t.user_id=auth.uid() and t.status='active')));
$$;
create policy assessment_authoring_guard on public.assessments as restrictive for all
  using(public.can_author_course_assessment(course_id)) with check(public.can_author_course_assessment(course_id));
create policy quiz_authoring_guard on public.quizzes as restrictive for all
  using(exists(select 1 from public.assessments a where a.id=assessment_id and public.can_author_course_assessment(a.course_id)))
  with check(exists(select 1 from public.assessments a where a.id=assessment_id and public.can_author_course_assessment(a.course_id)));
create policy question_authoring_guard on public.quiz_questions as restrictive for all
  using(exists(select 1 from public.quizzes q join public.assessments a on a.id=q.assessment_id where q.id=quiz_id and public.can_author_course_assessment(a.course_id)))
  with check(exists(select 1 from public.quizzes q join public.assessments a on a.id=q.assessment_id where q.id=quiz_id and public.can_author_course_assessment(a.course_id)));
create policy options_authoring_guard on public.quiz_question_options as restrictive for all
  using(exists(select 1 from public.quiz_questions q where q.id=question_id))
  with check(exists(select 1 from public.quiz_questions q where q.id=question_id));
create policy scoring_authoring_guard on public.quiz_scoring_rules as restrictive for all
  using(exists(select 1 from public.quiz_questions q where q.id=question_id))
  with check(exists(select 1 from public.quiz_questions q where q.id=question_id));
end $migration$;
