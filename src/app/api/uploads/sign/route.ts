import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { randomUUID } from 'node:crypto'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { MAX_UPLOAD_SIZE_BYTES, normalizeMimeType, toSafeFileStem } from '@/lib/uploads'
import { RESOURCE_TYPE_TO_ASSET } from '@/lib/uploads/resource-map'
import { resolveUploadConfig, type S3UploadConfig } from '@/lib/uploads/config'
import { UPLOAD_RESOURCE_TYPES, type UploadResourceType } from '@/lib/uploads/resource-types'

const UploadRequestSchema = z.object({
  resource_type: z.enum(UPLOAD_RESOURCE_TYPES),
  file_name: z.string().trim().min(1).max(128),
  mime_type: z.string().trim().min(1),
  file_size_bytes: z.number().int().positive(),
})

let cachedClient: { instance: S3Client; cacheKey: string } | null = null

function getClient(config: S3UploadConfig): S3Client {
  const credentialKey = config.credentials
    ? `${config.credentials.accessKeyId}:${config.credentials.secretAccessKey}:${config.credentials.sessionToken ?? ''}`
    : 'default-chain'
  const endpointKey = config.endpoint ?? 'aws-default'
  const cacheKey = `${config.region}:${endpointKey}:${credentialKey}`

  if (!cachedClient || cachedClient.cacheKey !== cacheKey) {
    cachedClient = {
      cacheKey,
      instance: new S3Client({
        region: config.region,
        credentials: config.credentials,
        endpoint: config.endpoint,
        forcePathStyle: Boolean(config.endpoint),
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
    const assetId = randomUUID()
    const objectKey = buildObjectKey(resourceType, assetId, fileName, normalizedMime.extension, config.keyPrefix)

    const encodedKey = encodeKeyForUrl(objectKey)
    const assetUrl = `${config.publicBaseUrl}/${encodedKey}`

    let uploadTarget: { url: string; fields: Record<string, string> }

    if (config.mode === 's3') {
      const s3 = getClient(config)
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

      uploadTarget = {
        url: presigned.url,
        fields: presigned.fields,
      }
    } else {
      uploadTarget = {
        url: '/api/uploads/local',
        fields: {
          key: objectKey,
          'Content-Type': normalizedMime.mime,
        },
      }
    }

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
          url: uploadTarget.url,
          fields: uploadTarget.fields,
          expires_at: expiresAt.toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to generate upload'))
  }
}
