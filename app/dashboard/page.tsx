import AppNav from '@/components/app-nav';
import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

export default async function Dashboard() {
  const supabase = await supabaseServer();
  // Fetch counts from Supabase
  const [estimatesCount, invoicesCount, workOrdersCount] = await Promise.all([
    supabase.from('estimates').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
    supabase.from('work_orders').select('*', { count: 'exact', head: true }),
  ]);
  const ec = estimatesCount?.count ?? 0;
  const ic = invoicesCount?.count ?? 0;
  const wc = workOrdersCount?.count ?? 0;

  return (
    <div className="container">
      <AppNav />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
        Dashboard
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="card" style={{ flex: '1 1 200px' }}>
          <h2 style={{ fontWeight: 600 }}>Estimates</h2>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{ec}</p>
          <Link href="/estimates" className="btn" style={{ marginTop: '0.5rem' }}>
            View estimates
          </Link>
        </div>
        <div className="card" style={{ flex: '1 1 200px' }}>
          <h2 style={{ fontWeight: 600 }}>Work Orders</h2>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{wc}</p>
          <Link href="/work-orders" className="btn" style={{ marginTop: '0.5rem' }}>
            View work orders
          </Link>
        </div>
        <div className="card" style={{ flex: '1 1 200px' }}>
          <h2 style={{ fontWeight: 600 }}>Invoices</h2>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{ic}</p>
          <Link href="/invoices" className="btn" style={{ marginTop: '0.5rem' }}>
            View invoices
          </Link>
        </div>
      </div>
    </div>
  );
}