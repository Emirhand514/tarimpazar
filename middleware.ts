import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Locale cookie'sini oku ve HTML lang attribute'unu ayarla
  const locale = request.cookies.get('locale')?.value || 'tr'
  
  const response = NextResponse.next()
  
  // Response header'a locale ekle (isteğe bağlı)
  response.headers.set('x-locale', locale)
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
