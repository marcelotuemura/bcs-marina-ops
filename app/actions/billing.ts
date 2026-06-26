'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

type SaveResult = {
  ok: boolean
  message: string
}

const MANAGER_ROLES = ['owner', 'admin', 'general_manager']

function toCents(value: FormDataEntryValue | null) {
  const numberValue = Number(String(value ?? '0').replace(/[^0-9.\-]/g, ''))
  if (!Number.isFinite(numberValue)) return 0
  return Math.round(numberValue * 100)
}

function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? '').trim()
}

async function getOrCreateWorkspace() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { supabase, user: null, membership: null, error: 'You must be logged in.' }
  }

  const { data: existingMembership, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (membershipError) {
    return { supabase, user, membership: null, error: membershipError.message }
  }

  if (existingMembership?.organization_id) {
    return { supabase, user, membership: existingMembership, error: null }
  }

  const fallbackName = user.email?.split('@')[0] || 'BCS Marina Ops'
  const slug = `workspace-${user.id.slice(0, 8)}`
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: fallbackName, slug, plan: 'enterprise' })
    .select('id')
    .single()

  if (orgError || !organization) {
    return { supabase, user, membership: null, error: orgError?.message ?? 'Could not create workspace.' }
  }

  const { data: newMembership, error: insertMembershipError } = await supabase
    .from('organization_members')
    .insert({ organization_id: organization.id, user_id: user.id, role: 'owner' })
    .select('organization_id, role')
    .single()

  if (insertMembershipError || !newMembership) {
    return { supabase, user, membership: null, error: insertMembershipError?.message ?? 'Could not create owner membership.' }
  }

  return { supabase, user, membership: newMembership, error: null }
}

export async function createInvoiceAction(_previousState: SaveResult, formData: FormData): Promise<SaveResult> {
  const { supabase, user, membership, error } = await getOrCreateWorkspace()
  if (error || !user || !membership) return { ok: false, message: error ?? 'Login required.' }

  const customerName = cleanText(formData.get('customerName'))
  const customerEmail = cleanText(formData.get('customerEmail'))
  const dueDate = cleanText(formData.get('dueDate'))
  const status = cleanText(formData.get('status')) || 'draft'
  const notes = cleanText(formData.get('notes'))
  const totalCents = toCents(formData.get('total'))

  if (!customerName) return { ok: false, message: 'Customer name is required.' }
  if (totalCents <= 0) return { ok: false, message: 'Invoice total must be greater than zero.' }

  const { error: insertError } = await supabase.from('invoices').insert({
    organization_id: membership.organization_id,
    created_by: user.id,
    customer_name: customerName,
    customer_email: customerEmail || null,
    status,
    due_date: dueDate || null,
    notes: notes || null,
    total_cents: totalCents
  })

  if (insertError) return { ok: false, message: insertError.message }

  revalidatePath('/invoices')
  return { ok: true, message: 'Invoice created successfully. It is visible to you and manager-level users only.' }
}

export async function createEstimateAction(_previousState: SaveResult, formData: FormData): Promise<SaveResult> {
  const { supabase, user, membership, error } = await getOrCreateWorkspace()
  if (error || !user || !membership) return { ok: false, message: error ?? 'Login required.' }

  const customerName = cleanText(formData.get('customerName'))
  const vesselName = cleanText(formData.get('vesselName'))
  const scope = cleanText(formData.get('scope'))
  const status = cleanText(formData.get('status')) || 'draft'
  const notes = cleanText(formData.get('notes'))
  const totalCents = toCents(formData.get('total'))

  if (!customerName) return { ok: false, message: 'Customer name is required.' }
  if (!scope) return { ok: false, message: 'Estimate scope is required.' }
  if (totalCents <= 0) return { ok: false, message: 'Estimate total must be greater than zero.' }

  const { error: insertError } = await supabase.from('estimates').insert({
    organization_id: membership.organization_id,
    created_by: user.id,
    customer_name: customerName,
    vessel_name: vesselName || null,
    scope,
    status,
    notes: notes || null,
    total_cents: totalCents
  })

  if (insertError) return { ok: false, message: insertError.message }

  revalidatePath('/estimates')
  return { ok: true, message: 'Estimate created successfully. It is visible to you and manager-level users only.' }
}

export async function getRoleLabel() {
  const { membership } = await getOrCreateWorkspace()
  if (!membership?.role) return 'Team member'
  return MANAGER_ROLES.includes(membership.role) ? 'Manager access' : `${membership.role} access`
}

export async function goToInvoices() {
  redirect('/invoices')
}
