import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership, assertWithinLimit } from '@/lib/server-utils'
import { featureFlags } from '@/lib/config'

const InviteSchema = z.object({
  email: z.string().trim().email(),
  role: z.nativeEnum(OrganizationMembershipRole).refine((role) => role !== OrganizationMembershipRole.OWNER, {
    message: 'Cannot invite user as owner',
  }),
  message: z.string().trim().max(2000).optional(),
})

function toSeatResource(role: OrganizationMembershipRole | undefined) {
  if (role === OrganizationMembershipRole.EDITOR) {
    return 'editor' as const
  }

  if (role === OrganizationMembershipRole.VIEWER_VERIFIER) {
    return 'verifier' as const
  }

  return null
}

export async function POST(
  request: NextRequest,
  { params }: { params: { organizationId: string } },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = params

    await assertOrgMembership(user.id, organizationId, OrganizationMembershipRole.ADMIN)

    const payload = await request.json().catch(() => ({}))
    const parsed = InviteSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(422, 'VALIDATION_ERROR', 'Invalid invite payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const email = parsed.data.email.toLowerCase()
    const role = parsed.data.role

    if (role === OrganizationMembershipRole.VIEWER_VERIFIER && !featureFlags.verifierRoleEnabled) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'Verifier role is currently disabled')
    }

    const targetUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    })

    if (!targetUser) {
      throw new ApiError(422, 'VALIDATION_ERROR', 'User with provided email not found', {
        email,
      })
    }

    const existingMembership = await prisma.organizationMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: targetUser.id,
        },
      },
    })

    if (existingMembership) {
      if (existingMembership.inviteStatus === OrganizationMembershipInviteStatus.PENDING) {
        return NextResponse.json({
          invite: {
            membership_id: existingMembership.id,
            email: targetUser.email,
            role: existingMembership.role,
            invite_status: existingMembership.inviteStatus.toLowerCase(),
          },
        })
      }

      throw new ApiError(409, 'CONFLICT', 'User is already a member of this organization', {
        membership_id: existingMembership.id,
      })
    }

    const seatResource = toSeatResource(role)

    if (seatResource) {
      await assertWithinLimit(organizationId, seatResource)
    }

    const created = await prisma.organizationMembership.create({
      data: {
        organizationId,
        userId: targetUser.id,
        role,
        inviteStatus: OrganizationMembershipInviteStatus.PENDING,
        invitedByUserId: user.id,
      },
      select: {
        id: true,
        inviteStatus: true,
        role: true,
      },
    })

    return NextResponse.json(
      {
        invite: {
          membership_id: created.id,
          email: targetUser.email,
          role: created.role,
          invite_status: created.inviteStatus.toLowerCase(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to invite member'))
  }
}
