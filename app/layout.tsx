import './globals.css';
import React, { ReactNode } from 'react';

export const metadata = {
  title: 'BCS Marina Ops',
  description: 'Simple operations app for mobile marine service companies',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
