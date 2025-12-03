/**
 * API: Mailto Template Operations
 * 
 * GET /api/projects/[id]/mailto-template - Get project-wide mailto template
 * PUT /api/projects/[id]/mailto-template - Update project-wide mailto template
 * POST /api/projects/[id]/mailto-template/reset - Reset template to default
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { z } from 'zod'

// Validation schema for mailto template
const MailtoTemplateSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
})

/**
 * GET /api/projects/[id]/mailto-template
 * Returns project-wide mailto template
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
        mailtoTemplate: true,
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
      mailtoTemplate: project.mailtoTemplate || null,
    })
  } catch (error) {
    console.error('Error fetching mailto template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mailto template' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/projects/[id]/mailto-template
 * Updates project-wide mailto template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const body = await request.json()

    // Validate template structure
    const { subject, body: emailBody } = MailtoTemplateSchema.parse(body)

    // Update project mailto template
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        mailtoTemplate: { subject, body: emailBody },
      },
      select: {
        id: true,
        mailtoTemplate: true,
      },
    })

    return NextResponse.json({
      success: true,
      mailtoTemplate: updatedProject.mailtoTemplate,
      message: 'Mailto template updated successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating mailto template:', error)
    return NextResponse.json(
      { error: 'Failed to update mailto template' },
      { status: 500 }
    )
  }
}
