do $migration$ begin
  create or replace function public.reserve_founding_role()
  returns trigger language plpgsql security definer set search_path=public as $$
  begin
    if exists(select 1 from public.roles where id=new.role_id and slug='founding-super-admin')
      and not exists(select 1 from public.platform_founder where user_id=new.user_id) then
      raise exception 'Founding Super Admin is reserved for the bound founding identity';
    end if;
    return new;
  end $$;
  create trigger founding_role_identity_guard before insert or update on public.user_role_assignments for each row execute function public.reserve_founding_role();
end $migration$;
