import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Marina Service Deposit'
          },
          unit_amount: 5000
        },
        quantity: 1
      }
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/invoices`
  })

  return NextResponse.json({ url: session.url })
}
