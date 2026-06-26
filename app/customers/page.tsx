import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
import StatCard from '@/components/stat-card'
import { customers } from '@/lib/demo-data'

export default function CustomersPage() {
  return <DashboardShell eyebrow="CRM" title="Customers" subtitle="Premium customer records with vessels, service history, billing, documents, and portal access.">
    <section className="metric-grid"><StatCard label="Total customers" value="156" change="+8 this month" tone="good" /><StatCard label="Portal active" value="74%" change="+12%" tone="good" /><StatCard label="VIP accounts" value="18" change="$220k lifetime" /><StatCard label="Open approvals" value="9" change="needs follow-up" tone="warn" /></section>
    <DataTable columns={['Name','Email','Primary Vessel','Lifetime Value','Status']} rows={customers.map(c => [<strong key="n">{c.name}</strong>, c.email, c.vessel, c.lifetime, <Badge key="s" tone="green">{c.status}</Badge>])} />
  </DashboardShell>
}
