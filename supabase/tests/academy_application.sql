do $$
declare u uuid; app uuid;
begin
  select id into u from public.profiles order by created_at limit 1;
  if u is null then raise exception 'Test requires an existing profile'; end if;
  begin
    perform set_config('request.jwt.claim.sub',u::text,true);
    set local role authenticated;
    insert into public.academy_applications(applicant_id,academy_name,slug,short_description,why_teach,expected_audience,terms_accepted,status)
    values(u,'Temporary application test',gen_random_uuid()::text,'Transaction-scoped application test','Testing application submission safely','Temporary test audience',true,'submitted')
    returning id into app;
    reset role;
    if (select count(*) from public.review_queue where resource_type='academy_application' and resource_id=app and status='open') <> 1 then raise exception 'Review queue was not populated'; end if;
    raise exception using errcode='ZX001', message='Rollback successful application fixture';
  exception when sqlstate 'ZX001' then
    raise notice 'PASS: authenticated applicant submission creates review queue entry; fixtures rolled back.';
  end;
end $$;
