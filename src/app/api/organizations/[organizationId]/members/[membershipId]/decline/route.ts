import { NextRequest, NextResponse } from 'next/server'
import {
  OrganizationMembershipInviteStatus,
  OrganizationStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { scheduleUsageRecompute } from '@/lib/organizations/usage-scheduler'

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
        inviteStatus: true,
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
      throw new ApiError(403, 'FORBIDDEN', 'Only invited user can decline membership')
    }

    if (membership.inviteStatus !== OrganizationMembershipInviteStatus.PENDING) {
      throw new ApiError(409, 'CONFLICT', 'Invitation has already been processed')
    }

    const updated = await prisma.organizationMembership.updateMany({
      where: {
        id: membership.id,
        organizationId,
        userId: user.id,
        inviteStatus: OrganizationMembershipInviteStatus.PENDING,
      },
      data: {
        inviteStatus: OrganizationMembershipInviteStatus.DECLINED,
      },
    })

    if (updated.count !== 1) {
      throw new ApiError(409, 'CONFLICT', 'Invitation has already been processed')
    }

    await scheduleUsageRecompute(organizationId, { reason: 'membership_decline' })

    return NextResponse.json({
      membership: {
        membership_id: membership.id,
        invite_status: OrganizationMembershipInviteStatus.DECLINED.toLowerCase(),
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to decline organization invite'))
  }
}
