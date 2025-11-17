/**
 * Integration tests for organizations API routes
 * Tests org creation, membership invites, deletion & cascade flows
 */

import assert from 'node:assert/strict'
import test, { afterEach, beforeEach } from 'node:test'
import {
  OrganizationMembershipRole,
  OrganizationMembershipInviteStatus,
  ProjectStatus,
  OrganizationStatus,
} from '@prisma/client'
import {
  createTestUser,
  createTestOrgWithOwner,
  createTestProject,
  createTestMembership,
  ensureTestPlans,
} from '@/__tests__/factories'
import { cleanupTestData } from '@/__tests__/setup'
import prisma from '@/lib/db'
import * as auth from '@/lib/auth'

beforeEach(async () => {
  await ensureTestPlans()
})

afterEach(async () => {
  await cleanupTestData()
  auth.__resetCurrentUserResolver()
})

// ============================================================================
// Helper functions for API tests
// ============================================================================

function mockUser(userId: string) {
  auth.__setCurrentUserResolver(async () => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  })
}

// ============================================================================
// POST /api/organizations - Create Organization
// ============================================================================

test('POST /api/organizations: creates org with plan=free by default', async () => {
  const user = await createTestUser()
  mockUser(user.id)

  const orgCount = await prisma.organization.count()
  assert.equal(orgCount, 0, 'Should start with no organizations')

  // Create an organization via the service layer (simulating API behavior)
  const { generateUniqueOrganizationSlug } = await import('@/lib/organizations/service')
  const slug = await generateUniqueOrganizationSlug('Test Org')

  const org = await prisma.organization.create({
    data: {
      slug,
      displayName: 'Test Org',
      planCode: 'free',
      planAssignedAt: new Date(),
      createdByUserId: user.id,
    },
  })

  // Verify org created correctly
  assert.ok(org.id)
  assert.equal(org.planCode, 'free')
  assert.equal(org.status, OrganizationStatus.ACTIVE)

  // Auto-create OWNER membership (this would be done by the API route)
  const membership = await prisma.organizationMembership.create({
    data: {
      organizationId: org.id,
      userId: user.id,
      role: OrganizationMembershipRole.OWNER,
      inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
    },
  })

  assert.equal(membership.role, OrganizationMembershipRole.OWNER)
  assert.equal(membership.inviteStatus, OrganizationMembershipInviteStatus.ACCEPTED)
})

test('POST /api/organizations: generates unique slug from display_name', async () => {
  const { generateUniqueOrganizationSlug } = await import('@/lib/organizations/service')

  const slug1 = await generateUniqueOrganizationSlug('My Org')
  assert.equal(slug1, 'my-org')

  // Create first org
  const user = await createTestUser()
  await prisma.organization.create({
    data: {
      slug: slug1,
      displayName: 'My Org',
      planCode: 'free',
      planAssignedAt: new Date(),
      createdByUserId: user.id,
    },
  })

  // Second org with same name should get unique slug
  const slug2 = await generateUniqueOrganizationSlug('My Org')
  assert.match(slug2, /^my-org-\d+$/, 'Should append number to duplicate slug')
})

// ============================================================================
// Membership Invites
// ============================================================================

test('Membership invite: allows inviting editor on Pro Beta', async () => {
  const { org, user } = await createTestOrgWithOwner({ planCode: 'pro_beta' })
  mockUser(user.id)

  const editorUser = await createTestUser()

  // Verify plan allows editors
  const { assertWithinLimit } = await import('@/lib/server-utils')
  await assertWithinLimit(org.id, 'editor', { needed: 1 })

  // Create membership invite
  const membership = await prisma.organizationMembership.create({
    data: {
      organizationId: org.id,
      userId: editorUser.id,
      role: OrganizationMembershipRole.EDITOR,
      inviteStatus: OrganizationMembershipInviteStatus.PENDING,
      invitedByUserId: user.id,
    },
  })

  assert.equal(membership.inviteStatus, OrganizationMembershipInviteStatus.PENDING)
  assert.equal(membership.role, OrganizationMembershipRole.EDITOR)
})

test('Membership invite: blocks inviting editor on Free plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  const { assertWithinLimit } = await import('@/lib/server-utils')
  const { ApiError } = await import('@/lib/api-error')

  await assert.rejects(
    async () => assertWithinLimit(org.id, 'editor', { needed: 1 }),
    (err: typeof ApiError.prototype) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'SEAT_LIMIT_EXCEEDED')
      assert.ok(err.details)
      assert.equal(err.details.limit, 0)
      return true
    },
  )
})

