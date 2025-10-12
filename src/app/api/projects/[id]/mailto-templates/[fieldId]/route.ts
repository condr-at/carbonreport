/**
 * API: Update Mailto Template for Specific Field
 * 
 * PUT /api/projects/[id]/mailto-templates/[fieldId] - Update template for specific field
 * 
 * Request body: { subject: string, body: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { z } from 'zod'

// Validation schema for single template
const MailtoTemplateSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
})

/**
 * PUT /api/projects/[id]/mailto-templates/[fieldId]
 * Updates template for specific field
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  try {
    const { id: projectId, fieldId } = await params
    const body = await request.json()

    // Validate template structure
    const { subject, body: emailBody } = MailtoTemplateSchema.parse(body)

    // Fetch current templates
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { mailtoTemplates: true },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Update specific field template
    const currentTemplates = (project.mailtoTemplates || {}) as Record<string, any>
    currentTemplates[fieldId] = { subject, body: emailBody }

    // Save updated templates
    await prisma.project.update({
      where: { id: projectId },
      data: { mailtoTemplates: currentTemplates },
    })

    return NextResponse.json({
      success: true,
      fieldId,
      template: { subject, body: emailBody },
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
