-- BCS Marina Ops Enterprise v1.2
-- Role-based invoice access for multi-user SaaS workspaces.
-- Rule:
-- 1. Each invoice is tied to one organization/workspace.
-- 2. Each invoice stores created_by = auth.uid().
-- 3. Regular users can see only invoices they created.
-- 4. General managers, admins, and owners can see all invoices in their organization.
-- 5. Users can never see invoices from another organization.

alter table organization_members
  drop constraint if exists organization_members_role_check;

alter table organization_members
  add constraint organization_members_role_check
  check (role in ('owner','admin','general_manager','manager','billing','technician','customer'));

alter table invoices
  add column if not exists invoice_number text,
  add column if not exists customer_name text,
  add column if not exists customer_email text,
  add column if not exists due_date date,
  add column if not exists notes text,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_invoices_organization_id on invoices(organization_id);
create index if not exists idx_invoices_created_by on invoices(created_by);
create index if not exists idx_members_user_org on organization_members(user_id, organization_id);
create index if not exists idx_members_org_role on organization_members(organization_id, role);

create or replace function public.set_invoice_creator()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;

  if new.invoice_number is null then
    new.invoice_number := 'INV-' || upper(substr(replace(new.id::text, '-', ''), 1, 8));
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_invoice_creator on invoices;
create trigger trg_set_invoice_creator
before insert or update on invoices
for each row execute function public.set_invoice_creator();

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
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
    select 1
    from organization_members m
    where m.organization_id = org_id
      and m.user_id = auth.uid()
      and m.role = any(allowed_roles)
  );
$$;

alter table invoices enable row level security;

-- Replace old broad policies if they exist from earlier prototypes.
drop policy if exists "members can read invoices" on invoices;
drop policy if exists "members can create invoices" on invoices;
drop policy if exists "creators can update their invoices" on invoices;
drop policy if exists "managers can update all invoices" on invoices;
drop policy if exists "managers can delete invoices" on invoices;
drop policy if exists "invoice creator or managers can read" on invoices;
drop policy if exists "invoice creators can insert" on invoices;
drop policy if exists "invoice creator or managers can update" on invoices;
drop policy if exists "only managers can delete invoices" on invoices;

create policy "invoice creator or managers can read"
on invoices
for select
to authenticated
using (
  public.is_org_member(organization_id)
  and (
    created_by = auth.uid()
    or public.has_org_role(organization_id, array['owner','admin','general_manager'])
  )
);

create policy "invoice creators can insert"
on invoices
for insert
to authenticated
with check (
  public.is_org_member(organization_id)
  and coalesce(created_by, auth.uid()) = auth.uid()
);

create policy "invoice creator or managers can update"
on invoices
for update
to authenticated
using (
  public.is_org_member(organization_id)
  and (
    created_by = auth.uid()
    or public.has_org_role(organization_id, array['owner','admin','general_manager'])
  )
)
with check (
  public.is_org_member(organization_id)
  and (
    created_by = auth.uid()
    or public.has_org_role(organization_id, array['owner','admin','general_manager'])
  )
);

create policy "only managers can delete invoices"
on invoices
for delete
to authenticated
using (
  public.has_org_role(organization_id, array['owner','admin','general_manager'])
);

-- Membership visibility: managers can see the team; users can see their own membership.
alter table organization_members enable row level security;

drop policy if exists "members can read organization members" on organization_members;
drop policy if exists "users can read own membership" on organization_members;
drop policy if exists "managers can read organization members" on organization_members;

create policy "users can read own membership"
on organization_members
for select
to authenticated
using (user_id = auth.uid());

create policy "managers can read organization members"
on organization_members
for select
to authenticated
using (public.has_org_role(organization_id, array['owner','admin','general_manager']));
