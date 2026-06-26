import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
const rows=[['Marcelo Uemura','Owner','Admin','Active'],['Tom Anderson','Service Manager','Manager','Active'],['Diego Brown','Technician','Technician','Active'],['Office Team','Billing','Staff','Invited']]
export default function TeamPage(){return <DashboardShell eyebrow="Access Control" title="Team" subtitle="Users, permissions, roles, invites, technician assignments, and workspace security."><DataTable columns={['Name','Department','Role','Status']} rows={rows.map(r=>[r[0],r[1],<Badge key="r" tone="blue">{r[2]}</Badge>,<Badge key="s" tone={r[3]==='Active'?'green':'amber'}>{r[3]}</Badge>])}/></DashboardShell>}
