import { NextRequest, NextResponse } from 'next/server'
import { OrganizationMembershipRole, Prisma, ProjectStatus } from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { requireProjectForDataset } from '@/lib/projects/dataset-guards'
import { assertOrgMembership } from '@/lib/server-utils'
import {
  PACKAGE_FIELDS,
  PACKAGE_PROFILE_VERSION,
  mergePackageValues,
  validateSupplierPackage,
  type PackageValues,
} from '@/lib/cbam/supplier-package'
import type { SupplierPackageSnapshot } from '@/lib/cbam/supplier-package-snapshot'

export const runtime = 'nodejs'

type RouteContext = { params: Promise<{ id: string; reportId: string }> }
const TEMPLATE_CODE = 'CBAM_DATA_PACKAGE' as const
const CACHE_CONTROL = 'private, no-store'
const MAX_BODY_BYTES = 256 * 1024
const MAX_VALUE_LENGTH = 32768
const FIELD_IDS = new Set(PACKAGE_FIELDS.map((field) => field.id))
const EDIT_ROLES: OrganizationMembershipRole[] = [
  OrganizationMembershipRole.OWNER,
  OrganizationMembershipRole.ADMIN,
  OrganizationMembershipRole.EDITOR,
]

function failure(error: unknown) {
  const response = errorResponse(ensureApiError(error))
  response.headers.set('Cache-Control', CACHE_CONTROL)
  return response
}

function conflict(currentVersion?: number) {
  return new ApiError(409, 'VERSION_CONFLICT', 'Project data changed. Reload the saved package before continuing.',
    currentVersion === undefined ? undefined : { currentVersion })
}

function assertVersion(expected: number | undefined, current: number) {
  if (expected !== undefined && expected !== current) throw conflict(current)
}

function parseQuery(request: NextRequest) {
  const query = request.nextUrl.searchParams
  const format = query.get('format') ?? 'json'
  if (!['json', 'zip'].includes(format) || query.getAll('format').length > 1) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Format must be json or zip')
  }
  const rawVersion = query.get('expectedDatasetVersion')
  if (query.getAll('expectedDatasetVersion').length > 1 ||
      (rawVersion !== null && (!/^\d+$/.test(rawVersion) || !Number.isSafeInteger(Number(rawVersion))))) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'expectedDatasetVersion must be a non-negative integer')
  }
  if (format === 'zip' && rawVersion === null) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'expectedDatasetVersion is required for download')
  }
  return { format, expectedVersion: rawVersion === null ? undefined : Number(rawVersion) }
}

async function readDraft(request: NextRequest): Promise<{ expectedDatasetVersion: number; values: PackageValues }> {
  const tooLarge = () => new ApiError(413, 'VALIDATION_ERROR', 'Package draft exceeds the 256 KiB request limit')
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw tooLarge()
  if (!request.body) throw new ApiError(400, 'VALIDATION_ERROR', 'A JSON draft is required')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_BODY_BYTES) {
        await reader.cancel()
        throw tooLarge()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  let body: unknown
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new ApiError(400, 'VALIDATION_ERROR', 'A valid JSON draft is required')
  }
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
      Object.keys(body).some((key) => !['expectedDatasetVersion', 'values'].includes(key))) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Draft must contain only expectedDatasetVersion and values')
  }
  const { expectedDatasetVersion, values } = body as Record<string, unknown>
  if (typeof expectedDatasetVersion !== 'number' || !Number.isSafeInteger(expectedDatasetVersion) || expectedDatasetVersion < 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'expectedDatasetVersion must be a non-negative integer')
  }
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'values must be an object of package field strings')
  }
  const entries = Object.entries(values)
  if (!entries.length || entries.length > FIELD_IDS.size ||
      entries.some(([key, value]) => !FIELD_IDS.has(key) || typeof value !== 'string' || value.length > MAX_VALUE_LENGTH)) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Use known package fields with string values of at most 32768 characters')
  }
  return { expectedDatasetVersion, values: Object.fromEntries(entries) as PackageValues }
}

