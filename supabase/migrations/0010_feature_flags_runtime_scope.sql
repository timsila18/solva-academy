alter table public.feature_flags
  add column if not exists scope text not null default 'global' check (scope in ('global','workspace','user','beta_group')),
  add column if not exists beta_group text;

update public.feature_flags
set scope = case
  when array_length(workspace_allowlist, 1) is not null then 'workspace'
  when array_length(user_allowlist, 1) is not null then 'user'
  else 'global'
end
where scope = 'global';
