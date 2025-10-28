/**
 * Database Seed Script (DB-backed, no CSV dependencies)
 */
import { Prisma, PrismaClient } from '@prisma/client'
import { DATASET_FIELD_SEED } from './seed-data/dataset-fields'
import { REPORT_TEMPLATE_SEED } from './seed-data/report-templates'

type DataPoint = {
  field_id: string
  item_id: string | null
  value: string
}

type FieldValueUpdate = string | Record<string, string>

// Use DIRECT_URL for seed script (transactions need direct connection)
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

async function seedReportTemplates() {
  console.log('🧱 Seeding report templates...')

  const fieldDefinitions = await prisma.datasetFieldDefinition.findMany({
    select: {
      id: true,
      fieldId: true,
    },
  })

  const fieldIdToDefinitionId = new Map<string, string>()
  fieldDefinitions.forEach((def) => {
    fieldIdToDefinitionId.set(def.fieldId, def.id)
  })

  for (const [templateIndex, templateSeed] of REPORT_TEMPLATE_SEED.entries()) {
    const template = await prisma.reportTemplate.create({
      data: {
        code: templateSeed.code,
        name: templateSeed.name,
        version: templateSeed.version ?? null,
        description: templateSeed.description ?? null,
        layoutMeta: templateSeed.layoutMeta
          ? (templateSeed.layoutMeta as Prisma.InputJsonValue)
          : undefined,
        sections: {
          create: templateSeed.sections.map((sectionSeed, sectionIndex) => {
            const sectionData: Prisma.ReportTemplateSectionCreateWithoutTemplateInput = {
              key: sectionSeed.key,
              title: sectionSeed.title,
              description: sectionSeed.description ?? null,
              blockType: sectionSeed.blockComponent,
              sortOrder: sectionIndex * 100,
            }

            if (sectionSeed.config) {
              sectionData.config = sectionSeed.config as Prisma.InputJsonValue
            }

            return sectionData
          }),
        },
      },
      include: {
        sections: true,
      },
    })

    for (const sectionSeed of templateSeed.sections) {
      const section = (template.sections as any[]).find(
        (s) => s.key === sectionSeed.key
      )
      if (!section) {
        throw new Error(`Failed to create section ${sectionSeed.key} for template ${templateSeed.code}`)
      }

      const fieldMappings = sectionSeed.fields.map((fieldSeed, fieldIndex) => {
        const datasetFieldId = fieldIdToDefinitionId.get(fieldSeed.fieldId)
        if (!datasetFieldId) {
          throw new Error(
            `Dataset field "${fieldSeed.fieldId}" not found while seeding template ${templateSeed.code}`
          )
        }

        const mapping: Prisma.ReportTemplateFieldMappingCreateManyInput = {
          sectionId: section.id,
          datasetFieldDefinitionId: datasetFieldId,
          displayLabel: fieldSeed.displayLabel ?? null,
          isRequired: fieldSeed.isRequired ?? false,
          displayOrder: fieldSeed.displayOrder ?? fieldIndex * 10,
        }

        if (fieldSeed.config) {
          mapping.config = fieldSeed.config as Prisma.InputJsonValue
        }

        return mapping
      })

      if (fieldMappings.length > 0) {
        await prisma.reportTemplateFieldMapping.createMany({
          data: fieldMappings,
        })
      }
    }

    console.log(`   • Seeded template ${templateSeed.code} (${templateIndex + 1}/${REPORT_TEMPLATE_SEED.length})`)
  }

  console.log(`✅ Seeded ${REPORT_TEMPLATE_SEED.length} report templates`)
}

function buildEmptyDataset(): DataPoint[] {
  return DATASET_FIELD_SEED.map((field) => ({
    field_id: field.fieldId,
    item_id: field.isRepeatable ? '1' : null,
    value: '',
  }))
}

