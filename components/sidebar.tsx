import Link from 'next/link'
import SignOutButton from './sign-out-button'

const links = [
  ['/dashboard', 'Dashboard'],
  ['/work-orders', 'Work Orders'],
  ['/customers', 'Customers'],
  ['/vessels', 'Vessels'],
  ['/slips', 'Slips & Storage'],
  ['/schedule', 'Schedule'],
  ['/estimates', 'Estimates'],
  ['/invoices', 'Invoices'],
  ['/inventory', 'Inventory'],
  ['/fuel', 'Fuel Sales'],
  ['/reports', 'Reports'],
  ['/team', 'Team'],
  ['/settings', 'Settings']
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/" className="brand-lockup">
        <div className="brand-mark">⚓</div>
        <div>
          <strong>BCS Marina Ops</strong>
          <span>Enterprise SaaS</span>
        </div>
      </Link>
      <nav>
        {links.map(([href, label]) => (
          <Link className="nav-link" href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <div className="sidebar-card">
        <p className="eyebrow">Multi-location ready</p>
        <strong>3 marinas online</strong>
        <span>Role-based access, billing, and reporting built for scale.</span>
      </div>
    <SignOutButton />
    </aside>
  )
}
