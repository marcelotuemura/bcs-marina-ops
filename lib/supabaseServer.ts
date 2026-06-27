import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Returns a Supabase client configured for server components.
 * Cookies are passed through so that authentication works in middleware and
 * server actions.
 */
export function supabaseServer() {
  return createServerClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    cookies,
  });
}