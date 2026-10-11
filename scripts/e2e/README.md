# Supplier package, authentication and role browser regression

`npm run test:e2e` builds an isolated production Next app and runs the existing Puppeteer browser against a **disposable local Postgres database**. It creates both users through registration, then creates an organization, product and supplier report through the UI. It verifies saved drafts across reloads, rejects a negative direct-emissions value for export, tests a second user's read/write/download denial and SSR data isolation, and downloads a real ZIP. Python's standard `zipfile`/`csv` modules independently check CRC, the five files, saved version/values, separate 30/6 calculations and evidence consistency.

The runner also executes `test:sanity` before building. A focused questionnaire regression checks that a single Next click on the penultimate step displays the unanswered trade questions and stays on the questionnaire; only the explicit final action may navigate to report selection. That check does not create another project.

Authentication and role regression uses additional synthetic users and memberships in that same disposable database. It tests malformed, expired, consumed and concurrently submitted password-reset tokens; old-password and old-session rejection after reset; recovery of an expired access token on navigation and a profile save; rejection of an expired refresh token; and the member screen/API for owner, admin, editor, viewer and verifier. Invitations are created through the member screen and checked for recipient identity, pending-access denial, acceptance, decline and replay. Reset/expiry JWTs are signed locally with the runner's fixed test secret, and direct Prisma fixture access fails closed unless both database URLs and the secret match the isolated runner. These checks are distinct from receiving a real email and clicking its delivered link. `auth-role-results.json` and screenshots retain statuses and visible results without tokens or cookies.

Dataset safety regression exercises the general dataset table against real saved records. Two browser sessions edit the same stale field; a synthetic HTTP 500 keeps a draft through reload; and a real API commit followed by a deliberately lost browser response tests that retry does not write twice. Session-expiry tests use two accounts with write access to the same workspace, so authorization cannot conceal an accidentally submitted foreign draft. `data-safety-results.json` retains expected/observed values, versions, response statuses and any remaining failure screens. Network fault injection and locally signed expired tokens are test controls, not evidence of an actual production outage.

The suite **resets the entire configured database**. It refuses any database that is not on loopback and named `*_e2e_test`, rejects URL query overrides, and requires `E2E_RESET_DATABASE=1`. It also refuses dev port 3000 and an occupied test port. It does not read/copy `.env` files or call the application demo seed/integration cleanup. Existing local development, integration and production databases must not be used.

Create a separate database, then configure only synthetic local credentials:

```sh
createdb carbonreport_e2e_test
E2E_DATABASE_URL=postgresql://localhost:5432/carbonreport_e2e_test \
E2E_RESET_DATABASE=1 npm run test:e2e
```

Optional variables: `E2E_PORT` (default 3108), `E2E_NODE_MODULES` (reuse a known dependency installation), `E2E_CHROME_EXECUTABLE` (existing Chrome), and `E2E_ARTIFACTS` (default `.artifacts/e2e`). No additional JS dependency is needed. Node 22, Postgres, Python 3 and Chrome/Puppeteer's downloaded browser are required. `npm run test:e2e:guards` exercises only the safety checks and does not access a database or browser.

`E2E_CAPTURE_LANDING=1` optionally captures the verified synthetic Northstar Metals supplier fixture after every browser test passes. It writes cropped actual form/review screens in light/dark themes to `public/landing/{form,review}-{light,dark}.webp` (1200×900) and a rendering of the downloaded HTML summary to `public/landing/summary.webp` (960×1280). The form shows step 4, Emissions. The crop keeps the active step card at its actual CSS size, excluding the account/sidebar and repeated report header. Capture asserts that both emissions values fit the form image and that the entire review card, including warnings and Download, fits the review image. The actual exported HTML is also saved verbatim at `public/landing/sample/summary.html`, with `sample/provenance.json`. Fixture IDs, source ZIP hash, dataset version and capture provenance also remain in the test artifact directory; account credentials are not exported. The standalone `capture-landing.mjs` can also run against an existing guarded local app with the same artifact directory and an explicit `E2E_LANDING_ASSETS` destination; it performs no database reset.

After capture, the separate read-only landing check runs against an existing local preview; it does not build, reset the database or create accounts:

```sh
E2E_LANDING_BASE_URL=http://localhost:3109 node --test scripts/e2e/landing.test.mjs
```

It checks widths 360, 390, 768 and 1440 in both system themes, live OS-theme changes without reload, visible images, horizontal overflow, navigation anchors, the actual sample HTML, registration/sign-in CTAs, mobile menu controls and keyboard-operated FAQ answers. Missing capture assets fail immediately. `E2E_LANDING_ARTIFACTS` controls the evidence destination (default `.artifacts/landing`); the existing Chrome override also applies. Run this only after the preview has the captured assets. It is intentionally separate from the database runner because capture happens after that suite succeeds.

One temporary source/build directory is created under the OS temp directory; dependencies are symlinked, `.env` files/user uploads are excluded, and the owned directory is removed after the run. Budget about 500 MB additional build space; the runner requires at least 1.5 GB free. Screenshots, browser errors, exact expected values, downloaded ZIP, independent verification and combined build/server/test logs remain in the artifact directory. Do not upload secrets or production data there.

GitHub Actions uses its own Postgres 16 service, runner Chrome, synthetic credentials and a seven-day artifact retention. There is no deployment step or cloud secret access. Real email delivery/verification, file storage and regulatory/customer acceptance are outside this local regression: registration creates an authenticated session and outbound email/cloud credentials are blanked. The January 2026 fixture is synthetic, partial-period data valid for the definitive period; it is not a legal golden case.

The main runner also checks the public landing page at 360/390/768/1440 px in both system themes, including live OS theme changes, all images, mobile navigation, keyboard FAQ and public calls to action. In capture mode it copies the newly captured assets into the isolated server before these checks.
