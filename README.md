# BCS Marina Ops Mobile Lite v3.4 Hardened

A simplified, mobile-friendly operations app for small marine/mobile service companies.

## What this version focuses on

- Login-first public homepage: `/` and `/login` show login only.
- Protected business pages: dashboard, customers, vessels, estimates, work orders, invoices, settings.
- Modern Supabase integration using `@supabase/ssr`.
- Next.js 16.2.9 with `proxy.ts` instead of deprecated `middleware.ts`.
- Role/company ownership support through `organization_members` and `company_id`.
- Estimate to invoice conversion.
- Estimate to work order creation.
- Work order creation from scratch.
- Invoice creation from scratch.
- Numeric validation for estimate/invoice totals.
- Database migration included.
- Tested with `npm run typecheck`, `npm run build`, and `npm audit --audit-level=low`.

## Required environment variables

Set these in Vercel and locally in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=https://www.bestcoatingssolution.com
```

Optional integrations:

```env
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
```

## Supabase setup

Run this SQL migration in Supabase SQL Editor:

```text
supabase/migrations/000_mobile_lite_v34_schema.sql
```

Then create one organization and add your user as `owner`. See:

```text
docs/DEPLOYMENT_AND_TEST.md
```

## Local test commands

```bash
npm install
npm run typecheck
npm run build
npm audit --audit-level=low
```

## Notes

This is intentionally smaller than the Enterprise build. It keeps the core operational flow simple and stable before adding advanced SaaS features.
