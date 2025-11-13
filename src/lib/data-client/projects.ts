'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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

const SUCCESS_MESSAGES: Record<ProjectStatusSlug, string> = {
  active: 'Project restored.',
  archived: 'Project archived.',
  reported: 'Project marked as reported.',
  deleted: 'Project deleted.',
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient()

  return useMutation<ProjectStatusPayload, unknown, UpdateProjectStatusVariables>({
    mutationKey: ['projects', 'update-status'],
    mutationFn: async (variables) => {
      return request<ProjectStatusPayload>(`/api/projects/${variables.projectId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: variables.status }),
      })
    },
  onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.projectId), exact: false })
      queryClient.invalidateQueries({ queryKey: projectKeys.dataset(variables.projectId), exact: false })
      queryClient.invalidateQueries({ queryKey: projectKeys.contacts(variables.projectId), exact: false })

      const message = SUCCESS_MESSAGES[variables.status] ?? 'Project status updated.'
      notifications.success(message)

      if (variables.status === 'deleted' && data?.project?.retention?.expires_at) {
        const expires = new Date(data.project.retention.expires_at).toLocaleDateString()
        notifications.info(`Retention window ends ${expires}.`)
      }
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to update project status.'
      notifications.error(message ?? 'Failed to update project status.')
    },
  })
}
