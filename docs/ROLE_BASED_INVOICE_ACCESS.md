# Role-Based Invoice Access

BCS Marina Ops Enterprise v1.2 adds multi-layer invoice visibility.

## Roles

- `owner`: full company access
- `admin`: full company access
- `general_manager`: full company access
- `billing`: creates and sees only their own invoices
- `manager`: normal manager label, but not global invoice visibility unless promoted to `general_manager`
- `technician`: creates and sees only their own invoices if invoice creation is enabled
- `customer`: portal-only role for future use

## Invoice visibility rule

Every invoice has:

- `organization_id`
- `created_by`

A regular user can only read invoices where:

```sql
created_by = auth.uid()
```

A General Manager, Admin, or Owner can read every invoice in the same organization.

## Required Supabase step

Apply this migration in Supabase SQL Editor:

```text
supabase/migrations/002_role_based_invoice_access.sql
```

After applying it, RLS protects invoices at the database level, not only in the UI.

## Important

Do not rely only on page filtering. The Supabase RLS policy is the security boundary.
