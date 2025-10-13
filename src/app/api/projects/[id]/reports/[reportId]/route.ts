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
import prisma from '@/lib/db'
import { getReportTemplate } from '@/lib/report-templates'
import { calculateCompletion } from '@/lib/dataset-validation'
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
  { params }: { params: Promise<{ projectId: string; reportId: string }> }
) {
  try {
    const { projectId, reportId } = await params

    // Fetch report with related project dataset
    const report = await prisma.report.findUnique({
      where: { id: reportId },
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
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Verify report belongs to project
    if (report.projectId !== projectId) {
      return NextResponse.json(
        { error: 'Report does not belong to this project' },
        { status: 403 }
      )
    }

    // Load report template
    const template = getReportTemplate(report.templateCode as ReportTemplateCode)
    if (!template) {
      return NextResponse.json(
        { error: `Invalid template code: ${report.templateCode}` },
        { status: 500 }
      )
    }

    // Extract all field IDs from template
    const templateFieldIds = new Set<string>()
    for (const section of template.sections) {
      for (const field of section.fields) {
        templateFieldIds.add(field.id)
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

    // Calculate completion based on template requirements
    const requiredFieldIds = template.sections
      .flatMap((s) => s.fields)
      .filter((f) => f.required)
      .map((f) => f.id)

    const completionPercentage = calculateCompletion(filteredDataset, requiredFieldIds)

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
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
