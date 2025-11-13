import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  OrganizationMembershipRole,
  OrganizationStatus,
  ProjectStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership, assertWithinLimit, PROJECT_RETENTION_DAYS } from '@/lib/server-utils'
const DAY_IN_MS = 24 * 60 * 60 * 1000

interface RouteParams {
  params: Promise<{ id: string }>
}

const UpdateStatusSchema = z.object({
  status: z.enum(['active', 'archived', 'reported', 'deleted']),
})

const STATUS_LOOKUP: Record<string, ProjectStatus> = {
  active: ProjectStatus.ACTIVE,
  archived: ProjectStatus.ARCHIVED,
  reported: ProjectStatus.REPORTED,
  deleted: ProjectStatus.DELETED,
}

function computeRetentionMetadata(deletedAt: Date | null) {
  if (!deletedAt) {
    return null
  }

  const expiresAt = new Date(deletedAt.getTime() + PROJECT_RETENTION_DAYS * DAY_IN_MS)
  const now = Date.now()
  const remainingMs = Math.max(0, expiresAt.getTime() - now)
  const daysRemaining = Math.ceil(remainingMs / DAY_IN_MS)

  return {
    expires_at: expiresAt,
    days_remaining: daysRemaining,
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const parsed = UpdateStatusSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid status update payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const targetStatus = STATUS_LOOKUP[parsed.data.status]

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        organizationId: true,
        status: true,
        deletedAt: true,
        organization: {
          select: {
            status: true,
          },
        },
      },
    })

    if (!project || project.organization.status === OrganizationStatus.DELETED) {
      throw new ApiError(404, 'NOT_FOUND', 'Project not found')
    }

    await assertOrgMembership(user.id, project.organizationId, OrganizationMembershipRole.EDITOR)

    if (project.status === ProjectStatus.DELETED && targetStatus !== ProjectStatus.DELETED) {
      throw new ApiError(409, 'CONFLICT', 'Use restore endpoint to reinstate deleted projects')
    }

    if (project.status === ProjectStatus.REPORTED && targetStatus === ProjectStatus.ARCHIVED) {
      throw new ApiError(409, 'CONFLICT', 'Reported projects must be restored before archiving')
    }

    if (project.status === targetStatus) {
      return NextResponse.json({
        project: {
          id: project.id,
          status: project.status,
          deleted_at: project.deletedAt,
          retention: computeRetentionMetadata(project.deletedAt),
        },
      })
    }

    if (targetStatus === ProjectStatus.ACTIVE) {
      await assertWithinLimit(project.organizationId, 'project')
    }

    if (targetStatus === ProjectStatus.DELETED) {
      const deletedAt = new Date()
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: ProjectStatus.DELETED,
          deletedAt,
        },
      })

      return NextResponse.json(
        {
          project: {
            id: project.id,
            status: ProjectStatus.DELETED,
            deleted_at: deletedAt,
            retention: computeRetentionMetadata(deletedAt),
          },
        },
        { status: 202 },
      )
    }

    const updateData: { status: ProjectStatus; deletedAt?: Date | null } = {
      status: targetStatus,
    }

    if (targetStatus === ProjectStatus.ACTIVE) {
      updateData.deletedAt = null
    }

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: updateData,
      select: {
        id: true,
        status: true,
        deletedAt: true,
      },
    })

    return NextResponse.json({
      project: {
        id: updated.id,
        status: updated.status,
        deleted_at: updated.deletedAt,
        retention: computeRetentionMetadata(updated.deletedAt),
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to update project status'))
  }
}
