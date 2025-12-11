import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_user_id')
  const { pathname } = request.nextUrl

  // 1. Kullanıcı giriş yapmışsa ve /auth sayfalarına gitmeye çalışıyorsa -> /dashboard'a yönlendir
  if (session && pathname.startsWith('/auth') && !pathname.startsWith('/auth/sign-out')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 2. Kullanıcı giriş YAPMAMIŞSA ve korumalı sayfalara (/dashboard) gitmeye çalışıyorsa -> /auth/sign-in'e yönlendir
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return NextResponse.next()
}

// Middleware'in çalışacağı yollar
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/auth/:path*'
  ],
}
