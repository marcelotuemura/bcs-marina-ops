'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    setMessage(error ? error.message : 'Check your email for the secure sign-in link.')
    setLoading(false)
  }

  async function signInWithPassword() {
    setLoading(true)
    setMessage('')
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) window.location.href = '/'
    setMessage(error ? error.message : 'Signed in successfully.')
    setLoading(false)
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand-lockup">
          <div className="brand-mark">⚓</div>
          <div><strong>BCS Marina Ops</strong><span>Premium marina operating system</span></div>
        </div>

        <div>
          <p className="eyebrow">Secure access</p>
          <h1>Welcome back to the marina command center.</h1>
          <p>Sign in to manage work orders, vessels, slips, invoices, payments, inventory, fuel, reports, and team permissions.</p>
        </div>

        <form className="login-form-card form" onSubmit={signInWithMagicLink}>
          <div>
            <h2 style={{ margin: 0 }}>Sign in</h2>
            <p style={{ color: 'var(--muted)', marginTop: 6 }}>Use magic link or password if enabled in Supabase.</p>
          </div>
          <input className="input" type="email" placeholder="you@marina.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password optional" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send secure magic link'}</button>
          <button className="secondary-button" type="button" onClick={signInWithPassword} disabled={loading || !password}>Sign in with password</button>
          {message && <p style={{ color: 'var(--muted)' }}>{message}</p>}
        </form>
      </section>

      <section className="login-visual">
        <div className="login-visual-grid">
          <div className="floating-card large"><p className="eyebrow">Today</p><h2>$128,680 revenue</h2><p>92% slip occupancy with 23 open service jobs.</p></div>
          <div className="floating-card"><strong>Work Orders</strong><p>Engine service, hull cleaning, detailing, gelcoat repairs.</p></div>
          <div className="floating-card"><strong>Customer Portal</strong><p>Online booking, approvals, deposits, invoices, and vessel history.</p></div>
        </div>
      </section>
    </main>
  )
}
