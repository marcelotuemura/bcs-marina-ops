'use client'

import DashboardShell from '@/components/dashboard-shell'

async function startCheckout() {
  const res = await fetch('/api/stripe/checkout', { method: 'POST' })
  const data = await res.json()
  if (data.url) window.location.href = data.url
  if (data.error) alert(data.error)
}

const invoices = [['INV-10023','John Smith','$1,250','Paid'],['INV-10024','Sarah Johnson','$650','Unpaid'],['INV-10025','David Brown','$2,300','Overdue']]
export default function InvoicesPage() { return <DashboardShell eyebrow="Billing" title="Invoices & Payments" subtitle="Online deposits, invoices, Stripe checkout, payment history, and accounts receivable management."><div className="stack"><div className="top-actions"><button className="primary-button" onClick={startCheckout}>Pay test deposit</button><button className="secondary-button">Create invoice</button></div><div className="table-card"><table className="table"><thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Status</th></tr></thead><tbody>{invoices.map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td><span className={r[3]==='Paid'?'badge green':r[3]==='Overdue'?'badge red':'badge amber'}>{r[3]}</span></td></tr>)}</tbody></table></div></div></DashboardShell> }
