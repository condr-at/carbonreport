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
import { values } from './fixture.mjs'

const config = e2eConfig()
const localSecret = 'disposable-browser-e2e-secret-never-use-in-production'
if (process.env.DATABASE_URL !== config.databaseUrl || process.env.DIRECT_URL !== config.databaseUrl || process.env.JWT_SECRET !== localSecret) {
  throw new Error('Auth E2E requires the guarded disposable database and isolated runner JWT secret.')
}
const prisma = new PrismaClient()
const password = 'LocalAuth!Pass2026'
const nextPassword = 'LocalAuth!Changed2026'
const sha256 = value => createHash('sha256').update(value).digest('hex')
const buttonSelector = text => `::-p-xpath(//button[normalize-space(.)=${JSON.stringify(text)}])`
const button = (page, text) => page.locator(buttonSelector(text))
const waitText = (page, text) => page.waitForFunction(value => document.body.innerText.includes(value), {}, text)
const responseFor = (page, pathname, method) => page.waitForResponse(response => new URL(response.url()).pathname === pathname && response.request().method() === method)
const jsonPost = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

// Deliberately generated local JWTs test expiry and replay without sending mail or
// changing the clock. This suite does not claim to validate delivered reset links.
async function token(user, purpose, expired = false) {
  const now = Math.floor(Date.now() / 1000)
  const context = purpose === 'password_reset'
    ? sha256(`${user.id}:${user.passwordHash}`)
    : sha256(`session:${user.id}:${user.passwordHash}`)
  return new SignJWT({ purpose, ctx: context, email: user.email, email_verified: user.emailVerified, sid: randomUUID() })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' }).setIssuer('carbon-report-platform')
    .setAudience('carbon-report-users').setSubject(user.id).setJti(randomUUID())
    .setIssuedAt(now - (expired ? 300 : 0)).setExpirationTime(now + (expired ? -120 : 3600))
    .sign(new TextEncoder().encode(localSecret))
}

async function session(context, user, { expiredAccess = false, expiredRefresh = false } = {}) {
  await context.setCookie(...await Promise.all([
    ['cr_access_token', 'access', expiredAccess], ['cr_refresh_token', 'refresh', expiredRefresh],
  ].map(async ([name, purpose, expired]) => ({
    name, value: await token(user, purpose, expired), url: config.baseUrl,
    httpOnly: true, secure: false, sameSite: 'Lax',
  }))))
}

async function api(page, pathname, options = {}) {
  return page.evaluate(async ({ pathname, options }) => {
    const response = await fetch(pathname, options)
    const text = await response.text()
    return { status: response.status, body: JSON.parse(text || 'null') }
  }, { pathname, options })
}

async function login(page, user, secret = password, expectedStatus = 200) {
  await page.goto(`${config.baseUrl}/login`, { waitUntil: 'networkidle0' })
  await page.locator('#email').fill(user.email)
  await page.locator('#password').fill(secret)
  const result = responseFor(page, '/api/auth/login', 'POST')
  await button(page, 'Sign in').click()
  assert.equal((await result).status(), expectedStatus, 'Sign-in response')
  if (expectedStatus === 200) await page.waitForFunction(() => !['/login', '/session'].includes(location.pathname))
}

async function submitReset(page, resetToken, newPassword, expectedStatus) {
  await page.goto(`${config.baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`, { waitUntil: 'networkidle0' })
  await page.locator('#password').fill(newPassword)
  await page.locator('#confirmPassword').fill(newPassword)
  const result = responseFor(page, `/api/auth/reset-password/${resetToken}`, 'POST')
  await button(page, 'Update password').click()
  const response = await result
  assert.equal(response.status(), expectedStatus, 'Password reset response')
  return response.json()
}

