import assert from 'node:assert/strict'
import test from 'node:test'
import type { NextRequest } from 'next/server'
import type { Asset, User } from '@prisma/client'
import { POST } from './route'
import * as auth from '@/lib/auth'
import prisma from '@/lib/db'
import * as s3Client from '@/lib/uploads/s3-client'

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

function stubAsset(t: test.TestContext, asset: Asset) {
	const original = prisma.asset.findUnique
	;(prisma.asset as any).findUnique = async () => asset
	t.after(() => {
		;(prisma.asset as any).findUnique = original
	})
}

function stubRequest(formData: FormData, origin = 'http://localhost:3000'): NextRequest {
	return {
		formData: async () => formData,
		nextUrl: new URL(`${origin}/api/uploads/relay`),
	} as unknown as NextRequest
}

function buildAsset(overrides: Partial<Asset> = {}): Asset {
	return {
		id: 'asset-123',
		type: 'ORG_LOGO',
		url: 'https://public.example.com/uploads/org-logo/asset-123/logo.png',
		fileName: 'logo.png',
		mimeType: 'image/png',
		fileSizeBytes: 42_000,
		uploadedByUserId: TEST_USER.id,
		createdAt: new Date('2024-01-01T00:00:00.000Z'),
		...overrides,
	}
}

test.beforeEach(() => {
	process.env.ASSETS_BUCKET_NAME = 'test-bucket'
	process.env.ASSETS_BUCKET_REGION = 'us-east-1'
	process.env.ASSETS_PUBLIC_BASE_URL = 'https://public.example.com'
	process.env.ASSETS_UPLOADS_PREFIX = 'uploads'
})

test.afterEach(() => {
	delete process.env.ASSETS_BUCKET_NAME
	delete process.env.ASSETS_BUCKET_REGION
	delete process.env.ASSETS_PUBLIC_BASE_URL
	delete process.env.ASSETS_UPLOADS_PREFIX
	delete process.env.ASSETS_S3_ENDPOINT
})


test('uploads are stored via S3 client when relay is invoked', async (t) => {
	stubGetCurrentUser(t)
	stubAsset(t, buildAsset())
	const mockClient = {
		sendCalls: [] as Array<{ bucket?: string; key?: string; contentType?: string; bodyLength?: number }>,
		async send(command: any) {
			this.sendCalls.push({
				bucket: command.input.Bucket,
				key: command.input.Key,
				contentType: command.input.ContentType,
				bodyLength: command.input.ContentLength,
			})
			return {}
		},
	}
	s3Client.__setS3ClientOverride(mockClient as any)
	t.after(() => {
		s3Client.__setS3ClientOverride(null)
	})

	const formData = new FormData()
	formData.append('assetId', 'asset-123')
	formData.append('url', 'https://test-bucket.s3.us-east-1.amazonaws.com')
	formData.append(
		'fields',
		JSON.stringify({
			key: 'uploads/org-logo/asset-123/logo.png',
			'Content-Type': 'image/png',
			Policy: 'policy',
			'X-Amz-Signature': 'signature',
		}),
	)
	formData.append('file', new File([new Uint8Array([1, 2, 3])], 'logo.png', { type: 'image/png' }))

	const response = await POST(stubRequest(formData))
	const payload = (await response.json()) as { ok?: boolean; error?: string; code?: string; details?: unknown }

	assert.equal(response.status, 201, JSON.stringify(payload))
	assert.equal(payload.ok, true)
	assert.equal(mockClient.sendCalls.length, 1)
	assert.equal(mockClient.sendCalls[0].bucket, 'test-bucket')
	assert.equal(mockClient.sendCalls[0].key, 'uploads/org-logo/asset-123/logo.png')
	assert.equal(mockClient.sendCalls[0].contentType, 'image/png')
	assert.equal(mockClient.sendCalls[0].bodyLength, 3)
})

test('rejects uploads pointing to unexpected targets', async (t) => {
	stubGetCurrentUser(t)
	stubAsset(t, buildAsset())
	const formData = new FormData()
	formData.append('assetId', 'asset-123')
	formData.append('url', 'https://malicious.example.com')
	formData.append('fields', JSON.stringify({ key: 'uploads/org-logo/asset-123/logo.png', 'Content-Type': 'image/png' }))
	formData.append('file', new File([new Uint8Array([1, 2, 3])], 'logo.png', { type: 'image/png' }))

	const response = await POST(stubRequest(formData))
	const payload = (await response.json()) as { code?: string }

	assert.equal(response.status, 400)
	assert.equal(payload.code, 'VALIDATION_ERROR')
})
