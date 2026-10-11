'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBatchSync } from '@/lib/sync/sync-manager'
import { projectKeys } from '@/lib/data-client/keys'
import {
  PACKAGE_FIELDS, isPackageFieldActive, validateSupplierPackage,
  type PackageValues, type EvidenceReference, type PackageField,
} from '@/lib/cbam/supplier-package'
import type { SupplierPackageSnapshot } from '@/lib/cbam/supplier-package-snapshot'

const STEPS = [
  { group: 'context', title: 'Recipient & period' },
  { group: 'installation', title: 'Installation' },
  { group: 'goods', title: 'Goods & boundaries' },
  { group: 'emissions', title: 'Emissions' },
  { group: 'evidence', title: 'Evidence' },
  { group: 'review', title: 'Review & download' },
] as const
const selectClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50'
const isDefault = (value: string) => value === 'default' || value === 'mixed'

function sameValues(a: PackageValues, b: PackageValues) {
  return PACKAGE_FIELDS.every(field => (a[field.id] ?? '') === (b[field.id] ?? ''))
}

function readArray<T>(value: string): T[] | null {
  if (!value.trim()) return []
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : null } catch { return null }
}

function EvidenceEditor({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (value: string) => void }) {
  const parsed = readArray<EvidenceReference>(value)
  const rows = parsed?.every(row => row && typeof row === 'object') ? parsed : null
  if (!rows) return <div className="space-y-2"><p role="alert">The saved evidence register needs repair. Its original text is preserved below.</p><textarea className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50" aria-label="Repair evidence register" value={value} disabled={disabled} onChange={event => onChange(event.target.value)} /></div>
  const change = (index: number, key: keyof EvidenceReference, next: string) => onChange(JSON.stringify(rows.map((row, i) => i === index ? { ...row, [key]: next } : row)))
  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">Record the exact document and location supporting each value. Files are sent separately; the package contains these references.</p>
    {rows.map((row, index) => <fieldset key={index} className="rounded-lg border p-4 space-y-3" disabled={disabled}>
      <legend className="px-1 text-sm font-medium">Evidence {index + 1}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {([
          ['id', 'Evidence ID'], ['title', 'Document title'], ['reference', 'URL or file / page reference'],
          ['version', 'Document version / date'], ['period', 'Period covered'], ['owner', 'Document owner'],
        ] as const).map(([key, title]) => <div key={key} className="space-y-1"><Label htmlFor={`evidence-${index}-${key}`}>{title}</Label><Input id={`evidence-${index}-${key}`} value={typeof row[key] === 'string' ? row[key] : ''} onChange={event => change(index, key, event.target.value)} /></div>)}
        <div className="space-y-1"><Label htmlFor={`evidence-${index}-disclosure`}>Permission to share reference</Label><select id={`evidence-${index}-disclosure`} className={selectClass} value={row.disclosure ?? 'unknown'} onChange={event => change(index, 'disclosure', event.target.value)}><option value="unknown">Not confirmed</option><option value="shareable">Confirmed for this recipient</option><option value="restricted">Restricted</option></select></div>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => onChange(JSON.stringify(rows.filter((_, i) => i !== index)))}>Remove evidence {index + 1}</Button>
    </fieldset>)}
    <Button type="button" variant="outline" disabled={disabled} onClick={() => onChange(JSON.stringify([...rows, { id: `evidence-${Array.from({ length: rows.length + 1 }, (_, i) => i + 1).find(i => !rows.some(row => row.id === `evidence-${i}`))}`, title: '', reference: '', version: '', period: '', owner: '', disclosure: 'unknown' }]))}>Add evidence reference</Button>
  </div>
}

