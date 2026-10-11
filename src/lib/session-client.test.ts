import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchWithSession, logoutSession, refreshSession } from './session-client'

const origin = 'https://carbonreport.test'
const originalFetch = globalThis.fetch
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
const json = (status: number, body: unknown) => Response.json(body, { status })
const urlOf = (input: RequestInfo | URL) => new URL(input instanceof Request ? input.url : String(input), origin)

test.beforeEach(() => {
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { origin } } })
})
test.afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
  else Reflect.deleteProperty(globalThis, 'window')
})

test('concurrent 401 responses share one refresh and retry each original request with its body', async () => {
  let releaseRefresh!: (response: Response) => void
  let startedRefresh!: () => void
  const refreshStarted = new Promise<void>(resolve => { startedRefresh = resolve })
  const refreshResult = new Promise<Response>(resolve => { releaseRefresh = resolve })
  const calls: Array<{ path: string; method: string; body: string }> = []
  const seen = new Map<string, number>()
  globalThis.fetch = async (input, init) => {
    const path = urlOf(input).pathname
    if (path === '/api/auth/refresh') {
      calls.push({ path, method: init?.method ?? 'GET', body: '' })
      assert.equal(init?.credentials, 'include')
      assert.equal(init?.cache, 'no-store')
      startedRefresh()
      return refreshResult
    }
    // Reading the Request consumes it as a real fetch would. The retry must use
    // a clone created before that consumption, preserving both method and body.
    const method = input instanceof Request ? input.method : init?.method ?? 'GET'
    const body = input instanceof Request ? await input.text() : String(init?.body ?? '')
    calls.push({ path, method, body })
    const count = (seen.get(path) ?? 0) + 1
    seen.set(path, count)
    return count === 1 ? json(401, { code: 'UNAUTHORIZED' }) : json(200, { path, body })
  }
  const firstBody = JSON.stringify({ name: 'Original first value' })
  const secondBody = JSON.stringify({ name: 'Original second value' })
  const first = fetchWithSession(new Request(`${origin}/api/first`, { method: 'PATCH', body: firstBody }))
  const second = fetchWithSession('/api/second', { method: 'POST', body: secondBody })
  await refreshStarted
  // Let both independent initial rejections arrive while renewal is pending.
  await new Promise<void>(resolve => setImmediate(resolve))
  assert.equal(calls.filter(call => call.path === '/api/auth/refresh').length, 1)
  releaseRefresh(json(200, { user: { id: 'local-user' } }))
  const responses = await Promise.all([first, second])
  assert.deepEqual(responses.map(response => response.status), [200, 200])
  assert.deepEqual(calls.filter(call => call.path === '/api/first'), [
    { path: '/api/first', method: 'PATCH', body: firstBody },
    { path: '/api/first', method: 'PATCH', body: firstBody },
  ])
  assert.deepEqual(calls.filter(call => call.path === '/api/second'), [
    { path: '/api/second', method: 'POST', body: secondBody },
    { path: '/api/second', method: 'POST', body: secondBody },
  ])
  assert.equal(calls.filter(call => call.path === '/api/auth/refresh').length, 1)
})

test('refresh callers receive independently readable copies of the same response', async () => {
  let calls = 0
  globalThis.fetch = async () => { calls++; return json(200, { refreshed: true }) }
  const responses = await Promise.all([refreshSession(), refreshSession()])
  assert.equal(calls, 1)
  assert.deepEqual(await Promise.all(responses.map(response => response.json())), [{ refreshed: true }, { refreshed: true }])
})

test('403, auth routes, foreign origins, non-API URLs and aborted requests never trigger refresh', async () => {
  const controller = new AbortController()
  controller.abort()
  for (const [input, status, init] of [
    ['/api/projects', 403, undefined],
    ['/api/auth/login', 401, undefined],
    ['/api/auth/refresh', 401, undefined],
    ['https://other.test/api/projects', 401, undefined],
    ['/projects', 401, undefined],
    ['/api/projects', 401, { signal: controller.signal }],
  ] as const) {
    const calls: string[] = []
    globalThis.fetch = async current => { calls.push(urlOf(current).href); return json(status, { code: 'ORIGINAL_ERROR' }) }
    const response = await fetchWithSession(input, init)
    assert.equal(response.status, status)
    assert.equal(calls.length, 1, input)
  }
})

test('server-side requests return the original 401 without browser session renewal', async () => {
  Reflect.deleteProperty(globalThis, 'window')
  let calls = 0
  globalThis.fetch = async () => { calls++; return json(401, { code: 'UNAUTHORIZED' }) }
  assert.equal((await fetchWithSession(`${origin}/api/projects`)).status, 401)
  assert.equal(calls, 1)
})

test('rejected refresh returns the original 401 and a second 401 never creates a retry loop', async () => {
  for (const refreshStatus of [401, 200]) {
    const paths: string[] = []
    globalThis.fetch = async input => {
      const path = urlOf(input).pathname
      paths.push(path)
      return path === '/api/auth/refresh' ? json(refreshStatus, { refreshed: refreshStatus === 200 }) : json(401, { code: 'ORIGINAL_401' })
    }
    const response = await fetchWithSession('/api/projects')
    assert.equal(response.status, 401)
    assert.deepEqual(await response.json(), { code: 'ORIGINAL_401' })
    assert.deepEqual(paths, refreshStatus === 401
      ? ['/api/projects', '/api/auth/refresh']
      : ['/api/projects', '/api/auth/refresh', '/api/projects'])
  }
})

