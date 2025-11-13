import { slugify } from '@/lib/slugify'

export const MAX_UPLOAD_SIZE_BYTES = 512 * 1024 // 512 KB per docs

const MIME_TYPE_MAP = {
  'image/png': { extension: 'png' },
  'image/jpeg': { extension: 'jpg' },
  'image/svg+xml': { extension: 'svg' },
} as const

const MIME_TYPE_ALIASES: Record<string, keyof typeof MIME_TYPE_MAP> = {
  'image/jpg': 'image/jpeg',
}

export type SupportedUploadMimeType = keyof typeof MIME_TYPE_MAP

export function listSupportedMimeTypes(): SupportedUploadMimeType[] {
  return Object.keys(MIME_TYPE_MAP) as SupportedUploadMimeType[]
}

export function normalizeMimeType(input: string): { mime: SupportedUploadMimeType; extension: string } | null {
  const normalized = input.trim().toLowerCase()
  const resolved = (MIME_TYPE_MAP as Record<string, { extension: string }>)[normalized]

  if (resolved) {
    return { mime: normalized as SupportedUploadMimeType, extension: resolved.extension }
  }

  const aliasTarget = MIME_TYPE_ALIASES[normalized]
  if (!aliasTarget) {
    return null
  }

  const aliasResolved = MIME_TYPE_MAP[aliasTarget]
  return { mime: aliasTarget, extension: aliasResolved.extension }
}

export function extractFileStem(fileName: string): { stem: string; extension: string } {
  const trimmed = fileName.trim()
  if (!trimmed) {
    return { stem: '', extension: '' }
  }

  const lastDot = trimmed.lastIndexOf('.')
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return { stem: trimmed, extension: '' }
  }

  const stem = trimmed.slice(0, lastDot)
  const extension = trimmed.slice(lastDot + 1)
  return { stem, extension }
}

export function toSafeFileStem(fileName: string, fallback: string): string {
  const { stem } = extractFileStem(fileName)
  const slug = slugify(stem)
  if (!slug) {
    return fallback
  }

  const trimmed = slug.slice(0, 48)
  return trimmed || fallback
}
