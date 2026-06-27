import AppNav from '@/components/app-nav';
import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';
import ConvertButtons from './convert-buttons';

interface Params {
  params: {
    id: string;
  };
}

export default async function EstimateDetail({ params }: Params) {
  const supabase = await supabaseServer();
  const { data: estimate } = await supabase
    .from('estimates')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!estimate) {
    notFound();
  }
  return (
    <div className="container">
      <AppNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Estimate Detail</h1>
        <Link href="/estimates" className="btn">
          Back to Estimates
        </Link>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{estimate.title || 'Untitled'}</h2>
        <p>Status: {estimate.status}</p>
        <p>Description: {estimate.description}</p>
        <p>Total: {estimate.total ? `$${estimate.total.toFixed(2)}` : '0.00'}</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          {/* Convert and create work order buttons are client components */}
          <ConvertButtons estimateId={estimate.id} />
        </div>
      </div>
    </div>
  );
}