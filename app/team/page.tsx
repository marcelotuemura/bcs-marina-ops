import DashboardShell from '@/components/dashboard-shell'
const team = [['Marina Manager','Admin'],['Service Advisor','Manager'],['Technician','Field User'],['Accounting','Finance']]
export default function TeamPage() { return <DashboardShell eyebrow="Access Control" title="Team" subtitle="Invite staff, assign roles, restrict permissions, and prepare for multi-company SaaS tenants."><section className="page-grid">{team.map(t => <div className="card" key={t[0]}><h2>{t[0]}</h2><p>{t[1]}</p><span className="badge green">Role-based</span></div>)}</section></DashboardShell> }
