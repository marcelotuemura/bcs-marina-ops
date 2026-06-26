'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function LoginForm() {
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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
      }
    })

    setMessage(error ? error.message : 'Check your email for the secure sign-in link.')
    setLoading(false)
  }

  async function signInWithPassword() {
    setLoading(true)
    setMessage('')

    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <form className="login-form-card form" onSubmit={signInWithMagicLink}>
      <div>
        <h2>Welcome back</h2>
        <p>Sign in to your secure operations workspace.</p>
      </div>

      <input
        className="input"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="input"
        type="password"
        placeholder="Password optional"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send magic link'}
      </button>

      <button className="secondary-button" type="button" onClick={signInWithPassword} disabled={loading || !password}>
        Sign in with password
      </button>

      {message && <p className="form-message">{message}</p>}
      <p className="form-hint">The dashboard and all business information are visible only after login.</p>
    </form>
  )
}
