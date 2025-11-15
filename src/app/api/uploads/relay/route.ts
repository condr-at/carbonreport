import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { resolveUploadConfig, assertS3Config } from '@/lib/uploads/config'

const RelayPayloadSchema = z.object({
  method: z.enum(['POST', 'PUT']),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  fields: z.record(z.string()).optional(),
})

function ensureRelayAllowed(targetHost: string) {
  const config = resolveUploadConfig()
  assertS3Config(config)

  if (!config.uploadRequiresRelay) {
    throw new ApiError(503, 'SERVICE_UNAVAILABLE', 'Relay is not enabled for this environment')
  }

  const expectedHost = new URL(
    config.endpoint || `https://${config.bucket}.s3.${config.region}.amazonaws.com`,
  ).host

  if (targetHost !== expectedHost) {
    throw new ApiError(403, 'FORBIDDEN', 'Relay target host is not allowed')
  }

  return config
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const payloadRaw = formData.get('upload')
    const fileField = formData.get('file')

    if (!payloadRaw || typeof payloadRaw !== 'string') {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Missing upload payload')
    }

    if (!(fileField instanceof File)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Missing file')
    }

    const parsed = RelayPayloadSchema.parse(JSON.parse(payloadRaw))
  const targetUrl = new URL(parsed.url)
  ensureRelayAllowed(targetUrl.host)

    let upstreamResponse: Response

    if (parsed.method === 'POST') {
      const upstreamForm = new FormData()
      Object.entries(parsed.fields ?? {}).forEach(([key, value]) => {
        upstreamForm.append(key, value)
      })
      upstreamForm.append('file', fileField)

      upstreamResponse = await fetch(parsed.url, {
        method: 'POST',
        body: upstreamForm,
      })
    } else {
      if (!parsed.headers) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Missing headers for PUT upload')
      }
      const buffer = Buffer.from(await fileField.arrayBuffer())
      upstreamResponse = await fetch(parsed.url, {
        method: 'PUT',
        headers: parsed.headers,
        body: buffer,
      })
    }

    if (!upstreamResponse.ok) {
      const body = await upstreamResponse.text().catch(() => '')
  throw new ApiError(upstreamResponse.status, 'SERVICE_UNAVAILABLE', body || 'Relay upload failed')
    }

    return NextResponse.json(
      { ok: true, relay: true },
      { status: parsed.method === 'POST' ? 201 : 200, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to relay upload'))
  }
}
