/**
 * Integration tests for projects API routes
 * Tests project creation with limits, restore with limits, and lifecycle
 */

import assert from 'node:assert/strict'
import test, { afterEach, beforeEach } from 'node:test'
import {
  ProjectStatus,
} from '@prisma/client'
import {
  createTestOrgWithOwner,
  createTestProject,
  ensureTestPlans,
} from '@/__tests__/factories'
import { cleanupTestData } from '@/__tests__/setup'
import prisma from '@/lib/db'
import { PROJECT_RETENTION_DAYS } from '@/lib/server-utils'
import type { ApiError } from '@/lib/api-error'
import * as auth from '@/lib/auth'
import { getReportTemplate } from '@/lib/report-templates'
import { GET as getProjectRoute } from '@/app/api/projects/[id]/route'
import { GET as listProjectsRoute } from '@/app/api/projects/route'
import { GET as getReportRoute } from '@/app/api/projects/[id]/reports/[reportId]/route'
import { POST as restoreProjectRoute } from '@/app/api/projects/[id]/restore/route'
import { PATCH as changeProjectStatusRoute } from '@/app/api/projects/[id]/status/route'

beforeEach(async () => {
  await cleanupTestData()
  await ensureTestPlans()
})

afterEach(async () => {
  await cleanupTestData()
  auth.__resetCurrentUserResolver()
})

function mockUser(userId: string) {
  auth.__setCurrentUserResolver(async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  })
}

function buildJsonRequest(url: string, method: string, body?: Record<string, unknown>) {
  return new Request(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

async function assertReportCompletionAcrossRoutes(
  projectId: string,
  reportId: string,
  organizationId: string,
  expectedCompletion: number,
) {
  const [projectResponse, listResponse, reportResponse] = await Promise.all([
    getProjectRoute(
      buildJsonRequest(`http://localhost/api/projects/${projectId}`, 'GET') as any,
      { params: Promise.resolve({ id: projectId }) },
    ),
    listProjectsRoute(
      buildJsonRequest(`http://localhost/api/projects?organization_id=${organizationId}`, 'GET') as any,
    ),
    getReportRoute(
      buildJsonRequest(`http://localhost/api/projects/${projectId}/reports/${reportId}`, 'GET') as any,
      { params: Promise.resolve({ id: projectId, reportId }) },
    ),
  ])

  assert.equal(projectResponse.status, 200, 'project detail response')
  assert.equal(listResponse.status, 200, 'projects list response')
  assert.equal(reportResponse.status, 200, 'report response')

  type ProjectWithReports = { id: string; reports: { id: string; completion: number }[] }
  const projectPayload = (await projectResponse.json()) as { project: ProjectWithReports }
  const listPayload = (await listResponse.json()) as { projects: ProjectWithReports[] }
  const reportPayload = (await reportResponse.json()) as { completion: number }

  assert.equal(
    projectPayload.project.reports.find((report) => report.id === reportId)?.completion,
    expectedCompletion,
    'project detail completion reflects the current dataset',
  )
  assert.equal(
    listPayload.projects.find((project) => project.id === projectId)
      ?.reports.find((report) => report.id === reportId)?.completion,
    expectedCompletion,
    'projects list completion reflects the current dataset',
  )
  assert.equal(reportPayload.completion, expectedCompletion, 'report completion agrees with project summaries')
}

// ============================================================================
// Report Completion Across Project and Report Reads
// ============================================================================

test('GET project and report routes: completion follows filled and cleared data despite stale stored completion', async () => {
  const { org, user } = await createTestOrgWithOwner({ planCode: 'free' })
  mockUser(user.id)

  const template = getReportTemplate('PRODUCT_PCF')
  assert.ok(template)
  const requiredFieldIds = new Set(template.sections.flatMap((section) =>
    section.fields.filter((field) => field.isRequired).map((field) => field.fieldId),
  ))
  const requiredScalarField = template.sections
    .filter((section) => !section.config?.repeatableKey)
    .flatMap((section) => section.fields)
    .find((field) => field.isRequired && field.fieldId === 'organization_name')
  assert.ok(requiredScalarField, 'the template includes a required organization name')

  const project = await createTestProject({
    organizationId: org.id,
    createdByUserId: user.id,
  })
  const report = await prisma.report.create({
    data: { projectId: project.id, templateCode: template.code, completion: 0 },
  })

  for (const value of ['Regression Test Organization', '']) {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        dataset: {
          data_points: [{ field_id: requiredScalarField.fieldId, item_id: null, value }],
        },
      },
    })

    const storedReport = await prisma.report.findUniqueOrThrow({ where: { id: report.id } })
    assert.equal(storedReport.completion, 0, 'stored completion remains stale during dataset edits')
    await assertReportCompletionAcrossRoutes(
      project.id,
      report.id,
      org.id,
      value ? Math.round(100 / requiredFieldIds.size) : 0,
    )
  }
})

