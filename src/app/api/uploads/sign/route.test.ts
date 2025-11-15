import assert from 'node:assert/strict'
import test from 'node:test'
import type { NextRequest } from 'next/server'
import type { User } from '@prisma/client'
import { POST } from './route'
import * as auth from '@/lib/auth'
import prisma from '@/lib/db'
import { MAX_UPLOAD_SIZE_BYTES } from '@/lib/uploads'

type UploadPayload =
  | { method: 'POST'; fields: Record<string, string>; headers?: never }
  | { method: 'PUT'; headers: Record<string, string>; fields?: never }

type UploadResponse = {
  upload: UploadPayload & {
    asset_id: string
    url: string
    expires_at: string
  }
}

const TEST_USER: User = {
  id: 'user-test-id',
  name: 'Test User',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  passwordHash: 'hash',
  emailVerified: true,
  avatarUrl: null,
  avatarAssetId: null,
  jobTitle: null,
  timezone: null,
  oauthProvider: null,
  oauthId: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  deletedAt: null,
}

function stubGetCurrentUser(t: test.TestContext, impl: () => Promise<User> = async () => TEST_USER) {
  auth.__setCurrentUserResolver(impl)
  t.after(() => {
    auth.__setCurrentUserResolver(null)
  })
}

function stubRequest(body: unknown): NextRequest {
  return {
    json: async () => body,
  } as unknown as NextRequest
}

test.beforeEach(() => {
  process.env.ASSETS_BUCKET_NAME = 'test-bucket'
  process.env.ASSETS_BUCKET_REGION = 'us-east-1'
  process.env.ASSETS_PUBLIC_BASE_URL = 'https://test-bucket.s3.us-east-1.amazonaws.com'
  process.env.AWS_ACCESS_KEY_ID = 'test-access'
  process.env.AWS_SECRET_ACCESS_KEY = 'test-secret'
})

test.afterEach(() => {
  delete process.env.ASSETS_BUCKET_NAME
  delete process.env.ASSETS_BUCKET_REGION
  delete process.env.ASSETS_PUBLIC_BASE_URL
  delete process.env.ASSETS_S3_ENDPOINT
  delete process.env.AWS_ACCESS_KEY_ID
  delete process.env.AWS_SECRET_ACCESS_KEY
  delete process.env.ASSETS_S3_UPLOAD_STRATEGY
  delete process.env.ENABLE_LOCAL_UPLOADS
  delete process.env.LOCAL_UPLOADS_DIR
  delete process.env.LOCAL_UPLOADS_PUBLIC_PATH
  delete process.env.LOCAL_UPLOADS_PUBLIC_URL
})

test('returns 413 when file size exceeds limit', async (t) => {
  stubGetCurrentUser(t)

  const request = stubRequest({
    resource_type: 'org_logo',
    file_name: 'oversize.png',
    mime_type: 'image/png',
    file_size_bytes: MAX_UPLOAD_SIZE_BYTES + 1,
  })

  const response = await POST(request)
  const payload = (await response.json()) as { error: string; code: string }

  assert.equal(response.status, 413)
  assert.equal(payload.code, 'VALIDATION_ERROR')
  assert.match(payload.error, /size/i)
})

test('returns 415 when MIME type is unsupported', async (t) => {
  stubGetCurrentUser(t)

  const request = stubRequest({
    resource_type: 'org_logo',
    file_name: 'logo.gif',
    mime_type: 'image/gif',
    file_size_bytes: 1024,
  })

  const response = await POST(request)
  const payload = (await response.json()) as { error: string; code: string }

  assert.equal(response.status, 415)
  assert.equal(payload.code, 'VALIDATION_ERROR')
  assert.match(payload.error, /mime/i)
})

