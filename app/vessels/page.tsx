import DashboardShell from '@/components/dashboard-shell'

const vessels = [['Sea Ray 310','John Smith','31 ft','Engine service due'],['Boston Whaler 23','Sarah Johnson','23 ft','Storage active'],['Azimut 42','David Brown','42 ft','Detailing scheduled']]
export default function VesselsPage() { return <DashboardShell eyebrow="Assets" title="Vessels" subtitle="Track vessel specs, HIN, photos, insurance, service history, and storage assignments."><section className="page-grid">{vessels.map(v => <div className="card" key={v[0]}><h2>{v[0]}</h2><p>{v[1]} • {v[2]}</p><span className="badge">{v[3]}</span></div>)}</section></DashboardShell> }
