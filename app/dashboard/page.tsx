import Link from 'next/link'
import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import StatCard from '@/components/stat-card'
import { kpis, modules, workOrders, workspace } from '@/lib/demo-data'

export default function DashboardPage() {
  return (
    <DashboardShell title="Enterprise Command Center" subtitle="Live operations, revenue, customer experience, and service execution across every marina location.">
      <section className="hero-card enterprise-hero">
        <div>
          <p className="eyebrow">Private workspace · {workspace.location}</p>
          <h2>One elegant control center for marine service, storage, billing, and growth.</h2>
          <p>Built as a scalable SaaS foundation: multi-tenant architecture, role-based access, Stripe billing, customer portal, analytics, and AI-ready workflows.</p>
          <div className="top-actions"><Link className="primary-button" href="/work-orders/new">Create work order</Link><Link className="secondary-button" href="/customers">Invite customer</Link></div>
        </div>
        <div className="live-panel"><span>Live pipeline</span><strong>$48.7k</strong><div className="chart-line" /></div>
      </section>

      <section className="metric-grid">{kpis.map((k) => <StatCard key={k.label} {...k} />)}</section>

      <section className="page-grid two">
        <div className="table-card">
          <div className="section-heading"><h2>Priority work orders</h2><Badge tone="amber">Action required</Badge></div>
          <table className="table"><tbody>{workOrders.map((w) => <tr key={w.id}><td><strong>{w.id}</strong><br/><span>{w.job} · {w.vessel}</span></td><td>{w.customer}</td><td><Badge tone={w.priority === 'High' ? 'red' : 'blue'}>{w.priority}</Badge></td><td>{w.total}</td></tr>)}</tbody></table>
        </div>
        <div className="card">
          <div className="section-heading"><h2>SaaS modules</h2><Badge tone="green">v1.0</Badge></div>
          <div className="feature-list">{modules.map(([name, desc]) => <div className="feature-item" key={name}><div><strong>{name}</strong><span>{desc}</span></div><Badge tone="green">Ready</Badge></div>)}</div>
        </div>
      </section>
    </DashboardShell>
  )
}
