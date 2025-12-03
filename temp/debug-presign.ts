import { S3Client } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

async function run() {
  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'test-access',
      secretAccessKey: 'test-secret',
    },
    endpoint: 'https://example-account.r2.cloudflarestorage.com',
    forcePathStyle: true,
  })

  const presigned = await createPresignedPost(client, {
    Bucket: 'test-bucket',
    Key: 'uploads/test.txt',
    Fields: {
      key: 'uploads/test.txt',
    },
    Conditions: [
      ['content-length-range', 1, 512000],
      ['eq', '$Content-Type', 'image/png'],
    ],
    Expires: 60,
  })

  console.log(presigned.url)
}

run().catch((error) => {
  console.error('debug error', error)
  process.exitCode = 1
})
