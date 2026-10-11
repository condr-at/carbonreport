import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from './route'
import * as auth from '@/lib/auth'

test.beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  process.env.APP_URL = 'http://localhost:3000'
})

test.afterEach(() => {
  delete process.env.JWT_SECRET
  delete process.env.APP_URL
  auth.__resetCurrentUserResolver()
})

test('returns already_verified when user is already verified', async () => {
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
