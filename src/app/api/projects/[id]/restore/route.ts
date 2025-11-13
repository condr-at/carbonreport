import { NextRequest, NextResponse } from 'next/server'
import {
  OrganizationMembershipRole,
  OrganizationStatus,
  ProjectStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import {
  assertOrgMembership,
  assertWithinLimit,
  getOrganizationUsage,
  getPlan,
  PROJECT_RETENTION_DAYS,
} from '@/lib/server-utils'
const DAY_IN_MS = 24 * 60 * 60 * 1000

interface RouteParams {
  params: Promise<{ id: string }>
}

function ensureWithinRetention(deletedAt: Date | null) {
  if (!deletedAt) {
    return
  }

  const expiresAt = new Date(deletedAt.getTime() + PROJECT_RETENTION_DAYS * DAY_IN_MS)
  if (Date.now() > expiresAt.getTime()) {
    throw new ApiError(410, 'RETENTION_EXPIRED', 'Project retention window has expired')
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

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

    if (project.status === ProjectStatus.ACTIVE) {
      const [plan, usage] = await Promise.all([
        getPlan(project.organizationId),
        getOrganizationUsage(project.organizationId),
      ])

      return NextResponse.json({
        project: {
          id: project.id,
          status: project.status,
          deleted_at: project.deletedAt,
        },
        limit_check: {
          resource: 'active_projects',
          limit: plan.maxActiveProjects,
          current: usage.active_projects,
        },
      })
    }

    ensureWithinRetention(project.deletedAt)

    await assertWithinLimit(project.organizationId, 'project')

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        status: ProjectStatus.ACTIVE,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        deletedAt: true,
      },
    })

    const [plan, usage] = await Promise.all([
      getPlan(project.organizationId),
      getOrganizationUsage(project.organizationId),
    ])

    return NextResponse.json({
      project: {
        id: updated.id,
        status: updated.status,
        deleted_at: updated.deletedAt,
      },
      limit_check: {
        resource: 'active_projects',
        limit: plan.maxActiveProjects,
        current: usage.active_projects,
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to restore project'))
  }
}
