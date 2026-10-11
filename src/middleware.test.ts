import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import { middleware } from './middleware'
import { createAccessToken } from '@/lib/auth/jwt'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { SignJWT } from 'jose'

function buildRequest(pathname: string, cookieHeader?: string) {
  const headers = new Headers()
  if (cookieHeader) {
    headers.set('cookie', cookieHeader)
  }

  return new NextRequest(`http://localhost${pathname}`, {
    headers,
  })
}

test.beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
})

test.afterEach(() => {
  delete process.env.JWT_SECRET
})

test('allows public pages without auth', async () => {
  const response = await middleware(buildRequest('/login'))
  assert.equal(response.status, 200)
})

test('redirects protected pages to login when no token is present', async () => {
  const response = await middleware(buildRequest('/dashboard'))

  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), 'http://localhost/login?redirect=%2Fdashboard')
})

test('returns 401 for protected API routes without auth', async () => {
  const response = await middleware(buildRequest('/api/projects'))
  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 401)
  assert.equal(payload.code, 'UNAUTHORIZED')
})

test('passes authenticated requests through and injects auth headers', async () => {
  const accessToken = await createAccessToken({
    sub: 'user-1',
    email: 'user@example.com',
    emailVerified: true,
    sessionId: 'session-1',
    sessionContext: 'signed-context',
  })

  const response = await middleware(
    buildRequest('/dashboard', `${AUTH_CONFIG.accessTokenCookie}=${accessToken}`),
  )

  assert.equal(response.status, 200)
  const userIdHeader = response.headers.get('x-middleware-request-x-user-id')
  const emailHeader = response.headers.get('x-middleware-request-x-user-email')

  assert.equal(userIdHeader, 'user-1')
  assert.equal(emailHeader, 'user@example.com')
})

test('keeps login reachable because the signed session may have been revoked', async () => {
  const accessToken = await createAccessToken({
    sub: 'user-2',
    email: 'owner@example.com',
    emailVerified: true,
    sessionId: 'session-2',
    sessionContext: 'signed-context',
  })

  const response = await middleware(
    buildRequest('/login', `${AUTH_CONFIG.accessTokenCookie}=${accessToken}`),
  )

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('location'), null)
})

test('removes forged identity headers on public auth and page requests', async () => {
  for (const path of ['/api/auth/resend-verification', '/verify-email', '/favicon.ico']) {
    const request = new NextRequest(`http://localhost${path}`, { headers: {
      'x-user-id': 'victim', 'x-user-email': 'victim@example.test', 'x-email-verified': 'true',
    } })
    const response = await middleware(request)
    assert.equal(response.status, 200)
    for (const header of ['x-user-id', 'x-user-email', 'x-email-verified']) {
      assert.equal(response.headers.get(`x-middleware-request-${header}`), null)
    }
  }
})

test('does not consider auth-prefixed unrelated API routes public', async () => {
  assert.equal((await middleware(buildRequest('/api/authentication/private'))).status, 401)
})

test('login redirect preserves target query only inside redirect parameter', async () => {
  const response = await middleware(buildRequest('/dashboard?tab=reports'))
  assert.equal(response.headers.get('location'), 'http://localhost/login?redirect=%2Fdashboard%3Ftab%3Dreports')
})

test('missing or expired access recovers protected pages through the refresh screen', async () => {
  const expired = await new SignJWT({ purpose: 'access', ctx: 'signed-context' })
    .setProtectedHeader({ alg: 'HS256' }).setSubject('user-1').setIssuer(AUTH_CONFIG.issuer)
    .setAudience('carbon-report-users').setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!))
  for (const token of [undefined, 'malformed', expired]) {
    const cookie = `${AUTH_CONFIG.refreshTokenCookie}=refresh-token` +
      (token ? `; ${AUTH_CONFIG.accessTokenCookie}=${token}` : '')
    const response = await middleware(buildRequest('/dashboard?tab=reports', cookie))
    assert.equal(response.status, 307)
    assert.equal(response.headers.get('location'), 'http://localhost/session?redirect=%2Fdashboard%3Ftab%3Dreports')
    assert.equal((await middleware(buildRequest('/api/projects', cookie))).status, 401)
    assert.equal((await middleware(buildRequest('/session?redirect=%2Fdashboard', cookie))).status, 200)
    assert.equal((await middleware(buildRequest('/api/auth/refresh', cookie))).status, 200)
  }
  const response = await middleware(buildRequest('/dashboard', `${AUTH_CONFIG.accessTokenCookie}=${expired}`))
  assert.equal(response.headers.get('location'), 'http://localhost/login?redirect=%2Fdashboard')
})
