import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from './route'
import * as auth from '@/lib/auth'
import { Resend } from 'resend'

const originalEmailConfig = { key: process.env.RESEND_API_KEY, from: process.env.FROM_EMAIL }
const originalPost = Resend.prototype.post

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
  auth.__resetCurrentUserResolver()
  if (originalEmailConfig.key === undefined) delete process.env.RESEND_API_KEY
  else process.env.RESEND_API_KEY = originalEmailConfig.key
  if (originalEmailConfig.from === undefined) delete process.env.FROM_EMAIL
  else process.env.FROM_EMAIL = originalEmailConfig.from
  Resend.prototype.post = originalPost
})

test('returns already_verified when user is already verified', async () => {
  let sends = 0
  ;(Resend.prototype as any).post = async () => { sends++; return { data: { id: 'unexpected' }, error: null } }
  auth.__setCurrentUserResolver(async () => ({
    id: 'user-1',
    email: 'verified@example.com',
    name: 'Verified User',
    firstName: 'Verified',
    lastName: 'User',
    passwordHash: 'hash',
    emailVerified: true,
    avatarUrl: null,
    avatarAssetId: null,
    jobTitle: null,
    timezone: null,
    oauthProvider: null,
    oauthId: null,
    createdAt: new Date(),
    deletedAt: null,
  }))

  const response = await POST()
  const payload = (await response.json()) as { status?: string }

  assert.equal(response.status, 200)
  assert.equal(payload.status, 'already_verified')
  assert.equal(sends, 0)
})

test('returns sent when user is unverified', async () => {
  auth.__setCurrentUserResolver(async () => ({
    id: 'user-2',
    email: 'pending@example.com',
    name: 'Pending User',
    firstName: 'Pending',
    lastName: 'User',
    passwordHash: 'hash',
    emailVerified: false,
    avatarUrl: null,
    avatarAssetId: null,
    jobTitle: null,
    timezone: null,
    oauthProvider: null,
    oauthId: null,
    createdAt: new Date(),
    deletedAt: null,
  }))

  const response = await POST()
  const payload = (await response.json()) as { status?: string }

  assert.equal(response.status, 200)
  assert.equal(payload.status, 'sent')
})

for (const failure of ['provider_error', 'transport_error', 'not_configured'] as const) {
  test(`does not report sent when resend encounters ${failure}`, async () => {
    auth.__setCurrentUserResolver(async () => ({
      id: 'pending-user', email: 'pending@example.com', name: 'Pending User', firstName: 'Pending', lastName: 'User',
      passwordHash: 'hash', emailVerified: false, avatarUrl: null, avatarAssetId: null, jobTitle: null, timezone: null,
      oauthProvider: null, oauthId: null, createdAt: new Date(), deletedAt: null,
    }))
    ;(Resend.prototype as any).post = async () => {
      if (failure === 'transport_error') throw new Error('PRIVATE_TRANSPORT_DETAIL')
      return { data: null, error: { name: 'validation_error', message: 'PRIVATE_PROVIDER_DETAIL' } }
    }
    if (failure === 'not_configured') delete process.env.RESEND_API_KEY
    const response = await POST()
    const payload = await response.json()
    assert.equal(response.status, 503)
    assert.equal(payload.code, 'SERVICE_UNAVAILABLE')
    assert.equal(payload.status, undefined)
    assert.doesNotMatch(JSON.stringify(payload), /PRIVATE_|provider|configuration|api.?key/i)
  })
}
