# Supplier package browser regression

`npm run test:e2e` builds an isolated production Next app and runs the existing Puppeteer browser against a **disposable local Postgres database**. It creates both users through registration, then creates an organization, product and supplier report through the UI. It verifies saved drafts across reloads, rejects a negative direct-emissions value for export, tests a second user's read/write/download denial and SSR data isolation, and downloads a real ZIP. Python's standard `zipfile`/`csv` modules independently check CRC, the five files, saved version/values, separate 30/6 calculations and evidence consistency.

The runner also executes `test:sanity` before building. A focused questionnaire regression checks that a single Next click on the penultimate step displays the unanswered trade questions and stays on the questionnaire; only the explicit final action may navigate to report selection. That check does not create another project.

The suite **resets the entire configured database**. It refuses any database that is not on loopback and named `*_e2e_test`, rejects URL query overrides, and requires `E2E_RESET_DATABASE=1`. It also refuses dev port 3000 and an occupied test port. It does not read/copy `.env` files or call the application demo seed/integration cleanup. Existing local development, integration and production databases must not be used.

Create a separate database, then configure only synthetic local credentials:

```sh
createdb carbonreport_e2e_test
E2E_DATABASE_URL=postgresql://localhost:5432/carbonreport_e2e_test \
E2E_RESET_DATABASE=1 npm run test:e2e
```

Optional variables: `E2E_PORT` (default 3108), `E2E_NODE_MODULES` (reuse a known dependency installation), `E2E_CHROME_EXECUTABLE` (existing Chrome), and `E2E_ARTIFACTS` (default `.artifacts/e2e`). No additional JS dependency is needed. Node 22, Postgres, Python 3 and Chrome/Puppeteer's downloaded browser are required. `npm run test:e2e:guards` exercises only the safety checks and does not access a database or browser.

One temporary source/build directory is created under the OS temp directory; dependencies are symlinked, `.env` files/user uploads are excluded, and the owned directory is removed after the run. Budget about 500 MB additional build space; the runner requires at least 1.5 GB free. Screenshots, browser errors, exact expected values, downloaded ZIP, independent verification and combined build/server/test logs remain in the artifact directory. Do not upload secrets or production data there.

GitHub Actions uses its own Postgres 16 service, runner Chrome, synthetic credentials and a seven-day artifact retention. There is no deployment step or cloud secret access. Real email delivery/verification, file storage and regulatory/customer acceptance are outside this local regression: registration creates an authenticated session and outbound email/cloud credentials are blanked. The January 2026 fixture is synthetic, partial-period data valid for the definitive period; it is not a legal golden case.
