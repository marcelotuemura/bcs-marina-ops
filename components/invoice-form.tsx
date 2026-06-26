'use client'

import { useActionState } from 'react'
import { createInvoiceAction } from '@/app/actions/billing'

const initialState = { ok: false, message: '' }

export default function InvoiceForm({ roleLabel = 'Team member' }: { roleLabel?: string }) {
  const [state, formAction, pending] = useActionState(createInvoiceAction, initialState)

  return (
    <form className="work-order-form" action={formAction}>
      <div className="notice-card">
        Access rule: regular users can see only invoices they created. General Managers, Admins, and Owners can see every invoice in the company workspace.
      </div>
      <div className="card form-section">
        <div className="section-heading">
          <div>
            <h2>New Invoice</h2>
            <p>Create a private invoice draft under your user account.</p>
          </div>
          <span className="status-pill">{roleLabel}</span>
        </div>
        <div className="form-grid two-cols">
          <label>
            <span>Customer name</span>
            <input className="input" name="customerName" placeholder="John Smith" required />
          </label>
          <label>
            <span>Customer email</span>
            <input className="input" name="customerEmail" type="email" placeholder="customer@email.com" />
          </label>
          <label>
            <span>Invoice total</span>
            <input className="input" name="total" type="number" min="0" step="0.01" placeholder="1250.00" required />
          </label>
          <label>
            <span>Due date</span>
            <input className="input" name="dueDate" type="date" />
          </label>
          <label>
            <span>Status</span>
            <select className="input" name="status" defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </label>
          <label>
            <span>Visibility</span>
            <input className="input" value="Creator + Managers" disabled />
          </label>
        </div>
        <label className="stacked-field">
          <span>Line items / notes</span>
          <textarea className="input textarea" name="notes" placeholder="Labor, materials, taxes, approval notes..." />
        </label>
      </div>
      {state.message ? <div className={`notice-card ${state.ok ? 'success-card' : 'error-card'}`}>{state.message}</div> : null}
      <div className="form-actions">
        <button className="secondary-button" type="button" onClick={() => history.back()}>Cancel</button>
        <button className="primary-button" type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Invoice Draft'}</button>
      </div>
    </form>
  )
}
