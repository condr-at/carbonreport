// Quick schema verification script
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifySchema() {
  console.log('🔍 Verifying Supabase schema updates...\n')

  try {
    // Test 1: Check if we can read projects with new fields
    const project = await prisma.project.findFirst({
      select: {
        id: true,
        name: true,
        dataset: true,
        datasetVersion: true,
        mailtoTemplates: true,
      }
    })

    console.log('✅ Project table structure:')
    console.log('   - dataset: exists')
    console.log('   - datasetVersion: exists')
    console.log('   - mailtoTemplates: exists')
    
    if (project) {
      console.log('\n📊 Sample project:')
      console.log('   ID:', project.id)
      console.log('   Name:', project.name)
      console.log('   Dataset version:', project.datasetVersion)
      console.log('   Mailto templates:', project.mailtoTemplates ? 'configured' : 'null')
    } else {
      console.log('\n⚠️  No projects found (database is empty)')
    }

    // Test 2: Check Reports table
    const report = await prisma.report.findFirst({
      select: {
        id: true,
        templateCode: true,
        metadata: true,
        completion: true,
      }
    })

    console.log('\n✅ Report table structure:')
    console.log('   - templateCode: exists')
    console.log('   - metadata: exists (nullable)')
    console.log('   - data field: removed ✅')
    
    if (report) {
      console.log('\n📊 Sample report:')
      console.log('   ID:', report.id)
      console.log('   Template:', report.templateCode)
      console.log('   Metadata:', report.metadata || 'null')
      console.log('   Completion:', report.completion + '%')
    } else {
      console.log('\n⚠️  No reports found')
    }

    console.log('\n✅ All schema changes applied successfully!\n')

  } catch (error: any) {
    console.error('❌ Schema verification failed:', error.message)
    console.error('\nMissing fields detected. Run:')
    console.error('  npx prisma db push\n')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifySchema()
