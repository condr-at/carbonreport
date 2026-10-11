import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test, { type TestContext } from 'node:test'
import { SignJWT } from 'jose'
import prisma from '@/lib/db'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { issueSessionTokens } from '@/lib/auth/service'
import { verifyAccessToken, verifyRefreshToken } from '@/lib/auth/jwt'
import { POST } from './route'

const nextHeaders = createRequire(import.meta.url)('next/headers')
const user = {
  id: 'refresh-user', email: 'refresh@example.test', name: 'Refresh User',
  emailVerified: false, passwordHash: 'test-password-hash', deletedAt: null,
}

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

function mockCookie(t: TestContext, token?: string) {
  t.mock.method(nextHeaders, 'cookies', async () => ({
    get: (name: string) => name === AUTH_CONFIG.refreshTokenCookie && token ? { value: token } : undefined,
  }))
}

test('refresh uses current database user and renews both signed cookies', async (t) => {
  const old = await issueSessionTokens(user)
  mockCookie(t, old.refreshToken)
  mockUserMethod(t, 'findUnique', async () => ({ ...user, emailVerified: true }))
  const response = await POST()
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { user: {
    id: user.id, email: user.email, name: user.name, email_verified: true,
  } })
  const access = response.cookies.get(AUTH_CONFIG.accessTokenCookie)!
  const refresh = response.cookies.get(AUTH_CONFIG.refreshTokenCookie)!
  assert.notEqual(access.value, old.accessToken)
  assert.notEqual(refresh.value, old.refreshToken)
  assert.equal(access.httpOnly, true)
  assert.equal(refresh.httpOnly, true)
  assert.equal(access.sameSite, 'lax')
  const a = await verifyAccessToken(access.value)
  const r = await verifyRefreshToken(refresh.value)
  assert.equal(a.email_verified, true)
  assert.equal(a.ctx, r.ctx)
  assert.equal(a.sid, r.sid)
})

for (const kind of ['missing', 'malformed', 'expired', 'wrong-purpose', 'legacy'] as const) {
  test(`refresh rejects ${kind} token with 401 and expires both cookies`, async (t) => {
    let token: string | undefined
    if (kind === 'malformed') token = 'invalid-token'
    if (kind === 'wrong-purpose') token = (await issueSessionTokens(user)).accessToken
    if (kind === 'legacy' || kind === 'expired') {
      token = await new SignJWT({ purpose: 'refresh', ...(kind === 'expired' ? { ctx: 'test' } : {}) })
        .setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuer(AUTH_CONFIG.issuer)
        .setAudience('carbon-report-users').setIssuedAt()
        .setExpirationTime(kind === 'expired' ? Math.floor(Date.now() / 1000) - 60 : '1h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!))
    }
    mockCookie(t, token)
    const find = mockUserMethod(t, 'findUnique', async () => { throw new Error('Unexpected database call') })
    const response = await POST()
    assert.equal(response.status, 401)
    assert.equal((await response.json()).code, 'UNAUTHORIZED')
    assert.equal(find.mock.callCount(), 0)
    for (const name of [AUTH_CONFIG.accessTokenCookie, AUTH_CONFIG.refreshTokenCookie]) {
      assert.equal(response.cookies.get(name)?.value, '')
      assert.equal(new Date(response.cookies.get(name)?.expires ?? -1).getTime(), 0)
    }
  })
}

for (const kind of ['missing-user', 'deleted-user', 'password-changed'] as const) {
  test(`refresh rejects ${kind} against current database state`, async (t) => {
    mockCookie(t, (await issueSessionTokens(user)).refreshToken)
    mockUserMethod(t, 'findUnique', async () => kind === 'missing-user' ? null : {
      ...user, deletedAt: kind === 'deleted-user' ? new Date() : null,
      passwordHash: kind === 'password-changed' ? 'changed-hash' : user.passwordHash,
    })
    const response = await POST()
    assert.equal(response.status, 401)
    assert.equal((await response.json()).code, 'UNAUTHORIZED')
    assert.equal(response.cookies.get(AUTH_CONFIG.refreshTokenCookie)?.value, '')
  })
}

test('database failure stays 500 without deleting a potentially valid session', async (t) => {
  mockCookie(t, (await issueSessionTokens(user)).refreshToken)
  mockUserMethod(t, 'findUnique', async () => { throw new Error('PRIVATE_DATABASE_DETAIL') })
  const response = await POST()
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'Failed to refresh session', code: 'INTERNAL_ERROR' })
  assert.equal(response.headers.get('set-cookie'), null)
})
