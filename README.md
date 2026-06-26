# BCS Marina Ops Enterprise v2.0

Commercial SaaS starter for marina/service operations with secure login, protected private pages, invoices, estimates, and role-based access.

## What is fixed in this synchronized release

- Login-first public screen.
- Protected dashboard and business pages.
- New Invoice form saves to Supabase.
- New Estimate form saves to Supabase.
- Creator-only visibility for regular users.
- Owner/Admin/General Manager visibility for all company invoices and estimates.
- First-run workspace bootstrap for authenticated users with no organization yet.
- One synchronized Supabase SQL file that matches the app code.

## Important Supabase step

Run only this SQL file:

`supabase/migrations/000_enterprise_v2_synchronized_schema.sql`

Do not run the archived draft migrations.

## Deployment

See:

`docs/DEPLOYMENT_AND_FULL_TEST.md`

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://www.bestcoatingssolution.com
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a fallback if your project uses anon key naming.
