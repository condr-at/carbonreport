import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'
import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'
import { __setCurrentUserResolver, __resetCurrentUserResolver } from '@/lib/auth'
import { mergePackageValues, type PackageValues } from '@/lib/cbam/supplier-package'
import { GET, PATCH } from './route'

type FixtureOptions = {
  authenticated?: boolean
  member?: boolean
  role?: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER_VERIFIER' | 'VIEWER_READONLY'
  inviteStatus?: 'ACCEPTED' | 'PENDING'
  organizationStatus?: 'ACTIVE' | 'DELETED'
  projectStatus?: 'ACTIVE' | 'REPORTED' | 'DELETED'
  reportProjectId?: string
  templateCode?: string
  dataset?: Record<string, unknown>
  conflictOnUpdate?: boolean
}

function setup(t: test.TestContext, options: FixtureOptions = {}) {
  const project = {
    id: 'package-project', organizationId: 'package-org', name: 'Private project',
    status: options.projectStatus ?? 'ACTIVE', deletedAt: null,
    datasetVersion: 7, organization: { status: options.organizationStatus ?? 'ACTIVE' },
    dataset: options.dataset ?? {
      data_points: [
        { field_id: 'organization_name', item_id: null, value: 'Confidential Company' },
        { field_id: 'cbam_pkg_recipient', item_id: null, value: 'Existing recipient' },
        { field_id: 'process_name', item_id: 'process-1', value: 'Keep this process' },
      ],
      organization_info: { name: 'Shared organization' },
      bom_items: [{ id: 'bom-1', name: 'Preserve me' }],
      facilities: [{ id: 'facility-1' }],
      custom_context: { keep: true },
    },
  }
  const report = {
    id: 'supplier-report', projectId: options.reportProjectId ?? project.id,
    templateCode: options.templateCode ?? 'CBAM_DATA_PACKAGE', project,
  }
  const calls = { metadataReads: 0, datasetReads: 0, reportReads: 0, membershipReads: 0, writes: 0 }
  let lastUpdate: any
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
  stub(prisma.project, 'findUnique', async ({ where, select }: any) => {
    if (select?.dataset) calls.datasetReads += 1
    else calls.metadataReads += 1
    if (where.id !== project.id) return null
    return Object.fromEntries(Object.keys(select).map((key) => [key, project[key as keyof typeof project]]))
  })
  stub(prisma.organizationMembership, 'findFirst', async ({ where }: any) => {
    calls.membershipReads += 1
    const inviteStatus = options.inviteStatus ?? 'ACCEPTED'
    if (options.member === false || where.userId !== 'current-user' || where.organizationId !== project.organizationId) return null
    if (where.inviteStatus !== inviteStatus || project.organization.status === where.organization?.status?.not) return null
    return { role: options.role ?? 'OWNER', inviteStatus, organizationId: project.organizationId, userId: 'current-user' }
  })
  stub(prisma.report, 'findFirst', async ({ where }: any) => {
    calls.reportReads += 1
    assert.equal(where.projectId, project.id, 'Report read must be scoped to the authorized project')
    assert.equal(where.templateCode, 'CBAM_DATA_PACKAGE', 'Only the supplier package template is supported')
    if (where.id !== report.id || where.projectId !== report.projectId || where.templateCode !== report.templateCode) return null
    calls.datasetReads += 1
    return report
  })
  stub(prisma.project, 'update', async (args: any) => {
    calls.writes += 1
    lastUpdate = args
    if (options.conflictOnUpdate || args.where.datasetVersion !== project.datasetVersion ||
        args.where.status.notIn.includes(project.status) || project.organization.status === args.where.organization.status.not) {
      throw Object.assign(new Error('Concurrent change'), { code: 'P2025' })
    }
    project.dataset = structuredClone(args.data.dataset)
    project.datasetVersion += args.data.datasetVersion.increment
    return { datasetVersion: project.datasetVersion }
  })
  const params = { params: Promise.resolve({ id: project.id, reportId: report.id }) }
  const url = `http://localhost/api/projects/${project.id}/reports/${report.id}/supplier-package`
  return {
    calls, project,
    lastUpdate: () => lastUpdate,
    read: (query = '') => GET(new NextRequest(`${url}${query}`), params),
    patch: (body: unknown = { expectedDatasetVersion: 7, values: { cbam_pkg_recipient: 'New recipient' } }) => PATCH(
      new NextRequest(url, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }), params,
    ),
    patchRaw: (body: string) => PATCH(new NextRequest(url, { method: 'PATCH', body }), params),
  }
}

