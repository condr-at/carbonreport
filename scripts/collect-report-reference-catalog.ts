import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { getAllReportTemplates } from '../src/lib/report-templates'
import { USER_FACING_REPORT_META, USER_FACING_REPORT_TEMPLATE_ORDER } from '../src/lib/report-templates/user-facing'

// Captures implemented metadata only: required flags are not normative requirements.
const checkedOn = process.argv[2]
if (!checkedOn || !/^\d{4}-\d{2}-\d{2}$/.test(checkedOn)) {
  throw new Error('Usage: tsx scripts/collect-report-reference-catalog.ts YYYY-MM-DD (review date)')
}
const root = process.cwd()
const base = 'src/lib/report-templates'
const generated = fs.readFileSync(path.join(root, base, 'generated/index.ts'), 'utf8')
const imports = new Map([...generated.matchAll(/import \{ (\w+) \} from '\.\/([^']+)';/g)].map(m => [m[1], m[2]]))
const sourcePaths = new Map([...generated.matchAll(/^  '([^']+)': (\w+),/gm)].map(m => [m[1], `${base}/generated/${imports.get(m[2])}.ts`]))
sourcePaths.set('CBAM', `${base}/cbam.ts`)
sourcePaths.set('ISO14067', `${base}/iso14067.ts`)
sourcePaths.set('CBAM_DATA_PACKAGE', `${base}/cbam-data-package.ts`)
const typeText = fs.readFileSync(path.join(root, base, 'types.ts'), 'utf8').split('export type ReportTemplateCode =')[1]
const declared = [...typeText.matchAll(/'([^']+)'/g)].map(m => m[1])
const reports = getAllReportTemplates().map(t => {
  const fields = t.sections.flatMap(s => s.fields)
  const sourcePath = sourcePaths.get(t.code)!
  return {
    code: t.code, name: t.name, user_facing: USER_FACING_REPORT_META[t.code] ?? null,
    scope: t.scope, implementation_version: t.version ?? null, source_path: sourcePath,
    source_sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, sourcePath))).digest('hex'),
    field_count: new Set(fields.map(f => f.fieldId)).size,
    required_count: new Set(fields.filter(f => f.isRequired).map(f => f.fieldId)).size,
    sections: t.sections.map(s => ({ key: s.key, title: s.title, config: s.config ?? null, fields: s.fields })),
  }
}).sort((a, b) => a.code.localeCompare(b.code))
const active = new Set<string>(reports.map(t => t.code))
const out = {
  captured_on: checkedOn, description: 'Snapshot of actual registered code; not validated regulatory requirements or release commitments.',
  active_count: reports.length, reports,
  type_only_codes: declared.filter(code => !active.has(code)).sort(),
  user_facing_without_registry: USER_FACING_REPORT_TEMPLATE_ORDER.filter(code => !active.has(code)),
  registry_without_user_facing: reports.filter(t => !USER_FACING_REPORT_TEMPLATE_ORDER.includes(t.code)).map(t => t.code),
}
const dest = path.join(root, 'docs/report-reference/code-catalog.json')
fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n')
console.log(`Captured ${reports.length} active templates and ${out.type_only_codes.length} type-only codes into ${dest}`)
