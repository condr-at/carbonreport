import { ReportTemplate } from './types'

/**
 * ISO 14067 Carbon Footprint Report Template
 * 
 * International standard for quantifying and reporting the carbon footprint of products.
 * 
 * User Story:
 * - User fills out general information about their product
 * - Defines system boundaries (cradle-to-gate, cradle-to-grave)
 * - Calculates GHG emissions across lifecycle stages
 * - Optionally gets third-party verification
 * 
 * Page Layout:
 * 1. General Information - Company and product details
 * 2. System Boundary - Scope definition
 * 3. GHG Calculation - Emissions data
 * 4. Verification - Third-party validation
 * 
 * Output: HTML report with all sections, exportable to PDF
 */
export const ISO14067Template: ReportTemplate = {
  code: 'ISO14067',
  name: 'ISO 14067 Carbon Footprint Report',
  version: '1.0',
  description: 'International standard for quantifying the carbon footprint of products',
  
  sections: [
    {
      id: 'general_info',
      title: 'General Information',
      description: 'Basic information about your company and product',
      fields: [
        {
          id: 'company_name',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., Green Manufacturing Ltd.',
          hint: 'Legal name of the organization conducting the assessment'
        },
        {
          id: 'product_name',
          label: 'Product Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., Eco-Friendly Widget',
          hint: 'Name of the product being assessed'
        },
        {
          id: 'functional_unit',
          label: 'Functional Unit',
          type: 'text',
          required: true,
          placeholder: 'e.g., 1 kg of product',
          hint: 'Quantified performance of the product system for use as a reference unit'
        },
        {
          id: 'assessment_date',
          label: 'Assessment Date',
          type: 'date',
          required: true,
          hint: 'Date when the assessment was completed'
        }
      ]
    },
    {
      id: 'system_boundary',
      title: 'System Boundary',
      description: 'Define the scope and lifecycle stages included in the assessment',
      fields: [
        {
          id: 'scope',
          label: 'Assessment Scope',
          type: 'select',
          required: true,
          options: ['Cradle-to-Gate', 'Cradle-to-Grave', 'Gate-to-Gate', 'Cradle-to-Cradle'],
          hint: 'Defines which lifecycle stages are included'
        },
        {
          id: 'lifecycle_stages',
          label: 'Lifecycle Stages Included',
          type: 'multiselect',
          required: true,
          options: [
            'Raw Material Extraction',
            'Manufacturing',
            'Transportation',
            'Use Phase',
            'End-of-Life'
          ],
          hint: 'Select all stages included in the assessment'
        },
        {
          id: 'exclusions',
          label: 'Exclusions and Justification',
          type: 'textarea',
          required: false,
          placeholder: 'Describe any excluded processes and reasons...',
          hint: 'Document any processes or stages excluded from the assessment'
        }
      ]
    },
    {
      id: 'ghg_calculation',
      title: 'GHG Emissions Calculation',
      description: 'Total greenhouse gas emissions quantification',
      fields: [
        {
          id: 'total_emissions',
          label: 'Total GHG Emissions (kg CO₂e)',
          type: 'number',
          required: true,
          placeholder: '0.00',
          hint: 'Total carbon footprint in kilograms of CO₂ equivalent',
          validation: {
            min: 0,
            message: 'Emissions cannot be negative'
          }
        },
        {
          id: 'emissions_breakdown',
          label: 'Emissions Breakdown by Lifecycle Stage',
          type: 'json',
          required: false,
          hint: 'Detailed breakdown of emissions per lifecycle stage (auto-calculated from dataset)'
        },
        {
          id: 'calculation_method',
          label: 'Calculation Methodology',
          type: 'select',
          required: true,
          options: [
            'GHG Protocol Product Standard',
            'PAS 2050',
            'ISO 14044',
            'Other'
          ],
          hint: 'Standard or methodology used for calculations'
        }
      ]
    },
    {
      id: 'verification',
      title: 'Verification',
      description: 'Third-party verification details (optional)',
      fields: [
        {
          id: 'verified',
          label: 'Third-Party Verified',
          type: 'boolean',
          required: true,
          defaultValue: false,
          hint: 'Has this report been verified by an independent third party?'
        },
        {
          id: 'verifier_name',
          label: 'Verification Body Name',
          type: 'text',
          required: false,
          placeholder: 'e.g., Carbon Trust',
          hint: 'Name of the organization that conducted the verification'
        },
        {
          id: 'verification_date',
          label: 'Verification Date',
          type: 'date',
          required: false,
          hint: 'Date when verification was completed'
        },
        {
          id: 'verification_statement',
          label: 'Verification Statement',
          type: 'textarea',
          required: false,
          placeholder: 'Summary of verification findings...',
          hint: 'Key findings or conclusions from the verification process'
        }
      ]
    }
  ],
  
  mailto: {
    subject: 'Request for ISO 14067 Carbon Footprint Data',
    body: `Dear {{contact_name}},

We are currently preparing an ISO 14067 Carbon Footprint Report for our product and require your assistance with the following data point:

**Data Point:** {{data_point_label}}

This information is essential for accurately quantifying the greenhouse gas emissions associated with our product lifecycle.

Could you please provide this information by {{deadline}}?

If you have any questions or need clarification, please don't hesitate to reach out.

Best regards,
{{user_name}}`
  }
}
