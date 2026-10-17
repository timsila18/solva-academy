do $migration$ begin
  alter function public.complete_full_course_order_access(uuid,uuid) set search_path = public, extensions;
  alter function public.complete_order_access(uuid,uuid) set search_path = public, extensions;
end $migration$;
