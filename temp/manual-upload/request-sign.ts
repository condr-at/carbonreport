import 'dotenv/config'
import { POST } from '@/app/api/uploads/sign/route'

async function main() {
  const payload = {
    resource_type: 'user_avatar',
    file_name: process.argv[2] || 'manual-avatar.png',
    mime_type: 'image/png',
    file_size_bytes: Number(process.argv[3] || 67),
  }

  const req = {
    json: async () => payload,
  } as any

  const response = await POST(req)
  const body = await response.json()
  console.log(JSON.stringify(body, null, 2))
}

main().catch((error) => {
  console.error('sign script failed', error)
  process.exitCode = 1
})
