import Link from 'next/link';

export default function AppNav() {
  return (
    <nav className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/customers">Customers</Link>
      <Link href="/vessels">Vessels</Link>
      <Link href="/estimates">Estimates</Link>
      <Link href="/work-orders">Work Orders</Link>
      <Link href="/invoices">Invoices</Link>
      <Link href="/settings">Settings</Link>
    </nav>
  );
}
