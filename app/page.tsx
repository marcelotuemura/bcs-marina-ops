import { redirect } from 'next/navigation';

export default function Home() {
  // Immediately redirect to login; this is also enforced by middleware
  redirect('/login');
}