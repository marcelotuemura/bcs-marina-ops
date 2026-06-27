import SignOutButton from '@/components/sign-out-button';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function SettingsPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="container">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Settings</h1>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Profile</h2>
        <p>Email: {user?.email}</p>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Sign out</h2>
        <SignOutButton />
      </div>
    </div>
  );
}