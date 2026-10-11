import assert from 'node:assert/strict'
import test from 'node:test'
import {
  PACKAGE_FIELDS,
  PACKAGE_PROFILE_VERSION,
  extractPackageValues,
  isPackageFieldActive,
  mergePackageValues,
  validateSupplierPackage,
  type PackageValues,
} from './supplier-package'

const NOW = new Date('2026-10-11T12:00:00Z')
const EVIDENCE = [{
  id: 'operator-1', title: 'Operator production and emissions working paper',
  reference: 'Operator document OPS-2026-Q3', version: '2026-10-01 revision 1',
  period: '2026-01-01 through 2026-09-30', owner: 'Example Steel Ltd', disclosure: 'shareable',
}]

// Synthetic review data: no assertion that this CN/product combination is in scope.
function readyValues(overrides: PackageValues = {}): PackageValues {
  return {
    cbam_pkg_recipient: 'Example customer reviewer', cbam_pkg_prepared_by: 'Alex Preparer',
    cbam_pkg_supplier_role: 'operator', cbam_pkg_production_year: '2026',
    cbam_pkg_coverage_start: '2026-01-01', cbam_pkg_coverage_end: '2026-09-30',
    cbam_operator_name: 'Example Steel Ltd', cbam_operator_contact: 'Operator reporting team',
    cbam_installation_country: 'Serbia', cbam_pkg_installation_name: 'Example works',
    cbam_pkg_installation_address: 'Example industrial road 1', product_name: 'Example steel goods',
    cbam_pkg_cn8: '72081000', cbam_pkg_cn_review: 'not_reviewed',
    cbam_pkg_boundary: 'Operator-reported process attribution, total saleable output; see OPS-2026-Q3.',
    cbam_pkg_precursor_statement: 'Reported direct value already includes the relevant precursor contribution; see operator paper.',
    cbam_pkg_unit: 'tCO2e/t_goods', cbam_pkg_direct_see: '2.5', cbam_pkg_direct_basis: 'actual',
    cbam_pkg_direct_source: 'operator-1', cbam_pkg_indirect_status: 'not_applicable',
    cbam_pkg_indirect_rationale: 'Preparer refers to Annex II; goods classification and exclusion need customer review.',
    cbam_pkg_lot_mass_tonnes: '12', cbam_pkg_verification_status: 'not_verified',
    cbam_pkg_evidence_json: JSON.stringify(EVIDENCE), ...overrides,
  }
}

function check(overrides: PackageValues = {}, now = NOW) {
  return validateSupplierPackage(mergePackageValues({}, readyValues(overrides)), { now })
}

function hasRule(result: ReturnType<typeof check>, rule: string, fieldId?: string) {
  return result.issues.some((issue) => issue.ruleId === rule && (!fieldId || issue.fieldId === fieldId))
}

test('unverified partial actual values can be ready only for review, with separate indicative direct output', () => {
  const result = check()
  assert.equal(PACKAGE_PROFILE_VERSION, 'cbam-supplier-review/1.0')
  assert.equal(result.isReady, true, JSON.stringify(result.issues))
  assert.equal(result.coverage, 'partial')
  assert.deepEqual(result.calculations, { massTonnes: 12, directLotEmissions: 30, indirectLotEmissions: null })
  for (const rule of ['PARTIAL_YEAR', 'UNVERIFIED_DATA', 'CN_REVIEW', 'INDIRECT_SCOPE_REVIEW', 'REVIEW_ONLY']) {
    assert.ok(hasRule(result, rule), rule)
  }
  assert.equal('verified' in result, false)
  assert.equal('legalReady' in result, false)
})

test('reported indirect values are multiplied separately without any total or additional precursor amount', () => {
  const result = check({ cbam_pkg_indirect_status: 'reported', cbam_pkg_indirect_see: '0.5',
    cbam_pkg_indirect_basis: 'actual', cbam_pkg_indirect_source: 'operator-1' })
  assert.equal(result.isReady, true)
  assert.deepEqual(result.calculations, { massTonnes: 12, directLotEmissions: 30, indirectLotEmissions: 6 })
  assert.equal(Object.keys(result.calculations).length, 3)
})

