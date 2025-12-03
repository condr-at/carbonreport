import { NextRequest, NextResponse } from 'next/server'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
  OrganizationStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertWithinLimit } from '@/lib/server-utils'
import { featureFlags } from '@/lib/config'
import { scheduleUsageRecompute } from '@/lib/organizations/usage-scheduler'

function seatResourceForRole(role: OrganizationMembershipRole | null) {
  if (role === OrganizationMembershipRole.EDITOR) {
    return 'editor' as const
  }

  if (role === OrganizationMembershipRole.VIEWER_VERIFIER) {
    return 'verifier' as const
  }

  return null
}

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ organizationId: string; membershipId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId, membershipId } = await context.params

    const membership = await prisma.organizationMembership.findFirst({
      where: {
        id: membershipId,
        organizationId,
      },
      select: {
        id: true,
        userId: true,
        role: true,
        inviteStatus: true,
        joinedAt: true,
        organization: {
          select: {
            status: true,
          },
        },
      },
    })

    if (!membership || membership.organization.status === OrganizationStatus.DELETED) {
      throw new ApiError(404, 'NOT_FOUND', 'Membership not found')
    }

    if (membership.userId !== user.id) {
      throw new ApiError(403, 'FORBIDDEN', 'Only invited user can accept membership')
    }

    if (membership.inviteStatus !== OrganizationMembershipInviteStatus.PENDING) {
      throw new ApiError(409, 'CONFLICT', 'Invitation has already been processed')
    }

    if (
      membership.role === OrganizationMembershipRole.VIEWER_VERIFIER &&
      !featureFlags.verifierRoleEnabled
    ) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'Verifier role is currently disabled')
    }

    const seatResource = seatResourceForRole(membership.role)

    if (seatResource) {
      await assertWithinLimit(organizationId, seatResource)
    }

    const now = new Date()

    const updated = await prisma.organizationMembership.update({
      where: { id: membership.id },
      data: {
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        joinedAt: membership.joinedAt ?? now,
        lastActiveAt: now,
      },
      select: {
        id: true,
        inviteStatus: true,
      },
    })

    await scheduleUsageRecompute(organizationId, { reason: 'membership_accept' })

    return NextResponse.json({
      membership: {
        membership_id: updated.id,
        invite_status: updated.inviteStatus.toLowerCase(),
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to accept organization invite'))
  }
}
