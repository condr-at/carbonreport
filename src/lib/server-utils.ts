import { headers } from 'next/headers'
import prisma from '@/lib/db'
import { ApiError, ensureApiError } from '@/lib/api-error'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
  OrganizationStatus,
  ProjectStatus,
  type Prisma,
} from '@prisma/client'

type QueryExecutor = Prisma.TransactionClient

type LimitResource = 'project' | 'editor' | 'verifier'

export const PROJECT_RETENTION_DAYS = 30

const ROLE_RANK: Record<OrganizationMembershipRole, number> = {
  [OrganizationMembershipRole.OWNER]: 4,
  [OrganizationMembershipRole.ADMIN]: 3,
  [OrganizationMembershipRole.EDITOR]: 2,
  [OrganizationMembershipRole.VIEWER_VERIFIER]: 1,
  [OrganizationMembershipRole.VIEWER_READONLY]: 0,
}

const RESOURCE_TO_PLAN_KEY: Record<LimitResource, 'maxActiveProjects' | 'maxEditors' | 'maxVerifiers'> = {
  project: 'maxActiveProjects',
  editor: 'maxEditors',
  verifier: 'maxVerifiers',
}

const RESOURCE_DETAILS_KEY: Record<LimitResource, string> = {
  project: 'active_projects',
  editor: 'active_editors',
  verifier: 'active_verifiers',
}

const SEAT_ROLE_LABEL: Record<Exclude<LimitResource, 'project'>, string> = {
  editor: 'EDITOR',
  verifier: 'VIEWER_VERIFIER',
}

export type OrganizationPlanSummary = {
  organizationId: string
  planCode: string
  label: string
  maxActiveProjects: number
  maxEditors: number
  maxVerifiers: number
  maxViewers: number | null
  assignedAt: Date
  validUntil: Date | null
}

export async function getDefaultOrganizationMembership(userId: string) {
  try {
    const membership = await prisma.organizationMembership.findFirst({
      where: {
        userId,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        organization: {
          status: {
            not: OrganizationStatus.DELETED,
          },
        },
      },
      orderBy: [{ createdAt: 'asc' }],
      include: {
        organization: {
          select: {
            id: true,
            displayName: true,
            planCode: true,
            planValidUntil: true,
            plan: {
              select: {
                label: true,
                maxActiveProjects: true,
                maxEditors: true,
                maxVerifiers: true,
                maxViewers: true,
              },
            },
          },
        },
      },
    })

    return membership
  } catch (error) {
    throw ensureApiError(error)
  }
}

export async function getPlan(organizationId: string, executor: QueryExecutor = prisma): Promise<OrganizationPlanSummary> {
  try {
    const organization = await executor.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        status: true,
        planCode: true,
        planAssignedAt: true,
        planValidUntil: true,
        plan: {
          select: {
            planCode: true,
            label: true,
            maxActiveProjects: true,
            maxEditors: true,
            maxVerifiers: true,
            maxViewers: true,
          },
        },
      },
    })

    if (!organization || organization.status === OrganizationStatus.DELETED) {
      throw new ApiError(404, 'NOT_FOUND', 'Organization not found')
    }

    return {
      organizationId: organization.id,
      planCode: organization.plan.planCode,
      label: organization.plan.label,
      maxActiveProjects: organization.plan.maxActiveProjects,
      maxEditors: organization.plan.maxEditors,
      maxVerifiers: organization.plan.maxVerifiers,
      maxViewers: organization.plan.maxViewers,
      assignedAt: organization.planAssignedAt,
      validUntil: organization.planValidUntil,
    }
  } catch (error) {
    throw ensureApiError(error)
  }
}

export async function assertOrgMembership(
  userId: string,
  organizationId: string,
  minRole: OrganizationMembershipRole = OrganizationMembershipRole.VIEWER_READONLY,
  executor: QueryExecutor = prisma,
) {
  try {
    const membership = await executor.organizationMembership.findFirst({
      where: {
        organizationId,
        userId,
        inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        organization: {
          status: {
            not: OrganizationStatus.DELETED,
          },
        },
      },
    })

    if (!membership) {
      throw new ApiError(403, 'FORBIDDEN', 'Access to organization denied')
    }

    if (ROLE_RANK[membership.role] < ROLE_RANK[minRole]) {
      throw new ApiError(403, 'FORBIDDEN', 'Insufficient role for this action', {
        required_role: minRole,
        actual_role: membership.role,
      })
    }

    return membership
  } catch (error) {
    throw ensureApiError(error)
  }
}

type AssertWithinLimitOptions = {
  needed?: number
}

