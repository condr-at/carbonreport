import { S3Client } from '@aws-sdk/client-s3'
import type { S3UploadConfig } from '@/lib/uploads/config'

let cachedClient: { instance: S3Client; cacheKey: string } | null = null
let overrideClient: S3Client | null = null

function buildCacheKey(config: S3UploadConfig) {
  const credentialKey = config.credentials
    ? `${config.credentials.accessKeyId}:${config.credentials.secretAccessKey}:${config.credentials.sessionToken ?? ''}`
    : 'default-chain'
  const endpointKey = config.endpoint ?? 'aws-default'
  return `${config.region}:${endpointKey}:${credentialKey}`
}

export function getS3Client(config: S3UploadConfig): S3Client {
  if (overrideClient) {
    return overrideClient
  }

  const cacheKey = buildCacheKey(config)

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

export function __setS3ClientOverride(client: S3Client | null) {
  overrideClient = client
}
