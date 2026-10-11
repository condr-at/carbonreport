import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { verifyAccessToken } from '@/lib/auth/jwt'

const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/session',
])

const PUBLIC_API_PREFIXES = ['/api/auth']
const PUBLIC_FILE = /\.(.*)$/

function isPublicPage(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) {
    return true
  }

  for (const path of PUBLIC_PATHS) {
    if (path !== '/' && pathname.startsWith(`${path}/`)) {
      return true
    }
  }

  return false
}

function unauthorizedApiResponse() {
  return NextResponse.json(
    {
      error: 'User is not authenticated',
      code: 'UNAUTHORIZED',
    },
    { status: 401 },
  )
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = request.cookies.get(AUTH_CONFIG.refreshTokenCookie)?.value ? '/session' : '/login'
  url.search = ''
  url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Never let client-supplied identity headers reach a public auth handler.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-user-id')
  requestHeaders.delete('x-user-email')
  requestHeaders.delete('x-email-verified')
  const next = () => NextResponse.next({ request: { headers: requestHeaders } })

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/static')
  ) {
    return next()
  }

  const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  const accessToken = request.cookies.get(AUTH_CONFIG.accessTokenCookie)?.value

  if (!accessToken) {
    if (isPublicApi || isPublicPage(pathname)) {
      return next()
    }

    if (pathname.startsWith('/api/')) {
      return unauthorizedApiResponse()
    }

    return redirectToLogin(request)
  }

  try {
    const payload = await verifyAccessToken(accessToken)
    requestHeaders.set('x-user-id', payload.sub)
    if (payload.email) {
      requestHeaders.set('x-user-email', payload.email)
    }
    requestHeaders.set('x-email-verified', payload.email_verified ? 'true' : 'false')

    // A signed token can still be revoked by a password change. The login page
    // must remain reachable; only server auth can validate the database context.
    return next()
  } catch {
    if (isPublicApi || isPublicPage(pathname)) {
      return next()
    }

    if (pathname.startsWith('/api/')) {
      return unauthorizedApiResponse()
    }

    return redirectToLogin(request)
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
