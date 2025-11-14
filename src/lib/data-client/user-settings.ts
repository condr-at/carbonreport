'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { request, ApiError } from '@/lib/api-client'
import { userKeys } from './keys'
import { notifications } from '@/components/ui/notifications'

export type UserSettingsResponse = {
  user: {
    id: string
    email: string
    name: string
    first_name: string | null
    last_name: string | null
    job_title: string | null
    timezone: string | null
    avatar_url: string | null
    avatar_asset_id: string | null
    organizations: Array<{
      organization_id: string
      display_name: string
      role: string
      status: string
      invite_status: string
    }>
  }
}

export type UpdateUserSettingsPayload = Partial<{
  first_name: string | null
  last_name: string | null
  job_title: string | null
  timezone: string | null
  avatar_asset_id: string | null
}>

async function fetchUserSettings() {
  return request<UserSettingsResponse>('/api/user/settings')
}

export function useUserSettings() {
  return useQuery<UserSettingsResponse>({
    queryKey: userKeys.settings(),
    queryFn: fetchUserSettings,
    staleTime: 60_000,
  })
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'settings', 'update'],
    mutationFn: async (payload: UpdateUserSettingsPayload) => {
      return request<UserSettingsResponse>('/api/user/settings', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    },
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.settings(), data)
      notifications.success('Profile updated.')
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : 'Failed to update profile.'
      notifications.error(message)
    },
  })
}
