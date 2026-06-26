import DashboardShell from '@/components/dashboard-shell'

const metrics = [
  ['Revenue', '$128,680', '+12.5%'],
  ['Slip Occupancy', '92%', '+4.3%'],
  ['Open Work Orders', '23', '-8.2%'],
  ['Open Invoices', '18', '+3']
]

const activities = [
  ['Work order #1054 completed', 'Engine service - Sea Ray 310', '2m ago'],
  ['New booking confirmed', 'Slip B-12 - May 26', '15m ago'],
  ['Invoice INV-10023 paid', 'John Smith', '1h ago'],
  ['Low stock alert', 'Epoxy resin, 4 units left', '3h ago']
]

export default function HomePage() {
  return (
    <DashboardShell title="Marina Command Center" subtitle="Real-time visibility across revenue, slips, jobs, inventory, billing, and customer experience.">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Premium SaaS cockpit</p>
          <h2 style={{ fontSize: 44, letterSpacing: '-.05em', margin: '0 0 10px' }}>Run the marina from one elegant workspace.</h2>
          <p>Designed for owners, managers, service teams, office staff, and customers. Built to scale from one dock to multi-location operations.</p>
          <div className="top-actions" style={{ marginTop: 22 }}>
            <button className="primary-button">Create Job</button>
            <button className="secondary-button">View Reports</button>
          </div>
        </div>
        <div className="chart-line" aria-label="Revenue trend" />
      </section>

      <section className="metric-grid">
        {metrics.map(([label, value, delta]) => (
          <div className="metric-card" key={label}>
            <p>{label}</p>
            <div className="metric-value"><span>{value}</span><span className="delta">{delta}</span></div>
          </div>
        ))}
      </section>

      <section className="page-grid two" style={{ marginTop: 16 }}>
        <div className="table-card">
          <h2>Recent Activity</h2>
          <table className="table"><tbody>{activities.map(([title, desc, time]) => <tr key={title}><td><strong>{title}</strong><br/><span style={{ color: 'var(--muted)' }}>{desc}</span></td><td>{time}</td></tr>)}</tbody></table>
        </div>
        <div className="card">
          <h2>SaaS readiness</h2>
          <div className="feature-list">
            {['Multi-tenant architecture ready', 'Role-based access controls', 'Stripe billing foundation', 'Supabase auth callback added', 'Customer portal roadmap', 'Analytics-ready data model'].map((item) => <div className="feature-item" key={item}><span>{item}</span><span className="badge green">Ready</span></div>)}
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
