'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request, ApiError } from '@/lib/api-client'
import { projectKeys } from './keys'
import { notifications } from '@/components/ui/notifications'

export type ProjectStatusSlug = 'active' | 'archived' | 'reported' | 'deleted'

interface UpdateProjectStatusVariables {
  projectId: string
  status: ProjectStatusSlug
}

interface ProjectRetentionMetadata {
  expires_at: string
  days_remaining: number
}

interface ProjectStatusPayload {
  project: {
    id: string
    status: string
    deleted_at: string | null
    retention?: ProjectRetentionMetadata | null
  }
}

interface ProjectReportListItem {
  id: string
  template_code: string
  completion: number
}

export interface ProjectListItemResponse {
  id: string
  organization_id: string
  name: string
  status: string
  reports_count: number
  dataset_version: number
  created_at: string
  deleted_at: string | null
  checklist: unknown
  reports: ProjectReportListItem[]
}

export interface ProjectsListResponse {
  projects: ProjectListItemResponse[]
}

export interface ProjectListViewItem {
  id: string
  organizationId: string
  name: string
  status: string
  reportsCount: number
  reports: Array<{
    id: string
    templateCode: string
    completion: number
  }>
  createdAt: string
  deletedAt: string | null
  checklist?: unknown
}

function normalizeProject(project: ProjectListItemResponse): ProjectListViewItem {
  return {
    id: project.id,
    organizationId: project.organization_id,
    name: project.name,
    status: project.status,
    reportsCount: project.reports_count ?? project.reports?.length ?? 0,
    reports: Array.isArray(project.reports)
      ? project.reports.map((report) => ({
          id: report.id,
          templateCode: report.template_code,
          completion: report.completion,
        }))
      : [],
    createdAt: project.created_at,
    deletedAt: project.deleted_at,
    checklist: project.checklist,
  }
}

const SUCCESS_MESSAGES: Record<ProjectStatusSlug, string> = {
  active: 'Project restored.',
  archived: 'Project archived.',
  reported: 'Project marked as reported.',
  deleted: 'Project deleted.',
}

export function useProjectsList(organizationId: string | null | undefined) {
  return useQuery<ProjectListViewItem[]>({
    queryKey: projectKeys.list(organizationId ?? undefined),
    enabled: Boolean(organizationId),
    queryFn: async () => {
      const search = organizationId ? `?organization_id=${organizationId}&includeDeleted=true` : '?includeDeleted=true'
      const data = await request<ProjectsListResponse>(`/api/projects${search}`)
      return data.projects.map(normalizeProject)
    },
    staleTime: 30_000,
  })
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient()

  return useMutation<ProjectStatusPayload, unknown, UpdateProjectStatusVariables>({
    mutationKey: ['projects', 'update-status'],
    mutationFn: async (variables) => {
      if (variables.status === 'deleted') {
        return request<ProjectStatusPayload>(`/api/projects/${variables.projectId}`, {
          method: 'DELETE',
        })
      }

      if (variables.status === 'active') {
        return request<ProjectStatusPayload>(`/api/projects/${variables.projectId}/restore`, {
          method: 'POST',
        })
      }

      return request<ProjectStatusPayload>(`/api/projects/${variables.projectId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: variables.status }),
      })
    },
    onSuccess: (data, variables) => {
      const listQueries = queryClient.getQueriesData<ProjectListViewItem[]>({ queryKey: ['projects', 'list'] })

      listQueries.forEach(([queryKey, cached]) => {
        if (!cached) {
          return
        }

        const nextStatus = data?.project?.status ?? variables.status.toUpperCase()
        const updated = cached.map((project) =>
          project.id === variables.projectId
            ? {
                ...project,
                status: nextStatus,
                deletedAt: data?.project?.deleted_at ?? null,
              }
            : project,
        )
        queryClient.setQueryData(queryKey, updated)
      })

      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId), exact: false })
      queryClient.invalidateQueries({ queryKey: projectKeys.dataset(variables.projectId), exact: false })
      queryClient.invalidateQueries({ queryKey: projectKeys.contacts(variables.projectId), exact: false })
      queryClient.invalidateQueries({ queryKey: ['organizations'] })

      const message = SUCCESS_MESSAGES[variables.status] ?? 'Project status updated.'
      notifications.success(message)

      if (variables.status === 'deleted' && data?.project?.retention?.expires_at) {
        const expires = new Date(data.project.retention.expires_at).toLocaleDateString()
        notifications.info(`Retention window ends ${expires}.`)
      }
    },
    onError: (error, variables) => {
      const message = error instanceof ApiError ? error.message : 'Failed to update project status.'
      notifications.error(message ?? 'Failed to update project status.')

      if (error instanceof ApiError && variables.status === 'active' && error.code === 'PLAN_LIMIT_EXCEEDED') {
        const details = error.details as { current?: unknown; limit?: unknown } | undefined
        const current = typeof details?.current === 'number' ? details.current : null
        const limit = typeof details?.limit === 'number' ? details.limit : null
        const usage = current !== null && limit !== null ? ` Current usage is ${current}/${limit}.` : ''
        notifications.info(`To restore this project, archive another active project or upgrade your plan.${usage}`)
      }
    },
  })
}
