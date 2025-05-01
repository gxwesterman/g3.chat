import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { id } from '@instantdb/react';
import { setSession } from '@/app/actions/setSession';
 
export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  if (!session) {
    const response = NextResponse.next();
    response.cookies.set('session', id());
    await setSession();
    return NextResponse.redirect(new URL('/chat/welcome', request.url));
  } else {
    const newURL = new URL('', request.url);
    if (newURL.pathname == '/') {
      return NextResponse.redirect(new URL('/chat', request.url));
    }
  }
}

export const config = {
  matcher: ['/', '/chat/:path*']
}