async function assertDenied(response: Response, status: number, code: string) {
  assert.equal(response.status, status)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  const payload = await response.json()
  assert.equal(payload.code, code)
  assert.equal(typeof payload.error, 'string')
  assert.equal('validation' in payload, false)
  assert.equal('values' in payload, false)
  assert.equal(JSON.stringify(payload).includes('Confidential Company'), false)
  return payload
}

test('unauthenticated GET and PATCH stop before database access', async (t) => {
  const fixture = setup(t, { authenticated: false })
  await assertDenied(await fixture.read(), 401, 'UNAUTHORIZED')
  await assertDenied(await fixture.patch(), 401, 'UNAUTHORIZED')
  assert.deepEqual(fixture.calls, { metadataReads: 0, datasetReads: 0, reportReads: 0, membershipReads: 0, writes: 0 })
})

for (const options of [{ member: false }, { inviteStatus: 'PENDING' as const }]) {
  test(`rejects ${options.member === false ? 'an outsider' : 'a pending membership'} before reading report or dataset`, async (t) => {
    const fixture = setup(t, options)
    await assertDenied(await fixture.read(), 403, 'FORBIDDEN')
    await assertDenied(await fixture.patch(), 403, 'FORBIDDEN')
    assert.equal(fixture.calls.reportReads, 0)
    assert.equal(fixture.calls.datasetReads, 0)
    assert.equal(fixture.calls.writes, 0)
  })
}

for (const role of ['VIEWER_READONLY', 'VIEWER_VERIFIER', 'EDITOR', 'ADMIN', 'OWNER'] as const) {
  test(`accepted ${role} can read, with accurate edit capability`, async (t) => {
    const fixture = setup(t, { role })
    const response = await fixture.read()
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'private, no-store')
    const payload = await response.json()
    assert.equal(payload.projectId, 'package-project')
    assert.equal(payload.reportId, 'supplier-report')
    assert.equal(payload.templateCode, 'CBAM_DATA_PACKAGE')
    assert.equal(payload.datasetVersion, 7)
    assert.equal(payload.canEdit, ['OWNER', 'ADMIN', 'EDITOR'].includes(role))
    assert.equal(payload.validation.values.cbam_pkg_recipient, 'Existing recipient')
    assert.equal('organization_name' in payload.validation.values, false)
    assert.equal('dataset' in payload, false)
    assert.equal('custom_context' in payload, false)
    assert.match(payload.generatedAt, /^\d{4}-\d{2}-\d{2}T/)
    assert.match(payload.profileVersion, /^cbam-supplier-review\//)
  })
}

for (const role of ['VIEWER_READONLY', 'VIEWER_VERIFIER'] as const) {
  test(`${role} cannot write even with a known project, report and version`, async (t) => {
    const fixture = setup(t, { role })
    await assertDenied(await fixture.patch(), 403, 'FORBIDDEN')
    assert.equal(fixture.calls.datasetReads, 0)
    assert.equal(fixture.calls.writes, 0)
  })
}

test('reported projects are readable without edit capability and reject writes', async (t) => {
  const fixture = setup(t, { projectStatus: 'REPORTED' })
  assert.equal((await (await fixture.read()).json()).canEdit, false)
  await assertDenied(await fixture.patch(), 409, 'CONFLICT')
  assert.equal(fixture.calls.writes, 0)
})

test('deleted organizations and projects do not expose package data', async (t) => {
  await t.test('deleted organization', async (st) => {
    const fixture = setup(st, { organizationStatus: 'DELETED' })
    await assertDenied(await fixture.read(), 404, 'NOT_FOUND')
    assert.equal(fixture.calls.datasetReads, 0)
  })
  await t.test('deleted project', async (st) => {
    const fixture = setup(st, { projectStatus: 'DELETED' })
    await assertDenied(await fixture.read(), 409, 'CONFLICT')
    assert.equal(fixture.calls.datasetReads, 0)
  })
})

for (const options of [{ reportProjectId: 'another-project' }, { templateCode: 'CBAM' }]) {
  test(`rejects ${options.reportProjectId ? 'a report belonging to another project' : 'an unsupported template'}`, async (t) => {
    const fixture = setup(t, options)
    await assertDenied(await fixture.read(), 404, 'NOT_FOUND')
    await assertDenied(await fixture.patch(), 404, 'NOT_FOUND')
    assert.equal(fixture.calls.writes, 0)
  })
}