test('zero is a valid reported value and lot mass, while omitted lot mass leaves indicative emissions empty', () => {
  const zero = check({ cbam_pkg_direct_see: '0', cbam_pkg_indirect_status: 'reported', cbam_pkg_indirect_see: '0',
    cbam_pkg_indirect_basis: 'actual', cbam_pkg_indirect_source: 'operator-1', cbam_pkg_lot_mass_tonnes: '0' })
  assert.equal(zero.isReady, true)
  assert.deepEqual(zero.calculations, { massTonnes: 0, directLotEmissions: 0, indirectLotEmissions: 0 })
  const noLot = check({ cbam_pkg_lot_mass_tonnes: '' })
  assert.equal(noLot.isReady, true)
  assert.deepEqual(noLot.calculations, { massTonnes: null, directLotEmissions: null, indirectLotEmissions: null })
})

test('blank and unknown required values block readiness instead of becoming zero', () => {
  for (const value of ['', '  ', 'unknown', 'N/A', 'TBD']) {
    const result = check({ cbam_pkg_direct_see: value })
    assert.equal(result.isReady, false, value)
    assert.ok(hasRule(result, 'REQUIRED_VALUE', 'cbam_pkg_direct_see'))
    assert.equal(result.calculations.directLotEmissions, null)
  }
  assert.equal(check({ cbam_pkg_precursor_statement: 'unknown' }).isReady, false)
})

test('nonfinite, negative and silently coercible numbers are rejected', () => {
  for (const value of ['Infinity', 'NaN', '-1', '0x10', '1,000', '1e999', '12 tonnes']) {
    const result = check({ cbam_pkg_direct_see: value })
    assert.equal(result.isReady, false, value)
    assert.ok(hasRule(result, 'INVALID_NUMBER', 'cbam_pkg_direct_see'), value)
  }
  assert.equal(check({ cbam_pkg_direct_see: '2.5e-1' }).calculations.directLotEmissions, 3)
  assert.equal(check({ cbam_pkg_lot_mass_tonnes: 'unknown' }).isReady, false)
  const overflow = check({ cbam_pkg_direct_see: '1e308', cbam_pkg_lot_mass_tonnes: '10' })
  assert.ok(hasRule(overflow, 'CALCULATION_OVERFLOW'))
  assert.equal(overflow.isReady, false)
  assert.equal(overflow.calculations.directLotEmissions, null)
})

test('unsupported units prevent every indicative calculation', () => {
  for (const unit of ['kgCO2e/kg', 'tCO2e/MWh', 'tCO2e/t_clinker', 'tCO2e/t']) {
    const result = check({ cbam_pkg_unit: unit })
    assert.equal(result.isReady, false)
    assert.ok(hasRule(result, 'UNSUPPORTED_UNIT'))
    assert.equal(result.calculations.directLotEmissions, null)
  }
})

test('production year is definitive and cannot be fractional, transitional or future', () => {
  for (const year of ['2025', '2027', '2026.0', '26', '2026.5']) {
    const result = check({ cbam_pkg_production_year: year })
    assert.equal(result.isReady, false, year)
    assert.ok(hasRule(result, 'PRODUCTION_YEAR'))
    assert.equal(result.coverage, 'unknown')
  }
})

test('coverage validates real dates, ordering, year and actual dates rather than accepting planned coverage', () => {
  const cases = [
    [{ cbam_pkg_coverage_end: '2026-02-30' }, 'INVALID_DATE'],
    [{ cbam_pkg_coverage_end: '2026-02-29' }, 'INVALID_DATE'],
    [{ cbam_pkg_coverage_end: '2026-9-30' }, 'INVALID_DATE'],
    [{ cbam_pkg_coverage_start: '2026-10-01', cbam_pkg_coverage_end: '2026-09-30' }, 'DATE_ORDER'],
    [{ cbam_pkg_coverage_start: '2025-12-31' }, 'COVERAGE_YEAR'],
    [{ cbam_pkg_coverage_end: '2026-10-12' }, 'FUTURE_COVERAGE'],
    [{ cbam_pkg_coverage_end: '2026-12-31' }, 'FUTURE_COVERAGE'],
  ] as const
  for (const [values, rule] of cases) {
    const result = check(values)
    assert.equal(result.isReady, false, rule)
    assert.ok(hasRule(result, rule))
    assert.equal(result.coverage, 'unknown')
  }
  const full = check({ cbam_pkg_coverage_end: '2026-12-31' }, new Date('2027-01-02T00:00:00Z'))
  assert.equal(full.isReady, true)
  assert.equal(full.coverage, 'full')
  assert.equal(hasRule(full, 'PARTIAL_YEAR'), false)
  assert.ok(hasRule(full, 'REVIEW_ONLY'))
  assert.equal(check({}, new Date('invalid')).isReady, false)
})

