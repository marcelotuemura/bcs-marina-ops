import DashboardShell from '@/components/dashboard-shell'

export default function HomePage() {
  return (
    <DashboardShell>
      <section className="hero">
        <p>BEST COATINGS SOLUTIONS</p>
        <h1>Marina workflow, estimating, invoicing, and repair performance</h1>
        <p>Working starter app with live pages, auth, and Stripe-ready structure.</p>
      </section>

      <section className="card-grid">
        <div className="card"><h3>Active Projects</h3><p>18</p></div>
        <div className="card"><h3>Hours Variance</h3><p>+12.4%</p></div>
        <div className="card"><h3>Supplies Variance</h3><p>+7.1%</p></div>
        <div className="card"><h3>Deposit Collection</h3><p>82%</p></div>
      </section>
    </DashboardShell>
  )
}
