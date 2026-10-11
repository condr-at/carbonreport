import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer'

// Read-only standalone UI checks: no Prisma, DB reset, account or email required.
const baseUrl = new URL(process.env.E2E_LANDING_BASE_URL ?? 'http://localhost:3109')
if (!['http:', 'https:'].includes(baseUrl.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(baseUrl.hostname) || baseUrl.pathname !== '/' || baseUrl.search || baseUrl.hash) {
  throw new Error('Landing checks require a local preview origin, for example http://localhost:3109.')
}
const artifacts = path.resolve(process.env.E2E_LANDING_ARTIFACTS ?? '.artifacts/landing')
const settle = () => new Promise(resolve => setTimeout(resolve, 300))

async function checkImages(page) {
  for (const image of await page.$$('main img')) {
    if (!(await image.boundingBox())) continue
    await image.scrollIntoView()
    await page.waitForFunction(element => element.complete && element.naturalWidth > 0, {}, image)
  }
  const images = await page.$$eval('main img', elements => elements.filter(element => element.getClientRects().length > 0).map(element => ({
    source: element.currentSrc, alt: element.alt, complete: element.complete, width: element.naturalWidth, height: element.naturalHeight,
  })))
  assert.equal(images.length, 3, 'The visible hero, form and summary images must load in each theme.')
  assert.ok(images.every(image => image.complete && image.width > 0 && image.height > 0 && image.alt.trim()))
  return images
}

async function checkOverflow(page) {
  const bounds = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }))
  assert.ok(bounds.document <= bounds.viewport + 1 && bounds.body <= bounds.viewport + 1, `Horizontal overflow: ${JSON.stringify(bounds)}`)
  return bounds
}

async function selectSystemTheme(page, theme) {
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }])
  await page.waitForFunction(dark => document.documentElement.classList.contains('dark') === dark, {}, theme === 'dark')
  await settle()
}

async function mobileMenu(page) {
  const open = () => page.locator('button[aria-label="Open navigation"]').click()
  await open()
  assert.equal(await page.$eval('[aria-controls="landing-navigation"]', element => element.getAttribute('aria-expanded')), 'true')
  await page.keyboard.press('Escape')
  await page.waitForSelector('button[aria-label="Open navigation"]')
  assert.equal(await page.$eval('[aria-controls="landing-navigation"]', element => element.getAttribute('aria-expanded')), 'false')
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-controls')), 'landing-navigation', 'Escape should restore focus to the trigger.')
  await open()
  await page.locator('button[aria-label="Close navigation"]').click()
  assert.equal(await page.$eval('[aria-controls="landing-navigation"]', element => element.getAttribute('aria-expanded')), 'false')
  await open()
  await page.locator('#landing-navigation a[href="#faq"]').click()
  await page.waitForFunction(() => location.hash === '#faq')
  assert.equal(await page.$eval('[aria-controls="landing-navigation"]', element => element.getAttribute('aria-expanded')), 'false', 'Following a menu link should close the menu.')
}

async function faqKeyboard(page) {
  const summaries = await page.$$('#faq details > summary')
  assert.equal(summaries.length, 6)
  for (const summary of summaries) {
    await summary.focus()
    assert.equal(await summary.evaluate(element => element.parentElement.open), false)
    await page.keyboard.press('Enter')
    assert.equal(await summary.evaluate(element => element.parentElement.open), true, 'Enter opens the answer.')
    await page.keyboard.press('Space')
    assert.equal(await summary.evaluate(element => element.parentElement.open), false, 'Space closes the answer.')
  }
}

