import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function WorkOrdersPage() {
  const supabase = supabaseServer();
  const { data: workOrders, error } = await supabase
    .from('work_orders')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Work Orders</h1>
        <Link href="/work-orders/new" className="btn">
          New Work Order
        </Link>
      </div>
      {error && <p style={{ color: '#e11d48' }}>{error.message}</p>}
      <div style={{ marginTop: '1rem' }}>
        {workOrders && workOrders.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo) => (
                <tr key={wo.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/work-orders/${wo.id}`}>{wo.title || 'Untitled'}</Link>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{wo.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No work orders yet.</p>
        )}
      </div>
    </div>
  );
}