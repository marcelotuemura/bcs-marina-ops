import type { SupabaseClient } from '@supabase/supabase-js';

export async function getActiveOrganizationId(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error(userError?.message || 'You must be signed in.');
  }

  const { data: membership, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  if (!membership?.organization_id) {
    throw new Error('No company membership found for this user. Add this user to organization_members in Supabase first.');
  }

  return { organizationId: membership.organization_id as string, userId: user.id };
}

export function parseCurrencyInput(value: string, fieldName = 'Total') {
  const normalized = value.trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a valid positive number.`);
  }
  return parsed;
}
