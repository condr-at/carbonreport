/** Our preparation/review profile, not the mandatory operator emissions report. */
export const PACKAGE_PROFILE_VERSION = 'cbam-supplier-review/1.0'

export type PackageValues = Record<string, string>
export interface EvidenceReference {
  id: string
  title: string
  reference: string
  version: string
  period: string
  owner: string
  disclosure: 'shareable' | 'restricted' | 'unknown'
}
export interface PackageField {
  id: string
  label: string
  group: 'context' | 'installation' | 'goods' | 'emissions' | 'evidence'
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'json'
  required: boolean
  hint: string
  options?: { value: string; label: string }[]
}
export interface PackageIssue {
  fieldId: string
  ruleId: string
  severity: 'error' | 'warning'
  message: string
  sourceRefs: string[]
}
export interface SupplierPackageValidation {
  values: PackageValues
  evidence: EvidenceReference[]
  issues: PackageIssue[]
  isReady: boolean
  coverage: 'partial' | 'full' | 'unknown'
  calculations: {
    massTonnes: number | null
    directLotEmissions: number | null
    indirectLotEmissions: number | null
  }
}

const basis = [
  { value: 'actual', label: 'Operator-reported actual data' },
  { value: 'default', label: 'Reported default values' },
  { value: 'mixed', label: 'Reported mix of actual and default values' },
]

