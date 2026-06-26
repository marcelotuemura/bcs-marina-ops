'use client'

import { useState } from 'react'

type Field = {
  label: string
  placeholder: string
  type?: string
  name: string
}

const fields: Field[] = [
  { label: 'Customer name', name: 'customerName', placeholder: 'John Smith' },
  { label: 'Customer email', name: 'customerEmail', placeholder: 'customer@email.com', type: 'email' },
  { label: 'Vessel / project', name: 'vessel', placeholder: 'Sea Ray 320 / Gelcoat repair' },
  { label: 'Invoice total', name: 'total', placeholder: '1250.00', type: 'number' },
  { label: 'Due date', name: 'dueDate', placeholder: '', type: 'date' },
  { label: 'Status', name: 'status', placeholder: 'Draft' }
]

export default function InvoiceForm({ roleLabel = 'Team member' }: { roleLabel?: string }) {
  const [message, setMessage] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Invoice draft prepared. Connect this form to the Supabase invoices table after applying the v1.2 migration.')
  }

  return (
    <form className="work-order-form" onSubmit={handleSubmit}>
      <div className="notice-card">
        Access rule: created invoices belong to the creator. General Managers, Admins, and Owners can see all company invoices.
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
          {fields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              <input className="input" name={field.name} type={field.type ?? 'text'} placeholder={field.placeholder} />
            </label>
          ))}
        </div>
        <label className="stacked-field">
          <span>Line items / notes</span>
          <textarea className="input textarea" name="notes" placeholder="Labor, materials, taxes, customer approval notes..." />
        </label>
        <div className="estimate-total">
          <span>Visibility</span>
          <strong>Creator + Managers</strong>
        </div>
      </div>
      {message ? <div className="notice-card">{message}</div> : null}
      <div className="form-actions">
        <button className="secondary-button" type="button" onClick={() => history.back()}>Cancel</button>
        <button className="primary-button" type="submit">Create Invoice Draft</button>
      </div>
    </form>
  )
}
