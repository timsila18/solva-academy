do $migration$ begin
  create or replace function public.sync_auth_profile_activation()
  returns trigger language plpgsql security definer set search_path = public as $$
  begin
    if new.email_confirmed_at is not null then
      update public.profiles set account_status = 'active', updated_at = now()
      where id = new.id and account_status = 'email_unverified';
    end if;
    return new;
  end;
  $$;
  create trigger sync_profile_on_auth_confirmation
    after update of email_confirmed_at on auth.users
    for each row execute function public.sync_auth_profile_activation();
  update public.profiles p set account_status = 'active', updated_at = now()
  from auth.users u where p.id = u.id and p.account_status = 'email_unverified' and u.email_confirmed_at is not null;
end $migration$;
