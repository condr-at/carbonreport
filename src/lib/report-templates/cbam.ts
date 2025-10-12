import { ReportTemplate } from './types'

/**
 * EU CBAM (Carbon Border Adjustment Mechanism) Declaration Template
 * 
 * EU regulation requiring importers to report embedded emissions in imported goods.
 * 
 * User Story:
 * - Importer fills out company and shipment details
 * - Provides information about goods being imported
 * - Calculates embedded emissions (direct + indirect)
 * - Submits quarterly declarations to EU authorities
 * 
 * Page Layout:
 * 1. Importer Information - Company details and EORI number
 * 2. Goods Information - CN codes, quantities, origin
 * 3. Embedded Emissions - Direct and indirect emissions calculations
 * 4. Supporting Documentation - Evidence and verification
 * 
 * Output: HTML report ready for CBAM registry submission
 */
export const CBAMTemplate: ReportTemplate = {
  code: 'CBAM',
  name: 'EU CBAM Declaration',
  version: '1.0',
  description: 'Carbon Border Adjustment Mechanism declaration for EU imports',
  
  sections: [
    {
      id: 'importer_info',
      title: 'Importer Information',
      description: 'Details about the importing company',
      fields: [
        {
          id: 'importer_name',
          label: 'Importer Company Name',
          type: 'text',
          required: true,
          placeholder: 'e.g., EU Imports GmbH',
          hint: 'Legal name of the company importing goods into the EU'
        },
        {
          id: 'eori_number',
          label: 'EORI Number',
          type: 'text',
          required: true,
          placeholder: 'e.g., DE123456789012',
          hint: 'Economic Operators Registration and Identification number',
          validation: {
            pattern: '^[A-Z]{2}[A-Z0-9]{1,15}$',
            message: 'Must be a valid EORI number (e.g., DE123456789012)'
          }
        },
        {
          id: 'contact_person',
          label: 'Contact Person',
          type: 'text',
          required: true,
          placeholder: 'Full name',
          hint: 'Person responsible for this CBAM declaration'
        },
        {
          id: 'contact_email',
          label: 'Contact Email',
          type: 'text',
          required: true,
          placeholder: 'email@company.com',
          hint: 'Email for correspondence regarding this declaration'
        }
      ]
    },
    {
      id: 'goods_info',
      title: 'Goods Information',
      description: 'Details about the imported goods',
      fields: [
        {
          id: 'cn_code',
          label: 'CN Code (Combined Nomenclature)',
          type: 'text',
          required: true,
          placeholder: 'e.g., 7208 10 00',
          hint: 'EU customs classification code for the goods',
          validation: {
            pattern: '^\\d{4}\\s?\\d{2}\\s?\\d{2}$',
            message: 'Must be an 8-digit CN code (e.g., 7208 10 00)'
          }
        },
        {
          id: 'goods_description',
          label: 'Description of Goods',
          type: 'textarea',
          required: true,
          placeholder: 'Detailed description of the imported goods...',
          hint: 'Detailed description matching the CN code'
        },
        {
          id: 'quantity',
          label: 'Quantity',
          type: 'number',
          required: true,
          placeholder: '0',
          hint: 'Amount of goods imported (in relevant unit)',
          validation: {
            min: 0,
            message: 'Quantity must be positive'
          }
        },
        {
          id: 'quantity_unit',
          label: 'Unit of Measurement',
          type: 'select',
          required: true,
          options: ['tonnes', 'kg', 'MWh', 'pieces', 'other'],
          hint: 'Unit used to measure the quantity'
        },
        {
          id: 'country_of_origin',
          label: 'Country of Origin',
          type: 'text',
          required: true,
          placeholder: 'e.g., China',
          hint: 'Country where the goods were produced'
        },
        {
          id: 'import_period',
          label: 'Import Period (Quarter)',
          type: 'select',
          required: true,
          options: ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'],
          hint: 'Quarterly reporting period for this declaration'
        }
      ]
    },
    {
      id: 'embedded_emissions',
      title: 'Embedded Emissions',
      description: 'Greenhouse gas emissions embedded in the imported goods',
      fields: [
        {
          id: 'direct_emissions',
          label: 'Direct Emissions (tonnes CO₂e)',
          type: 'number',
          required: true,
          placeholder: '0.00',
          hint: 'Scope 1 emissions from the production process',
          validation: {
            min: 0,
            message: 'Direct emissions cannot be negative'
          }
        },
        {
          id: 'indirect_emissions',
          label: 'Indirect Emissions (tonnes CO₂e)',
          type: 'number',
          required: true,
          placeholder: '0.00',
          hint: 'Scope 2 emissions from electricity and heat consumption',
          validation: {
            min: 0,
            message: 'Indirect emissions cannot be negative'
          }
        },
        {
          id: 'total_emissions',
          label: 'Total Specific Embedded Emissions (per unit)',
          type: 'number',
          required: true,
          placeholder: '0.00',
          hint: 'Total emissions per unit of goods (auto-calculated)',
          validation: {
            min: 0,
            message: 'Total emissions cannot be negative'
          }
        },
        {
          id: 'calculation_method',
          label: 'Emission Calculation Method',
          type: 'select',
          required: true,
          options: [
            'EU Default Values',
            'Actual Emissions (Verified)',
            'Installation-Specific Data',
            'Third-Party Database'
          ],
          hint: 'Method used to determine embedded emissions'
        },
        {
          id: 'carbon_price_paid',
          label: 'Carbon Price Paid in Country of Origin (€/tonne CO₂e)',
          type: 'number',
          required: false,
          placeholder: '0.00',
          hint: 'Any carbon price already paid in the country of origin (can be deducted)',
          validation: {
            min: 0,
            message: 'Carbon price cannot be negative'
          }
        }
      ]
    },
    {
      id: 'supporting_docs',
      title: 'Supporting Documentation',
      description: 'Evidence and verification of reported data',
      fields: [
        {
          id: 'verification_status',
          label: 'Verification Status',
          type: 'select',
          required: true,
          options: [
            'Not Verified',
            'Verification in Progress',
            'Verified by Accredited Body',
            'Self-Certified'
          ],
          hint: 'Current verification status of the emissions data'
        },
        {
          id: 'verifier_name',
          label: 'Verifier Name (if applicable)',
          type: 'text',
          required: false,
          placeholder: 'e.g., TÜV SÜD',
          hint: 'Name of the accredited verification body'
        },
        {
          id: 'data_sources',
          label: 'Data Sources',
          type: 'textarea',
          required: true,
          placeholder: 'List sources of emissions data...',
          hint: 'Document all sources used to determine emissions (producer declarations, databases, etc.)'
        },
        {
          id: 'notes',
          label: 'Additional Notes',
          type: 'textarea',
          required: false,
          placeholder: 'Any additional information...',
          hint: 'Any relevant additional information or clarifications'
        }
      ]
    }
  ],
  
  mailto: {
    subject: 'CBAM Data Request for EU Import Declaration',
    body: `Dear {{contact_name}},

We are preparing our EU CBAM (Carbon Border Adjustment Mechanism) declaration and require the following information from your facility:

**Data Point:** {{data_point_label}}

This data is mandatory for our quarterly CBAM reporting to EU customs authorities. We need verified emissions data for the goods we are importing.

Please provide this information by {{deadline}}.

If you need clarification on what data is required, please contact us immediately as CBAM reporting deadlines are strict.

Best regards,
{{user_name}}`
  }
}
