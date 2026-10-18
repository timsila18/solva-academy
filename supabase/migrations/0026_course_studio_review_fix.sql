do $migration$ begin
create or replace function public.create_course_review(target_course_id uuid,actor uuid,change_summary text default null)
returns uuid language plpgsql security definer set search_path=public as $$
declare review uuid;
begin
 if auth.uid() is null or actor is distinct from auth.uid() then raise exception 'Access denied'; end if;
 perform public.studio_command(target_course_id,'submit','{}');
 select id into review from public.course_reviews where course_id=target_course_id order by submitted_at desc limit 1;
 return review;
end $$;
revoke all on function public.create_course_review(uuid,uuid,text) from public,anon;
grant execute on function public.create_course_review(uuid,uuid,text) to authenticated;
end $migration$;
