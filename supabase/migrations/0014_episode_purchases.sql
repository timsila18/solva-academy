do $migration$ begin
  create table public.episode_products (
    product_id uuid primary key references public.products(id),
    course_id uuid not null references public.courses(id),
    lesson_id uuid not null references public.course_lessons(id),
    version_id uuid not null references public.course_versions(id),
    unique(lesson_id,version_id)
  );
  alter table public.order_items add column lesson_id uuid references public.course_lessons(id);
  create table public.episode_entitlements (
    id uuid primary key default gen_random_uuid(),
    learner_id uuid not null references public.profiles(id),
    course_id uuid not null references public.courses(id),
    lesson_id uuid not null references public.course_lessons(id),
    version_id uuid not null references public.course_versions(id),
    order_id uuid not null references public.orders(id),
    status text not null default 'active' check(status in ('active','revoked','refunded','expired')),
    ends_at timestamptz,
    created_at timestamptz not null default now(),
    unique(order_id,lesson_id)
  );
  create table public.episode_progress (
    entitlement_id uuid primary key references public.episode_entitlements(id),
    last_position_seconds integer not null default 0 check(last_position_seconds >= 0),
    completed boolean not null default false,
    updated_at timestamptz not null default now()
  );
  alter table public.episode_products enable row level security;
  alter table public.episode_entitlements enable row level security;
  alter table public.episode_progress enable row level security;
  create policy episode_products_public on public.episode_products for select using (
    exists(select 1 from public.courses c where c.id = course_id and c.status = 'published' and c.visibility = 'public'));
  create policy episode_access_own on public.episode_entitlements for select using(learner_id = auth.uid());
  create policy episode_progress_own on public.episode_progress for select using (
    exists(select 1 from public.episode_entitlements e where e.id = entitlement_id and e.learner_id = auth.uid()));

  alter function public.complete_order_access(uuid,uuid) rename to complete_full_course_order_access;
  revoke execute on function public.complete_full_course_order_access(uuid,uuid) from public, anon, authenticated;
  create function public.complete_order_access(target_order_id uuid, actor uuid)
  returns uuid language plpgsql security definer set search_path = public as $$
  declare ord public.orders%rowtype; item public.order_items%rowtype; access_id uuid;
  begin
    select * into ord from public.orders where id = target_order_id for update;
    if ord.id is null then raise exception 'Order not found'; end if;
    select * into item from public.order_items where order_id = ord.id limit 1;
    if item.id is null then raise exception 'Order item not found'; end if;
    if item.lesson_id is null then return public.complete_full_course_order_access(target_order_id, actor); end if;
    if not exists(select 1 from public.episode_products p where p.product_id = item.product_id and p.course_id = item.course_id and p.lesson_id = item.lesson_id and p.version_id = item.published_course_version_id) then raise exception 'Episode mismatch'; end if;
    if ord.status = 'paid' then
      select id into access_id from public.episode_entitlements where order_id = ord.id and lesson_id = item.lesson_id;
      return access_id;
    end if;
    insert into public.episode_entitlements(learner_id,course_id,lesson_id,version_id,order_id,ends_at)
    values(ord.customer_id,item.course_id,item.lesson_id,item.published_course_version_id,ord.id,
      case when item.access_duration_days is null then null else now()+make_interval(days=>item.access_duration_days) end)
    returning id into access_id;
    update public.orders set status='paid',payment_status='paid',paid_at=now() where id=ord.id;
    insert into public.receipts(order_id,receipt_number,verification_code,snapshot)
    values(ord.id,'SA-'||upper(substr(ord.id::text,1,12)),encode(gen_random_bytes(12),'hex'),jsonb_build_object('order',to_jsonb(ord),'item',to_jsonb(item))) on conflict(order_id) do nothing;
    insert into public.audit_logs(actor_id,action,resource_type,resource_id,success)
    values(ord.customer_id,'episode_access_granted','order',ord.id::text,true);
    return access_id;
  end $$;
  revoke execute on function public.complete_order_access(uuid,uuid) from public, anon, authenticated;
  grant execute on function public.complete_order_access(uuid,uuid) to service_role;
end $migration$;
