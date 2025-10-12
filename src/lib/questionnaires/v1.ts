import { Questionnaire } from './types'

/**
 * Questionnaire v1.0
 * 
 * Initial questionnaire to help users quickly populate their project dataset.
 * 
 * User Story:
 * - New user creates a project
 * - System offers a guided questionnaire to gather basic info
 * - Answers automatically populate the dataset (JSONB)
 * - User can skip and enter data manually later
 * 
 * Purpose:
 * - Reduce friction for new users
 * - Provide structure for data collection
 * - Map common questions to standardized dataset fields
 * 
 * Questions cover:
 * - Product/service basics
 * - Materials and energy consumption
 * - Supply chain information
 * - Lifecycle considerations
 */
export const QuestionnaireV1: Questionnaire = {
  version: '1.0',
  name: 'Project Initialization Questionnaire',
  description: 'Quick setup questionnaire to populate your project dataset with initial information',
  
  questions: [
    {
      id: 'q1',
      text: 'What is the primary product or service you are assessing?',
      type: 'text',
      required: true,
      placeholder: 'e.g., Electric bicycle',
      hint: 'This will help us understand the focus of your carbon footprint assessment',
      mapsTo: ['product_name', 'assessment_subject']
    },
    {
      id: 'q2',
      text: 'What industry sector does this belong to?',
      type: 'select',
      required: true,
      options: [
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'energy', label: 'Energy & Utilities' },
        { value: 'agriculture', label: 'Agriculture & Food' },
        { value: 'transport', label: 'Transportation & Logistics' },
        { value: 'construction', label: 'Construction & Real Estate' },
        { value: 'services', label: 'Services' },
        { value: 'other', label: 'Other' }
      ],
      hint: 'Select the primary industry sector',
      mapsTo: ['industry_sector']
    },
    {
      id: 'q3',
      text: 'What are the main raw materials used?',
      type: 'multiselect',
      required: false,
      options: [
        { value: 'steel', label: 'Steel' },
        { value: 'aluminum', label: 'Aluminum' },
        { value: 'plastic', label: 'Plastic/Polymers' },
        { value: 'wood', label: 'Wood' },
        { value: 'concrete', label: 'Concrete' },
        { value: 'glass', label: 'Glass' },
        { value: 'textiles', label: 'Textiles' },
        { value: 'electronics', label: 'Electronics/Components' },
        { value: 'chemicals', label: 'Chemicals' },
        { value: 'other', label: 'Other' }
      ],
      hint: 'Select all that apply',
      mapsTo: ['raw_materials']
    },
    {
      id: 'q4',
      text: 'What is the total energy consumption during production (if known)?',
      type: 'number',
      required: false,
      placeholder: '0',
      hint: 'Enter in kWh. Leave blank if unknown.',
      mapsTo: ['energy_consumption_kwh']
    },
    {
      id: 'q5',
      text: 'What type of energy source is primarily used?',
      type: 'select',
      required: false,
      options: [
        { value: 'grid_mix', label: 'Grid Mix (Unknown composition)' },
        { value: 'renewable', label: 'Renewable (Solar/Wind/Hydro)' },
        { value: 'natural_gas', label: 'Natural Gas' },
        { value: 'coal', label: 'Coal' },
        { value: 'diesel', label: 'Diesel/Fuel Oil' },
        { value: 'mixed', label: 'Mixed Sources' },
        { value: 'unknown', label: 'Unknown' }
      ],
      hint: 'Primary energy source used in production',
      mapsTo: ['energy_source']
    },
    {
      id: 'q6',
      text: 'Do you have verified emissions data from your suppliers?',
      type: 'boolean',
      required: true,
      hint: 'Do your suppliers provide verified carbon footprint data for their materials?',
      mapsTo: ['supplier_data_verified']
    },
    {
      id: 'q7',
      text: 'What is the expected lifespan of the product?',
      type: 'number',
      required: false,
      placeholder: '0',
      hint: 'Enter in years. Leave blank if not applicable.',
      mapsTo: ['product_lifespan_years']
    },
    {
      id: 'q8',
      text: 'What happens to the product at end-of-life?',
      type: 'multiselect',
      required: false,
      options: [
        { value: 'recycling', label: 'Recycling' },
        { value: 'reuse', label: 'Reuse/Refurbishment' },
        { value: 'landfill', label: 'Landfill' },
        { value: 'incineration', label: 'Incineration (with energy recovery)' },
        { value: 'incineration_no_recovery', label: 'Incineration (no recovery)' },
        { value: 'unknown', label: 'Unknown' }
      ],
      hint: 'Select all applicable end-of-life scenarios',
      mapsTo: ['end_of_life_scenarios']
    },
    {
      id: 'q9',
      text: 'What is your primary goal for this assessment?',
      type: 'select',
      required: true,
      options: [
        { value: 'iso14067', label: 'ISO 14067 Certification' },
        { value: 'cbam', label: 'EU CBAM Compliance' },
        { value: 'internal', label: 'Internal Sustainability Reporting' },
        { value: 'customer', label: 'Customer Requirements' },
        { value: 'regulation', label: 'Regulatory Compliance' },
        { value: 'other', label: 'Other' }
      ],
      hint: 'This helps us suggest the appropriate report template',
      mapsTo: ['assessment_goal']
    },
    {
      id: 'q10',
      text: 'Any additional notes or context?',
      type: 'textarea',
      required: false,
      placeholder: 'e.g., Specific challenges, data gaps, timeline constraints...',
      hint: 'Optional: Provide any additional context that might be helpful',
      mapsTo: ['additional_notes']
    }
  ],
  
  mappingRules: {
    product_name: {
      field_id: 'general.product_name',
      transform: 'string'
    },
    assessment_subject: {
      field_id: 'general.assessment_subject',
      transform: 'string'
    },
    industry_sector: {
      field_id: 'general.industry_sector',
      transform: 'string'
    },
    raw_materials: {
      field_id: 'materials.raw_materials_list',
      transform: 'array'
    },
    energy_consumption_kwh: {
      field_id: 'energy.total_consumption_kwh',
      transform: 'number',
      defaultValue: 0
    },
    energy_source: {
      field_id: 'energy.primary_source',
      transform: 'string'
    },
    supplier_data_verified: {
      field_id: 'supply_chain.verified_data_available',
      transform: 'boolean',
      defaultValue: false
    },
    product_lifespan_years: {
      field_id: 'product.expected_lifespan_years',
      transform: 'number',
      defaultValue: null
    },
    end_of_life_scenarios: {
      field_id: 'end_of_life.scenarios',
      transform: 'array'
    },
    assessment_goal: {
      field_id: 'meta.assessment_purpose',
      transform: 'string'
    },
    additional_notes: {
      field_id: 'meta.notes',
      transform: 'string',
      defaultValue: ''
    }
  }
}