function applyDatasetUpdates(
  dataPoints: DataPoint[],
  updates: Record<string, FieldValueUpdate>
): DataPoint[] {
  return dataPoints.map((point) => {
    const update = updates[point.field_id]
    if (!update) return point

    if (point.item_id === null && typeof update === 'string') {
      return { ...point, value: update }
    }

    if (point.item_id !== null) {
      if (typeof update === 'string') {
        return point.item_id === '1' ? { ...point, value: update } : point
      }

      const repeatableValue = update[point.item_id]
      if (repeatableValue !== undefined) {
        return { ...point, value: repeatableValue }
      }
    }

    return point
  })
}

function datasetToJson(dataPoints: DataPoint[]) {
  return { data_points: dataPoints }
}

function createMockDataset(projectType: 'ebike' | 'steel') {
  const skeleton = buildEmptyDataset()
  const updates: Record<string, FieldValueUpdate> = {}

  if (projectType === 'ebike') {
    updates['organization_name'] = 'GreenCycle Manufacturing'
    updates['report_date'] = '2025-10-13'
    updates['report_language'] = 'English'
    updates['product_name'] = 'E-Bike Model X Pro'
    updates['product_description'] = 'Electric bicycle with 750W motor and lithium battery'
    updates['intended_market'] = 'European Union, North America'
    updates['functional_unit'] = '1 electric bicycle'
    updates['system_boundary'] = 'Cradle-to-gate including raw materials, manufacturing, and packaging'
    updates['total_cfp_co2e'] = '145.5'
    updates['cfp_result_unit'] = 'kg CO2e'

    updates['material_input_name'] = { '1': 'Aluminum frame' }
    updates['material_input_amount'] = { '1': '8.5' }
    updates['material_input_unit'] = { '1': 'kg' }
    updates['material_origin_country'] = { '1': 'Germany' }
    updates['material_data_source'] = { '1': 'Supplier declaration' }

    updates['energy_input_type'] = { '1': 'Purchased electricity' }
    updates['energy_input_amount'] = { '1': '1200' }
    updates['energy_input_unit'] = { '1': 'kWh' }
    updates['energy_source_renewable_percent'] = { '1': '65' }
  } else {
    updates['organization_name'] = 'Steel Manufacturing Ltd'
    updates['report_date'] = '2025-10-13'
    updates['report_language'] = 'English'
    updates['product_name'] = 'Steel Beam 200x100'
    updates['product_description'] = 'Structural steel beam for construction projects'
    updates['intended_market'] = 'European Union'
    updates['functional_unit'] = '1 ton of steel beams'
    updates['system_boundary'] = 'Cradle-to-gate: mining, processing, manufacturing'
    updates['total_cfp_co2e'] = '1850'
    updates['cfp_result_unit'] = 'kg CO2e'

    updates['material_input_name'] = { '1': 'Iron ore', '2': 'Coking coal' }
    updates['material_input_amount'] = { '1': '1.6', '2': '0.6' }
    updates['material_input_unit'] = { '1': 'ton', '2': 'ton' }
    updates['material_origin_country'] = { '1': 'Australia', '2': 'Poland' }

    updates['energy_input_type'] = { '1': 'Blast furnace gas' }
    updates['energy_input_amount'] = { '1': '5800' }
    updates['energy_input_unit'] = { '1': 'kWh' }
  }

  const updated = applyDatasetUpdates(skeleton, updates)
  return datasetToJson(updated)
}

const defaultMailtoTemplate = {
  subject: 'Data Request for {{project_name}} - {{field_display_name}}',
  body: `Dear {{contact_name}},

We are preparing a carbon footprint assessment for our project "{{project_name}}" and need your input on {{field_display_name}}.

Could you please provide the following information?
{{field_list}}

This information is needed by {{deadline}}.

Best regards,
{{user_name}}`,
}

