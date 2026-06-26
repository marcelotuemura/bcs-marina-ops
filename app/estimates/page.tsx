import Link from 'next/link'
import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const managerRoles = ['owner', 'admin', 'general_manager']
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

function statusTone(status: string) {
  const s = status.toLowerCase()
  if (s === 'approved') return 'green'
  if (s === 'declined') return 'red'
  return 'amber'
}

export default async function EstimatesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = 'member'
  let rows: any[][] = []
  let sourceLabel = 'Live role-based estimates. Apply the synchronized SQL if no data appears.'

  if (user) {
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (membership?.organization_id) {
      role = membership.role
      const canSeeAll = managerRoles.includes(role)
      const query = supabase
        .from('estimates')
        .select('estimate_number, customer_name, vessel_name, scope, status, total_cents, created_by, created_at')
        .eq('organization_id', membership.organization_id)
        .order('created_at', { ascending: false })

      if (!canSeeAll) query.eq('created_by', user.id)

      const { data: estimates, error } = await query.limit(50)
      if (error) {
        sourceLabel = `Database error: ${error.message}`
      } else if (estimates?.length) {
        rows = estimates.map((estimate: any) => [
          estimate.estimate_number ?? 'Draft',
          estimate.customer_name ?? 'Customer',
          estimate.vessel_name ?? estimate.scope ?? 'Service',
          estimate.status ?? 'draft',
          money.format((estimate.total_cents ?? 0) / 100),
          estimate.created_by === user.id ? 'You' : 'Team member'
        ])
        sourceLabel = canSeeAll ? 'Manager view - all company estimates' : 'My estimates - creator-only access'
      } else {
        sourceLabel = canSeeAll ? 'Manager view enabled - no live estimates yet' : 'Creator-only view enabled - no live estimates yet'
      }
    }
  }

  const accessCopy = managerRoles.includes(role)
    ? 'You have manager-level estimate access and can review every company estimate.'
    : 'You have creator-level estimate access and can only see estimates created by you.'

  return (
    <DashboardShell eyebrow="Revenue Workflow" title="Estimates" subtitle="Create polished estimates, capture approvals, convert to invoices, and protect margins.">
      <div className="page-grid">
        <div className="card">
          <div className="section-heading">
            <div>
              <h2>Estimate Access</h2>
              <p>{accessCopy}</p>
              <p><strong>{sourceLabel}</strong></p>
            </div>
            <Link className="primary-button" href="/estimates/new">+ New Estimate</Link>
          </div>
        </div>
        <DataTable
          columns={['Estimate', 'Customer', 'Vessel / Scope', 'Status', 'Total', 'Visible as']}
          rows={rows.map((r) => [
            r[0],
            r[1],
            r[2],
            <Badge key={`${r[0]}-${r[3]}`} tone={statusTone(String(r[3]))}>{r[3]}</Badge>,
            r[4],
            r[5]
          ])}
        />
      </div>
    </DashboardShell>
  )
}
