import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import { cookies } from 'next/headers';

export default async function AuthCallback() {
  const reqCookies = cookies();
  // Supabase will parse the code and exchange it for a session
  const supabase = supabaseServer();
  const {
    error,
  } = await supabase.auth.getSession();
  // If there's an error we still attempt to exchange the code
  // by calling signIn with the URL params (handled internally by supabase/ssr).
  if (error) {
    // ignore
  }
  // After session is set we redirect to dashboard
  redirect('/dashboard');
}