import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware'
import { createAccessToken } from '@/lib/auth/jwt'
import { AUTH_CONFIG } from '@/lib/auth/config'

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

test('redirects authenticated users away from login page', async () => {
  const accessToken = await createAccessToken({
    sub: 'user-2',
    email: 'owner@example.com',
    emailVerified: true,
    sessionId: 'session-2',
  })

  const response = await middleware(
    buildRequest('/login', `${AUTH_CONFIG.accessTokenCookie}=${accessToken}`),
  )

  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), 'http://localhost/dashboard')
})
