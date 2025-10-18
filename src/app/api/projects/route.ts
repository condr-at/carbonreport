/**
 * API: Projects
 * 
 * GET /api/projects - List all projects
 * POST /api/projects - Create new project
 * 
 * Creates a new project with:
 * - Empty dataset structure
 * - Default mailto templates from selected report templates
 * - datasetVersion = 0
 * - Empty checklist
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { z } from 'zod'
import { getReportTemplate } from '@/lib/report-templates'
import { createEmptyDataset } from '@/lib/dataset-validation'

// Request schema
const CreateProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  templateCodes: z.array(z.string()).min(1, 'At least one report type is required'),
  userId: z.string().uuid(), // TODO: Get from JWT session
})

/**
 * GET /api/projects
 * Returns list of all projects for current user
 * 
 * TODO: Filter by userId from JWT session
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from JWT session
    // For now, return all projects
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null, // Only active projects
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        datasetVersion: true,
        checklist: true, // Include checklist for roadmap
        reports: {
          select: {
            id: true,
            templateCode: true,
            completion: true,
          },
        },
        _count: {
          select: {
            reports: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        reportsCount: p._count.reports,
        datasetVersion: p.datasetVersion,
        createdAt: p.createdAt,
        checklist: p.checklist, // For roadmap widget
        reports: p.reports, // For completion calculation
      })),
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { name, templateCodes, userId } = CreateProjectSchema.parse(body)

    // ⚠️ TEMPORARY DEV WORKAROUND - Remove before production!
    // Auto-create user if doesn't exist (bypasses foreign key constraint for testing)
    // TODO: Replace with proper JWT session validation (see docs/API_REFERENCE.md)
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: 'Dev User',
        email: 'dev@carbonreport.app',
        passwordHash: 'dev-hash',
      },
    })

    // Generate default mailto templates from selected report templates
    const mailtoTemplates: Record<string, string> = {}
    
    for (const code of templateCodes) {
      const template = getReportTemplate(code as any)
      if (!template) {
        return NextResponse.json(
          { error: `Invalid template code: ${code}` },
          { status: 400 }
        )
      }

      // Extract mailto template from report template
      if (template.mailto) {
        // For now, apply same mailto template to all fields in this report
        template.sections.forEach(section => {
          section.fields.forEach(field => {
            if (!mailtoTemplates[field.fieldId]) {
              mailtoTemplates[field.fieldId] = template.mailto!.body
            }
          })
        })
      }
    }

    // Create project with proper initialization
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        status: 'ACTIVE',
        dataset: createEmptyDataset(), // { data_points: [] }
        datasetVersion: 0, // Optimistic locking counter
        mailtoTemplates, // Per-project mailto customization
        checklist: {
          items: [], // Will be populated in background (post-MVP)
        },
      },
    })

    // Create report records for selected templates
    const reports = await Promise.all(
      templateCodes.map(code =>
        prisma.report.create({
          data: {
            projectId: project.id,
            templateCode: code,
            completion: 0,
            metadata: undefined, // No custom settings yet
          },
        })
      )
    )

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        datasetVersion: project.datasetVersion,
        createdAt: project.createdAt,
      },
      reports: reports.map((r) => ({
        id: r.id,
        templateCode: r.templateCode,
        completion: r.completion,
      })),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
