import assert from 'node:assert/strict'
import test from 'node:test'
import prisma from '@/lib/db'
import { POST } from './route'
import { hashPassword } from '@/lib/auth/password'
import { Resend } from 'resend'

const originalEmailConfig = { key: process.env.RESEND_API_KEY, from: process.env.FROM_EMAIL }
const originalPost = Resend.prototype.post

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

for (const failure of ['provider_error', 'transport_error', 'not_configured'] as const) {
  test(`preserves the same anti-enumeration response on ${failure}`, async (t) => {
    let exists = true
    const originalFindFirst = prisma.user.findFirst
    ;(prisma.user as any).findFirst = async () => exists ? {
      id: 'reset-user', email: 'reset@example.com', name: 'Reset User', passwordHash: 'stored-password-hash', deletedAt: null,
    } : null
    t.after(() => { ;(prisma.user as any).findFirst = originalFindFirst })
    ;(Resend.prototype as any).post = async () => {
      if (failure === 'transport_error') throw new Error('PRIVATE_TRANSPORT_DETAIL')
      return { data: null, error: { name: 'validation_error', message: 'PRIVATE_PROVIDER_DETAIL' } }
    }
    if (failure === 'not_configured') delete process.env.RESEND_API_KEY
    const presentResponse = await POST(buildRequest({ email: 'reset@example.com' }))
    const presentPayload = await presentResponse.json()
    exists = false
    const absentResponse = await POST(buildRequest({ email: 'reset@example.com' }))
    assert.equal(presentResponse.status, 200)
    assert.equal(absentResponse.status, 200)
    assert.deepEqual(presentPayload, await absentResponse.json())
    assert.deepEqual(presentPayload, { message: 'If the email exists, you will receive a reset link shortly.' })
  })
}
