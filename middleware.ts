import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function middleware(req: any) {
  const res = NextResponse.next();
  const supabase = supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuth = !!session;
  const isLogin = req.nextUrl.pathname.startsWith('/login');

  // If not logged in → redirect to login
  if (!isAuth && !isLogin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If logged in → block access to login page
  if (isAuth && isLogin) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|public|api).*)',
  ],
};
