import Link from 'next/link'
import SignOutButton from './sign-out-button'
import { nav, workspace } from '@/lib/demo-data'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="brand-lockup">
        <div className="brand-mark">B</div>
        <div>
          <strong>BCS Marina Ops</strong>
          <span>{workspace.plan}</span>
        </div>
      </Link>
      <nav>
        {nav.map(([href, label, icon]) => (
          <Link className="nav-link" href={href} key={href}><span>{icon}</span>{label}</Link>
        ))}
      </nav>
      <div className="sidebar-card">
        <p className="eyebrow">Multi-location</p>
        <strong>{workspace.locations.length} locations online</strong>
        <span>Tenant isolation, roles, billing, and reporting designed for SaaS growth.</span>
      </div>
      <SignOutButton />
    </aside>
  )
}
