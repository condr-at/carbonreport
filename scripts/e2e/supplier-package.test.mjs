import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import puppeteer from 'puppeteer'
import { e2eConfig } from './config.mjs'
import { evidence, groups, values } from './fixture.mjs'

const config = e2eConfig()
const exec = promisify(execFile)
const downloadLabel = 'Download review package (.zip)'
const buttonSelector = text => `::-p-xpath(//button[normalize-space(.)=${JSON.stringify(text)}])`
const button = (page, text) => page.locator(buttonSelector(text))
const waitText = (page, text) => page.waitForFunction(value => document.body.innerText.includes(value), {}, text)
const responseFor = (page, pathname, method) => page.waitForResponse(response => new URL(response.url()).pathname === pathname && response.request().method() === method)

async function field(page, id, value) {
  const selector = `#${id}`
  await page.waitForSelector(selector, { visible: true })
  const kind = await page.$eval(selector, element => ({ tag: element.tagName, type: element.getAttribute('type') }))
  if (kind.tag === 'SELECT') return page.select(selector, value)
  if (kind.type === 'date') {
    // Puppeteer's date fill sets the DOM value. Real keyboard changes also update
    // React's controlled state, without depending on OS day/month segment order.
    await page.locator(selector).fill(value)
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Tab')
  } else await page.locator(selector).fill(value)
  assert.equal(await page.$eval(selector, element => element.value), value, id)
}

async function api(page, pathname, options = {}) {
  return page.evaluate(async ({ pathname, options }) => {
    const response = await fetch(pathname, options)
    const text = await response.text()
    return { status: response.status, text, contentType: response.headers.get('content-type') }
  }, { pathname, options })
}

async function register(page, email, name) {
  await page.goto(`${config.baseUrl}/register`, { waitUntil: 'networkidle0' })
  await field(page, 'name', name)
  await field(page, 'email', email)
  await field(page, 'password', 'LocalE2e!Pass2026')
  await field(page, 'confirmPassword', 'LocalE2e!Pass2026')
  const registered = responseFor(page, '/api/auth/register', 'POST')
  await button(page, 'Create account').click()
  const response = await registered
  assert.equal(response.status(), 201, `Fresh registration: ${await response.text()}`)
  await page.waitForFunction(() => location.pathname === '/verify-email')
  assert.equal((await response.json()).user.email, email)
}

