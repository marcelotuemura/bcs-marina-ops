import AppNav from '@/components/app-nav';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function EstimatesPage() {
  const supabase = await supabaseServer();
  const { data: estimates, error } = await supabase
    .from('estimates')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <div className="container">
      <AppNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Estimates</h1>
        <Link href="/estimates/new" className="btn">
          New Estimate
        </Link>
      </div>
      {error && <p style={{ color: '#e11d48' }}>{error.message}</p>}
      <div style={{ marginTop: '1rem' }}>
        {estimates && estimates.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/estimates/${estimate.id}`}>{estimate.title || 'Untitled'}</Link>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{estimate.status}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    {estimate.total ? `$${estimate.total.toFixed(2)}` : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No estimates yet.</p>
        )}
      </div>
    </div>
  );
}