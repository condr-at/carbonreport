import assert from 'node:assert/strict'
import test, { afterEach } from 'node:test'
import { POST } from './route'
import { createTestUser } from '@/__tests__/factories'
import { cleanupTestData } from '@/__tests__/setup'
import { hashPassword } from '@/lib/auth/password'

function buildRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

afterEach(async () => {
  await cleanupTestData()
})

test('returns auth cookies for valid credentials', async () => {
  const password = 'ValidPass1'
  const user = await createTestUser({
    email: 'login@example.com',
    passwordHash: await hashPassword(password),
    emailVerified: true,
  })

  const request = buildRequest({ email: user.email, password })
  const response = await POST(request)
  const payload = (await response.json()) as { user?: { email: string } }

  assert.equal(response.status, 200)
  assert.equal(payload.user?.email, user.email)

  const setCookie = response.headers.get('set-cookie')
  assert.ok(setCookie)
  assert.match(setCookie, /cr_access_token=/)
  assert.match(setCookie, /cr_refresh_token=/)
})

test('rejects invalid credentials', async () => {
  const password = 'ValidPass1'
  await createTestUser({
    email: 'invalid@example.com',
    passwordHash: await hashPassword(password),
  })

  const request = buildRequest({ email: 'invalid@example.com', password: 'WrongPass1' })
  const response = await POST(request)
  const payload = (await response.json()) as { code?: string }

  assert.equal(response.status, 401)
  assert.equal(payload.code, 'UNAUTHORIZED')
})