export async function assertWithinLimit(
  organizationId: string,
  resource: LimitResource,
  options: AssertWithinLimitOptions = {},
  executor: QueryExecutor = prisma,
) {
  const needed = options.needed ?? 1

  if (needed <= 0) {
    return
  }

  try {
    const plan = await getPlan(organizationId, executor)
    const planKey = RESOURCE_TO_PLAN_KEY[resource]
    const limit = plan[planKey as keyof OrganizationPlanSummary] as number

    if (limit === null) {
      return
    }

    const current = await getResourceUsageCount(organizationId, resource, executor)

    if (current + needed > limit) {
      if (resource === 'project') {
        throw new ApiError(409, 'PLAN_LIMIT_EXCEEDED', 'Active project limit reached', {
          resource: RESOURCE_DETAILS_KEY[resource],
          limit,
          current,
          needed,
        })
      }

      throw new ApiError(409, 'SEAT_LIMIT_EXCEEDED', `No ${resource} seats available`, {
        role: SEAT_ROLE_LABEL[resource],
        limit,
        current,
      })
    }
  } catch (error) {
    throw ensureApiError(error)
  }
}

async function getResourceUsageCount(organizationId: string, resource: LimitResource, executor: QueryExecutor = prisma) {
  switch (resource) {
    case 'project':
      return executor.project.count({
        where: {
          organizationId,
          status: ProjectStatus.ACTIVE,
        },
      })
    case 'editor':
      return executor.organizationMembership.count({
        where: {
          organizationId,
          role: OrganizationMembershipRole.EDITOR,
          inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        },
      })
    case 'verifier':
      return executor.organizationMembership.count({
        where: {
          organizationId,
          role: OrganizationMembershipRole.VIEWER_VERIFIER,
          inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
        },
      })
    default:
      return 0
  }
}

export async function getOrganizationUsage(organizationId: string) {
  try {
    const [activeProjects, activeEditors, activeVerifiers, activeViewers] = await Promise.all([
      getResourceUsageCount(organizationId, 'project'),
      getResourceUsageCount(organizationId, 'editor'),
      getResourceUsageCount(organizationId, 'verifier'),
      getViewerCount(organizationId),
    ])

    return {
      active_projects: activeProjects,
      active_editors: activeEditors,
      active_verifiers: activeVerifiers,
      active_viewers: activeViewers,
    }
  } catch (error) {
    throw ensureApiError(error)
  }
}

async function getViewerCount(organizationId: string) {
  return prisma.organizationMembership.count({
    where: {
      organizationId,
      inviteStatus: OrganizationMembershipInviteStatus.ACCEPTED,
      role: {
        in: [
          OrganizationMembershipRole.VIEWER_READONLY,
          OrganizationMembershipRole.VIEWER_VERIFIER,
        ],
      },
    },
  })
}

/**
 * Resolve absolute base URL for server-side data fetching.
 * Prefers request headers to support non-default ports (e.g. Turbopack using 3001).
 */
export async function getBaseUrl(): Promise<string> {
  try {
    const hdrs = await headers()
    const forwardedProto = hdrs.get('x-forwarded-proto')
    const forwardedHost = hdrs.get('x-forwarded-host')
    const host = forwardedHost ?? hdrs.get('host')

    if (host) {
      const protocol = forwardedProto ?? (host.startsWith('localhost') ? 'http' : 'https')
      return `${protocol}://${host}`
    }
  } catch {
    // headers() throws when used outside a request context (e.g. during build-time evaluation).
    // Fall back to environment-driven heuristics in those situations.
  }

  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  const explicitAppUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || null

  if (explicitAppUrl) {
    return explicitAppUrl
  }

  if (vercelUrl) {
    return vercelUrl
  }

  const port = process.env.PORT || '3000'
  return `http://localhost:${port}`
}

type ServerFetchInput = string | URL

function ensureAbsoluteUrl(path: ServerFetchInput, origin: string) {
  const input = typeof path === 'string' ? path : path.toString()
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input
  }

  if (input.startsWith('/')) {
    return `${origin}${input}`
  }

  return `${origin}/${input}`
}

export async function serverApiFetch(path: ServerFetchInput, init?: RequestInit) {
  const baseUrl = await getBaseUrl()
  const absoluteUrl = ensureAbsoluteUrl(path, baseUrl)

  let incomingHeaders: Headers | null = null
  try {
    incomingHeaders = await headers()
  } catch {
    incomingHeaders = null
  }

  const cookieHeader = incomingHeaders?.get('cookie') ?? null

  const mergedHeaders = new Headers(init?.headers ?? undefined)

  if (!mergedHeaders.has('accept')) {
    mergedHeaders.set('accept', 'application/json')
  }

  if (cookieHeader && !mergedHeaders.has('cookie')) {
    mergedHeaders.set('cookie', cookieHeader)
  }

  const authorization = incomingHeaders?.get('authorization')
  if (authorization && !mergedHeaders.has('authorization')) {
    mergedHeaders.set('authorization', authorization)
  }

  return fetch(absoluteUrl, {
    cache: 'no-store',
    ...init,
    headers: mergedHeaders,
  })
}
