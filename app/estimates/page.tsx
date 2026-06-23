import DashboardShell from '@/components/dashboard-shell'

export default function EstimatesPage() {
  return (
    <DashboardShell>
      <h1>Estimates</h1>
      <table className="table">
        <thead>
          <tr><th>Project</th><th>Status</th><th>Total</th></tr>
        </thead>
        <tbody>
          <tr><td>Sea Ray 320</td><td>Draft</td><td>$2,450</td></tr>
          <tr><td>Azimut 45</td><td>Sent</td><td>$6,800</td></tr>
        </tbody>
      </table>
    </DashboardShell>
  )
}