export const PACKAGE_FIELDS: PackageField[] = [
  { id: 'cbam_pkg_recipient', label: 'Recipient', group: 'context', type: 'text', required: true, hint: 'Name the customer or reviewer receiving this preparation package.' },
  { id: 'cbam_pkg_prepared_by', label: 'Prepared by', group: 'context', type: 'text', required: true, hint: 'Person responsible for the supplied information.' },
  { id: 'cbam_pkg_supplier_role', label: 'Supplier role', group: 'context', type: 'select', required: true, hint: 'Keep the supplier and producing operator distinct.', options: [{ value: 'operator', label: 'Installation operator' }, { value: 'trader', label: 'Trader / supplier obtaining operator data' }] },
  { id: 'cbam_pkg_supplier_name', label: 'Supplier legal name', group: 'context', type: 'text', required: false, hint: 'Required for a trader. Identify the supplier separately from the producing operator.' },
  { id: 'cbam_pkg_production_year', label: 'Production year', group: 'context', type: 'number', required: true, hint: 'Definitive-period production year, 2026 or later. This is not a fiscal year.' },
  { id: 'cbam_pkg_coverage_start', label: 'Data coverage starts', group: 'context', type: 'date', required: true, hint: 'Actual first date covered by these values, within the production year.' },
  { id: 'cbam_pkg_coverage_end', label: 'Data coverage ends', group: 'context', type: 'date', required: true, hint: 'Actual last date covered, no later than today. Partial-year values remain provisional.' },
  { id: 'cbam_operator_name', label: 'Producing operator', group: 'installation', type: 'text', required: true, hint: 'Legal name of the installation operator.' },
  { id: 'cbam_operator_contact', label: 'Operator contact', group: 'installation', type: 'text', required: true, hint: 'Contact responsible for the emissions information.' },
  { id: 'cbam_installation_id', label: 'Installation identifier', group: 'installation', type: 'text', required: false, hint: 'Existing installation or registry identifier, if available; registration is not inferred.' },
  { id: 'cbam_installation_country', label: 'Installation country', group: 'installation', type: 'text', required: true, hint: 'Country where the goods are produced.' },
  { id: 'cbam_pkg_installation_name', label: 'Installation name', group: 'installation', type: 'text', required: true, hint: 'This profile covers one producing installation.' },
  { id: 'cbam_pkg_installation_address', label: 'Installation address', group: 'installation', type: 'textarea', required: true, hint: 'Physical location of the producing installation.' },
  { id: 'product_name', label: 'Product name', group: 'goods', type: 'text', required: true, hint: 'One product represented by this review package.' },
  { id: 'product_description', label: 'Product description', group: 'goods', type: 'textarea', required: false, hint: 'Product specification and production route, if known.' },
  { id: 'cbam_pkg_cn8', label: 'Reported CN code', group: 'goods', type: 'text', required: true, hint: 'Exactly eight digits. Syntax checking does not confirm legal scope or classification.' },
  { id: 'cbam_pkg_cn_review', label: 'CN classification review', group: 'goods', type: 'select', required: true, hint: 'A user-declared review status, not classification verified by this app.', options: [{ value: 'not_reviewed', label: 'Needs review' }, { value: 'declared_reviewed', label: 'Review declared by preparer' }] },
  { id: 'cbam_pkg_boundary', label: 'Process boundary and attribution', group: 'goods', type: 'textarea', required: true, hint: 'Describe the process, production route, outputs, attribution and period underlying the reported values. Reference the monitoring plan or operator report.' },
  { id: 'cbam_pkg_precursor_statement', label: 'Precursor treatment', group: 'goods', type: 'textarea', required: true, hint: 'Explain which relevant precursors are already included, or why none apply. No precursor amount is added by this app.' },
  { id: 'cbam_pkg_unit', label: 'Reported specific-emissions unit', group: 'emissions', type: 'select', required: true, hint: 'Only already reported tCO2e per tonne of goods is supported. No functional-unit conversion is performed.', options: [{ value: 'tCO2e/t_goods', label: 'tCO2e / t goods' }] },
  { id: 'cbam_pkg_direct_see', label: 'Reported direct embedded emissions', group: 'emissions', type: 'number', required: true, hint: 'tCO2e/t goods, including the relevant precursor contribution already attributed by the operator. Zero is valid; blank is unknown.' },
  { id: 'cbam_pkg_direct_basis', label: 'Direct data basis', group: 'emissions', type: 'select', required: true, hint: 'A stated basis, not a validated actual-emissions claim.', options: basis },
  { id: 'cbam_pkg_direct_source', label: 'Direct source evidence ID', group: 'emissions', type: 'text', required: true, hint: 'ID of a document in the evidence register supporting this reported value.' },
  { id: 'cbam_pkg_indirect_status', label: 'Indirect emissions treatment', group: 'emissions', type: 'select', required: true, hint: 'Indirect applicability depends on the goods. Not applicable is distinct from zero or unknown.', options: [{ value: 'reported', label: 'Reported separately' }, { value: 'not_applicable', label: 'Declared not applicable' }, { value: 'unknown', label: 'Needs determination' }] },
  { id: 'cbam_pkg_indirect_see', label: 'Reported indirect embedded emissions', group: 'emissions', type: 'number', required: false, hint: 'Required when indirect emissions are reported; tCO2e/t goods, including relevant precursors. Never added to direct emissions by this app.' },
  { id: 'cbam_pkg_indirect_basis', label: 'Indirect data basis', group: 'emissions', type: 'select', required: false, hint: 'Required when indirect emissions are reported.', options: basis },
  { id: 'cbam_pkg_indirect_source', label: 'Indirect source evidence ID', group: 'emissions', type: 'text', required: false, hint: 'Required when reported; must identify an entry in the evidence register.' },
  { id: 'cbam_pkg_indirect_rationale', label: 'Indirect applicability rationale', group: 'emissions', type: 'textarea', required: false, hint: 'Required if declared not applicable. State the goods-specific reason and reference for reviewer confirmation.' },
  { id: 'cbam_pkg_default_context', label: 'Default-value provenance', group: 'evidence', type: 'json', required: false, hint: 'Required for each default/mixed component. JSON array: [{"component":"direct","sourceId":"default-1","version":"2026 corrected","row":"country / CN / year / table row","markup":"already included: ..."}]. Use indirect for that component. Record the exact row, version and markup treatment; no default is selected automatically.' },
  { id: 'cbam_pkg_lot_mass_tonnes', label: 'Optional lot net mass', group: 'goods', type: 'number', required: false, hint: 'Tonnes of the named goods. Used only for indicative, separate mass × reported SEE calculations.' },
  { id: 'cbam_pkg_verification_status', label: 'Verification evidence status', group: 'evidence', type: 'select', required: true, hint: 'The app never verifies emissions or checks accreditation.', options: [{ value: 'not_verified', label: 'No verification declared' }, { value: 'declared_verified', label: 'Verification declared; evidence supplied' }] },
  { id: 'cbam_pkg_verifier', label: 'Declared verifier', group: 'evidence', type: 'text', required: false, hint: 'Required if verification is declared. Identify the verifier and accreditation reference/scope.' },
  { id: 'cbam_pkg_verification_source', label: 'Verification evidence ID', group: 'evidence', type: 'text', required: false, hint: 'Required if verification is declared. Reference the report covering the installation, production period and goods.' },
  { id: 'cbam_pkg_evidence_json', label: 'Evidence register', group: 'evidence', type: 'json', required: true, hint: 'JSON array of {id,title,reference,version,period,owner,disclosure}. Disclosure is shareable, restricted or unknown. References are not uploaded or verified by this app.' },
]

