import AppNav from '@/components/app-nav';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function CustomersPage() {
  const supabase = await supabaseServer();
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="container">
      <AppNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Customers</h1>
        <Link href="/customers/new" className="btn">
          New Customer
        </Link>
      </div>
      {error && <p style={{ color: '#e11d48' }}>{error.message}</p>}
      <div style={{ marginTop: '1rem' }}>
        {customers && customers.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/customers/${cust.id}`}>{cust.name || 'Unnamed'}</Link>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{cust.email}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{cust.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No customers yet.</p>
        )}
      </div>
    </div>
  );
}