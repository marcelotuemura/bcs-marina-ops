import Link from 'next/link'
export default function SuccessPage(){return <main className="success-page"><div className="card success-card"><p className="eyebrow">Payment received</p><h1>Success</h1><p>Your payment or checkout flow completed successfully.</p><Link className="primary-button" href="/dashboard">Return to dashboard</Link></div></main>}
