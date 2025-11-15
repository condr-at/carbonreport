import 'dotenv/config'
import prisma from '@/lib/db'

const assetId = process.argv[2]

if (!assetId) {
  console.error('usage: tsx check-asset.ts <assetId>')
  process.exit(1)
}

async function main() {
  const asset = await prisma.asset.findUnique({ where: { id: assetId } })
  console.log(JSON.stringify(asset, null, 2))
}

main()
  .catch((error) => {
    console.error('check asset failed', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
