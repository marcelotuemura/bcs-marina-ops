import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

/**
 * Returns a Supabase client configured for server components.
 * Cookies are passed through so that authentication works in middleware and
 * server actions.
 */
export function supabaseServer() {
  return createServerComponentClient<Database>({ cookies });
}