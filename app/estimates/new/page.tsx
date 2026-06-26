import DashboardShell from '@/components/dashboard-shell'
import EstimateForm from '@/components/estimate-form'
import { getRoleLabel } from '@/app/actions/billing'

export default async function NewEstimatePage() {
  const roleLabel = await getRoleLabel()

  return (
    <DashboardShell
      eyebrow="Revenue Workflow"
      title="Create Estimate"
      subtitle="Estimates are private to their creator by default. General Managers, Admins, and Owners can see all company estimates."
    >
      <EstimateForm roleLabel={roleLabel} />
    </DashboardShell>
  )
}
