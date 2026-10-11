import { PrismaClient, ProjectScope } from '@prisma/client'
import { CBAM_PACKAGE_FIELD_SEED } from '../prisma/seed-data/cbam-package-fields'

// Additive catalogue sync: never run the destructive full seed for this feature.
async function main() {
  const prisma = new PrismaClient()
  try {
    await prisma.$transaction(CBAM_PACKAGE_FIELD_SEED.map(field => prisma.datasetFieldDefinition.upsert({
      where: { fieldId: field.fieldId },
      update: {}, // Preserve definitions already deployed or customised.
      create: {
        fieldId: field.fieldId, label: field.label, hint: field.hint,
        type: field.type, dataType: field.dataType, scope: ProjectScope.PRODUCT,
        ...(field.options ? { options: field.options } : {}),
        isRepeatable: false, isRequired: false, sortOrder: field.sortOrder,
      },
    })))
    console.log(`Ensured ${CBAM_PACKAGE_FIELD_SEED.length} supplier-package field definitions; project data unchanged.`)
  } finally { await prisma.$disconnect() }
}

main().catch(error => { console.error(error instanceof Error ? error.message : 'Field sync failed'); process.exitCode = 1 })
