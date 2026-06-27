import AppNav from '@/components/app-nav';
import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

interface Params {
  params: {
    id: string;
  };
}

export default async function InvoiceDetail({ params }: Params) {
  const supabase = await supabaseServer();
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!invoice) {
    notFound();
  }
  return (
    <div className="container">
      <AppNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Invoice Detail</h1>
        <Link href="/invoices" className="btn">
          Back to Invoices
        </Link>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{invoice.title || 'Untitled'}</h2>
        <p>Status: {invoice.status}</p>
        <p>Description: {invoice.description}</p>
        <p>Total: {invoice.total ? `$${invoice.total.toFixed(2)}` : '0.00'}</p>
        {invoice.estimate_id && (
          <p>
            From Estimate:{' '}
            <Link href={`/estimates/${invoice.estimate_id}`}>{invoice.estimate_id}</Link>
          </p>
        )}
      </div>
    </div>
  );
}