import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test, { type TestContext } from 'node:test'
import prisma from '@/lib/db'
import { getCurrentUser, getUserForAccessToken } from './auth'
import { issueSessionTokens } from './auth/service'
import { ApiError } from './api-error'

const nextHeaders = createRequire(import.meta.url)('next/headers')
const user = {
  id: 'access-user', email: 'access@example.test', name: 'Access User',
  emailVerified: true, passwordHash: 'test-password-hash', deletedAt: null,
}
const unauthorized = (error: unknown) => error instanceof ApiError && error.status === 401
// Prisma delegates are proxies; replace their property instead of mocking a
// descriptor, which Node's mock.method cannot find on this delegate.
function mockUserMethod(t: TestContext, method: 'findUnique' | 'findFirst' | 'updateMany', implementation: (...args: any[]) => any) {
  const original = prisma.user[method]
  const mock = t.mock.fn(implementation)
  ;(prisma.user as any)[method] = mock
  t.after(() => { ;(prisma.user as any)[method] = original })
  return mock
}

test.beforeEach(() => { process.env.JWT_SECRET = 'unit-test-secret' })
test.afterEach(() => { delete process.env.JWT_SECRET })

test('server auth requires the signed cookie even when identity headers are forged', async (t) => {
  t.mock.method(nextHeaders, 'headers', async () => new Headers({ 'x-user-id': user.id }))
  t.mock.method(nextHeaders, 'cookies', async () => ({ get: () => undefined }))
  const find = mockUserMethod(t, 'findUnique', async () => user)
  await assert.rejects(getCurrentUser(), unauthorized)
  assert.equal(find.mock.callCount(), 0)
})

test('server auth accepts current signed session and rejects it after password change', async (t) => {
  const tokens = await issueSessionTokens(user)
  let current = { ...user }
  mockUserMethod(t, 'findUnique', async () => current)
  assert.deepEqual(await getUserForAccessToken(tokens.accessToken), user)
  current = { ...user, passwordHash: 'changed-password-hash' }
  await assert.rejects(getUserForAccessToken(tokens.accessToken), unauthorized)
  const fresh = await issueSessionTokens(current)
  assert.deepEqual(await getUserForAccessToken(fresh.accessToken), current)
})

test('server auth rejects missing, malformed and refresh tokens', async (t) => {
  const find = mockUserMethod(t, 'findUnique', async () => user)
  for (const token of [null, 'invalid', (await issueSessionTokens(user)).refreshToken]) {
    await assert.rejects(getUserForAccessToken(token), unauthorized)
  }
  assert.equal(find.mock.callCount(), 0)
})

test('server auth rejects deleted users regardless of signed token validity', async (t) => {
  const tokens = await issueSessionTokens(user)
  mockUserMethod(t, 'findUnique', async () => ({ ...user, deletedAt: new Date() }))
  await assert.rejects(getUserForAccessToken(tokens.accessToken), unauthorized)
})
