"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const redirectTo = '/dashboard';

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = supabaseClient();
    // If a password is provided, attempt password login; otherwise send a magic link
    try {
      let error: any = null;
      if (password) {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        error = err;
      } else {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          },
        });
        error = err;
        if (!error) {
          setMessage('Magic link sent! Check your email.');
          return;
        }
      }
      if (error) {
        setMessage(error.message);
      } else {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <form
        onSubmit={handleLogin}
        className="card"
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Sign in to BCS</h2>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password (optional, leave blank for magic link)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        {message && (
          <p style={{ marginTop: '1rem', color: '#e11d48' }}>{message}</p>
        )}
      </form>
    </div>
  );
}