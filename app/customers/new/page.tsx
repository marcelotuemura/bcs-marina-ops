"use client";

import AppNav from '@/components/app-nav';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import { getActiveOrganizationId } from '@/lib/org';

export default function NewCustomerPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = supabaseClient();
    try {
      const { organizationId } = await getActiveOrganizationId(supabase);
      const { error } = await supabase.from('customers').insert({ name, email, phone, company_id: organizationId });
    if (error) {
        setMessage(error.message);
      } else {
        router.push('/customers');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to save customer.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <AppNav />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>New Customer</h1>
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
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
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