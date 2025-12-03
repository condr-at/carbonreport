import path from 'node:path'
import { ApiError } from '@/lib/api-error'

const DEFAULT_KEY_PREFIX = 'uploads'
const DEFAULT_TTL_SECONDS = 60
const MAX_TTL_SECONDS = 300
const MIN_TTL_SECONDS = 15
const DEFAULT_LOCAL_BASE_PATH = '/dev-uploads'

type Credentials = {
  accessKeyId: string
  secretAccessKey: string
  sessionToken?: string
}

export type S3UploadConfig = {
  mode: 's3'
  bucket: string
  region: string
  publicBaseUrl: string
  keyPrefix: string | null
  expiresInSeconds: number
  endpoint?: string
  credentials?: Credentials
}

export type LocalUploadConfig = {
  mode: 'local'
  directory: string
  publicBaseUrl: string
  keyPrefix: string | null
  expiresInSeconds: number
}

export type UploadConfig = S3UploadConfig | LocalUploadConfig

function sanitizeKeyPrefix(input: string | null): string | null {
  if (!input) {
    return null
  }

  const trimmed = input.trim().replace(/^\/+|\/+$|\s+/g, '')
  if (!trimmed) {
    return null
  }

  return trimmed
}

function resolveTtlSeconds(): number {
  const raw = process.env.ASSETS_UPLOAD_TTL_SECONDS ?? ''
  const parsed = Number.parseInt(raw, 10)

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_TTL_SECONDS
  }

  const clamped = Math.max(MIN_TTL_SECONDS, Math.min(parsed, MAX_TTL_SECONDS))
  return Math.min(clamped, DEFAULT_TTL_SECONDS)
}

function preferLocalUploads(): boolean {
  const toggle = process.env.ENABLE_LOCAL_UPLOADS
  if (toggle === 'true') {
    return true
  }
  if (toggle === 'false') {
    return false
  }

  const isVercel = process.env.VERCEL === '1'
  const isProd = process.env.NODE_ENV === 'production'
  return !isVercel && !isProd
}

function resolveLocalBasePath(): string {
  const raw = process.env.LOCAL_UPLOADS_PUBLIC_PATH
  if (!raw) {
    return DEFAULT_LOCAL_BASE_PATH
  }

  const trimmed = raw.trim()
  if (!trimmed) {
    return DEFAULT_LOCAL_BASE_PATH
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`
}

function resolveLocalDirectory(basePath: string): string {
  const rawDir = process.env.LOCAL_UPLOADS_DIR
  if (rawDir) {
    return path.resolve(rawDir)
  }

  const relative = basePath.replace(/^\/+/, '')
  return path.resolve(process.cwd(), 'public', relative)
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/?$/, '')
}

export function resolveUploadConfig(): UploadConfig {
  const bucket = process.env.ASSETS_BUCKET_NAME
  if (bucket) {
    const region =
      process.env.ASSETS_BUCKET_REGION ||
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      'us-east-1'

    const baseUrl = normalizeBaseUrl(
      process.env.ASSETS_PUBLIC_BASE_URL || `https://${bucket}.s3.${region}.amazonaws.com`,
    )
    const configuredPrefix = sanitizeKeyPrefix(process.env.ASSETS_UPLOADS_PREFIX ?? null)
    const keyPrefix = configuredPrefix ?? DEFAULT_KEY_PREFIX
    const expiresInSeconds = resolveTtlSeconds()

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const sessionToken = process.env.AWS_SESSION_TOKEN
    const endpoint = process.env.ASSETS_S3_ENDPOINT?.trim().replace(/\/$/, '') || undefined

    const credentials = accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey, sessionToken: sessionToken || undefined }
      : undefined

    return {
      mode: 's3',
      bucket,
      region,
      publicBaseUrl: baseUrl,
      keyPrefix,
      expiresInSeconds,
      endpoint,
      credentials,
    }
  }

  if (!preferLocalUploads()) {
    throw new ApiError(503, 'SERVICE_UNAVAILABLE', 'File uploads are not configured', {
      missing_env: ['ASSETS_BUCKET_NAME'],
    })
  }

  const basePath = resolveLocalBasePath()
  const directory = resolveLocalDirectory(basePath)
  const configuredPrefix = sanitizeKeyPrefix(process.env.ASSETS_UPLOADS_PREFIX ?? null)
  const keyPrefix = configuredPrefix ?? DEFAULT_KEY_PREFIX
  const expiresInSeconds = resolveTtlSeconds()
  const baseUrl = normalizeBaseUrl(process.env.LOCAL_UPLOADS_PUBLIC_URL || basePath)

  return {
    mode: 'local',
    directory,
    publicBaseUrl: baseUrl,
    keyPrefix,
    expiresInSeconds,
  }
}

export function assertLocalConfig(config: UploadConfig): asserts config is LocalUploadConfig {
  if (config.mode !== 'local') {
    throw new ApiError(404, 'NOT_FOUND', 'Local uploads are disabled')
  }
}

export function assertS3Config(config: UploadConfig): asserts config is S3UploadConfig {
  if (config.mode !== 's3') {
    throw new ApiError(500, 'INTERNAL_ERROR', 'S3 uploads are not configured')
  }
}
