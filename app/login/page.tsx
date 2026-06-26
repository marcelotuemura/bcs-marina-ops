'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createBrowserSupabaseClient()
    const result = await supabase.auth.signInWithOtp({ email })

    console.log('SIGN IN RESULT', result)

    if (result.error) {
      setMessage(result.error.message)
    } else {
      setMessage('Check your email for the magic link.')
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Login TEST 123</h1>
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
      <p>{message}</p>
    </main>
  )
}
