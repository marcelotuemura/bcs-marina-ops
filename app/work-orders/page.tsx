import DashboardShell from '@/components/dashboard-shell'

const rows = [
  ['#1054', 'Engine Service', 'Sea Ray 310', 'Tom Anderson', 'In Progress', '$850'],
  ['#1055', 'Hull Cleaning', 'Boston Whaler 23', 'Maria Costa', 'Pending', '$420'],
  ['#1056', 'Gelcoat Repair', 'Azimut 42', 'Diego Brown', 'Scheduled', '$2,300']
]

export default function WorkOrdersPage() {
  return <DashboardShell eyebrow="Operations" title="Work Orders" subtitle="Assign technicians, track labor, parts, photos, notes, approvals, and profitability."><div className="table-card"><table className="table"><thead><tr><th>ID</th><th>Job</th><th>Vessel</th><th>Assigned</th><th>Status</th><th>Total</th></tr></thead><tbody>{rows.map(r => <tr key={r[0]}>{r.map((c,i) => <td key={c}>{i === 4 ? <span className="badge amber">{c}</span> : c}</td>)}</tr>)}</tbody></table></div></DashboardShell>
}
