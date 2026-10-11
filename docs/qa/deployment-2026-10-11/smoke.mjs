// Read-only production smoke: no account creation or authenticated data changes.
import fs from 'node:fs/promises'

const base = process.argv[2] ?? 'https://carbonreport.app'
const destination = process.argv[3]
const cases = [
  ['GET', '/', 200],
  ['GET', '/login', 200],
  ['GET', '/register', 200],
  ['GET', '/contacts', 307],
  ['GET', '/contacts/deployment-smoke', 307],
  ['GET', '/requests', 307],
  ['GET', '/dashboard', 307],
  ['GET', '/api/projects', 401],
  ['POST', '/api/auth/login', 401],
]
const checks = await Promise.all(cases.map(async ([method, path, expected]) => {
  const response = await fetch(base + path, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(30000),
    ...(method === 'POST' ? {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'deployment-smoke-no-account@example.test',
        password: 'NotARealAccount-20261011!',
      }),
    } : {}),
  })
  const body = await response.text()
  const location = response.headers.get('location')
  const redirectOk = expected !== 307 || (
    location && new URL(location, base).pathname === '/login'
    && new URL(location, base).searchParams.get('redirect') === path
  )
  return {
    method, path, expected, status: response.status, location,
    passed: response.status === expected && Boolean(redirectOk),
    ...(path.startsWith('/api/') ? { response: JSON.parse(body) } : {}),
  }
}))
const evidence = { base, checkedAt: new Date().toISOString(), checks }
const json = JSON.stringify(evidence, null, 2) + '\n'
if (destination) await fs.writeFile(destination, json)
console.log(json)
if (checks.some(check => !check.passed)) process.exitCode = 1
