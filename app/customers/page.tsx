import DashboardShell from '@/components/dashboard-shell'

const customers = [['John Smith','john@marina.com','Sea Ray 310','VIP'],['Sarah Johnson','sarah@example.com','Boston Whaler 23','Active'],['David Brown','david@example.com','Azimut 42','Active']]
export default function CustomersPage() { return <DashboardShell eyebrow="CRM" title="Customers" subtitle="Customer profiles with vessels, billing, work history, documents, and portal access."><div className="table-card"><table className="table"><thead><tr><th>Name</th><th>Email</th><th>Primary Vessel</th><th>Status</th></tr></thead><tbody>{customers.map(r => <tr key={r[0]}><td><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td><td><span className="badge green">{r[3]}</span></td></tr>)}</tbody></table></div></DashboardShell> }
