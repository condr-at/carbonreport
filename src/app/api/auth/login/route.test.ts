import assert from 'node:assert/strict'
import test from 'node:test'
import prisma from '@/lib/db'
import { POST } from './route'
import { hashPassword } from '@/lib/auth/password'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

test.beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
})

test.afterEach(() => {
  delete process.env.JWT_SECRET
})

test('returns auth cookies for valid credentials', async (t) => {
  const password = 'ValidPass1'
  const passwordHash = await hashPassword(password)

  const originalFindFirst = prisma.user.findFirst
  ;(prisma.user as any).findFirst = async () => ({
    id: 'user-1',
    email: 'login@example.com',
    name: 'Login User',
    emailVerified: true,
    passwordHash,
    deletedAt: null,
  })
  t.after(() => {
    ;(prisma.user as any).findFirst = originalFindFirst
  })

  const request = buildRequest({ email: 'login@example.com', password })
  const response = await POST(request)
  const payload = (await response.json()) as { user?: { email: string } }

  assert.equal(response.status, 200)
  assert.equal(payload.user?.email, 'login@example.com')

  const setCookie = response.headers.get('set-cookie')
  assert.ok(setCookie)
  assert.match(setCookie, /cr_access_token=/)
  assert.match(setCookie, /cr_refresh_token=/)
})

test('rejects invalid credentials', async (t) => {
  const password = 'ValidPass1'
  const passwordHash = await hashPassword(password)

  const originalFindFirst = prisma.user.findFirst
  ;(prisma.user as any).findFirst = async () => ({
    id: 'user-1',
    email: 'invalid@example.com',
    name: 'Invalid User',
    emailVerified: true,
    passwordHash,
    deletedAt: null,
  })
  t.after(() => {
    ;(prisma.user as any).findFirst = originalFindFirst
  })

  const request = buildRequest({ email: 'invalid@example.com', password: 'WrongPass1' })
  const response = await POST(request)
  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 401)
  assert.equal(payload.code, 'UNAUTHORIZED')
})

test('rejects missing users', async (t) => {
  const originalFindFirst = prisma.user.findFirst
  ;(prisma.user as any).findFirst = async () => null
  t.after(() => {
    ;(prisma.user as any).findFirst = originalFindFirst
  })

  const request = buildRequest({ email: 'missing@example.com', password: 'ValidPass1' })
  const response = await POST(request)
  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 401)
  assert.equal(payload.code, 'UNAUTHORIZED')
})
