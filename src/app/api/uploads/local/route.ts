import { NextRequest, NextResponse } from 'next/server'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { ensureApiError, errorResponse, ApiError } from '@/lib/api-error'
import { resolveUploadConfig, assertLocalConfig } from '@/lib/uploads/config'
import { MAX_UPLOAD_SIZE_BYTES } from '@/lib/uploads'

function sanitizeKey(key: string): string {
  const trimmed = key.trim().replace(/^\/+/, '')
  if (!trimmed || trimmed.includes('..')) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid upload key supplied')
  }
  return trimmed
}

export async function POST(request: NextRequest) {
  try {
    const config = resolveUploadConfig()
    assertLocalConfig(config)

    const formData = await request.formData()
    const keyField = formData.get('key')
    const fileField = formData.get('file')

    if (typeof keyField !== 'string') {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Missing object key for upload')
    }

    if (!(fileField instanceof File)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Missing file payload')
    }

    const normalizedKey = sanitizeKey(keyField)
    const targetPath = path.join(config.directory, normalizedKey)
    const resolvedDir = path.resolve(config.directory)

    if (!targetPath.startsWith(resolvedDir)) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid upload path')
    }

    const buffer = Buffer.from(await fileField.arrayBuffer())
    if (buffer.byteLength === 0) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'File payload is empty')
    }

    if (buffer.byteLength > MAX_UPLOAD_SIZE_BYTES) {
      throw new ApiError(413, 'VALIDATION_ERROR', 'File size exceeds limit', {
        max_bytes: MAX_UPLOAD_SIZE_BYTES,
        size: buffer.byteLength,
      })
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true })
    await fs.writeFile(targetPath, buffer)

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to store local upload'))
  }
}
