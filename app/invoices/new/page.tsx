import DashboardShell from '@/components/dashboard-shell'
import InvoiceForm from '@/components/invoice-form'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const managerRoles = ['owner', 'admin', 'general_manager']

export default async function NewInvoicePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  let roleLabel = 'Team member'
  if (user) {
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (membership?.role) {
      roleLabel = managerRoles.includes(membership.role) ? 'Manager access' : `${membership.role} access`
    }
  }

  return (
    <DashboardShell
      eyebrow="Billing"
      title="Create Invoice"
      subtitle="Invoices are private to their creator by default. General Managers, Admins, and Owners can see all company invoices."
    >
      <InvoiceForm roleLabel={roleLabel} />
    </DashboardShell>
  )
}
