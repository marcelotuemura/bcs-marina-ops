'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

const serviceTypes = ['Engine service', 'Gelcoat repair', 'Bottom paint', 'Detailing', 'Electronics install', 'Hull cleaning']
const priorities = ['Low', 'Medium', 'High', 'Emergency']

function currencyToNumber(value: string) {
  return Number(value.replace(/[^0-9.]/g, '')) || 0
}

export default function WorkOrderForm() {
  const [customerName, setCustomerName] = useState('')
  const [contact, setContact] = useState('')
  const [vessel, setVessel] = useState('')
  const [hin, setHin] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [technician, setTechnician] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [scope, setScope] = useState('')
  const [laborHours, setLaborHours] = useState('')
  const [laborRate, setLaborRate] = useState('125')
  const [partsEstimate, setPartsEstimate] = useState('')
  const [approvalLimit, setApprovalLimit] = useState('')
  const [message, setMessage] = useState('')

  const estimatedTotal = useMemo(() => {
    const hours = Number(laborHours) || 0
    const rate = currencyToNumber(laborRate)
    const parts = currencyToNumber(partsEstimate)
    return hours * rate + parts
  }, [laborHours, laborRate, partsEstimate])

  function saveDraft() {
    setMessage('Draft saved locally for review. Database persistence is the next production step.')
  }

  function createWorkOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!customerName || !vessel || !serviceType || !scope) {
      setMessage('Please complete customer, vessel, service type, and scope of work before creating the work order.')
      return
    }

    setMessage(`Work order draft created for ${customerName} - ${vessel}. Connect the database next to store this permanently.`)
  }

  return (
    <form className="work-order-form" onSubmit={createWorkOrder}>
      {message && <div className="notice-card" role="status">{message}</div>}

      <section className="card form-section">
        <div className="section-heading">
          <h2>Customer & Vessel</h2>
          <span className="badge green">Step 1</span>
        </div>
        <div className="form-grid two-cols">
          <label>
            <span>Customer name</span>
            <input className="input" placeholder="John Smith" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </label>
          <label>
            <span>Phone / Email</span>
            <input className="input" placeholder="john@email.com" value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
          <label>
            <span>Vessel</span>
            <input className="input" placeholder="Sea Ray 310" value={vessel} onChange={(e) => setVessel(e.target.value)} required />
          </label>
          <label>
            <span>Hull ID / Registration</span>
            <input className="input" placeholder="HIN or registration number" value={hin} onChange={(e) => setHin(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="card form-section">
        <div className="section-heading">
          <h2>Service Details</h2>
          <span className="badge amber">Required</span>
        </div>
        <div className="form-grid two-cols">
          <label>
            <span>Service type</span>
            <select className="input" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
              <option value="" disabled>Select service</option>
              {serviceTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span>Priority</span>
            <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {priorities.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label>
            <span>Assigned technician</span>
            <input className="input" placeholder="Tom Anderson" value={technician} onChange={(e) => setTechnician(e.target.value)} />
          </label>
          <label>
            <span>Target date</span>
            <input className="input" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
          </label>
        </div>
        <label className="stacked-field">
          <span>Problem / scope of work</span>
          <textarea className="input textarea" placeholder="Describe the issue, requested service, damage location, customer notes, approval limits, and special instructions." value={scope} onChange={(e) => setScope(e.target.value)} required />
        </label>
      </section>

      <section className="page-grid two">
        <div className="card form-section">
          <div className="section-heading"><h2>Estimate</h2><span className="badge">Draft</span></div>
          <div className="form-grid two-cols">
            <label><span>Labor hours</span><input className="input" placeholder="6.5" value={laborHours} onChange={(e) => setLaborHours(e.target.value)} /></label>
            <label><span>Labor rate</span><input className="input" placeholder="$125/hr" value={laborRate} onChange={(e) => setLaborRate(e.target.value)} /></label>
            <label><span>Parts estimate</span><input className="input" placeholder="$480" value={partsEstimate} onChange={(e) => setPartsEstimate(e.target.value)} /></label>
            <label><span>Customer approval limit</span><input className="input" placeholder="$1,500" value={approvalLimit} onChange={(e) => setApprovalLimit(e.target.value)} /></label>
          </div>
          <div className="estimate-total"><span>Estimated total</span><strong>${estimatedTotal.toLocaleString()}</strong></div>
        </div>

        <div className="card form-section">
          <div className="section-heading"><h2>Workflow</h2><span className="badge green">Private</span></div>
          <div className="feature-list">
            <div className="feature-item"><div><strong>Photos & videos</strong><span>Upload damage photos and progress media.</span></div><span className="badge">Next</span></div>
            <div className="feature-item"><div><strong>Customer approval</strong><span>Send estimate approval before work starts.</span></div><span className="badge">Next</span></div>
            <div className="feature-item"><div><strong>Invoice handoff</strong><span>Convert completed service to invoice.</span></div><span className="badge">Next</span></div>
          </div>
        </div>
      </section>

      <section className="form-actions">
        <Link className="secondary-button" href="/work-orders">Cancel</Link>
        <button className="secondary-button" type="button" onClick={saveDraft}>Save draft</button>
        <button className="primary-button" type="submit">Create work order</button>
      </section>
    </form>
  )
}
