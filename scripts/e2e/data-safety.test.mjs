import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import puppeteer from 'puppeteer'
import { e2eConfig } from './config.mjs'

const config = e2eConfig()
const localSecret = 'disposable-browser-e2e-secret-never-use-in-production'
if (process.env.DATABASE_URL !== config.databaseUrl || process.env.DIRECT_URL !== config.databaseUrl || process.env.JWT_SECRET !== localSecret) {
  throw new Error('Data-safety E2E requires the guarded disposable database and isolated JWT secret.')
}
const prisma = new PrismaClient()
const password = 'LocalDraft!Pass2026'
const button = (page, text) => page.locator(`::-p-xpath(//button[normalize-space(.)=${JSON.stringify(text)}])`)
const waitText = (page, text) => page.waitForFunction(value => document.body.innerText.includes(value), {}, text)
const responseFor = (page, pathname, status) => page.waitForResponse(response => new URL(response.url()).pathname === pathname && response.request().method() === 'POST' && (status === undefined || response.status() === status))
const datasetPath = project => `/projects/${project.id}/dataset`
const valueSelector = 'button[aria-label^="Edit Product name"]'

async function localSession(context, user, { expiredAccess = false, expiredRefresh = false } = {}) {
  const now = Math.floor(Date.now() / 1000)
  const ctx = createHash('sha256').update(`session:${user.id}:${user.passwordHash}`).digest('hex')
  const make = (purpose, expired) => new SignJWT({ purpose, ctx, email: user.email, email_verified: true, sid: randomUUID() })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).setSubject(user.id)
    .setIssuer('carbon-report-platform').setAudience('carbon-report-users')
    .setIssuedAt(now - 300).setExpirationTime(now + (expired ? -120 : 3600))
    .sign(new TextEncoder().encode(localSecret))
  await context.setCookie(...await Promise.all([
    ['cr_access_token', 'access', expiredAccess], ['cr_refresh_token', 'refresh', expiredRefresh],
  ].map(async ([name, purpose, expired]) => ({ name, value: await make(purpose, expired), url: config.baseUrl, path: '/', httpOnly: true, secure: false, sameSite: 'Lax' }))))
}

async function openDataset(page, project) {
  await page.goto(`${config.baseUrl}${datasetPath(project)}`, { waitUntil: 'networkidle0' })
  await page.locator('input[placeholder="Search fields..."]').fill('Product name')
  await page.waitForSelector(valueSelector)
  await page.waitForFunction(() => !document.body.innerText.includes('Restoring unsaved changes…'))
}

async function editName(page, value) {
  await page.locator(valueSelector).click()
  await page.locator('input[aria-label="Product name value"]').fill(value)
  await page.keyboard.press('Enter')
  await page.waitForFunction(({ selector, expected }) => document.querySelector(selector)?.textContent?.trim() === expected, {}, { selector: valueSelector, expected: value })
}

async function expectName(page, expected) {
  await page.waitForFunction(({ selector, expected }) => document.querySelector(selector)?.textContent?.trim() === expected, {}, { selector: valueSelector, expected })
}

async function saveNow(page) {
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some(element => !element.disabled && ['Save now', 'Retry saving'].includes(element.textContent?.trim() ?? '')))
  const label = await page.$$eval('button', elements => elements.find(element => !element.disabled && ['Save now', 'Retry saving'].includes(element.textContent?.trim() ?? ''))?.textContent?.trim())
  await button(page, label).click()
}

async function savedState(project) {
  const current = await prisma.project.findUniqueOrThrow({ where: { id: project.id }, select: { dataset: true, datasetVersion: true } })
  const points = current.dataset.data_points.filter(point => point.field_id === 'product_name' && point.item_id === null)
  assert.equal(points.length, 1, 'A field edit must not duplicate the data point.')
  return { value: points[0].value, version: current.datasetVersion }
}

