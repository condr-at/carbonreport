'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request, ApiError } from '@/lib/api-client'
import { organizationKeys } from './keys'
import { notifications } from '@/components/ui/notifications'

export type OrganizationSummary = {
  id: string
  display_name: string
  plan_label: string
  plan_valid_until: string | null
  role: string
  invite_status?: string
  active_projects?: number
  limits?: {
    max_active_projects: number
    max_editors: number
    max_verifiers: number
    max_viewers: number | null
  }
}

export type OrganizationListResponse = {
  organizations: OrganizationSummary[]
}

export type CurrentOrganizationResponse = {
  organization: {
    id: string
    slug: string
    display_name: string
    description: string | null
    plan: {
      code: string
      label: string
      max_active_projects: number
      max_editors: number
      max_verifiers: number
      max_viewers: number | null
      valid_until: string | null
    }
    usage: {
      active_projects: number
      active_editors: number
      active_verifiers: number
      active_viewers: number
    }
    feature_flags: {
      verifierRoleEnabled: boolean
      billingUiEnabled: boolean
      approvalsEnabled: boolean
    }
  }
}

async function fetchOrganizations(includePending = false): Promise<OrganizationListResponse> {
  const query = includePending ? '?includePending=true' : ''
  return request<OrganizationListResponse>(`/api/organizations${query}`)
}

async function fetchCurrentOrganization(activeOrganizationId?: string): Promise<CurrentOrganizationResponse> {
  return request<CurrentOrganizationResponse>(`/api/organizations/current`, {
    headers: activeOrganizationId
      ? {
          'x-active-organization-id': activeOrganizationId,
        }
      : undefined,
  })
}

export function useOrganizations(includePending = false) {
  return useQuery<OrganizationListResponse>({
    queryKey: organizationKeys.list(includePending),
    queryFn: () => fetchOrganizations(includePending),
  })
}

export function useCurrentOrganization(activeOrganizationId?: string) {
  return useQuery<CurrentOrganizationResponse>({
    queryKey: organizationKeys.current(activeOrganizationId),
    queryFn: () => fetchCurrentOrganization(activeOrganizationId),
    enabled: Boolean(activeOrganizationId) || activeOrganizationId === undefined,
  })
}

export function useUpdateOrganizationProfile(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['organization', organizationId, 'profile'],
    mutationFn: async (payload: { display_name?: string; description?: string | null; logo_asset_id?: string | null }) => {
      return request<{ organization: { id: string } }>(`/api/organizations/${organizationId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.list() })
      queryClient.invalidateQueries({ queryKey: ['organizations', 'current'], exact: false })
      notifications.success('Organization profile updated.')
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to update organization.'
      notifications.error(message)
    },
  })
}