async function readAuthorizedReport(userId: string, projectId: string, reportId: string, writable: boolean) {
  // The shared guard reads metadata only. No report or dataset is read before authorization.
  const guarded = await requireProjectForDataset(userId, projectId, {
    role: writable ? OrganizationMembershipRole.EDITOR : OrganizationMembershipRole.VIEWER_READONLY,
    requireWritable: writable,
  })
  const membership = await assertOrgMembership(userId, guarded.organizationId,
    writable ? OrganizationMembershipRole.EDITOR : OrganizationMembershipRole.VIEWER_READONLY)
  const report = await prisma.report.findFirst({
    where: { id: reportId, projectId, templateCode: TEMPLATE_CODE },
    select: {
      id: true,
      project: { select: { id: true, name: true, dataset: true, datasetVersion: true, status: true } },
    },
  })
  if (!report) throw new ApiError(404, 'NOT_FOUND', 'Supplier package report not found')
  if (report.project.status === ProjectStatus.DELETED || (writable && report.project.status === ProjectStatus.REPORTED)) {
    throw new ApiError(409, 'CONFLICT', 'Project data is no longer writable or available')
  }
  return { report, canEdit: EDIT_ROLES.includes(membership.role) && report.project.status !== ProjectStatus.REPORTED }
}

function snapshot(
  project: { id: string; name: string; datasetVersion: number; dataset: unknown },
  reportId: string,
  canEdit: boolean,
): SupplierPackageSnapshot {
  const now = new Date()
  return {
    projectId: project.id,
    projectName: project.name,
    reportId,
    templateCode: TEMPLATE_CODE,
    datasetVersion: project.datasetVersion,
    generatedAt: now.toISOString(),
    profileVersion: PACKAGE_PROFILE_VERSION,
    validation: validateSupplierPackage(project.dataset, { now }),
    canEdit,
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()
    const { id, reportId } = await params
    const { format, expectedVersion } = parseQuery(request)
    const { report, canEdit } = await readAuthorizedReport(user.id, id, reportId, false)
    assertVersion(expectedVersion, report.project.datasetVersion)
    const saved = snapshot(report.project, report.id, canEdit)
    if (format === 'zip') {
      if (!saved.validation.isReady) {
        throw new ApiError(422, 'VALIDATION_ERROR', 'Resolve package validation errors before downloading', {
          issues: saved.validation.issues,
        })
      }
      const { renderSupplierPackageZip } = await import('@/lib/cbam/supplier-package-export')
      const archive = renderSupplierPackageZip(saved)
      return new NextResponse(new Uint8Array(archive.bytes), {
        headers: {
          'Content-Type': archive.contentType,
          'Content-Disposition': `attachment; filename="${archive.filename}"`,
          'Cache-Control': CACHE_CONTROL,
          'X-Content-Type-Options': 'nosniff',
        },
      })
    }
    return NextResponse.json(saved, { headers: { 'Cache-Control': CACHE_CONTROL } })
  } catch (error) {
    return failure(error)
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser()
    const { id, reportId } = await params
    const { report, canEdit } = await readAuthorizedReport(user.id, id, reportId, true)
    const { expectedDatasetVersion, values } = await readDraft(request)
    assertVersion(expectedDatasetVersion, report.project.datasetVersion)
    let dataset: ReturnType<typeof mergePackageValues>
    try {
      dataset = mergePackageValues(report.project.dataset, values)
    } catch {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Project dataset cannot be updated safely; review its package fields')
    }
    // Drafts may be incomplete; readiness only gates the download. Validate before committing.
    const saved = snapshot({ ...report.project, dataset }, report.id, canEdit)
    try {
      const updated = await prisma.project.update({
        where: {
          id,
          datasetVersion: expectedDatasetVersion,
          status: { notIn: [ProjectStatus.REPORTED, ProjectStatus.DELETED] },
          organization: { status: { not: 'DELETED' } },
        },
        data: { dataset: dataset as Prisma.InputJsonValue, datasetVersion: { increment: 1 } },
        select: { datasetVersion: true },
      })
      saved.datasetVersion = updated.datasetVersion
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') throw conflict()
      throw error
    }
    return NextResponse.json(saved, { headers: { 'Cache-Control': CACHE_CONTROL } })
  } catch (error) {
    return failure(error)
  }
}
