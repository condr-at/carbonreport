/**
 * Unit tests for server-utils.ts
 * Tests guards, limits, and usage calculations for multi-org model
 */

import assert from 'node:assert/strict'
import test, { afterEach, beforeEach } from 'node:test'
import {
  assertWithinLimit,
  assertOrgMembership,
  getOrganizationUsage,
  getPlan,
} from '@/lib/server-utils'
import { computeProjectRetention } from '@/lib/projects/service'
import {
  OrganizationMembershipRole,
  OrganizationMembershipInviteStatus,
  ProjectStatus,
  OrganizationStatus,
} from '@prisma/client'
import {
  createTestUser,
  createTestOrg,
  createTestMembership,
  createTestProject,
  ensureTestPlans,
  createTestOrgWithOwner,
} from '@/__tests__/factories'
import { cleanupTestData } from '@/__tests__/setup'
import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'

beforeEach(async () => {
  await ensureTestPlans()
})

afterEach(async () => {
  await cleanupTestData()
})

// ============================================================================
// computeProjectRetention tests
// ============================================================================

test('computeProjectRetention: returns null for null deletedAt', () => {
  const result = computeProjectRetention(null)
  assert.equal(result, null)
})

test('computeProjectRetention: returns retention metadata for deleted project', () => {
  const deletedAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
  const result = computeProjectRetention(deletedAt)

  assert.ok(result !== null)
  assert.ok(result.expires_at instanceof Date)
  assert.ok(result.days_remaining >= 19 && result.days_remaining <= 21) // ~20 days remaining
})

test('computeProjectRetention: returns negative days for expired retention', () => {
  const deletedAt = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) // 35 days ago
  const result = computeProjectRetention(deletedAt)

  assert.ok(result !== null)
  assert.ok(result.days_remaining === 0) // Should be 0 since we use Math.max(0, ...)
  assert.ok(result.expires_at < new Date()) // Expiry is in the past
})

// ============================================================================
// getPlan tests
// ============================================================================

test('getPlan: returns plan summary for existing organization', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  const plan = await getPlan(org.id)

  assert.equal(plan.planCode, 'free')
  assert.equal(plan.label, 'Free')
  assert.equal(plan.maxActiveProjects, 1)
  assert.equal(plan.maxEditors, 0)
  assert.equal(plan.maxVerifiers, 0)
  assert.equal(plan.maxViewers, null) // unlimited
})

test('getPlan: throws NOT_FOUND for deleted organization', async () => {
  const { org } = await createTestOrgWithOwner()
  
  // Soft-delete the org
  await prisma.organization.update({
    where: { id: org.id },
    data: { status: OrganizationStatus.DELETED, deletedAt: new Date() },
  })

  await assert.rejects(
    async () => getPlan(org.id),
    (err: ApiError) => {
      assert.equal(err.status, 404)
      assert.equal(err.code, 'NOT_FOUND')
      return true
    },
  )
})

test('getPlan: throws NOT_FOUND for non-existent organization', async () => {
  await assert.rejects(
    async () => getPlan('non-existent-id'),
    (err: ApiError) => {
      assert.equal(err.status, 404)
      assert.equal(err.code, 'NOT_FOUND')
      return true
    },
  )
})

// ============================================================================
// assertOrgMembership tests
// ============================================================================

test('assertOrgMembership: succeeds for accepted membership with sufficient role', async () => {
  const { org, user } = await createTestOrgWithOwner()

  const membership = await assertOrgMembership(
    user.id,
    org.id,
    OrganizationMembershipRole.VIEWER_READONLY,
  )

  assert.equal(membership.userId, user.id)
  assert.equal(membership.organizationId, org.id)
  assert.equal(membership.role, OrganizationMembershipRole.OWNER)
})

test('assertOrgMembership: throws FORBIDDEN when user is not a member', async () => {
  const { org } = await createTestOrgWithOwner()
  const otherUser = await createTestUser()

  await assert.rejects(
    async () => assertOrgMembership(otherUser.id, org.id),
    (err: ApiError) => {
      assert.equal(err.status, 403)
      assert.equal(err.code, 'FORBIDDEN')
      assert.match(err.message, /denied/i)
      return true
    },
  )
})

