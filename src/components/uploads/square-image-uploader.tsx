'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import Image from 'next/image'
import { UploadCloud, ZoomIn, ZoomOut, Loader2, Trash2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { notifications } from '@/components/ui/notifications'
import { uploadAsset, type UploadResourceType, UploadError } from '@/lib/uploads-client'
import { MAX_UPLOAD_SIZE_BYTES, toSafeFileStem } from '@/lib/uploads'
import { cropImageToSquare, loadImage } from '@/lib/image-crop'

export type SquareImageValue = {
  assetId: string | null
  url: string | null
}

type PendingImage = {
  file: File
  objectUrl: string
  width: number
  height: number
}

type SquareImageUploaderProps = {
  value: SquareImageValue
  onChange: (value: SquareImageValue) => void
  resourceType: UploadResourceType
  label?: string
  description?: string
  disabled?: boolean
  previewSize?: number
  outputSize?: number
  minSourceDimension?: number
  preferredFormat?: 'image/png' | 'image/jpeg'
  allowRemove?: boolean
}

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/jpg,image/svg+xml'
const DEFAULT_PREVIEW_SIZE = 128
const DEFAULT_OUTPUT_SIZE = 512

export function SquareImageUploader({
  value,
  onChange,
  resourceType,
  label = 'Image',
  description,
  disabled,
  previewSize = DEFAULT_PREVIEW_SIZE,
  outputSize = DEFAULT_OUTPUT_SIZE,
  minSourceDimension = DEFAULT_OUTPUT_SIZE,
  preferredFormat = 'image/png',
  allowRemove = true,
}: SquareImageUploaderProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const previewUrl = value.url

  useEffect(() => {
    if (objectUrlRef.current && previewUrl && previewUrl !== objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [previewUrl])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
      if (pendingImage?.objectUrl) {
        URL.revokeObjectURL(pendingImage.objectUrl)
      }
    }
  }, [pendingImage])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }

    if (!file.type?.startsWith('image/')) {
      notifications.error('Please choose an image file (PNG, JPEG, SVG).')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    try {
      const image = await loadImage(objectUrl)
      if (image.width < minSourceDimension || image.height < minSourceDimension) {
        notifications.error(`Image is too small. Minimum ${minSourceDimension}px on each side.`)
        URL.revokeObjectURL(objectUrl)
        return
      }

  setPendingImage({ file, objectUrl, width: image.width, height: image.height })
  setCrop({ x: 0, y: 0 })
  setZoom(calculateInitialZoom(image.width, image.height, outputSize))
      setCroppedAreaPixels(null)
      setIsCropping(true)
    } catch (error) {
      URL.revokeObjectURL(objectUrl)
      notifications.error('Unable to load image for cropping.')
      console.error(error)
    }
  }

  const closeCropDialog = () => {
    if (pendingImage) {
      URL.revokeObjectURL(pendingImage.objectUrl)
    }
    setPendingImage(null)
    setIsCropping(false)
    setZoom(1)
    setCroppedAreaPixels(null)
  }

  const handleCropComplete = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCropConfirm = async () => {
    if (!pendingImage || !croppedAreaPixels) {
      notifications.error('Select an area to crop first.')
      return
    }

    setIsUploading(true)
    try {
      const blob = await cropWithSizeFallback({
        imageSrc: pendingImage.objectUrl,
        cropArea: croppedAreaPixels,
        outputSize,
        preferredFormat,
      })

      const fileName = buildFileName(pendingImage.file.name, preferredFormat)
      const croppedFile = new File([blob], fileName, { type: blob.type })

      const { assetId } = await uploadAsset(resourceType, croppedFile)

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
      const localUrl = URL.createObjectURL(croppedFile)
      objectUrlRef.current = localUrl
      onChange({ assetId, url: localUrl })
      notifications.success('Image uploaded. Save changes to apply.')
      closeCropDialog()
    } catch (error) {
      if (error instanceof UploadError) {
        notifications.error(error.message)
      } else {
        notifications.error(error instanceof Error ? error.message : 'Failed to upload image.')
      }
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    if (!allowRemove || disabled) {
      return
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    onChange({ assetId: null, url: null })
  }

  const instructions = useMemo(() => {
    const sizeLabel = `${Math.round(MAX_UPLOAD_SIZE_BYTES / 1024)} KB`
    return `PNG, JPEG, or SVG. Automatically cropped to square (${outputSize}px). Max ${sizeLabel}.`
  }, [outputSize])

  const isBusy = disabled || isUploading

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center overflow-hidden rounded-lg border bg-muted"
          style={{ width: previewSize, height: previewSize }}
        >
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={label}
              width={previewSize}
              height={previewSize}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <UploadCloud className="h-10 w-10 text-muted-foreground" aria-hidden />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            className="hidden"
            accept={ACCEPTED_TYPES}
            onChange={handleFileChange}
            disabled={isBusy}
          />
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={isBusy}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
            {isUploading ? 'Uploading…' : previewUrl ? 'Replace' : 'Upload'}
          </Button>
          {allowRemove ? (
            <Button type="button" variant="outline" onClick={handleRemove} disabled={isBusy || (!value.assetId && !value.url)}>
              <Trash2 className="mr-2 h-4 w-4" aria-hidden />
              Remove
            </Button>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {description ?? instructions}
        </p>
      </div>

      <Dialog open={isCropping} onOpenChange={(open) => {
        if (!open) {
          closeCropDialog()
        }
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop image</DialogTitle>
            <DialogDescription>
              Drag to position the square crop. Zoom in for detail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
              {pendingImage ? (
                <Cropper
                  image={pendingImage.objectUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  minZoom={1}
                  maxZoom={4}
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  objectFit="contain"
                />
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <ZoomOut className="h-4 w-4 text-muted-foreground" aria-hidden />
              <input
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(event) => setZoom(parseFloat(event.target.value))}
                aria-label="Zoom"
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" aria-hidden />
            </div>
            <Button
              type="button"
              variant="ghost"
              className="self-start"
              onClick={() => {
                setCrop({ x: 0, y: 0 })
                setZoom(1)
              }}
              disabled={isUploading}
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
              Reset crop
            </Button>
          </div>
          <DialogFooter className="gap-2 sm:gap-4">
            <Button type="button" variant="outline" onClick={closeCropDialog} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCropConfirm} disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function calculateInitialZoom(width: number, height: number, targetSize = DEFAULT_OUTPUT_SIZE) {
  if (!width || !height) {
    return 1
  }
  const shorterSide = Math.min(width, height)
  if (!shorterSide) {
    return 1
  }
  return Math.max(1, targetSize / shorterSide)
}

type CropWithFallbackArgs = {
  imageSrc: string
  cropArea: Area
  outputSize: number
  preferredFormat: 'image/png' | 'image/jpeg'
}

async function cropWithSizeFallback({ imageSrc, cropArea, outputSize, preferredFormat }: CropWithFallbackArgs) {
  const primaryBlob = await cropImageToSquare({ imageSrc, cropArea, outputSize, mimeType: preferredFormat })
  if (primaryBlob.size <= MAX_UPLOAD_SIZE_BYTES) {
    return primaryBlob
  }

  if (preferredFormat === 'image/jpeg') {
    throw new UploadError(`Cropped image exceeds ${Math.round(MAX_UPLOAD_SIZE_BYTES / 1024)} KB.`)
  }

  const jpegBlob = await cropImageToSquare({
    imageSrc,
    cropArea,
    outputSize,
    mimeType: 'image/jpeg',
    quality: 0.85,
  })

  if (jpegBlob.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new UploadError(`Cropped image exceeds ${Math.round(MAX_UPLOAD_SIZE_BYTES / 1024)} KB even after compression.`)
  }

  return jpegBlob
}

function buildFileName(originalName: string, format: 'image/png' | 'image/jpeg') {
  const safeStem = toSafeFileStem(originalName, 'square-image') || 'square-image'
  const extension = format === 'image/png' ? 'png' : 'jpg'
  return `${safeStem}-${Date.now()}.${extension}`
}
