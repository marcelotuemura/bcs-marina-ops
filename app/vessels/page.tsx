import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function VesselsPage() {
  const supabase = supabaseServer();
  const { data: vessels, error } = await supabase
    .from('vessels')
    .select('*, customers(name)')
    .order('created_at', { ascending: false });

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Vessels</h1>
        <Link href="/vessels/new" className="btn">
          New Vessel
        </Link>
      </div>
      {error && <p style={{ color: '#e11d48' }}>{error.message}</p>}
      <div style={{ marginTop: '1rem' }}>
        {vessels && vessels.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Make/Model</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Year</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Customer</th>
              </tr>
            </thead>
            <tbody>
              {vessels.map((vessel) => (
                <tr key={vessel.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/vessels/${vessel.id}`}>{vessel.name || 'Unnamed'}</Link>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    {vessel.make} {vessel.model}
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{vessel.year}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    {vessel.customers?.name || '–'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No vessels yet.</p>
        )}
      </div>
    </div>
  );
}