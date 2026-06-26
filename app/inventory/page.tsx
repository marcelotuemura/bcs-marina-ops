import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
const rows=[['Epoxy Resin','4 units','Low','Reorder now'],['Fuel Filter','31 units','Healthy','No action'],['Anode Zinc','6 units','Low','Reorder this week'],['Gelcoat White','12 gallons','Healthy','No action']]
export default function InventoryPage(){return <DashboardShell eyebrow="Parts & Supplies" title="Inventory" subtitle="Parts, materials, stock alerts, purchase orders, supplier pricing, and job-level costing."><DataTable columns={['Item','Stock','Status','Action']} rows={rows.map(r=>[r[0],r[1],<Badge key="s" tone={r[2]==='Low'?'red':'green'}>{r[2]}</Badge>,r[3]])}/></DashboardShell>}
