import type { Area } from 'react-easy-crop'

export type SquareCropOptions = {
  imageSrc: string
  cropArea: Area
  outputSize: number
  mimeType?: 'image/png' | 'image/jpeg'
  quality?: number
}

export async function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (event) => reject(event instanceof ErrorEvent ? event.error : new Error('Failed to load image')))
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.src = src
  })
}

export async function cropImageToSquare({ imageSrc, cropArea, outputSize, mimeType = 'image/png', quality }: SquareCropOptions) {
  const image = await loadImage(imageSrc)

  if (!cropArea.width || !cropArea.height) {
    throw new Error('Invalid crop area')
  }

  const canvas = document.createElement('canvas')
  canvas.width = outputSize
  canvas.height = outputSize
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Unable to create canvas context')
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputSize,
    outputSize,
  )

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result)
        } else {
          reject(new Error('Failed to export cropped image'))
        }
      },
      mimeType,
      quality ?? (mimeType === 'image/jpeg' ? 0.92 : undefined),
    )
  })

  return blob
}
