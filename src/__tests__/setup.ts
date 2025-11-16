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
  await prisma.dataRequest.deleteMany()
  await prisma.report.deleteMany()
  await prisma.project.deleteMany()
  await prisma.organizationUsageSnapshot.deleteMany()
  await prisma.organizationMembership.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.user.deleteMany()
  // Don't delete plan_definitions - they are seeded data
}

/**
 * Register cleanup hook to run after all tests.
 */
after(async () => {
  await prisma.$disconnect()
})
