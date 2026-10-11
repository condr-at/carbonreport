import path from 'node:path'

/** Fail closed before creating clients, resetting a schema, or launching a browser. */
export function e2eConfig(env = process.env) {
  if (env.E2E_RESET_DATABASE !== '1') throw new Error('E2E_RESET_DATABASE=1 is required: this suite resets its disposable database.')
  let database
  try { database = new URL(env.E2E_DATABASE_URL ?? '') } catch { throw new Error('Set E2E_DATABASE_URL to a local disposable *_e2e_test database.') }
  if (!['postgres:', 'postgresql:'].includes(database.protocol) ||
      !['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) ||
      !/^[a-z][a-z0-9_]*_e2e_test$/.test(database.pathname.slice(1)) || database.search || database.hash) {
    throw new Error('E2E database must be loopback Postgres, named *_e2e_test, without URL query/fragment overrides.')
  }
  const port = Number(env.E2E_PORT ?? 3108)
  if (!Number.isInteger(port) || port < 1024 || port > 65535 || port === 3000) throw new Error('E2E_PORT must be a dedicated port (1024–65535, not dev port 3000).')
  return {
    databaseUrl: database.href,
    databaseName: database.pathname.slice(1),
    port,
    // NextURL canonicalizes loopback IPs to localhost in middleware redirects.
    // Use that same host for browser cookies, visits and the app URL.
    baseUrl: `http://localhost:${port}`,
    artifacts: path.resolve(env.E2E_ARTIFACTS ?? '.artifacts/e2e'),
  }
}

export function isolatedEnv(config, source = process.env) {
  return {
    ...source,
    DATABASE_URL: config.databaseUrl,
    DIRECT_URL: config.databaseUrl,
    JWT_SECRET: 'disposable-browser-e2e-secret-never-use-in-production',
    AUTH_COOKIE_DOMAIN: '',
    NEXT_PUBLIC_APP_URL: config.baseUrl,
    RESEND_API_KEY: '',
    FROM_EMAIL: 'noreply@example.test',
    AWS_ACCESS_KEY_ID: '', AWS_SECRET_ACCESS_KEY: '', AWS_SESSION_TOKEN: '',
    ASSETS_BUCKET_NAME: '', ASSETS_S3_ENDPOINT: '', ENABLE_LOCAL_UPLOADS: 'false',
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1',
    E2E_ARTIFACTS: config.artifacts,
  }
}
