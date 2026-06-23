import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>BCS Marina Ops</h2>
      <nav>
        <Link className="nav-link" href="/">Dashboard</Link>
        <Link className="nav-link" href="/estimates">Estimates</Link>
        <Link className="nav-link" href="/invoices">Invoices</Link>
        <Link className="nav-link" href="/projects">Projects</Link>
        <Link className="nav-link" href="/login">Login</Link>
      </nav>
    </aside>
  )
}
