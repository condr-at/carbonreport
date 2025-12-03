import { NextRequest, NextResponse } from 'next/server'
import {
  OrganizationMembershipInviteStatus,
  OrganizationStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { featureFlags } from '@/lib/config'
import { getOrganizationUsage } from '@/lib/server-utils'

function getRequestedOrganizationId(request: NextRequest) {
  const headerValue = request.headers.get('x-active-organization-id')?.trim()
  if (headerValue) {
    return headerValue
  }

  const url = new URL(request.url)
  return url.searchParams.get('organizationId')
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const requestedOrganizationId = getRequestedOrganizationId(request)

    const membership = await prisma.organizationMembership.findFirst({
      where: {
        userId: user.id,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        ...(requestedOrganizationId
          ? {
              organizationId: requestedOrganizationId,
            }
          : {}),
        organization: {
          status: {
            not: OrganizationStatus.DELETED,
          },
        },
      },
      include: {
        organization: {
          include: {
            plan: true,
            logoAsset: {
              select: {
                url: true,
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
    })

    if (!membership) {
      throw new ApiError(404, 'NOT_FOUND', 'Active organization not found')
    }

    const usage = await getOrganizationUsage(membership.organizationId)

    return NextResponse.json({
      organization: {
        id: membership.organization.id,
        slug: membership.organization.slug,
        display_name: membership.organization.displayName,
        description: membership.organization.description,
        logo_asset_id: membership.organization.logoAssetId,
        logo_url: membership.organization.logoUrl ?? membership.organization.logoAsset?.url ?? null,
        plan: {
          code: membership.organization.planCode,
          label: membership.organization.plan.label,
          max_active_projects: membership.organization.plan.maxActiveProjects,
          max_editors: membership.organization.plan.maxEditors,
          max_verifiers: membership.organization.plan.maxVerifiers,
          max_viewers: membership.organization.plan.maxViewers,
          valid_until: membership.organization.planValidUntil,
        },
        usage,
        feature_flags: {
          verifierRoleEnabled: featureFlags.verifierRoleEnabled,
          billingUiEnabled: featureFlags.billingUiEnabled,
          approvalsEnabled: featureFlags.approvalsEnabled,
        },
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to resolve current organization'))
  }
}
