import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
const days=['Mon','Tue','Wed','Thu','Fri','Sat']
export default function SchedulePage(){return <DashboardShell eyebrow="Dispatch" title="Schedule" subtitle="Technician scheduling, appointments, haul-outs, slip bookings, and customer confirmations."><div className="calendar-grid">{days.map((d,i)=><div className="calendar-day" key={d}><strong>{d}</strong><span>Jun {22+i}</span><div className="appointment">Engine Service</div>{i%2===0&&<div className="appointment light">Detailing</div>}<Badge tone="blue">{i+2} jobs</Badge></div>)}</div></DashboardShell>}
