/**
 * Test data factories for multi-org testing.
 * Provides reusable functions to create test data with sensible defaults.
 */

import prisma from '@/lib/db'
import {
  OrganizationStatus,
  OrganizationMembershipRole,
  OrganizationMembershipInviteStatus,
  ProjectStatus,
  type User,
  type Organization,
  type OrganizationMembership,
  type Project,
  type Contact,
} from '@prisma/client'

let testSequence = 0

/**
 * Generate unique test email
 */
export function testEmail(prefix = 'test') {
  testSequence += 1
  return `${prefix}-${testSequence}-${Date.now()}@example.com`
}

/**
 * Generate unique slug
 */
export function testSlug(prefix = 'test') {
  testSequence += 1
  return `${prefix}-${testSequence}-${Date.now()}`
}

/**
 * Create a test user
 */
export async function createTestUser(
  overrides: Partial<User> = {},
): Promise<User> {
  return prisma.user.create({
    data: {
      email: testEmail('user'),
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      passwordHash: 'hashed-password-for-test',
      emailVerified: true,
      ...overrides,
    },
  })
}

/**
 * Create a test organization
 */
export async function createTestOrg(
  overrides: Partial<Omit<Organization, 'metadata'>> & {
    createdByUserId?: string
    metadata?: any
  } = {},
): Promise<Organization> {
  let createdByUserId = overrides.createdByUserId

  // Auto-create user if not provided
  if (!createdByUserId) {
    const user = await createTestUser()
    createdByUserId = user.id
  }

  const slug = overrides.slug ?? testSlug('org')

  const { metadata, ...rest } = overrides
  
  return prisma.organization.create({
    data: {
      slug,
      displayName: `Test Org ${slug}`,
      planCode: 'free',
      planAssignedAt: new Date(),
      createdByUserId,
      status: OrganizationStatus.ACTIVE,
      ...(metadata !== undefined && { metadata }),
      ...rest,
    },
  })
}

/**
 * Create a test organization membership
 */
export async function createTestMembership(
  params: {
    organizationId?: string
    userId?: string
    role?: OrganizationMembershipRole
    inviteStatus?: OrganizationMembershipInviteStatus
    invitedByUserId?: string
  } = {},
): Promise<OrganizationMembership> {
  let { organizationId, userId } = params
  const {
    role = OrganizationMembershipRole.VIEWER_READONLY,
    inviteStatus = OrganizationMembershipInviteStatus.ACCEPTED,
    invitedByUserId = null,
  } = params

  // Auto-create org if not provided
  if (!organizationId) {
    const org = await createTestOrg()
    organizationId = org.id
  }

  // Auto-create user if not provided
  if (!userId) {
    const user = await createTestUser()
    userId = user.id
  }

  const joinedAt = inviteStatus === OrganizationMembershipInviteStatus.ACCEPTED
    ? new Date()
    : null

  return prisma.organizationMembership.create({
    data: {
      organizationId,
      userId,
      role,
      inviteStatus,
      invitedByUserId,
      joinedAt,
      lastActiveAt: joinedAt,
    },
  })
}

/**
 * Create a test project
 */
export async function createTestProject(
  overrides: Partial<Omit<Project, 'dataset' | 'checklist' | 'mailtoTemplate'>> & {
    organizationId?: string
    createdByUserId?: string
    dataset?: any
    checklist?: any
    mailtoTemplate?: any
  } = {},
): Promise<Project> {
  let { organizationId, createdByUserId } = overrides

  // Auto-create org if not provided
  if (!organizationId) {
    const org = await createTestOrg()
    organizationId = org.id
  }

  // Auto-create user if not provided
  if (!createdByUserId) {
    const user = await createTestUser()
    createdByUserId = user.id
  }

  const { dataset, checklist, mailtoTemplate, ...rest } = overrides

  return prisma.project.create({
    data: {
      organizationId,
      createdByUserId,
      name: `Test Project ${testSlug('proj')}`,
      dataset: dataset ?? { data_points: [] },
      datasetVersion: 0,
      checklist: checklist ?? {},
      status: ProjectStatus.ACTIVE,
      ...(mailtoTemplate !== undefined && { mailtoTemplate }),
      ...rest,
    },
  })
}

/**
 * Create a test contact
 */
export async function createTestContact(
  overrides: Partial<Contact> & {
    organizationId?: string
    createdByUserId?: string
  } = {},
): Promise<Contact> {
  let { organizationId, createdByUserId } = overrides

  // Auto-create org if not provided
  if (!organizationId) {
    const org = await createTestOrg()
    organizationId = org.id
  }

  // Auto-create user if not provided
  if (!createdByUserId) {
    const user = await createTestUser()
    createdByUserId = user.id
  }

  return prisma.contact.create({
    data: {
      organizationId,
      createdByUserId,
      email: testEmail('contact'),
      name: 'Test Contact',
      position: null,
      ...overrides,
    },
  })
}

/**
 * Create a complete test organization with owner membership
 */
export async function createTestOrgWithOwner(
  orgOverrides: Partial<Organization> = {},
  userOverrides: Partial<User> = {},
): Promise<{ org: Organization; user: User; membership: OrganizationMembership }> {
  const user = await createTestUser(userOverrides)
  const org = await createTestOrg({
    createdByUserId: user.id,
    ...orgOverrides,
  })
  const membership = await createTestMembership({
    organizationId: org.id,
    userId: user.id,
    role: OrganizationMembershipRole.OWNER,
    inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
  })

  return { org, user, membership }
}

/**
 * Ensure plans are seeded (call this in test setup if needed)
 */
export async function ensureTestPlans() {
  const existingPlans = await prisma.planDefinition.findMany()
  
  if (existingPlans.length === 0) {
    await prisma.planDefinition.createMany({
      data: [
        {
          planCode: 'free',
          label: 'Free',
          description: 'Free plan with basic features',
          maxActiveProjects: 1,
          maxEditors: 0,
          maxVerifiers: 0,
          maxViewers: null, // unlimited
        },
        {
          planCode: 'pro_beta',
          label: 'Pro Beta',
          description: 'Beta professional plan',
          maxActiveProjects: 3,
          maxEditors: 2,
          maxVerifiers: 0,
          maxViewers: null, // unlimited
        },
      ],
    })
  }
}
