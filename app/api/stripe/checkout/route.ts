import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY in .env.local' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: { currency: 'usd', product_data: { name: 'Marina Service Deposit' }, unit_amount: 5000 },
      quantity: 1
    }],
    success_url: `${siteUrl}/success`,
    cancel_url: `${siteUrl}/invoices`
  })

  return NextResponse.json({ url: session.url })
}