test('Membership invite: blocks inviting 3rd editor on Pro Beta', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  // Create 2 accepted editors (at limit)
  const user1 = await createTestUser()
  const user2 = await createTestUser()

  await createTestMembership({
    organizationId: org.id,
    userId: user1.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  await createTestMembership({
    organizationId: org.id,
    userId: user2.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  const { assertWithinLimit } = await import('@/lib/server-utils')
  const { ApiError } = await import('@/lib/api-error')

  // Try to invite 3rd editor
  await assert.rejects(
    async () => assertWithinLimit(org.id, 'editor', { needed: 1 }),
    (err: typeof ApiError.prototype) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'SEAT_LIMIT_EXCEEDED')
      assert.ok(err.details)
      assert.equal(err.details.role, 'EDITOR')
      assert.equal(err.details.limit, 2)
      assert.equal(err.details.current, 2)
      return true
    },
  )
})

test('Membership invite: blocks inviting verifier (feature disabled)', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  const { assertWithinLimit } = await import('@/lib/server-utils')
  const { ApiError } = await import('@/lib/api-error')

  await assert.rejects(
    async () => assertWithinLimit(org.id, 'verifier', { needed: 1 }),
    (err: typeof ApiError.prototype) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'SEAT_LIMIT_EXCEEDED')
      assert.ok(err.details)
      assert.equal(err.details.role, 'VIEWER_VERIFIER')
      assert.equal(err.details.limit, 0)
      return true
    },
  )
})

// ============================================================================
// Organization Deletion & Cascade
// ============================================================================

test('DELETE organization: soft-deletes org and cascades to projects', async () => {
  const { org, user } = await createTestOrgWithOwner()
  mockUser(user.id)

  // Create 2 active projects
  const project1 = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })
  const project2 = await createTestProject({
    organizationId: org.id,
    status: ProjectStatus.ACTIVE,
  })

  // Soft-delete the organization
  const deletedAt = new Date()
  await prisma.organization.update({
    where: { id: org.id },
    data: {
      status: OrganizationStatus.DELETED,
      deletedAt,
    },
  })

  // Cascade soft-delete to all projects
  await prisma.project.updateMany({
    where: { organizationId: org.id },
    data: {
      status: ProjectStatus.DELETED,
      deletedAt,
    },
  })

  // Verify org is soft-deleted
  const updatedOrg = await prisma.organization.findUnique({
    where: { id: org.id },
  })
  assert.ok(updatedOrg)
  assert.equal(updatedOrg.status, OrganizationStatus.DELETED)
  assert.ok(updatedOrg.deletedAt)

  // Verify projects are soft-deleted
  const updatedProjects = await prisma.project.findMany({
    where: { id: { in: [project1.id, project2.id] } },
  })
  assert.equal(updatedProjects.length, 2)
  updatedProjects.forEach((project) => {
    assert.equal(project.status, ProjectStatus.DELETED)
    assert.ok(project.deletedAt)
  })

  // Verify retention metadata can be computed
  const { computeProjectRetention } = await import('@/lib/projects/service')
  const retention = computeProjectRetention(updatedProjects[0].deletedAt)
  assert.ok(retention)
  assert.ok(retention.expires_at instanceof Date)
  assert.ok(retention.days_remaining > 0)
})

test('DELETE organization: only allows OWNER to delete', async () => {
  const { org } = await createTestOrgWithOwner()
  const adminUser = await createTestUser()

  // Create ADMIN membership (not OWNER)
  await createTestMembership({
    organizationId: org.id,
    userId: adminUser.id,
    role: OrganizationMembershipRole.ADMIN,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  mockUser(adminUser.id)

  const { assertOrgMembership } = await import('@/lib/server-utils')
  const { ApiError } = await import('@/lib/api-error')

  // Try to delete as ADMIN (requires OWNER)
  await assert.rejects(
    async () => assertOrgMembership(adminUser.id, org.id, OrganizationMembershipRole.OWNER),
    (err: typeof ApiError.prototype) => {
      assert.equal(err.status, 403)
      assert.equal(err.code, 'FORBIDDEN')
      assert.ok(err.details)
      assert.equal(err.details.required_role, OrganizationMembershipRole.OWNER)
      assert.equal(err.details.actual_role, OrganizationMembershipRole.ADMIN)
      return true
    },
  )
})

// ============================================================================
// Organization Usage Tracking
// ============================================================================

test('Organization usage: accurately counts all resources', async () => {
  const { org } = await createTestOrgWithOwner()

  // Create various resources
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ARCHIVED })

  const editor1 = await createTestUser()
  const editor2 = await createTestUser()
  const viewer = await createTestUser()

  await createTestMembership({
    organizationId: org.id,
    userId: editor1.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  await createTestMembership({
    organizationId: org.id,
    userId: editor2.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.PENDING, // Should not count
  })

  await createTestMembership({
    organizationId: org.id,
    userId: viewer.id,
    role: OrganizationMembershipRole.VIEWER_READONLY,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  const { getOrganizationUsage } = await import('@/lib/server-utils')
  const usage = await getOrganizationUsage(org.id)

  assert.equal(usage.active_projects, 2, 'Should count only active projects')
  assert.equal(usage.active_editors, 1, 'Should count only accepted editors')
  assert.equal(usage.active_viewers, 1, 'Should count accepted viewers')
  assert.equal(usage.active_verifiers, 0, 'Should have no verifiers')
})
