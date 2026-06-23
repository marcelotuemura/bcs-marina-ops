create extension if not exists pgcrypto;

create type app_role as enum ('manager','estimator_hours','invoice_user','technician');
create type rate_type as enum ('internal','labor','travel','detail');
create type project_status as enum ('estimate','approved','work_order','in_progress','completed','invoiced');
create type line_status as enum ('draft','accepted','partial','refused');
create type payment_status as enum ('unpaid','partial','paid','void');
create type photo_stage as enum ('before','during','after');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role app_role not null default 'technician',
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  project_number text unique,
  work_order_number text,
  customer_id uuid references customers(id),
  vessel_name text,
  hull_number text,
  date_of_entrance date,
  motor_type text check (motor_type in ('Yamaha','Mercury')),
  estimated_completion_date date,
  actual_completion_date date,
  status project_status not null default 'estimate',
  assigned_technician_id uuid references profiles(id),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists estimates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  estimate_number text unique,
  labor_description text,
  supplies_summary text,
  marina_fee numeric(12,2) not null default 0,
  transit_fee numeric(12,2) not null default 0,
  deposit_required_pct numeric(5,2) not null default 50,
  approval_message text not null default 'In order to accept the job, 50% deposit is required by Zelle through the phone 305-747-8352.',
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists estimate_lines (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references estimates(id) on delete cascade,
  line_no int not null,
  description text not null,
  rate_type rate_type,
  estimated_hours numeric(10,2) not null default 0,
  estimated_rate numeric(12,2) not null default 0,
  estimated_supplies_cost numeric(12,2) not null default 0,
  price_hidden_from_estimator boolean not null default true,
  status line_status not null default 'draft'
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  project_id uuid references projects(id),
  source_estimate_id uuid references estimates(id),
  source_invoice_id uuid references invoices(id),
  created_by uuid not null references profiles(id),
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_status payment_status not null default 'unpaid',
  paid_amount numeric(12,2) not null default 0,
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create table if not exists invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  rate_type rate_type,
  hours numeric(10,2) not null default 0,
  rate numeric(12,2) not null default 0,
  amount numeric(12,2) generated always as (hours * rate) stored
);

create table if not exists time_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  technician_id uuid not null references profiles(id),
  estimate_line_id uuid references estimate_lines(id),
  rate_type rate_type not null,
  hours numeric(10,2) not null,
  work_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists supplies_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text,
  unit_cost numeric(12,2) not null default 0,
  active boolean not null default true
);

create table if not exists supply_usage (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  technician_id uuid references profiles(id),
  supply_id uuid references supplies_catalog(id),
  estimate_line_id uuid references estimate_lines(id),
  estimated_qty numeric(12,2) not null default 0,
  used_qty numeric(12,2) not null default 0,
  estimated_cost numeric(12,2) not null default 0,
  actual_cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  stage photo_stage not null default 'during',
  task_label text,
  note text,
  file_path text not null,
  taken_at timestamptz not null default now()
);

create sequence if not exists invoice_number_seq start 1001;

create or replace function next_invoice_number()
returns text
language sql
as $$
  select 'INV-' || to_char(current_date, 'YYYY') || '-' || lpad(nextval('invoice_number_seq')::text, 5, '0');
$$;

create or replace function public.current_app_role()
returns app_role
language sql
stable
as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function public.is_manager()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'manager'
  )
$$;

alter table profiles enable row level security;
alter table customers enable row level security;
alter table projects enable row level security;
alter table estimates enable row level security;
alter table estimate_lines enable row level security;
alter table invoices enable row level security;
alter table invoice_lines enable row level security;
alter table time_logs enable row level security;
alter table supplies_catalog enable row level security;
alter table supply_usage enable row level security;
alter table project_photos enable row level security;

create policy "profiles own or manager" on profiles
for select using (id = auth.uid() or public.is_manager());

create policy "manager manage profiles" on profiles
for all using (public.is_manager()) with check (public.is_manager());

create policy "staff view customers" on customers
for select using (auth.role() = 'authenticated');

create policy "manager manage customers" on customers
for all using (public.is_manager()) with check (public.is_manager());

create policy "staff view projects" on projects
for select using (auth.role() = 'authenticated');

create policy "manager create projects" on projects
for insert with check (public.is_manager());

create policy "manager update projects" on projects
for update using (public.is_manager());

create policy "staff view estimates" on estimates
for select using (auth.role() = 'authenticated');

create policy "manager and estimator create estimates" on estimates
for insert with check (public.current_app_role() in ('manager','estimator_hours'));

create policy "manager and estimator update estimates" on estimates
for update using (public.current_app_role() in ('manager','estimator_hours'));

create policy "staff view estimate lines" on estimate_lines
for select using (auth.role() = 'authenticated');

create policy "manager and estimator insert estimate lines" on estimate_lines
for insert with check (public.current_app_role() in ('manager','estimator_hours'));

create policy "manager and estimator update estimate lines" on estimate_lines
for update using (public.current_app_role() in ('manager','estimator_hours'));

create policy "invoice owner or manager" on invoices
for select using (created_by = auth.uid() or public.is_manager());

create policy "manager and invoice user create invoices" on invoices
for insert with check (public.current_app_role() in ('manager','invoice_user'));

create policy "invoice owner or manager update invoices" on invoices
for update using (created_by = auth.uid() or public.is_manager());

create policy "invoice lines via visible invoice" on invoice_lines
for select using (
  exists (
    select 1 from invoices i where i.id = invoice_id and (i.created_by = auth.uid() or public.is_manager())
  )
);

create policy "invoice user insert invoice lines" on invoice_lines
for insert with check (public.current_app_role() in ('manager','invoice_user'));

create policy "staff view supplies catalog" on supplies_catalog
for select using (auth.role() = 'authenticated');

create policy "manager manage supplies catalog" on supplies_catalog
for all using (public.is_manager()) with check (public.is_manager());

create policy "technician own or manager time logs" on time_logs
for select using (technician_id = auth.uid() or public.is_manager());

create policy "technician and manager insert time logs" on time_logs
for insert with check (public.current_app_role() in ('manager','technician'));

create policy "technician own or manager supply usage" on supply_usage
for select using (technician_id = auth.uid() or public.is_manager());

create policy "technician and manager insert supply usage" on supply_usage
for insert with check (public.current_app_role() in ('manager','technician'));

create policy "staff view project photos" on project_photos
for select using (auth.role() = 'authenticated');

create policy "technician and manager insert project photos" on project_photos
for insert with check (public.current_app_role() in ('manager','technician'));
