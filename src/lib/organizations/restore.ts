import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
  OrganizationStatus,
} from '@prisma/client'
import { assertOrgMembership } from '@/lib/server-utils'

const ORGANIZATION_RETENTION_DAYS = 30
const DAY_IN_MS = 24 * 60 * 60 * 1000

function checkRetention(deletedAt: Date | null) {
  if (!deletedAt) {
    return
  }

  const expiresAt = new Date(deletedAt.getTime() + ORGANIZATION_RETENTION_DAYS * DAY_IN_MS)
  if (Date.now() > expiresAt.getTime()) {
    throw new ApiError(410, 'RETENTION_EXPIRED', 'Organization retention window has expired')
  }
}

export async function restoreOrganization({
  organizationId,
  userId,
}: {
  organizationId: string
  userId: string
}) {
  await assertOrgMembership(userId, organizationId, OrganizationMembershipRole.OWNER)

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      status: true,
      deletedAt: true,
    },
  })

  if (!organization) {
    throw new ApiError(404, 'NOT_FOUND', 'Organization not found')
  }

  if (organization.status !== OrganizationStatus.DELETED) {
    throw new ApiError(409, 'CONFLICT', 'Organization is not deleted')
  }

  checkRetention(organization.deletedAt)

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      status: OrganizationStatus.ACTIVE,
      deletedAt: null,
    },
  })

  return {
    organization_id: organizationId,
    status: 'active',
  }
}

export async function recomputeUsageSnapshot({
  organizationId,
  userId,
  skipAuth = false,
}: {
  organizationId: string
  userId?: string
  skipAuth?: boolean
}) {
  if (!skipAuth) {
    if (!userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Authentication required')
    }

    await assertOrgMembership(userId, organizationId, OrganizationMembershipRole.ADMIN)
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      status: true,
    },
  })

  if (!organization || organization.status === OrganizationStatus.DELETED) {
    throw new ApiError(404, 'NOT_FOUND', 'Organization not found')
  }

  const [activeProjects, activeEditors, activeVerifiers, activeViewers] = await Promise.all([
    prisma.project.count({
      where: {
        organizationId,
        status: OrganizationStatus.ACTIVE,
      },
    }),
    prisma.organizationMembership.count({
      where: {
        organizationId,
        role: OrganizationMembershipRole.EDITOR,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
      },
    }),
    prisma.organizationMembership.count({
      where: {
        organizationId,
        role: OrganizationMembershipRole.VIEWER_VERIFIER,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
      },
    }),
    prisma.organizationMembership.count({
      where: {
        organizationId,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        role: {
          in: [
            OrganizationMembershipRole.VIEWER_READONLY,
            OrganizationMembershipRole.VIEWER_VERIFIER,
          ],
        },
      },
    }),
  ])

  const snapshot = await prisma.organizationUsageSnapshot.create({
    data: {
      organizationId,
      computedAt: new Date(),
      activeProjects,
      activeEditors,
      activeVerifiers,
      activeViewers,
    },
    select: {
      id: true,
      computedAt: true,
      activeProjects: true,
      activeEditors: true,
      activeVerifiers: true,
      activeViewers: true,
    },
  })

  return {
    snapshot: {
      id: snapshot.id,
      computed_at: snapshot.computedAt,
      active_projects: snapshot.activeProjects,
      active_editors: snapshot.activeEditors,
      active_verifiers: snapshot.activeVerifiers,
      active_viewers: snapshot.activeViewers,
    },
  }
}
