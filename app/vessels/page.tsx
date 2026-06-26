import Badge from '@/components/badge'
import DashboardShell from '@/components/dashboard-shell'
import DataTable from '@/components/data-table'
const rows = [['Sea Ray 310','John Smith','31 ft','Engine service','In Service'],['Boston Whaler 23','Sarah Johnson','23 ft','Hull cleaning','Scheduled'],['Intrepid 375','Michael Brown','37 ft','Gelcoat correction','Review'],['Contender 39','Ana Silva','39 ft','Electronics install','Waiting Parts']]
export default function VesselsPage(){return <DashboardShell eyebrow="Asset Registry" title="Vessels" subtitle="Full vessel profiles, maintenance history, documents, photos, engines, and ownership records."><DataTable columns={['Vessel','Owner','Length','Current Job','Status']} rows={rows.map(r=>[r[0],r[1],r[2],r[3],<Badge key="s" tone="blue">{r[4]}</Badge>])}/></DashboardShell>}