test('CN syntax is checked without asserting scope or losing leading zeroes', () => {
  for (const code of ['720810', '7208 1000', '7208100A']) {
    const result = check({ cbam_pkg_cn8: code })
    assert.equal(result.isReady, false)
    assert.ok(hasRule(result, 'CN8_FORMAT'))
  }
  const result = check({ cbam_pkg_cn8: '01010101' })
  assert.equal(result.isReady, true)
  assert.equal(result.values.cbam_pkg_cn8, '01010101')
  assert.ok(hasRule(result, 'CN_REVIEW'))
})

test('trader requires its own supplier identity without changing operator identity', () => {
  const missing = check({ cbam_pkg_supplier_role: 'trader' })
  assert.equal(missing.isReady, false)
  assert.ok(hasRule(missing, 'REQUIRED_VALUE', 'cbam_pkg_supplier_name'))
  const present = check({ cbam_pkg_supplier_role: 'trader', cbam_pkg_supplier_name: 'Example Trading Ltd' })
  assert.equal(present.isReady, true)
  assert.equal(present.values.cbam_operator_name, 'Example Steel Ltd')
  assert.equal(PACKAGE_FIELDS.find((field) => field.id === 'cbam_pkg_supplier_name')?.required, false)
})

test('indirect treatment must be determined, and each reported component has conditional fields', () => {
  assert.equal(check({ cbam_pkg_indirect_status: 'unknown' }).isReady, false)
  assert.equal(check({ cbam_pkg_indirect_status: 'not_applicable', cbam_pkg_indirect_rationale: '' }).isReady, false)
  const missing = check({ cbam_pkg_indirect_status: 'reported' })
  assert.equal(missing.isReady, false)
  for (const id of ['cbam_pkg_indirect_see', 'cbam_pkg_indirect_basis', 'cbam_pkg_indirect_source']) {
    assert.ok(hasRule(missing, 'REQUIRED_VALUE', id))
  }
})

test('inactive conditional drafts are preserved but omitted from validation and calculation', () => {
  const stale = readyValues({ cbam_pkg_indirect_see: 'Infinity', cbam_pkg_indirect_basis: 'bad option',
    cbam_pkg_indirect_source: 'missing', cbam_pkg_default_context: 'not json',
    cbam_pkg_verifier: 'unknown', cbam_pkg_verification_source: 'missing', cbam_pkg_supplier_name: 'unknown' })
  const result = validateSupplierPackage(mergePackageValues({}, stale), { now: NOW })
  assert.equal(result.isReady, true, JSON.stringify(result.issues))
  assert.equal(result.values.cbam_pkg_indirect_see, 'Infinity')
  assert.equal(result.calculations.indirectLotEmissions, null)
  for (const id of ['cbam_pkg_indirect_see', 'cbam_pkg_indirect_basis', 'cbam_pkg_indirect_source',
    'cbam_pkg_default_context', 'cbam_pkg_verifier', 'cbam_pkg_verification_source', 'cbam_pkg_supplier_name']) {
    assert.equal(isPackageFieldActive(id, stale), false, id)
  }
  assert.equal(isPackageFieldActive('cbam_pkg_indirect_rationale', stale), true)
  assert.equal(isPackageFieldActive('invented', stale), false)
  const reported = { ...stale, cbam_pkg_indirect_status: 'reported', cbam_pkg_indirect_basis: 'mixed' }
  assert.equal(isPackageFieldActive('cbam_pkg_indirect_see', reported), true)
  assert.equal(isPackageFieldActive('cbam_pkg_default_context', reported), true)
  assert.equal(isPackageFieldActive('cbam_pkg_indirect_rationale', reported), false)
})

