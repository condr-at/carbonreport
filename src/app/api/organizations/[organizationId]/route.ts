import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
  OrganizationStatus,
  ProjectStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership } from '@/lib/server-utils'
import { ensureLogoAsset } from '@/lib/organizations/service'

const UpdateOrganizationSchema = z
  .object({
    display_name: z.string().trim().min(3).max(64).optional(),
    description: z.string().trim().max(400).optional(),
    logo_asset_id: z.string().uuid().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

const ORGANIZATION_RETENTION_DAYS = 30

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = await context.params

    await assertOrgMembership(user.id, organizationId, OrganizationMembershipRole.ADMIN)

    const payload = await request.json().catch(() => ({}))
    const parsed = UpdateOrganizationSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid organization payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const { display_name: displayName, description, logo_asset_id: logoAssetId } = parsed.data

    if (description && Buffer.byteLength(description, 'utf8') > 4096) {
      return errorResponse(
        new ApiError(413, 'VALIDATION_ERROR', 'Description exceeds maximum size'),
      )
    }

    if (logoAssetId) {
      await ensureLogoAsset(logoAssetId, user.id)
    }

    const updated = await prisma.organization.update({
      where: {
        id: organizationId,
        status: {
          not: OrganizationStatus.DELETED,
        },
      },
      data: {
        ...(displayName ? { displayName } : {}),
        ...(parsed.data.description !== undefined
          ? { description: description ?? null }
          : {}),
        ...(parsed.data.logo_asset_id !== undefined
          ? {
              logoAssetId: logoAssetId ?? null,
            }
          : {}),
      },
      select: {
        id: true,
        displayName: true,
        description: true,
        logoAssetId: true,
      },
    })

    return NextResponse.json({
      organization: {
        id: updated.id,
        display_name: updated.displayName,
        description: updated.description,
        logo_asset_id: updated.logoAssetId,
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to update organization'))
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const user = await getCurrentUser()
    const { organizationId } = await context.params

    await assertOrgMembership(user.id, organizationId, OrganizationMembershipRole.OWNER)

    const now = new Date()
    const retentionExpiresAt = new Date(now.getTime() + ORGANIZATION_RETENTION_DAYS * 24 * 60 * 60 * 1000)

    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.findUnique({
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

      if (organization.status === OrganizationStatus.DELETED) {
        throw new ApiError(409, 'CONFLICT', 'Organization already deleted')
      }

      const pendingInvites = await tx.organizationMembership.count({
        where: {
          organizationId,
          inviteStatus: OrganizationMembershipInviteStatus.PENDING,
        },
      })

      if (pendingInvites > 0) {
        throw new ApiError(
          412,
          'PRECONDITION_FAILED',
          'Resolve pending invitations before deleting organization',
          {
          pending_invites: pendingInvites,
          },
        )
      }

      await tx.organization.update({
        where: { id: organizationId },
        data: {
          status: OrganizationStatus.DELETED,
          deletedAt: now,
        },
      })

      await tx.project.updateMany({
        where: {
          organizationId,
          status: {
            not: ProjectStatus.DELETED,
          },
        },
        data: {
          status: ProjectStatus.DELETED,
          deletedAt: now,
        },
      })

      return {
        organizationId: organizationId,
      }
    })

    return NextResponse.json(
      {
        organization_id: result.organizationId,
        status: 'deleted',
        retention_expires_at: retentionExpiresAt,
      },
      { status: 202 },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to delete organization'))
  }
}
