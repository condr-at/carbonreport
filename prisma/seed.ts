/**
 * Database Seed Script
 * 
 * Seeds the database with sample data for development.
 * Includes proper initialization of:
 * - Empty dataset structure
 * - Default mailto templates
 * - datasetVersion counter
 */

import { PrismaClient } from '@prisma/client'
import { FieldId } from '../src/lib/field-ids'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // Clean existing data (dev only!)
  console.log('🧹 Cleaning existing data...')
  await prisma.dataRequest.deleteMany()
  await prisma.projectFile.deleteMany()
  await prisma.report.deleteMany()
  await prisma.project.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Cleaned\n')

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

  // Default mailto templates
  const defaultMailtoTemplates = {
    [FieldId.Product_Name]: `Hi {contact_name},

We are preparing a carbon footprint assessment for our project "{project_name}" and need your input.

Could you please provide the following information:
- {field_label}

This information is needed for our ISO 14067 compliance report.

Best regards,
{user_name}`,

    [FieldId.Material_Name]: `Dear {contact_name},

For our carbon footprint assessment of "{project_name}", we require detailed information about materials.

Please provide:
- {field_label}
- Quantities and units
- Supplier information

Thank you for your cooperation.

{user_name}`,

    [FieldId.Energy_Consumption_Total]: `Hi {contact_name},

We need energy consumption data for "{project_name}" carbon assessment.

Required data:
- {field_label}
- Time period: Full production cycle
- Units: kWh or MWh

Deadline: {deadline}

Thanks,
{user_name}`,

    [FieldId.Transport_Distance_Air]: `Hello {contact_name},

For our CBAM reporting requirements on "{project_name}", please provide:

- {field_label}
- Transport mode details
- Emission factors if available

Best,
{user_name}`,
  }

  // Create sample project 1 (ISO 14067)
  console.log('📁 Creating sample project 1...')
  const project1 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Electric Bicycle Carbon Assessment',
      status: 'ACTIVE',
      datasetVersion: 0,
      mailtoTemplates: defaultMailtoTemplates,
      dataset: {
        data_points: [
          {
            field_id: FieldId.Product_Name,
            item_id: null,
            value: 'E-Bike Model X Pro',
          },
          {
            field_id: FieldId.Product_Description,
            item_id: null,
            value: 'Electric bicycle with 750W motor and lithium battery',
          },
          {
            field_id: FieldId.Product_Weight,
            item_id: null,
            value: '25',
          },
          {
            field_id: FieldId.Material_Name,
            item_id: '1',
            value: 'Aluminum Frame',
          },
          {
            field_id: FieldId.Material_Amount,
            item_id: '1',
            value: '8.5',
          },
          {
            field_id: FieldId.Material_Name,
            item_id: '2',
            value: 'Lithium Battery',
          },
          {
            field_id: FieldId.Material_Amount,
            item_id: '2',
            value: '2.5',
          },
        ],
      },
      checklist: {
        items: [
          {
            id: 'cl1',
            title: 'Gather product specifications',
            completed: true,
            dataPointIds: [FieldId.Product_Name, FieldId.Product_Weight],
          },
          {
            id: 'cl2',
            title: 'Collect material data',
            completed: false,
            dataPointIds: [FieldId.Material_Name, FieldId.Material_Amount],
          },
          {
            id: 'cl3',
            title: 'Request energy consumption data',
            completed: false,
            dataPointIds: [FieldId.Energy_Consumption_Total],
          },
        ],
      },
    },
  })
  console.log(`✅ Created project: ${project1.name}`)

  // Create report for project 1
  const report1 = await prisma.report.create({
    data: {
      projectId: project1.id,
      templateCode: 'ISO14067',
      metadata: undefined, // No custom settings yet
      completion: 33.3, // 3 out of 9 fields filled
    },
  })
  console.log(`   ✅ Added ISO14067 report (${report1.completion}% complete)\n`)

  // Create sample project 2 (CBAM)
  console.log('📁 Creating sample project 2...')
  const project2 = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'Steel Components CBAM Report',
      status: 'ACTIVE',
      datasetVersion: 0,
      mailtoTemplates: defaultMailtoTemplates,
      dataset: {
        data_points: [
          {
            field_id: FieldId.Product_Name,
            item_id: null,
            value: 'Steel Beam 200x100',
          },
          {
            field_id: FieldId.Company_Name,
            item_id: null,
            value: 'Steel Manufacturing Ltd',
          },
        ],
      },
      checklist: {
        items: [
          {
            id: 'cl1',
            title: 'Fill company information',
            completed: true,
            dataPointIds: [FieldId.Company_Name],
          },
          {
            id: 'cl2',
            title: 'Calculate total emissions',
            completed: false,
            dataPointIds: [FieldId.Emission_Total_CBAM],
          },
        ],
      },
    },
  })
  console.log(`✅ Created project: ${project2.name}`)

  const report2 = await prisma.report.create({
    data: {
      projectId: project2.id,
      templateCode: 'CBAM',
      metadata: undefined,
      completion: 15.0,
    },
  })
  console.log(`   ✅ Added CBAM report (${report2.completion}% complete)\n`)

  // Create data request
  console.log('📧 Creating sample data request...')
  const dataRequest = await prisma.dataRequest.create({
    data: {
      userId: user.id,
      projectId: project1.id,
      contactId: contact1.id,
      dataPointId: FieldId.Energy_Consumption_Total,
      externalAccess: false,
    },
  })
  console.log(`✅ Created data request to ${contact1.name}\n`)

  // Create sample file
  console.log('📎 Creating sample file...')
  const file = await prisma.projectFile.create({
    data: {
      userId: user.id,
      projectId: project1.id,
      filename: 'material_specs.pdf',
      mimeType: 'application/pdf',
      size: 245760, // 240 KB
      linkedDataPoints: [FieldId.Material_Name, FieldId.Material_Amount],
      status: 'UPLOADED',
    },
  })
  console.log(`✅ Created file: ${file.filename}\n`)

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
