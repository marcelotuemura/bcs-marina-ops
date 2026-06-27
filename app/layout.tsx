import './globals.css';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export const metadata = {
  title: 'BCS Marina Ops',
  description: 'Simple operations app for mobile marine service companies',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        {session ? (
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <nav
              style={{
                width: '240px',
                background: '#fff',
                borderRight: '1px solid #e5e7eb',
                padding: '1rem',
              }}
            >
              <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                BCS Marina Ops
              </h1>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '1rem' }}>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link href="/customers">Customers</Link>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link href="/vessels">Vessels</Link>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link href="/estimates">Estimates</Link>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link href="/work-orders">Work Orders</Link>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link href="/invoices">Invoices</Link>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link href="/settings">Settings</Link>
                </li>
              </ul>
            </nav>
            <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>{children}</main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}