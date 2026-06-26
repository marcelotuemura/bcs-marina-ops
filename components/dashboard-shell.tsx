import Link from 'next/link'
import Sidebar from './sidebar'
import { workspace } from '@/lib/demo-data'

export default function DashboardShell({
  children,
  eyebrow = 'Enterprise Command Center',
  title = 'BCS Marina Ops',
  subtitle = 'A premium operating system for modern marine service businesses.'
}: {
  children: React.ReactNode
  eyebrow?: string
  title?: string
  subtitle?: string
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="top-actions">
            <span className="status-pill">{workspace.plan}</span>
            <Link className="secondary-button" href="/invoices/new">+ New Invoice</Link>
            <Link className="primary-button" href="/work-orders/new">+ New Work Order</Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
