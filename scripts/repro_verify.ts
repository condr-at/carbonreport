
import { PrismaClient } from '@prisma/client'
import { buildEmailVerificationToken, validateVerificationContext } from '../src/lib/auth/service'
import { verifyEmailVerificationToken } from '../src/lib/auth/jwt'
import { hashContext } from '../src/lib/auth/hash'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting reproduction script...')

  // 1. Create a dummy user
  const email = `test-${Date.now()}@example.com`
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: email,
      passwordHash: 'hash',
      emailVerified: false,
    },
  })

  console.log('User created:', user.id, user.email, user.emailVerified)

  // 2. Generate token
  const token = await buildEmailVerificationToken(user)
  console.log('Token generated:', token)

  // 3. Verify token
  try {
    const claims = await verifyEmailVerificationToken(token)
    console.log('Token verified. Claims:', claims)

    // 4. Validate context
    // Fetch user again to simulate fresh fetch
    const fetchedUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!fetchedUser) throw new Error('User not found')

    console.log('Fetched user:', fetchedUser.id, fetchedUser.email, fetchedUser.emailVerified)

    if (!claims.ctx) throw new Error('No ctx in claims')

    console.log('Expected hash input:', `${fetchedUser.id}:${fetchedUser.email}:${fetchedUser.emailVerified}`)
    const expectedHash = hashContext(`${fetchedUser.id}:${fetchedUser.email}:${fetchedUser.emailVerified}`)
    console.log('Expected hash:', expectedHash)
    console.log('Actual ctx:', claims.ctx)

    validateVerificationContext(fetchedUser, claims.ctx)
    console.log('Context validated successfully')

  } catch (error) {
    console.error('Verification failed:', error)
  } finally {
    // Cleanup
    await prisma.user.delete({ where: { id: user.id } })
    await prisma.$disconnect()
  }
}

main()
