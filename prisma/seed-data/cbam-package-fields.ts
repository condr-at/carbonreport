import { PACKAGE_FIELDS } from '../../src/lib/cbam/supplier-package'
import type { DatasetFieldSeed } from './dataset-fields'

// Only new IDs. Existing shared field definitions retain their established metadata.
export const CBAM_PACKAGE_FIELD_SEED: DatasetFieldSeed[] = PACKAGE_FIELDS
  .filter(field => field.id.startsWith('cbam_pkg_'))
  .map((field, index) => ({
    fieldId: field.id,
    label: field.label,
    hint: field.hint,
    type: field.type === 'number' || field.type === 'date' || field.type === 'select' ? field.type : 'text',
    dataType: field.type,
    scope: 'product',
    options: field.options?.map(option => ({ value: option.value, label: option.label })) ?? undefined,
    isRepeatable: false,
    isRequired: false,
    sortOrder: 6000 + index * 10,
  }))
