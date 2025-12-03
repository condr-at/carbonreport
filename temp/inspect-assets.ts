import prisma from '../src/lib/db'

async function main() {
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      type: true,
      url: true,
      uploadedByUserId: true,
      createdAt: true,
    },
  })

  console.table(assets)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
