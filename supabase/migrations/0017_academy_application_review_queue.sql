do $migration$ begin
  create or replace function public.queue_submitted_academy_application()
  returns trigger language plpgsql security definer set search_path = public as $$
  begin
    if new.status = 'submitted' then
      insert into public.review_queue(resource_type,resource_id,status)
      values('academy_application',new.id,'open');
    end if;
    return new;
  end;
  $$;
  create trigger academy_application_submission_queue
    after insert on public.academy_applications
    for each row execute function public.queue_submitted_academy_application();
end $migration$;