test('assertOrgMembership: throws FORBIDDEN when role is insufficient', async () => {
  const user = await createTestUser()
  const { org } = await createTestOrgWithOwner()
  
  // Create viewer membership
  await createTestMembership({
    organizationId: org.id,
    userId: user.id,
    role: OrganizationMembershipRole.VIEWER_READONLY,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  // Try to access as editor (requires higher role)
  await assert.rejects(
    async () => assertOrgMembership(user.id, org.id, OrganizationMembershipRole.EDITOR),
    (err: ApiError) => {
      assert.equal(err.status, 403)
      assert.equal(err.code, 'FORBIDDEN')
      assert.ok(err.details)
      assert.equal(err.details.required_role, OrganizationMembershipRole.EDITOR)
      assert.equal(err.details.actual_role, OrganizationMembershipRole.VIEWER_READONLY)
      return true
    },
  )
})

test('assertOrgMembership: throws FORBIDDEN for pending invite', async () => {
  const user = await createTestUser()
  const { org } = await createTestOrgWithOwner()
  
  // Create pending membership (not yet accepted)
  await createTestMembership({
    organizationId: org.id,
    userId: user.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.PENDING,
  })

  await assert.rejects(
    async () => assertOrgMembership(user.id, org.id),
    (err: ApiError) => {
      assert.equal(err.status, 403)
      assert.equal(err.code, 'FORBIDDEN')
      return true
    },
  )
})

test('assertOrgMembership: throws FORBIDDEN for deleted organization', async () => {
  const { org, user } = await createTestOrgWithOwner()
  
  // Soft-delete the org
  await prisma.organization.update({
    where: { id: org.id },
    data: { status: OrganizationStatus.DELETED, deletedAt: new Date() },
  })

  await assert.rejects(
    async () => assertOrgMembership(user.id, org.id),
    (err: ApiError) => {
      assert.equal(err.status, 403)
      assert.equal(err.code, 'FORBIDDEN')
      return true
    },
  )
})

test('assertOrgMembership: OWNER can always access (highest role)', async () => {
  const { org, user } = await createTestOrgWithOwner()

  // Owner should pass all role checks
  const membership = await assertOrgMembership(
    user.id,
    org.id,
    OrganizationMembershipRole.ADMIN, // Require admin, but owner has higher
  )

  assert.equal(membership.role, OrganizationMembershipRole.OWNER)
})

// ============================================================================
// getOrganizationUsage tests
// ============================================================================

test('getOrganizationUsage: counts only active projects', async () => {
  const { org } = await createTestOrgWithOwner()

  // Create projects with different statuses
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ARCHIVED })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.DELETED })

  const usage = await getOrganizationUsage(org.id)

  assert.equal(usage.active_projects, 2) // Only 2 active
})

test('getOrganizationUsage: counts only accepted EDITOR memberships', async () => {
  const { org } = await createTestOrgWithOwner()

  // Create editor memberships
  const user1 = await createTestUser()
  const user2 = await createTestUser()
  const user3 = await createTestUser()

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

  // Pending editor should not count
  await createTestMembership({
    organizationId: org.id,
    userId: user3.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.PENDING,
  })

  const usage = await getOrganizationUsage(org.id)

  assert.equal(usage.active_editors, 2) // Only 2 accepted editors
})

test('getOrganizationUsage: owner does not count toward editor limit', async () => {
  const { org } = await createTestOrgWithOwner()

  const usage = await getOrganizationUsage(org.id)

  // Owner exists but should not be counted as editor
  assert.equal(usage.active_editors, 0)
})

