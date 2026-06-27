"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

export default function ConvertButtons({ estimateId }: { estimateId: string }) {
  const router = useRouter();
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [loadingWorkOrder, setLoadingWorkOrder] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleConvertInvoice() {
    setLoadingInvoice(true);
    setMessage(null);
    const supabase = supabaseClient();
    // Fetch estimate to copy fields
    const { data: estimate, error: estErr } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', estimateId)
      .single();
    if (estErr || !estimate) {
      setMessage(estErr?.message || 'Estimate not found');
      setLoadingInvoice(false);
      return;
    }
    // Create invoice
    const { error: invErr, data: invoice } = await supabase.from('invoices').insert({
      title: estimate.title,
      description: estimate.description,
      total: estimate.total,
      status: 'draft',
      customer_id: estimate.customer_id,
      vessel_id: estimate.vessel_id,
      estimate_id: estimate.id,
    }).select('*').single();
    if (invErr || !invoice) {
      setMessage(invErr?.message || 'Failed to create invoice');
      setLoadingInvoice(false);
      return;
    }
    // Update estimate status to converted
    await supabase.from('estimates').update({ status: 'converted' }).eq('id', estimateId);
    setLoadingInvoice(false);
    router.push(`/invoices/${invoice.id}`);
  }

  async function handleCreateWorkOrder() {
    setLoadingWorkOrder(true);
    setMessage(null);
    const supabase = supabaseClient();
    const { data: estimate, error: estErr } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', estimateId)
      .single();
    if (estErr || !estimate) {
      setMessage(estErr?.message || 'Estimate not found');
      setLoadingWorkOrder(false);
      return;
    }
    const { error: woErr, data: wo } = await supabase.from('work_orders').insert({
      title: estimate.title,
      description: estimate.description,
      status: 'new',
      customer_id: estimate.customer_id,
      vessel_id: estimate.vessel_id,
      estimate_id: estimate.id,
    }).select('*').single();
    if (woErr || !wo) {
      setMessage(woErr?.message || 'Failed to create work order');
      setLoadingWorkOrder(false);
      return;
    }
    // Optionally update estimate status to approved
    await supabase.from('estimates').update({ status: 'approved' }).eq('id', estimateId);
    setLoadingWorkOrder(false);
    router.push(`/work-orders/${wo.id}`);
  }

  return (
    <>
      <button
        className="btn"
        onClick={handleConvertInvoice}
        disabled={loadingInvoice || loadingWorkOrder}
      >
        {loadingInvoice ? 'Converting…' : 'Convert to Invoice'}
      </button>
      <button
        className="btn"
        onClick={handleCreateWorkOrder}
        disabled={loadingInvoice || loadingWorkOrder}
      >
        {loadingWorkOrder ? 'Creating…' : 'Create Work Order'}
      </button>
      {message && (
        <p style={{ marginTop: '0.5rem', color: '#e11d48' }}>{message}</p>
      )}
    </>
  );
}