test('version mismatch wins over readiness validation for JSON, ZIP and draft saves', async (t) => {
  const fixture = setup(t)
  for (const query of ['?expectedDatasetVersion=6', '?format=zip&expectedDatasetVersion=6']) {
    const error = await assertDenied(await fixture.read(query), 409, 'VERSION_CONFLICT')
    assert.equal(error.details.currentVersion, 7)
    assert.equal('issues' in error.details, false)
  }
  await assertDenied(await fixture.patch({ expectedDatasetVersion: 6, values: { cbam_pkg_recipient: 'Stale edit' } }), 409, 'VERSION_CONFLICT')
  assert.equal(fixture.calls.writes, 0)
})

test('download requires an explicit valid version; query options are unambiguous', async (t) => {
  const fixture = setup(t)
  for (const query of ['?format=zip', '?expectedDatasetVersion=-1', '?expectedDatasetVersion=1.5',
    '?expectedDatasetVersion=', '?expectedDatasetVersion=9007199254740992',
    '?expectedDatasetVersion=7&expectedDatasetVersion=6', '?format=zip&format=json', '?format=pdf']) {
    await assertDenied(await fixture.read(query), 400, 'VALIDATION_ERROR')
  }
})

test('draft input rejects unknown fields, unsafe keys, nonstrings and excess sizes without mutation', async (t) => {
  const fixture = setup(t)
  const invalid = [
    { expectedDatasetVersion: 7, values: { organization_name: 'Overwrite outside package' } },
    { expectedDatasetVersion: 7, values: { cbam_pkg_recipient: 0 } },
    { expectedDatasetVersion: 7, values: {} },
    { expectedDatasetVersion: 7, values: [] },
    { expectedDatasetVersion: '7', values: { cbam_pkg_recipient: 'Text' } },
    { expectedDatasetVersion: 7, values: { cbam_pkg_recipient: 'a'.repeat(32769) } },
    { expectedDatasetVersion: 7, values: { cbam_pkg_recipient: 'Text' }, dataset: { data_points: [] } },
  ]
  for (const body of invalid) await assertDenied(await fixture.patch(body), 400, 'VALIDATION_ERROR')
  await assertDenied(await fixture.patchRaw('{"expectedDatasetVersion":7,"values":{"__proto__":"unsafe"}}'), 400, 'VALIDATION_ERROR')
  await assertDenied(await fixture.patchRaw('{'), 400, 'VALIDATION_ERROR')
  await assertDenied(await fixture.patchRaw(' '.repeat(256 * 1024 + 1)), 413, 'VALIDATION_ERROR')
  assert.equal(fixture.calls.writes, 0)
})

test('EDITOR can atomically save an incomplete draft, preserving other fields and root dataset properties', async (t) => {
  const fixture = setup(t, { role: 'EDITOR' })
  const before = structuredClone(fixture.project.dataset)
  const response = await fixture.patch({
    expectedDatasetVersion: 7,
    values: { cbam_pkg_recipient: '', cbam_pkg_direct_see: 'not a number yet' },
  })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  const payload = await response.json()
  assert.equal(payload.datasetVersion, 8)
  assert.equal(payload.validation.isReady, false)
  assert.equal(payload.validation.values.cbam_pkg_recipient, '')
  assert.equal(payload.validation.values.cbam_pkg_direct_see, 'not a number yet')
  assert.deepEqual(fixture.project.dataset, mergePackageValues(before, {
    cbam_pkg_recipient: '', cbam_pkg_direct_see: 'not a number yet',
  }))
  for (const key of ['organization_info', 'bom_items', 'facilities', 'custom_context']) {
    assert.deepEqual(fixture.project.dataset[key], before[key])
  }
  const dataPoints = fixture.project.dataset.data_points as Array<{ field_id: string; item_id: string | null; value: string }>
  assert.deepEqual(dataPoints.filter((point) => !point.field_id.startsWith('cbam_pkg_')), [
    { field_id: 'organization_name', item_id: null, value: 'Confidential Company' },
    { field_id: 'process_name', item_id: 'process-1', value: 'Keep this process' },
  ])
  assert.deepEqual(fixture.lastUpdate().where, {
    id: fixture.project.id, datasetVersion: 7,
    status: { notIn: ['REPORTED', 'DELETED'] }, organization: { status: { not: 'DELETED' } },
  })
  assert.equal(fixture.lastUpdate().data.datasetVersion.increment, 1)
  await assertDenied(await fixture.read('?format=zip&expectedDatasetVersion=7'), 409, 'VERSION_CONFLICT')
  const refreshed = await (await fixture.read('?expectedDatasetVersion=8')).json()
  assert.deepEqual(refreshed.validation.values, payload.validation.values)
})

