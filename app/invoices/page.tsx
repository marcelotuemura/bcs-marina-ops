import Link from 'next/link'
import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const managerRoles = ['owner', 'admin', 'general_manager']
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const demoRows = [
  ['INV-10023', 'John Smith', 'Paid', '$1,250', 'You'],
  ['INV-10024', 'Sarah Johnson', 'Open', '$650', 'You'],
  ['INV-10025', 'Michael Brown', 'Overdue', '$3,200', 'Manager view'],
  ['INV-10026', 'Ana Silva', 'Draft', '$4,850', 'Manager view']
]

function statusTone(status: string) {
  if (status.toLowerCase() === 'paid') return 'green'
  if (status.toLowerCase() === 'overdue') return 'red'
  return 'amber'
}

export default async function InvoicesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'member'
  let organizationId: string | null = null
  let rows = demoRows
  let sourceLabel = 'Demo data - apply Supabase migration v1.2 for live RLS data'

  if (user) {
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (membership) {
      role = membership.role
      organizationId = membership.organization_id
      const canSeeAll = managerRoles.includes(role)
      const query = supabase
        .from('invoices')
        .select('invoice_number, customer_name, status, total_cents, created_by')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (!canSeeAll) query.eq('created_by', user.id)

      const { data: invoices } = await query.limit(50)
      if (invoices && invoices.length > 0) {
        rows = invoices.map((invoice: any) => [
          invoice.invoice_number ?? 'Draft',
          invoice.customer_name ?? 'Customer',
          invoice.status ?? 'draft',
          money.format((invoice.total_cents ?? 0) / 100),
          invoice.created_by === user.id ? 'You' : 'Team member'
        ])
        sourceLabel = canSeeAll ? 'Manager view - all company invoices' : 'My invoices - creator-only access'
      } else {
        sourceLabel = canSeeAll ? 'Manager view enabled - no live invoices yet' : 'Creator-only view enabled - no live invoices yet'
      }
    }
  }

  const accessCopy = managerRoles.includes(role)
    ? 'You have manager-level invoice access and can review every company invoice.'
    : 'You have creator-level invoice access and can only see invoices created by you.'

  return (
    <DashboardShell eyebrow="Billing" title="Invoices" subtitle="Role-based billing center with creator privacy and general manager oversight.">
      <div className="page-grid">
        <div className="card">
          <div className="section-heading">
            <div>
              <h2>Invoice Access</h2>
              <p>{accessCopy}</p>
              <p><strong>{sourceLabel}</strong></p>
            </div>
            <Link className="primary-button" href="/invoices/new">+ New Invoice</Link>
          </div>
        </div>
        <DataTable
          columns={['Invoice', 'Customer', 'Status', 'Total', 'Visible as']}
          rows={rows.map((r) => [
            r[0],
            r[1],
            <Badge key={`${r[0]}-${r[2]}`} tone={statusTone(String(r[2]))}>{r[2]}</Badge>,
            r[3],
            r[4]
          ])}
        />
      </div>
    </DashboardShell>
  )
}