async function queuedDrafts(page, project) {
  return page.evaluate(projectId => Object.keys(sessionStorage)
    .filter(key => key.startsWith('carbon_report_sync_queue'))
    .flatMap(key => {
      try {
        const entries = JSON.parse(sessionStorage.getItem(key) || '[]')
        return Array.isArray(entries) ? entries.filter(entry => entry.payload?.projectId === projectId).map(entry => ({ storageKey: key, ...entry })) : []
      } catch { return [] }
    }), project.id)
}

async function submitLogin(page, user) {
  await page.waitForSelector('#email')
  await page.locator('#email').fill(user.email)
  await page.locator('#password').fill(password)
  const response = responseFor(page, '/api/auth/login', 200)
  await button(page, 'Sign in').click()
  await response
  await page.waitForFunction(() => location.pathname !== '/login')
}

async function logout(page) {
  await page.locator('::-p-xpath(//button[.//span[normalize-space(.)="Open user menu"]])').click()
  const response = responseFor(page, '/api/auth/logout', 200)
  await page.locator('::-p-xpath(//*[@role="menuitem" and normalize-space(.)="Logout"])').click()
  await response
  await page.waitForFunction(() => location.pathname === '/login')
}

test('dataset drafts survive conflicting writes, interrupted requests and session changes', { timeout: 240_000 }, async t => {
  const browser = await puppeteer.launch({ headless: true,
    ...(process.env.E2E_CHROME_EXECUTABLE ? { executablePath: process.env.E2E_CHROME_EXECUTABLE } : {}),
    args: ['--lang=en-US', ...(process.env.CI ? ['--no-sandbox'] : [])],
  })
  const evidence = { scope: 'Disposable local DB; synthetic users; browser fault injection; no real email', checks: [] }
  const errors = []
  const pages = []
  const requestTrace = []
  const newPage = async user => {
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    pages.push(page)
    page.setDefaultTimeout(20_000)
    await page.setViewport({ width: 1440, height: 1100 })
    page.on('pageerror', error => errors.push(String(error).replace(/eyJ[A-Za-z0-9_.-]+/g, '[local-token]')))
    page.on('response', response => {
      const pathname = new URL(response.url()).pathname
      if (pathname === '/api/batch' || pathname.startsWith('/api/auth/')) {
        requestTrace.push({ page: pages.indexOf(page), pathname, method: response.request().method(), status: response.status() })
      }
    })
    await localSession(context, user)
    return { context, page }
  }
  try {
    const runId = `${Date.now()}`
    const passwordHash = await bcrypt.hash(password, 10)
    const owner = await prisma.user.create({ data: { name: 'Dataset safety owner', email: `draft-owner-${runId}@example.test`, passwordHash, emailVerified: true } })
    const editor = await prisma.user.create({ data: { name: 'Dataset safety other editor', email: `draft-editor-${runId}@example.test`, passwordHash, emailVerified: true } })
    const plan = await prisma.planDefinition.create({ data: { planCode: `draft-e2e-${runId}`, label: 'Synthetic dataset safety', maxActiveProjects: 10, maxEditors: 3, maxVerifiers: 1, maxViewers: 10 } })
    const organization = await prisma.organization.create({ data: {
      slug: `draft-e2e-${runId}`, displayName: `Dataset safety ${runId}`, planCode: plan.planCode, planAssignedAt: new Date(), createdByUserId: owner.id,
      memberships: { create: [
        { userId: owner.id, role: 'OWNER', inviteStatus: 'ACCEPTED', joinedAt: new Date() },
        { userId: editor.id, role: 'EDITOR', inviteStatus: 'ACCEPTED', joinedAt: new Date() },
      ] },
    } })
    const makeProject = suffix => prisma.project.create({ data: {
      organizationId: organization.id, createdByUserId: owner.id, name: `E2E durable draft ${suffix} ${runId}`, projectType: 'PRODUCT',
      dataset: { data_points: [{ field_id: 'product_name', item_id: null, value: `Initial ${suffix}` }], product_info: {}, bom_items: [], processes: [], transport_stages: [] },
      datasetVersion: 0, checklist: { items: [] },
    } })

    await t.test('a stale second session preserves its draft without overwriting another saved edit', async () => {
      const project = await makeProject('conflict')
      const first = await newPage(owner)
      const stale = await newPage(owner)
      await openDataset(first.page, project)
      await openDataset(stale.page, project)
      const firstSaved = responseFor(first.page, '/api/batch', 200)
      await editName(first.page, 'First session saved name')
      await saveNow(first.page)
      assert.equal((await (await firstSaved).json()).results.every(result => result.success), true)
      await waitText(first.page, 'All changes saved')
      const winner = await savedState(project)
      assert.deepEqual(winner, { value: 'First session saved name', version: 1 })
      const conflicting = responseFor(stale.page, '/api/batch', 200)
      await editName(stale.page, 'Second session unsaved name')
      await saveNow(stale.page)
      const conflict = await (await conflicting).json()
      assert.ok(conflict.results.some(result => !result.success && result.code === 'VERSION_CONFLICT'))
      await waitText(stale.page, 'Dataset changed in another session. Your draft is kept.')
      assert.deepEqual(await savedState(project), winner)
      await stale.page.reload({ waitUntil: 'networkidle0' })
      await stale.page.locator('input[placeholder="Search fields..."]').fill('Product name')
      await expectName(stale.page, 'Second session unsaved name')
      assert.equal((await queuedDrafts(stale.page, project)).some(operation => operation.payload.value === 'Second session unsaved name'), true)
      await stale.page.screenshot({ path: path.join(config.artifacts, 'dataset-conflict-draft-retained.png'), fullPage: true })
      await button(stale.page, 'Review latest values').click()
      await button(stale.page, 'Use server values').click()
      await expectName(stale.page, winner.value)
      assert.deepEqual(await savedState(project), winner)
      evidence.checks.push({ scenario: 'stale write', winner, conflictCodes: conflict.results.map(result => result.code), draftSurvivedReload: true, explicitDiscardPreservedWinner: true })
      await first.context.close()
      await stale.context.close()
    })

    await t.test('typing survives an immediate reload before Enter or blur', async () => {
      const project = await makeProject('typing')
      const current = await newPage(owner)
      await openDataset(current.page, project)
      await current.page.locator(valueSelector).click()
      await current.page.locator('input[aria-label="Product name value"]').fill('Typed draft before leaving the cell')
      assert.ok((await queuedDrafts(current.page, project)).some(operation => operation.payload.value === 'Typed draft before leaving the cell'))
      await current.page.reload({ waitUntil: 'networkidle0' })
      await current.page.locator('input[placeholder="Search fields..."]').fill('Product name')
      await expectName(current.page, 'Typed draft before leaving the cell')
      if ((await savedState(project)).version === 0) await saveNow(current.page)
      await waitText(current.page, 'All changes saved')
      const saved = await savedState(project)
      assert.deepEqual(saved, { value: 'Typed draft before leaving the cell', version: 1 })
      evidence.checks.push({ scenario: 'reload before blur', durableBeforeNavigation: true, saved })
      await current.context.close()
    })

    await t.test('a 500 response preserves edits through reload and an explicit retry saves exactly once', async () => {
      const project = await makeProject('server-failure')
      const current = await newPage(owner)
      let fail = true, failures = 0
      await current.page.setRequestInterception(true)
      current.page.on('request', request => {
        if (new URL(request.url()).pathname === '/api/batch' && request.method() === 'POST' && fail) {
          failures++
          void request.respond({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Synthetic temporary server failure', code: 'INTERNAL_ERROR' }) })
        } else void request.continue()
      })
      await openDataset(current.page, project)
      await editName(current.page, 'Draft retained after server failure')
      for (let attempt = 0; attempt < 3; attempt++) {
        const failed = responseFor(current.page, '/api/batch', 500)
        await saveNow(current.page)
        await failed
      }
      await waitText(current.page, 'not saved')
      assert.deepEqual(await savedState(project), { value: 'Initial server-failure', version: 0 })
      await current.page.reload({ waitUntil: 'networkidle0' })
      await current.page.locator('input[placeholder="Search fields..."]').fill('Product name')
      await expectName(current.page, 'Draft retained after server failure')
      assert.ok((await queuedDrafts(current.page, project)).length > 0)
      await current.page.screenshot({ path: path.join(config.artifacts, 'dataset-server-error-draft-retained.png'), fullPage: true })
      fail = false
      const restored = responseFor(current.page, '/api/batch', 200)
      await saveNow(current.page)
      await restored
      await waitText(current.page, 'All changes saved')
      const saved = await savedState(project)
      assert.deepEqual(saved, { value: 'Draft retained after server failure', version: 1 })
      assert.deepEqual(await queuedDrafts(current.page, project), [])
      evidence.checks.push({ scenario: '500 then reload and retry', simulatedFailures: failures, saved, queueClearedAfterAcknowledgement: true })
      await current.context.close()
    })

    await t.test('a lost success response can be retried after reload without applying the change twice', async () => {
      const project = await makeProject('lost-response')
      const current = await newPage(owner)
      let mode = 'lose-response'
      let confirmCommit
      const committed = new Promise(resolve => { confirmCommit = resolve })
      await current.page.setRequestInterception(true)
      current.page.on('request', request => {
        if (new URL(request.url()).pathname !== '/api/batch' || request.method() !== 'POST') { void request.continue(); return }
        if (mode === 'pass') { void request.continue(); return }
        if (mode === 'hold') { void request.abort('failed'); return }
        mode = 'hold'
        void (async () => {
          try {
            // Relay the exact local browser operation to the real API, then lose
            // its response. Cookies stay in memory and never enter evidence.
            const cookie = (await current.context.cookies()).map(item => `${item.name}=${item.value}`).join('; ')
            const response = await fetch(`${config.baseUrl}/api/batch`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: request.postData() })
            const payload = await response.json()
            confirmCommit({ status: response.status, payload })
            await request.abort('failed')
          } catch (error) {
            confirmCommit({ error: String(error) })
            await request.abort('failed').catch(() => {})
          }
        })()
      })
      await openDataset(current.page, project)
      await editName(current.page, 'Server committed but acknowledgement lost')
      await saveNow(current.page)
      const first = await committed
      assert.equal(first.status, 200)
      assert.equal(first.payload.results.every(result => result.success), true)
      const once = await savedState(project)
      assert.deepEqual(once, { value: 'Server committed but acknowledgement lost', version: 1 })
      await current.page.reload({ waitUntil: 'networkidle0' })
      await current.page.locator('input[placeholder="Search fields..."]').fill('Product name')
      await expectName(current.page, once.value)
      assert.ok((await queuedDrafts(current.page, project)).length > 0, 'A lost acknowledgement must retain the pending operation.')
      mode = 'pass'
      const acknowledged = responseFor(current.page, '/api/batch', 200)
      await saveNow(current.page)
      const replay = await (await acknowledged).json()
      assert.equal(replay.results.every(result => result.success), true)
      await waitText(current.page, 'All changes saved')
      assert.deepEqual(await savedState(project), once, 'Retrying a committed operation must not increment the dataset version again.')
      assert.deepEqual(await queuedDrafts(current.page, project), [])
      evidence.checks.push({ scenario: 'network response lost after commit', firstStatus: first.status, replaySucceeded: true, unchangedStateAfterReplay: once })
      await current.context.close()
    })

    await t.test('drafts survive expired login but stay owned by the original account in a shared workspace', async () => {
      const project = await makeProject('account-switch')
      const current = await newPage(owner)
      const batchRequests = []
      const authResponses = []
      current.page.on('request', request => {
        if (new URL(request.url()).pathname === '/api/batch' && request.method() === 'POST') {
          batchRequests.push(JSON.parse(request.postData() || '{}').operations ?? [])
        }
      })
      current.page.on('response', response => {
        if (new URL(response.url()).pathname === '/api/auth/refresh') authResponses.push(response.status())
      })
      await openDataset(current.page, project)
      await localSession(current.context, owner, { expiredAccess: true })
      await editName(current.page, 'Draft saved after automatic session renewal')
      const renewed = responseFor(current.page, '/api/batch', 200)
      await saveNow(current.page)
      await renewed
      await waitText(current.page, 'All changes saved')
      assert.ok(authResponses.includes(200))
      const baseline = await savedState(project)
      assert.deepEqual(baseline, { value: 'Draft saved after automatic session renewal', version: 1 })
      await localSession(current.context, owner, { expiredAccess: true, expiredRefresh: true })
      await editName(current.page, 'Private unsaved draft owned by first account')
      await saveNow(current.page)
      await waitText(current.page, 'Sign in again to save your draft.')
      assert.ok(authResponses.includes(401))
      assert.deepEqual(await savedState(project), baseline)
      const retained = await queuedDrafts(current.page, project)
      assert.ok(retained.some(operation => operation.actorId === owner.id && operation.payload.value === 'Private unsaved draft owned by first account'))
      await current.page.screenshot({ path: path.join(config.artifacts, 'dataset-session-expired-draft-retained.png'), fullPage: true })
      await current.page.locator('::-p-xpath(//a[normalize-space(.)="Sign in again"])').click()
      await submitLogin(current.page, editor)
      await openDataset(current.page, project)
      await expectName(current.page, baseline.value)
      const requestCount = batchRequests.length
      // Exceed one real auto-save interval: the other editor has write access,
      // so a leak would mutate the DB instead of being hidden by a 403.
      await new Promise(resolve => setTimeout(resolve, 5500))
      assert.equal(batchRequests.length, requestCount, 'The other account must not submit the original account\'s queue.')
      assert.deepEqual(await savedState(project), baseline)
      assert.ok((await queuedDrafts(current.page, project)).some(operation => operation.actorId === owner.id))
      await current.page.screenshot({ path: path.join(config.artifacts, 'dataset-other-account-no-draft-leak.png'), fullPage: true })
      const foreignReplay = await current.page.evaluate(async operations => {
        const response = await fetch('/api/batch', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ operations }) })
        return { status: response.status, body: await response.json() }
      }, retained.map(({ storageKey: _storageKey, ...operation }) => operation))
      assert.equal(foreignReplay.status, 401, 'The server must reject replay by another account even when it can edit this project.')
      assert.equal(foreignReplay.body.code, 'UNAUTHORIZED')
      assert.deepEqual(await savedState(project), baseline)
      await logout(current.page)
      await submitLogin(current.page, owner)
      await openDataset(current.page, project)
      await expectName(current.page, 'Private unsaved draft owned by first account')
      // Confirmed reauthentication resumes this actor's failed draft on the
      // bounded automatic save timer; it may already be acknowledged here.
      await waitText(current.page, 'All changes saved')
      const final = await savedState(project)
      assert.deepEqual(final, { value: 'Private unsaved draft owned by first account', version: 2 })
      evidence.checks.push({ scenario: 'session expiry and shared-workspace account switch', refreshStatuses: authResponses, retainedActor: owner.id, otherActor: editor.id, automaticForeignQueueSubmissions: 0, explicitForeignReplayStatus: foreignReplay.status, baseline, restoredByOwner: final })
      await current.context.close()
    })
    assert.deepEqual(errors, [], 'No uncaught browser errors in draft recovery.')
  } finally {
    evidence.browserErrors = errors
    evidence.requestTrace = requestTrace
    evidence.unclosedPages = []
    for (const [index, page] of pages.entries()) {
      if (page.isClosed()) continue
      evidence.unclosedPages.push({ index, pathname: new URL(page.url()).pathname, visibleText: await page.$eval('body', element => element.innerText).catch(() => 'Page unavailable') })
      await page.screenshot({ path: path.join(config.artifacts, `dataset-final-${index}.png`), fullPage: true }).catch(() => {})
    }
    await fs.writeFile(path.join(config.artifacts, 'data-safety-results.json'), JSON.stringify(evidence, null, 2))
    await browser.close()
    await prisma.$disconnect()
  }
})
