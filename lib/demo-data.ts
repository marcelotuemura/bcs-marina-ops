export const workspace = {
  name: 'Best Coatings Solutions',
  product: 'BCS Marina Ops Enterprise',
  domain: 'bestcoatingssolution.com',
  location: 'Fort Lauderdale, FL',
  plan: 'Enterprise SaaS',
  locations: ['Fort Lauderdale', 'Miami River', 'Pompano Beach'],
}

export const kpis = [
  { label: 'Monthly revenue', value: '$128,680', change: '+12.5%', tone: 'good' },
  { label: 'Open work orders', value: '23', change: '6 urgent', tone: 'warn' },
  { label: 'Slip occupancy', value: '92%', change: '+4.3%', tone: 'good' },
  { label: 'Overdue invoices', value: '18', change: '$24.8k', tone: 'danger' },
]

export const workOrders = [
  { id: 'WO-1054', job: 'Engine service', vessel: 'Sea Ray 310', customer: 'John Smith', status: 'In Progress', priority: 'High', total: '$850', due: 'Today' },
  { id: 'WO-1055', job: 'Hull cleaning', vessel: 'Boston Whaler 23', customer: 'Sarah Johnson', status: 'Scheduled', priority: 'Medium', total: '$420', due: 'Tomorrow' },
  { id: 'WO-1056', job: 'Gelcoat correction', vessel: 'Intrepid 375', customer: 'Michael Brown', status: 'Review', priority: 'High', total: '$3,200', due: 'Jun 28' },
  { id: 'WO-1057', job: 'Electronics install', vessel: 'Contender 39', customer: 'Ana Silva', status: 'Waiting Parts', priority: 'Medium', total: '$4,850', due: 'Jul 02' },
]

export const customers = [
  { name: 'John Smith', email: 'john@marina.com', vessel: 'Sea Ray 310', lifetime: '$18,200', status: 'VIP' },
  { name: 'Sarah Johnson', email: 'sarah@example.com', vessel: 'Boston Whaler 23', lifetime: '$7,430', status: 'Active' },
  { name: 'Michael Brown', email: 'michael@example.com', vessel: 'Intrepid 375', lifetime: '$28,950', status: 'Active' },
  { name: 'Ana Silva', email: 'ana@example.com', vessel: 'Contender 39', lifetime: '$12,100', status: 'Portal Invited' },
]

export const modules = [
  ['Command Center', 'Live KPIs, alerts, work pipeline, revenue, and technician activity.'],
  ['Work Orders', 'Photos, labor, parts, notes, approvals, signatures, and invoice conversion.'],
  ['Customer Portal', 'Owners approve estimates, pay invoices, upload photos, and track status.'],
  ['Multi-Tenant SaaS', 'One codebase supports many marinas with isolated workspaces.'],
  ['Stripe Billing', 'Subscriptions, invoices, receipts, and customer payments foundation.'],
  ['AI Repair Assistant', 'Future-ready workflows for estimates, emails, and service summaries.'],
]

export const nav = [
  ['/dashboard', 'Dashboard', '⌘'],
  ['/work-orders', 'Work Orders', '□'],
  ['/customers', 'Customers', '◇'],
  ['/vessels', 'Vessels', '△'],
  ['/slips', 'Slips & Storage', '▣'],
  ['/schedule', 'Schedule', '◷'],
  ['/estimates', 'Estimates', '✎'],
  ['/invoices', 'Invoices', '$'],
  ['/inventory', 'Inventory', '▦'],
  ['/fuel', 'Fuel Sales', '◌'],
  ['/reports', 'Reports', '↗'],
  ['/team', 'Team', '◎'],
  ['/settings', 'Settings', '⚙'],
]