test('fresh browser registration → supplier ZIP, persisted data, invalid input and outsider isolation', { timeout: 240_000 }, async t => {
  const failures = []
  const browser = await puppeteer.launch({
    headless: true,
    ...(process.env.E2E_CHROME_EXECUTABLE ? { executablePath: process.env.E2E_CHROME_EXECUTABLE } : {}),
    args: ['--lang=en-US', ...(process.env.CI ? ['--no-sandbox'] : [])],
  })
  const ownerContext = await browser.createBrowserContext()
  const outsiderContext = await browser.createBrowserContext()
  const owner = await ownerContext.newPage()
  const outsider = await outsiderContext.newPage()
  for (const page of [owner, outsider]) {
    page.setDefaultTimeout(20_000)
    await page.setViewport({ width: 1440, height: 1100 })
    await page.emulateTimezone('UTC')
    page.on('pageerror', error => failures.push(String(error)))
  }
  const downloads = await fs.mkdtemp(path.join(config.artifacts, 'downloads-'))
  await ownerContext.setDownloadBehavior({ policy: 'allow', downloadPath: downloads })
  const runId = `${Date.now()}`
  const projectName = 'Hot-rolled steel — Supplier package'
  let projectId, reportId, endpoint, saved
  try {
    await t.test('register and create organization, product and supplier report through UI', async () => {
      await register(owner, `owner-${runId}@example.test`, 'E2E Owner')
      // Registration issues a session; delivery of a real email is deliberately disabled locally.
      await owner.locator('a[href="/dashboard"]').click()
      await owner.locator('a[href="/settings/profile?mode=create"]').click()
      await field(owner, 'new-org-name', `E2E organization ${runId}`)
      const organizationResponse = responseFor(owner, '/api/organizations', 'POST')
      await owner.locator('[role="dialog"] button[type="submit"]').click()
      assert.equal((await organizationResponse).status(), 201)
      await owner.waitForFunction(() => location.pathname === '/settings/profile' && !location.search)
      await owner.goto(`${config.baseUrl}/projects`, { waitUntil: 'networkidle0' })
      await owner.locator('a[href="/projects/new"]').click()
      await owner.locator('button[aria-labelledby="product-project-title"]').click()
      await field(owner, 'name', projectName)
      await button(owner, 'Skip to Report Selection').click()
      await owner.locator('#CBAM_DATA_PACKAGE').click()
      const projectResponse = responseFor(owner, '/api/projects', 'POST')
      await button(owner, 'Create Project (1 report)').click()
      const response = await projectResponse
      assert.equal(response.status(), 201, await response.text())
      const created = await response.json()
      projectId = created.project.id
      reportId = created.reports.find(report => report.template_code === 'CBAM_DATA_PACKAGE').id
      endpoint = `/api/projects/${projectId}/reports/${reportId}/supplier-package`
      await fs.writeFile(path.join(config.artifacts, 'preview-fixture.json'), JSON.stringify({
        label: 'Synthetic E2E demonstration, not a customer or accepted regulatory report',
        accountEmail: `owner-${runId}@example.test`, projectId, reportId,
        reportPath: `/projects/${projectId}/reports/${reportId}`,
        datasetPath: `/projects/${projectId}/dataset`,
        passwordSource: 'Fixed local registration fixture in scripts/e2e/supplier-package.test.mjs',
      }, null, 2))
      await owner.waitForFunction(id => location.pathname === `/projects/${id}`, {}, projectId)
      await owner.locator(`a[href="/projects/${projectId}/reports/${reportId}"]`).click()
      await waitText(owner, 'CBAM Supplier Review Package')
    })
    assert.ok(endpoint, 'Onboarding must complete before subsequent checks.')

    await t.test('empty download is blocked; incomplete and invalid drafts persist; fixing input restores readiness', async () => {
      await button(owner, '6. Review & download').click()
      assert.equal(await owner.$eval(buttonSelector(downloadLabel), element => element.disabled), true)
      for (const [step, entries] of groups) {
        await button(owner, step).click()
        for (const [id, value] of Object.entries(entries)) await field(owner, id, value)
        if (step === '5. Evidence') {
          await button(owner, 'Add evidence reference').click()
          for (const [key, value] of Object.entries(evidence)) await field(owner, `evidence-0-${key}`, value)
        }
        const saving = responseFor(owner, endpoint, 'PATCH')
        await button(owner, 'Save draft').click()
        const response = await saving
        assert.equal(response.status(), 200, await response.text())
        saved = await response.json()
        await waitText(owner, `Saved version ${saved.datasetVersion}`)
      }
      assert.equal(saved.validation.isReady, true, JSON.stringify(saved.validation.issues))
      await owner.reload({ waitUntil: 'networkidle0' })
      for (const [step, entries] of groups) {
        await button(owner, step).click()
        for (const [id, value] of Object.entries(entries)) assert.equal(await owner.$eval(`#${id}`, element => element.value), value, `Reload: ${id}`)
      }
      await button(owner, '4. Emissions').click()
      await field(owner, 'cbam_pkg_direct_see', '-1')
      const invalidSave = responseFor(owner, endpoint, 'PATCH')
      await button(owner, 'Save draft').click()
      const invalid = await invalidSave
      assert.equal(invalid.status(), 200, 'Incomplete/invalid strings are allowed in saved drafts.')
      saved = await invalid.json()
      assert.equal(saved.validation.isReady, false)
      assert.ok(saved.validation.issues.some(issue => issue.fieldId === 'cbam_pkg_direct_see' && issue.severity === 'error'))
      await owner.reload({ waitUntil: 'networkidle0' })
      await button(owner, '4. Emissions').click()
      assert.equal(await owner.$eval('#cbam_pkg_direct_see', element => element.value), '-1')
      await button(owner, '6. Review & download').click()
      assert.equal(await owner.$eval(buttonSelector(downloadLabel), element => element.disabled), true)
      const rejectedZip = await api(owner, `${endpoint}?format=zip&expectedDatasetVersion=${saved.datasetVersion}`)
      assert.equal(rejectedZip.status, 422)
      await button(owner, '4. Emissions').click()
      await field(owner, 'cbam_pkg_direct_see', '2.5')
      const corrected = responseFor(owner, endpoint, 'PATCH')
      await button(owner, 'Save draft').click()
      const response = await corrected
      assert.equal(response.status(), 200)
      saved = await response.json()
      assert.equal(saved.validation.isReady, true)
      for (const [id, value] of Object.entries(values)) assert.equal(saved.validation.values[id], value, id)
      await button(owner, '6. Review & download').click()
      await waitText(owner, 'Ready for recipient review')
      await owner.screenshot({ path: path.join(config.artifacts, 'owner-ready.png'), fullPage: true })
    })
    assert.ok(saved?.validation.isReady, 'Stop dependent checks if a ready saved package was not reached.')

    await t.test('a separately registered user cannot list, read, update or export owner data', async () => {
      await register(outsider, `outsider-${runId}@example.test`, 'E2E Outsider')
      const list = await api(outsider, '/api/projects')
      assert.equal(list.status, 200)
      assert.deepEqual(JSON.parse(list.text).projects, [])
      const denied = []
      for (const pathname of [`/api/projects/${projectId}`, `/api/projects/${projectId}/dataset`, `/api/projects/${projectId}/reports/${reportId}`, endpoint, `${endpoint}?format=zip&expectedDatasetVersion=${saved.datasetVersion}`]) {
        const result = await api(outsider, pathname)
        assert.equal(result.status, 403, pathname)
        assert.equal(JSON.parse(result.text).code, 'FORBIDDEN')
        assert.equal(result.text.includes(projectName), false)
        denied.push({ pathname, status: result.status })
      }
      const write = await api(outsider, endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expectedDatasetVersion: saved.datasetVersion, values: { cbam_pkg_recipient: 'OUTSIDER_WRITE_MUST_FAIL' } }) })
      assert.equal(write.status, 403)
      const unchanged = JSON.parse((await api(owner, endpoint)).text)
      assert.equal(unchanged.datasetVersion, saved.datasetVersion)
      assert.equal(unchanged.validation.values.cbam_pkg_recipient, values.cbam_pkg_recipient)
      await fs.writeFile(path.join(config.artifacts, 'access-results.json'), JSON.stringify({ denied, patchStatus: write.status, unchangedVersion: unchanged.datasetVersion }, null, 2))
      const leaks = []
      const ssrResults = []
      for (const [name, pathname] of [['overview', `/projects/${projectId}`], ['dataset', `/projects/${projectId}/dataset`], ['report', `/projects/${projectId}/reports/${reportId}`]]) {
        const navigation = await outsider.goto(`${config.baseUrl}${pathname}`, { waitUntil: 'networkidle0' })
        const html = await navigation.text()
        const visible = await outsider.$eval('body', element => element.innerText)
        await fs.writeFile(path.join(config.artifacts, `outsider-${name}.html`), html)
        await outsider.screenshot({ path: path.join(config.artifacts, `outsider-${name}.png`), fullPage: true })
        ssrResults.push({ pathname, status: navigation.status(), visible })
        for (const privateValue of [projectName, values.cbam_pkg_recipient, values.product_name]) {
          if (html.includes(privateValue) || visible.includes(privateValue)) leaks.push({ pathname, privateValue })
        }
      }
      await fs.writeFile(path.join(config.artifacts, 'outsider-ssr-results.json'), JSON.stringify(ssrResults, null, 2))
      assert.deepEqual(leaks, [], 'Neither streamed HTML nor visible pages may contain another organization\'s data.')
    })

    await t.test('actual browser ZIP matches saved version, independent arithmetic and CSV evidence', async () => {
      const expected = { projectId, reportId, datasetVersion: saved.datasetVersion, values }
      const expectedPath = path.join(config.artifacts, 'expected-package.json')
      await fs.writeFile(expectedPath, JSON.stringify(expected, null, 2))
      const downloadResponse = owner.waitForResponse(response => response.url().includes(`${endpoint}?format=zip`) && response.request().method() === 'GET')
      await button(owner, downloadLabel).click()
      assert.equal((await downloadResponse).status(), 200)
      const archive = path.join(downloads, `cbam-supplier-review-v${saved.datasetVersion}.zip`)
      let downloaded = false
      for (let attempt = 0; attempt < 100; attempt++) {
        try { if ((await fs.stat(archive)).size > 0) { downloaded = true; break } } catch { /* file not ready yet */ }
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      assert.ok(downloaded, 'A real ZIP file must appear in the browser download directory.')
      const { stdout } = await exec('python3', ['scripts/e2e/verify-zip.py', archive, expectedPath])
      await fs.writeFile(path.join(config.artifacts, 'zip-verification.json'), stdout)
      console.log(stdout.trim())
    })

    await t.test('questionnaire Next shows final trade questions before an explicit finish', async () => {
      await owner.goto(`${config.baseUrl}/projects/new`, { waitUntil: 'networkidle0' })
      await owner.locator('button[aria-labelledby="product-project-title"]').click()
      await field(owner, 'name', 'E2E questionnaire navigation only')
      await button(owner, 'Next: Questionnaire').click()
      const choose = id => owner.locator(`[id=${JSON.stringify(id)}]`).click()
      for (const id of ['Q0.1-OTHER', 'Q0.2-MANUFACTURING', 'Q0.3-EMP_<50', 'Q0.4-REV_<10M', 'Q0.5-PRIVATE']) await choose(id)
      await button(owner, 'Далее').click()
      await choose('Q1.1-CLIENT_EXISTING')
      await choose('Q3.1-PRODUCT_INFO')
      await owner.locator('[aria-labelledby="Q3.3-label"]').fill('Synthetic steel product')
      await choose('Q3.3a-CERT_NOT_REQUIRED')
      await button(owner, 'Далее').click()
      for (const id of ['Q8.1-PROCESS_EMISSIONS', 'Q8.2-GRID_ELECTRICITY', 'Q8.3-SCOPE1_2_ONLY']) await choose(id)
      const unexpectedNavigations = []
      const recordNavigation = frame => { if (frame === owner.mainFrame() && frame.url().includes('/select-reports')) unexpectedNavigations.push(frame.url()) }
      owner.on('framenavigated', recordNavigation)
      await button(owner, 'Далее').click()
      await waitText(owner, 'Есть ли экспорт в ЕС?')
      await owner.waitForNetworkIdle({ idleTime: 500 })
      assert.equal(new URL(owner.url()).pathname, '/projects/new/questionnaire')
      assert.deepEqual(unexpectedNavigations, [])
      const tradeRadios = await owner.$$eval('[role="radiogroup"][aria-labelledby="Q9.1-label"] [role="radio"]', elements => elements.map(element => element.getAttribute('aria-checked')))
      assert.ok(tradeRadios.length > 0, 'The final trade question must render its answer options.')
      assert.ok(tradeRadios.every(checked => checked === 'false'), 'The final trade question must remain unanswered until the user chooses.')
      await owner.screenshot({ path: path.join(config.artifacts, 'questionnaire-final-step.png'), fullPage: true })
      owner.off('framenavigated', recordNavigation)
      await button(owner, 'Перейти к выбору отчётов').click()
      await owner.waitForFunction(() => location.pathname === '/projects/new/select-reports')
      await fs.writeFile(path.join(config.artifacts, 'questionnaire-navigation.json'), JSON.stringify({ finalStepSeen: true, prematureNavigations: unexpectedNavigations, explicitFinishPath: new URL(owner.url()).pathname }, null, 2))
    })
  } finally {
    for (const [name, page] of [['owner', owner], ['outsider', outsider]]) {
      await page.screenshot({ path: path.join(config.artifacts, `${name}-final.png`), fullPage: true }).catch(() => {})
    }
    await fs.writeFile(path.join(config.artifacts, 'browser-errors.json'), JSON.stringify(failures, null, 2))
    await browser.close()
  }
})
