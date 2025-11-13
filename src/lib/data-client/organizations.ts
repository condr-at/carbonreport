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
    logo_asset_id: string | null
    logo_url: string | null
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

export type OrganizationMember = {
  membership_id: string
  user_id: string | null
  name: string | null
  email: string | null
  avatar_url: string | null
  role: string
  invite_status: string
  joined_at: string | null
  last_active_at: string | null
}

export type OrganizationUsageResponse = {
  organization_id: string
  usage: {
    active_projects: number
    active_editors: number
    active_verifiers: number
    active_viewers: number
  }
  limits: {
    max_active_projects: number
    max_editors: number
    max_verifiers: number
    max_viewers: number | null
  }
  plan_valid_until: string | null
  snapshots?: Array<{
    computed_at: string
    active_projects: number
    active_editors: number
    active_verifiers: number
    active_viewers: number
  }>
}

export type CreateOrganizationPayload = {
  display_name: string
  description?: string
  logo_asset_id?: string
}

export type CreateOrganizationResponse = {
  organization: {
    id: string
    slug: string
    display_name: string
    description: string | null
    plan_code: string
    plan_assigned_at: string
    plan_valid_until: string | null
    limits: {
      max_active_projects: number
      max_editors: number
      max_verifiers: number
      max_viewers: number | null
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

export function useCreateOrganization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['organizations', 'create'],
    mutationFn: async (payload: CreateOrganizationPayload) => {
      const body: Record<string, unknown> = {
        display_name: payload.display_name,
      }

      if (payload.description !== undefined) {
        body.description = payload.description
      }

      if (payload.logo_asset_id !== undefined) {
        body.logo_asset_id = payload.logo_asset_id
      }

      return request<CreateOrganizationResponse>('/api/organizations', {
        method: 'POST',
        body: JSON.stringify(body),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.list(false) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.list(true) })
      queryClient.invalidateQueries({ queryKey: ['organizations', 'current'], exact: false })
      notifications.success('Organization created.')
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to create organization.'
      notifications.error(message)
    },
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

async function fetchOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
  const response = await request<{ members: OrganizationMember[] }>(
    `/api/organizations/${organizationId}/members`,
  )
  return response.members
}

export function useOrganizationMembers(organizationId: string | null | undefined) {
  const queryKey = organizationId
    ? organizationKeys.members(organizationId)
    : (['organizations', 'unknown', 'members'] as const)

  return useQuery<OrganizationMember[]>({
    queryKey,
    queryFn: () => fetchOrganizationMembers(organizationId as string),
    enabled: Boolean(organizationId),
  })
}

export function useInviteOrganizationMember(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['organization', organizationId, 'invite'],
    mutationFn: async (payload: { email: string; role: string; message?: string | null }) => {
      return request<{ invite: { membership_id: string } }>(
        `/api/organizations/${organizationId}/invite`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: payload.email,
            role: payload.role,
            message: payload.message ?? undefined,
          }),
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.members(organizationId) })
      queryClient.invalidateQueries({ queryKey: organizationKeys.list() })
      queryClient.invalidateQueries({ queryKey: ['organizations', 'current'], exact: false })
      notifications.success('Invite sent.')
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to send invite.'
      notifications.error(message)
    },
  })
}

export function useUpdateMembershipRole(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['organization', organizationId, 'membership-role'],
    mutationFn: async (payload: { membershipId: string; role: string }) => {
      return request<{ membership: { membership_id: string } }>(
        `/api/organizations/${organizationId}/members/${payload.membershipId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role: payload.role }),
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.members(organizationId) })
      queryClient.invalidateQueries({ queryKey: ['organizations', 'current'], exact: false })
      notifications.success('Role updated.')
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to update role.'
      notifications.error(message)
    },
  })
}

export function useRemoveMembership(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['organization', organizationId, 'membership-remove'],
    mutationFn: async (payload: { membershipId: string }) => {
      await request<void>(
        `/api/organizations/${organizationId}/members/${payload.membershipId}`,
        {
          method: 'DELETE',
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.members(organizationId) })
      queryClient.invalidateQueries({ queryKey: ['organizations', 'current'], exact: false })
      queryClient.invalidateQueries({ queryKey: organizationKeys.list() })
      notifications.success('Member removed.')
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to remove member.'
      notifications.error(message)
    },
  })
}

async function fetchOrganizationUsage(organizationId: string): Promise<OrganizationUsageResponse> {
  return request<OrganizationUsageResponse>(`/api/organizations/${organizationId}/usage`)
}

export function useOrganizationUsage(organizationId: string | null | undefined) {
  const queryKey = organizationId
    ? organizationKeys.usage(organizationId)
    : (['organizations', 'unknown', 'usage'] as const)

  return useQuery<OrganizationUsageResponse>({
    queryKey,
    queryFn: () => fetchOrganizationUsage(organizationId as string),
    enabled: Boolean(organizationId),
    staleTime: 60_000,
  })
}

export function usePlanUpgradeRequest(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: organizationKeys.planUpgrade(organizationId),
    mutationFn: async (payload: { target_plan_code: string; contact_email?: string; notes?: string }) => {
      const response = await fetch(`/api/organizations/${organizationId}/plan/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const body = await response.json().catch(() => null)

      if (response.status === 501 && body?.ticket_reference) {
        return {
          ticket_reference: body.ticket_reference as string,
          status: body.status ?? 'not_implemented',
          message: body.message ?? 'Upgrade handled manually during beta.',
        }
      }

      if (!response.ok) {
        throw new ApiError(
          body?.error ?? 'Failed to submit upgrade request',
          response.status,
          body?.code,
          body?.details ?? body,
        )
      }

      return {
        ticket_reference: body?.ticket_reference ?? null,
        status: body?.status ?? 'ok',
        message: body?.message ?? 'Upgrade request submitted.',
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', 'current'], exact: false })
      notifications.success(`Upgrade request logged${data.ticket_reference ? ` (#${data.ticket_reference})` : ''}.`)
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to request plan upgrade.'
      notifications.error(message)
    },
  })
}

export function useDeleteOrganization(organizationId: string, options?: { onSettled?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['organization', organizationId, 'delete'],
    mutationFn: async () => {
      return request<{ organization_id: string; retention_expires_at: string }>(
        `/api/organizations/${organizationId}`,
        {
          method: 'DELETE',
        },
      )
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.list(true) })
      queryClient.invalidateQueries({ queryKey: ['organizations', 'current'], exact: false })
      notifications.success('Organization scheduled for deletion.')
      if (data?.retention_expires_at) {
        notifications.info(
          `Retention window ends ${new Date(data.retention_expires_at).toLocaleDateString()}.`,
        )
      }
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to delete organization.'
      notifications.error(message)
    },
    onSettled: () => {
      options?.onSettled?.()
    },
  })
}
