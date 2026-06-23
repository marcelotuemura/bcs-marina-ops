# BCS Marina Ops Backend Templates

## 1. Supabase RLS helper functions
```sql
create or replace function public.current_app_role()
returns app_role
language sql
stable
as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function public.is_manager()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'manager'
  )
$$;
```

## 2. RLS policies
```sql
alter table customers enable row level security;
alter table projects enable row level security;
alter table estimates enable row level security;
alter table estimate_lines enable row level security;
alter table invoice_lines enable row level security;
alter table time_logs enable row level security;
alter table supplies_catalog enable row level security;
alter table supply_usage enable row level security;
alter table project_photos enable row level security;

create policy "managers full customers" on customers
for all using (public.is_manager()) with check (public.is_manager());

create policy "staff view customers" on customers
for select using (auth.role() = 'authenticated');

create policy "projects visible to authenticated users" on projects
for select using (auth.role() = 'authenticated');

create policy "manager insert projects" on projects
for insert with check (public.is_manager());

create policy "manager update projects" on projects
for update using (public.is_manager());

create policy "estimator creates estimates" on estimates
for insert with check (public.current_app_role() in ('manager','estimator_hours'));

create policy "staff view estimates" on estimates
for select using (auth.role() = 'authenticated');

create policy "manager and estimator update estimates" on estimates
for update using (public.current_app_role() in ('manager','estimator_hours'));

create policy "staff view estimate lines" on estimate_lines
for select using (auth.role() = 'authenticated');

create policy "manager estimator insert estimate lines" on estimate_lines
for insert with check (public.current_app_role() in ('manager','estimator_hours'));

create policy "manager estimator update estimate lines" on estimate_lines
for update using (public.current_app_role() in ('manager','estimator_hours'));

create policy "invoice own or manager" on invoices
for select using (created_by = auth.uid() or public.is_manager());

create policy "invoice user create invoice" on invoices
for insert with check (public.current_app_role() in ('manager','invoice_user'));

create policy "invoice update own or manager" on invoices
for update using (created_by = auth.uid() or public.is_manager());

create policy "invoice lines visible through invoice owner" on invoice_lines
for select using (
  exists (
    select 1 from invoices i where i.id = invoice_id and (i.created_by = auth.uid() or public.is_manager())
  )
);

create policy "invoice user create lines" on invoice_lines
for insert with check (public.current_app_role() in ('manager','invoice_user'));

create policy "technician own logs or manager" on time_logs
for select using (technician_id = auth.uid() or public.is_manager());

create policy "technician insert logs" on time_logs
for insert with check (public.current_app_role() in ('manager','technician'));

create policy "technician own supply usage or manager" on supply_usage
for select using (technician_id = auth.uid() or public.is_manager());

create policy "technician insert supply usage" on supply_usage
for insert with check (public.current_app_role() in ('manager','technician'));

create policy "staff view photos" on project_photos
for select using (auth.role() = 'authenticated');

create policy "technician upload photos" on project_photos
for insert with check (public.current_app_role() in ('manager','technician'));
```

## 3. Server auth helper
```ts
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value; },
        set() {},
        remove() {}
      }
    }
  );
}
```

## 4. Role guard example
```ts
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function requireRole(allowedRoles: string[]) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role)) redirect('/');
  return { user, profile };
}
```

## 5. Estimate to invoice conversion
```ts
export async function createInvoiceFromEstimate(estimateId: string, userId: string) {
  const supabase = createSupabaseServerClient();
  const { data: estimate } = await supabase.from('estimates').select('id, project_id').eq('id', estimateId).single();
  const { data: lines } = await supabase.from('estimate_lines').select('*').eq('estimate_id', estimateId).in('status', ['accepted','partial']);
  const { data: invoiceNumber } = await supabase.rpc('next_invoice_number');

  const subtotal = (lines || []).reduce((sum, line) => sum + Number(line.estimated_hours) * Number(line.estimated_rate), 0);

  const { data: invoice } = await supabase.from('invoices').insert({
    invoice_number: invoiceNumber,
    project_id: estimate?.project_id,
    source_estimate_id: estimateId,
    created_by: userId,
    subtotal,
    total: subtotal
  }).select().single();

  if (invoice && lines?.length) {
    await supabase.from('invoice_lines').insert(lines.map((line) => ({
      invoice_id: invoice.id,
      description: line.description,
      rate_type: line.rate_type,
      hours: line.estimated_hours,
      rate: line.estimated_rate
    })));
  }

  return invoice;
}
```

## 6. Photo upload action
```ts
export async function uploadProjectPhoto(file: File, projectId: string, note: string, taskLabel: string) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const filePath = `${projectId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('project-photos')
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { error: rowError } = await supabase.from('project_photos').insert({
    project_id: projectId,
    uploaded_by: user.id,
    note,
    task_label: taskLabel,
    file_path: filePath
  });

  if (rowError) throw rowError;
}
```

## 7. Stripe checkout route
```ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: body.title },
        unit_amount: Math.round(body.amount * 100)
      },
      quantity: 1
    }],
    success_url: body.successUrl,
    cancel_url: body.cancelUrl,
    metadata: {
      invoice_id: body.invoiceId,
      project_id: body.projectId
    }
  });

  return NextResponse.json({ url: session.url });
}
```

## 8. Stripe webhook route
```ts
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoice_id;
    if (invoiceId) {
      await supabase.from('invoices').update({ payment_status: 'paid' }).eq('id', invoiceId);
    }
  }

  return NextResponse.json({ received: true });
}
```

## 9. Gmail / email sending recommendation
Use Resend first for faster delivery setup, then optionally replace with Gmail API if you want direct Gmail sending from your company account.

