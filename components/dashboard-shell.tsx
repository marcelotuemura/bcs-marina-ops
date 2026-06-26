import Sidebar from './sidebar'

export default function DashboardShell({
  children,
  eyebrow = 'Command Center',
  title = 'BCS Marina Ops',
  subtitle = 'A premium operating system for modern marinas.'
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
            <span className="status-pill">Live SaaS Prototype</span>
            <button className="primary-button">New Work Order</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
