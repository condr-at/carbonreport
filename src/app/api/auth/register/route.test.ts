import assert from 'node:assert/strict'
import test from 'node:test'
import prisma from '@/lib/db'
import { POST } from './route'
import { verifyAccessToken } from '@/lib/auth/jwt'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/auth/register', {
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

test('creates user, sends verification flow, and returns auth cookies', async (t) => {
  const createdUsers: any[] = []

  const originalFindUnique = prisma.user.findUnique
  const originalCreate = prisma.user.create

  ;(prisma.user as any).findUnique = async () => null
  ;(prisma.user as any).create = async ({ data }: any) => {
    const user = {
      id: 'user-created',
      email: data.email,
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash: data.passwordHash,
      emailVerified: false,
      deletedAt: null,
    }
    createdUsers.push(user)
    return user
  }

  t.after(() => {
    ;(prisma.user as any).findUnique = originalFindUnique
    ;(prisma.user as any).create = originalCreate
  })

  const response = await POST(
    buildRequest({
      name: 'Jane Example',
      email: 'JANE@EXAMPLE.COM',
      password: 'ValidPass1',
    }),
  )

  const payload = (await response.json()) as { user?: { email: string; name: string; email_verified: boolean } }

  assert.equal(response.status, 201)
  assert.equal(payload.user?.email, 'jane@example.com')
  assert.equal(payload.user?.name, 'Jane Example')
  assert.equal(payload.user?.email_verified, false)
  assert.equal(createdUsers.length, 1)
  assert.equal(createdUsers[0].firstName, 'Jane')
  assert.equal(createdUsers[0].lastName, 'Example')
  assert.notEqual(createdUsers[0].passwordHash, 'ValidPass1')

  const setCookie = response.headers.get('set-cookie')
  assert.ok(setCookie)
  assert.match(setCookie, /cr_access_token=/)
  assert.match(setCookie, /cr_refresh_token=/)

  const accessToken = setCookie.match(/cr_access_token=([^;]+)/)?.[1]
  assert.ok(accessToken)

  const claims = await verifyAccessToken(accessToken as string)
  assert.equal(claims.sub, 'user-created')
  assert.equal(claims.email, 'jane@example.com')
})

test('rejects duplicate email addresses', async (t) => {
  const originalFindUnique = prisma.user.findUnique
  ;(prisma.user as any).findUnique = async () => ({
    id: 'existing-user',
    email: 'jane@example.com',
    name: 'Existing User',
    emailVerified: true,
    deletedAt: null,
  })

  t.after(() => {
    ;(prisma.user as any).findUnique = originalFindUnique
  })

  const response = await POST(
    buildRequest({
      name: 'Jane Example',
      email: 'jane@example.com',
      password: 'ValidPass1',
    }),
  )

  const payload = (await response.json()) as { code?: string }
  assert.equal(response.status, 409)
  assert.equal(payload.code, 'CONFLICT')
})

test('rejects passwords that fail policy', async (t) => {
  const originalFindUnique = prisma.user.findUnique
  ;(prisma.user as any).findUnique = async () => null

  t.after(() => {
    ;(prisma.user as any).findUnique = originalFindUnique
  })

  const response = await POST(
    buildRequest({
      name: 'Jane Example',
      email: 'jane@example.com',
      password: 'weakpass',
    }),
  )

  const payload = (await response.json()) as { code?: string; details?: { requirements?: string } }
  assert.equal(response.status, 400)
  assert.equal(payload.code, 'VALIDATION_ERROR')
  assert.ok(payload.details?.requirements)
})