type DefaultRow = { component: string; sourceId: string; version: string; row: string; markup: string }
function DefaultEditor({ values, disabled, onChange }: { values: PackageValues; disabled: boolean; onChange: (value: string) => void }) {
  const parsed = readArray<DefaultRow>(values.cbam_pkg_default_context ?? '')
  if (!parsed || parsed.some(row => !row || typeof row !== 'object')) return <div className="space-y-2"><p role="alert">The saved default provenance needs repair. Its original text is preserved below.</p><textarea className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50" aria-label="Repair default provenance" value={values.cbam_pkg_default_context ?? ''} disabled={disabled} onChange={event => onChange(event.target.value)} /></div>
  const components = [
    ...(isDefault(values.cbam_pkg_direct_basis) ? ['direct'] : []),
    ...(values.cbam_pkg_indirect_status === 'reported' && isDefault(values.cbam_pkg_indirect_basis) ? ['indirect'] : []),
  ]
  return <div className="space-y-4">{components.map(component => {
    const matches = parsed.map((row, index) => ({ row, index })).filter(item => item.row.component === component)
    const entries = matches.length ? matches : [{ row: { component, sourceId: '', version: '', row: '', markup: '' }, index: -1 }]
    return <fieldset key={component} disabled={disabled} className="rounded-lg border p-4 space-y-3">
      <legend className="px-1 text-sm font-medium">{component === 'direct' ? 'Direct' : 'Indirect'} default-value sources</legend>
      {entries.map(({ row, index }, entryIndex) => {
        const change = (key: keyof DefaultRow, value: string) => onChange(JSON.stringify(index < 0
          ? [...parsed, { ...row, [key]: value }]
          : parsed.map((item, i) => i === index ? { ...item, [key]: value } : item)))
        return <div key={entryIndex} className="space-y-3 border-b pb-4 last:border-b-0">
          <p className="text-sm font-medium">Source {entryIndex + 1}</p>
          {([
            ['sourceId', 'Evidence ID for the default table'], ['version', 'Exact edition / correction'],
            ['row', 'Country, CN code, year and table row'], ['markup', 'Markup treatment (already included or other treatment)'],
          ] as const).map(([key, title]) => <div key={key} className="space-y-1"><Label htmlFor={`default-${component}-${entryIndex}-${key}`}>{title}</Label><Input id={`default-${component}-${entryIndex}-${key}`} value={typeof row[key] === 'string' ? row[key] : ''} onChange={event => change(key, event.target.value)} /></div>)}
          {entries.length > 1 && <Button type="button" variant="outline" size="sm" onClick={() => onChange(JSON.stringify(parsed.filter((_, i) => i !== index)))}>Remove {component} source {entryIndex + 1}</Button>}
        </div>
      })}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange(JSON.stringify([...parsed, ...(matches.length ? [] : [entries[0].row]), { component, sourceId: '', version: '', row: '', markup: '' }]))}>Add {component} source</Button>
    </fieldset>
  })}</div>
}

