"use client"

import { useState, type FormEventHandler } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { notifications } from '@/components/ui/notifications'
import { useCreateOrganization } from '@/lib/data-client/organizations'
import { SquareImageUploader, type SquareImageValue } from '@/components/uploads/square-image-uploader'

type CreateOrganizationFormProps = {
  onCreated: (organizationId: string) => void
  onCancel: () => void
  variant?: 'card' | 'plain'
}

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 64
const DESCRIPTION_MAX_LENGTH = 400

function normalizeDescription(value: string) {
  return value.replace(/\r\n/g, '\n')
}

export function CreateOrganizationForm({ onCreated, onCancel, variant = 'card' }: CreateOrganizationFormProps) {
  const createMutation = useCreateOrganization()
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [logoValue, setLogoValue] = useState<SquareImageValue>({ assetId: null, url: null })

  const trimmedName = displayName.trim()
  const disableSubmit =
    createMutation.isPending ||
    trimmedName.length < NAME_MIN_LENGTH ||
    trimmedName.length > NAME_MAX_LENGTH

  const nameHelperText = (() => {
    if (trimmedName.length < NAME_MIN_LENGTH) {
      const remaining = NAME_MIN_LENGTH - trimmedName.length
      return `${remaining} more character${remaining === 1 ? '' : 's'} required.`
    }

    if (trimmedName.length > NAME_MAX_LENGTH) {
      const excess = trimmedName.length - NAME_MAX_LENGTH
      return `${excess} character${excess === 1 ? '' : 's'} over the limit.`
    }

    return `${trimmedName.length}/${NAME_MAX_LENGTH} characters.`
  })()

  const handleCancel = () => {
    setDisplayName('')
    setDescription('')
    setLogoValue({ assetId: null, url: null })
    onCancel()
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const trimmedName = displayName.trim()
    const normalizedDescription = normalizeDescription(description).trim()

    if (trimmedName.length < NAME_MIN_LENGTH || trimmedName.length > NAME_MAX_LENGTH) {
      notifications.error('Display name must be between 3 and 64 characters long.')
      return
    }

    if (normalizedDescription.length > DESCRIPTION_MAX_LENGTH) {
      notifications.error('Description is too long.')
      return
    }

    const payload: {
      display_name: string
      description?: string
      logo_asset_id?: string
    } = {
      display_name: trimmedName,
    }

    if (normalizedDescription.length) {
      payload.description = normalizedDescription
    }

    if (logoValue.assetId) {
      payload.logo_asset_id = logoValue.assetId
    }

    createMutation.mutate(
      payload,
      {
        onSuccess: (data) => {
          const organizationId = data.organization.id
          setDisplayName('')
          setDescription('')
          setLogoValue({ assetId: null, url: null })
          onCreated(organizationId)
        },
      },
    )
  }

  const formElement = (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="org-name">Display name</Label>
          <Input
            id="org-name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Acme Sustainability"
            maxLength={NAME_MAX_LENGTH}
            required
          />
          <p className="text-xs text-muted-foreground">{nameHelperText}</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="org-description">Description</Label>
          <textarea
            id="org-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tell teammates what this organization manages."
            maxLength={DESCRIPTION_MAX_LENGTH}
            rows={4}
            className="min-h-[120px] resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            {description.length}/{DESCRIPTION_MAX_LENGTH} characters.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={disableSubmit}>
            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            Create organization
          </Button>
        </div>
      </div>

      <div className="space-y-4">
          <div className="space-y-2">
            <Label>Logo (optional)</Label>
            <SquareImageUploader
              resourceType="org_logo"
              value={logoValue}
              onChange={setLogoValue}
              label="Logo preview"
              description="PNG/JPEG/SVG · cropped to square before upload"
              disabled={createMutation.isPending}
            />
          </div>
      </div>
    </form>
  )

  if (variant === 'plain') {
    return formElement
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New organization</CardTitle>
        <CardDescription>Choose a recognizable name and optional description for your workspace.</CardDescription>
      </CardHeader>
      <CardContent>{formElement}</CardContent>
    </Card>
  )
}
