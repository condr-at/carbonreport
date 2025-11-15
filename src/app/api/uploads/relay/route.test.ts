import assert from 'node:assert/strict'
import test from 'node:test'
import type { NextRequest } from 'next/server'
import { POST } from './route'

function stubRequest(formData: FormData): NextRequest {
  return {
    formData: async () => formData,
  } as unknown as NextRequest
}

test.beforeEach(() => {
  process.env.ASSETS_BUCKET_NAME = 'relay-bucket'
  process.env.ASSETS_BUCKET_REGION = 'us-east-1'
  process.env.ASSETS_PUBLIC_BASE_URL = 'https://relay-bucket.s3.us-east-1.amazonaws.com'
  process.env.ASSETS_S3_ENDPOINT = 'https://example-account.r2.cloudflarestorage.com'
  process.env.ASSETS_UPLOADS_REQUIRE_RELAY = 'true'
})

test.afterEach(() => {
  delete process.env.ASSETS_BUCKET_NAME
  delete process.env.ASSETS_BUCKET_REGION
  delete process.env.ASSETS_PUBLIC_BASE_URL
  delete process.env.ASSETS_S3_ENDPOINT
  delete process.env.ASSETS_UPLOADS_REQUIRE_RELAY
})

test('proxies PUT uploads when relay enabled', async (t) => {
  const payload = {
    method: 'PUT' as const,
    url: 'https://example-account.r2.cloudflarestorage.com/relay-bucket/test/object.png',
    headers: {
      'Content-Type': 'image/png',
    },
  }
  const file = new File(['image-bytes'], 'object.png', { type: 'image/png' })
  const formData = new FormData()
  formData.append('upload', JSON.stringify(payload))
  formData.append('file', file)

  const request = stubRequest(formData)

  const originalFetch = globalThis.fetch
  let capturedUrl: string | undefined
  let capturedHeaders: HeadersInit | undefined
  let capturedBodyLength = 0

  globalThis.fetch = async (url, init) => {
    if (typeof url === 'string') {
      capturedUrl = url
    } else if (url instanceof URL) {
      capturedUrl = url.toString()
    } else if (typeof (url as Request).url === 'string') {
      capturedUrl = (url as Request).url
    } else {
      capturedUrl = undefined
    }
    capturedHeaders = init?.headers
    const upstreamBody = init?.body
    if (!upstreamBody) {
      capturedBodyLength = 0
    } else if (typeof upstreamBody === 'string') {
      capturedBodyLength = Buffer.byteLength(upstreamBody)
    } else if (upstreamBody instanceof Buffer) {
      capturedBodyLength = upstreamBody.byteLength
    } else if (upstreamBody instanceof Uint8Array) {
      capturedBodyLength = upstreamBody.byteLength
    } else if (typeof (upstreamBody as Blob).arrayBuffer === 'function') {
      const arr = await (upstreamBody as Blob).arrayBuffer()
      capturedBodyLength = arr.byteLength
    } else {
      capturedBodyLength = 0
    }
    return new Response('ok', { status: 200 })
  }

  t.after(() => {
    globalThis.fetch = originalFetch
  })

  const response = await POST(request)
  assert.equal(response.status, 200)
  assert.equal(capturedUrl, payload.url)
  if (capturedHeaders instanceof Headers) {
    assert.equal(capturedHeaders.get('Content-Type'), 'image/png')
  } else if (Array.isArray(capturedHeaders)) {
    const headerEntry = capturedHeaders.find(([key]) => key.toLowerCase() === 'content-type')
    assert.equal(headerEntry?.[1], 'image/png')
  } else {
    assert.equal((capturedHeaders as Record<string, string> | undefined)?.['Content-Type'], 'image/png')
  }
  assert.equal(capturedBodyLength > 0, true)
})
