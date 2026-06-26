import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
import StatCard from '@/components/stat-card'
import { workOrders } from '@/lib/demo-data'

export default function WorkOrdersPage() {
  return <DashboardShell eyebrow="Service Operations" title="Work Orders" subtitle="Manage technicians, labor, parts, photos, approvals, signatures, and profitability.">
    <section className="metric-grid"><StatCard label="New" value="7" change="today" /><StatCard label="In progress" value="16" change="active bays" tone="warn" /><StatCard label="Waiting approval" value="4" change="$9.8k" tone="danger" /><StatCard label="Completed" value="38" change="this week" tone="good" /></section>
    <DataTable columns={['ID','Job','Vessel','Customer','Priority','Status','Total']} rows={workOrders.map(w => [w.id, w.job, w.vessel, w.customer, <Badge key="p" tone={w.priority === 'High' ? 'red' : 'blue'}>{w.priority}</Badge>, <Badge key="s" tone="amber">{w.status}</Badge>, w.total])} />
  </DashboardShell>
}
