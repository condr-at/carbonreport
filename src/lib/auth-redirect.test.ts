import assert from 'node:assert/strict'
import test from 'node:test'
import { safeAuthRedirect } from './auth-redirect'

test('auth redirect preserves valid internal paths, queries and anchors', () => {
  for (const value of ['/dashboard', '/projects/project-id/reports/report-id', '/profile?tab=password#change', '/settings/members?filter=pending', '/projects?next=https%3A%2F%2Fexample.test']) {
    assert.equal(safeAuthRedirect(value), value)
  }
  assert.equal(safeAuthRedirect('/projects/../profile'), '/profile')
})

test('auth redirect rejects external URLs, scripts, backslashes and malformed escapes', () => {
  for (const value of [undefined, null, '', 'dashboard', 'https://evil.test', '//evil.test/path', '///evil.test', 'javascript:alert(1)', '/\\evil.test', '/%5cevil.test', '/%2f%2fevil.test', '/%broken', '/profile\n//evil.test']) {
    assert.equal(safeAuthRedirect(value), '/dashboard', String(value))
  }
})

test('auth redirect rejects auth/API destinations including encoded and normalized loops', () => {
  for (const value of ['/login', '/login?redirect=/session', '/session', '/session/again', '/register', '/api/projects', '/api/auth/refresh', '/%73ession', '/%6cogin', '/%61pi/auth/refresh', '/projects/../session', '/%2e%2e/login']) {
    assert.equal(safeAuthRedirect(value), '/dashboard', value)
  }
})
