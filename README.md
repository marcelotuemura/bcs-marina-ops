# BCS Marina Ops

Premium Apple-inspired SaaS starter for marina operations.

## What is included

- Modern login-first experience using Supabase Auth
- Magic link callback route: `/auth/callback`
- Optional email/password login support if enabled in Supabase
- Middleware for Supabase SSR session refresh
- Premium SaaS dashboard UI
- Pages for work orders, customers, vessels, slips, schedule, estimates, invoices, inventory, fuel, reports, team, and settings
- Stripe checkout starter route
- Multi-location and role-based access UX foundation

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Add Supabase values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Add Stripe values if you want payment checkout:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Run:

```bash
npm install
npm run dev
```

## Supabase settings required

In Supabase, go to Authentication -> URL Configuration.

For local development add:

```text
Site URL: http://localhost:3000
Redirect URL: http://localhost:3000/auth/callback
```

For production add your deployed domain and `/auth/callback` URL.

## Recommended next engineering phase

- Add real database tables for tenants, locations, users, customers, vessels, slips, work orders, invoices, payments, inventory, and fuel sales
- Add Row Level Security policies by tenant/company
- Add Stripe subscriptions for SaaS plans
- Add customer portal and technician mobile workflow
- Add file/photo uploads through Supabase Storage
- Add audit logs and analytics events
