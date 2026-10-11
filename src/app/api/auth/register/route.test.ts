import assert from 'node:assert/strict'
import test from 'node:test'
import prisma from '@/lib/db'
import { POST } from './route'
import { verifyAccessToken } from '@/lib/auth/jwt'
import { Resend } from 'resend'

const originalEmailConfig = { key: process.env.RESEND_API_KEY, from: process.env.FROM_EMAIL }
const originalPost = Resend.prototype.post

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
  process.env.RESEND_API_KEY = 're_unit_test_not_a_real_key'
  process.env.FROM_EMAIL = 'test@example.invalid'
  ;(Resend.prototype as any).post = async () => ({ data: { id: 'email-accepted' }, error: null })
})

test.afterEach(() => {
  delete process.env.JWT_SECRET
  delete process.env.APP_URL
  if (originalEmailConfig.key === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = originalEmailConfig.key
  if (originalEmailConfig.from === undefined) delete process.env.FROM_EMAIL
  else process.env.FROM_EMAIL = originalEmailConfig.from
  Resend.prototype.post = originalPost
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

  const payload = (await response.json()) as { user?: { email: string; name: string; email_verified: boolean }; verification_email?: { status: string } }

  assert.equal(response.status, 201)
  assert.equal(payload.user?.email, 'jane@example.com')
  assert.equal(payload.user?.name, 'Jane Example')
  assert.equal(payload.user?.email_verified, false)
  assert.equal(payload.verification_email?.status, 'sent')
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

for (const failure of ['provider_error', 'transport_error', 'not_configured', 'missing_acceptance'] as const) {
  test(`keeps the created account and session without claiming sent on ${failure}`, async (t) => {
    let created = 0
    let sends = 0
    const originalFindUnique = prisma.user.findUnique
    const originalCreate = prisma.user.create
    ;(prisma.user as any).findUnique = async () => null
    ;(prisma.user as any).create = async ({ data }: any) => {
      created++
      return { ...data, id: 'registered-without-mail', emailVerified: false, deletedAt: null }
    }
    t.after(() => {
      ;(prisma.user as any).findUnique = originalFindUnique
      ;(prisma.user as any).create = originalCreate
    })
    ;(Resend.prototype as any).post = async () => {
      sends++
      if (failure === 'transport_error') throw new Error('PRIVATE_TRANSPORT_DETAIL')
      return { data: null, error: failure === 'missing_acceptance' ? null : { name: 'validation_error', message: 'PRIVATE_PROVIDER_DETAIL' } }
    }
    if (failure === 'not_configured') delete process.env.RESEND_API_KEY

    const response = await POST(buildRequest({ name: 'New User', email: 'new@example.com', password: 'ValidPass1' }))
    const payload = await response.json()
    assert.equal(response.status, 201)
    assert.equal(created, 1)
    assert.equal(payload.user.email_verified, false)
    assert.deepEqual(payload.verification_email, { status: 'not_sent' })
    assert.doesNotMatch(JSON.stringify(payload), /PRIVATE_|provider|configuration|api.?key/i)
    assert.equal(sends, failure === 'not_configured' ? 0 : 1)
    const cookies = response.headers.get('set-cookie') ?? ''
    assert.match(cookies, /cr_refresh_token=/)
    const accessToken = cookies.match(/cr_access_token=([^;]+)/)?.[1]
    assert.ok(accessToken)
    assert.equal((await verifyAccessToken(accessToken)).sub, 'registered-without-mail')
  })
}

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
