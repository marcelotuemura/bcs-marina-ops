# Deployment and Test Checklist

## 1. Environment variables
Set these in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL=https://www.bestcoatingssolution.com`
- optional: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- optional: `RESEND_API_KEY`

## 2. Supabase database
Run this migration in Supabase SQL Editor:

`supabase/migrations/000_mobile_lite_v34_schema.sql`

Then create one organization and add your user as owner:

```sql
insert into public.organizations (name) values ('Best Coatings Solution') returning id;

insert into public.organization_members (organization_id, user_id, role)
values ('PASTE_ORGANIZATION_ID', 'PASTE_AUTH_USER_ID', 'owner');
```

Find your user ID in Supabase Authentication > Users.

## 3. Test flow

1. Open `/` and confirm only login appears.
2. Try `/dashboard` while logged out and confirm it redirects to login.
3. Log in.
4. Create a customer.
5. Create a vessel.
6. Create an estimate with a valid numeric total.
7. Open the estimate and convert it to an invoice.
8. Open another estimate and create a work order from it.
9. Create a work order from scratch.
10. Create an invoice from scratch.
11. Confirm invalid totals such as `abc` show a validation error.
12. Confirm invoices are visible to creator and to owner/general_manager roles.
