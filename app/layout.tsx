import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'BCS Marina Ops | Premium Marina SaaS',
  description: 'Apple-inspired marina operations SaaS for work orders, slips, billing, inventory, fuel, customer portals, and analytics.'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06111f'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
