import fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { e2eConfig, isolatedEnv } from './config.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const config = e2eConfig()
const env = isolatedEnv(config)
if (process.env.E2E_CAPTURE_LANDING === '1') env.E2E_LANDING_ASSETS = path.join(root, 'public/landing')
const modules = path.resolve(process.env.E2E_NODE_MODULES ?? path.join(root, 'node_modules'))
// Reject a running app before touching the test database.
await new Promise((resolve, reject) => {
  const probe = net.createServer()
  probe.once('error', () => reject(new Error(`E2E port ${config.port} is already occupied; refusing to reset/start against another app.`)))
  probe.listen(config.port, '127.0.0.1', () => probe.close(resolve))
})
const disk = await fs.statfs(os.tmpdir())
if (disk.bavail * disk.bsize < 1_500_000_000) throw new Error('E2E needs at least 1.5 GB free for one isolated Next build.')
await fs.access(path.join(modules, 'next/dist/bin/next'))
await fs.mkdir(config.artifacts, { recursive: true })
const stage = await fs.mkdtemp(path.join(os.tmpdir(), 'carbonreport-browser-e2e-'))
let server
const log = createWriteStream(path.join(config.artifacts, 'run.log'))
function launch(args) {
  const child = spawn(process.execPath, args, { cwd: stage, env, stdio: ['ignore', 'pipe', 'pipe'] })
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { log.write(chunk); process.stdout.write(chunk) })
  return child
}
async function run(args) {
  const child = launch(args)
  await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`${args[0]} exited ${code}; see e2e run.log`)))
  })
}
try {
  // Explicit allowlist: never copy .env*, .git, user uploads, node_modules or existing .next.
  for (const entry of ['src', 'prisma', 'scripts/e2e', 'package.json', 'package-lock.json', 'tsconfig.json', 'next.config.ts', 'postcss.config.mjs', 'eslint.config.mjs', 'components.json']) {
    await fs.cp(path.join(root, entry), path.join(stage, entry), { recursive: true })
  }
  await fs.cp(path.join(root, 'public'), path.join(stage, 'public'), {
    recursive: true, filter: source => !source.startsWith(path.join(root, 'public/dev-uploads')),
  })
  await fs.symlink(modules, path.join(stage, 'node_modules'), 'dir')
  console.log(`Resetting disposable ${config.databaseName}; isolated app ${config.baseUrl}; artifacts ${config.artifacts}`)
  await run(['node_modules/prisma/build/index.js', 'db', 'push', '--force-reset', '--skip-generate'])
  await run(['--import', 'tsx', 'scripts/e2e/seed.ts'])
  await run(['--run', 'test:sanity'])
  await run(['node_modules/next/dist/bin/next', 'build'])
  server = launch(['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(config.port)])
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error('E2E Next server exited before becoming ready.')
    try { if ((await fetch(`${config.baseUrl}/login`, { signal: AbortSignal.timeout(2000) })).ok) { ready = true; break } } catch { /* startup only */ }
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  if (!ready) throw new Error('E2E Next server did not become ready.')
  await run(['--import', 'tsx', '--test', '--test-concurrency=1', 'scripts/e2e/supplier-package.test.mjs', 'scripts/e2e/auth-session.test.mjs', 'scripts/e2e/data-safety.test.mjs'])
  if (process.env.E2E_CAPTURE_LANDING === '1') {
    await run(['scripts/e2e/capture-landing.mjs'])
    // Capture writes reviewed assets back to the repo; serve that exact set here too.
    await fs.cp(path.join(root, 'public/landing'), path.join(stage, 'public/landing'), { recursive: true })
  }
  env.E2E_LANDING_BASE_URL = config.baseUrl
  env.E2E_LANDING_ARTIFACTS = path.join(config.artifacts, 'landing')
  await run(['--test', 'scripts/e2e/landing.test.mjs'])
} finally {
  if (server && server.exitCode === null) {
    const exited = new Promise(resolve => server.once('exit', resolve))
    server.kill('SIGTERM')
    const timer = setTimeout(() => server.kill('SIGKILL'), 5000)
    await exited
    clearTimeout(timer)
  }
  await new Promise(resolve => log.end(resolve))
  // Only this newly created source copy and its build; node_modules is a symlink.
  await fs.rm(stage, { recursive: true, force: true })
}