test('concurrent update P2025 returns a conflict without overwriting the stored dataset', async (t) => {
  const fixture = setup(t, { conflictOnUpdate: true })
  const before = structuredClone(fixture.project.dataset)
  await assertDenied(await fixture.patch(), 409, 'VERSION_CONFLICT')
  assert.deepEqual(fixture.project.dataset, before)
  assert.equal(fixture.project.datasetVersion, 7)
})

test('ambiguous duplicate package values are rejected instead of destructively normalized', async (t) => {
  const dataset = { data_points: [
    { field_id: 'cbam_pkg_recipient', item_id: null, value: 'First' },
    { field_id: 'cbam_pkg_recipient', item_id: null, value: 'Second' },
  ], keep: true }
  const fixture = setup(t, { dataset })
  await assertDenied(await fixture.patch(), 400, 'VALIDATION_ERROR')
  assert.equal(fixture.calls.writes, 0)
  assert.deepEqual(fixture.project.dataset, dataset)
})

test('incomplete saved package cannot be downloaded and returns actionable issues', async (t) => {
  const fixture = setup(t)
  const response = await fixture.read('?format=zip&expectedDatasetVersion=7')
  assert.match(response.headers.get('content-type') ?? '', /application\/json/)
  assert.equal(response.headers.get('content-disposition'), null)
  const error = await assertDenied(response, 422, 'VALIDATION_ERROR')
  assert.ok(error.details.issues.some((issue: { severity: string; fieldId: string }) => issue.severity === 'error' && issue.fieldId))
  assert.equal(fixture.calls.writes, 0)
})

const readyValues: PackageValues = {
  cbam_pkg_recipient: 'EU customer reviewer', cbam_pkg_prepared_by: 'Operator preparer',
  cbam_pkg_supplier_role: 'operator', cbam_pkg_production_year: '2026',
  cbam_pkg_coverage_start: '2026-01-01', cbam_pkg_coverage_end: '2026-01-01',
  cbam_operator_name: 'Synthetic operator', cbam_operator_contact: 'operator@example.test',
  cbam_installation_country: 'Serbia', cbam_pkg_installation_name: 'Synthetic installation',
  cbam_pkg_installation_address: 'Synthetic address', product_name: 'Steel component',
  cbam_pkg_cn8: '73181595', cbam_pkg_cn_review: 'declared_reviewed',
  cbam_pkg_boundary: 'Operator-reported boundary, production route and attribution in source-1',
  cbam_pkg_precursor_statement: 'Relevant precursor contribution included in the reported direct value',
  cbam_pkg_unit: 'tCO2e/t_goods', cbam_pkg_direct_see: '0', cbam_pkg_direct_basis: 'actual',
  cbam_pkg_direct_source: 'source-1', cbam_pkg_indirect_status: 'not_applicable',
  cbam_pkg_indirect_rationale: 'Declared not applicable for these goods, subject to reviewer confirmation',
  cbam_pkg_verification_status: 'not_verified',
  cbam_pkg_evidence_json: JSON.stringify([{ id: 'source-1', title: 'Operator source', reference: 'Document register reference 1',
    version: '1', period: '2026-01-01', owner: 'Synthetic operator', disclosure: 'shareable' }]),
}

test('ready saved package downloads a version-bound ZIP for a read-only accepted member', async (t) => {
  const fixture = setup(t, { role: 'VIEWER_READONLY', dataset: mergePackageValues({ data_points: [] }, readyValues) })
  const snapshot = await (await fixture.read()).json()
  assert.equal(snapshot.validation.isReady, true, JSON.stringify(snapshot.validation.issues))
  const response = await fixture.read('?format=zip&expectedDatasetVersion=7')
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'application/zip')
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('content-disposition'), 'attachment; filename="cbam-supplier-review-package-v1.zip"')
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.equal(bytes.readUInt32LE(0), 0x04034b50)
  assert.ok(bytes.length > 500)
  assert.equal(fixture.calls.writes, 0)
})
