do $migration$ begin
  create or replace function public.protect_founder_auth_identity()
  returns trigger language plpgsql security definer set search_path=public as $$
  begin
    if exists(select 1 from public.platform_founder where user_id=old.id)
      and (new.email is distinct from old.email or (new.banned_until is not null and new.banned_until>now())) then
      raise exception 'Founding account email changes and suspension require governed database maintenance';
    end if;
    return new;
  end $$;
  create trigger founder_auth_identity_protect before update of email,banned_until on auth.users for each row execute function public.protect_founder_auth_identity();
end $migration$;
