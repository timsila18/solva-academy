do $$
declare founder uuid; platform uuid; learner uuid; other_user uuid; denied boolean;
begin
  select user_id into founder from public.platform_founder;
  if founder is null then raise exception 'Founding identity missing'; end if;
  select id into platform from public.workspaces where type='platform_admin' and owner_id=founder;
  perform set_config('request.jwt.claim.sub',founder::text,true);
  if not public.current_user_has_permission('settings.manage.platform') then raise exception 'Founder cannot administer platform'; end if;
  if not public.current_user_has_permission('application.review.platform') then raise exception 'Founder cannot review applications'; end if;
  if has_function_privilege('anon','public.bootstrap_founding_super_admin(text)','execute') or has_function_privilege('authenticated','public.bootstrap_founding_super_admin(text)','execute') then raise exception 'Founder provisioning is publicly callable'; end if;
  denied:=false;
  begin
    update public.user_role_assignments set status='revoked' where user_id=founder and role_id=(select id from public.roles where slug='founding-super-admin');
  exception when others then denied:=sqlerrm like '%founding administrator assignment%'; end;
  if not denied then raise exception 'Founding role revocation was not blocked'; end if;
  denied:=false;
  begin
    update public.profiles set account_status='suspended' where id=founder;
  exception when others then denied:=sqlerrm like '%Founding administrator identity%'; end;
  if not denied then raise exception 'Founder profile suspension was not blocked'; end if;
  denied:=false;
  begin
    update auth.users set banned_until=now()+interval '1 hour' where id=founder;
  exception when others then denied:=sqlerrm like '%Founding account email changes%'; end;
  if not denied then raise exception 'Founder authentication suspension was not blocked'; end if;
  select id into learner from public.roles where slug='learner';
  denied:=false;
  begin
    insert into public.user_role_assignments(user_id,role_id,workspace_id,scope,reason) values(founder,learner,platform,'own','Boundary test');
  exception when others then denied:=sqlerrm like '%Learner role belongs%'; end;
  if not denied then raise exception 'Learner was allowed in platform administration'; end if;
  select id into other_user from public.profiles where id<>founder limit 1;
  if other_user is not null then
    denied:=false;
    begin
      insert into public.user_role_assignments(user_id,role_id,workspace_id,scope,reason)
      values(other_user,(select id from public.roles where slug='founding-super-admin'),platform,'platform','Founder identity test');
    exception when others then denied:=sqlerrm like '%reserved for the bound founding identity%'; end;
    if not denied then raise exception 'Founding role was assigned to another identity'; end if;
  end if;
end $$;
