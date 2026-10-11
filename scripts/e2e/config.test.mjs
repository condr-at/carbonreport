import assert from 'node:assert/strict'
import test from 'node:test'
import { e2eConfig, isolatedEnv } from './config.mjs'

const safe = { E2E_RESET_DATABASE: '1', E2E_DATABASE_URL: 'postgresql://test:test@127.0.0.1:5432/carbonreport_e2e_test' }
test('requires an explicit disposable database and never accepts dev, production, remote, or URL host overrides', () => {
  assert.equal(e2eConfig(safe).databaseName, 'carbonreport_e2e_test')
  for (const url of [
    'postgresql://test:test@127.0.0.1:5432/carbonreport_dev',
    'postgresql://test:test@127.0.0.1:5432/carbonreport_test',
    'postgresql://test:test@db.example.com:5432/carbonreport_e2e_test',
    'postgresql://test:test@127.0.0.1:5432/carbonreport_e2e_test?host=db.example.com',
    'postgresql://test:test@127.0.0.1:5432/carbonreport_e2e_test#other',
  ]) assert.throws(() => e2eConfig({ ...safe, E2E_DATABASE_URL: url }))
  assert.throws(() => e2eConfig({ ...safe, E2E_RESET_DATABASE: '' }))
  assert.throws(() => e2eConfig({ ...safe, E2E_PORT: '3000' }))
})
test('child processes receive the same dedicated database and no inherited email/cloud credentials', () => {
  const config = e2eConfig(safe)
  const env = isolatedEnv(config, { DATABASE_URL: 'wrong', DIRECT_URL: 'other', RESEND_API_KEY: 'secret', AWS_ACCESS_KEY_ID: 'secret', AUTH_COOKIE_DOMAIN: '.example.com' })
  assert.equal(env.DATABASE_URL, config.databaseUrl)
  assert.equal(env.DIRECT_URL, config.databaseUrl)
  for (const key of ['RESEND_API_KEY', 'AWS_ACCESS_KEY_ID', 'AUTH_COOKIE_DOMAIN']) assert.equal(env[key], '')
  assert.equal(env.NEXT_PUBLIC_APP_URL, 'http://localhost:3108')
})
