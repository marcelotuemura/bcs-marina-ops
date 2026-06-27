import { createClientComponentClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Returns a Supabase client for use in client components.  
 * The `@supabase/ssr` helper automatically picks up your public URL and anon key
 * from environment variables.
 */
export function supabaseClient() {
  return createClientComponentClient<Database>({});
}