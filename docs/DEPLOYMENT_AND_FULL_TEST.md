# BCS Marina Ops Enterprise v2.0 - Deployment and Full Test

## 1. Upload app
1. Unzip this package.
2. Upload the contents to GitHub.
3. Commit changes.
4. Wait for Vercel deployment to become Ready.

## 2. Vercel environment variables
Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL=https://www.bestcoatingssolution.com`

Optional Stripe variables can stay configured if you already use them.

## 3. Supabase SQL
In Supabase:

1. Go to SQL Editor.
2. New Query.
3. Open `supabase/migrations/000_enterprise_v2_synchronized_schema.sql`.
4. Copy all SQL.
5. Paste into Supabase SQL Editor.
6. Click Run.

Do not run the archived draft migrations.

## 4. Full functional test

### Login security
- Open `https://www.bestcoatingssolution.com`.
- Confirm only login screen is public.
- Try opening `/dashboard` in a private/incognito browser without login; it should redirect to login.
- Login with password or magic link.
- Confirm dashboard loads.

### First-run workspace bootstrap
- After login, open `/invoices/new` or `/estimates/new`.
- If the user has no organization membership yet, the app creates a workspace and sets the user as `owner`.

### Invoice test
- Go to Invoices.
- Click New Invoice.
- Fill customer name and total.
- Save.
- Expected: success message.
- Go back to Invoices.
- Expected: invoice appears.

### Estimate test
- Go to Estimates.
- Click New Estimate.
- Fill customer name, scope, and total.
- Save.
- Expected: success message.
- Go back to Estimates.
- Expected: estimate appears.

### Role-based access test
Use Supabase Table Editor:
- `organization_members.role = owner`, `admin`, or `general_manager`: user can see all invoices/estimates in the organization.
- `organization_members.role = billing`, `technician`, or `customer`: user can see only records where `created_by = auth.uid()`.

### Expected security rule
- Records never cross organization boundaries.
- Regular users only see their own invoices/estimates.
- Owners/Admins/General Managers see all company invoices/estimates.

## 5. Troubleshooting

If saving fails, copy the exact error message. Common causes:

- `relation does not exist`: synchronized SQL was not run.
- `column does not exist`: synchronized SQL was not run or failed partway.
- `violates row-level security policy`: user does not have an organization membership.
- `invalid API key`: Vercel Supabase environment variables are wrong.

