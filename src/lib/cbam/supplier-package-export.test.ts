import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import test from 'node:test'
import { renderSupplierPackageZip } from './supplier-package-export'
import { mergePackageValues, PACKAGE_PROFILE_VERSION, validateSupplierPackage, type PackageValues } from './supplier-package'
import type { SupplierPackageSnapshot } from './supplier-package-snapshot'

const now = new Date('2026-10-11T12:00:00.000Z')

function snapshot(overrides: PackageValues = {}): SupplierPackageSnapshot {
  const values: PackageValues = {
    cbam_pkg_recipient: 'EU Customer', cbam_pkg_prepared_by: 'Supply team', cbam_pkg_supplier_role: 'operator',
    cbam_pkg_production_year: '2026', cbam_pkg_coverage_start: '2026-01-01', cbam_pkg_coverage_end: '2026-09-30',
    cbam_operator_name: 'Example Metal', cbam_operator_contact: 'Operations team', cbam_installation_country: 'Serbia',
    cbam_pkg_installation_name: 'Plant 1', cbam_pkg_installation_address: 'Example industrial zone',
    product_name: 'Aluminium profile', product_description: 'Extruded profile, 40 × 40 mm',
    cbam_pkg_cn8: '76042100', cbam_pkg_cn_review: 'declared_reviewed',
    cbam_pkg_boundary: 'Casting and extrusion; operator attribution retained in report OP-1.',
    cbam_pkg_precursor_statement: 'Reported values already include attributable billet production.',
    cbam_pkg_unit: 'tCO2e/t_goods', cbam_pkg_direct_see: '2.5', cbam_pkg_direct_basis: 'actual', cbam_pkg_direct_source: 'OP-1',
    cbam_pkg_indirect_status: 'reported', cbam_pkg_indirect_see: '0.3', cbam_pkg_indirect_basis: 'actual', cbam_pkg_indirect_source: 'OP-1',
    cbam_pkg_lot_mass_tonnes: '10', cbam_pkg_verification_status: 'not_verified',
    cbam_pkg_evidence_json: JSON.stringify([{ id: 'OP-1', title: 'Operator calculation', reference: 'https://supplier.example/records/1', version: 'Revision 2', period: '2026 YTD', owner: 'Example Metal', disclosure: 'shareable' }]),
    ...overrides,
  }
  const validation = validateSupplierPackage(mergePackageValues({}, values), { now })
  assert.equal(validation.isReady, true, JSON.stringify(validation.issues))
  return {
    projectId: 'project-1', projectName: 'Metal supply', reportId: 'report-1', templateCode: 'CBAM_DATA_PACKAGE',
    datasetVersion: 4, generatedAt: now.toISOString(), profileVersion: PACKAGE_PROFILE_VERSION, validation, canEdit: true,
  }
}