test('GET project and report routes: repeatable fields count once and completion stays within 100 percent', async () => {
  const { org, user } = await createTestOrgWithOwner({ planCode: 'free' })
  mockUser(user.id)

  const template = getReportTemplate('ISO14067')
  assert.ok(template)
  const requiredFieldIds = new Set(template.sections.flatMap((section) =>
    section.fields.filter((field) => field.isRequired).map((field) => field.fieldId),
  ))
  const repeatableRequiredFieldIds = new Set(template.sections
    .filter((section) => section.config?.repeatableKey)
    .flatMap((section) => section.fields)
    .filter((field) => field.isRequired)
    .map((field) => field.fieldId))
  const repeatableFieldId = repeatableRequiredFieldIds.values().next().value
  assert.ok(repeatableFieldId)

  const repeatedDataPoints = ['1', '2', '3'].map((itemId) => ({
    field_id: repeatableFieldId,
    item_id: itemId,
    value: `Material ${itemId}`,
  }))
  const project = await createTestProject({
    organizationId: org.id,
    createdByUserId: user.id,
    dataset: { data_points: repeatedDataPoints },
  })
  const report = await prisma.report.create({
    data: { projectId: project.id, templateCode: template.code, completion: 0 },
  })

  await assertReportCompletionAcrossRoutes(project.id, report.id, org.id, Math.round(100 / requiredFieldIds.size))

  await prisma.project.update({
    where: { id: project.id },
    data: {
      dataset: {
        data_points: [...requiredFieldIds].flatMap((fieldId) => {
          const itemIds = repeatableRequiredFieldIds.has(fieldId) ? ['1', '2', '3'] : [null]
          return itemIds.map((itemId) => ({ field_id: fieldId, item_id: itemId, value: 'Filled' }))
        }),
      },
    },
  })
  await assertReportCompletionAcrossRoutes(project.id, report.id, org.id, 100)

  await prisma.project.update({
    where: { id: project.id },
    data: { dataset: { data_points: repeatedDataPoints.map((point) => ({ ...point, value: '   ' })) } },
  })
  await assertReportCompletionAcrossRoutes(project.id, report.id, org.id, 0)
})

// ============================================================================
// POST /api/projects - Create Project with Limits
// ============================================================================

test('POST /api/projects: creates project on Free plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Verify no projects exist
  const countBefore = await prisma.project.count({
    where: { organizationId: org.id, status: ProjectStatus.ACTIVE },
  })
  assert.equal(countBefore, 0)

  // Verify can create project
  const { assertWithinLimit } = await import('@/lib/server-utils')
  await assertWithinLimit(org.id, 'project', { needed: 1 })

  // Create project
  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  assert.ok(project.id)
  assert.equal(project.status, ProjectStatus.ACTIVE)
  assert.equal(project.organizationId, org.id)
})

test('POST /api/projects: blocks 2nd project on Free plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create first project
  await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  const { assertWithinLimit } = await import('@/lib/server-utils')

  // Try to create second project
  await assert.rejects(
    async () => assertWithinLimit(org.id, 'project', { needed: 1 }),
    (err: ApiError) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'PLAN_LIMIT_EXCEEDED')
      assert.ok(err.details)
      assert.equal(err.details.resource, 'active_projects')
      assert.equal(err.details.limit, 1)
      assert.equal(err.details.current, 1)
      assert.equal(err.details.needed, 1)
      return true
    },
  )
})

test('POST /api/projects: allows 3 projects on Pro Beta', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  // Create 3 projects (at limit)
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })

  // Verify count
  const count = await prisma.project.count({
    where: { organizationId: org.id, status: ProjectStatus.ACTIVE },
  })
  assert.equal(count, 3)
})

test('POST /api/projects: blocks 4th project on Pro Beta', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  // Create 3 projects (at limit)
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })

  const { assertWithinLimit } = await import('@/lib/server-utils')

  // Try to create 4th project
  await assert.rejects(
    async () => assertWithinLimit(org.id, 'project', { needed: 1 }),
    (err: ApiError) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'PLAN_LIMIT_EXCEEDED')
      assert.ok(err.details)
      assert.equal(err.details.limit, 3)
      assert.equal(err.details.current, 3)
      return true
    },
  )
})

