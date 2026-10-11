import assert from 'node:assert/strict'
import test from 'node:test'
import { POST } from './route'

test('clears auth cookies on logout', async () => {
  const response = await POST()
  const payload = (await response.json()) as { success?: boolean }

  assert.equal(response.status, 200)
  assert.equal(payload.success, true)

  const setCookie = response.headers.get('set-cookie')
  assert.ok(setCookie)
  assert.match(setCookie, /cr_access_token=/)
  assert.match(setCookie, /cr_refresh_token=/)
})
