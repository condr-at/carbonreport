import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import {
  ensureApiError,
  errorResponse,
  ApiError,
} from '@/lib/api-error'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
  OrganizationStatus,
} from '@prisma/client'
import { getOrganizationUsage } from '@/lib/server-utils'
import {
  ensureLogoAsset,
  generateUniqueOrganizationSlug,
  ensureDefaultPlans,
} from '@/lib/organizations/service'

type MembershipWithOrganization = {
  id: string
  organizationId: string
  inviteStatus: OrganizationMembershipInviteStatus
  role: OrganizationMembershipRole
  organization: {
    id: string
    status: OrganizationStatus
    displayName: string
    planValidUntil: Date | null
    logoUrl: string | null
    logoAsset: {
      url: string | null
    } | null
    plan: {
      label: string
      maxActiveProjects: number
      maxEditors: number
      maxVerifiers: number
      maxViewers: number | null
    }
  }
}

const CreateOrganizationSchema = z.object({
  display_name: z.string().trim().min(3).max(64),
  description: z.string().trim().max(400).optional(),
  logo_asset_id: z.string().uuid().optional(),
})

function validationError(message: string, details?: Record<string, unknown>) {
  return errorResponse(new ApiError(400, 'VALIDATION_ERROR', message, details))
}

function parseIncludePending(request: NextRequest) {
  const url = new URL(request.url)
  const raw = url.searchParams.get('includePending')
  return raw === 'true' || raw === '1'
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const includePending = parseIncludePending(request)

    const memberships = (await prisma.organizationMembership.findMany({
      where: {
        userId: user.id,
        inviteStatus: includePending
          ? { in: [OrganizationMembershipInviteStatus.ACCEPTED, OrganizationMembershipInviteStatus.PENDING] }
          : OrganizationMembershipInviteStatus.ACCEPTED,
        organization: { status: { not: OrganizationStatus.DELETED } },
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
      orderBy: {
        createdAt: 'asc',
      },
    })) as MembershipWithOrganization[]

    const usageMap = new Map<string, Awaited<ReturnType<typeof getOrganizationUsage>>>()

    const acceptedMemberships = memberships.filter(
      (membership) =>
        membership.inviteStatus === OrganizationMembershipInviteStatus.ACCEPTED &&
        membership.organization.status !== OrganizationStatus.DELETED,
    )

    await Promise.all(
      acceptedMemberships.map(async (membership) => {
        const metrics = await getOrganizationUsage(membership.organizationId)
        usageMap.set(membership.organizationId, metrics)
      }),
    )

    const organizations = memberships
      .filter((membership) =>
        membership.inviteStatus === OrganizationMembershipInviteStatus.ACCEPTED
          ? membership.organization.status !== OrganizationStatus.DELETED
          : true,
      )
      .map((membership) => {
        const organization = membership.organization
        const organizationLogoUrl = organization.logoUrl ?? organization.logoAsset?.url ?? null
        const base = {
          id: organization.id,
          membership_id: membership.id,
          display_name: organization.displayName,
          plan_label: organization.plan.label,
          plan_valid_until: organization.planValidUntil,
          role: membership.role,
          logo_url: organizationLogoUrl,
        }

        if (membership.inviteStatus !== OrganizationMembershipInviteStatus.ACCEPTED) {
          return {
            ...base,
            invite_status: membership.inviteStatus.toLowerCase(),
          }
        }

        const usage = usageMap.get(organization.id)

        return {
          ...base,
          active_projects: usage?.active_projects ?? 0,
          limits: {
            max_active_projects: organization.plan.maxActiveProjects,
            max_editors: organization.plan.maxEditors,
            max_verifiers: organization.plan.maxVerifiers,
            max_viewers: organization.plan.maxViewers,
          },
        }
      })

    return NextResponse.json({ organizations })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to list organizations'))
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const data = await request.json()
    const parseResult = CreateOrganizationSchema.safeParse(data)

    if (!parseResult.success) {
      return validationError('Invalid organization payload', {
        issues: parseResult.error.flatten(),
      })
    }

    const payload = parseResult.data
    const slug = await generateUniqueOrganizationSlug(payload.display_name)
    const now = new Date()

    if (payload.description && Buffer.byteLength(payload.description, 'utf8') > 4096) {
      return errorResponse(
        new ApiError(413, 'VALIDATION_ERROR', 'Description exceeds maximum size'),
      )
    }

    if (payload.logo_asset_id) {
      await ensureLogoAsset(payload.logo_asset_id, user.id)
    }

    try {
      const organization = await prisma.$transaction(async (tx) => {
        await ensureDefaultPlans(tx)

        const created = await tx.organization.create({
          data: {
            slug,
            displayName: payload.display_name,
            description: payload.description ?? null,
            planCode: 'free',
            planAssignedAt: now,
            planValidUntil: null,
            logoAssetId: payload.logo_asset_id ?? null,
            createdByUserId: user.id,
          },
          include: {
            plan: true,
          },
        })

        await tx.organizationMembership.create({
          data: {
            organizationId: created.id,
            userId: user.id,
            role: OrganizationMembershipRole.OWNER,
            inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
            invitedByUserId: user.id,
            joinedAt: now,
            lastActiveAt: now,
          },
        })

        return created
      })

      return NextResponse.json(
        {
          organization: {
            id: organization.id,
            slug: organization.slug,
            display_name: organization.displayName,
            description: organization.description,
            plan_code: organization.planCode,
            plan_assigned_at: organization.planAssignedAt,
            plan_valid_until: organization.planValidUntil,
            limits: {
              max_active_projects: organization.plan.maxActiveProjects,
              max_editors: organization.plan.maxEditors,
              max_verifiers: organization.plan.maxVerifiers,
              max_viewers: organization.plan.maxViewers,
            },
          },
        },
        { status: 201 },
      )
    } catch (error: any) {
      if (error?.code === 'P2002') {
        return errorResponse(
          new ApiError(409, 'CONFLICT', 'Organization slug already exists', {
            slug,
          }),
        )
      }

      throw error
    }
  } catch (error) {
    console.error('Failed to create organization', error)
    return errorResponse(ensureApiError(error, 'Failed to create organization'))
  }
}
