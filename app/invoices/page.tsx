import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
const rows=[['INV-10023','John Smith','Paid','$1,250'],['INV-10024','Sarah Johnson','Open','$650'],['INV-10025','Michael Brown','Overdue','$3,200'],['INV-10026','Ana Silva','Draft','$4,850']]
export default function InvoicesPage(){return <DashboardShell eyebrow="Billing" title="Invoices" subtitle="Online invoices, Stripe payments, receipts, reminders, tax reporting, and accounting handoff."><DataTable columns={['Invoice','Customer','Status','Total']} rows={rows.map(r=>[r[0],r[1],<Badge key="s" tone={r[2]==='Paid'?'green':r[2]==='Overdue'?'red':'amber'}>{r[2]}</Badge>,r[3]])}/></DashboardShell>}
