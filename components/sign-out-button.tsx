"use client";

import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSignOut() {
    setLoading(true);
    const supabase = supabaseClient();
    await supabase.auth.signOut();
    setLoading(false);
    router.push('/login');
  }
  return (
    <button
      onClick={handleSignOut}
      className="btn"
      style={{ width: '100%' }}
      disabled={loading}
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}