/**
 * API: Report Operations
 * 
 * GET /api/projects/[projectId]/reports/[reportId] - Get report with filtered dataset
 * 
 * Key requirements from docs/Requirements v0.0.1.md Section 2.3:
 * - Reports are VIEWS on Project.dataset
 * - Load templateCode → filter dataset by template field_ids
 * - Report.data field REMOVED (all data in Project.dataset)
 * - Calculate completion dynamically
 * - Report.metadata stores UI settings only (sort order, filters, etc)
 */

import { NextRequest, NextResponse } from 'next/server'
import { OrganizationMembershipRole } from '@prisma/client'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { requireProjectForDataset } from '@/lib/projects/dataset-guards'
import { getReportTemplate } from '@/lib/report-templates'
import { getReportCompletion } from '@/lib/report-completion'
import type { Dataset } from '@/lib/dataset-validation'
import type { ReportTemplateCode } from '@/lib/report-templates/types'

/**
 * GET /api/projects/[projectId]/reports/[reportId]
 * Returns report with filtered dataset
 * 
 * Response structure:
 * - reportInfo: Report metadata (id, name, templateCode, status, created_at)
 * - template: Full template configuration
 * - dataset: Filtered data_points matching template field_ids
 * - completion: { filled, required, percentage }
 * - metadata: UI settings from Report.metadata
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reportId: string }> }
) {
  try {
    const user = await getCurrentUser()
    const { id, reportId } = await params
    const projectId = id
    await requireProjectForDataset(user.id, projectId, {
      role: OrganizationMembershipRole.VIEWER_READONLY,
    })

    // Read the dataset only after access checks, and scope the report to this project.
    const report = await prisma.report.findFirst({
      where: { id: reportId, projectId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            dataset: true,
            datasetVersion: true,
          },
        },
      },
    })

    if (!report) {
      throw new ApiError(404, 'NOT_FOUND', 'Report not found')
    }

    // Load report template
    const template = getReportTemplate(report.templateCode as ReportTemplateCode)
    if (!template) {
      throw new ApiError(500, 'INTERNAL_ERROR', 'Report template is unavailable')
    }

    // Extract all field IDs from template
    const templateFieldIds = new Set<string>()
    for (const section of template.sections) {
      for (const field of section.fields) {
        templateFieldIds.add(field.fieldId)
      }
    }

    // Filter Project.dataset to include only fields from this template
    const projectDataset = report.project.dataset as Dataset
    const filteredDataPoints = projectDataset.data_points.filter((dp) =>
      templateFieldIds.has(dp.field_id)
    )

    const filteredDataset: Dataset = {
      data_points: filteredDataPoints,
    }

    const completionPercentage = getReportCompletion(filteredDataset, template).percentage

    return NextResponse.json({
      reportInfo: {
        id: report.id,
        projectId: report.projectId,
        templateCode: report.templateCode,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
      },
      template: {
        code: template.code,
        name: template.name,
        version: template.version,
        description: template.description,
        sections: template.sections,
      },
      dataset: filteredDataset,
      datasetVersion: report.project.datasetVersion, // For optimistic locking when updating
      completion: completionPercentage, // 0-100 percentage
      metadata: report.metadata || {}, // UI settings (sort, filters, etc)
    }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to fetch report'))
  }
}