export function CbamSupplierPackageClient({ projectId, reportId }: { projectId: string; reportId: string }) {
  const queryClient = useQueryClient()
  const { queue, isSyncing, isReady: syncReady, syncNow, retryFailed } = useBatchSync()
  const [snapshot, setSnapshot] = useState<SupplierPackageSnapshot | null>(null)
  const [values, setValues] = useState<PackageValues>({})
  const [expectedVersion, setExpectedVersion] = useState(0)
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [storageError, setStorageError] = useState('')
  const [notice, setNotice] = useState('')
  const [showIssues, setShowIssues] = useState(false)
  const endpoint = `/api/projects/${projectId}/reports/${reportId}/supplier-package`
  const draftKey = `cbam-supplier-draft:${projectId}:${reportId}`
  const dirty = Boolean(snapshot && !sameValues(values, snapshot.validation.values))
  const queueBlocked = !syncReady || isSyncing || queue.some(operation => operation.payload.projectId === projectId)
  const validation = useMemo(() => !dirty && snapshot ? snapshot.validation : validateSupplierPackage({ data_points: Object.entries(values).map(([field_id, value]) => ({ field_id, item_id: null, value })) }), [values, dirty, snapshot])
  const errors = validation.issues.filter(issue => issue.severity === 'error')
  const warnings = validation.issues.filter(issue => issue.severity === 'warning')
  const canEdit = Boolean(snapshot?.canEdit)

  const load = useCallback(async (restoreDraft: boolean) => {
    setLoading(true); setError('')
    try {
      const response = await fetch(endpoint, { cache: 'no-store' })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Could not load the supplier package.')
      const saved = body as SupplierPackageSnapshot
      setSnapshot(saved); setValues(saved.validation.values); setExpectedVersion(saved.datasetVersion)
      if (restoreDraft && saved.canEdit) {
        try {
          const cached = JSON.parse(sessionStorage.getItem(draftKey) ?? 'null')
          if (cached && Number.isSafeInteger(cached.expectedVersion) && cached.values && typeof cached.values === 'object') {
            const restored = { ...saved.validation.values }
            for (const field of PACKAGE_FIELDS) if (typeof cached.values[field.id] === 'string') restored[field.id] = cached.values[field.id]
            setValues(restored); setExpectedVersion(cached.expectedVersion)
            setNotice(cached.expectedVersion === saved.datasetVersion ? 'Your unsaved draft was restored in this tab.' : 'Your draft was restored, but saved data has changed. Copy any edits you need before reloading saved values.')
          }
        } catch { setStorageError('The draft in this tab could not be read. It has been preserved; saved data is shown.') }
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not load the supplier package.') }
    finally { setLoading(false) }
  }, [endpoint, draftKey])

  useEffect(() => { void load(true) }, [load])
  useEffect(() => {
    if (!snapshot || loading || !canEdit || storageError) return
    try {
      if (dirty) sessionStorage.setItem(draftKey, JSON.stringify({ expectedVersion, values }))
      else sessionStorage.removeItem(draftKey)
    } catch { setStorageError('This browser could not retain your draft. Save before leaving this page.') }
  }, [snapshot, loading, canEdit, dirty, draftKey, expectedVersion, values, storageError])
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const update = (id: string, value: string) => { setValues(previous => ({ ...previous, [id]: value })); setNotice('') }
  const save = async (advance = false) => {
    if (!snapshot || !canEdit || busy || loading || queueBlocked) return
    if (!dirty) { if (advance) setStep(previous => Math.min(previous + 1, STEPS.length - 1)); return }
    setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expectedDatasetVersion: expectedVersion, values }) })
      const body = await response.json()
      if (!response.ok) throw new Error(body.code === 'VERSION_CONFLICT' ? 'Saved data changed in another session. Your draft is kept. Copy any edits you need, then reload saved values before continuing.' : body.error ?? 'Saving failed. Your draft is kept; try again.')
      const saved = body as SupplierPackageSnapshot
      setSnapshot(saved); setValues(saved.validation.values); setExpectedVersion(saved.datasetVersion); setNotice('Draft saved.')
      try { sessionStorage.removeItem(draftKey); setStorageError('') } catch { /* The visible saved state remains authoritative. */ }
      void queryClient.invalidateQueries({ queryKey: projectKeys.dataset(projectId) })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      if (advance) setStep(previous => Math.min(previous + 1, STEPS.length - 1))
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Saving failed. Your draft is kept.') }
    finally { setBusy(false) }
  }
  const download = async () => {
    if (!snapshot || dirty || busy || loading || queueBlocked) return
    setBusy(true); setError('')
    try {
      const response = await fetch(`${endpoint}?format=zip&expectedDatasetVersion=${snapshot.datasetVersion}`, { cache: 'no-store' })
      if (!response.ok) {
        const body = await response.json()
        throw new Error(body.code === 'VERSION_CONFLICT' ? 'The saved data changed. Reload and review it before downloading.' : body.error ?? 'The saved data could not be exported. Review the checks and try again.')
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a'); link.href = url; link.download = `cbam-supplier-review-v${snapshot.datasetVersion}.zip`
      document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setNotice('Package downloaded. Share the referenced evidence separately with the authorised recipient.')
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Download failed; please try again.') }
    finally { setBusy(false) }
  }
  const reload = () => {
    if (dirty && !window.confirm('Reload saved values and replace the unsaved draft in this tab?')) return
    try { sessionStorage.removeItem(draftKey) } catch { /* A storage error is shown by the draft effect. */ }
    setNotice(''); setStorageError(''); void load(false)
  }
  const focusIssue = (fieldId: string) => {
    const field = PACKAGE_FIELDS.find(item => item.id === fieldId)
    if (!field) return
    setStep(STEPS.findIndex(item => item.group === field.group)); setShowIssues(true)
    window.setTimeout(() => document.getElementById(fieldId)?.focus(), 0)
  }
  const renderField = (field: PackageField) => {
    const issues = showIssues ? errors.filter(issue => issue.fieldId === field.id) : []
    const disabled = !canEdit || busy || loading
    const common = { id: field.id, disabled, 'aria-describedby': `${field.id}-hint${issues.length ? ` ${field.id}-errors` : ''}`, 'aria-invalid': issues.length > 0 }
    const input = field.id === 'cbam_pkg_evidence_json'
      ? <EvidenceEditor value={values[field.id] ?? ''} disabled={disabled} onChange={value => update(field.id, value)} />
      : field.id === 'cbam_pkg_default_context'
        ? <DefaultEditor values={values} disabled={disabled} onChange={value => update(field.id, value)} />
        : field.type === 'select'
          ? <select {...common} className={selectClass} value={values[field.id] ?? ''} onChange={event => update(field.id, event.target.value)}><option value="">Select an answer</option>{field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
          : field.type === 'textarea'
            ? <textarea className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50" {...common} rows={3} value={values[field.id] ?? ''} onChange={event => update(field.id, event.target.value)} />
            : <Input {...common} type={field.type === 'date' ? 'date' : 'text'} inputMode={field.type === 'number' ? 'decimal' : undefined} value={values[field.id] ?? ''} onChange={event => update(field.id, event.target.value)} />
    const hint = field.id === 'cbam_pkg_evidence_json' ? 'Link each stated emissions value to a document. Use its evidence ID in the emissions section.' : field.id === 'cbam_pkg_default_context' ? 'Record the precise default-value source for each relevant component.' : field.hint
    return <div key={field.id} className="space-y-2" id={field.type === 'json' ? field.id : `${field.id}-group`} tabIndex={field.type === 'json' ? -1 : undefined}>
      <Label htmlFor={field.type === 'json' ? undefined : field.id}>{field.label}{field.required ? ' *' : ''}</Label>
      <p id={`${field.id}-hint`} className="text-sm text-muted-foreground">{hint}</p>
      {input}
      {issues.length > 0 && <ul id={`${field.id}-errors`} className="text-sm text-destructive space-y-1">{issues.map(issue => <li key={issue.ruleId}>{issue.message}</li>)}</ul>}
    </div>
  }

  if (loading && !snapshot) return <p role="status" className="p-6">Loading supplier package…</p>
  if (!snapshot) return <Card><CardContent className="p-6 space-y-3"><p role="alert">{error || 'Package unavailable.'}</p><Button onClick={() => void load(true)}>Try again</Button></CardContent></Card>

  return <div className="mx-auto max-w-4xl space-y-5">
    <Card><CardHeader><CardTitle>CBAM Supplier Review Package</CardTitle><CardDescription>One product, one installation. Prepare reported values and evidence references for your recipient to review.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm">
      <p>This preparation package is separate from the official annual operator report, a CBAM declaration and external verification.</p>
      <p className="text-muted-foreground">{dirty ? 'Unsaved draft' : `Saved version ${snapshot.datasetVersion}`} · {validation.isReady ? 'Inputs ready for recipient review' : `${errors.length} checks need attention`}{validation.coverage === 'partial' ? ' · Provisional, partial-period data' : ''}</p>
      {!canEdit && <p>This project is read-only for your account. You can review and download saved data.</p>}
    </CardContent></Card>
    {queueBlocked && <div role="status" className="rounded-lg border p-4 space-y-2 text-sm"><p>Other dataset changes are still being saved. Finish saving them before saving or downloading this package.</p><Button variant="outline" size="sm" disabled={isSyncing || !syncReady} onClick={() => { retryFailed(projectId); void syncNow() }}>Save queued changes</Button></div>}
    {error && <div role="alert" className="rounded-lg border border-destructive p-4 text-sm space-y-2"><p>{error}</p><Button variant="outline" size="sm" onClick={reload} disabled={loading || busy || queueBlocked}>Reload saved values</Button></div>}
    {storageError && <p role="alert" className="text-sm text-destructive">{storageError}</p>}
    {notice && <p role="status" className="text-sm">{notice}</p>}
    {!error && expectedVersion !== snapshot.datasetVersion && <Button variant="outline" size="sm" onClick={reload} disabled={loading || busy || queueBlocked}>Reload saved values</Button>}
    <nav aria-label="Supplier package steps" className="flex flex-wrap gap-2">{STEPS.map((item, index) => <Button key={item.group} variant={step === index ? 'primary' : 'outline'} size="sm" aria-current={step === index ? 'step' : undefined} onClick={() => { setStep(index); if (item.group === 'review') setShowIssues(true) }}>{index + 1}. {item.title}</Button>)}</nav>
    <Card><CardHeader><CardTitle>{STEPS[step].title}</CardTitle><CardDescription>{step < 5 ? 'Save an incomplete draft at any time. Missing information stays visible in the review.' : 'These checks establish package completeness, not regulatory acceptance or verification.'}</CardDescription></CardHeader><CardContent className="space-y-6">
      {step < 5 ? PACKAGE_FIELDS.filter(field => field.group === STEPS[step].group && isPackageFieldActive(field.id, values)).map(renderField) : <>
        <div className="rounded-lg border p-4 space-y-2"><p className="font-medium">{validation.isReady ? 'Ready for recipient review' : 'Resolve these checks before downloading'}</p><p className="text-sm text-muted-foreground">The server checks the saved values again when you download. The package records its data version and preparation time.</p></div>
        {errors.length > 0 && <ul className="space-y-2">{errors.map((issue, index) => <li key={`${issue.ruleId}-${index}`}><button type="button" className="text-left text-sm text-destructive underline underline-offset-4" onClick={() => focusIssue(issue.fieldId)}>{issue.message}</button></li>)}</ul>}
        {warnings.length > 0 && <div className="space-y-2"><h3 className="font-medium">For the recipient to review</h3><ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">{warnings.map((issue, index) => <li key={`${issue.ruleId}-${index}`}>{issue.message}</li>)}</ul></div>}
        <div className="space-y-2"><h3 className="font-medium">Indicative lot emissions</h3><p className="text-sm text-muted-foreground">Optional lot mass × the reported specific emissions. Components are kept separate. No precursor emissions or annual certificate obligation is calculated here.</p><dl className="grid grid-cols-2 gap-2 text-sm"><dt>Lot net mass</dt><dd>{validation.calculations.massTonnes ?? 'Not provided'}{validation.calculations.massTonnes !== null ? ' t' : ''}</dd><dt>Direct component</dt><dd>{validation.calculations.directLotEmissions ?? 'Not calculated'}{validation.calculations.directLotEmissions !== null ? ' tCO2e' : ''}</dd><dt>Indirect component</dt><dd>{validation.calculations.indirectLotEmissions ?? 'Not calculated / not applicable'}{validation.calculations.indirectLotEmissions !== null ? ' tCO2e' : ''}</dd></dl></div>
        <div className="space-y-2"><h3 className="font-medium">Your ZIP contains</h3><p className="text-sm text-muted-foreground">A readable HTML summary, machine-readable JSON, values and evidence CSV files, and a README with scope and sources. Referenced documents are not attached. Confirm their sharing permissions and send the source files separately.</p></div>
        <Button onClick={() => void download()} disabled={loading || busy || dirty || queueBlocked || !snapshot.validation.isReady}>{busy ? 'Working…' : 'Download review package (.zip)'}</Button>
        {dirty && <p className="text-sm text-muted-foreground">Save your draft before downloading.</p>}
      </>}
    </CardContent></Card>
    <div className="flex flex-wrap items-center justify-between gap-3 pb-6"><Button variant="outline" disabled={loading || step === 0 || busy} onClick={() => setStep(previous => previous - 1)}>Previous</Button><div className="flex gap-2">{canEdit && <Button variant="outline" disabled={loading || busy || !dirty || queueBlocked} onClick={() => void save()}>{busy ? 'Saving…' : 'Save draft'}</Button>}{step < 5 && <Button disabled={loading || busy || (canEdit && queueBlocked)} onClick={() => canEdit ? void save(true) : setStep(previous => previous + 1)}>{canEdit && dirty ? 'Save & continue' : 'Continue'}</Button>}</div></div>
  </div>
}
