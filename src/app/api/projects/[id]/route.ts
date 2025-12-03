import { NextRequest, NextResponse } from 'next/server'
import {
  OrganizationMembershipRole,
  OrganizationStatus,
  ProjectStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership } from '@/lib/server-utils'
import { computeProjectRetention } from '@/lib/projects/service'
import { scheduleUsageRecompute } from '@/lib/organizations/usage-scheduler'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        organizationId: true,
        name: true,
        status: true,
        datasetVersion: true,
        createdAt: true,
        deletedAt: true,
        checklist: true,
        reports: {
          select: {
            id: true,
            templateCode: true,
            completion: true,
          },
        },
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

    await assertOrgMembership(user.id, project.organizationId, OrganizationMembershipRole.VIEWER_READONLY)

    return NextResponse.json({
      project: {
        id: project.id,
        organization_id: project.organizationId,
        name: project.name,
        status: project.status,
        dataset_version: project.datasetVersion,
        created_at: project.createdAt,
        deleted_at: project.deletedAt,
        checklist: project.checklist,
        reports: project.reports.map((report) => ({
          id: report.id,
          template_code: report.templateCode,
          completion: report.completion,
        })),
        retention: computeProjectRetention(project.deletedAt),
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to load project'))
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const now = new Date()
    const deletionAlreadyApplied = project.status === ProjectStatus.DELETED
    const deletedAt = deletionAlreadyApplied ? project.deletedAt ?? now : now

    if (!deletionAlreadyApplied) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          status: ProjectStatus.DELETED,
          deletedAt,
        },
      })
    }

    await scheduleUsageRecompute(project.organizationId, { reason: 'project_deleted' })

    return NextResponse.json(
      {
        project: {
          id: project.id,
          status: ProjectStatus.DELETED,
          deleted_at: deletedAt,
          retention: computeProjectRetention(deletedAt),
        },
        already_deleted: deletionAlreadyApplied,
      },
      { status: 202 },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to delete project'))
  }
}
