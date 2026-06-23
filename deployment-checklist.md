# BCS Marina Ops Deployment Checklist

## 1. Create the project
- Create a new GitHub repository for the rebuilt app.
- Create a new Vercel project linked to that repository.
- Create a new Supabase project.

## 2. Environment variables
Add these in Vercel Project Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY` or Gmail API secrets later

## 3. Supabase setup
- Run the SQL schema.
- Create storage bucket: `project-photos`.
- Enable email/password auth.
- Create user accounts for manager, estimator-hours, invoice user, and technician.
- Insert roles in `profiles`.
- Add RLS policies for all operational tables.

## 4. Auth wiring
Create these files:
- `lib/auth.ts`: server helper for user/profile lookup.
- `middleware.ts`: route protection and redirect logic.
- `app/login/page.tsx`: login screen.
- Protected layouts by role.

## 5. Invoice logic
- Add accepted-items-only estimate conversion.
- Add create-from-scratch invoice flow.
- Add duplicate invoice flow with a fresh invoice number from `next_invoice_number()`.
- Ensure invoice user only sees `created_by = auth.uid()` invoices unless manager.

## 6. Photos
- Upload project photos into `project-photos/<project-id>/...`.
- Store photo metadata in `project_photos`.
- Show before / during / after timeline on project screen.

## 7. Payments
- Create Stripe checkout session route.
- Add deposit button on estimate acceptance.
- Add invoice pay-now button.
- Add Stripe webhook to mark invoice/deposit as paid.

## 8. Email
- Add Gmail API or Resend integration.
- Send estimate email with approval link.
- Send invoice email with payment link.

## 9. Launch QA
- Test manager login.
- Test estimator-hours cannot view pricing.
- Test invoice user only sees own invoices.
- Test invoice auto numbering.
- Test estimate conversion only moves accepted items.
- Test photo uploads.
- Test Stripe sandbox card `4242 4242 4242 4242`.
- Test mobile layout on iPhone and Android sizes.
