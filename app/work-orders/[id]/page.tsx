import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

interface Params {
  params: {
    id: string;
  };
}

export default async function WorkOrderDetail({ params }: Params) {
  const supabase = supabaseServer();
  const { data: workOrder } = await supabase
    .from('work_orders')
    .select('*')
    .eq('id', params.id)
    .single();
  if (!workOrder) {
    notFound();
  }
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Work Order Detail</h1>
        <Link href="/work-orders" className="btn">
          Back to Work Orders
        </Link>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{workOrder.title || 'Untitled'}</h2>
        <p>Status: {workOrder.status}</p>
        <p>Description: {workOrder.description}</p>
        {workOrder.estimate_id && (
          <p>
            From Estimate:{' '}
            <Link href={`/estimates/${workOrder.estimate_id}`}>{workOrder.estimate_id}</Link>
          </p>
        )}
      </div>
    </div>
  );
}