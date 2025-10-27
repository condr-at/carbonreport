/**
 * API: Reset Mailto Template to Default
 * 
 * POST /api/projects/[id]/mailto-template/reset - Reset template to default from report templates
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getReportTemplate, type ReportTemplateCode } from '@/lib/report-templates'

/**
 * POST /api/projects/[id]/mailto-template/reset
 * Resets mailto template to default from first report template that has one
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    // Get project with its reports
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        reports: {
          select: {
            templateCode: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Find first report template that has mailto config
    let defaultMailtoTemplate: { subject: string; body: string } | null = null

    for (const report of project.reports) {
      const template = getReportTemplate(report.templateCode as ReportTemplateCode)
      if (template?.mailto) {
        defaultMailtoTemplate = {
          subject: template.mailto.subject,
          body: template.mailto.body,
        }
        break
      }
    }

    if (!defaultMailtoTemplate) {
      return NextResponse.json(
        { error: 'No default mailto template found in project reports' },
        { status: 404 }
      )
    }

    // Update project with default template
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { mailtoTemplate: defaultMailtoTemplate },
      select: {
        id: true,
        mailtoTemplate: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Mailto template reset to default',
      mailtoTemplate: updatedProject.mailtoTemplate,
    })
  } catch (error) {
    console.error('Error resetting mailto template:', error)
    return NextResponse.json(
      { error: 'Failed to reset mailto template' },
      { status: 500 }
    )
  }
}
