'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function SignOutButton() {
  async function signOut() {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return <button className="secondary-button dark" onClick={signOut}>Log out</button>
}
