import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { REPORT_TEMPLATE_SEED } from '../prisma/seed-data/report-templates'
import { DATASET_FIELD_SEED } from '../prisma/seed-data/dataset-fields'
import { getAllReportTemplates } from '../src/lib/report-templates'

loadEnv()

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

interface ValidationIssue {
  source: string
  templateCode: string
  sectionKey: string
  fieldId: string
  reason: string
}

type TemplateLike = {
  code: string
  sections: Array<{
    key: string
    fields: Array<{ fieldId: string | undefined | null }>
  }>
}

function collectDatasetFieldIds() {
  const dbFieldIds = new Set<string>()
  const seedFieldIds = new Set<string>()

  DATASET_FIELD_SEED.forEach((field) => {
    seedFieldIds.add(field.fieldId)
  })

  return { dbFieldIds, seedFieldIds }
}

function validateTemplates(
  source: string,
  templates: TemplateLike[],
  knownFieldIds: Set<string>,
  issues: ValidationIssue[]
) {
  for (const template of templates) {
    for (const section of template.sections) {
      for (const field of section.fields) {
        const fieldId = field.fieldId
        if (!fieldId) {
          issues.push({
            source,
            templateCode: template.code,
            sectionKey: section.key,
            fieldId: 'unknown',
            reason: 'Missing fieldId in template definition',
          })
          continue
        }

        if (!knownFieldIds.has(fieldId)) {
          issues.push({
            source,
            templateCode: template.code,
            sectionKey: section.key,
            fieldId,
            reason: 'Field is not defined in DatasetFieldDefinition',
          })
        }
      }
    }
  }
}

async function validateDatabaseTemplates(
  knownFieldIds: Set<string>,
  issues: ValidationIssue[]
) {
  const templates = await prisma.reportTemplate.findMany({
    include: {
      sections: {
        include: {
          fields: {
            include: {
              fieldDef: {
                select: {
                  fieldId: true,
                },
              },
            },
          },
        },
      },
    },
  })

  for (const template of templates) {
    for (const section of template.sections) {
      for (const field of section.fields) {
        const fieldId = field.fieldDef?.fieldId
        if (!fieldId) {
          issues.push({
            source: 'database',
            templateCode: template.code,
            sectionKey: section.key,
            fieldId: field.datasetFieldDefinitionId,
            reason: 'Linked DatasetFieldDefinition is missing',
          })
          continue
        }

        if (!knownFieldIds.has(fieldId)) {
          issues.push({
            source: 'database',
            templateCode: template.code,
            sectionKey: section.key,
            fieldId,
            reason: 'Field referenced in DB template is not defined',
          })
        }
      }
    }
  }
}

async function main() {
  const issues: ValidationIssue[] = []
  const { dbFieldIds, seedFieldIds } = collectDatasetFieldIds()

  const dbDefinitions = await prisma.datasetFieldDefinition.findMany({
    select: {
      fieldId: true,
    },
  })

  dbDefinitions.forEach((record) => {
    if (record.fieldId) {
      dbFieldIds.add(record.fieldId)
    }
  })

  if (dbFieldIds.size === 0) {
    console.warn('⚠️  No dataset field definitions found in the database. Falling back to seed data only.')
  }

  const unionFieldIds = new Set<string>([...seedFieldIds, ...dbFieldIds])

  validateTemplates('seed', REPORT_TEMPLATE_SEED as TemplateLike[], unionFieldIds, issues)
  validateTemplates('code', getAllReportTemplates() as TemplateLike[], unionFieldIds, issues)
  await validateDatabaseTemplates(unionFieldIds, issues)

  if (issues.length > 0) {
    console.error('\n❌ Template validation failed with the following issues:')
    for (const issue of issues) {
      console.error(
        ` - [${issue.source}] ${issue.templateCode} → ${issue.sectionKey} → ${issue.fieldId}: ${issue.reason}`
      )
    }
    process.exitCode = 1
  } else {
    console.log('✅ All template fieldIds are aligned with DatasetFieldDefinition records.')
  }
}

main()
  .catch((error) => {
    console.error('Unexpected error during template validation:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