// Read the central directory rather than relying on the writer's local order.
// Independently verify every local header, stored byte count and CRC-32.
function readZip(bytes: Buffer): Map<string, string> {
  assert.equal(bytes.readUInt32LE(bytes.length - 22), 0x06054b50)
  assert.equal(bytes.readUInt16LE(bytes.length - 18), 0)
  assert.equal(bytes.readUInt16LE(bytes.length - 16), 0)
  const entries = bytes.readUInt16LE(bytes.length - 12)
  const directorySize = bytes.readUInt32LE(bytes.length - 10)
  const directoryOffset = bytes.readUInt32LE(bytes.length - 6)
  assert.equal(directoryOffset + directorySize, bytes.length - 22)
  const contents = new Map<string, string>()
  let cursor = directoryOffset
  for (let index = 0; index < entries; index++) {
    assert.equal(bytes.readUInt32LE(cursor), 0x02014b50)
    assert.equal(bytes.readUInt16LE(cursor + 8), 0x0800)
    assert.equal(bytes.readUInt16LE(cursor + 10), 0, 'ZIP STORE')
    const size = bytes.readUInt32LE(cursor + 20)
    assert.equal(bytes.readUInt32LE(cursor + 24), size)
    const nameLength = bytes.readUInt16LE(cursor + 28)
    const name = bytes.subarray(cursor + 46, cursor + 46 + nameLength).toString('utf8')
    assert.match(name, /^[a-z]+\.(html|json|csv|txt)$/i)
    assert.equal(contents.has(name), false)
    const localOffset = bytes.readUInt32LE(cursor + 42)
    assert.equal(bytes.readUInt32LE(localOffset), 0x04034b50)
    assert.equal(bytes.readUInt16LE(localOffset + 8), 0)
    assert.equal(bytes.readUInt32LE(localOffset + 18), size)
    assert.equal(bytes.readUInt32LE(localOffset + 22), size)
    assert.equal(bytes.subarray(localOffset + 30, localOffset + 30 + nameLength).toString(), name)
    const start = localOffset + 30 + nameLength + bytes.readUInt16LE(localOffset + 28)
    const content = bytes.subarray(start, start + size)
    let crc = 0xffffffff
    for (const byte of content) {
      crc ^= byte
      for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
    const checksum = (crc ^ 0xffffffff) >>> 0
    assert.equal(bytes.readUInt32LE(cursor + 16), checksum)
    assert.equal(bytes.readUInt32LE(localOffset + 14), checksum)
    contents.set(name, content.toString('utf8'))
    cursor += 46 + nameLength + bytes.readUInt16LE(cursor + 30) + bytes.readUInt16LE(cursor + 32)
  }
  assert.equal(cursor, directoryOffset + directorySize)
  return contents
}

test('writes a deterministic UTF-8 ZIP with five fixed entries and correct directory, sizes and CRCs', () => {
  const input = snapshot()
  const archive = renderSupplierPackageZip(input)
  assert.equal(archive.filename, 'cbam-supplier-review-package-v1.zip')
  assert.equal(archive.contentType, 'application/zip')
  const files = readZip(archive.bytes)
  assert.deepEqual([...files.keys()], ['summary.html', 'data.json', 'values.csv', 'evidence.csv', 'README.txt'])
  assert.deepEqual(renderSupplierPackageZip(input).bytes, archive.bytes)
  assert.match(files.get('values.csv')!, /40 × 40 mm/)
  assert.ok(files.get('values.csv')!.startsWith('"field_id","label","raw_value","unit","hint"\r\n'))
  assert.ok(files.get('evidence.csv')!.startsWith('"id","title","reference","version","period","owner","disclosure"\r\n'))
})

test('exports separate reported components and indicative results with review status, units and provenance', () => {
  const files = readZip(renderSupplierPackageZip(snapshot()).bytes)
  const data = JSON.parse(files.get('data.json')!)
  assert.equal(data.schemaVersion, 'cbam-supplier-review-package/1.0')
  assert.equal(data.metadata.datasetVersion, 4)
  assert.equal(data.review.status, 'ready_for_recipient_review')
  assert.equal(data.review.coverage, 'partial')
  assert.equal(data.review.directDataBasis, 'actual')
  assert.equal(data.review.indirectDataBasis, 'actual')
  assert.equal(data.calculations.massTonnes, 10)
  assert.equal(data.calculations.directLotEmissions, 25)
  assert.equal(data.calculations.indirectLotEmissions, 3)
  assert.equal(data.calculations.emissionsUnit, 'tCO2e')
  assert.equal(data.calculations.total, undefined)
  assert.equal(data.evidenceFilesIncluded, false)
  assert.ok(data.issues.some((issue: { ruleId: string }) => issue.ruleId === 'PARTIAL_YEAR'))
  const summary = files.get('summary.html')!
  assert.match(summary, /Ready for recipient review/)
  assert.match(summary, /Partial year — provisional/)
  assert.match(summary, /25 tCO2e/)
  assert.match(summary, /3 tCO2e/)
  assert.match(summary, /not a CBAM declaration/)
  assert.match(summary, /No referenced documents or attachments are included/)
  const metadata = summary.split('<h2>Package snapshot</h2>')[1].split('</section>')[0]
  assert.match(metadata, /<th scope="row">Product<\/th><td><div class="value">Aluminium profile/)
  assert.match(metadata, /<th scope="row">Producing operator<\/th><td><div class="value">Example Metal/)
  assert.match(metadata, /<th scope="row">Installation country<\/th><td><div class="value">Serbia/)
  assert.doesNotMatch(summary, /<th scope="row">Evidence register<\/th>|JSON array/)
  assert.doesNotMatch(summary, /\[\{&quot;id&quot;/)
  assert.match(files.get('README.txt')!, /No precursor amounts are added automatically/)
  assert.equal(data.sources.length, 3)
  for (const source of data.sources) {
    assert.match(source.url, /^https:\/\/taxation-customs\.ec\.europa\.eu\//)
    assert.ok(files.get('README.txt')!.includes(source.url))
  }
})

test('not-applicable indirect treatment omits stale conditional drafts instead of exporting contradictory assertions', () => {
  const files = readZip(renderSupplierPackageZip(snapshot({
    cbam_pkg_indirect_status: 'not_applicable', cbam_pkg_indirect_rationale: 'Goods-specific reason recorded for recipient confirmation.',
    cbam_pkg_indirect_see: 'STALE_INDIRECT', cbam_pkg_indirect_basis: 'STALE_BASIS', cbam_pkg_indirect_source: 'STALE_SOURCE',
    cbam_pkg_default_context: 'STALE_DEFAULT', cbam_pkg_verifier: 'STALE_VERIFIER', cbam_pkg_supplier_name: 'STALE_TRADER',
  })).bytes)
  const data = JSON.parse(files.get('data.json')!)
  assert.equal(data.review.indirectDataBasis, null)
  assert.equal(data.calculations.indirectLotEmissions, null)
  assert.ok(data.values.some((value: { fieldId: string }) => value.fieldId === 'cbam_pkg_indirect_rationale'))
  assert.match(files.get('summary.html')!, /Declared not applicable — no indirect calculation/)
  for (const content of files.values()) assert.doesNotMatch(content, /STALE_/)
})

test('escapes untrusted HTML and neutralizes formula CSV without changing raw JSON values', () => {
  const attacks = ['=1+1', ' +SUM(1,1)', '\t=1+1', '\r=1+1', '\n=1+1', '  \tText', '  -1+1', '\u00a0@SUM(1,1)']
  for (const raw of attacks) {
    const files = readZip(renderSupplierPackageZip(snapshot({ product_name: raw })).bytes)
    const data = JSON.parse(files.get('data.json')!)
    assert.equal(data.values.find((field: { fieldId: string }) => field.fieldId === 'product_name').rawValue, raw)
    assert.ok(files.get('values.csv')!.includes(`"'${raw}"`), `unsafe CSV cell: ${JSON.stringify(raw)}`)
  }
  const input = snapshot({ product_name: '<img src=x onerror="alert(1)"> & \'supplier\'', product_description: 'Line one,"quoted"\nLine two' })
  input.projectName = '<script>alert("project")</script>'
  input.validation.evidence[0].reference = 'javascript:alert("reference")'
  input.validation.evidence[0].title = '=HYPERLINK("https://example.test")'
  input.validation.issues[0].message = '<svg onload="alert(1)">'
  const files = readZip(renderSupplierPackageZip(input).bytes)
  const summary = files.get('summary.html')!
  assert.doesNotMatch(summary, /<script|<img|<svg|href="javascript:/)
  assert.match(summary, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt; &amp; &#39;supplier&#39;/)
  assert.match(files.get('values.csv')!, /"Line one,""quoted""\nLine two"/)
  assert.ok(files.get('evidence.csv')!.includes('"\'=HYPERLINK(""https://example.test"")"'))
})

test('selects whitelisted values and evidence properties without leaking unrelated snapshot data', () => {
  const input = snapshot()
  input.validation.values.organization_secret = 'UNRELATED_DATASET_SECRET'
  Object.assign(input, { dataset: { private: 'UNRELATED_SNAPSHOT_SECRET' }, accessToken: 'UNRELATED_TOKEN' })
  Object.assign(input.validation.evidence[0], { privateComment: 'UNRELATED_EVIDENCE_SECRET' })
  const files = readZip(renderSupplierPackageZip(input).bytes)
  for (const content of files.values()) assert.doesNotMatch(content, /UNRELATED_|accessToken|canEdit/)
})

test('nested JSON exports only permitted evidence properties and active default provenance without mutating drafts', () => {
  const input = snapshot({
    cbam_pkg_direct_basis: 'default',
    cbam_pkg_evidence_json: JSON.stringify([{
      id: 'OP-1', title: 'Operator calculation', reference: 'Operator record 1', version: 'Revision 2',
      period: '2026 YTD', owner: 'Example Metal', disclosure: 'restricted', internalNote: 'PRIVATE_EXTRA_NOTE',
    }]),
    cbam_pkg_default_context: JSON.stringify([
      { component: 'direct', sourceId: ' OP-1 ', version: '2026 corrected', row: 'Serbia / 76042100 / 2026', markup: 'Already included', internalNote: 'PRIVATE_DEFAULT_NOTE' },
      { component: 'indirect', sourceId: 'STALE_INACTIVE_SOURCE', version: 'STALE_INACTIVE_VERSION', row: 'STALE_INACTIVE_ROW', markup: 'STALE_INACTIVE_MARKUP' },
      { unrelated: 'IGNORED_UNCHECKED_ROW' },
    ]),
  })
  const before = JSON.stringify(input)
  const files = readZip(renderSupplierPackageZip(input).bytes)
  assert.equal(JSON.stringify(input), before, 'export must not rewrite the saved draft or validation snapshot')
  for (const content of files.values()) assert.doesNotMatch(content, /PRIVATE_EXTRA_NOTE|PRIVATE_DEFAULT_NOTE|STALE_INACTIVE_|IGNORED_UNCHECKED_ROW|internalNote/)
  const data = JSON.parse(files.get('data.json')!)
  const evidenceValue = data.values.find((field: { fieldId: string }) => field.fieldId === 'cbam_pkg_evidence_json')
  assert.deepEqual(JSON.parse(evidenceValue.rawValue), data.evidence)
  assert.equal(data.evidence[0].disclosure, 'restricted', 'retain disclosure status and its review warning')
  assert.ok(data.issues.some((issue: { ruleId: string }) => issue.ruleId === 'DISCLOSURE_REVIEW'))
  const defaultValue = data.values.find((field: { fieldId: string }) => field.fieldId === 'cbam_pkg_default_context')
  assert.deepEqual(JSON.parse(defaultValue.rawValue), [{
    component: 'direct', sourceId: 'OP-1', version: '2026 corrected', row: 'Serbia / 76042100 / 2026', markup: 'Already included',
  }])
  const summary = files.get('summary.html')!
  assert.match(summary, /Direct emissions · Source record 1/)
  assert.match(summary, /<th scope="row">Source evidence ID<\/th><td><div class="value">OP-1/)
  assert.match(summary, /<th scope="row">Table row<\/th><td><div class="value">Serbia \/ 76042100 \/ 2026/)
  assert.match(summary, /<th scope="row">Markup treatment<\/th><td><div class="value">Already included/)
  assert.doesNotMatch(summary, /<th scope="row">Default-value provenance<\/th>|\[\{&quot;component&quot;|JSON array/)
  assert.equal(data.calculations.indirectLotEmissions, 3, 'reported actual indirect emissions remain separate and unaffected')
})

test('does not invent a zero lot result when optional mass is blank', () => {
  const files = readZip(renderSupplierPackageZip(snapshot({ cbam_pkg_lot_mass_tonnes: '' })).bytes)
  const data = JSON.parse(files.get('data.json')!)
  assert.equal(data.calculations.massTonnes, null)
  assert.equal(data.calculations.directLotEmissions, null)
  assert.equal(data.calculations.indirectLotEmissions, null)
  assert.match(files.get('summary.html')!, /Not calculated/)
})

test('refuses incomplete or unsupported profile snapshots and suppresses results without confirmed units', () => {
  const input = snapshot()
  assert.throws(() => renderSupplierPackageZip({ ...input, profileVersion: 'future/2' }), /Unsupported/)
  assert.throws(() => renderSupplierPackageZip({ ...input, validation: { ...input.validation, isReady: false } }), /not ready/)
  assert.throws(() => renderSupplierPackageZip({ ...input, validation: { ...input.validation, issues: [{ fieldId: 'product_name', ruleId: 'REQUIRED_VALUE', severity: 'error', message: 'Missing product', sourceRefs: [] }] } }), /not ready/)
  input.validation.values.cbam_pkg_unit = 'unsupported'
  const data = JSON.parse(readZip(renderSupplierPackageZip(input).bytes).get('data.json')!)
  assert.equal(data.calculations.supportedUnitConfirmed, false)
  assert.equal(data.calculations.directLotEmissions, null)
  assert.equal(data.calculations.indirectLotEmissions, null)
})
