import { Buffer } from 'node:buffer'
import { isPackageFieldActive, PACKAGE_FIELDS, PACKAGE_PROFILE_VERSION, type PackageValues } from './supplier-package'
import type { SupplierPackageSnapshot } from './supplier-package-snapshot'

const SCHEMA_VERSION = 'cbam-supplier-review-package/1.0'
const TITLE = 'CBAM Supplier Review Package v1'
const SCOPE = 'A preparation package for recipient review. This is not a CBAM declaration, a statutory operator emissions report, or verification of emissions.'
const SOURCES = [
  { title: 'European Commission — CBAM legislation and guidance', url: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en' },
  { title: 'European Commission — Guidance No. 2: quick guide for non-EU operators (14 August 2026)', url: 'https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf' },
  { title: 'European Commission — Guidance No. 3: methods for embedded emissions (14 August 2026)', url: 'https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf' },
] as const

function fieldUnit(id: string): string {
  if (id === 'cbam_pkg_direct_see' || id === 'cbam_pkg_indirect_see') return 'tCO2e / t goods'
  if (id === 'cbam_pkg_lot_mass_tonnes') return 't goods'
  return ''
}

function html(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]!)
}

// Quoting alone does not prevent a spreadsheet from executing a formula. Keep
// raw data in JSON; prefix unsafe CSV cells with an apostrophe before quoting.
function csvCell(value: string): string {
  const safe = /^\s*[\t\r\n]/u.test(value) || /^\s*[=+\-@]/u.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

function csv(rows: string[][]): string {
  return `${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`
}

function normalizedDefaultContext(values: PackageValues): string {
  const text = (id: string) => values[id]?.trim() ?? ''
  const activeComponents = new Set((['direct', 'indirect'] as const).filter((component) =>
    (component === 'direct' || text('cbam_pkg_indirect_status') === 'reported') &&
    ['default', 'mixed'].includes(text(`cbam_pkg_${component}_basis`))))
  const parsed: unknown = JSON.parse(values.cbam_pkg_default_context)
  if (!Array.isArray(parsed)) throw new Error('Invalid default context in supplier package')
  return JSON.stringify(parsed.filter((entry): entry is Record<string, unknown> =>
    !!entry && typeof entry === 'object' && !Array.isArray(entry) &&
    (entry.component === 'direct' || entry.component === 'indirect') && activeComponents.has(entry.component),
  ).map((entry) => Object.fromEntries(['component', 'sourceId', 'version', 'row', 'markup'].map((key) => {
    if (typeof entry[key] !== 'string') throw new Error('Invalid default context in supplier package')
    return [key, entry[key].trim()]
  }))))
}

function exportData(snapshot: SupplierPackageSnapshot) {
  // Deliberately select properties instead of serializing the snapshot: no
  // permission flags, unrelated dataset fields or arbitrary object properties.
  const evidence = snapshot.validation.evidence.map((entry) => ({
    id: entry.id, title: entry.title, reference: entry.reference, version: entry.version,
    period: entry.period, owner: entry.owner, disclosure: entry.disclosure,
  }))
  const exportValue = (id: string) => {
    // These fields contain structured draft data. Re-exporting their raw JSON
    // would bypass the nested whitelist and retain inactive/default draft rows.
    if (id === 'cbam_pkg_evidence_json') return JSON.stringify(evidence)
    if (id === 'cbam_pkg_default_context') return normalizedDefaultContext(snapshot.validation.values)
    return snapshot.validation.values[id] ?? ''
  }
  const values = PACKAGE_FIELDS.filter((field) => isPackageFieldActive(field.id, snapshot.validation.values)).map((field) => ({
    fieldId: field.id,
    label: field.label,
    rawValue: exportValue(field.id),
    unit: fieldUnit(field.id),
    hint: field.hint,
  }))
  const raw = Object.fromEntries(values.map((field) => [field.fieldId, field.rawValue.trim()]))
  const hasSupportedUnit = raw.cbam_pkg_unit === 'tCO2e/t_goods'
  const finite = (value: number | null) => value !== null && Number.isFinite(value) && value >= 0 ? value : null
  const calculations = snapshot.validation.calculations
  return {
    schemaVersion: SCHEMA_VERSION,
    title: TITLE,
    scope: SCOPE,
    metadata: {
      projectId: snapshot.projectId,
      projectName: snapshot.projectName,
      reportId: snapshot.reportId,
      templateCode: snapshot.templateCode,
      datasetVersion: snapshot.datasetVersion,
      generatedAt: snapshot.generatedAt,
      profileVersion: snapshot.profileVersion,
    },
    review: {
      status: 'ready_for_recipient_review',
      coverage: snapshot.validation.coverage,
      directDataBasis: raw.cbam_pkg_direct_basis,
      indirectTreatment: raw.cbam_pkg_indirect_status,
      indirectDataBasis: raw.cbam_pkg_indirect_status === 'reported' ? raw.cbam_pkg_indirect_basis : null,
    },
    values,
    evidence,
    issues: snapshot.validation.issues.map((issue) => ({
      fieldId: issue.fieldId, ruleId: issue.ruleId, severity: issue.severity,
      message: issue.message, sourceRefs: [...issue.sourceRefs],
    })),
    calculations: {
      kind: 'indicative_mass_times_reported_specific_emissions',
      supportedUnitConfirmed: hasSupportedUnit,
      massTonnes: finite(calculations.massTonnes),
      directLotEmissions: hasSupportedUnit ? finite(calculations.directLotEmissions) : null,
      indirectLotEmissions: hasSupportedUnit && raw.cbam_pkg_indirect_status === 'reported' ? finite(calculations.indirectLotEmissions) : null,
      massUnit: 't goods',
      emissionsUnit: 'tCO2e',
      rule: 'Lot net mass × the corresponding reported specific embedded emissions. Direct and indirect remain separate. No precursor amount is added.',
    },
    evidenceFilesIncluded: false,
    sources: SOURCES.map((source) => ({ ...source })),
  }
}

type ExportData = ReturnType<typeof exportData>

function displayValue(data: ExportData, fieldId: string): string {
  const value = data.values.find((field) => field.fieldId === fieldId)?.rawValue ?? ''
  if (!value) return 'Not supplied'
  return PACKAGE_FIELDS.find((field) => field.id === fieldId)?.options?.find((option) => option.value === value.trim())?.label ?? value
}

function row(label: string, value: unknown, hint?: string): string {
  return `<tr><th scope="row">${html(label)}</th><td><div class="value">${html(value)}</div>${hint ? `<div class="hint">${html(hint)}</div>` : ''}</td></tr>`
}

function table(rows: string): string {
  return `<table><tbody>${rows}</tbody></table>`
}

function renderSummary(data: ExportData): string {
  const value = (id: string) => displayValue(data, id)
  const indirectReported = data.review.indirectTreatment === 'reported'
  const indirectNotApplicable = data.review.indirectTreatment === 'not_applicable'
  const coverage = data.review.coverage === 'partial' ? 'Partial year — provisional' : data.review.coverage === 'full' ? 'Full production year' : 'Coverage unknown'
  const numberWithUnit = (amount: number | null, unit: string) => amount === null ? 'Not calculated' : `${amount} ${unit}`
  const evidence = data.evidence.map((entry) => `<article class="evidence"><h3>${html(entry.id)} · ${html(entry.title)}</h3>${table(
    row('Reference', entry.reference) + row('Version / date', entry.version) + row('Covered period', entry.period) + row('Owner', entry.owner) + row('Disclosure', entry.disclosure),
  )}</article>`).join('')
  // Render only the normalized export records; the saved JSON draft is never
  // read here. Evidence has its own cards, so neither JSON field is duplicated.
  const defaultValue = data.values.find((field) => field.fieldId === 'cbam_pkg_default_context')?.rawValue
  const defaultRecords = defaultValue ? JSON.parse(defaultValue) as Array<Record<string, string>> : []
  const defaultProvenance = defaultRecords.length ? `<section><h2>Default-value provenance</h2><p>Reported source records for each default or mixed component. Confirm the selected table, row and markup treatment during review.</p>${defaultRecords.map((entry, index) => `<article><h3>${entry.component === 'direct' ? 'Direct' : 'Indirect'} emissions · Source record ${index + 1}</h3>${table(
    row('Source evidence ID', entry.sourceId) + row('Source version', entry.version) + row('Table row', entry.row) + row('Markup treatment', entry.markup),
  )}</article>`).join('')}</section>` : ''
  const issues = data.issues.length ? `<ul class="issues">${data.issues.map((issue) => `<li><strong>${html(issue.severity.toUpperCase())} · ${html(issue.ruleId)}</strong><p>${html(issue.message)}</p><div class="hint">Field: ${html(issue.fieldId)}${issue.sourceRefs.length ? ` · References: ${html(issue.sourceRefs.join(', '))}` : ''}</div></li>`).join('')}</ul>` : '<p>No application validation issues were recorded for this snapshot. This does not establish regulatory compliance.</p>'
  const groups = ['context', 'installation', 'goods', 'emissions', 'evidence'] as const
  const groupLabels = { context: 'Recipient and period', installation: 'Producing installation', goods: 'Goods and process boundary', emissions: 'Reported emissions', evidence: 'Evidence and verification statements' }
  const allValues = groups.map((group) => `<h3>${groupLabels[group]}</h3>${table(data.values.filter((field) => !['cbam_pkg_evidence_json', 'cbam_pkg_default_context'].includes(field.fieldId) && PACKAGE_FIELDS.find((definition) => definition.id === field.fieldId)?.group === group).map((field) => row(field.label + (field.unit ? ` (${field.unit})` : ''), value(field.fieldId), field.hint)).join(''))}`).join('')
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${TITLE}</title>
<style>
@page { size: A4 portrait; margin: 16mm; }
* { box-sizing: border-box; } body { margin: 0; background: #f2f5f7; color: #172b38; font: 15px/1.55 system-ui, -apple-system, sans-serif; }
main { max-width: 920px; margin: 28px auto; padding: 40px; background: white; }
h1 { font-size: 30px; line-height: 1.2; margin: 8px 0 16px; } h2 { font-size: 22px; margin: 32px 0 10px; border-bottom: 2px solid #dce5e9; padding-bottom: 8px; } h3 { font-size: 17px; margin: 22px 0 8px; }
p { margin: 8px 0; } .eyebrow { color: #48616d; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; } .notice { border-left: 4px solid #487182; padding: 12px 16px; background: #edf4f7; } .coverage { font-weight: 650; }
table { border-collapse: collapse; width: 100%; table-layout: fixed; margin: 10px 0 18px; } th, td { text-align: left; vertical-align: top; border-bottom: 1px solid #dde5e9; padding: 10px 12px; overflow-wrap: anywhere; } th { width: 33%; font-weight: 600; background: #f5f8f9; } .value { white-space: pre-wrap; overflow-wrap: anywhere; } .hint { color: #52646e; font-size: 12px; margin-top: 5px; overflow-wrap: anywhere; } a { color: #245c77; overflow-wrap: anywhere; } li { margin-bottom: 12px; overflow-wrap: anywhere; } .issues { padding-left: 20px; } footer { border-top: 1px solid #dce5e9; padding-top: 16px; margin-top: 30px; color: #52646e; font-size: 12px; }
@media (max-width: 600px) { main { margin: 0; padding: 20px; } th { width: 38%; } th, td { padding: 8px; } }
@media print { body { background: white; font-size: 10pt; } main { margin: 0; padding: 0; max-width: none; } h1 { font-size: 23pt; } h2 { font-size: 16pt; break-after: avoid; } h3 { break-after: avoid; } tr { break-inside: avoid; } .notice { background: transparent; } a { color: inherit; text-decoration: none; } }
</style></head><body><main>
<header><div class="eyebrow">${TITLE}</div><h1>Ready for recipient review</h1><p class="notice">${SCOPE}</p><p class="coverage">${coverage}</p><p>Readiness means the supplied data passes this preparation profile's checks. Reported data, scope, sources and any verification claim still require human review.</p></header>
<section><h2>Package snapshot</h2>${table(row('Project', data.metadata.projectName) + row('Product', value('product_name')) + row('Producing operator', value('cbam_operator_name')) + row('Installation country', value('cbam_installation_country')) + row('Recipient', value('cbam_pkg_recipient')) + row('Prepared by', value('cbam_pkg_prepared_by')) + row('Production year', value('cbam_pkg_production_year')) + row('Data coverage', `${value('cbam_pkg_coverage_start')} to ${value('cbam_pkg_coverage_end')}`) + row('Dataset version', data.metadata.datasetVersion) + row('Generated at (UTC)', data.metadata.generatedAt) + row('Profile version', data.metadata.profileVersion) + row('Project / report ID', `${data.metadata.projectId} / ${data.metadata.reportId}`) + row('Template code', data.metadata.templateCode))}</section>
<section><h2>Reported emissions and lot illustration</h2><p>Specific embedded emissions below are supplied values. The application does not calculate installation emissions or determine the applicable CBAM method.</p>${table(
  row('Reported specific-emissions unit', value('cbam_pkg_unit')) +
  row('Direct emissions', `${value('cbam_pkg_direct_see')} tCO2e / t goods`, `${value('cbam_pkg_direct_basis')} · Evidence ID: ${value('cbam_pkg_direct_source')}`) +
  row('Indirect emissions', indirectReported ? `${value('cbam_pkg_indirect_see')} tCO2e / t goods` : value('cbam_pkg_indirect_status'), indirectReported ? `${value('cbam_pkg_indirect_basis')} · Evidence ID: ${value('cbam_pkg_indirect_source')}` : indirectNotApplicable ? value('cbam_pkg_indirect_rationale') : 'Applicability needs determination.') +
  row('Optional lot mass', numberWithUnit(data.calculations.massTonnes, 't goods')) +
  row('Indicative direct lot emissions', numberWithUnit(data.calculations.directLotEmissions, 'tCO2e')) +
  row('Indicative indirect lot emissions', indirectNotApplicable ? 'Declared not applicable — no indirect calculation' : numberWithUnit(data.calculations.indirectLotEmissions, 'tCO2e')),
) }<p class="hint">${html(data.calculations.rule)} A missing quantity is not zero. These separate illustrations are not a certificate requirement or a CBAM liability calculation.</p></section>
<section><h2>Review notes</h2>${issues}</section>
${defaultProvenance}
<section><h2>Evidence references</h2><p class="notice">References only. No referenced documents or attachments are included, fetched or verified. The recipient must obtain access and confirm the scope, version, period and disclosure permission.</p>${evidence || '<p>No evidence references supplied.</p>'}</section>
<section><h2>Package fields</h2><p>Active values and preparer statements retained from this dataset version. Blank entries mean not supplied. Conditional draft fields that do not apply to the selected treatment are omitted. Evidence and default-value source records are presented in the sections above.</p>${allValues}</section>
<section><h2>Rules and official sources</h2><p>This application profile covers one product, one installation and one production year. It checks selected field formats and cross-references; it does not confirm CN classification, statutory completeness, verification, accreditation, legal applicability or acceptance by a recipient.</p><ul>${SOURCES.map((source) => `<li><a href="${html(source.url)}">${html(source.title)}</a></li>`).join('')}</ul><p>Sources inform this preparation profile; they do not make this package an official form. Confirm the applicable rules and source versions for the relevant period.</p></section>
<footer>${TITLE} · ${html(data.metadata.generatedAt)} · JSON schema ${SCHEMA_VERSION}. Keep this archive with the recipient's review and underlying evidence.</footer>
</main></body></html>`
}

function renderReadme(data: ExportData): string {
  return `${TITLE}
${SCOPE}

STATUS AND SCOPE
Ready for recipient review under application profile ${data.metadata.profileVersion}.
Coverage: ${data.review.coverage}. Partial-year data remains provisional.
One product, one producing installation, one production year.
This status is not confirmation of statutory completeness or recipient acceptance.

CONTENTS
summary.html — standalone summary, print-friendly; open locally in a browser.
data.json — UTF-8 JSON, schemaVersion ${SCHEMA_VERSION}; whitelisted field values, metadata, evidence references, review issues and separate calculation results.
Inactive conditional draft fields are omitted; active blank fields remain blank.
Scalar text values are preserved. Structured evidence and default-value JSON is normalized to permitted properties; inactive default components and unrelated draft properties are omitted. Saved drafts are unchanged.
values.csv — UTF-8, quoted CSV, CRLF rows; field_id, label, raw_value, unit, hint.
evidence.csv — UTF-8, quoted CSV, CRLF rows; id, title, reference, version, period, owner, disclosure.
README.txt — this scope and handling note.
Evidence consists of references only. No referenced file or attachment is included or downloaded.
CSV cells that could execute as spreadsheet formulas have an apostrophe prefix; the corresponding values without this CSV safety prefix remain in data.json. CSV cells are quoted, including embedded quotes and newlines.

CALCULATION RULES
Only the confirmed reported unit tCO2e/t_goods is supported. No conversion is performed.
Optional lot net mass (t goods) × the corresponding reported specific embedded emissions (tCO2e/t goods) gives an indicative component result (tCO2e).
Direct and indirect results remain separate; no combined total is produced.
No precursor amounts are added automatically. The preparer must explain the contribution already included in the reported figures.
Blank or unknown values are not zero. Declared not applicable is distinct from unknown and needs goods-specific review.
Default or mixed data needs traceable provenance; the application does not select a default or assess markup treatment.

HUMAN REVIEW
Confirm recipient requirements, goods and CN classification, legal applicability, process boundary, attribution, production period and coverage.
Check the direct and indirect data bases separately and obtain the referenced evidence with appropriate disclosure permission.
Review declared non-applicability, default provenance, precursor treatment and verification evidence. The application does not verify emissions or check verifier accreditation.
This package is not a CBAM Registry import, a declaration, the statutory operator emissions report or an official Commission template. It does not calculate certificate requirements, carbon-price deductions or financial liability.

OFFICIAL SOURCES
${SOURCES.map((source) => `${source.title}\n${source.url}`).join('\n\n')}
Source links identify the guidance used for this preparation profile. Confirm current legislation and relevant-period source versions; links and guidance do not certify this package.

SNAPSHOT
Generated: ${data.metadata.generatedAt}
Project ID: ${data.metadata.projectId}
Report ID: ${data.metadata.reportId}
Template: ${data.metadata.templateCode}
Dataset version: ${data.metadata.datasetVersion}
Profile: ${data.metadata.profileVersion}
`
}

const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, byte) => {
  let crc = byte
  for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
  return crc >>> 0
})

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

/** Minimal ZIP STORE writer: fixed ASCII file paths, UTF-8 content, no ZIP64. */
function zipStore(files: { name: string; content: string }[]): Buffer {
  const local: Buffer[] = []
  const central: Buffer[] = []
  let offset = 0
  for (const file of files) {
    const name = Buffer.from(file.name, 'ascii')
    const content = Buffer.from(file.content, 'utf8')
    const checksum = crc32(content)
    if (offset + content.length + name.length + 30 > 0xffffffff) throw new Error('Package exceeds supported ZIP size')
    const header = Buffer.alloc(30)
    header.writeUInt32LE(0x04034b50, 0)
    header.writeUInt16LE(20, 4)
    header.writeUInt16LE(0x0800, 6)
    header.writeUInt16LE(0x0021, 12) // Fixed DOS date: 1980-01-01; generatedAt is in the package metadata.
    header.writeUInt32LE(checksum, 14)
    header.writeUInt32LE(content.length, 18)
    header.writeUInt32LE(content.length, 22)
    header.writeUInt16LE(name.length, 26)
    local.push(header, name, content)
    const directory = Buffer.alloc(46)
    directory.writeUInt32LE(0x02014b50, 0)
    directory.writeUInt16LE(20, 4)
    directory.writeUInt16LE(20, 6)
    directory.writeUInt16LE(0x0800, 8)
    directory.writeUInt16LE(0x0021, 14)
    directory.writeUInt32LE(checksum, 16)
    directory.writeUInt32LE(content.length, 20)
    directory.writeUInt32LE(content.length, 24)
    directory.writeUInt16LE(name.length, 28)
    directory.writeUInt32LE(offset, 42)
    central.push(directory, name)
    offset += header.length + name.length + content.length
  }
  const directory = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(directory.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...local, directory, end])
}

export function renderSupplierPackageZip(snapshot: SupplierPackageSnapshot): { bytes: Buffer; filename: string; contentType: 'application/zip' } {
  if (snapshot.profileVersion !== PACKAGE_PROFILE_VERSION) throw new Error('Unsupported supplier package profile')
  if (!snapshot.validation.isReady || snapshot.validation.issues.some((issue) => issue.severity === 'error')) throw new Error('Supplier package is not ready for recipient review')
  const data = exportData(snapshot)
  const files = [
    { name: 'summary.html', content: renderSummary(data) },
    { name: 'data.json', content: `${JSON.stringify(data, null, 2)}\n` },
    { name: 'values.csv', content: csv([['field_id', 'label', 'raw_value', 'unit', 'hint'], ...data.values.map((field) => [field.fieldId, field.label, field.rawValue, field.unit, field.hint])]) },
    { name: 'evidence.csv', content: csv([['id', 'title', 'reference', 'version', 'period', 'owner', 'disclosure'], ...data.evidence.map((entry) => [entry.id, entry.title, entry.reference, entry.version, entry.period, entry.owner, entry.disclosure])]) },
    { name: 'README.txt', content: renderReadme(data) },
  ]
  return { bytes: zipStore(files), filename: 'cbam-supplier-review-package-v1.zip', contentType: 'application/zip' }
}
