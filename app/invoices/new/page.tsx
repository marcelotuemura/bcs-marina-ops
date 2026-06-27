"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

interface Option {
  id: string;
  name: string | null;
}

export default function NewInvoicePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [vesselId, setVesselId] = useState('');
  const [customers, setCustomers] = useState<Option[]>([]);
  const [vessels, setVessels] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadOptions() {
      const supabase = supabaseClient();
      const { data: custData } = await supabase.from('customers').select('id, name').order('name');
      const { data: vesselData } = await supabase
        .from('vessels')
        .select('id, name')
        .order('name');
      if (custData) setCustomers(custData as any);
      if (vesselData) setVessels(vesselData as any);
    }
    loadOptions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = supabaseClient();
    const totalNum = total ? parseFloat(total) : null;
    const { error } = await supabase.from('invoices').insert({
      title,
      description,
      total: totalNum,
      status: 'draft',
      customer_id: customerId || null,
      vessel_id: vesselId || null,
    });
    if (error) {
      setMessage(error.message);
    } else {
      router.push('/invoices');
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>New Invoice</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '480px' }} className="card">
        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="input"
          style={{ height: '120px', resize: 'vertical' }}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input"
          placeholder="Total (e.g. 500.00)"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
        <select
          className="input"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={vesselId}
          onChange={(e) => setVesselId(e.target.value)}
        >
          <option value="">Select vessel</option>
          {vessels.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Saving…' : 'Save'}
        </button>
        {message && (
          <p style={{ marginTop: '1rem', color: '#e11d48' }}>{message}</p>
        )}
      </form>
    </div>
  );
}