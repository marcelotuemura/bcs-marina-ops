import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import LoginForm from '@/components/login-form'

export default async function PublicLoginPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="login-page public-only">
      <section className="login-panel">
        <div className="brand-lockup">
          <div className="brand-mark">⚓</div>
          <div>
            <strong>BCS Marina Ops</strong>
            <span>Premium Marina Management</span>
          </div>
        </div>

        <div className="login-copy">
          <p className="eyebrow">Private SaaS access</p>
          <h1>Run your marina. Smarter.</h1>
          <p>Work orders, customers, vessels, billing, inventory, and reports stay private until an authorized user signs in.</p>
        </div>

        <LoginForm />

        <p className="login-footer">© 2026 BCS Marina Ops. Secure access only.</p>
      </section>

      <section className="login-visual private-preview" aria-hidden="true">
        <div className="security-glass">
          <p className="eyebrow">Before login</p>
          <h2>Only this login screen is public.</h2>
          <p>Operational data is protected behind Supabase authentication and route middleware.</p>
        </div>
      </section>
    </main>
  )
}
