"use client"

import { useEffect, useState, type ChangeEvent, type FormEventHandler } from 'react'
import { useUserSettings, useUpdateUserSettings, type UpdateUserSettingsPayload } from '@/lib/data-client/user-settings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { notifications } from '@/components/ui/notifications'
import { SquareImageUploader, type SquareImageValue } from '@/components/uploads/square-image-uploader'
import { Loader2 } from 'lucide-react'

const NAME_MAX = 64
const TITLE_MAX = 128

function normalize(value: string) {
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

type FormState = {
  firstName: string
  lastName: string
  jobTitle: string
  timezone: string
  avatar: SquareImageValue
}

export function UserProfileSettings() {
  const { data, isLoading, isError, error } = useUserSettings()
  const updateMutation = useUpdateUserSettings()
  const [formState, setFormState] = useState<FormState>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    timezone: '',
    avatar: { assetId: null, url: null },
  })
  const [hasChanges, setHasChanges] = useState(false)

  const user = data?.user

  useEffect(() => {
    if (!user) {
      return
    }

    setFormState({
      firstName: user.first_name ?? '',
      lastName: user.last_name ?? '',
      jobTitle: user.job_title ?? '',
      timezone: user.timezone ?? '',
      avatar: {
        assetId: user.avatar_asset_id ?? null,
        url: user.avatar_url,
      },
    })
    setHasChanges(false)
  }, [user])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Loading your information…</CardDescription>
        </CardHeader>
        <CardContent>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Unable to load your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error instanceof Error ? error.message : 'Unknown error.'}</p>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  const disableSubmit = updateMutation.isPending || !hasChanges

  const handleFieldChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setFormState((previous) => ({ ...previous, [field]: value }))
    setHasChanges(true)
  }

  const handleAvatarChange = (next: SquareImageValue) => {
    setFormState((previous) => ({ ...previous, avatar: next }))
    setHasChanges(true)
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

  const payload: UpdateUserSettingsPayload = {}

    const normalizedFirst = normalize(formState.firstName)
    const normalizedLast = normalize(formState.lastName)
    const normalizedTitle = normalize(formState.jobTitle)
    const normalizedTimezone = normalize(formState.timezone)

    if (normalizedFirst !== (user.first_name ?? null)) {
      payload.first_name = normalizedFirst
    }

    if (normalizedLast !== (user.last_name ?? null)) {
      payload.last_name = normalizedLast
    }

    if (normalizedTitle !== (user.job_title ?? null)) {
      payload.job_title = normalizedTitle
    }

    if (normalizedTimezone !== (user.timezone ?? null)) {
      payload.timezone = normalizedTimezone
    }

    const nextAvatarId = formState.avatar.assetId ?? null
    const initialAvatarId = user.avatar_asset_id ?? null
    const initialAvatarUrl = user.avatar_url ?? null

    if (nextAvatarId && nextAvatarId !== initialAvatarId) {
      payload.avatar_asset_id = nextAvatarId
    } else if (!nextAvatarId) {
      const removedCurrentAvatar = initialAvatarId !== null && formState.avatar.url === null
      const removedLegacyAvatar = initialAvatarId === null && initialAvatarUrl && formState.avatar.url === null
      if (removedCurrentAvatar || removedLegacyAvatar) {
        payload.avatar_asset_id = null
      }
    }

    if (Object.keys(payload).length === 0) {
      notifications.info('No changes to save.')
      return
    }

    updateMutation.mutate(payload, {
      onSuccess: () => {
        setHasChanges(false)
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This information is visible to teammates across organizations you join.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" value={user.email} readOnly disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email is managed by your workspace administrator.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-first-name">First name</Label>
              <Input
                id="profile-first-name"
                value={formState.firstName}
                onChange={handleFieldChange('firstName')}
                placeholder="Jane"
                maxLength={NAME_MAX}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-last-name">Last name</Label>
              <Input
                id="profile-last-name"
                value={formState.lastName}
                onChange={handleFieldChange('lastName')}
                placeholder="Doe"
                maxLength={NAME_MAX}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-job-title">Job title</Label>
              <Input
                id="profile-job-title"
                value={formState.jobTitle}
                onChange={handleFieldChange('jobTitle')}
                placeholder="Sustainability Lead"
                maxLength={TITLE_MAX}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-timezone">Timezone</Label>
              <Input
                id="profile-timezone"
                value={formState.timezone}
                onChange={handleFieldChange('timezone')}
                placeholder="Europe/Berlin"
              />
              <p className="text-xs text-muted-foreground">Use an IANA timezone name (e.g., America/Los_Angeles).</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={disableSubmit}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (!user) {
                    return
                  }
                  setFormState({
                    firstName: user.first_name ?? '',
                    lastName: user.last_name ?? '',
                    jobTitle: user.job_title ?? '',
                    timezone: user.timezone ?? '',
                    avatar: {
                      assetId: user.avatar_asset_id ?? null,
                      url: user.avatar_url,
                    },
                  })
                  setHasChanges(false)
                }}
                disabled={updateMutation.isPending || !hasChanges}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <SquareImageUploader
              label="Avatar"
              description="Square crop · PNG/JPEG/SVG · max 512 KB"
              resourceType="user_avatar"
              value={formState.avatar}
              onChange={handleAvatarChange}
              previewSize={128}
              preferredFormat="image/jpeg"
              outputSize={320}
              minSourceDimension={240}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