const FIELD_IDS = new Set(PACKAGE_FIELDS.map((field) => field.id))
const UNKNOWN_VALUES = new Set(['unknown', 'n/a', 'na', 'tbd', 'not known', 'not available', 'null', 'undefined'])
const METHOD_REFS = ['TR25', 'TR26']

/** Inactive draft inputs are retained, but are not assertions in this package. */
export function isPackageFieldActive(fieldId: string, values: PackageValues): boolean {
  if (!FIELD_IDS.has(fieldId)) return false
  const value = (id: string) => values[id]?.trim() ?? ''
  if (fieldId === 'cbam_pkg_supplier_name') return value('cbam_pkg_supplier_role') === 'trader'
  if (['cbam_pkg_indirect_see', 'cbam_pkg_indirect_basis', 'cbam_pkg_indirect_source'].includes(fieldId)) {
    return value('cbam_pkg_indirect_status') === 'reported'
  }
  if (fieldId === 'cbam_pkg_indirect_rationale') return value('cbam_pkg_indirect_status') === 'not_applicable'
  if (fieldId === 'cbam_pkg_default_context') {
    return ['default', 'mixed'].includes(value('cbam_pkg_direct_basis')) ||
      (value('cbam_pkg_indirect_status') === 'reported' && ['default', 'mixed'].includes(value('cbam_pkg_indirect_basis')))
  }
  if (['cbam_pkg_verifier', 'cbam_pkg_verification_source'].includes(fieldId)) {
    return value('cbam_pkg_verification_status') === 'declared_verified'
  }
  return true
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function getPoints(dataset: unknown): unknown[] {
  return isRecord(dataset) && Array.isArray(dataset.data_points) ? dataset.data_points : []
}

function packagePoints(dataset: unknown): Map<string, Record<string, unknown>[]> {
  const result = new Map<string, Record<string, unknown>[]>()
  for (const point of getPoints(dataset)) {
    if (!isRecord(point) || typeof point.field_id !== 'string' || !FIELD_IDS.has(point.field_id)) continue
    result.set(point.field_id, [...(result.get(point.field_id) ?? []), point])
  }
  return result
}

/** Never choose silently between duplicate or repeatable values for a scalar field. */
export function extractPackageValues(dataset: unknown): PackageValues {
  const points = packagePoints(dataset)
  return Object.fromEntries(PACKAGE_FIELDS.map(({ id }) => {
    const matches = points.get(id) ?? []
    const point = matches[0]
    const value = matches.length === 1 && point.item_id == null && typeof point.value === 'string'
      ? point.value : ''
    return [id, value]
  }))
}

/** Allow invalid draft strings, but never alter unrelated dataset content. */
export function mergePackageValues(
  dataset: unknown,
  values: PackageValues,
): Record<string, unknown> & { data_points: unknown[] } {
  if (dataset != null && !isRecord(dataset)) throw new Error('Dataset must be an object.')
  if (isRecord(dataset) && dataset.data_points !== undefined && !Array.isArray(dataset.data_points)) {
    throw new Error('Dataset data_points must be an array.')
  }
  if (!isRecord(values)) throw new Error('Package values must be an object of strings.')
  for (const [id, value] of Object.entries(values)) {
    if (!FIELD_IDS.has(id)) throw new Error(`Unknown package field: ${id}`)
    if (typeof value !== 'string') throw new Error(`Package field must be a string: ${id}`)
  }
  for (const [id, points] of packagePoints(dataset)) {
    if (points.length > 1 || points[0].item_id != null) {
      throw new Error(`Ambiguous scalar package field: ${id}`)
    }
  }
  const pending = new Map(Object.entries(values))
  const points = getPoints(dataset).map((point) => {
    if (!isRecord(point) || typeof point.field_id !== 'string' || !pending.has(point.field_id)) return point
    const value = pending.get(point.field_id)!
    pending.delete(point.field_id)
    return { ...point, value }
  })
  for (const [field_id, value] of pending) points.push({ field_id, item_id: null, value })
  return { ...(isRecord(dataset) ? dataset : {}), data_points: points }
}

function known(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !UNKNOWN_VALUES.has(value.trim().toLowerCase())
}

function dateValue(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value ? value : null
}

function nonNegativeNumber(value: string): number | null {
  // Reject empty strings, hexadecimal, separators, Infinity and silent coercion.
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

export function validateSupplierPackage(
  dataset: unknown,
  options: { now?: Date } = {},
): SupplierPackageValidation {
  const values = extractPackageValues(dataset)
  const text = (id: string) => values[id]?.trim() ?? ''
  const issues: PackageIssue[] = []
  const issue = (
    fieldId: string, ruleId: string, severity: PackageIssue['severity'], message: string,
    sourceRefs: string[] = METHOD_REFS,
  ) => { issues.push({ fieldId, ruleId, severity, message, sourceRefs }) }
  const error = (id: string, rule: string, message: string, refs?: string[]) => issue(id, rule, 'error', message, refs)
  const warning = (id: string, rule: string, message: string, refs?: string[]) => issue(id, rule, 'warning', message, refs)
  const requireValue = (id: string, label: string) => {
    if (!known(text(id))) error(id, 'REQUIRED_VALUE', `${label} is required; unknown is not zero.`)
  }

  if ((dataset != null && !isRecord(dataset)) ||
      (isRecord(dataset) && dataset.data_points !== undefined && !Array.isArray(dataset.data_points))) {
    error('_dataset', 'INVALID_DATASET', 'Dataset must be an object with a data_points array.', [])
  }
  for (const [id, points] of packagePoints(dataset)) {
    if (points.length > 1 || points[0].item_id != null) {
      error(id, 'AMBIGUOUS_SCALAR', 'Resolve duplicate or repeatable values before using this scalar package field.', [])
    } else if (typeof points[0].value !== 'string') {
      error(id, 'INVALID_VALUE_TYPE', 'Package field values must be strings.', [])
    }
  }
  for (const field of PACKAGE_FIELDS) {
    if (!isPackageFieldActive(field.id, values)) continue
    if (field.required) requireValue(field.id, field.label)
    if (known(text(field.id)) && field.options && !field.options.some((option) => option.value === text(field.id))) {
      error(field.id, field.id === 'cbam_pkg_unit' ? 'UNSUPPORTED_UNIT' : 'INVALID_OPTION',
        `${field.label} has an unsupported value.`)
    }
  }
  if (text('cbam_pkg_supplier_role') === 'trader') requireValue('cbam_pkg_supplier_name', 'Supplier legal name')

  const now = options.now ?? new Date()
  const validNow = Number.isFinite(now.getTime())
  const today = validNow ? now.toISOString().slice(0, 10) : null
  if (!validNow) error('_context', 'INVALID_NOW', 'The validation date is invalid.', [])
  const rawYear = text('cbam_pkg_production_year')
  const year = /^\d{4}$/.test(rawYear) ? Number(rawYear) : NaN
  const validYear = Number.isInteger(year) && year >= 2026 && today !== null && year <= Number(today.slice(0, 4))
  if (known(rawYear) && !validYear) {
    error('cbam_pkg_production_year', 'PRODUCTION_YEAR', 'Use a definitive production year from 2026 through the current year.')
  }
  const start = dateValue(text('cbam_pkg_coverage_start'))
  const end = dateValue(text('cbam_pkg_coverage_end'))
  for (const [id, value] of [['cbam_pkg_coverage_start', start], ['cbam_pkg_coverage_end', end]] as const) {
    if (known(text(id)) && !value) error(id, 'INVALID_DATE', 'Use a real calendar date in YYYY-MM-DD format.')
    if (value && today && value > today) error(id, 'FUTURE_COVERAGE', 'Coverage must describe actual dates no later than today.')
    if (value && validYear && Number(value.slice(0, 4)) !== year) error(id, 'COVERAGE_YEAR', 'Coverage dates must be within the stated production year.')
  }
  if (start && end && start > end) error('cbam_pkg_coverage_end', 'DATE_ORDER', 'Coverage end must not precede coverage start.')
  let coverage: SupplierPackageValidation['coverage'] = 'unknown'
  if (validYear && start && end && today && start <= end && end <= today &&
      start.startsWith(`${year}-`) && end.startsWith(`${year}-`)) {
    coverage = start === `${year}-01-01` && end === `${year}-12-31` ? 'full' : 'partial'
    if (coverage === 'partial') warning('cbam_pkg_coverage_end', 'PARTIAL_YEAR',
      'Partial-year / YTD data are provisional. Do not represent these values as a completed annual operator report.')
  }

  if (known(text('cbam_pkg_cn8')) && !/^\d{8}$/.test(text('cbam_pkg_cn8'))) {
    error('cbam_pkg_cn8', 'CN8_FORMAT', 'Enter exactly eight digits; HS6 and formatted codes are not supported.')
  }
  if (text('cbam_pkg_cn_review') === 'not_reviewed') warning('cbam_pkg_cn_review', 'CN_REVIEW',
    'A reviewer must confirm classification and goods-specific CBAM scope. Eight digits alone do not establish applicability.', ['TR01', 'TR25'])

  const number = (id: string): number | null => {
    const raw = text(id)
    if (!raw) return null
    const parsed = nonNegativeNumber(raw)
    if (parsed === null) error(id, 'INVALID_NUMBER', 'Use a finite, non-negative number with a decimal point; blank is unknown.')
    return parsed
  }
  const direct = number('cbam_pkg_direct_see')
  const mass = number('cbam_pkg_lot_mass_tonnes')
  let indirect: number | null = null
  const indirectStatus = text('cbam_pkg_indirect_status')
  if (indirectStatus === 'reported') {
    requireValue('cbam_pkg_indirect_see', 'Reported indirect emissions')
    requireValue('cbam_pkg_indirect_basis', 'Indirect data basis')
    requireValue('cbam_pkg_indirect_source', 'Indirect source evidence ID')
    indirect = number('cbam_pkg_indirect_see')
  } else if (indirectStatus === 'not_applicable') {
    requireValue('cbam_pkg_indirect_rationale', 'Indirect applicability rationale')
    warning('cbam_pkg_indirect_status', 'INDIRECT_SCOPE_REVIEW',
      'The stated exclusion of indirect emissions needs goods-specific review; the app has not confirmed Annex II applicability.')
  } else if (indirectStatus === 'unknown') {
    error('cbam_pkg_indirect_status', 'INDIRECT_UNKNOWN', 'Determine whether indirect emissions are reported or explain why they do not apply.')
  }
  const evidence: EvidenceReference[] = []
  const ids = new Set<string>()
  if (text('cbam_pkg_evidence_json')) {
    try {
      const parsed: unknown = JSON.parse(text('cbam_pkg_evidence_json'))
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('empty')
      for (const candidate of parsed) {
        if (!isRecord(candidate) || !['id', 'title', 'reference', 'version', 'period', 'owner'].every((key) => known(candidate[key])) ||
            !['shareable', 'restricted', 'unknown'].includes(String(candidate.disclosure))) {
          error('cbam_pkg_evidence_json', 'INVALID_EVIDENCE', 'Each evidence entry needs id, title, reference, version, period, owner and a supported disclosure status.')
          continue
        }
        const entry = Object.fromEntries(['id', 'title', 'reference', 'version', 'period', 'owner', 'disclosure']
          .map((key) => [key, (candidate[key] as string).trim()])) as unknown as EvidenceReference
        if (ids.has(entry.id)) error('cbam_pkg_evidence_json', 'DUPLICATE_EVIDENCE_ID', `Evidence ID is not unique: ${entry.id}`)
        ids.add(entry.id)
        evidence.push(entry)
        if (entry.disclosure !== 'shareable') warning('cbam_pkg_evidence_json', 'DISCLOSURE_REVIEW',
          `Confirm permission before sharing referenced material ${entry.id}; its disclosure status is ${entry.disclosure}.`, ['TR07', 'TR25'])
      }
    } catch {
      error('cbam_pkg_evidence_json', 'INVALID_EVIDENCE_JSON', 'Provide a non-empty JSON array of evidence references.')
    }
  }
  const evidenceLink = (id: string) => {
    if (known(text(id)) && !ids.has(text(id))) error(id, 'MISSING_EVIDENCE_REFERENCE', 'This source ID does not identify a valid evidence entry.')
  }
  evidenceLink('cbam_pkg_direct_source')
  if (indirectStatus === 'reported') evidenceLink('cbam_pkg_indirect_source')

  const neededDefaults = (['direct', 'indirect'] as const).filter((component) =>
    (component === 'direct' || indirectStatus === 'reported') && ['default', 'mixed'].includes(text(`cbam_pkg_${component}_basis`)))
  if (neededDefaults.length > 0) {
    try {
      const contexts: unknown = JSON.parse(text('cbam_pkg_default_context'))
      if (!Array.isArray(contexts)) throw new Error('array')
      for (const component of neededDefaults) {
        const matching = contexts.filter((entry) => isRecord(entry) && entry.component === component)
        if (matching.length === 0) error('cbam_pkg_default_context', 'DEFAULT_PROVENANCE',
          `Record default provenance for ${component}: sourceId, exact version, row and markup treatment.`, ['TR26', 'TR27'])
        for (const entry of matching) {
          if (!isRecord(entry) || !['sourceId', 'version', 'row', 'markup'].every((key) => known(entry[key]))) {
            error('cbam_pkg_default_context', 'DEFAULT_PROVENANCE', 'Every default context needs a source ID, exact version, row and markup treatment.', ['TR26', 'TR27'])
          } else if (!ids.has((entry.sourceId as string).trim())) {
            error('cbam_pkg_default_context', 'DEFAULT_SOURCE_REFERENCE', 'Default sourceId must identify a valid evidence entry.', ['TR26', 'TR27'])
          }
        }
      }
    } catch {
      error('cbam_pkg_default_context', 'DEFAULT_PROVENANCE', 'Default/mixed data require a JSON array recording the exact source, version, row and markup treatment.', ['TR26', 'TR27'])
    }
    warning('cbam_pkg_default_context', 'DEFAULT_REVIEW', 'Default values and markup are stated inputs. Confirm the applicable country, CN code, year and corrected table; no default is selected or adjusted by the app.', ['TR26', 'TR27'])
  }

  if (text('cbam_pkg_verification_status') === 'declared_verified') {
    requireValue('cbam_pkg_verifier', 'Declared verifier')
    requireValue('cbam_pkg_verification_source', 'Verification evidence ID')
    evidenceLink('cbam_pkg_verification_source')
    warning('cbam_pkg_verification_status', 'DECLARED_VERIFICATION_ONLY',
      'Verification is declared by the preparer. Confirm accreditation, sector, period, installation and report scope independently; this app does not verify them.')
  } else if (text('cbam_pkg_verification_status') === 'not_verified') {
    warning('cbam_pkg_verification_status', 'UNVERIFIED_DATA',
      'Data have not been declared verified. Actual values require appropriate accredited verification for regulatory use; this package can be ready for review only.')
  }
  warning('_package', 'REVIEW_ONLY',
    'This is a preparation/review package, not the mandatory operator emissions report, a CBAM declaration, a verification statement or confirmation of legal readiness.')

  const isReady = !issues.some((entry) => entry.severity === 'error')
  const multiply = (component: number | null, fieldId: string): number | null => {
    if (!isReady || mass === null || component === null) return null
    const product = mass * component
    if (!Number.isFinite(product)) {
      error(fieldId, 'CALCULATION_OVERFLOW', 'Indicative lot emissions exceed the supported finite numeric range.', [])
      return null
    }
    return product
  }
  const directLotEmissions = multiply(direct, 'cbam_pkg_direct_see')
  const indirectLotEmissions = multiply(indirect, 'cbam_pkg_indirect_see')
  const finalReady = !issues.some((entry) => entry.severity === 'error')
  return {
    values, evidence, issues, isReady: finalReady, coverage,
    calculations: {
      massTonnes: mass,
      directLotEmissions: finalReady ? directLotEmissions : null,
      indirectLotEmissions: finalReady ? indirectLotEmissions : null,
    },
  }
}
