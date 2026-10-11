import assert from 'node:assert/strict'
import test from 'node:test'
import prisma from '@/lib/db'
import { GET } from './route'
import { buildEmailVerificationToken } from '@/lib/auth/service'
import { hashPassword } from '@/lib/auth/password'

test.beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
})

test.afterEach(() => {
  delete process.env.JWT_SECRET
})

test('verifies user and returns JSON success when token is valid', async (t) => {
  const user = {
    id: 'user-verify',
    email: 'verify@example.com',
    name: 'Verify User',
    passwordHash: await hashPassword('ValidPass1'),
    emailVerified: false,
    deletedAt: null,
  }

  const token = await buildEmailVerificationToken(user)

  const originalFindUnique = prisma.user.findUnique
  const originalUpdate = prisma.user.update
  let updateCalled = false

  ;(prisma.user as any).findUnique = async () => user
  ;(prisma.user as any).update = async () => {
    updateCalled = true
    return { ...user, emailVerified: true }
  }

  t.after(() => {
    ;(prisma.user as any).findUnique = originalFindUnique
    ;(prisma.user as any).update = originalUpdate
  })

  const request = new Request(`http://localhost/api/auth/verify-email/${token}`, {
    headers: {
      accept: 'application/json',
    },
  })

  const response = await GET(request, { params: Promise.resolve({ token }) })
  const payload = (await response.json()) as { status?: string }

  assert.equal(response.status, 200)
  assert.equal(payload.status, 'verified')
  assert.equal(updateCalled, true)
})

test('returns JSON error when token is invalid', async () => {
  const request = new Request('http://localhost/api/auth/verify-email/bad-token', {
    headers: {
      accept: 'application/json',
    },
  })

  const response = await GET(request, { params: Promise.resolve({ token: 'bad-token' }) })
  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 500)
  assert.equal(payload.code, 'INTERNAL_ERROR')
})

test('redirects to verify-email page when HTML flow is used', async (t) => {
  const user = {
    id: 'user-redirect',
    email: 'redirect@example.com',
    name: 'Redirect User',
    passwordHash: await hashPassword('ValidPass1'),
    emailVerified: false,
    deletedAt: null,
  }

  const token = await buildEmailVerificationToken(user)

  const originalFindUnique = prisma.user.findUnique
  const originalUpdate = prisma.user.update

  ;(prisma.user as any).findUnique = async () => user
  ;(prisma.user as any).update = async () => ({ ...user, emailVerified: true })

  t.after(() => {
    ;(prisma.user as any).findUnique = originalFindUnique
    ;(prisma.user as any).update = originalUpdate
  })

  const request = new Request(`http://localhost/api/auth/verify-email/${token}`)
  const response = await GET(request, { params: Promise.resolve({ token }) })

  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), 'http://localhost/verify-email?status=verified')
})
