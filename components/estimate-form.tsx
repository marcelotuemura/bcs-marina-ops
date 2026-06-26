'use client'

import { useActionState } from 'react'
import { createEstimateAction } from '@/app/actions/billing'

const initialState = { ok: false, message: '' }

export default function EstimateForm({ roleLabel = 'Team member' }: { roleLabel?: string }) {
  const [state, formAction, pending] = useActionState(createEstimateAction, initialState)

  return (
    <form className="work-order-form" action={formAction}>
      <div className="notice-card">
        Access rule: estimates follow the same privacy model as invoices. Creators see their own records; General Managers, Admins, and Owners see all records.
      </div>
      <div className="card form-section">
        <div className="section-heading">
          <div>
            <h2>New Estimate</h2>
            <p>Prepare an estimate that can later become a work order or invoice.</p>
          </div>
          <span className="status-pill">{roleLabel}</span>
        </div>
        <div className="form-grid two-cols">
          <label>
            <span>Customer name</span>
            <input className="input" name="customerName" placeholder="John Smith" required />
          </label>
          <label>
            <span>Vessel / project</span>
            <input className="input" name="vesselName" placeholder="Sea Ray 320 / Gelcoat repair" />
          </label>
          <label>
            <span>Scope</span>
            <input className="input" name="scope" placeholder="Engine service + filters" required />
          </label>
          <label>
            <span>Estimate total</span>
            <input className="input" name="total" type="number" min="0" step="0.01" placeholder="850.00" required />
          </label>
          <label>
            <span>Status</span>
            <select className="input" name="status" defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </label>
          <label>
            <span>Visibility</span>
            <input className="input" value="Creator + Managers" disabled />
          </label>
        </div>
        <label className="stacked-field">
          <span>Estimate notes</span>
          <textarea className="input textarea" name="notes" placeholder="Labor assumptions, materials, approval notes..." />
        </label>
      </div>
      {state.message ? <div className={`notice-card ${state.ok ? 'success-card' : 'error-card'}`}>{state.message}</div> : null}
      <div className="form-actions">
        <button className="secondary-button" type="button" onClick={() => history.back()}>Cancel</button>
        <button className="primary-button" type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Estimate'}</button>
      </div>
    </form>
  )
}
