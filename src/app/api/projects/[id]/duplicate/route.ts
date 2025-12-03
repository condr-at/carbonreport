import { NextRequest, NextResponse } from 'next/server'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { OrganizationMembershipRole, ProjectStatus, Prisma } from '@prisma/client'
import { assertOrgMembership, assertWithinLimit } from '@/lib/server-utils'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Optional payload allows override name and behavior flags
// {
//   name?: string
//   reset_completion?: boolean
// }

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    const { id: sourceProjectId } = await params
    const body = await request.json().catch(() => ({})) as {
      name?: string
      reset_completion?: boolean
    }

    const resetCompletion = Boolean(body.reset_completion)

    // Load source project (with reports and minimal fields)
    const source = await prisma.project.findUnique({
      where: { id: sourceProjectId },
      select: {
        id: true,
        organizationId: true,
        name: true,
        status: true,
        projectType: true,
        dataset: true,
        datasetVersion: true,
        mailtoTemplate: true,
        checklist: true,
        reports: {
          select: {
            templateCode: true,
            completion: true,
          },
        },
        organization: { select: { id: true, status: true } },
      },
    })

    if (!source || source.organization.status !== 'ACTIVE') {
      throw new ApiError(404, 'NOT_FOUND', 'Source project not found')
    }

    // Permissions: need EDITOR to duplicate
    await assertOrgMembership(user.id, source.organizationId, OrganizationMembershipRole.EDITOR)

    // Enforce active project limit (duplicate always creates ACTIVE project)
    await assertWithinLimit(source.organizationId, 'project')

    const targetName = body.name && body.name.trim().length > 0
      ? body.name.trim()
      : `Copy of ${source.name}`

    // Perform duplication inside transaction
    const result = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          organizationId: source.organizationId,
          createdByUserId: user.id,
          name: targetName,
          projectType: source.projectType,
          status: ProjectStatus.ACTIVE,
          // Copy dataset verbatim; start fresh optimistic counter at 0 for simplicity
          dataset: source.dataset as Prisma.InputJsonValue,
          datasetVersion: 0,
          mailtoTemplate: (source.mailtoTemplate ?? undefined) as Prisma.InputJsonValue,
          checklist: (source.checklist ?? undefined) as Prisma.InputJsonValue,
        },
        select: {
          id: true,
          organizationId: true,
          name: true,
          status: true,
          datasetVersion: true,
          createdAt: true,
        },
      })

      const reports = [] as { id: string; templateCode: string; completion: number }[]
      for (const r of source.reports) {
        const created = await tx.report.create({
          data: {
            projectId: newProject.id,
            templateCode: r.templateCode,
            completion: resetCompletion ? 0 : r.completion,
          },
          select: { id: true, templateCode: true, completion: true },
        })
        reports.push(created)
      }

      return { project: newProject, reports }
    })

    return NextResponse.json({
      project: {
        id: result.project.id,
        organization_id: result.project.organizationId,
        name: result.project.name,
        status: result.project.status,
        dataset_version: result.project.datasetVersion,
        created_at: result.project.createdAt,
        duplicated_from: sourceProjectId,
      },
      reports: result.reports.map((r) => ({
        id: r.id,
        template_code: r.templateCode,
        completion: r.completion,
      })),
      reset_completion: resetCompletion,
    }, { status: 201 })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to duplicate project'))
  }
}
