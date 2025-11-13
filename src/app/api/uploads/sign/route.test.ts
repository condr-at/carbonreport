import assert from 'node:assert/strict'
import test from 'node:test'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import * as auth from '@/lib/auth'
import prisma from '@/lib/db'
import { MAX_UPLOAD_SIZE_BYTES } from '@/lib/uploads'

const TEST_USER = { id: 'user-test-id' }

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
  delete process.env.AWS_ACCESS_KEY_ID
  delete process.env.AWS_SECRET_ACCESS_KEY
})

test('returns 413 when file size exceeds limit', async (t) => {
  const originalGetCurrentUser = auth.getCurrentUser
  ;(auth as any).getCurrentUser = async () => TEST_USER
  t.after(() => {
    ;(auth as any).getCurrentUser = originalGetCurrentUser
  })

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
  const originalGetCurrentUser = auth.getCurrentUser
  ;(auth as any).getCurrentUser = async () => TEST_USER
  t.after(() => {
    ;(auth as any).getCurrentUser = originalGetCurrentUser
  })

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
  const originalGetCurrentUser = auth.getCurrentUser
  ;(auth as any).getCurrentUser = async () => TEST_USER
  t.after(() => {
    ;(auth as any).getCurrentUser = originalGetCurrentUser
  })

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
  const payload = (await response.json()) as {
    upload: {
      asset_id: string
      url: string
      fields: Record<string, string>
      expires_at: string
    }
  }

  assert.equal(response.status, 201)
  assert.ok(payload.upload.asset_id)
  assert.ok(payload.upload.url.startsWith('https://'))
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
