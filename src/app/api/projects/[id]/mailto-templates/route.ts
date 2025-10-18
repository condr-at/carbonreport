/**
 * API: Mailto Templates Operations
 * 
 * GET /api/projects/[id]/mailto-templates - Get all mailto templates for project
 * POST /api/projects/[id]/mailto-templates - Reset all templates to defaults
 * 
 * Key requirements from docs/Requirements v0.0.1.md Section 2.3:
 * - Templates stored in Project.mailtoTemplates JSONB
 * - Each field can have custom template with placeholders
 * - Placeholders: {{contact_name}}, {{user_name}}, {{data_point_label}}, {{deadline}}
 * - Reset reloads defaults from report template configs
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAllReportTemplates } from '@/lib/report-templates'

/**
 * GET /api/projects/[id]/mailto-templates
 * Returns all mailto templates for project (from Project.mailtoTemplates)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        mailtoTemplates: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      projectId: project.id,
      projectName: project.name,
      mailtoTemplates: project.mailtoTemplates || {},
    })
  } catch (error) {
    console.error('Error fetching mailto templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mailto templates' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects/[id]/mailto-templates
 * Resets all templates to defaults from report template configs
 * 
 * This extracts mailto templates from all report templates and overwrites
 * Project.mailtoTemplates with fresh defaults
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    // Load all report templates to get defaults
    const allTemplates = getAllReportTemplates()

    const defaultMailtoTemplates: Record<string, any> = {}

    // Extract mailto templates from each report template
    for (const template of allTemplates) {
      if (template.mailto) {
        // For each field in the template, assign the default mailto
        for (const section of template.sections) {
          for (const field of section.fields) {
            defaultMailtoTemplates[field.fieldId] = {
              subject: template.mailto.subject,
              body: template.mailto.body,
            }
          }
        }
      }
    }

    // Update project with reset templates
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { mailtoTemplates: defaultMailtoTemplates },
      select: {
        id: true,
        mailtoTemplates: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Mailto templates reset to defaults',
      mailtoTemplates: updatedProject.mailtoTemplates,
    })
  } catch (error) {
    console.error('Error resetting mailto templates:', error)
    return NextResponse.json(
      { error: 'Failed to reset mailto templates' },
      { status: 500 }
    )
  }
}