const defaultContext = { component: 'direct', sourceId: 'operator-1', version: 'Corrected table 2026-08-10',
  row: 'Serbia / CN 72081000 / 2026 / reported relevant precursor row', markup: 'Preparer declares markup already included; reviewer to confirm' }

test('default and mixed inputs require exact version, row, markup context and evidence', () => {
  for (const basis of ['default', 'mixed']) {
    assert.equal(check({ cbam_pkg_direct_basis: basis }).isReady, false)
    const result = check({ cbam_pkg_direct_basis: basis, cbam_pkg_default_context: JSON.stringify([defaultContext]) })
    assert.equal(result.isReady, true)
    assert.ok(hasRule(result, 'DEFAULT_REVIEW'))
    for (const key of ['sourceId', 'version', 'row', 'markup']) {
      const broken = check({ cbam_pkg_direct_basis: basis,
        cbam_pkg_default_context: JSON.stringify([{ ...defaultContext, [key]: '' }]) })
      assert.equal(broken.isReady, false, key)
      assert.ok(hasRule(broken, 'DEFAULT_PROVENANCE'))
    }
  }
  assert.equal(check({ cbam_pkg_direct_basis: 'default', cbam_pkg_default_context: '[]' }).isReady, false)
  const dangling = check({ cbam_pkg_direct_basis: 'default',
    cbam_pkg_default_context: JSON.stringify([{ ...defaultContext, sourceId: 'missing' }]) })
  assert.ok(hasRule(dangling, 'DEFAULT_SOURCE_REFERENCE'))
})

test('default provenance is required separately for active indirect input; no CN equality is presumed for precursors', () => {
  const values = { cbam_pkg_direct_basis: 'mixed', cbam_pkg_indirect_status: 'reported', cbam_pkg_indirect_see: '0.2',
    cbam_pkg_indirect_basis: 'default', cbam_pkg_indirect_source: 'operator-1' }
  assert.equal(check({ ...values, cbam_pkg_default_context: JSON.stringify([defaultContext]) }).isReady, false)
  const result = check({ ...values, cbam_pkg_default_context: JSON.stringify([
    defaultContext, { ...defaultContext, component: 'indirect', row: 'Source country / relevant precursor CN / 2026 / exact row 7' },
  ]) })
  assert.equal(result.isReady, true)
  assert.equal(result.calculations.indirectLotEmissions, 2.4000000000000004)
})

test('evidence register rejects malformed, missing and duplicate references', () => {
  for (const raw of ['bad json', '{}', '[]', '[{"id":"operator-1"}]']) {
    assert.equal(check({ cbam_pkg_evidence_json: raw }).isReady, false, raw)
  }
  for (const key of ['id', 'title', 'reference', 'version', 'period', 'owner']) {
    assert.equal(check({ cbam_pkg_evidence_json: JSON.stringify([{ ...EVIDENCE[0], [key]: 'unknown' }]) }).isReady, false, key)
  }
  const duplicate = check({ cbam_pkg_evidence_json: JSON.stringify([EVIDENCE[0], EVIDENCE[0]]) })
  assert.ok(hasRule(duplicate, 'DUPLICATE_EVIDENCE_ID'))
  const dangling = check({ cbam_pkg_direct_source: 'missing' })
  assert.ok(hasRule(dangling, 'MISSING_EVIDENCE_REFERENCE'))
  assert.equal(dangling.isReady, false)
  const restricted = check({ cbam_pkg_evidence_json: JSON.stringify([{ ...EVIDENCE[0], disclosure: 'restricted', secretMetadata: 'omit' }]) })
  assert.equal(restricted.isReady, true)
  assert.ok(hasRule(restricted, 'DISCLOSURE_REVIEW'))
  assert.equal('secretMetadata' in restricted.evidence[0], false)
})

test('declared verification requires attribution and a valid source, and never becomes app verification', () => {
  const missing = check({ cbam_pkg_verification_status: 'declared_verified' })
  assert.equal(missing.isReady, false)
  assert.ok(hasRule(missing, 'REQUIRED_VALUE', 'cbam_pkg_verifier'))
  assert.ok(hasRule(missing, 'REQUIRED_VALUE', 'cbam_pkg_verification_source'))
  const ready = check({ cbam_pkg_verification_status: 'declared_verified', cbam_pkg_verifier: 'Declared verifier / accreditation ref',
    cbam_pkg_verification_source: 'operator-1' })
  assert.equal(ready.isReady, true)
  assert.ok(hasRule(ready, 'DECLARED_VERIFICATION_ONLY'))
  assert.equal('verified' in ready, false)
  assert.equal(check({ ...ready.values, cbam_pkg_verification_source: 'missing' }).isReady, false)
})

