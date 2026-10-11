import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './jwt'
import { issueSessionTokens } from './service'

test.beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
})

test.afterEach(() => {
  delete process.env.JWT_SECRET
})

test('access and refresh tokens round-trip with expected claims', async () => {
  const payload = {
    sub: 'user-1',
    email: 'user@example.com',
    emailVerified: true,
    sessionId: 'session-1',
    sessionContext: 'signed-context',
  }

  const accessToken = await createAccessToken(payload)
  const refreshToken = await createRefreshToken(payload)

  const accessClaims = await verifyAccessToken(accessToken)
  const refreshClaims = await verifyRefreshToken(refreshToken)

  assert.equal(accessClaims.sub, payload.sub)
  assert.equal(accessClaims.email, payload.email)
  assert.equal(accessClaims.email_verified, true)
  assert.equal(accessClaims.purpose, 'access')

  assert.equal(refreshClaims.sub, payload.sub)
  assert.equal(refreshClaims.email, payload.email)
  assert.equal(refreshClaims.email_verified, true)
  assert.equal(refreshClaims.purpose, 'refresh')
})

test('issued session tokens share a session id but differ by purpose', async () => {
  const tokens = await issueSessionTokens({
    id: 'user-2',
    email: 'owner@example.com',
    emailVerified: false,
    passwordHash: 'stored-test-hash',
  })

  const accessClaims = await verifyAccessToken(tokens.accessToken)
  const refreshClaims = await verifyRefreshToken(tokens.refreshToken)

  assert.equal(accessClaims.sub, 'user-2')
  assert.equal(refreshClaims.sub, 'user-2')
  assert.equal(accessClaims.sid, refreshClaims.sid)
  assert.notEqual(tokens.accessToken, tokens.refreshToken)
})
