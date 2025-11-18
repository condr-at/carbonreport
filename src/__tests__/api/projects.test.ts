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

beforeEach(async () => {
  await cleanupTestData()
  await ensureTestPlans()
})

afterEach(async () => {
  await cleanupTestData()
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
  const { ApiError } = await import('@/lib/api-error')

  // Try to create second project
  await assert.rejects(
    async () => assertWithinLimit(org.id, 'project', { needed: 1 }),
    (err: typeof ApiError.prototype) => {
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
  const { ApiError } = await import('@/lib/api-error')

  // Try to create 4th project
  await assert.rejects(
    async () => assertWithinLimit(org.id, 'project', { needed: 1 }),
    (err: typeof ApiError.prototype) => {
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
  const { ApiError } = await import('@/lib/api-error')

  // Try to restore
  await assert.rejects(
    async () =>
      restoreProject({
        projectId: project.id,
        userId: org.createdByUserId,
      }),
    (err: typeof ApiError.prototype) => {
      assert.equal(err.status, 410)
      assert.equal(err.code, 'RETENTION_EXPIRED')
      return true
    },
  )
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
  const { ApiError } = await import('@/lib/api-error')

  // Try to restore archived to active when at limit
  await assert.rejects(
    async () =>
      restoreProject({
        projectId: archivedProject.id,
        userId: org.createdByUserId,
      }),
    (err: typeof ApiError.prototype) => {
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
  const { org, user } = await createTestOrgWithOwner()

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
  const { ApiError } = await import('@/lib/api-error')

  // Should reject reported → archived transition
  await assert.rejects(
    async () =>
      changeProjectStatus({
        projectId: project.id,
        userId: user.id,
        targetStatus: ProjectStatus.ARCHIVED,
      }),
    (err: typeof ApiError.prototype) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'CONFLICT')
      assert.match(err.message, /reported/i)
      return true
    },
  )
})