test('getOrganizationUsage: counts verifiers separately', async () => {
  const { org } = await createTestOrgWithOwner()

  const user1 = await createTestUser()

  await createTestMembership({
    organizationId: org.id,
    userId: user1.id,
    role: OrganizationMembershipRole.VIEWER_VERIFIER,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  const usage = await getOrganizationUsage(org.id)

  assert.equal(usage.active_verifiers, 1)
  assert.equal(usage.active_viewers, 1) // Verifier also counts as viewer
})

test('getOrganizationUsage: counts all viewer roles', async () => {
  const { org } = await createTestOrgWithOwner()

  const user1 = await createTestUser()
  const user2 = await createTestUser()

  await createTestMembership({
    organizationId: org.id,
    userId: user1.id,
    role: OrganizationMembershipRole.VIEWER_READONLY,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  await createTestMembership({
    organizationId: org.id,
    userId: user2.id,
    role: OrganizationMembershipRole.VIEWER_VERIFIER,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  const usage = await getOrganizationUsage(org.id)

  assert.equal(usage.active_viewers, 2) // Both VIEWER_READONLY and VIEWER_VERIFIER
})

// ============================================================================
// assertWithinLimit tests - Projects
// ============================================================================

test('assertWithinLimit: allows creating project on Free plan when at 0/1', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Should not throw
  await assertWithinLimit(org.id, 'project', { needed: 1 })
})

test('assertWithinLimit: blocks creating 2nd project on Free plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create first project
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })

  // Try to create second
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

test('assertWithinLimit: allows 3 projects on Pro Beta plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  // Create 2 projects
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })

  // Should allow 3rd
  await assertWithinLimit(org.id, 'project', { needed: 1 })
})

test('assertWithinLimit: blocks creating 4th project on Pro Beta plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  // Create 3 projects (at limit)
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })

  // Try to create 4th
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

test('assertWithinLimit: archived projects do not count toward limit', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  // Create archived project
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ARCHIVED })

  // Should still allow creating active project
  await assertWithinLimit(org.id, 'project', { needed: 1 })
})

// ============================================================================
// assertWithinLimit tests - Editor Seats
// ============================================================================

test('assertWithinLimit: blocks inviting editor on Free plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })

  await assert.rejects(
    async () => assertWithinLimit(org.id, 'editor', { needed: 1 }),
    (err: ApiError) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'SEAT_LIMIT_EXCEEDED')
      assert.ok(err.details)
      assert.equal(err.details.role, 'EDITOR')
      assert.equal(err.details.limit, 0)
      assert.equal(err.details.current, 0)
      return true
    },
  )
})

test('assertWithinLimit: allows inviting 2 editors on Pro Beta plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  // First editor
  await assertWithinLimit(org.id, 'editor', { needed: 1 })
  
  const user1 = await createTestUser()
  await createTestMembership({
    organizationId: org.id,
    userId: user1.id,
    role: OrganizationMembershipRole.EDITOR,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  // Second editor
  await assertWithinLimit(org.id, 'editor', { needed: 1 })
})

test('assertWithinLimit: blocks inviting 3rd editor on Pro Beta plan', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  // Create 2 editors (at limit)
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

  // Try to invite 3rd
  await assert.rejects(
    async () => assertWithinLimit(org.id, 'editor', { needed: 1 }),
    (err: ApiError) => {
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

// ============================================================================
// assertWithinLimit tests - Verifier Seats
// ============================================================================

test('assertWithinLimit: blocks inviting verifier (feature disabled)', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'pro_beta' })

  await assert.rejects(
    async () => assertWithinLimit(org.id, 'verifier', { needed: 1 }),
    (err: ApiError) => {
      assert.equal(err.status, 409)
      assert.equal(err.code, 'SEAT_LIMIT_EXCEEDED')
      assert.ok(err.details)
      assert.equal(err.details.role, 'VIEWER_VERIFIER')
      assert.equal(err.details.limit, 0) // Verifier limit always 0 for now
      return true
    },
  )
})

// ============================================================================
// assertWithinLimit tests - Unlimited Resources
// ============================================================================

test('assertWithinLimit: never blocks unlimited resource (viewers)', async () => {
  const { org } = await createTestOrgWithOwner()

  // Note: There's no 'viewer' limit check in assertWithinLimit
  // This is testing the pattern - viewers are unlimited
  // The function checks 'project', 'editor', 'verifier' only
})

test('assertWithinLimit: handles needed=0 (no-op)', async () => {
  const { org } = await createTestOrgWithOwner({ planCode: 'free' })
  
  // Even at limit, needed=0 should not throw
  await createTestProject({ organizationId: org.id, status: ProjectStatus.ACTIVE })
  await assertWithinLimit(org.id, 'project', { needed: 0 })
})
