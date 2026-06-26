import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import LoginForm from '@/components/login-form'
import { modules, workspace } from '@/lib/demo-data'

export default async function PublicLoginPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="login-page public-only">
      <section className="login-panel">
        <div className="brand-lockup public-brand">
          <div className="brand-mark">B</div>
          <div>
            <strong>BCS Marina Ops</strong>
            <span>Private Enterprise SaaS</span>
          </div>
        </div>

        <div className="login-copy">
          <p className="eyebrow">Secure marina operating system</p>
          <h1>Run your marina with Apple-level simplicity.</h1>
          <p>Customers, vessels, work orders, billing, inventory, reports, and team activity stay private until an authorized user signs in.</p>
        </div>

        <LoginForm />
        <p className="login-footer">© 2026 {workspace.product}. Secure access only.</p>
      </section>

      <section className="login-visual private-preview" aria-hidden="true">
        <div className="security-glass hero-glass">
          <p className="eyebrow">Before login</p>
          <h2>Only this login screen is public.</h2>
          <p>Business data is protected behind Supabase authentication, route middleware, and private application pages.</p>
        </div>
        <div className="module-preview-grid">
          {modules.slice(0, 4).map(([name, desc]) => <div className="mini-module" key={name}><strong>{name}</strong><span>{desc}</span></div>)}
        </div>
      </section>
    </main>
  )
}
