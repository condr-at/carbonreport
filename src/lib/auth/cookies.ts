import type { NextResponse } from 'next/server'
import { AUTH_CONFIG } from './config'

const baseCookieAttributes = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  domain: AUTH_CONFIG.cookieDomain ?? undefined,
}

export function setAuthCookies(response: NextResponse, tokens: {
  accessToken: string
  refreshToken: string
}) {
  const accessExpires = new Date(Date.now() + AUTH_CONFIG.accessTokenTtlMs)
  const refreshExpires = new Date(Date.now() + AUTH_CONFIG.refreshTokenTtlMs)

  response.cookies.set({
    name: AUTH_CONFIG.accessTokenCookie,
    value: tokens.accessToken,
    expires: accessExpires,
    ...baseCookieAttributes,
  })

  response.cookies.set({
    name: AUTH_CONFIG.refreshTokenCookie,
    value: tokens.refreshToken,
    expires: refreshExpires,
    ...baseCookieAttributes,
  })

  return response
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set({
    name: AUTH_CONFIG.accessTokenCookie,
    value: '',
    expires: new Date(0),
    ...baseCookieAttributes,
  })

  response.cookies.set({
    name: AUTH_CONFIG.refreshTokenCookie,
    value: '',
    expires: new Date(0),
    ...baseCookieAttributes,
  })

  return response
}
