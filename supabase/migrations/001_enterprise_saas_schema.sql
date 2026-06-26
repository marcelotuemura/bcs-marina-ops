-- BCS Marina Ops Enterprise SaaS schema draft
-- Review before production use. Enable RLS and connect authenticated users to organization memberships.

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','technician','billing','customer')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists vessels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  name text not null,
  make text,
  model text,
  length_ft numeric,
  hin text,
  created_at timestamptz not null default now()
);

create table if not exists work_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  vessel_id uuid references vessels(id) on delete set null,
  title text not null,
  status text not null default 'new',
  priority text not null default 'medium',
  total_cents integer not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  work_order_id uuid references work_orders(id) on delete set null,
  status text not null default 'draft',
  total_cents integer not null default 0,
  stripe_invoice_id text,
  created_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  sku text,
  quantity numeric not null default 0,
  reorder_point numeric not null default 0,
  unit_cost_cents integer not null default 0,
  created_at timestamptz not null default now()
);

alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table locations enable row level security;
alter table customers enable row level security;
alter table vessels enable row level security;
alter table work_orders enable row level security;
alter table invoices enable row level security;
alter table inventory_items enable row level security;

-- Example helper policy pattern. Final production policies should be reviewed carefully.
create policy "members can read their organizations" on organizations for select using (
  exists (select 1 from organization_members m where m.organization_id = organizations.id and m.user_id = auth.uid())
);