test('a refresh 500 remains a retryable server failure and does not poison later renewal', async () => {
  let refreshCalls = 0
  let resourceCalls = 0
  globalThis.fetch = async input => {
    if (urlOf(input).pathname === '/api/auth/refresh') {
      refreshCalls++
      return refreshCalls === 1 ? json(500, { error: 'Temporary service failure' }) : json(200, { refreshed: true })
    }
    resourceCalls++
    return resourceCalls <= 2 ? json(401, { code: 'UNAUTHORIZED' }) : json(200, { saved: true })
  }
  const failure = await fetchWithSession('/api/projects')
  assert.equal(failure.status, 500)
  assert.deepEqual(await failure.json(), { error: 'Temporary service failure' })
  assert.equal(resourceCalls, 1, 'Do not repeat a mutation while refresh failed.')
  const retried = await fetchWithSession('/api/projects')
  assert.equal(retried.status, 200)
  assert.equal(refreshCalls, 2)
  assert.equal(resourceCalls, 3)
})

test('a network failure rejects without retrying the resource and permits a later refresh', async () => {
  let refreshCalls = 0
  globalThis.fetch = async input => {
    if (urlOf(input).pathname !== '/api/auth/refresh') return json(401, {})
    refreshCalls++
    if (refreshCalls === 1) throw new TypeError('Synthetic network unavailable')
    return json(200, { refreshed: true })
  }
  await assert.rejects(fetchWithSession('/api/projects'), /Synthetic network unavailable/)
  assert.equal((await refreshSession()).status, 200)
  assert.equal(refreshCalls, 2)
})

test('failed logout permits a deliberate retry but old 401 responses cannot restart renewal', async () => {
  for (const failure of ['server', 'network']) {
    let finishOldRequest!: (response: Response) => void
    const oldResponse = new Promise<Response>(resolve => { finishOldRequest = resolve })
    let refreshCalls = 0
    let freshRequests = 0
    globalThis.fetch = async input => {
      const path = urlOf(input).pathname
      if (path === '/api/old-request') return oldResponse
      if (path === '/api/auth/logout') {
        if (failure === 'network') throw new TypeError('Synthetic logout unavailable')
        return json(500, { error: 'Temporary logout failure' })
      }
      if (path === '/api/auth/refresh') {
        refreshCalls++
        return json(200, { refreshed: true })
      }
      freshRequests++
      return freshRequests === 1 ? json(401, {}) : json(200, { saved: true })
    }
    const oldRequest = fetchWithSession('/api/old-request')
    if (failure === 'network') await assert.rejects(logoutSession(), /Synthetic logout unavailable/)
    else assert.equal((await logoutSession()).status, 500)
    finishOldRequest(json(401, { code: 'ORIGINAL_401' }))
    assert.equal((await oldRequest).status, 401)
    assert.equal(refreshCalls, 0, 'A pre-logout request must stay invalidated even if logout fails.')
    assert.equal((await fetchWithSession('/api/new-request')).status, 200)
    assert.equal(refreshCalls, 1, 'A new deliberate request can recover after failed logout.')
  }
})

test('logout waits for pending cookie renewal, clears last, and never retries stale requests', { timeout: 5_000 }, async () => {
  let releaseRefresh!: () => void
  let startedRefresh!: () => void
  let finishLateRequest!: (response: Response) => void
  const refreshStarted = new Promise<void>(resolve => { startedRefresh = resolve })
  const refreshGate = new Promise<void>(resolve => { releaseRefresh = resolve })
  const lateResponse = new Promise<Response>(resolve => { finishLateRequest = resolve })
  let cookieState = 'original-session'
  const requests: string[] = []
  const cookieEvents: string[] = []
  globalThis.fetch = async (input, init) => {
    const path = urlOf(input).pathname
    requests.push(path)
    if (path === '/api/auth/refresh') {
      startedRefresh()
      await refreshGate
      // Browsers apply Set-Cookie before fetch resolves. Model that ordering.
      cookieState = 'renewed-session'
      cookieEvents.push('refresh-set-cookie')
      return json(200, { refreshed: true })
    }
    if (path === '/api/auth/logout') {
      assert.equal(init?.method, 'POST')
      assert.equal(init?.credentials, 'include')
      assert.equal(cookieState, 'renewed-session')
      cookieState = ''
      cookieEvents.push('logout-clear-cookie')
      return json(200, { success: true })
    }
    if (path === '/api/late-request') return lateResponse
    return json(401, { code: 'ORIGINAL_401' })
  }
  const oldRequest = fetchWithSession('/api/save', { method: 'PATCH', body: 'original mutation' })
  const lateRequest = fetchWithSession('/api/late-request')
  await refreshStarted
  const logout = logoutSession()
  const duplicateLogout = logoutSession()
  assert.equal(requests.includes('/api/auth/logout'), false, 'Do not clear cookies before pending renewal finishes.')
  assert.equal((await refreshSession()).status, 401, 'Block new renewals as soon as logout starts.')
  releaseRefresh()
  assert.deepEqual((await Promise.all([logout, duplicateLogout])).map(response => response.status), [200, 200])
  assert.equal((await oldRequest).status, 401)
  finishLateRequest(json(401, { code: 'LATE_401' }))
  assert.equal((await lateRequest).status, 401)
  assert.deepEqual(cookieEvents, ['refresh-set-cookie', 'logout-clear-cookie'])
  assert.equal(cookieState, '')
  assert.equal(requests.filter(path => path === '/api/auth/refresh').length, 1)
  assert.equal(requests.filter(path => path === '/api/auth/logout').length, 1)
  assert.equal(requests.filter(path => path === '/api/save').length, 1, 'Do not retry a mutation after logout starts.')
  assert.equal((await refreshSession()).status, 401, 'Stay signed out until full navigation resets client state.')
})
