import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { MAX_UPLOAD_SIZE_BYTES, normalizeMimeType, toSafeFileStem } from '@/lib/uploads'
import { AssetType } from '@prisma/client'

const UploadRequestSchema = z.object({
  resource_type: z.enum(['org_logo', 'user_avatar']),
  file_name: z.string().trim().min(1).max(128),
  mime_type: z.string().trim().min(1),
  file_size_bytes: z.number().int().positive(),
})

type UploadResourceType = z.infer<typeof UploadRequestSchema>['resource_type']

type UploadConfig = {
  bucket: string
  region: string
  publicBaseUrl: string
  keyPrefix: string | null
  expiresInSeconds: number
  credentials?: {
    accessKeyId: string
    secretAccessKey: string
    sessionToken?: string
  }
}

const RESOURCE_TYPE_TO_ASSET: Record<UploadResourceType, AssetType> = {
  org_logo: AssetType.ORG_LOGO,
  user_avatar: AssetType.USER_AVATAR,
}

const DEFAULT_KEY_PREFIX = 'uploads'
const DEFAULT_TTL_SECONDS = 60
const MAX_TTL_SECONDS = 300
const MIN_TTL_SECONDS = 15

let cachedClient: { instance: S3Client; cacheKey: string } | null = null

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

function resolveUploadConfig(): UploadConfig {
  const bucket = process.env.ASSETS_BUCKET_NAME
  if (!bucket) {
    throw new ApiError(503, 'SERVICE_UNAVAILABLE', 'File uploads are not configured', {
      missing_env: ['ASSETS_BUCKET_NAME'],
    })
  }

  const region =
    process.env.ASSETS_BUCKET_REGION ||
    process.env.AWS_REGION ||
    process.env.AWS_DEFAULT_REGION ||
    'us-east-1'

  const baseUrl = (process.env.ASSETS_PUBLIC_BASE_URL || `https://${bucket}.s3.${region}.amazonaws.com`).replace(/\/?$/, '')
  const configuredPrefix = sanitizeKeyPrefix(process.env.ASSETS_UPLOADS_PREFIX ?? null)
  const keyPrefix = configuredPrefix ?? DEFAULT_KEY_PREFIX
  const expiresInSeconds = resolveTtlSeconds()

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  const sessionToken = process.env.AWS_SESSION_TOKEN

  const credentials = accessKeyId && secretAccessKey
    ? { accessKeyId, secretAccessKey, sessionToken: sessionToken || undefined }
    : undefined

  return {
    bucket,
    region,
    publicBaseUrl: baseUrl,
    keyPrefix,
    expiresInSeconds,
    credentials,
  }
}

function getClient(config: UploadConfig): S3Client {
  const credentialKey = config.credentials
    ? `${config.credentials.accessKeyId}:${config.credentials.secretAccessKey}:${config.credentials.sessionToken ?? ''}`
    : 'default-chain'
  const cacheKey = `${config.region}:${credentialKey}`

  if (!cachedClient || cachedClient.cacheKey !== cacheKey) {
    cachedClient = {
      cacheKey,
      instance: new S3Client({
        region: config.region,
        credentials: config.credentials,
      }),
    }
  }

  return cachedClient.instance
}

function buildObjectKey(resource: UploadResourceType, assetId: string, fileName: string, extension: string, prefix: string | null): string {
  const safeStem = toSafeFileStem(fileName, assetId)
  // Compose S3 key as <prefix>/<resource>/<assetId>/<sanitized-name>.<ext>
  const segments = [prefix, resource.replace(/_/g, '-'), assetId, `${safeStem}.${extension}`]
    .filter((segment): segment is string => Boolean(segment && segment.trim()))
  return segments.join('/')
}

function encodeKeyForUrl(key: string) {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const payload = await request.json().catch(() => ({}))
    const parsed = UploadRequestSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid upload payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const { resource_type: resourceType, file_name: fileName, mime_type: mimeTypeInput, file_size_bytes: fileSizeBytes } = parsed.data
    const normalizedMime = normalizeMimeType(mimeTypeInput)

    if (!normalizedMime) {
      return errorResponse(
        new ApiError(415, 'VALIDATION_ERROR', 'Unsupported MIME type', {
          supported: ['image/png', 'image/jpeg', 'image/svg+xml'],
        }),
      )
    }

    if (fileSizeBytes > MAX_UPLOAD_SIZE_BYTES) {
      return errorResponse(
        new ApiError(413, 'VALIDATION_ERROR', 'File size exceeds limit', {
          max_bytes: MAX_UPLOAD_SIZE_BYTES,
        }),
      )
    }

    const config = resolveUploadConfig()
    const s3 = getClient(config)
    const assetId = randomUUID()
    const objectKey = buildObjectKey(resourceType, assetId, fileName, normalizedMime.extension, config.keyPrefix)

    const presigned = await createPresignedPost(s3, {
      Bucket: config.bucket,
      Key: objectKey,
      Conditions: [
        ['content-length-range', 1, MAX_UPLOAD_SIZE_BYTES],
        ['eq', '$Content-Type', normalizedMime.mime],
      ],
      Fields: {
        key: objectKey,
        'Content-Type': normalizedMime.mime,
      },
      Expires: config.expiresInSeconds,
    })

    const encodedKey = encodeKeyForUrl(objectKey)
    const assetUrl = `${config.publicBaseUrl}/${encodedKey}`

    await prisma.asset.create({
      data: {
        id: assetId,
        type: RESOURCE_TYPE_TO_ASSET[resourceType],
        url: assetUrl,
        fileName,
        mimeType: normalizedMime.mime,
        fileSizeBytes,
        uploadedByUserId: user.id,
      },
    })

    const expiresAt = new Date(Date.now() + config.expiresInSeconds * 1000)

    return NextResponse.json(
      {
        upload: {
          asset_id: assetId,
          url: presigned.url,
          fields: presigned.fields,
          expires_at: expiresAt.toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to generate upload'))
  }
}
