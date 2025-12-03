import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { Buffer } from 'node:buffer'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { MAX_UPLOAD_SIZE_BYTES } from '@/lib/uploads'
import { resolveUploadConfig, type UploadConfig, type S3UploadConfig } from '@/lib/uploads/config'
import { getS3Client } from '@/lib/uploads/s3-client'

type RelayFields = Record<string, string>

function parseStringField(value: FormDataEntryValue | null, field: string) {
	if (typeof value !== 'string' || !value.trim()) {
		throw new ApiError(400, 'VALIDATION_ERROR', `Missing ${field}`)
	}
	return value.trim()
}

function parseFields(raw: FormDataEntryValue | null): RelayFields {
	const json = parseStringField(raw, 'fields payload')
	let parsed: unknown
	try {
		parsed = JSON.parse(json)
	} catch {
		throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid upload fields payload')
	}

	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		throw new ApiError(400, 'VALIDATION_ERROR', 'Upload fields payload must be an object')
	}

	const result: RelayFields = {}
	for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
		if (typeof value !== 'string') {
			throw new ApiError(400, 'VALIDATION_ERROR', 'Upload fields must be strings')
		}
		result[key] = value
	}

	if (!result.key) {
		throw new ApiError(400, 'VALIDATION_ERROR', 'Upload key is required')
	}

	return result
}

function decodeAssetKey(assetUrl: string, config: UploadConfig) {
	const baseUrl = config.publicBaseUrl.replace(/\/$/, '')
	const normalized = assetUrl.replace(/\/$/, '')
	if (!normalized.startsWith(`${baseUrl}/`)) {
		return null
	}

	const encodedKey = normalized.slice(baseUrl.length + 1)
	try {
		return decodeURIComponent(encodedKey)
	} catch {
		return null
	}
}

function resolveAllowedS3Targets(config: S3UploadConfig): string[] {
	const targets: string[] = []
	const normalizedEndpoint = config.endpoint?.replace(/\/$/, '')
	if (normalizedEndpoint) {
		targets.push(`${normalizedEndpoint}/${config.bucket}`)
	}
	const regional = `https://${config.bucket}.s3.${config.region}.amazonaws.com`
	targets.push(regional)
	if (config.region === 'us-east-1') {
		targets.push(`https://${config.bucket}.s3.amazonaws.com`)
	}
	return targets.map((entry) => entry.replace(/\/$/, ''))
}

function sanitizeTargetUrl(rawUrl: string, config: UploadConfig, origin: string) {
	let normalized: URL

	if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
		normalized = new URL(rawUrl)
	} else if (rawUrl.startsWith('/')) {
		normalized = new URL(rawUrl, origin)
	} else {
		throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid upload target URL')
	}

	const trimmed = normalized.toString().replace(/\/$/, '')

	if (config.mode === 'local') {
		const expected = new URL('/api/uploads/local', origin).toString().replace(/\/$/, '')
		if (trimmed !== expected) {
			throw new ApiError(400, 'VALIDATION_ERROR', 'Upload target mismatch')
		}
		return expected
	}

	const allowedTargets = resolveAllowedS3Targets(config)
	if (!allowedTargets.includes(trimmed)) {
		throw new ApiError(400, 'VALIDATION_ERROR', 'Upload target mismatch')
	}

	return trimmed
}

async function forwardUpload(targetUrl: string, fields: RelayFields, file: File) {
	const formData = new FormData()
	Object.entries(fields).forEach(([key, value]) => {
		formData.append(key, value)
	})
	formData.append('file', file)

	try {
		const response = await fetch(targetUrl, {
			method: 'POST',
			body: formData,
		})

		if (!response.ok) {
			const text = await response.text().catch(() => '')
			throw new ApiError(response.status, 'UPLOAD_RELAY_FAILED', 'Storage rejected relay upload', {
				target: targetUrl,
				response: text.slice(0, 512),
			})
		}
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}

		throw new ApiError(502, 'UPLOAD_RELAY_FAILED', 'Failed to forward upload to storage', {
			target: targetUrl,
			message: error instanceof Error ? error.message : String(error),
		})
	}
}

async function uploadToS3(config: S3UploadConfig, key: string, file: File, contentType: string) {
	const buffer = Buffer.from(await file.arrayBuffer())
	const s3 = getS3Client(config)

	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: config.bucket,
				Key: key,
				Body: buffer,
				ContentType: contentType,
				ContentLength: buffer.byteLength,
			}),
		)
	} catch (error) {
		throw new ApiError(502, 'UPLOAD_RELAY_FAILED', 'Failed to upload file to storage', {
			target: key,
			message: error instanceof Error ? error.message : String(error),
		})
	}
}

export async function POST(request: NextRequest) {
	try {
		const user = await getCurrentUser()
		const config = resolveUploadConfig()
		const formData = await request.formData()

		const assetId = parseStringField(formData.get('assetId'), 'asset id')
		const rawTargetUrl = parseStringField(formData.get('url'), 'upload url')
		const targetUrl = sanitizeTargetUrl(rawTargetUrl, config, request.nextUrl.origin)
		const fields = parseFields(formData.get('fields'))
		const fileField = formData.get('file')

		if (!(fileField instanceof File)) {
			throw new ApiError(400, 'VALIDATION_ERROR', 'Missing file payload')
		}

		if (fileField.size === 0) {
			throw new ApiError(400, 'VALIDATION_ERROR', 'File payload is empty')
		}

		if (fileField.size > MAX_UPLOAD_SIZE_BYTES) {
			throw new ApiError(413, 'VALIDATION_ERROR', 'File size exceeds limit', {
				max_bytes: MAX_UPLOAD_SIZE_BYTES,
			})
		}

		const asset = await prisma.asset.findUnique({ where: { id: assetId } })
		if (!asset) {
			throw new ApiError(404, 'NOT_FOUND', 'Upload placeholder was not found')
		}

		if (asset.uploadedByUserId !== user.id) {
			throw new ApiError(403, 'FORBIDDEN', 'You cannot relay uploads for another user')
		}

		const expectedKey = decodeAssetKey(asset.url, config)
		if (!expectedKey) {
			throw new ApiError(400, 'VALIDATION_ERROR', 'Upload key is invalid')
		}

		if (fields.key !== expectedKey) {
			throw new ApiError(400, 'VALIDATION_ERROR', 'Upload key mismatch')
		}

		if (fields['Content-Type'] && fields['Content-Type'] !== asset.mimeType) {
			throw new ApiError(400, 'VALIDATION_ERROR', 'Content type mismatch')
		}

		if (config.mode === 'local') {
			await forwardUpload(targetUrl, fields, fileField)
		} else {
			await uploadToS3(config, expectedKey, fileField, asset.mimeType)
		}

		return NextResponse.json({ ok: true }, { status: 201 })
	} catch (error) {
		return errorResponse(ensureApiError(error, 'Failed to relay upload'))
	}
}
