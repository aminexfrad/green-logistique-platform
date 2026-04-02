import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/auth/login', '/auth/register', '/auth/reset-password', '/auth/mfa-setup', '/favicon.ico']
const STATIC_FILE_PATTERNS = ['/._next', '/_next', '/static', '/images', '/assets']

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) {
    return true
  }

  return STATIC_FILE_PATTERNS.some((pattern) => pathname.startsWith(pattern))
}

function roleToDashboardPath(role: string | undefined) {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'shipper':
    case 'expéditeur':
      return '/dashboard/shipper'
    case 'carrier':
    case 'transporteur':
      return '/dashboard/carrier'
    case 'client':
      return '/dashboard/client/track'
    default:
      return '/dashboard/client/track'
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value
  const role = request.cookies.get('userRole')?.value

  if (isPublicPath(pathname)) {
    if (token && pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL(roleToDashboardPath(role), request.url))
    }

    if (pathname === '/' && token) {
      return NextResponse.redirect(new URL(roleToDashboardPath(role), request.url))
    }

    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings', '/auth/:path*'],
}
