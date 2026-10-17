alter policy schools_public_read on public.schools using (
  (visibility = 'public' and status in ('active', 'published'))
  or public.current_user_has_permission('settings.manage.platform')
);
