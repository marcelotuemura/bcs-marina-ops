import DashboardShell from '@/components/dashboard-shell'
import InvoiceForm from '@/components/invoice-form'
import { getRoleLabel } from '@/app/actions/billing'

export default async function NewInvoicePage() {
  const roleLabel = await getRoleLabel()

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
