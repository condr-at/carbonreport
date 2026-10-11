import { Prisma, PrismaClient, ProjectScope } from '@prisma/client'
import { DATASET_FIELD_SEED } from '../../prisma/seed-data/dataset-fields'
import { e2eConfig } from './config.mjs'

const config = e2eConfig()
if (process.env.DATABASE_URL !== config.databaseUrl || process.env.DIRECT_URL !== config.databaseUrl) {
  throw new Error('E2E seed requires both Prisma URLs to match the guarded disposable database.')
}
const prisma = new PrismaClient()
async function main() {
  // Application users, memberships, projects and reports are created through the browser.
  // Only the static field catalogue is bootstrapped; organization creation supplies its plans.
  await prisma.datasetFieldDefinition.createMany({ data: DATASET_FIELD_SEED.map(field => ({
    fieldId: field.fieldId, label: field.label, hint: field.hint,
    type: field.type ?? 'text', dataType: field.dataType, unit: field.unit,
    scope: ({ product: ProjectScope.PRODUCT, corporate: ProjectScope.CORPORATE, both: ProjectScope.BOTH })[field.scope],
    options: field.options == null ? undefined : field.options as Prisma.InputJsonValue,
    validation: field.validation == null ? undefined : field.validation as Prisma.InputJsonValue,
    isRepeatable: field.isRepeatable ?? false, repeatableKey: field.repeatableKey,
    isRequired: field.isRequired ?? false, sortOrder: field.sortOrder,
  })) })
  console.log(`Prepared field catalogue in ${config.databaseName}; no demo users or project fixtures seeded.`)
}
main().finally(() => prisma.$disconnect()).catch(error => { console.error(error); process.exitCode = 1 })
