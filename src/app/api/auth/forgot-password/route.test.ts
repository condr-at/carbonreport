import assert from 'node:assert/strict'
import test from 'node:test'
import prisma from '@/lib/db'
import { POST } from './route'
import { hashPassword } from '@/lib/auth/password'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

test.beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  process.env.APP_URL = 'http://localhost:3000'
})

test.afterEach(() => {
  delete process.env.JWT_SECRET
  delete process.env.APP_URL
})

test('returns generic success when user exists', async (t) => {
  const originalFindFirst = prisma.user.findFirst
  ;(prisma.user as any).findFirst = async () => ({
    id: 'user-1',
    email: 'user@example.com',
    name: 'Reset User',
    passwordHash: await hashPassword('ValidPass1'),
    deletedAt: null,
  })

  t.after(() => {
    ;(prisma.user as any).findFirst = originalFindFirst
  })

  const response = await POST(buildRequest({ email: 'user@example.com' }))
  const payload = (await response.json()) as { message?: string }

  assert.equal(response.status, 200)
  assert.match(payload.message ?? '', /reset link shortly/i)
})

test('returns same generic success when user does not exist', async (t) => {
  const originalFindFirst = prisma.user.findFirst
  ;(prisma.user as any).findFirst = async () => null

  t.after(() => {
    ;(prisma.user as any).findFirst = originalFindFirst
  })

  const response = await POST(buildRequest({ email: 'missing@example.com' }))
  const payload = (await response.json()) as { message?: string }

  assert.equal(response.status, 200)
  assert.match(payload.message ?? '', /reset link shortly/i)
})

test('returns generic success for invalid payloads', async () => {
  const response = await POST(buildRequest({ email: 'not-an-email' }))
  const payload = (await response.json()) as { message?: string }

  assert.equal(response.status, 200)
  assert.match(payload.message ?? '', /reset link shortly/i)
})
