import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

/**
 * This middleware protects all pages except the login page.  
 * If the user has no active session it redirects them to `/login`.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const pathname = req.nextUrl.pathname;
  // Allow the login page regardless of auth
  if (pathname === '/login' || pathname.startsWith('/api')) {
    return res;
  }
  // Redirect root path to login unless logged in
  if (pathname === '/' && !session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    // add redirect param so user is returned after login
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return res;
}

export const config = {
  matcher: ['/(.*)'],
};