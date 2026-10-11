import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import puppeteer from 'puppeteer'
import { e2eConfig } from './config.mjs'

const config = e2eConfig()
if (process.env.E2E_CAPTURE_LANDING !== '1' || !process.env.E2E_LANDING_ASSETS) {
  throw new Error('Landing capture is opt-in: E2E_CAPTURE_LANDING=1 and E2E_LANDING_ASSETS are required.')
}
const output = path.resolve(process.env.E2E_LANDING_ASSETS)
const fixture = JSON.parse(await fs.readFile(path.join(config.artifacts, 'preview-fixture.json'), 'utf8'))
const expected = JSON.parse(await fs.readFile(path.join(config.artifacts, 'expected-package.json'), 'utf8'))
assert.equal(fixture.reportId, expected.reportId)
assert.match(fixture.accountEmail, /^owner-\d+@example\.test$/)
assert.equal(fixture.reportPath, `/projects/${fixture.projectId}/reports/${fixture.reportId}`)
const { stdout } = await promisify(execFile)('python3', ['-c', `
import hashlib,json,pathlib,sys,zipfile
root=pathlib.Path(sys.argv[1]); report_id=sys.argv[2]
for archive in sorted(root.glob('downloads-*/cbam-supplier-review-v*.zip'),key=lambda p:p.stat().st_mtime,reverse=True):
    with zipfile.ZipFile(archive) as z:
        data=json.loads(z.read('data.json'))
        if data['metadata']['reportId']==report_id:
            assert z.testzip() is None
            print(json.dumps({'summary':z.read('summary.html').decode(),'zipSha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'datasetVersion':data['metadata']['datasetVersion']}))
            break
else:
    raise SystemExit('No verified fixture ZIP found')
`, config.artifacts, fixture.reportId], { maxBuffer: 1_000_000 })
const exported = JSON.parse(stdout)
assert.equal(exported.datasetVersion, expected.datasetVersion)
await fs.mkdir(output, { recursive: true })
await fs.mkdir(path.join(output, 'sample'), { recursive: true })
await fs.writeFile(path.join(output, 'sample/summary.html'), exported.summary)
const browser = await puppeteer.launch({ headless: true,
  ...(process.env.E2E_CHROME_EXECUTABLE ? { executablePath: process.env.E2E_CHROME_EXECUTABLE } : {}),
  args: ['--lang=en-US', ...(process.env.CI ? ['--no-sandbox'] : [])],
})
const button = (page, text) => page.locator(`::-p-xpath(//button[normalize-space(.)=${JSON.stringify(text)}])`)
const provenance = { source: 'Actual local product UI and actual downloaded synthetic supplier ZIP', projectId: fixture.projectId, reportId: fixture.reportId, datasetVersion: expected.datasetVersion, zipSha256: exported.zipSha256, assets: [] }
try {
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  page.setDefaultTimeout(20_000)
  await page.setViewport({ width: 1600, height: 1700, deviceScaleFactor: 1 })
  await page.goto(`${config.baseUrl}/login`, { waitUntil: 'networkidle0' })
  await page.locator('#email').fill(fixture.accountEmail)
  // This is the fixed disposable registration fixture, never a production account.
  await page.locator('#password').fill('LocalE2e!Pass2026')
  const loggedIn = page.waitForResponse(response => new URL(response.url()).pathname === '/api/auth/login' && response.request().method() === 'POST')
  await button(page, 'Sign in').click()
  assert.equal((await loggedIn).status(), 200)
  await page.waitForFunction(() => location.pathname !== '/login')
  await page.goto(`${config.baseUrl}${fixture.reportPath}`, { waitUntil: 'networkidle0' })
  await page.waitForSelector('nav[aria-label="Supplier package steps"]')
  for (const theme of ['light', 'dark']) {
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }])
    await page.waitForFunction(expectedDark => document.documentElement.classList.contains('dark') === expectedDark, {}, theme === 'dark')
    await new Promise(resolve => setTimeout(resolve, 300))
    for (const [name, step] of [['form', '4. Emissions'], ['review', '6. Review & download']]) {
      await button(page, step).click()
      await page.evaluate(() => document.fonts.ready)
      // This pause belongs to capture only: the real button colour transition
      // must finish before the screenshot, rather than record its halfway state.
      await new Promise(resolve => setTimeout(resolve, 300))
      const framing = await page.$eval('nav[aria-label="Supplier package steps"]', (element, name) => {
        const card = element.nextElementSibling
        if (card?.getAttribute('data-slot') !== 'card') throw new Error('Supplier step Card missing')
        const bounds = target => {
          const box = target.getBoundingClientRect()
          return { left: box.left + scrollX, top: box.top + scrollY, right: box.right + scrollX, bottom: box.bottom + scrollY }
        }
        const box = bounds(card)
        // Keep the real card at its actual CSS size. Exclude the repeated report
        // header and navigation so the review's warnings and download fit.
        const clip = { x: Math.round((box.left + box.right) / 2 - 600), y: Math.floor(box.top - 16), width: 1200, height: 900 }
        const required = name === 'review'
          ? [card, ...Array.from(card.querySelectorAll('button')).filter(button => button.textContent.includes('Download review package'))]
          : ['cbam_pkg_direct_see', 'cbam_pkg_indirect_see'].map(id => document.getElementById(id)?.closest('[id$="-group"]'))
        if (required.length !== 2 || required.some(target => !target)) throw new Error('Required capture content missing')
        const clippingAncestors = []
        for (let ancestor = card.parentElement; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor)
          if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) clippingAncestors.push(bounds(ancestor))
        }
        return { clip, content: required.map(bounds), card: box, clippingAncestors, viewport: { width: innerWidth, height: innerHeight } }
      }, name)
      const { clip } = framing
      assert.ok(clip.x >= 240, 'Crop must exclude the user/sidebar area.')
      assert.ok(clip.y >= 0 && clip.y + clip.height <= framing.viewport.height, 'The entire capture must fit the visible viewport.')
      assert.ok(framing.content.every(box => framing.clippingAncestors.every(ancestor => box.top >= ancestor.top && box.bottom <= ancestor.bottom)), `${name}: required content must be visible inside every scroll/clipping container.`)
      assert.ok(framing.content.every(box => box.left >= clip.x && box.right <= clip.x + clip.width && box.top >= clip.y && box.bottom <= clip.y + clip.height), `${name}: the required review/download or both emissions fields must fit the capture.`)
      const filename = `${name}-${theme}.webp`
      await page.screenshot({ path: path.join(output, filename), type: 'webp', quality: 90, clip, captureBeyondViewport: true })
      provenance.assets.push({ filename, width: 1200, height: 900, theme, source: fixture.reportPath, step, framing: 'Actual step Card at original CSS size; repeated report header and navigation excluded', clip, cardBounds: framing.card, viewport: framing.viewport })
    }
  }
  // Render the newly generated local test export verbatim. No export styles,
  // values, warnings or scope text are modified for the marketing capture.
  const summary = await context.newPage()
  await summary.setViewport({ width: 960, height: 1280, deviceScaleFactor: 1 })
  await summary.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }])
  await summary.setContent(exported.summary, { waitUntil: 'load' })
  await summary.evaluate(() => document.fonts.ready)
  await summary.screenshot({ path: path.join(output, 'summary.webp'), type: 'webp', quality: 90, clip: { x: 0, y: 0, width: 960, height: 1280 } })
  provenance.assets.push({ filename: 'summary.webp', width: 960, height: 1280, source: 'summary.html in verified browser download', theme: 'export original' })
  provenance.assets.push({ filename: 'sample/summary.html', source: 'summary.html in verified browser download', unmodified: true })
  await fs.writeFile(path.join(config.artifacts, 'landing-capture-provenance.json'), JSON.stringify(provenance, null, 2))
  await fs.writeFile(path.join(output, 'sample/provenance.json'), JSON.stringify(provenance, null, 2))
  console.log(`Captured ${provenance.assets.length} synthetic product assets into ${output}`)
} finally {
  await browser.close()
}
