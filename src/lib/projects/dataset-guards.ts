import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'
import { assertOrgMembership, PROJECT_RETENTION_DAYS } from '@/lib/server-utils'
import {
  OrganizationMembershipRole,
  OrganizationStatus,
  ProjectStatus,
  type Prisma,
} from '@prisma/client'

const DAY_IN_MS = 24 * 60 * 60 * 1000

type DatasetGuardOptions = {
  includeDataset?: boolean
  includeName?: boolean
  requireWritable?: boolean
  role?: OrganizationMembershipRole
}

export type DatasetProjectRecord = {
  id: string
  organizationId: string
  status: ProjectStatus
  deletedAt: Date | null
  datasetVersion: number
  dataset?: Prisma.JsonValue | null
  name?: string
}

export async function requireProjectForDataset(
  userId: string,
  projectId: string,
  options: DatasetGuardOptions = {},
): Promise<DatasetProjectRecord> {
  const role = options.role ?? OrganizationMembershipRole.VIEWER_READONLY
  const select: Record<string, boolean | object> = {
    id: true,
    organizationId: true,
    status: true,
    deletedAt: true,
    datasetVersion: true,
    organization: {
      select: {
        status: true,
      },
    },
  }

  if (options.includeDataset) {
    select.dataset = true
  }

  if (options.includeName) {
    select.name = true
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: select as {
      id: true
      organizationId: true
      status: true
      deletedAt: true
      datasetVersion: true
      dataset?: true
      name?: true
      organization: { select: { status: true } }
    },
  })

  if (!project || project.organization.status === OrganizationStatus.DELETED) {
    throw new ApiError(404, 'NOT_FOUND', 'Project not found')
  }

  await assertOrgMembership(userId, project.organizationId, role)

  if (project.status === ProjectStatus.DELETED) {
    if (project.deletedAt) {
      const expiresAt = new Date(project.deletedAt.getTime() + PROJECT_RETENTION_DAYS * DAY_IN_MS)
      if (Date.now() > expiresAt.getTime()) {
        throw new ApiError(410, 'RETENTION_EXPIRED', 'Project retention window has expired', {
          deleted_at: project.deletedAt.toISOString(),
          window_days: PROJECT_RETENTION_DAYS,
        })
      }
    }

    throw new ApiError(409, 'CONFLICT', 'Project was deleted and dataset is unavailable', {
      status: project.status,
    })
  }

  if (options.requireWritable && project.status === ProjectStatus.REPORTED) {
    throw new ApiError(409, 'CONFLICT', 'Reported projects are read-only', {
      status: project.status,
    })
  }

  const { organization: _organization, ...rest } = project
  return rest
}