test('landing responsive layout, system themes and public navigation', { timeout: 180_000 }, async t => {
  await fs.mkdir(artifacts, { recursive: true })
  // Fail with an actionable prerequisite before opening the browser. Do not
  // silently skip broken/missing screenshots on a half-built landing page.
  for (const pathname of ['/landing/form-light.webp', '/landing/form-dark.webp', '/landing/review-light.webp', '/landing/review-dark.webp', '/landing/summary.webp', '/landing/sample/summary.html']) {
    const response = await fetch(new URL(pathname, baseUrl), { signal: AbortSignal.timeout(10000) })
    assert.equal(response.status, 200, `${pathname}: run the opt-in capture first and expose its assets in this preview.`)
  }
  const browser = await puppeteer.launch({ headless: true,
    ...(process.env.E2E_CHROME_EXECUTABLE ? { executablePath: process.env.E2E_CHROME_EXECUTABLE } : {}),
    args: ['--lang=en-US', ...(process.env.CI ? ['--no-sandbox'] : [])],
  })
  const evidence = { origin: baseUrl.origin, viewports: [], links: [], browserErrors: [] }
  try {
    for (const width of [360, 390, 768, 1440]) {
      for (const theme of ['light', 'dark']) {
        await t.test(`${width}px ${theme}: images, overflow, live system-theme change and keyboard controls`, async () => {
          const context = await browser.createBrowserContext()
          const page = await context.newPage()
          page.setDefaultTimeout(15000)
          page.on('pageerror', error => evidence.browserErrors.push(String(error)))
          await page.setViewport({ width, height: 900, deviceScaleFactor: 1 })
          await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme }])
          try {
            assert.equal((await page.goto(baseUrl.href, { waitUntil: 'networkidle0' })).status(), 200)
            await page.waitForSelector('h1')
            await selectSystemTheme(page, theme)
            assert.ok([null, 'system'].includes(await page.evaluate(() => localStorage.getItem('theme'))), 'The default should follow the OS.')
            const originalUrl = page.url()
            const originalBackground = await page.$eval('.landing', element => getComputedStyle(element).backgroundColor)
            let navigations = 0
            page.on('framenavigated', frame => { if (frame === page.mainFrame()) navigations++ })
            await selectSystemTheme(page, theme === 'light' ? 'dark' : 'light')
            assert.notEqual(await page.$eval('.landing', element => getComputedStyle(element).backgroundColor), originalBackground)
            assert.equal(page.url(), originalUrl)
            assert.equal(navigations, 0, 'An OS theme change must update the open page without reloading.')
            await selectSystemTheme(page, theme)
            const images = await checkImages(page)
            const bounds = await checkOverflow(page)
            if (width <= 780) await mobileMenu(page)
            await faqKeyboard(page)
            await checkOverflow(page)
            await page.evaluate(() => window.scrollTo(0, 0))
            await settle()
            const screenshot = `landing-${width}-${theme}.png`
            await page.screenshot({ path: path.join(artifacts, screenshot), fullPage: true })
            evidence.viewports.push({ width, theme, bounds, images, liveThemeChangeWithoutReload: true, keyboardFaq: true, mobileMenu: width <= 780, screenshot })
          } finally {
            await context.close()
          }
        })
      }
    }
    await t.test('anchors, sample popup and sign-in/registration calls to action work', async () => {
      const context = await browser.createBrowserContext()
      const page = await context.newPage()
      page.setDefaultTimeout(15000)
      await page.setViewport({ width: 1440, height: 1000 })
      await page.goto(baseUrl.href, { waitUntil: 'networkidle0' })
      const links = await page.$$eval('.landing a[href]', elements => elements.map(element => ({ href: element.getAttribute('href'), text: element.textContent.trim(), target: element.target })))
      assert.ok(links.some(link => link.href === '/register'))
      assert.ok(links.some(link => link.href === '/login'))
      const unique = [...new Set(links.map(link => link.href))]
      for (const href of unique) {
        if (href.startsWith('#')) {
          assert.equal(await page.evaluate(id => Boolean(document.getElementById(id)), href.slice(1)), true, `Missing anchor target ${href}`)
        } else {
          const target = new URL(href, baseUrl)
          assert.equal(target.origin, baseUrl.origin, `Unexpected external CTA: ${href}`)
          const response = await fetch(target, { signal: AbortSignal.timeout(10000) })
          assert.equal(response.status, 200, href)
          evidence.links.push({ href, status: response.status })
        }
      }
      await page.keyboard.press('Tab')
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('href')), '#main-content')
      await page.keyboard.press('Enter')
      await page.waitForFunction(() => location.hash === '#main-content')
      for (const href of unique.filter(value => value.startsWith('#') && value !== '#main-content')) {
        const handles = await page.$$(`a[href=${JSON.stringify(href)}]`)
        let clicked = false
        for (const handle of handles) {
          if (await handle.boundingBox()) { await handle.click(); clicked = true; break }
        }
        assert.equal(clicked, true, `No accessible link for ${href}`)
        await page.waitForFunction(expected => location.hash === expected, {}, href)
        evidence.links.push({ href, targetExists: true, navigated: true })
      }
      const popupPromise = new Promise(resolve => page.once('popup', resolve))
      await page.locator('a[href="/landing/sample/summary.html"]').click()
      const popup = await popupPromise
      await popup.waitForSelector('h1')
      assert.equal(new URL(popup.url()).pathname, '/landing/sample/summary.html')
      const sample = await popup.$eval('body', element => element.innerText)
      assert.match(sample, /Ready for recipient review/)
      assert.match(sample, /Northstar Metals/)
      assert.match(sample, /Hot-rolled steel coils/)
      await popup.close()
      await page.locator('.landing-hero a[href="/register"]').click()
      await page.waitForFunction(() => location.pathname === '/register')
      await page.waitForSelector('#confirmPassword')
      await page.goto(baseUrl.href, { waitUntil: 'networkidle0' })
      await page.locator('footer a[href="/login"]').click()
      await page.waitForFunction(() => location.pathname === '/login')
      await page.waitForSelector('#password')
      evidence.links.push({ samplePopupOpened: true, registrationFormOpened: true, loginFormOpened: true })
      await context.close()
    })
    assert.deepEqual(evidence.browserErrors, [])
  } finally {
    await fs.writeFile(path.join(artifacts, 'landing-results.json'), JSON.stringify(evidence, null, 2))
    await browser.close()
  }
})
