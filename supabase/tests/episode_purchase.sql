-- All fixtures are rolled back by the inner exception block.
do $$
declare u uuid; w uuid; c uuid; v uuid; m uuid; l uuid; p uuid; o uuid; a uuid; duplicate_access uuid;
begin
  select id into u from public.profiles order by created_at limit 1;
  select id into w from public.workspaces where owner_id = u limit 1;
  if u is null or w is null then raise exception 'Test requires an existing profile and workspace'; end if;
  begin
    insert into public.courses(owning_workspace_id,owner_id,title,slug,short_description) values(w,u,'Temporary access test',gen_random_uuid()::text,'Temporary transaction-scoped course') returning id into c;
    insert into public.course_versions(course_id,version_number,created_by) values(c,1,u) returning id into v;
    insert into public.course_modules(course_id,version_id,title,display_order) values(c,v,'Test module',1) returning id into m;
    insert into public.course_lessons(course_id,module_id,version_id,title,slug,lesson_type,display_order) values(c,m,v,'Test lesson','test','video',1) returning id into l;
    insert into public.products(product_type,name) values('course','Test class') returning id into p;
    insert into public.episode_products(product_id,course_id,lesson_id,version_id) values(p,c,l,v);
    insert into public.orders(order_number,customer_id,subtotal_minor,grand_total_minor,status) values(gen_random_uuid()::text,u,100000,100000,'pending_payment') returning id into o;
    insert into public.order_items(order_id,product_id,course_id,lesson_id,published_course_version_id,unit_price_minor,total_minor) values(o,p,c,l,v,100000,100000);
    a := public.complete_order_access(o,u);
    duplicate_access := public.complete_order_access(o,u);
    if a is null or duplicate_access is distinct from a then raise exception 'Idempotency failed'; end if;
    if (select count(*) from public.episode_entitlements where order_id=o) <> 1 then raise exception 'Incorrect class access count'; end if;
    if exists(select 1 from public.enrollments where course_id=c) then raise exception 'Class purchase unlocked full course'; end if;
    if not exists(select 1 from public.orders where id=o and payment_status='paid') then raise exception 'Order was not settled'; end if;
    if has_function_privilege('authenticated','public.complete_order_access(uuid,uuid)','execute') then raise exception 'Client settlement is exposed'; end if;
    insert into public.orders(order_number,customer_id,subtotal_minor,grand_total_minor,status) values(gen_random_uuid()::text,u,1600000,1600000,'pending_payment') returning id into o;
    insert into public.order_items(order_id,product_id,course_id,published_course_version_id,unit_price_minor,total_minor) values(o,p,c,v,1600000,1600000);
    a := public.complete_order_access(o,u);
    if not exists(select 1 from public.enrollments where id=a and course_id=c and course_version_id=v) then raise exception 'Full course enrollment missing'; end if;
    duplicate_access := public.complete_order_access(o,u);
    if duplicate_access is distinct from a then raise exception 'Full course idempotency failed'; end if;
    raise exception using errcode='ZX001', message='rollback successful test fixtures';
  exception when sqlstate 'ZX001' then
    raise notice 'PASS: class access, duplicate settlement, full-course isolation, service-only settlement. Fixtures rolled back.';
  end;
end $$;
