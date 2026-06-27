import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function InvoicesPage() {
  const supabase = supabaseServer();
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Invoices</h1>
        <Link href="/invoices/new" className="btn">
          New Invoice
        </Link>
      </div>
      {error && <p style={{ color: '#e11d48' }}>{error.message}</p>}
      <div style={{ marginTop: '1rem' }}>
        {invoices && invoices.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Title</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <Link href={`/invoices/${invoice.id}`}>{invoice.title || 'Untitled'}</Link>
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{invoice.status}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    {invoice.total ? `$${invoice.total.toFixed(2)}` : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No invoices yet.</p>
        )}
      </div>
    </div>
  );
}