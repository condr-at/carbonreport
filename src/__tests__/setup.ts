/**
 * Global test setup for multi-org test suite.
 * Handles database cleanup and ensures consistent test environment.
 */

import prisma from '@/lib/db'
import { after } from 'node:test'

/**
 * Clean up test data after each test.
 * Order matters - delete in reverse FK dependency order.
 */
export async function cleanupTestData() {
  const tablesToTruncate = [
    '"data_requests"',
    '"reports"',
    '"projects"',
    '"contacts"',
    '"organization_usage_snapshots"',
    '"organization_memberships"',
    '"organizations"',
    '"assets"',
    '"users"',
  ]

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tablesToTruncate.join(', ')} RESTART IDENTITY CASCADE`,
  )
  // Don't delete plan_definitions - they are seeded data
}

/**
 * Register cleanup hook to run after all tests.
 */
after(async () => {
  await prisma.$disconnect()
})
