-- BCS Marina Ops Enterprise v2.0 synchronized schema
-- Run this ONCE in Supabase SQL Editor before testing invoices/estimates.
-- It is designed to repair/upgrade an existing prototype database without dropping business data.

create extension if not exists pgcrypto;

-- Core workspace tables
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text,
  slug text,
  plan text default 'enterprise',
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  user_id uuid,
  role text default 'owner',
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text,
  email text,
  phone text,
  status text default 'active',
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists vessels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  customer_id uuid,
  name text,
  make text,
  model text,
  length_ft numeric,
  hin text,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists work_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  customer_id uuid,
  vessel_id uuid,
  title text,
  status text default 'new',
  priority text default 'medium',
  total_cents integer default 0,
  due_date date,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists estimates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  customer_id uuid,
  vessel_id uuid,
  estimate_number text,
  customer_name text,
  vessel_name text,
  scope text,
  status text default 'draft',
  notes text,
  total_cents integer default 0,
  created_by uuid,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  customer_id uuid,
  work_order_id uuid,
  invoice_number text,
  customer_name text,
  customer_email text,
  status text default 'draft',
  notes text,
  due_date date,
  total_cents integer default 0,
  stripe_invoice_id text,
  created_by uuid,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid,
  description text,
  quantity numeric default 1,
  unit_price_cents integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists estimate_lines (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid,
  description text,
  quantity numeric default 1,
  unit_price_cents integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  name text,
  sku text,
  quantity numeric default 0,
  reorder_point numeric default 0,
  unit_cost_cents integer default 0,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Repair/upgrade columns for existing prototype tables.
alter table organizations add column if not exists name text;
alter table organizations add column if not exists slug text;
alter table organizations add column if not exists plan text default 'enterprise';
alter table organizations add column if not exists created_at timestamptz not null default now();

alter table organization_members add column if not exists organization_id uuid;
alter table organization_members add column if not exists user_id uuid;
alter table organization_members add column if not exists role text default 'owner';
alter table organization_members add column if not exists created_at timestamptz not null default now();

alter table invoices add column if not exists organization_id uuid;
alter table invoices add column if not exists customer_id uuid;
alter table invoices add column if not exists work_order_id uuid;
alter table invoices add column if not exists invoice_number text;
alter table invoices add column if not exists customer_name text;
alter table invoices add column if not exists customer_email text;
alter table invoices add column if not exists status text default 'draft';
alter table invoices add column if not exists notes text;
alter table invoices add column if not exists due_date date;
alter table invoices add column if not exists total_cents integer default 0;
alter table invoices add column if not exists stripe_invoice_id text;
alter table invoices add column if not exists created_by uuid;
alter table invoices add column if not exists updated_at timestamptz not null default now();
alter table invoices add column if not exists created_at timestamptz not null default now();

alter table estimates add column if not exists organization_id uuid;
alter table estimates add column if not exists customer_id uuid;
alter table estimates add column if not exists vessel_id uuid;
alter table estimates add column if not exists estimate_number text;
alter table estimates add column if not exists customer_name text;
alter table estimates add column if not exists vessel_name text;
alter table estimates add column if not exists scope text;
alter table estimates add column if not exists status text default 'draft';
alter table estimates add column if not exists notes text;
alter table estimates add column if not exists total_cents integer default 0;
alter table estimates add column if not exists created_by uuid;
alter table estimates add column if not exists updated_at timestamptz not null default now();
alter table estimates add column if not exists created_at timestamptz not null default now();

alter table customers add column if not exists organization_id uuid;
alter table customers add column if not exists name text;
alter table customers add column if not exists email text;
alter table customers add column if not exists phone text;
alter table customers add column if not exists status text default 'active';
alter table customers add column if not exists created_by uuid;
alter table customers add column if not exists created_at timestamptz not null default now();

alter table vessels add column if not exists organization_id uuid;
alter table vessels add column if not exists customer_id uuid;
alter table vessels add column if not exists name text;
alter table vessels add column if not exists make text;
alter table vessels add column if not exists model text;
alter table vessels add column if not exists length_ft numeric;
alter table vessels add column if not exists hin text;
alter table vessels add column if not exists created_by uuid;
alter table vessels add column if not exists created_at timestamptz not null default now();

alter table work_orders add column if not exists organization_id uuid;
alter table work_orders add column if not exists customer_id uuid;
alter table work_orders add column if not exists vessel_id uuid;
alter table work_orders add column if not exists title text;
alter table work_orders add column if not exists status text default 'new';
alter table work_orders add column if not exists priority text default 'medium';
alter table work_orders add column if not exists total_cents integer default 0;
alter table work_orders add column if not exists due_date date;
alter table work_orders add column if not exists created_by uuid;
alter table work_orders add column if not exists created_at timestamptz not null default now();

-- Normalize role names and add constraints safely.
update organization_members set role = 'general_manager' where role = 'manager';
update organization_members set role = 'owner' where role is null;

alter table organization_members drop constraint if exists organization_members_role_check;
alter table organization_members add constraint organization_members_role_check
  check (role in ('owner','admin','general_manager','billing','technician','customer'));

create unique index if not exists organizations_slug_unique on organizations(slug) where slug is not null;
create unique index if not exists organization_members_unique_user_org on organization_members(organization_id, user_id) where organization_id is not null and user_id is not null;
create index if not exists idx_members_user_org on organization_members(user_id, organization_id);
create index if not exists idx_members_org_role on organization_members(organization_id, role);
create index if not exists idx_invoices_organization_id on invoices(organization_id);
create index if not exists idx_invoices_created_by on invoices(created_by);
create index if not exists idx_estimates_organization_id on estimates(organization_id);
create index if not exists idx_estimates_created_by on estimates(created_by);

-- Helper functions. SECURITY DEFINER prevents policy recursion while still using auth.uid().
create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from organization_members m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

create or replace function public.has_org_role(org_id uuid, allowed_roles text[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role = any(allowed_roles)
  );
$$;

create or replace function public.set_invoice_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is null then new.created_by := auth.uid(); end if;
  if new.invoice_number is null then new.invoice_number := 'INV-' || upper(substr(replace(new.id::text, '-', ''), 1, 8)); end if;
  if new.status is null then new.status := 'draft'; end if;
  if new.total_cents is null then new.total_cents := 0; end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_invoice_defaults on invoices;
create trigger trg_set_invoice_defaults before insert or update on invoices
for each row execute function public.set_invoice_defaults();

create or replace function public.set_estimate_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is null then new.created_by := auth.uid(); end if;
  if new.estimate_number is null then new.estimate_number := 'EST-' || upper(substr(replace(new.id::text, '-', ''), 1, 8)); end if;
  if new.status is null then new.status := 'draft'; end if;
  if new.total_cents is null then new.total_cents := 0; end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_estimate_defaults on estimates;
create trigger trg_set_estimate_defaults before insert or update on estimates
for each row execute function public.set_estimate_defaults();

-- Enable RLS.
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table customers enable row level security;
alter table vessels enable row level security;
alter table work_orders enable row level security;
alter table estimates enable row level security;
alter table invoices enable row level security;
alter table inventory_items enable row level security;

-- Clear prototype policies so this release owns the security model.
drop policy if exists "members can read their organizations" on organizations;
drop policy if exists "authenticated users can create organizations" on organizations;
drop policy if exists "members can read organizations" on organizations;

drop policy if exists "members can read organization members" on organization_members;
drop policy if exists "users can read own membership" on organization_members;
drop policy if exists "managers can read organization members" on organization_members;
drop policy if exists "users can create own owner membership" on organization_members;
drop policy if exists "managers can manage organization members" on organization_members;

drop policy if exists "invoice creator or managers can read" on invoices;
drop policy if exists "invoice creators can insert" on invoices;
drop policy if exists "invoice creator or managers can update" on invoices;
drop policy if exists "only managers can delete invoices" on invoices;
drop policy if exists "members can read invoices" on invoices;
drop policy if exists "members can create invoices" on invoices;
drop policy if exists "creators can update their invoices" on invoices;
drop policy if exists "managers can update all invoices" on invoices;
drop policy if exists "managers can delete invoices" on invoices;

drop policy if exists "estimate creator or managers can read" on estimates;
drop policy if exists "estimate creators can insert" on estimates;
drop policy if exists "estimate creator or managers can update" on estimates;
drop policy if exists "only managers can delete estimates" on estimates;

drop policy if exists "members can manage customers" on customers;
drop policy if exists "members can manage vessels" on vessels;
drop policy if exists "members can manage work orders" on work_orders;
drop policy if exists "members can manage inventory" on inventory_items;

-- Organizations: a logged-in user can create a workspace; members can read their workspace.
create policy "authenticated users can create organizations"
on organizations for insert to authenticated with check (true);

create policy "members can read organizations"
on organizations for select to authenticated using (public.is_org_member(id));

-- Memberships: users can create their own owner membership during first-run bootstrap.
create policy "users can create own owner membership"
on organization_members for insert to authenticated
with check (user_id = auth.uid() and role in ('owner','admin','general_manager'));

create policy "users can read own membership"
on organization_members for select to authenticated
using (user_id = auth.uid());

create policy "managers can read organization members"
on organization_members for select to authenticated
using (public.has_org_role(organization_id, array['owner','admin','general_manager']));

create policy "managers can manage organization members"
on organization_members for all to authenticated
using (public.has_org_role(organization_id, array['owner','admin','general_manager']))
with check (public.has_org_role(organization_id, array['owner','admin','general_manager']));

-- Invoices: creator privacy plus manager oversight.
create policy "invoice creator or managers can read"
on invoices for select to authenticated
using (
  public.is_org_member(organization_id)
  and (created_by = auth.uid() or public.has_org_role(organization_id, array['owner','admin','general_manager']))
);

create policy "invoice creators can insert"
on invoices for insert to authenticated
with check (
  public.is_org_member(organization_id)
  and coalesce(created_by, auth.uid()) = auth.uid()
);

create policy "invoice creator or managers can update"
on invoices for update to authenticated
using (
  public.is_org_member(organization_id)
  and (created_by = auth.uid() or public.has_org_role(organization_id, array['owner','admin','general_manager']))
)
with check (
  public.is_org_member(organization_id)
  and (created_by = auth.uid() or public.has_org_role(organization_id, array['owner','admin','general_manager']))
);

create policy "only managers can delete invoices"
on invoices for delete to authenticated
using (public.has_org_role(organization_id, array['owner','admin','general_manager']));

-- Estimates: same privacy model as invoices.
create policy "estimate creator or managers can read"
on estimates for select to authenticated
using (
  public.is_org_member(organization_id)
  and (created_by = auth.uid() or public.has_org_role(organization_id, array['owner','admin','general_manager']))
);

create policy "estimate creators can insert"
on estimates for insert to authenticated
with check (
  public.is_org_member(organization_id)
  and coalesce(created_by, auth.uid()) = auth.uid()
);

create policy "estimate creator or managers can update"
on estimates for update to authenticated
using (
  public.is_org_member(organization_id)
  and (created_by = auth.uid() or public.has_org_role(organization_id, array['owner','admin','general_manager']))
)
with check (
  public.is_org_member(organization_id)
  and (created_by = auth.uid() or public.has_org_role(organization_id, array['owner','admin','general_manager']))
);

create policy "only managers can delete estimates"
on estimates for delete to authenticated
using (public.has_org_role(organization_id, array['owner','admin','general_manager']));

-- Broad member access for core operational tables in this release.
create policy "members can manage customers" on customers for all to authenticated
using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "members can manage vessels" on vessels for all to authenticated
using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "members can manage work orders" on work_orders for all to authenticated
using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

create policy "members can manage inventory" on inventory_items for all to authenticated
using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));

-- End of synchronized schema.
