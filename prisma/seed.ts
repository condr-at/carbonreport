/**
 * Database Seed Script
 * 
 * Seeds the database with sample data for development.
 * Uses the new full dataset schema (162 fields) approach.
 * 
 * Features:
 * - Full dataset initialization (162 fields from schema)
 * - Mock data for realistic testing
 * - Default mailto templates
 * - datasetVersion counter
 */

import { PrismaClient } from '@prisma/client'
import datasetSchema from '../src/lib/dataset-schema.json'
import { initializeFullDataset } from '../src/lib/dataset-init'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // Clean existing data (dev only!)
  console.log('🧹 Cleaning existing data...')
  await prisma.dataRequest.deleteMany()
  // await prisma.projectFile.deleteMany() // ⏸️ Post-MVP
  await prisma.report.deleteMany()
  await prisma.project.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.user.deleteMany()
  await prisma.datasetFieldDefinition.deleteMany()
  console.log('✅ Cleaned\n')

  // Seed dataset field definitions
  console.log('🧱 Seeding dataset field definitions...')

  const fieldDefinitionsToCreate: Array<{
    fieldId: string
    label: string
    hint: string | null
    type: string
    options: any | null
    validation: any | null
    isRepeatable: boolean
    repeatableKey: string | null
  }> = []

  const toLabel = (fieldId: string) => {
    // Extract the tail after first underscore, convert to readable label
    const parts = fieldId.split('_')
    const tail = parts.slice(1).join('_') // Everything after section prefix
    return tail
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase → camel Case
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // ABCDef → ABC Def
      .replace(/_/g, ' ') // underscores → spaces
      .trim()
  }

  for (const section of datasetSchema.sections) {
    for (const field of section.fields) {
      const fieldDef = {
        fieldId: field.fieldId,
        label: toLabel(field.fieldId),
        hint: null, // TODO: Add hints from CSV or manual curation
        type: 'text', // Default type
        options: null,
        validation: null,
        isRepeatable: field.isRepeatable,
        repeatableKey: field.isRepeatable ? section.name : null,
      }
      fieldDefinitionsToCreate.push(fieldDef)
    }
  }

  await prisma.datasetFieldDefinition.createMany({
    data: fieldDefinitionsToCreate,
    skipDuplicates: true,
  })

  console.log(`✅ Seeded ${fieldDefinitionsToCreate.length} field definitions\n`)

  // Create test user
  console.log('👤 Creating test user...')
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: '$2a$10$dummyhash', // Placeholder - use bcrypt in real app
      emailVerified: true,
    },
  })
  console.log(`✅ Created user: ${user.email}\n`)

  // Create test contacts
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
  console.log(`✅ Created ${2} contacts\n`)

  // Helper function to create mock dataset with some filled values
  function createMockDataset(projectType: 'ebike' | 'steel') {
    // Start with full dataset (162 fields)
    const fullDataset = initializeFullDataset();

    // Fill some realistic values based on project type
    const updates: Record<string, string> = {};

    if (projectType === 'ebike') {
      // E-Bike project mock data
      updates['ReportMetadata_OrganizationName'] = 'GreenCycle Manufacturing';
      updates['ReportMetadata_ReportDate'] = '2025-10-13';
      updates['ReportMetadata_ReportLanguage'] = 'English';
      updates['ProductDescription_ProductName'] = 'E-Bike Model X Pro';
      updates['ProductDescription_ProductDescription'] = 'Electric bicycle with 750W motor and lithium battery';
      updates['ProductDescription_IntendedUse'] = 'Urban commuting and recreational cycling';
      updates['ProductDescription_Market'] = 'European Union, North America';
      updates['GoalAndScope_StudyGoal'] = 'Calculate carbon footprint according to ISO 14067';
      updates['GoalAndScope_FunctionalUnit'] = '1 electric bicycle';
      updates['GoalAndScope_SystemBoundary'] = 'Cradle-to-gate including raw materials, manufacturing, and packaging';
      
      // Life Cycle Inventory - Inputs (repeatable, item 1)
      updates['LifeCycleInventoryInputs_MaterialInputName'] = 'Aluminum Frame';
      updates['LifeCycleInventoryInputs_MaterialInputAmount'] = '8.5';
      updates['LifeCycleInventoryInputs_MaterialInputUnit'] = 'kg';
      updates['LifeCycleInventoryInputs_MaterialInputSource'] = 'Alcoa Aluminum Supplier';
      
      // Impact Assessment Results
      updates['ImpactAssessmentResults_TotalCFPCO2e'] = '145.5';
      updates['ImpactAssessmentResults_CFPUnit'] = 'kg CO2e';
    } else {
      // Steel project mock data
      updates['ReportMetadata_OrganizationName'] = 'Steel Manufacturing Ltd';
      updates['ReportMetadata_ReportDate'] = '2025-10-13';
      updates['ReportMetadata_ReportLanguage'] = 'English';
      updates['ProductDescription_ProductName'] = 'Steel Beam 200x100';
      updates['ProductDescription_ProductDescription'] = 'Structural steel beam for construction';
      updates['ProductDescription_IntendedUse'] = 'Building construction and infrastructure';
      updates['ProductDescription_Market'] = 'European Union';
      updates['GoalAndScope_StudyGoal'] = 'CBAM compliance reporting';
      updates['GoalAndScope_FunctionalUnit'] = '1 ton of steel beams';
      updates['GoalAndScope_SystemBoundary'] = 'Cradle-to-gate: mining, processing, manufacturing';
      
      // Impact Assessment Results
      updates['ImpactAssessmentResults_TotalCFPCO2e'] = '1850';
      updates['ImpactAssessmentResults_CFPUnit'] = 'kg CO2e';
    }

    // Apply updates to the full dataset
    const updatedDataPoints = fullDataset.map((dp) => {
      const key = dp.item_id 
        ? `${dp.field_id}` // For repeatable fields, update first item only
        : dp.field_id;
      
      if (updates[key] && (dp.item_id === null || dp.item_id === '1')) {
        return { ...dp, value: updates[key] };
      }
      return dp;
    });

    return { data_points: updatedDataPoints };
  }

  // Default mailto templates (using string keys instead of FieldId enum)
  const defaultMailtoTemplates = {
    'ProductDescription_ProductName': `Hi {contact_name},

We are preparing a carbon footprint assessment for our project "{project_name}" and need your input.

Could you please provide the following information:
- {field_label}

This information is needed for our ISO 14067 compliance report.

Best regards,
{user_name}`,

    'LifeCycleInventoryInputs_MaterialInputName': `Dear {contact_name},

For our carbon footprint assessment of "{project_name}", we require detailed information about materials.

Please provide:
- {field_label}
- Quantities and units
- Supplier information

Thank you for your cooperation.

{user_name}`,

    'LifeCycleInventoryInputs_EnergyInputType': `Hi {contact_name},

We need energy consumption data for "{project_name}" carbon assessment.

Required data:
- {field_label}
- Time period: Full production cycle
- Units: kWh or MWh

Deadline: {deadline}

Thanks,
{user_name}`,

    'Transportation_TransportMode': `Hello {contact_name},

For our CBAM reporting requirements on "{project_name}", please provide:

- {field_label}
- Transport mode details
- Emission factors if available

Best,
{user_name}`,
  }

  // Create sample project 1 (ISO 14067 - E-Bike)
  console.log('📁 Creating sample project 1 (E-Bike)...')
  const project1 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Electric Bicycle Carbon Assessment',
      status: 'ACTIVE',
      datasetVersion: 0,
      mailtoTemplates: defaultMailtoTemplates,
      dataset: createMockDataset('ebike'),
      checklist: {
        items: [
          {
            id: 'cl1',
            title: 'Gather product specifications',
            completed: true,
            dataPointIds: ['ProductDescription_ProductName', 'ProductDescription_ProductDescription'],
          },
          {
            id: 'cl2',
            title: 'Collect material data',
            completed: false,
            dataPointIds: ['LifeCycleInventoryInputs_MaterialInputName', 'LifeCycleInventoryInputs_MaterialInputAmount'],
          },
          {
            id: 'cl3',
            title: 'Calculate carbon footprint',
            completed: false,
            dataPointIds: ['ImpactAssessmentResults_TotalCFPCO2e'],
          },
        ],
      },
    },
  })
  console.log(`✅ Created project: ${project1.name}`)

  // Calculate completion percentage
  const totalFields = 162;
  const dataset1 = project1.dataset as any;
  const filledFieldsP1 = dataset1?.data_points?.filter((dp: any) => dp.value && dp.value.trim() !== '').length || 0;
  const completionP1 = Math.round((filledFieldsP1 / totalFields) * 100);

  // Create report for project 1
  const report1 = await prisma.report.create({
    data: {
      projectId: project1.id,
      templateCode: 'ISO14067',
      metadata: undefined,
      completion: completionP1,
    },
  })
  console.log(`   ✅ Added ISO14067 report (${filledFieldsP1}/${totalFields} fields = ${report1.completion}% complete)\n`)

  // Create sample project 2 (CBAM - Steel)
  console.log('📁 Creating sample project 2 (Steel)...')
  const project2 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Steel Components CBAM Report',
      status: 'ACTIVE',
      datasetVersion: 0,
      mailtoTemplates: defaultMailtoTemplates,
      dataset: createMockDataset('steel'),
      checklist: {
        items: [
          {
            id: 'cl1',
            title: 'Fill company information',
            completed: true,
            dataPointIds: ['ReportMetadata_OrganizationName'],
          },
          {
            id: 'cl2',
            title: 'Calculate total emissions',
            completed: false,
            dataPointIds: ['ImpactAssessmentResults_TotalCFPCO2e'],
          },
        ],
      },
    },
  })
  console.log(`✅ Created project: ${project2.name}`)

  const dataset2 = project2.dataset as any;
  const filledFieldsP2 = dataset2?.data_points?.filter((dp: any) => dp.value && dp.value.trim() !== '').length || 0;
  const completionP2 = Math.round((filledFieldsP2 / totalFields) * 100);

  const report2 = await prisma.report.create({
    data: {
      projectId: project2.id,
      templateCode: 'CBAM',
      metadata: undefined,
      completion: completionP2,
    },
  })
  console.log(`   ✅ Added CBAM report (${filledFieldsP2}/${totalFields} fields = ${report2.completion}% complete)\n`)

  // Create data request
  console.log('📧 Creating sample data request...')
  const dataRequest = await prisma.dataRequest.create({
    data: {
      userId: user.id,
      projectId: project1.id,
      contactId: contact1.id,
      dataPointId: 'LifeCycleInventoryInputs_EnergyInputType',
      externalAccess: false,
    },
  })
  console.log(`✅ Created data request to ${contact1.name}\n`)

  // ⏸️ Post-MVP: File upload feature
  // Create sample file
  // console.log('📎 Creating sample file...')
  // const file = await prisma.projectFile.create({
  //   data: {
  //     userId: user.id,
  //     projectId: project1.id,
  //     filename: 'material_specs.pdf',
  //     mimeType: 'application/pdf',
  //     size: 245760, // 240 KB
  //     linkedDataPoints: [FieldId.Material_Name, FieldId.Material_Amount],
  //     status: 'UPLOADED',
  //   },
  // })
  // console.log(`✅ Created file: ${file.filename}\n`)

  // Summary
  console.log('✨ Seeding completed!\n')
  console.log('📊 Summary:')
  console.log(`   Users: 1`)
  console.log(`   Contacts: 2`)
  console.log(`   Projects: 2`)
  console.log(`   Reports: 2`)
  console.log(`   Data Requests: 1`)
  console.log(`   Files: 1`)
  console.log('\n🚀 Database ready for development!\n')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
