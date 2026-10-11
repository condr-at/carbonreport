import { PACKAGE_FIELDS, PACKAGE_PROFILE_VERSION } from '@/lib/cbam/supplier-package'
import type { ReportTemplate } from './types'

const groups = [
  ['context', 'Recipient and reporting period'],
  ['installation', 'Producing installation'],
  ['goods', 'Goods and boundaries'],
  ['emissions', 'Reported emissions'],
  ['evidence', 'Evidence and review'],
] as const

/** A preparation profile; legacy stored data stays in the shared dataset. */
export const CBAMSupplierPackageTemplate: ReportTemplate = {
  code: 'CBAM_DATA_PACKAGE',
  name: 'CBAM Supplier Review Package',
  description: 'Prepare one product and installation for recipient review; download a data and evidence-reference package.',
  version: PACKAGE_PROFILE_VERSION,
  scope: 'product',
  sections: groups.map(([key, title]) => ({
    key, title, blockComponent: 'default',
    fields: PACKAGE_FIELDS.filter(field => field.group === key).map(field => ({
      fieldId: field.id, isRequired: field.required,
    })),
  })),
}
