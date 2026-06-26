import DashboardShell from '@/components/dashboard-shell'
import WorkOrderForm from '@/components/work-order-form'

export default function NewWorkOrderPage() {
  return (
    <DashboardShell
      eyebrow="Service Intake"
      title="New Work Order"
      subtitle="Create a clean service request with customer, vessel, schedule, priority, parts, labor, photos, and approval workflow."
    >
      <WorkOrderForm />
    </DashboardShell>
  )
}
