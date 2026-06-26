import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
const rows=[['EST-2040','Sea Ray 310','Engine service + filters','Draft','$850'],['EST-2041','Azimut 42','Detailing + gelcoat correction','Sent','$2,300'],['EST-2042','Boston Whaler 23','Hull cleaning','Approved','$420']]
export default function EstimatesPage(){return <DashboardShell eyebrow="Revenue Workflow" title="Estimates" subtitle="Create polished estimates, capture approvals, convert to invoices, and protect margins."><DataTable columns={['Estimate','Vessel','Scope','Status','Total']} rows={rows.map(r=>[r[0],r[1],r[2],<Badge key="s" tone={r[3]==='Approved'?'green':'amber'}>{r[3]}</Badge>,r[4]])}/></DashboardShell>}