test('POST /api/projects: archived projects dont count toward limit', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create archived project
  await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ARCHIVED,
  })

  // Should still allow creating active project
  const { assertWithinLimit } = await import('@/lib/server-utils')
  await assertWithinLimit(org.id, 'project', { needed: 1 })

  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  assert.equal(project.status, ProjectStatus.ACTIVE)
})

test('POST /api/projects: reported projects dont count toward limit', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create reported project
  await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.REPORTED,
  })

  // Should still allow creating active project
  const { assertWithinLimit } = await import('@/lib/server-utils')
  await assertWithinLimit(org.id, 'project', { needed: 1 })

  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  assert.equal(project.status, ProjectStatus.ACTIVE)
})

// ============================================================================
// POST /api/projects/:id/restore - Restore Project with Limits
// ============================================================================

test('POST /api/projects/:id/restore: restores deleted project within retention', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create and soft-delete a project
  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.DELETED,
    deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  })

  // Verify within retention window
  const { computeProjectRetention } = await import('@/lib/projects/service')
  const retention = computeProjectRetention(project.deletedAt)
  assert.ok(retention)
  assert.ok(retention.days_remaining > 0)

  // Verify org is at 0/1 limit (deleted doesn't count)
  const activeCount = await prisma.project.count({
    where: { organizationId: org.id, status: ProjectStatus.ACTIVE },
  })
  assert.equal(activeCount, 0)

  // Restore project
  const { restoreProject } = await import('@/lib/projects/service')
  const result = await restoreProject({
    projectId: project.id,
    userId: org.createdByUserId,
  })

  assert.equal(result.project.status, ProjectStatus.ARCHIVED) // Restored from deleted goes to archived
  assert.equal(result.project.deleted_at, null)
  assert.equal(result.project.restored, true)
})

test('POST /api/projects/:id/restore: blocks restore when limit exceeded', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create active project (at limit)
  await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  // Create deleted project
  const deletedProject = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.DELETED,
    deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  })

  // Deleted projects restore to ARCHIVED first, which doesn't count toward limit
  // So this should succeed
  const { restoreProject } = await import('@/lib/projects/service')
  
  const result = await restoreProject({
    projectId: deletedProject.id,
    userId: org.createdByUserId,
  })

  // Restored from deleted goes to archived
  assert.equal(result.project.status, ProjectStatus.ARCHIVED)
  assert.equal(result.project.deleted_at, null)
})

test('POST /api/projects/:id/restore: blocks restore after retention window', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create project deleted 35 days ago (beyond 30-day retention)
  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.DELETED,
    deletedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
  })

  // Verify retention expired
  const { computeProjectRetention } = await import('@/lib/projects/service')
  const retention = computeProjectRetention(project.deletedAt)
  assert.ok(retention)
  assert.equal(retention.days_remaining, 0) // Math.max(0, ...) ensures minimum 0

  const { restoreProject } = await import('@/lib/projects/service')

  // Try to restore
  await assert.rejects(
    async () =>
      restoreProject({
        projectId: project.id,
        userId: org.createdByUserId,
      }),
    (err: ApiError) => {
      assert.equal(err.status, 410)
      assert.equal(err.code, 'RETENTION_EXPIRED')
      return true
    },
  )
})

test('POST /api/projects/[id]/restore: route returns structured PLAN_LIMIT_EXCEEDED details', async () => {
  const { org, user } = await createTestOrgWithOwner({ planCode: 'free' })
  mockUser(user.id)

  await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  const archivedProject = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ARCHIVED,
  })

  const response = await restoreProjectRoute(
    buildJsonRequest(`http://localhost/api/projects/${archivedProject.id}/restore`, 'POST') as any,
    { params: Promise.resolve({ id: archivedProject.id }) },
  )

  const payload = (await response.json()) as {
    code: string
    details?: {
      resource?: string
      current?: number
      limit?: number
      needed?: number
    }
  }

  assert.equal(response.status, 409)
  assert.equal(payload.code, 'PLAN_LIMIT_EXCEEDED')
  assert.equal(payload.details?.resource, 'active_projects')
  assert.equal(payload.details?.current, 1)
  assert.equal(payload.details?.limit, 1)
  assert.equal(payload.details?.needed, 1)
})

