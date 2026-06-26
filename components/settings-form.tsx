'use client'

import { useState } from 'react'
import { workspace } from '@/lib/demo-data'

export default function SettingsForm() {
  const [message, setMessage] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('Settings saved for this prototype. Connect tenant settings table next for permanent storage.')
  }

  return (
    <form className="form" onSubmit={submit}>
      <input className="input" defaultValue={workspace.name} aria-label="Company name" />
      <input className="input" defaultValue={workspace.location} aria-label="Primary location" />
      <input className="input" defaultValue={workspace.domain} aria-label="Domain" />
      <button className="primary-button" type="submit">Save settings</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  )
}