test('authentication expiry, password reset and organization role boundaries', { timeout: 240_000 }, async t => {
  const browser = await puppeteer.launch({
    headless: true,
    ...(process.env.E2E_CHROME_EXECUTABLE ? { executablePath: process.env.E2E_CHROME_EXECUTABLE } : {}),
    args: ['--lang=en-US', ...(process.env.CI ? ['--no-sandbox'] : [])],
  })
  const results = { scope: 'Disposable local DB; locally signed test JWTs; outbound mail disabled', checks: [] }
  const browserErrors = []
  const contexts = []
  const newPage = async () => {
    const context = await browser.createBrowserContext()
    contexts.push(context)
    const page = await context.newPage()
    page.setDefaultTimeout(20_000)
    await page.setViewport({ width: 1440, height: 1100 })
    page.on('pageerror', error => browserErrors.push(String(error).replace(/eyJ[A-Za-z0-9_.-]+/g, '[test-token]')))
    return { context, page }
  }
  try {
    const runId = `${Date.now()}`
    const hash = await bcrypt.hash(password, 10)
    const users = {}
    for (const label of ['reset', 'race', 'OWNER', 'ADMIN', 'EDITOR', 'VIEWER_READONLY', 'VIEWER_VERIFIER', 'invitee', 'decliner', 'outsider']) {
      users[label] = await prisma.user.create({ data: { name: `Auth E2E ${label}`, email: `auth-${label.toLowerCase()}-${runId}@example.test`, passwordHash: hash, emailVerified: label !== 'decliner' } })
    }
    const plan = await prisma.planDefinition.create({ data: { planCode: `auth-e2e-${runId}`, label: 'Synthetic role test', maxActiveProjects: 10, maxEditors: 10, maxVerifiers: 10, maxViewers: 10 } })
    const organization = await prisma.organization.create({ data: {
      slug: `auth-e2e-${runId}`, displayName: `Auth E2E workspace ${runId}`, planCode: plan.planCode,
      planAssignedAt: new Date(), createdByUserId: users.OWNER.id,
      memberships: { create: ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER_READONLY', 'VIEWER_VERIFIER'].map(role => ({ userId: users[role].id, role, inviteStatus: 'ACCEPTED', joinedAt: new Date() })) },
    } })
    const memberEndpoint = `/api/organizations/${organization.id}/members`
    const inviteEndpoint = `/api/organizations/${organization.id}/invite`
    const resetBrowser = await newPage()
    const oldBrowser = await newPage()
    const ownerBrowser = await newPage()

    await t.test('forgot-password stays private and malformed/expired reset links cannot change the password', async () => {
      await resetBrowser.page.goto(`${config.baseUrl}/forgot-password`, { waitUntil: 'networkidle0' })
      await resetBrowser.page.locator('#email').fill(users.reset.email)
      const requested = responseFor(resetBrowser.page, '/api/auth/forgot-password', 'POST')
      await button(resetBrowser.page, 'Send reset link').click()
      const known = await requested
      assert.equal(known.status(), 200)
      const knownBody = await known.json()
      await waitText(resetBrowser.page, 'If an account exists for')
      const unknown = await api(resetBrowser.page, '/api/auth/forgot-password', jsonPost({ email: `missing-${runId}@example.test` }))
      assert.equal(unknown.status, 200)
      assert.deepEqual(unknown.body, knownBody, 'Account existence must not be exposed by the reset response.')
      await resetBrowser.page.goto(`${config.baseUrl}/reset-password`, { waitUntil: 'networkidle0' })
      await waitText(resetBrowser.page, 'Reset link required')
      for (const [label, resetToken] of [['malformed', 'not-a-jwt'], ['expired', await token(users.reset, 'password_reset', true)]]) {
        const body = await submitReset(resetBrowser.page, resetToken, nextPassword, 400)
        assert.equal(body.code, 'INVALID_TOKEN')
        await waitText(resetBrowser.page, 'Reset token is invalid or expired')
        results.checks.push({ scenario: `${label} password-reset token`, status: 400, code: body.code })
      }
      assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: users.reset.id } })).passwordHash, hash)
    })

    await t.test('reset through the browser consumes the link, changes the password and revokes old sessions', async () => {
      await login(oldBrowser.page, users.reset)
      const resetToken = await token(users.reset, 'password_reset')
      await submitReset(resetBrowser.page, resetToken, nextPassword, 200)
      await resetBrowser.page.waitForFunction(() => !location.pathname.startsWith('/reset-password'))
      assert.equal((await api(resetBrowser.page, '/api/user/settings')).status, 200, 'Reset success must establish a working fresh session.')
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: users.reset.id } })
      assert.equal(await bcrypt.compare(nextPassword, stored.passwordHash), true)
      assert.equal(await bcrypt.compare(password, stored.passwordHash), false)
      const revokedAccess = await api(oldBrowser.page, '/api/user/settings')
      assert.equal(revokedAccess.status, 401)
      const revokedNavigation = await newPage()
      await revokedNavigation.context.setCookie(...(await oldBrowser.context.cookies()).filter(cookie => cookie.name.startsWith('cr_')))
      const navigationStatuses = []
      revokedNavigation.page.on('response', response => {
        if (response.request().isNavigationRequest()) navigationStatuses.push(response.status())
      })
      await revokedNavigation.page.goto(`${config.baseUrl}/dashboard`, { waitUntil: 'networkidle0' })
      await revokedNavigation.page.waitForFunction(() => location.pathname === '/login')
      assert.equal(navigationStatuses.some(status => status >= 500), false, 'A revoked signed JWT must not crash server rendering or loop.')
      await revokedNavigation.page.waitForSelector('#email')
      await revokedNavigation.context.close()
      const revokedRefresh = await api(oldBrowser.page, '/api/auth/refresh', jsonPost({}))
      assert.equal(revokedRefresh.status, 401)
      assert.deepEqual((await oldBrowser.context.cookies()).filter(cookie => cookie.name.startsWith('cr_')).map(cookie => cookie.name), [])
      const replay = await api(resetBrowser.page, `/api/auth/reset-password/${resetToken}`, jsonPost({ password: 'MustNeverWin!2026' }))
      assert.equal(replay.status, 400)
      assert.equal(replay.body.code, 'INVALID_TOKEN')
      await login(oldBrowser.page, users.reset, password, 401)
      await login(oldBrowser.page, users.reset, nextPassword)
      assert.equal((await api(oldBrowser.page, '/api/user/settings')).status, 200)
      await oldBrowser.page.goto(`${config.baseUrl}/profile`, { waitUntil: 'networkidle0' })
      await oldBrowser.page.screenshot({ path: path.join(config.artifacts, 'auth-reset-restored-session.png'), fullPage: true })
      results.checks.push({ scenario: 'reset then sign in', resetStatus: 200, oldAccess: 401, revokedSsrPath: '/login', revokedSsrStatuses: navigationStatuses, oldRefresh: 401, consumedToken: 400, oldPassword: 401, newPassword: 200 })
    })

    await t.test('concurrent reset submissions consume the password-bound link exactly once', async () => {
      const resetToken = await token(users.race, 'password_reset')
      const candidates = ['ConcurrentReset!First2026', 'ConcurrentReset!Second2026']
      const outcomes = await Promise.all(candidates.map(value => api(resetBrowser.page, `/api/auth/reset-password/${resetToken}`, jsonPost({ password: value }))))
      assert.deepEqual(outcomes.map(result => result.status).sort(), [200, 400])
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: users.race.id } })
      const winner = outcomes.findIndex(result => result.status === 200)
      assert.equal(await bcrypt.compare(candidates[winner], stored.passwordHash), true)
      assert.equal(await bcrypt.compare(candidates[1 - winner], stored.passwordHash), false)
      results.checks.push({ scenario: 'concurrent reset consumes once', statuses: outcomes.map(result => result.status) })
    })

    await t.test('expired access recovers the protected page and retries a client mutation once; expired refresh returns to login', async () => {
      const recovery = await newPage()
      await session(recovery.context, users.OWNER, { expiredAccess: true })
      const responses = []
      const navigationTrace = []
      const record = response => {
        const pathname = new URL(response.url()).pathname
        if (response.request().isNavigationRequest() || pathname === '/profile' || pathname === '/session' || pathname.startsWith('/api/')) {
          navigationTrace.push({ pathname, method: response.request().method(), status: response.status() })
        }
        if (pathname === '/api/auth/refresh' || (pathname === '/api/user/settings' && response.request().method() === 'PATCH')) {
          responses.push({ pathname, method: response.request().method(), status: response.status() })
        }
      }
      recovery.page.on('response', record)
      try {
        await recovery.page.goto(`${config.baseUrl}/profile`, { waitUntil: 'networkidle0' })
        await recovery.page.waitForSelector('#profile-email')
        assert.equal(await recovery.page.$eval('#profile-email', element => element.value), users.OWNER.email)
        assert.equal(new URL(recovery.page.url()).pathname, '/profile')
        assert.equal(responses.filter(result => result.pathname === '/api/auth/refresh' && result.status === 200).length, 1)
        responses.length = 0
        await session(recovery.context, users.OWNER, { expiredAccess: true })
        await recovery.page.locator('#profile-job-title').fill('E2E renewed session')
        const saved = recovery.page.waitForResponse(response => new URL(response.url()).pathname === '/api/user/settings' && response.request().method() === 'PATCH' && response.status() === 200)
        await button(recovery.page, 'Save changes').click()
        await saved
        await waitText(recovery.page, 'Profile updated.')
        assert.deepEqual(responses.filter(result => result.pathname === '/api/user/settings').map(result => result.status), [401, 200])
        assert.equal(responses.filter(result => result.pathname === '/api/auth/refresh').length, 1)
        assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: users.OWNER.id } })).jobTitle, 'E2E renewed session')
        await recovery.page.screenshot({ path: path.join(config.artifacts, 'auth-expired-access-recovered.png'), fullPage: true })
        results.checks.push({ scenario: 'expired access page recovery and mutation retry', mutationResponses: [...responses] })
        responses.length = 0
        await session(recovery.context, users.OWNER, { expiredAccess: true, expiredRefresh: true })
        await recovery.page.goto(`${config.baseUrl}/profile`, { waitUntil: 'networkidle0' })
        await recovery.page.waitForFunction(() => location.pathname === '/login')
        assert.equal(new URL(recovery.page.url()).searchParams.get('redirect'), '/profile')
        assert.equal(new URL(recovery.page.url()).searchParams.get('reason'), 'session_expired')
        assert.equal(responses.filter(result => result.pathname === '/api/auth/refresh').length, 1)
        assert.equal(responses.find(result => result.pathname === '/api/auth/refresh').status, 401)
        assert.deepEqual((await recovery.context.cookies()).filter(cookie => cookie.name.startsWith('cr_')).map(cookie => cookie.name), [])
        await recovery.page.waitForSelector('#email')
        await recovery.page.screenshot({ path: path.join(config.artifacts, 'auth-expired-refresh-sign-in.png'), fullPage: true })
        results.checks.push({ scenario: 'expired refresh stops at sign in', refreshStatus: 401, cookiesCleared: true, returnPath: '/profile' })
      } finally {
        await fs.writeFile(path.join(config.artifacts, 'auth-session-navigation.json'), JSON.stringify({
          finalPath: new URL(recovery.page.url()).pathname,
          visibleText: await recovery.page.$eval('body', element => element.innerText).catch(() => 'Page unavailable'),
          responses: navigationTrace,
        }, null, 2))
        await recovery.page.screenshot({ path: path.join(config.artifacts, 'auth-session-navigation.png'), fullPage: true }).catch(() => {})
      }
      recovery.page.off('response', record)
    })

    await t.test('five roles enforce member management and supplier report read/write boundaries', async () => {
      let supplierProjectId, supplierReportId, supplierEndpoint
      for (const role of ['OWNER', 'ADMIN', 'EDITOR', 'VIEWER_READONLY', 'VIEWER_VERIFIER']) {
        const current = role === 'OWNER' ? ownerBrowser : await newPage()
        await login(current.page, users[role])
        if (role === 'OWNER') {
          const created = await api(current.page, '/api/projects', jsonPost({
            organization_id: organization.id, name: `Role-boundary supplier ${runId}`,
            type: 'product', template_codes: ['CBAM_DATA_PACKAGE'],
          }))
          assert.equal(created.status, 201)
          supplierProjectId = created.body.project.id
          supplierReportId = created.body.reports.find(report => report.template_code === 'CBAM_DATA_PACKAGE').id
          supplierEndpoint = `/api/projects/${supplierProjectId}/reports/${supplierReportId}/supplier-package`
        }
        assert.ok(supplierEndpoint, 'The owner must create the shared role-boundary fixture.')
        for (const endpoint of [`/api/projects/${supplierProjectId}`, `/api/projects/${supplierProjectId}/reports/${supplierReportId}`, supplierEndpoint]) {
          assert.equal((await api(current.page, endpoint)).status, 200, `${role} reads ${endpoint}`)
        }
        const before = await prisma.project.findUniqueOrThrow({ where: { id: supplierProjectId }, select: { dataset: true, datasetVersion: true } })
        const canEdit = ['OWNER', 'ADMIN', 'EDITOR'].includes(role)
        const fieldId = ({ OWNER: 'cbam_pkg_recipient', ADMIN: 'cbam_pkg_prepared_by', EDITOR: 'cbam_pkg_supplier_role' })[role] ?? 'cbam_pkg_recipient'
        const proposedValue = canEdit ? values[fieldId] : 'READ_ONLY_WRITE_MUST_FAIL'
        const draft = await api(current.page, supplierEndpoint, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expectedDatasetVersion: before.datasetVersion, values: { [fieldId]: proposedValue } }),
        })
        assert.equal(draft.status, canEdit ? 200 : 403, `${role} draft write`)
        const after = await prisma.project.findUniqueOrThrow({ where: { id: supplierProjectId }, select: { dataset: true, datasetVersion: true } })
        if (canEdit) {
          assert.equal(after.datasetVersion, before.datasetVersion + 1)
          assert.equal(draft.body.validation.values[fieldId], proposedValue)
        } else {
          assert.equal(draft.body.code, 'FORBIDDEN')
          assert.deepEqual(after, before, `${role} cannot change stored dataset or version`)
        }
        await current.page.goto(`${config.baseUrl}/settings/members`, { waitUntil: 'networkidle0' })
        await waitText(current.page, users.EDITOR.email)
        const canManage = role === 'OWNER' || role === 'ADMIN'
        assert.equal((await current.page.$$(buttonSelector('Invite member'))).length > 0, canManage, `${role} invite visibility`)
        assert.equal((await current.page.$$(buttonSelector('Open actions'))).length > 0, canManage, `${role} actions visibility`)
        assert.equal((await api(current.page, memberEndpoint)).status, 200)
        if (!canManage) {
          const rejected = await api(current.page, inviteEndpoint, jsonPost({ email: users.outsider.email, role: 'ADMIN' }))
          assert.equal(rejected.status, 403)
          const membership = await prisma.organizationMembership.findUniqueOrThrow({ where: { organizationId_userId: { organizationId: organization.id, userId: users.EDITOR.id } } })
          const changed = await api(current.page, `${memberEndpoint}/${membership.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'ADMIN' }) })
          assert.equal(changed.status, 403)
          const removed = await api(current.page, `${memberEndpoint}/${membership.id}`, { method: 'DELETE' })
          assert.equal(removed.status, 403)
          assert.equal((await prisma.organizationMembership.findUniqueOrThrow({ where: { id: membership.id } })).role, 'EDITOR')
        }
        await current.page.screenshot({ path: path.join(config.artifacts, `roles-${role.toLowerCase()}.png`), fullPage: true })
        results.checks.push({ scenario: `members and report role ${role}`, listStatus: 200, managementVisible: canManage, supplierReadStatus: 200, supplierPatchStatus: draft.status, beforeVersion: before.datasetVersion, afterVersion: after.datasetVersion, ...(canManage ? {} : { inviteStatus: 403, patchStatus: 403, removeStatus: 403 }) })
      }
    })

    await t.test('an existing account can accept or decline its in-app invitation; outsiders and replay are rejected', async () => {
      await ownerBrowser.page.goto(`${config.baseUrl}/settings/members`, { waitUntil: 'networkidle0' })
      await button(ownerBrowser.page, 'Invite member').click()
      await ownerBrowser.page.locator('#invite-email').fill(users.invitee.email)
      const invited = responseFor(ownerBrowser.page, inviteEndpoint, 'POST')
      await ownerBrowser.page.locator('[role="dialog"] button[type="submit"]').click()
      const response = await invited
      assert.equal(response.status(), 201)
      const { invite } = await response.json()
      assert.equal(invite.invite_status, 'pending')
      const invitee = await newPage()
      const outsider = await newPage()
      await login(invitee.page, users.invitee)
      await login(outsider.page, users.outsider)
      const endpoint = `${memberEndpoint}/${invite.membership_id}`
      assert.equal((await api(invitee.page, memberEndpoint)).status, 403, 'Pending invitation grants no organization access.')
      for (const action of ['accept', 'decline']) assert.equal((await api(outsider.page, `${endpoint}/${action}`, jsonPost({}))).status, 403)
      assert.equal((await api(invitee.page, `/api/organizations/${randomUUID()}/members/${invite.membership_id}/accept`, jsonPost({}))).status, 404)
      await invitee.page.goto(`${config.baseUrl}/no-organization`, { waitUntil: 'networkidle0' })
      const accepting = responseFor(invitee.page, `${endpoint}/accept`, 'POST')
      await invitee.page.locator(`button[aria-label=${JSON.stringify(`Accept invitation to ${organization.displayName}`)}]`).click()
      const accepted = await accepting
      assert.equal(accepted.status(), 200)
      assert.equal((await accepted.json()).membership.invite_status, 'accepted')
      await invitee.page.waitForFunction(() => !['/no-organization', '/invitations'].includes(location.pathname))
      assert.equal((await api(invitee.page, memberEndpoint)).status, 200)
      assert.equal((await api(invitee.page, `${endpoint}/accept`, jsonPost({}))).status, 409)
      await invitee.page.goto(`${config.baseUrl}/settings/members`, { waitUntil: 'networkidle0' })
      await waitText(invitee.page, users.OWNER.email)
      assert.equal((await invitee.page.$$(buttonSelector('Invite member'))).length, 0)
      await invitee.page.screenshot({ path: path.join(config.artifacts, 'roles-invitation-accepted.png'), fullPage: true })
      const next = await api(ownerBrowser.page, inviteEndpoint, jsonPost({ email: users.decliner.email, role: 'VIEWER_READONLY' }))
      assert.equal(next.status, 201)
      const decliner = await newPage()
      await login(decliner.page, users.decliner)
      const declineEndpoint = `${memberEndpoint}/${next.body.invite.membership_id}`
      await decliner.page.goto(`${config.baseUrl}/invitations`, { waitUntil: 'networkidle0' })
      const unverifiedAcceptance = responseFor(decliner.page, `${declineEndpoint}/accept`, 'POST')
      await decliner.page.locator(`button[aria-label=${JSON.stringify(`Accept invitation to ${organization.displayName}`)}]`).click()
      const blocked = await unverifiedAcceptance
      assert.equal(blocked.status(), 403)
      assert.equal((await blocked.json()).code, 'EMAIL_NOT_VERIFIED')
      await waitText(decliner.page, 'Verify your email before joining this organization.')
      await decliner.page.waitForSelector('[role="alert"] a[href="/verify-email"]')
      await decliner.page.screenshot({ path: path.join(config.artifacts, 'roles-invitation-needs-email-verification.png'), fullPage: true })
      const declining = responseFor(decliner.page, `${declineEndpoint}/decline`, 'POST')
      await decliner.page.locator(`button[aria-label=${JSON.stringify(`Decline invitation to ${organization.displayName}`)}]`).click()
      const declined = await declining
      assert.equal(declined.status(), 200)
      assert.equal((await declined.json()).membership.invite_status, 'declined')
      await waitText(decliner.page, 'You have no pending invitations.')
      assert.equal((await api(decliner.page, memberEndpoint)).status, 403)
      assert.equal((await api(decliner.page, `${declineEndpoint}/decline`, jsonPost({}))).status, 409)
      results.checks.push({ scenario: 'in-app invitations (creation, acceptance and decline UI)', created: 201, pendingRead: 403, outsiderAccept: 403, outsiderDecline: 403, wrongOrganization: 404, accepted: 200, replay: 409, unverifiedAccept: 403, unverifiedCode: 'EMAIL_NOT_VERIFIED', declined: 200, declinedRead: 403 })
    })

    await t.test('concurrent invite acceptance and role changes cannot overbook the last editor seat', async () => {
      const seatPlan = await prisma.planDefinition.create({ data: {
        planCode: `auth-seat-e2e-${runId}`, label: 'Synthetic two-editor plan',
        maxActiveProjects: 2, maxEditors: 2, maxVerifiers: 1, maxViewers: 10,
      } })
      const actors = {}
      // Reuse the existing verified synthetic users with their current hashes;
      // earlier reset tests deliberately revoked their original credentials.
      for (const label of ['reset', 'race']) {
        const current = await newPage()
        const user = await prisma.user.findUniqueOrThrow({ where: { id: users[label].id } })
        await session(current.context, user)
        await current.page.goto(`${config.baseUrl}/forgot-password`, { waitUntil: 'networkidle0' })
        actors[label] = current
      }
      async function seatFixture(suffix, secondRole = 'EDITOR', secondStatus = 'PENDING') {
        const workspace = await prisma.organization.create({ data: {
          slug: `auth-seat-${suffix}-${runId}`, displayName: `E2E seat race ${suffix}`,
          planCode: seatPlan.planCode, planAssignedAt: new Date(), createdByUserId: users.OWNER.id,
          memberships: { create: [
            { userId: users.OWNER.id, role: 'OWNER', inviteStatus: 'ACCEPTED', joinedAt: new Date() },
            { userId: users.EDITOR.id, role: 'EDITOR', inviteStatus: 'ACCEPTED', joinedAt: new Date() },
            { userId: users.reset.id, role: 'EDITOR', inviteStatus: 'PENDING' },
            { userId: users.race.id, role: secondRole, inviteStatus: secondStatus },
          ] },
        }, include: { memberships: true } })
        const endpointFor = label => `/api/organizations/${workspace.id}/members/${workspace.memberships.find(member => member.userId === users[label].id).id}`
        return { workspace, endpointFor }
      }
      const cases = [
        { name: 'accept versus accept', setup: ['accept'], operations: fixture => [
          api(actors.reset.page, `${fixture.endpointFor('reset')}/accept`, jsonPost({})),
          api(actors.race.page, `${fixture.endpointFor('race')}/accept`, jsonPost({})),
        ] },
        { name: 'accept versus role promotion', setup: ['promotion', 'VIEWER_READONLY', 'ACCEPTED'], operations: fixture => [
          api(actors.reset.page, `${fixture.endpointFor('reset')}/accept`, jsonPost({})),
          api(ownerBrowser.page, fixture.endpointFor('race'), { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'EDITOR' }) }),
        ] },
        { name: 'duplicate concurrent accept', setup: ['duplicate'], operations: fixture => [
          api(actors.reset.page, `${fixture.endpointFor('reset')}/accept`, jsonPost({})),
          api(actors.reset.page, `${fixture.endpointFor('reset')}/accept`, jsonPost({})),
        ] },
      ]
      for (const entry of cases) {
        const fixture = await seatFixture(...entry.setup)
        const outcomes = await Promise.all(entry.operations(fixture))
        assert.deepEqual(outcomes.map(outcome => outcome.status).sort(), [200, 409], entry.name)
        const acceptedEditors = await prisma.organizationMembership.count({ where: {
          organizationId: fixture.workspace.id, role: 'EDITOR', inviteStatus: 'ACCEPTED',
        } })
        assert.equal(acceptedEditors, 2, `${entry.name}: no overbooking`)
        results.checks.push({ scenario: entry.name, statuses: outcomes.map(outcome => outcome.status), editorLimit: 2, acceptedEditors })
      }
      await Promise.all(Object.values(actors).map(actor => actor.context.close()))
    })
    assert.deepEqual(browserErrors, [], 'No uncaught browser errors in authentication and role flows.')
  } finally {
    results.browserErrors = browserErrors
    await fs.writeFile(path.join(config.artifacts, 'auth-role-results.json'), JSON.stringify(results, null, 2))
    await browser.close()
    await prisma.$disconnect()
  }
})
