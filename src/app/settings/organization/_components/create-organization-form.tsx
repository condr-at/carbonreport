'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEventHandler } from 'react'
import Image from 'next/image'
import { Loader2, UploadCloud, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { notifications } from '@/components/ui/notifications'
import { uploadAsset, UploadError } from '@/lib/uploads-client'
import { useCreateOrganization } from '@/lib/data-client/organizations'

type CreateOrganizationFormProps = {
  onCreated: (organizationId: string) => void
  onCancel: () => void
}

const NAME_MIN_LENGTH = 3
const NAME_MAX_LENGTH = 64
const DESCRIPTION_MAX_LENGTH = 400

function normalizeDescription(value: string) {
  return value.replace(/\r\n/g, '\n')
}

export function CreateOrganizationForm({ onCreated, onCancel }: CreateOrganizationFormProps) {
  const createMutation = useCreateOrganization()
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [logoAssetId, setLogoAssetId] = useState<string | null>(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const trimmedName = displayName.trim()
  const disableSubmit =
    createMutation.isPending ||
    isUploading ||
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

  const handleLogoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsUploading(true)
    try {
      const { assetId } = await uploadAsset('org_logo', file)

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }

      const objectUrl = URL.createObjectURL(file)
      objectUrlRef.current = objectUrl
      setLogoPreviewUrl(objectUrl)
      setLogoAssetId(assetId)
      notifications.success('Logo uploaded. Create the organization to apply it.')
    } catch (error) {
      if (error instanceof UploadError) {
        notifications.error(error.message)
      } else {
        notifications.error('Failed to upload logo.')
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveLogo = () => {
    if (!logoAssetId && !logoPreviewUrl) {
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    setLogoAssetId(null)
    setLogoPreviewUrl(null)
  }

  const handleCancel = () => {
    setDisplayName('')
    setDescription('')
    setLogoAssetId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setLogoPreviewUrl(null)
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

    if (logoAssetId) {
      payload.logo_asset_id = logoAssetId
    }

    createMutation.mutate(
      payload,
      {
        onSuccess: (data) => {
          const organizationId = data.organization.id
          setDisplayName('')
          setDescription('')
          setLogoAssetId(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current)
            objectUrlRef.current = null
          }
          setLogoPreviewUrl(null)
          onCreated(organizationId)
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New organization</CardTitle>
        <CardDescription>Choose a recognizable name and optional description for your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
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
                disabled={createMutation.isPending || isUploading}
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
              <Label>Logo</Label>
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                  {logoPreviewUrl ? (
                    <Image src={logoPreviewUrl} alt="Organization logo preview" width={128} height={128} className="h-full w-full object-cover" />
                  ) : (
                    <UploadCloud className="h-10 w-10 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    id="org-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    className="hidden"
                    onChange={handleLogoSelect}
                  />
                  <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading || createMutation.isPending}>
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
                    {isUploading ? 'Uploading…' : 'Upload logo'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveLogo}
                    disabled={isUploading || createMutation.isPending || (!logoAssetId && !logoPreviewUrl)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Optional. Max size 512 KB. PNG, JPEG, or SVG only.
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
