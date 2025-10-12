import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Seed Report Templates
  console.log('📄 Seeding report templates...')

  const iso14067Template = await prisma.reportTemplate.upsert({
    where: { code: 'ISO14067' },
    update: {},
    create: {
      code: 'ISO14067',
      name: 'ISO 14067 Carbon Footprint Report',
      version: '1.0',
      metadata: {
        sections: [
          {
            id: 'general_info',
            title: 'General Information',
            fields: [
              { id: 'company_name', label: 'Company Name', type: 'text', required: true },
              { id: 'product_name', label: 'Product Name', type: 'text', required: true },
              { id: 'functional_unit', label: 'Functional Unit', type: 'text', required: true },
            ],
          },
          {
            id: 'system_boundary',
            title: 'System Boundary',
            fields: [
              { id: 'scope', label: 'Scope (Cradle-to-Gate, Cradle-to-Grave)', type: 'select', required: true },
              { id: 'lifecycle_stages', label: 'Lifecycle Stages Included', type: 'multiselect', required: true },
            ],
          },
          {
            id: 'calculation',
            title: 'GHG Calculation',
            fields: [
              { id: 'total_emissions', label: 'Total GHG Emissions (kg CO2e)', type: 'number', required: true },
              { id: 'breakdown', label: 'Emissions Breakdown by Stage', type: 'json', required: false },
            ],
          },
          {
            id: 'verification',
            title: 'Verification',
            fields: [
              { id: 'verified', label: 'Third-Party Verified', type: 'boolean', required: true },
              { id: 'verifier', label: 'Verification Body', type: 'text', required: false },
            ],
          },
        ],
        mailto_template: {
          subject: 'Request for ISO 14067 Data Point',
          body: 'Dear {{contact_name}},\n\nWe are preparing an ISO 14067 Carbon Footprint Report and need your assistance with the following data point:\n\n{{data_point_label}}\n\nPlease provide the information at your earliest convenience.\n\nBest regards,\n{{user_name}}',
        },
      },
    },
  })

  const cbamTemplate = await prisma.reportTemplate.upsert({
    where: { code: 'CBAM' },
    update: {},
    create: {
      code: 'CBAM',
      name: 'EU CBAM Declaration',
      version: '1.0',
      metadata: {
        sections: [
          {
            id: 'importer_info',
            title: 'Importer Information',
            fields: [
              { id: 'importer_name', label: 'Importer Name', type: 'text', required: true },
              { id: 'eori_number', label: 'EORI Number', type: 'text', required: true },
            ],
          },
          {
            id: 'goods_info',
            title: 'Goods Information',
            fields: [
              { id: 'cn_code', label: 'CN Code', type: 'text', required: true },
              { id: 'quantity', label: 'Quantity', type: 'number', required: true },
              { id: 'country_of_origin', label: 'Country of Origin', type: 'text', required: true },
            ],
          },
          {
            id: 'embedded_emissions',
            title: 'Embedded Emissions',
            fields: [
              { id: 'direct_emissions', label: 'Direct Emissions (t CO2e)', type: 'number', required: true },
              { id: 'indirect_emissions', label: 'Indirect Emissions (t CO2e)', type: 'number', required: true },
              { id: 'calculation_method', label: 'Calculation Method', type: 'select', required: true },
            ],
          },
        ],
        mailto_template: {
          subject: 'CBAM Data Request',
          body: 'Dear {{contact_name}},\n\nFor our EU CBAM declaration, we require the following information:\n\n{{data_point_label}}\n\nKindly provide this data by {{deadline}}.\n\nThank you,\n{{user_name}}',
        },
      },
    },
  })

  console.log(`✅ Created report templates: ${iso14067Template.code}, ${cbamTemplate.code}`)

  // Seed Questionnaire Registry
  console.log('📋 Seeding questionnaire registry...')

  const questionnaireV1 = await prisma.questionnaireRegistry.upsert({
    where: { version: '1.0' },
    update: {},
    create: {
      version: '1.0',
      active: true,
      rules: {
        questions: [
          {
            id: 'q1',
            text: 'What is the primary product you are assessing?',
            type: 'text',
            maps_to: ['product_name'],
          },
          {
            id: 'q2',
            text: 'What are the main raw materials used?',
            type: 'multiselect',
            options: ['Steel', 'Aluminum', 'Plastic', 'Wood', 'Other'],
            maps_to: ['raw_materials'],
          },
          {
            id: 'q3',
            text: 'What is the total energy consumption during production (kWh)?',
            type: 'number',
            maps_to: ['energy_consumption'],
          },
          {
            id: 'q4',
            text: 'Do you have verified emissions data from suppliers?',
            type: 'boolean',
            maps_to: ['supplier_data_verified'],
          },
          {
            id: 'q5',
            text: 'What is the expected lifespan of the product (years)?',
            type: 'number',
            maps_to: ['product_lifespan'],
          },
        ],
        mapping_rules: {
          // Example: How questionnaire answers map to dataset fields
          product_name: { field_id: 'general_info.product_name', transform: 'string' },
          raw_materials: { field_id: 'materials.raw_materials', transform: 'array' },
          energy_consumption: { field_id: 'calculation.energy', transform: 'number' },
          supplier_data_verified: { field_id: 'verification.supplier_verified', transform: 'boolean' },
          product_lifespan: { field_id: 'general_info.lifespan', transform: 'number' },
        },
      },
    },
  })

  console.log(`✅ Created questionnaire version: ${questionnaireV1.version}`)

  console.log('✨ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
