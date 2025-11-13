import { NextRequest, NextResponse } from 'next/server'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership } from '@/lib/server-utils'

const STATUS_LOOKUP: Record<string, OrganizationMembershipInviteStatus> = {
  pending: OrganizationMembershipInviteStatus.PENDING,
  accepted: OrganizationMembershipInviteStatus.ACCEPTED,
  declined: OrganizationMembershipInviteStatus.DECLINED,
  revoked: OrganizationMembershipInviteStatus.REVOKED,
}

const ROLE_LOOKUP: Record<string, OrganizationMembershipRole> = {
  owner: OrganizationMembershipRole.OWNER,
  admin: OrganizationMembershipRole.ADMIN,
  editor: OrganizationMembershipRole.EDITOR,
  viewer_readonly: OrganizationMembershipRole.VIEWER_READONLY,
  viewer_verifier: OrganizationMembershipRole.VIEWER_VERIFIER,
}

export async function GET(
  request: NextRequest,
  { params }: { params: { organizationId: string } },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = params

    await assertOrgMembership(user.id, organizationId)

    const url = new URL(request.url)
    const statusQuery = url.searchParams.get('status')?.toLowerCase()
    const roleQuery = url.searchParams.get('role')?.toLowerCase()

    const inviteStatus = statusQuery ? STATUS_LOOKUP[statusQuery] : undefined
    const role = roleQuery ? ROLE_LOOKUP[roleQuery] : undefined

    const members = await prisma.organizationMembership.findMany({
      where: {
        organizationId,
        ...(inviteStatus ? { inviteStatus } : {}),
        ...(role ? { role } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({
      members: members.map((membership) => ({
        membership_id: membership.id,
        user_id: membership.userId,
        name: membership.user?.name ?? null,
        email: membership.user?.email ?? null,
        avatar_url: membership.user?.avatarUrl ?? null,
        role: membership.role,
        invite_status: membership.inviteStatus.toLowerCase(),
        joined_at: membership.joinedAt,
        last_active_at: membership.lastActiveAt,
      })),
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to list organization members'))
  }
}
