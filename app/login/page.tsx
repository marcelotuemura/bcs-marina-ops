'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signInWithOtp({ email,
                                                         options: { 
                                                           emailRedirectTo: 'https://www.bestcoatingssolution.com/auth/confirm', 
                                                             },
                                                           })
    setMessage(error ? error.message : 'Check your email for the login link.')
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <form className="form" onSubmit={handleLogin}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" type="submit">Send magic link</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  )
}
