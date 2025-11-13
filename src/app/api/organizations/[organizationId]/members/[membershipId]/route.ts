import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { OrganizationMembershipRole } from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership, assertWithinLimit } from '@/lib/server-utils'

const UpdateRoleSchema = z.object({
  role: z.nativeEnum(OrganizationMembershipRole).refine((role) => role !== OrganizationMembershipRole.OWNER, {
    message: 'Cannot promote to owner via API',
  }),
})

function isSeatRole(role: OrganizationMembershipRole) {
  return (
    role === OrganizationMembershipRole.EDITOR || role === OrganizationMembershipRole.VIEWER_VERIFIER
  )
}

function seatResourceForRole(role: OrganizationMembershipRole) {
  if (role === OrganizationMembershipRole.EDITOR) {
    return 'editor' as const
  }
  if (role === OrganizationMembershipRole.VIEWER_VERIFIER) {
    return 'verifier' as const
  }
  return null
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ organizationId: string; membershipId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId, membershipId } = await context.params

    await assertOrgMembership(user.id, organizationId, OrganizationMembershipRole.ADMIN)

    const payload = await request.json().catch(() => ({}))
    const parsed = UpdateRoleSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid role payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const membership = await prisma.organizationMembership.findFirst({
      where: {
        id: membershipId,
        organizationId,
      },
      select: {
        id: true,
        role: true,
        inviteStatus: true,
      },
    })

    if (!membership) {
      throw new ApiError(404, 'NOT_FOUND', 'Membership not found')
    }

    if (membership.role === OrganizationMembershipRole.OWNER) {
      throw new ApiError(403, 'FORBIDDEN', 'Cannot modify owner role')
    }

    const nextRole = parsed.data.role

    if (membership.role === nextRole) {
      return NextResponse.json({
        membership: {
          membership_id: membership.id,
          role: nextRole,
        },
      })
    }

    const nextSeatResource = seatResourceForRole(nextRole)

    if (nextSeatResource) {
      const needed = isSeatRole(membership.role) && seatResourceForRole(membership.role) === nextSeatResource ? 0 : 1
      await assertWithinLimit(organizationId, nextSeatResource, { needed })
    }

    const updated = await prisma.organizationMembership.update({
      where: { id: membership.id },
      data: {
        role: nextRole,
        // When promoting to a seat role ensure invite is still pending or accepted.
        // We do not automatically accept invites here.
      },
      select: {
        id: true,
        role: true,
      },
    })

    return NextResponse.json({
      membership: {
        membership_id: updated.id,
        role: updated.role,
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to update membership'))
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ organizationId: string; membershipId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId, membershipId } = await context.params

    const actorMembership = await assertOrgMembership(
      user.id,
      organizationId,
      OrganizationMembershipRole.ADMIN,
    )

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
      },
    })

    if (!membership) {
      throw new ApiError(404, 'NOT_FOUND', 'Membership not found')
    }

    if (membership.role === OrganizationMembershipRole.OWNER) {
      throw new ApiError(403, 'FORBIDDEN', 'Cannot remove organization owner')
    }

    if (membership.userId === user.id && actorMembership.role === OrganizationMembershipRole.OWNER) {
      throw new ApiError(403, 'FORBIDDEN', 'Owners cannot remove themselves')
    }

    await prisma.organizationMembership.delete({
      where: { id: membership.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to remove membership'))
  }
}