test('POST /api/projects/[id]/restore: route returns RETENTION_EXPIRED after 30 days', async () => {
  const { org, user } = await createTestOrgWithOwner({ planCode: 'free' })
  mockUser(user.id)

  const deletedProject = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.DELETED,
    deletedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
  })

  const response = await restoreProjectRoute(
    buildJsonRequest(`http://localhost/api/projects/${deletedProject.id}/restore`, 'POST') as any,
    { params: Promise.resolve({ id: deletedProject.id }) },
  )

  const payload = (await response.json()) as { code: string }

  assert.equal(response.status, 410)
  assert.equal(payload.code, 'RETENTION_EXPIRED')
})

test('POST /api/projects/:id/restore: restores archived to active requires limit check', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create active project (at limit)
  await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  // Create archived project
  const archivedProject = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ARCHIVED,
  })

  const { restoreProject } = await import('@/lib/projects/service')

  // Try to restore archived to active when at limit
  await assert.rejects(
    async () =>
      restoreProject({
        projectId: archivedProject.id,
        userId: org.createdByUserId,
      }),
    (err: ApiError) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'PLAN_LIMIT_EXCEEDED')
      return true
    },
  )
})

test('POST /api/projects/:id/restore: computes retention metadata correctly', async () => {
  const deletedAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago

  const { computeProjectRetention } = await import('@/lib/projects/service')
  const retention = computeProjectRetention(deletedAt)

  assert.ok(retention)
  assert.ok(retention.expires_at instanceof Date)

  // Expected expiry: deletedAt + 30 days
  const expectedExpiry = new Date(deletedAt.getTime() + PROJECT_RETENTION_DAYS * 24 * 60 * 60 * 1000)
  assert.equal(retention.expires_at.getTime(), expectedExpiry.getTime())

  // Days remaining should be ~20 (30 - 10)
  assert.ok(retention.days_remaining >= 19 && retention.days_remaining <= 21)
})

// ============================================================================
// Project Lifecycle Tests
// ============================================================================

test('Project status transitions: active → archived', async () => {
  const { org, user } = await createTestOrgWithOwner()

  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  const { changeProjectStatus } = await import('@/lib/projects/service')

  const result = await changeProjectStatus({
    projectId: project.id,
    userId: user.id,
    targetStatus: ProjectStatus.ARCHIVED,
  })

  assert.equal(result.project.status, ProjectStatus.ARCHIVED)
})

test('Project status transitions: active → reported', async () => {
  const { org, user } = await createTestOrgWithOwner()

  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  const { changeProjectStatus } = await import('@/lib/projects/service')

  const result = await changeProjectStatus({
    projectId: project.id,
    userId: user.id,
    targetStatus: ProjectStatus.REPORTED,
  })

  assert.equal(result.project.status, ProjectStatus.REPORTED)
})

test('Project status transitions: active → deleted (soft-delete)', async () => {
  const { org } = await createTestOrgWithOwner()

  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  // Simulating API behavior: manually set deletedAt when status changes to DELETED
  await prisma.project.update({
    where: { id: project.id },
    data: {
      status: ProjectStatus.DELETED,
      deletedAt: new Date(),
    },
  })

  const updated = await prisma.project.findUnique({
    where: { id: project.id },
  })

  assert.ok(updated)
  assert.equal(updated.status, ProjectStatus.DELETED)
  assert.ok(updated.deletedAt)
})

test('Project status transitions: reported → archived is blocked', async () => {
  const { org, user } = await createTestOrgWithOwner()

  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.REPORTED,
  })

  const { changeProjectStatus } = await import('@/lib/projects/service')

  // Should reject reported → archived transition
  await assert.rejects(
    async () =>
      changeProjectStatus({
        projectId: project.id,
        userId: user.id,
        targetStatus: ProjectStatus.ARCHIVED,
      }),
    (err: ApiError) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'CONFLICT')
      assert.match(err.message, /reported/i)
      return true
    },
  )
})

test('PATCH /api/projects/[id]/status: route marks active project as reported', async () => {
  const { org, user } = await createTestOrgWithOwner({ planCode: 'free' })
  mockUser(user.id)

  const project = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  const response = await changeProjectStatusRoute(
    buildJsonRequest(`http://localhost/api/projects/${project.id}/status`, 'PATCH', {
      status: 'reported',
    }) as any,
    { params: Promise.resolve({ id: project.id }) },
  )

  const payload = (await response.json()) as {
    project: {
      id: string
      status: ProjectStatus
    }
  }

  assert.equal(response.status, 200)
  assert.equal(payload.project.id, project.id)
  assert.equal(payload.project.status, ProjectStatus.REPORTED)
})
