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
  url.pathname = '/login'
  url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next()
  }

  const isPublicApi = PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const accessToken = request.cookies.get(AUTH_CONFIG.accessTokenCookie)?.value

  if (!accessToken) {
    if (isPublicApi || isPublicPage(pathname)) {
      return NextResponse.next()
    }

    if (pathname.startsWith('/api/')) {
      return unauthorizedApiResponse()
    }

    return redirectToLogin(request)
  }

  try {
    const payload = await verifyAccessToken(accessToken)
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.sub)
    if (payload.email) {
      requestHeaders.set('x-user-email', payload.email)
    }
    requestHeaders.set('x-email-verified', payload.email_verified ? 'true' : 'false')

    if (pathname === '/login' || pathname === '/register') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch {
    if (isPublicApi || isPublicPage(pathname)) {
      return NextResponse.next()
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
