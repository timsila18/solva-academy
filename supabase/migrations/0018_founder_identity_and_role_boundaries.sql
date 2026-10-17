do $migration$ begin
  create table public.platform_founder (
    singleton boolean primary key default true check(singleton),
    user_id uuid unique not null references auth.users(id) on delete restrict,
    established_at timestamptz not null default now()
  );
  alter table public.platform_founder enable row level security;
  create policy founder_read_admin on public.platform_founder for select using(public.current_user_has_permission('settings.manage.platform'));

  create or replace function public.bootstrap_founding_super_admin(founder_email text default 'timsila18@gmail.com')
  returns void language plpgsql security definer set search_path=public as $$
  declare founder_id uuid; workspace uuid; role_record record;
  begin
    select u.id into founder_id from auth.users u join public.platform_founder f on f.user_id=u.id where lower(u.email)=lower(founder_email);
    if founder_id is null then raise exception 'Founder must first be bound to an existing account by the database owner'; end if;
    insert into public.workspaces(name,slug,type,owner_id,status)
    values('Platform administration','platform-administration','platform_admin',founder_id,'active')
    on conflict(slug) do update set owner_id=excluded.owner_id,name=excluded.name,status='active'
    returning id into workspace;
    update public.profiles set is_founding_admin=true,account_status='active' where id=founder_id;
    insert into public.workspace_members(workspace_id,user_id,status,joined_at) values(workspace,founder_id,'active',now())
      on conflict(workspace_id,user_id) do update set status='active';
    for role_record in select id,scope from public.roles where slug in ('founding-super-admin','super-admin','platform-administrator') loop
      if not exists(select 1 from public.user_role_assignments where user_id=founder_id and role_id=role_record.id and workspace_id=workspace and status='active') then
        insert into public.user_role_assignments(user_id,role_id,workspace_id,scope,reason)
        values(founder_id,role_record.id,workspace,'platform','Owner-authorized founding administrator setup');
      end if;
    end loop;
    insert into public.role_permissions(role_id,permission_id)
    select r.id,p.id from public.roles r cross join public.permissions p where r.slug='founding-super-admin' and p.scope='platform'
    on conflict do nothing;
    update public.user_preferences set active_workspace_id=workspace where user_id=founder_id;
    insert into public.audit_logs(actor_id,action,resource_type,resource_id,workspace_id,reason,success)
    values(founder_id,'founding_account_configured','user',founder_id::text,workspace,'Explicit owner request',true);
  end $$;
  revoke execute on function public.bootstrap_founding_super_admin(text) from public,anon,authenticated;
  grant execute on function public.bootstrap_founding_super_admin(text) to service_role;

  create or replace function public.prevent_founding_admin_lockout()
  returns trigger language plpgsql security definer set search_path=public as $$
  begin
    if exists(select 1 from public.platform_founder f join public.roles r on r.slug='founding-super-admin' where f.user_id=old.user_id and r.id=old.role_id) then
      if tg_op='DELETE' then raise exception 'The founding administrator assignment is protected'; end if;
      if new.user_id<>old.user_id or new.role_id<>old.role_id or new.workspace_id is distinct from old.workspace_id or new.scope<>'platform' or new.status<>'active' or new.expires_at is not null or new.starts_at>now() then
        raise exception 'The founding administrator assignment cannot be demoted, moved, revoked, or expired';
      end if;
    end if;
    if tg_op='DELETE' then return old; end if;
    return new;
  end $$;

  create or replace function public.protect_founder_profile()
  returns trigger language plpgsql security definer set search_path=public as $$
  begin
    if exists(select 1 from public.platform_founder where user_id=old.id) then
      if tg_op='DELETE' then raise exception 'The founding administrator profile is protected'; end if;
      if not new.is_founding_admin or new.account_status<>'active' or new.email is distinct from old.email then raise exception 'Founding administrator identity changes require a governed database maintenance procedure'; end if;
    end if;
    if tg_op='DELETE' then return old; end if;
    return new;
  end $$;
  create trigger founder_profile_protect before update or delete on public.profiles for each row execute function public.protect_founder_profile();

  create or replace function public.check_role_workspace_boundary()
  returns trigger language plpgsql security definer set search_path=public as $$
  declare role_scope text; role_slug text; workspace_type text;
  begin
    if new.status<>'active' then return new; end if;
    select scope,slug into role_scope,role_slug from public.roles where id=new.role_id;
    select type into workspace_type from public.workspaces where id=new.workspace_id;
    if new.scope<>role_scope then raise exception 'Assignment scope does not match the role'; end if;
    if role_scope='platform' and workspace_type is distinct from 'platform_admin' then raise exception 'Platform roles require a platform workspace'; end if;
    if role_scope='academy' and workspace_type is distinct from 'academy' then raise exception 'Academy roles require an academy workspace'; end if;
    if role_scope='organization' and workspace_type is distinct from 'organization' then raise exception 'Organization roles require an organization workspace'; end if;
    if role_slug='learner' and workspace_type is distinct from 'personal_learning' then raise exception 'Learner role belongs in Personal Learning'; end if;
    if role_slug='instructor' and (workspace_type is null or workspace_type not in ('tutor','academy','organization')) then raise exception 'Instructor role requires a teaching workspace'; end if;
    return new;
  end $$;
  create trigger role_workspace_boundary before insert or update on public.user_role_assignments for each row execute function public.check_role_workspace_boundary();
end $migration$;
