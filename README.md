# BCS Marina Ops - Secure SaaS Build

Premium marina-management SaaS starter built with Next.js, Supabase Auth, and Stripe foundations.

## Important behavior

- `/` is now the public login-only page.
- `/dashboard` and all operating pages are private.
- Unauthenticated users are redirected back to `/`.
- After Supabase magic-link login, users land on `/dashboard`.
- The sidebar includes a logout button.

## Vercel environment variables

Set these in Vercel Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_or_anon_key
NEXT_PUBLIC_SITE_URL=https://www.bestcoatingssolution.com
STRIPE_SECRET_KEY=your_stripe_secret_key_optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_optional
```

If your Supabase project gives you an anon key instead, you may also set:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

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

## Deployment steps

1. Upload this project to GitHub.
2. Let Vercel redeploy.
3. Verify Vercel environment variables.
4. Verify Supabase redirect URLs.
5. Visit `https://www.bestcoatingssolution.com`.
6. The first screen should be login only.
7. Sign in with magic link.
8. Confirm the app redirects to `/dashboard`.
