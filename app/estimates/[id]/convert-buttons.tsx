"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { getActiveOrganizationId } from '@/lib/org';

export default function ConvertButtons({ estimateId }: { estimateId: string }) {
  const router = useRouter();
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [loadingWorkOrder, setLoadingWorkOrder] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleConvertInvoice() {
    setLoadingInvoice(true);
    setMessage(null);
    const supabase = supabaseClient();

    try {
      const { organizationId, userId } = await getActiveOrganizationId(supabase);
      const { data: estimate, error: estErr } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', estimateId)
        .single();

      if (estErr || !estimate) {
        throw new Error(estErr?.message || 'Estimate not found.');
      }

      const { error: invErr, data: invoice } = await supabase
        .from('invoices')
        .insert({
          title: estimate.title,
          description: estimate.description,
          total: estimate.total,
          status: 'draft',
          customer_id: estimate.customer_id,
          vessel_id: estimate.vessel_id,
          estimate_id: estimate.id,
          company_id: estimate.company_id || organizationId,
          created_by: userId,
        })
        .select('*')
        .single();

      if (invErr || !invoice) {
        throw new Error(invErr?.message || 'Failed to create invoice.');
      }

      await supabase.from('estimates').update({ status: 'converted' }).eq('id', estimateId);
      router.push(`/invoices/${invoice.id}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to convert estimate.');
    } finally {
      setLoadingInvoice(false);
    }
  }

  async function handleCreateWorkOrder() {
    setLoadingWorkOrder(true);
    setMessage(null);
    const supabase = supabaseClient();

    try {
      const { organizationId, userId } = await getActiveOrganizationId(supabase);
      const { data: estimate, error: estErr } = await supabase
        .from('estimates')
        .select('*')
        .eq('id', estimateId)
        .single();

      if (estErr || !estimate) {
        throw new Error(estErr?.message || 'Estimate not found.');
      }

      const { error: woErr, data: wo } = await supabase
        .from('work_orders')
        .insert({
          title: estimate.title,
          description: estimate.description,
          status: 'new',
          customer_id: estimate.customer_id,
          vessel_id: estimate.vessel_id,
          estimate_id: estimate.id,
          company_id: estimate.company_id || organizationId,
          created_by: userId,
        })
        .select('*')
        .single();

      if (woErr || !wo) {
        throw new Error(woErr?.message || 'Failed to create work order.');
      }

      await supabase.from('estimates').update({ status: 'approved' }).eq('id', estimateId);
      router.push(`/work-orders/${wo.id}`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to create work order.');
    } finally {
      setLoadingWorkOrder(false);
    }
  }

  return (
    <>
      <button
        className="btn"
        onClick={handleConvertInvoice}
        disabled={loadingInvoice || loadingWorkOrder}
      >
        {loadingInvoice ? 'Converting...' : 'Convert to Invoice'}
      </button>
      <button
        className="btn"
        onClick={handleCreateWorkOrder}
        disabled={loadingInvoice || loadingWorkOrder}
      >
        {loadingWorkOrder ? 'Creating...' : 'Create Work Order'}
      </button>
      {message && <p style={{ marginTop: '0.5rem', color: '#e11d48' }}>{message}</p>}
    </>
  );
}