test('returns presigned payload and records asset on success', async (t) => {
  stubGetCurrentUser(t)

  const originalAssetCreate = prisma.asset.create
  let recordedArgs: any = null
  ;(prisma.asset as any).create = async (args: any) => {
    recordedArgs = args
    return { id: args.data.id }
  }
  t.after(() => {
    ;(prisma.asset as any).create = originalAssetCreate
  })

  const request = stubRequest({
    resource_type: 'org_logo',
    file_name: 'Acme Logo.png',
    mime_type: 'image/png',
    file_size_bytes: 42_000,
  })

  const response = await POST(request)
  const payload = (await response.json()) as UploadResponse

  assert.equal(response.status, 201)
  assert.ok(payload.upload.asset_id)
  assert.ok(payload.upload.url.startsWith('https://'))
  assert.equal(payload.upload.method, 'POST')
  if (payload.upload.method !== 'POST') {
    throw new Error('Expected POST upload')
  }
  assert.ok(payload.upload.fields.key)
  assert.equal(payload.upload.fields['Content-Type'], 'image/png')

  const expiresAt = new Date(payload.upload.expires_at)
  assert.ok(expiresAt.getTime() > Date.now())
  assert.ok(expiresAt.getTime() - Date.now() <= 65_000)

  assert.ok(recordedArgs)
  assert.equal(recordedArgs.data.id, payload.upload.asset_id)
  assert.equal(recordedArgs.data.fileName, 'Acme Logo.png')
  assert.equal(recordedArgs.data.mimeType, 'image/png')
  assert.equal(recordedArgs.data.fileSizeBytes, 42_000)
  assert.equal(recordedArgs.data.uploadedByUserId, TEST_USER.id)
  const keyFromUrl = new URL(recordedArgs.data.url).pathname.replace(/^\//, '')
  assert.equal(payload.upload.fields.key, keyFromUrl)
})

test('presigned URL uses custom endpoint when configured', async (t) => {
  stubGetCurrentUser(t)
  process.env.ASSETS_S3_ENDPOINT = 'https://example-account.r2.cloudflarestorage.com'

  const originalAssetCreate = prisma.asset.create
  ;(prisma.asset as any).create = async (args: any) => ({ id: args.data.id })
  t.after(() => {
    ;(prisma.asset as any).create = originalAssetCreate
  })

  const request = stubRequest({
    resource_type: 'org_logo',
    file_name: 'Endpoint.png',
    mime_type: 'image/png',
    file_size_bytes: 10_000,
  })

  const response = await POST(request)
  const payload = (await response.json()) as UploadResponse | { error?: string; code?: string }

  assert.equal(response.status, 201, JSON.stringify(payload))
  if ('upload' in payload) {
    assert.ok(payload.upload.url.startsWith('https://example-account.r2.cloudflarestorage.com'))
    assert.equal(payload.upload.method, 'PUT')
    if (payload.upload.method !== 'PUT') {
      throw new Error('Expected PUT upload for R2 endpoint')
    }
    assert.equal(payload.upload.headers['Content-Type'], 'image/png')
  } else {
    throw new Error('Missing upload payload')
  }
})

test('honors explicit presigned PUT strategy', async (t) => {
  stubGetCurrentUser(t)
  process.env.ASSETS_S3_UPLOAD_STRATEGY = 'put'

  const originalAssetCreate = prisma.asset.create
  ;(prisma.asset as any).create = async (args: any) => ({ id: args.data.id })
  t.after(() => {
    ;(prisma.asset as any).create = originalAssetCreate
  })

  const request = stubRequest({
    resource_type: 'org_logo',
    file_name: 'Strategy.png',
    mime_type: 'image/png',
    file_size_bytes: 10_000,
  })

  const response = await POST(request)
  const payload = (await response.json()) as UploadResponse

  assert.equal(response.status, 201)
  assert.equal(payload.upload.method, 'PUT')
  if (payload.upload.method !== 'PUT') {
    throw new Error('Expected PUT upload when strategy=put')
  }
  assert.ok(payload.upload.url.includes('https://test-bucket.s3.us-east-1.amazonaws.com'))
  assert.equal(payload.upload.headers['Content-Type'], 'image/png')
})

test('falls back to local upload target when bucket config is missing', async (t) => {
  delete process.env.ASSETS_BUCKET_NAME
  delete process.env.ASSETS_BUCKET_REGION
  delete process.env.ASSETS_PUBLIC_BASE_URL
  process.env.ENABLE_LOCAL_UPLOADS = 'true'
  process.env.LOCAL_UPLOADS_PUBLIC_PATH = '/dev-uploads'

  stubGetCurrentUser(t)

  const originalAssetCreate = prisma.asset.create
  let recordedArgs: any = null
  ;(prisma.asset as any).create = async (args: any) => {
    recordedArgs = args
    return { id: args.data.id }
  }
  t.after(() => {
    ;(prisma.asset as any).create = originalAssetCreate
  })

  const request = stubRequest({
    resource_type: 'user_avatar',
    file_name: 'Avatar.png',
    mime_type: 'image/png',
    file_size_bytes: 10_000,
  })

  const response = await POST(request)
  const payload = (await response.json()) as UploadResponse

  assert.equal(response.status, 201)
  assert.equal(payload.upload.method, 'POST')
  if (payload.upload.method !== 'POST') {
    throw new Error('Expected POST upload for local mode')
  }
  assert.equal(payload.upload.url, '/api/uploads/local')
  assert.ok(payload.upload.fields.key.startsWith('uploads/user-avatar/'))
  assert.ok(recordedArgs)
  assert.equal(recordedArgs.data.url.startsWith('/dev-uploads/'), true)
})
