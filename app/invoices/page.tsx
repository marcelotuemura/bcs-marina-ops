'use client'

import DashboardShell from '@/components/dashboard-shell'

async function startCheckout() {
  const res = await fetch('/api/stripe/checkout', { method: 'POST' })
  const data = await res.json()
  window.location.href = data.url
}

export default function InvoicesPage() {
  return (
    <DashboardShell>
      <div className="stack">
        <div>
          <h1>Invoices</h1>
          <button className="btn" onClick={startCheckout}>Pay deposit</button>
        </div>
        <table className="table">
          <thead>
            <tr><th>Invoice</th><th>Client</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>INV-1001</td><td>Harbor Client</td><td>$3,200</td></tr>
            <tr><td>INV-1002</td><td>Dockside Client</td><td>$1,980</td></tr>
          </tbody>
        </table>
      </div>
    </DashboardShell>
  )
}
