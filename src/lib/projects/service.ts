import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'
import {
  OrganizationMembershipRole,
  OrganizationStatus,
  ProjectStatus,
} from '@prisma/client'
import {
  assertOrgMembership,
  assertWithinLimit,
  getOrganizationUsage,
  getPlan,
  PROJECT_RETENTION_DAYS,
} from '@/lib/server-utils'
import { scheduleUsageRecompute } from '@/lib/organizations/usage-scheduler'

const DAY_IN_MS = 24 * 60 * 60 * 1000

export function computeProjectRetention(deletedAt: Date | null) {
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

function ensureRetentionWindow(deletedAt: Date | null) {
  if (!deletedAt) {
    return
  }

  const expiresAt = new Date(deletedAt.getTime() + PROJECT_RETENTION_DAYS * DAY_IN_MS)
  if (Date.now() > expiresAt.getTime()) {
    throw new ApiError(410, 'RETENTION_EXPIRED', 'Project retention window has expired')
  }
}

type LoadedProject = {
  id: string
  organizationId: string
  status: ProjectStatus
  deletedAt: Date | null
  organization: {
    status: OrganizationStatus
  }
}

async function loadProject(projectId: string): Promise<LoadedProject> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
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

  return project
}

function disallowReportedToArchived(current: ProjectStatus, next: ProjectStatus) {
  if (current === ProjectStatus.REPORTED && next === ProjectStatus.ARCHIVED) {
    throw new ApiError(409, 'CONFLICT', 'Reported projects must be restored before archiving')
  }
}

function disallowReportedReordering(current: ProjectStatus, next: ProjectStatus) {
  if (next === ProjectStatus.REPORTED && current !== ProjectStatus.ACTIVE) {
    throw new ApiError(409, 'CONFLICT', 'Only active projects can be marked as reported')
  }
}

export async function changeProjectStatus({
  projectId,
  userId,
  targetStatus,
}: {
  projectId: string
  userId: string
  targetStatus: ProjectStatus
}) {
  const project = await loadProject(projectId)

  if (project.status === ProjectStatus.DELETED) {
    throw new ApiError(409, 'CONFLICT', 'Use restore endpoint to reinstate deleted projects')
  }

  await assertOrgMembership(userId, project.organizationId, OrganizationMembershipRole.EDITOR)

  const normalizedTarget = targetStatus

  disallowReportedToArchived(project.status, normalizedTarget)
  disallowReportedReordering(project.status, normalizedTarget)

  if (project.status === normalizedTarget) {
    return {
      project: {
        id: project.id,
        status: project.status,
        deleted_at: project.deletedAt,
        retention: computeProjectRetention(project.deletedAt),
      },
    }
  }

  if (normalizedTarget === ProjectStatus.ACTIVE) {
    await assertWithinLimit(project.organizationId, 'project')
  }

  const updateData: { status: ProjectStatus; deletedAt?: Date | null } = {
    status: normalizedTarget,
  }

  if (normalizedTarget === ProjectStatus.ACTIVE) {
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

  await scheduleUsageRecompute(project.organizationId, { reason: 'project_status_change' })

  return {
    project: {
      id: updated.id,
      status: updated.status,
      deleted_at: updated.deletedAt,
      retention: computeProjectRetention(updated.deletedAt),
    },
  }
}

export async function restoreProject({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  const project = await loadProject(projectId)

  await assertOrgMembership(userId, project.organizationId, OrganizationMembershipRole.EDITOR)

  if (project.status === ProjectStatus.DELETED) {
    ensureRetentionWindow(project.deletedAt)

    const restored = await prisma.project.update({
      where: { id: project.id },
      data: {
        status: ProjectStatus.ARCHIVED,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        deletedAt: true,
      },
    })

    await scheduleUsageRecompute(project.organizationId, { reason: 'project_restore_deleted' })

    return {
      project: {
        id: restored.id,
        status: restored.status,
        deleted_at: restored.deletedAt,
        retention: computeProjectRetention(restored.deletedAt),
        restored: true,
      },
    }
  }

  if (project.status === ProjectStatus.ACTIVE) {
    const [plan, usage] = await Promise.all([
      getPlan(project.organizationId),
      getOrganizationUsage(project.organizationId),
    ])

    return {
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
    }
  }

  await assertWithinLimit(project.organizationId, 'project')

  const reactivated = await prisma.project.update({
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

  await scheduleUsageRecompute(project.organizationId, { reason: 'project_restore_active' })

  const [plan, usage] = await Promise.all([
    getPlan(project.organizationId),
    getOrganizationUsage(project.organizationId),
  ])

  return {
    project: {
      id: reactivated.id,
      status: reactivated.status,
      deleted_at: reactivated.deletedAt,
      restored: true,
    },
    limit_check: {
      resource: 'active_projects',
      limit: plan.maxActiveProjects,
      current: usage.active_projects,
    },
  }
}
