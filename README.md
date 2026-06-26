# BCS Marina Ops Enterprise v1.1

Premium SaaS-style marina operations app built with Next.js, Supabase Auth, Vercel, and Stripe-ready billing.

## What is fixed in this package

- Public home page shows only the secure login screen.
- Dashboard and all business pages are protected by Supabase session middleware.
- Password login and magic-link login are supported.
- New Work Order button opens `/work-orders/new`.
- New Work Order form now has working client-side actions for draft and create.
- Settings form now has working client-side save feedback.
- Local route smoke test confirms private pages redirect to login before authentication.
- TypeScript check passes.

## Required Vercel environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://www.bestcoatingssolution.com
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Use either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`; this code supports both, but the publishable key is checked first.

## Supabase Auth URLs

Site URL:

```text
https://www.bestcoatingssolution.com
```

Redirect URLs:

```text
https://www.bestcoatingssolution.com
https://www.bestcoatingssolution.com/**
https://bestcoatingssolution.com
https://bestcoatingssolution.com/**
```

## Upload workflow

1. Unzip this package.
2. Upload all contents to GitHub repository `bcs-marina-ops`.
3. Commit changes.
4. Wait for Vercel deployment to finish.
5. Open `https://www.bestcoatingssolution.com`.
6. Login with password or magic link.
7. Test `+ New Work Order`.

## Local developer test

```bash
npm install
npm run build
```



## Enterprise v1.2 - Role-Based Invoice Access

This package adds multi-layer invoice access:

- Regular users see only invoices they created.
- General Managers, Admins, and Owners see all invoices for the company.
- Invoice records are scoped by `organization_id`.
- Invoice records include `created_by` for creator-level privacy.
- Supabase RLS policies are included in `supabase/migrations/002_role_based_invoice_access.sql`.

After uploading this version to GitHub and deploying in Vercel, open Supabase SQL Editor and run the v1.2 migration file.