async function main() {
  console.log('🌱 Seeding database...')

  console.log('🧹 Cleaning existing data...')
  await prisma.dataRequest.deleteMany()
  await prisma.report.deleteMany()
  await prisma.project.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.user.deleteMany()
  await prisma.reportTemplateFieldMapping.deleteMany()
  await prisma.reportTemplateSection.deleteMany()
  await prisma.reportTemplate.deleteMany()
  await prisma.datasetFieldDefinition.deleteMany()
  console.log('✅ Cleaned')

  console.log('🧱 Seeding dataset field definitions...')
  await prisma.datasetFieldDefinition.createMany({
    data: DATASET_FIELD_SEED.map((field) => ({
      fieldId: field.fieldId,
      label: field.label,
      hint: field.hint ?? null,
      type: field.type ?? 'text',
      options: field.options ?? null,
      validation: field.validation ?? null,
      isRepeatable: field.isRepeatable ?? false,
      repeatableKey: field.repeatableKey ?? null,
      sortOrder: field.sortOrder,
    })),
    skipDuplicates: true,
  })
  console.log(`✅ Seeded ${DATASET_FIELD_SEED.length} definitions`)

  await seedReportTemplates()

  console.log('👤 Creating test user...')
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: '$2a$10$dummyhash',
      emailVerified: true,
    },
  })
  console.log(`✅ Created user: ${user.email}`)

  console.log('📇 Creating contacts...')
  const contact1 = await prisma.contact.create({
    data: {
      userId: user.id,
      name: 'Ivan Petrov',
      position: 'Production Manager',
      email: 'ivan@supplier.com',
    },
  })
  const contact2 = await prisma.contact.create({
    data: {
      userId: user.id,
      name: 'Maria Garcia',
      position: 'Logistics Coordinator',
      email: 'maria@logistics.com',
    },
  })
  console.log(`✅ Created contacts: ${contact1.name}, ${contact2.name}`)

  console.log('📁 Creating sample projects...')
  const project1 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Electric Bicycle Carbon Assessment',
      status: 'ACTIVE',
      datasetVersion: 0,
      mailtoTemplate: defaultMailtoTemplate,
      dataset: createMockDataset('ebike'),
      checklist: {
        items: [
          {
            id: 'cl1',
            title: 'Gather product specifications',
            completed: true,
            dataPointIds: ['product_name', 'product_description'],
          },
          {
            id: 'cl2',
            title: 'Collect material data',
            completed: false,
            dataPointIds: ['material_input_name', 'material_input_amount'],
          },
        ],
      },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Steel Components CBAM Report',
      status: 'ACTIVE',
      datasetVersion: 0,
      mailtoTemplate: defaultMailtoTemplate,
      dataset: createMockDataset('steel'),
      checklist: {
        items: [
          {
            id: 'cl1',
            title: 'Fill company information',
            completed: true,
            dataPointIds: ['organization_name'],
          },
          {
            id: 'cl2',
            title: 'Calculate total emissions',
            completed: false,
            dataPointIds: ['total_cfp_co2e'],
          },
        ],
      },
    },
  })
  console.log(`✅ Created projects: ${project1.name}, ${project2.name}`)

  const totalFields = DATASET_FIELD_SEED.length
  const filledFieldsP1 = (project1.dataset as any).data_points.filter((dp: any) => dp.value && dp.value.trim() !== '').length
  const filledFieldsP2 = (project2.dataset as any).data_points.filter((dp: any) => dp.value && dp.value.trim() !== '').length

  await prisma.report.create({
    data: {
      projectId: project1.id,
      templateCode: 'ISO14067',
      metadata: undefined,
      completion: totalFields ? Math.round((filledFieldsP1 / totalFields) * 100) : 0,
    },
  })
  await prisma.report.create({
    data: {
      projectId: project2.id,
      templateCode: 'CBAM',
      metadata: undefined,
      completion: totalFields ? Math.round((filledFieldsP2 / totalFields) * 100) : 0,
    },
  })
  console.log('✅ Created reports with completion metrics')

  const repeatableField = DATASET_FIELD_SEED.find((f) => f.isRepeatable)
  if (repeatableField) {
    await prisma.dataRequest.create({
      data: {
        userId: user.id,
        projectId: project1.id,
        contactId: contact1.id,
        dataPointId: repeatableField.fieldId,
        externalAccess: false,
      },
    })
    console.log(`✅ Created data request for field ${repeatableField.fieldId}`)
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
