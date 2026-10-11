import assert from 'node:assert/strict'
import test, { type TestContext } from 'node:test'
import { SignJWT } from 'jose'
import prisma from '@/lib/db'
import { AUTH_CONFIG } from '@/lib/auth/config'
import { buildPasswordResetToken, issueSessionTokens } from '@/lib/auth/service'
import { hashPassword } from '@/lib/auth/password'
import { getUserForAccessToken } from '@/lib/auth'
import { ApiError } from '@/lib/api-error'
import { POST as login } from '../../login/route'
import { POST } from './route'

const baseUser = {
  id: 'reset-user', email: 'reset@example.test', name: 'Reset User',
  emailVerified: true, passwordHash: 'original-test-hash', deletedAt: null,
}
function request(password: unknown = 'ChangedPass2') {
  return new Request('http://localhost/api/auth/reset-password/test', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
  })
}
function reset(token: string, password?: unknown) {
  return POST(request(password), { params: Promise.resolve({ token }) })
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

for (const kind of ['malformed', 'expired', 'wrong-purpose', 'missing-context', 'missing-subject'] as const) {
  test(`reset rejects ${kind} token as INVALID_TOKEN without database writes`, async (t) => {
    let token = 'invalid-token'
    if (kind === 'wrong-purpose') token = (await issueSessionTokens(baseUser)).accessToken
    if (['expired', 'missing-context', 'missing-subject'].includes(kind)) {
      token = await new SignJWT({ purpose: 'password_reset',
        ...(kind !== 'missing-context' ? { ctx: 'test' } : {}),
        ...(kind !== 'missing-subject' ? { sub: baseUser.id } : {}),
      }).setProtectedHeader({ alg: 'HS256' }).setIssuer(AUTH_CONFIG.issuer)
        .setAudience('carbon-report-users').setIssuedAt()
        .setExpirationTime(kind === 'expired' ? Math.floor(Date.now() / 1000) - 60 : '1h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!))
    }
    const find = mockUserMethod(t, 'findUnique', async () => { throw new Error('Unexpected database call') })
    const write = mockUserMethod(t, 'updateMany', async () => { throw new Error('Unexpected write') })
    const response = await reset(token)
    assert.equal(response.status, 400)
    assert.equal((await response.json()).code, 'INVALID_TOKEN')
    assert.equal(find.mock.callCount(), 0)
    assert.equal(write.mock.callCount(), 0)
    assert.equal(response.headers.get('set-cookie'), null)
  })
}

for (const kind of ['deleted-user', 'missing-user', 'reused-token'] as const) {
  test(`reset rejects ${kind} without mutation`, async (t) => {
    const token = await buildPasswordResetToken(baseUser)
    mockUserMethod(t, 'findUnique', async () => kind === 'missing-user' ? null : {
      ...baseUser, deletedAt: kind === 'deleted-user' ? new Date() : null,
      passwordHash: kind === 'reused-token' ? 'changed-hash' : baseUser.passwordHash,
    })
    const write = mockUserMethod(t, 'updateMany', async () => { throw new Error('Unexpected write') })
    const response = await reset(token)
    assert.equal(response.status, 400)
    assert.equal((await response.json()).code, 'INVALID_TOKEN')
    assert.equal(write.mock.callCount(), 0)
  })
}

test('reset enforces password policy before mutation', async (t) => {
  const write = mockUserMethod(t, 'updateMany', async () => { throw new Error('Unexpected write') })
  const token = await buildPasswordResetToken(baseUser)
  for (const password of [null, '', 'weakpass', 'lowercase123']) {
    const response = await reset(token, password)
    assert.equal(response.status, 400)
    assert.equal((await response.json()).code, 'VALIDATION_ERROR')
  }
  assert.equal(write.mock.callCount(), 0)
})

test('reset is single-use, rejects old password/session, and starts a new authenticated session', async (t) => {
  let user = { ...baseUser, passwordHash: await hashPassword('OriginalPass1') }
  const oldTokens = await issueSessionTokens(user)
  const token = await buildPasswordResetToken(user)
  mockUserMethod(t, 'findUnique', async () => ({ ...user }))
  mockUserMethod(t, 'findFirst', async () => ({ ...user }))
  const write = mockUserMethod(t, 'updateMany', async ({ where, data }: any) => {
    assert.equal(where.id, user.id)
    assert.equal(where.deletedAt, null)
    if (where.passwordHash !== user.passwordHash) return { count: 0 }
    user = { ...user, passwordHash: data.passwordHash }
    return { count: 1 }
  })
  const response = await reset(token)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { message: 'Password has been reset' })
  const newAccess = response.cookies.get(AUTH_CONFIG.accessTokenCookie)!
  assert.equal(newAccess.httpOnly, true)
  assert.equal((await getUserForAccessToken(newAccess.value)).id, user.id)
  await assert.rejects(getUserForAccessToken(oldTokens.accessToken), (e: unknown) => e instanceof ApiError && e.status === 401)
  const replay = await reset(token)
  assert.equal(replay.status, 400)
  assert.equal((await replay.json()).code, 'INVALID_TOKEN')
  assert.equal(write.mock.callCount(), 1)
  for (const [password, expected] of [['OriginalPass1', 401], ['ChangedPass2', 200]] as const) {
    const result = await login(new Request('http://localhost/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password }),
    }))
    assert.equal(result.status, expected)
  }
})

test('concurrent reset requests consume the same token exactly once', { timeout: 5_000 }, async (t) => {
  let user = { ...baseUser }
  const token = await buildPasswordResetToken(user)
  let reads = 0
  let release!: () => void
  const bothRead = new Promise<void>((resolve) => { release = resolve })
  mockUserMethod(t, 'findUnique', async () => {
    const snapshot = { ...user }
    reads++
    if (reads === 2) release()
    await bothRead
    return snapshot
  })
  let successfulWrites = 0
  mockUserMethod(t, 'updateMany', async ({ where, data }: any) => {
    if (where.passwordHash !== user.passwordHash) return { count: 0 }
    user = { ...user, passwordHash: data.passwordHash }
    successfulWrites++
    return { count: 1 }
  })
  const responses = await Promise.all([reset(token, 'FirstNewPass1'), reset(token, 'SecondNewPass2')])
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 400])
  assert.equal(successfulWrites, 1)
  const rejected = responses.find((response) => response.status === 400)!
  assert.equal((await rejected.json()).code, 'INVALID_TOKEN')
  assert.equal(rejected.headers.get('set-cookie'), null)
})
