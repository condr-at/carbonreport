import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
  OrganizationStatus,
  Prisma,
  ProjectStatus,
} from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { assertOrgMembership, assertWithinLimit } from '@/lib/server-utils'
import { getReportTemplate } from '@/lib/report-templates'
import { createEmptyDataset } from '@/lib/dataset-validation'

const CreateProjectSchema = z.object({
  id: z.string().uuid().optional(),
  organization_id: z.string().uuid(),
  name: z.string().trim().min(3).max(200),
  template_codes: z.array(z.string().trim()).min(1),
})

const STATUS_LOOKUP: Record<string, ProjectStatus> = {
  active: ProjectStatus.ACTIVE,
  archived: ProjectStatus.ARCHIVED,
  reported: ProjectStatus.REPORTED,
  deleted: ProjectStatus.DELETED,
}

function parseBooleanFlag(value: string | null) {
  if (!value) return false
  return value === 'true' || value === '1'
}

function validationError(message: string, details?: Record<string, unknown>) {
  return errorResponse(new ApiError(400, 'VALIDATION_ERROR', message, details))
}

function buildDefaultMailtoTemplate(templateCodes: string[]) {
  for (const code of templateCodes) {
    const template = getReportTemplate(code as any)
    if (template?.mailto) {
      return {
        subject: template.mailto.subject,
        body: template.mailto.body,
      }
    }
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const url = new URL(request.url)
    const organizationIdFilter = url.searchParams.get('organization_id')
    const statusParam = url.searchParams.get('status')?.toLowerCase() ?? null
    const includeDeleted = parseBooleanFlag(url.searchParams.get('includeDeleted'))

    const memberships = await prisma.organizationMembership.findMany({
      where: {
        userId: user.id,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        organization: {
          status: {
            not: OrganizationStatus.DELETED,
          },
        },
      },
      select: {
        organizationId: true,
      },
    })

    if (memberships.length === 0) {
      return NextResponse.json({ projects: [] })
    }

    const accessibleOrganizationIds = new Set(memberships.map((membership) => membership.organizationId))

    if (organizationIdFilter && !accessibleOrganizationIds.has(organizationIdFilter)) {
      throw new ApiError(403, 'FORBIDDEN', 'Access to organization denied')
    }

    let statusFilter: ProjectStatus | undefined
    if (statusParam) {
      statusFilter = STATUS_LOOKUP[statusParam]
      if (!statusFilter) {
        return validationError('Unsupported status filter', {
          status: statusParam,
        })
      }
    }

    const organizationIds = organizationIdFilter
      ? [organizationIdFilter]
      : Array.from(accessibleOrganizationIds)

    const where: Prisma.ProjectWhereInput = {
      organizationId: {
        in: organizationIds,
      },
    }

    if (statusFilter) {
      where.status = statusFilter
    } else if (!includeDeleted) {
      where.status = {
        not: ProjectStatus.DELETED,
      }
    }

    const projects = await prisma.project.findMany({
      where,
      select: {
        id: true,
        organizationId: true,
        name: true,
        status: true,
        createdAt: true,
        datasetVersion: true,
        deletedAt: true,
        checklist: true,
        reports: {
          select: {
            id: true,
            templateCode: true,
            completion: true,
          },
        },
        _count: {
          select: {
            reports: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      projects: projects.map((project) => ({
        id: project.id,
        organization_id: project.organizationId,
        name: project.name,
        status: project.status,
        reports_count: project._count.reports,
        dataset_version: project.datasetVersion,
        created_at: project.createdAt,
        deleted_at: project.deletedAt,
        checklist: project.checklist,
        reports: project.reports.map((report) => ({
          id: report.id,
          template_code: report.templateCode,
          completion: report.completion,
        })),
      })),
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to list projects'))
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const payload = await request.json().catch(() => ({}))
    const parsed = CreateProjectSchema.safeParse(payload)

    if (!parsed.success) {
      return validationError('Invalid project payload', {
        issues: parsed.error.flatten(),
      })
    }

  const projectIdOverride = parsed.data.id
  const organizationId = parsed.data.organization_id
    const name = parsed.data.name
    const templateCodes = [...new Set(parsed.data.template_codes)]

    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        status: {
          not: OrganizationStatus.DELETED,
        },
      },
      select: {
        id: true,
      },
    })

    if (!organization) {
      throw new ApiError(404, 'NOT_FOUND', 'Organization not found')
    }

    await assertOrgMembership(user.id, organizationId, OrganizationMembershipRole.EDITOR)
    await assertWithinLimit(organizationId, 'project')

    const invalidCode = templateCodes.find((code) => !getReportTemplate(code as any))
    if (invalidCode) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid template code provided', {
        template_code: invalidCode,
      })
    }

    const defaultMailtoTemplate = buildDefaultMailtoTemplate(templateCodes)
    const dataset = createEmptyDataset()

    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          ...(projectIdOverride ? { id: projectIdOverride } : {}),
          organizationId,
          createdByUserId: user.id,
          name,
          status: ProjectStatus.ACTIVE,
          dataset: dataset as Prisma.InputJsonValue,
          datasetVersion: 0,
          mailtoTemplate: defaultMailtoTemplate ?? undefined,
          checklist: {
            items: [],
          },
        },
      })

      const reports = [] as {
        id: string
        templateCode: string
        completion: number
      }[]

      for (const code of templateCodes) {
        const createdReport = await tx.report.create({
          data: {
            projectId: project.id,
            templateCode: code,
            completion: 0,
          },
          select: {
            id: true,
            templateCode: true,
            completion: true,
          },
        })
        reports.push(createdReport)
      }

      return { project, reports }
    })

    return NextResponse.json(
      {
        project: {
          id: result.project.id,
          organization_id: result.project.organizationId,
          name: result.project.name,
          status: result.project.status,
          dataset_version: result.project.datasetVersion,
          created_at: result.project.createdAt,
        },
        reports: result.reports.map((report) => ({
          id: report.id,
          template_code: report.templateCode,
          completion: report.completion,
        })),
      },
      { status: 201 },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to create project'))
  }
}
