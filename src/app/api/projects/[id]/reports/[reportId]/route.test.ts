import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth'
import { GET } from './route'

type FixtureOptions = {
  authenticated?: boolean
  member?: boolean
  role?: 'OWNER' | 'VIEWER_READONLY'
  inviteStatus?: 'ACCEPTED' | 'PENDING'
  organizationStatus?: 'ACTIVE' | 'DELETED'
  projectStatus?: 'ACTIVE' | 'DELETED'
  deletedAt?: Date | null
  reportProjectId?: string
}

function setup(t: test.TestContext, options: FixtureOptions = {}) {
  const project = {
    id: 'report-project', organizationId: 'report-org', name: 'Private project',
    status: options.projectStatus ?? 'ACTIVE', deletedAt: options.deletedAt ?? null,
    datasetVersion: 7, organization: { status: options.organizationStatus ?? 'ACTIVE' },
    dataset: { data_points: [
      { field_id: 'organization_name', item_id: null, value: 'Confidential Company' },
      { field_id: 'outside_this_template', item_id: null, value: 'Do not return this field' },
    ] },
  }
  const report = {
    id: 'private-report', projectId: options.reportProjectId ?? project.id,
    templateCode: 'PRODUCT_PCF', metadata: { displayMode: 'sections' }, project,
    createdAt: new Date('2026-10-10T00:00:00.000Z'),
    updatedAt: new Date('2026-10-10T00:00:00.000Z'),
  }
  const calls = { projectReads: 0, reportReads: 0, membershipReads: 0 }
  const stub = (target: any, method: string, implementation: (...args: any[]) => any) => {
    const original = target[method]
    target[method] = implementation
    t.after(() => { target[method] = original })
  }
  __setCurrentUserResolver(async () => {
    if (options.authenticated === false) throw new ApiError(401, 'UNAUTHORIZED', 'User is not authenticated')
    return { id: 'current-user' } as any
  })
  t.after(__resetCurrentUserResolver)
  stub(prisma.project, 'findUnique', async ({ where }: any) => {
    calls.projectReads += 1
    return where.id === project.id ? project : null
  })
  stub(prisma.organizationMembership, 'findFirst', async ({ where }: any) => {
    calls.membershipReads += 1
    const inviteStatus = options.inviteStatus ?? 'ACCEPTED'
    if (options.member === false || where.userId !== 'current-user' || where.organizationId !== project.organizationId) return null
    if (where.inviteStatus !== inviteStatus || project.organization.status === where.organization?.status?.not) return null
    return { role: options.role ?? 'OWNER', inviteStatus, organizationId: project.organizationId, userId: 'current-user' }
  })
  const readReport = async ({ where }: any) => {
    calls.reportReads += 1
    if (where.id !== report.id || (where.projectId && where.projectId !== report.projectId)) return null
    return report
  }
  // Both methods are intercepted so the red regression exercises the old unscoped read too.
  stub(prisma.report, 'findUnique', readReport)
  stub(prisma.report, 'findFirst', readReport)
  return {
    calls,
    read: () => GET(
      new NextRequest(`http://localhost/api/projects/${project.id}/reports/${report.id}`),
      { params: Promise.resolve({ id: project.id, reportId: report.id }) },
    ),
  }
}

async function assertDenied(response: Response, status: number, code: string) {
  assert.equal(response.status, status)
  const payload = await response.json()
  assert.equal(payload.code, code)
  assert.equal(typeof payload.error, 'string')
  for (const field of ['reportInfo', 'template', 'dataset', 'metadata', 'completion']) {
    assert.equal(field in payload, false, `${field} must not leak on denied reads`)
  }
  assert.equal(JSON.stringify(payload).includes('Confidential Company'), false)
}

test('report GET rejects an unauthenticated caller before database reads', async (t) => {
  const fixture = setup(t, { authenticated: false })
  await assertDenied(await fixture.read(), 401, 'UNAUTHORIZED')
  assert.deepEqual(fixture.calls, { projectReads: 0, reportReads: 0, membershipReads: 0 })
})

test('report GET rejects an authenticated outsider with known project and report IDs', async (t) => {
  const fixture = setup(t, { member: false })
  await assertDenied(await fixture.read(), 403, 'FORBIDDEN')
  assert.equal(fixture.calls.reportReads, 0, 'reject access before reading the report dataset')
})

test('report GET rejects a pending organization membership', async (t) => {
  const fixture = setup(t, { inviteStatus: 'PENDING' })
  await assertDenied(await fixture.read(), 403, 'FORBIDDEN')
  assert.equal(fixture.calls.reportReads, 0)
})

test('report GET rejects a deleted organization even for its owner', async (t) => {
  const fixture = setup(t, { organizationStatus: 'DELETED' })
  await assertDenied(await fixture.read(), 404, 'NOT_FOUND')
  assert.equal(fixture.calls.reportReads, 0)
})

test('report GET rejects a deleted project during retention', async (t) => {
  const fixture = setup(t, { projectStatus: 'DELETED', deletedAt: new Date() })
  await assertDenied(await fixture.read(), 409, 'CONFLICT')
  assert.equal(fixture.calls.reportReads, 0)
})

test('report GET rejects a deleted project after retention expires', async (t) => {
  const fixture = setup(t, { projectStatus: 'DELETED', deletedAt: new Date(Date.now() - 31 * 86400000) })
  await assertDenied(await fixture.read(), 410, 'RETENTION_EXPIRED')
  assert.equal(fixture.calls.reportReads, 0)
})

for (const role of ['VIEWER_READONLY', 'OWNER'] as const) {
  test(`report GET preserves report JSON for an accepted ${role}`, async (t) => {
    const fixture = setup(t, { role })
    const response = await fixture.read()
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
    const payload = await response.json()
    assert.equal(payload.reportInfo.id, 'private-report')
    assert.equal(payload.reportInfo.projectId, 'report-project')
    assert.equal(payload.template.code, 'PRODUCT_PCF')
    assert.equal(payload.datasetVersion, 7)
    assert.deepEqual(payload.metadata, { displayMode: 'sections' })
    assert.deepEqual(payload.dataset.data_points, [
      { field_id: 'organization_name', item_id: null, value: 'Confidential Company' },
    ])
    assert.ok(payload.completion > 0 && payload.completion <= 100)
    assert.equal(fixture.calls.membershipReads, 1)
  })
}

test('report GET does not return another project report through an authorized project URL', async (t) => {
  const fixture = setup(t, { reportProjectId: 'other-private-project' })
  await assertDenied(await fixture.read(), 404, 'NOT_FOUND')
})