test('merge preserves unrelated root properties, datapoints and scalar metadata without mutating input', () => {
  const original = { project: { id: 'p1' }, version: 4, activity_data: { preserved: true }, data_points: [
    { field_id: 'unrelated_field', item_id: 'repeat-1', value: 42, confidential: true },
    { field_id: 'product_name', item_id: null, value: 'Old name', provenance: { source: 'existing' } },
  ] }
  const before = structuredClone(original)
  const merged = mergePackageValues(original, { product_name: 'New name', cbam_pkg_direct_see: 'draft invalid number' })
  assert.deepEqual(original, before)
  assert.deepEqual(merged.project, before.project)
  assert.deepEqual(merged.activity_data, before.activity_data)
  assert.deepEqual(merged.data_points[0], before.data_points[0])
  assert.deepEqual(merged.data_points[1], { ...before.data_points[1], value: 'New name' })
  assert.deepEqual(merged.data_points[2], { field_id: 'cbam_pkg_direct_see', item_id: null, value: 'draft invalid number' })
  assert.equal(extractPackageValues(merged).cbam_pkg_direct_see, 'draft invalid number')
  assert.equal(validateSupplierPackage(merged, { now: NOW }).isReady, false)
})

test('merge rejects unknown keys, nonstring draft values and malformed roots', () => {
  assert.throws(() => mergePackageValues({}, { unfamiliar: 'x' }), /Unknown package field/)
  assert.throws(() => mergePackageValues({}, { product_name: 0 } as unknown as PackageValues), /must be a string/)
  assert.throws(() => mergePackageValues([], {}), /Dataset must be an object/)
  assert.throws(() => mergePackageValues({ data_points: {} }, {}), /data_points must be an array/)
  assert.throws(() => mergePackageValues({}, [] as unknown as PackageValues), /object of strings/)
  assert.equal(validateSupplierPackage({ data_points: {} }, { now: NOW }).isReady, false)
})

test('duplicate scalar and repeated-item values are never silently selected or overwritten', () => {
  const dataset = mergePackageValues({}, readyValues())
  const originalPoint = dataset.data_points.find((point) => (point as { field_id: string }).field_id === 'product_name')
  for (const extra of [originalPoint, { field_id: 'product_name', item_id: null, value: 'Conflicting name' }]) {
    const duplicate = { ...dataset, data_points: [...dataset.data_points, extra] }
    assert.equal(extractPackageValues(duplicate).product_name, '')
    assert.ok(hasRule(validateSupplierPackage(duplicate, { now: NOW }), 'AMBIGUOUS_SCALAR'))
    assert.throws(() => mergePackageValues(duplicate, { product_name: 'Replacement' }), /Ambiguous scalar/)
  }
  const repeated = { data_points: [{ field_id: 'product_name', item_id: 'one-product', value: 'Name' }] }
  assert.equal(extractPackageValues(repeated).product_name, '')
  assert.throws(() => mergePackageValues(repeated, {}), /Ambiguous scalar/)
  const numeric = { data_points: [{ field_id: 'cbam_pkg_direct_see', item_id: null, value: 0 }] }
  assert.ok(hasRule(validateSupplierPackage(numeric, { now: NOW }), 'INVALID_VALUE_TYPE'))
})

test('extraction returns only the documented fields and never guesses from legacy emissions fields', () => {
  const values = extractPackageValues({ data_points: [
    { field_id: 'direct_emissions', value: '999' }, { field_id: 'internal_note', value: 'private' },
  ] })
  assert.equal(PACKAGE_FIELDS.length, 34)
  assert.equal(new Set(PACKAGE_FIELDS.map((field) => field.id)).size, 34)
  assert.deepEqual(Object.keys(values), PACKAGE_FIELDS.map((field) => field.id))
  assert.equal(values.cbam_pkg_direct_see, '')
  assert.equal('internal_note' in values, false)
})
