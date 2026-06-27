-- BCS Marina Ops Mobile Lite v3.4 hardened schema
-- Run this once in Supabase SQL Editor before using the app.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'office' check (role in ('owner','general_manager','office','billing','technician','viewer')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.vessels (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  name text not null,
  make text,
  model text,
  year integer,
  created_at timestamptz not null default now()
);

create table if not exists public.estimates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  vessel_id uuid references public.vessels(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','sent','approved','converted','declined')),
  total numeric(12,2) default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  vessel_id uuid references public.vessels(id) on delete set null,
  estimate_id uuid references public.estimates(id) on delete set null,
  created_by uuid not null references auth.users(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','sent','paid','void')),
  total numeric(12,2) default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.work_orders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  vessel_id uuid references public.vessels(id) on delete set null,
  estimate_id uuid references public.estimates(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  technician_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'new' check (status in ('new','scheduled','in_progress','waiting_parts','complete','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_org_members_user on public.organization_members(user_id);
create index if not exists idx_customers_company on public.customers(company_id);
create index if not exists idx_vessels_company on public.vessels(company_id);
create index if not exists idx_estimates_company_creator on public.estimates(company_id, created_by);
create index if not exists idx_invoices_company_creator on public.invoices(company_id, created_by);
create index if not exists idx_work_orders_company_technician on public.work_orders(company_id, technician_id);

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.has_org_role(org_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role = any(allowed_roles)
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.customers enable row level security;
alter table public.vessels enable row level security;
alter table public.estimates enable row level security;
alter table public.invoices enable row level security;
alter table public.work_orders enable row level security;

drop policy if exists "members can read orgs" on public.organizations;
create policy "members can read orgs" on public.organizations
for select using (public.is_org_member(id));

drop policy if exists "owners can update orgs" on public.organizations;
create policy "owners can update orgs" on public.organizations
for update using (public.has_org_role(id, array['owner','general_manager']));

drop policy if exists "members can read memberships" on public.organization_members;
create policy "members can read memberships" on public.organization_members
for select using (public.is_org_member(organization_id) or user_id = auth.uid());

drop policy if exists "owners manage memberships" on public.organization_members;
create policy "owners manage memberships" on public.organization_members
for all using (public.has_org_role(organization_id, array['owner','general_manager']))
with check (public.has_org_role(organization_id, array['owner','general_manager']));

drop policy if exists "members read customers" on public.customers;
create policy "members read customers" on public.customers
for select using (public.is_org_member(company_id));

drop policy if exists "office creates customers" on public.customers;
create policy "office creates customers" on public.customers
for insert with check (public.has_org_role(company_id, array['owner','general_manager','office','billing']));

drop policy if exists "office updates customers" on public.customers;
create policy "office updates customers" on public.customers
for update using (public.has_org_role(company_id, array['owner','general_manager','office','billing']))
with check (public.has_org_role(company_id, array['owner','general_manager','office','billing']));

drop policy if exists "members read vessels" on public.vessels;
create policy "members read vessels" on public.vessels
for select using (public.is_org_member(company_id));

drop policy if exists "office creates vessels" on public.vessels;
create policy "office creates vessels" on public.vessels
for insert with check (public.has_org_role(company_id, array['owner','general_manager','office','billing']));

drop policy if exists "office updates vessels" on public.vessels;
create policy "office updates vessels" on public.vessels
for update using (public.has_org_role(company_id, array['owner','general_manager','office','billing']))
with check (public.has_org_role(company_id, array['owner','general_manager','office','billing']));

drop policy if exists "estimate visibility" on public.estimates;
create policy "estimate visibility" on public.estimates
for select using (
  public.has_org_role(company_id, array['owner','general_manager'])
  or created_by = auth.uid()
);

drop policy if exists "estimate creation" on public.estimates;
create policy "estimate creation" on public.estimates
for insert with check (
  created_by = auth.uid()
  and public.has_org_role(company_id, array['owner','general_manager','office','billing'])
);

drop policy if exists "estimate update" on public.estimates;
create policy "estimate update" on public.estimates
for update using (
  public.has_org_role(company_id, array['owner','general_manager'])
  or created_by = auth.uid()
) with check (
  public.has_org_role(company_id, array['owner','general_manager'])
  or created_by = auth.uid()
);

drop policy if exists "invoice visibility" on public.invoices;
create policy "invoice visibility" on public.invoices
for select using (
  public.has_org_role(company_id, array['owner','general_manager'])
  or created_by = auth.uid()
);

drop policy if exists "invoice creation" on public.invoices;
create policy "invoice creation" on public.invoices
for insert with check (
  created_by = auth.uid()
  and public.has_org_role(company_id, array['owner','general_manager','office','billing'])
);

drop policy if exists "invoice update" on public.invoices;
create policy "invoice update" on public.invoices
for update using (
  public.has_org_role(company_id, array['owner','general_manager'])
  or created_by = auth.uid()
) with check (
  public.has_org_role(company_id, array['owner','general_manager'])
  or created_by = auth.uid()
);

drop policy if exists "work order visibility" on public.work_orders;
create policy "work order visibility" on public.work_orders
for select using (
  public.has_org_role(company_id, array['owner','general_manager','office','billing'])
  or created_by = auth.uid()
  or technician_id = auth.uid()
);

drop policy if exists "work order creation" on public.work_orders;
create policy "work order creation" on public.work_orders
for insert with check (
  created_by = auth.uid()
  and public.has_org_role(company_id, array['owner','general_manager','office','billing'])
);

drop policy if exists "work order update" on public.work_orders;
create policy "work order update" on public.work_orders
for update using (
  public.has_org_role(company_id, array['owner','general_manager','office','billing'])
  or technician_id = auth.uid()
) with check (
  public.has_org_role(company_id, array['owner','general_manager','office','billing'])
  or technician_id = auth.uid()
);
