import AppNav from '@/components/app-nav';
import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

interface Params {
  params: {
    id: string;
  };
}

export default async function VesselDetail({ params }: Params) {
  const supabase = await supabaseServer();
  const { data: vessel } = await supabase
    .from('vessels')
    .select('*, customers(name)')
    .eq('id', params.id)
    .single();
  if (!vessel) {
    notFound();
  }
  return (
    <div className="container">
      <AppNav />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Vessel Detail</h1>
        <Link href="/vessels" className="btn">
          Back to Vessels
        </Link>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{vessel.name || 'Unnamed'}</h2>
        <p>Make/Model: {vessel.make} {vessel.model}</p>
        <p>Year: {vessel.year || '–'}</p>
        <p>Customer: {(Array.isArray((vessel as any).customers) ? (vessel as any).customers[0]?.name : (vessel as any).customers?.name) || '–'}</p>
      </div>
    </div>
  );
}