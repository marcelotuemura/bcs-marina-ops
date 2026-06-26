# BCS Marina Ops Enterprise v1.0

Premium, login-first marina operations SaaS built with Next.js, Supabase Auth, and Stripe-ready foundations.

## What this version improves

- `/` is a public login page only.
- `/dashboard` and all operations pages are protected by middleware.
- After Supabase magic-link login, users land on `/dashboard`.
- Apple-inspired Enterprise SaaS UI with a private command center.
- Scalable module structure for work orders, customers, vessels, slips, schedule, estimates, invoices, inventory, fuel, reports, team, and settings.
- Multi-location and multi-tenant SaaS concepts prepared in the data/model layer.
- Logout button included in the private sidebar.

## Vercel environment variables

Set these in Vercel Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_or_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=optional_fallback_anon_key
NEXT_PUBLIC_SITE_URL=https://www.bestcoatingssolution.com
STRIPE_SECRET_KEY=optional_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=optional_stripe_publishable_key
```

After changing environment variables, redeploy in Vercel.

## Supabase Auth URL Configuration

Set Site URL:

```text
https://www.bestcoatingssolution.com
```

Add Redirect URLs:

```text
https://www.bestcoatingssolution.com/**
https://bestcoatingssolution.com/**
https://www.bestcoatingssolution.com/auth/callback
https://bestcoatingssolution.com/auth/callback
```

## SaaS roadmap included in this architecture

Recommended next engineering phases:

1. Real Supabase database schema for tenants, users, roles, customers, vessels, work orders, invoices, payments, inventory, and locations.
2. Row Level Security policies so each marina sees only its own data.
3. Stripe subscriptions for SaaS billing and customer invoice payments.
4. Customer portal for approvals, payments, scheduling, and repair tracking.
5. Technician mobile workflow with photos, notes, signatures, and time tracking.
6. AI assistant for damage descriptions, estimate drafting, invoice notes, and customer emails.
