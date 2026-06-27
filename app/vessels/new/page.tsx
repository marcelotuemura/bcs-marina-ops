"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

interface CustomerOption {
  id: string;
  name: string | null;
}

export default function NewVesselPage() {
  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadCustomers() {
      const supabase = supabaseClient();
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .order('name', { ascending: true });
      if (!error && data) {
        setCustomers(data as unknown as CustomerOption[]);
      }
    }
    loadCustomers();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = supabaseClient();
    const yearNum = year ? parseInt(year, 10) : null;
    const { error } = await supabase.from('vessels').insert({
      name,
      make,
      model,
      year: yearNum,
      customer_id: customerId || null,
    });
    if (error) {
      setMessage(error.message);
    } else {
      router.push('/vessels');
    }
    setLoading(false);
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>New Vessel</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '480px' }} className="card">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          className="input"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          className="input"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
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