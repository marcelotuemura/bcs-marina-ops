import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

interface Params {
  params: {
    id: string;
  };
}

export default async function CustomerDetail({ params }: Params) {
  const supabase = supabaseServer();
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!customer) {
    notFound();
  }
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Customer Detail</h1>
        <Link href="/customers" className="btn">
          Back to Customers
        </Link>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{customer.name || 'Unnamed'}</h2>
        <p>Email: {customer.email || '–'}</p>
        <p>Phone: {customer.phone || '–'}</p>
      </div>
    </div>
  );
}