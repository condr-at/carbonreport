import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ApiError, ensureApiError, errorResponse } from '@/lib/api-error'
import { ensureUserAvatarAsset } from '@/lib/assets/service'
import {
  OrganizationMembershipInviteStatus,
  OrganizationMembershipRole,
  OrganizationStatus,
} from '@prisma/client'

const NAME_REGEX = /^[\p{L}\p{M}0-9'\-\s]+$/u

const UpdateSettingsSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1)
      .max(64)
      .regex(NAME_REGEX, 'First name contains unsupported characters')
      .nullable()
      .optional(),
    last_name: z
      .string()
      .trim()
      .min(1)
      .max(64)
      .regex(NAME_REGEX, 'Last name contains unsupported characters')
      .nullable()
      .optional(),
    job_title: z
      .string()
      .trim()
      .max(128)
      .nullable()
      .optional(),
    timezone: z
      .string()
      .trim()
      .min(1)
      .max(64)
      .nullable()
      .optional(),
    avatar_asset_id: z.string().uuid().nullable().optional(),
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'At least one field must be provided',
  })

function normalizeOptionalString(value: string | null | undefined) {
  if (value === undefined) {
    return undefined
  }

  if (value === null) {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function isValidTimezone(tz: string) {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

function buildUserPayload(user: any) {
  const fullName = user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
  const avatarUrl = user.avatarUrl ?? user.avatarAsset?.url ?? null
  const avatarAssetId = user.avatarAssetId ?? null

  return {
    id: user.id,
    email: user.email,
    name: fullName,
    first_name: user.firstName,
    last_name: user.lastName,
    job_title: user.jobTitle,
    timezone: user.timezone,
    avatar_url: avatarUrl,
    avatar_asset_id: avatarAssetId,
  }
}

type MembershipRecord = {
  role: OrganizationMembershipRole
  inviteStatus: OrganizationMembershipInviteStatus
  organization: {
    id: string
    displayName: string
    status: OrganizationStatus
  }
}

function mapMemberships(memberships: MembershipRecord[]) {
  return memberships.map((membership) => ({
    organization_id: membership.organization.id,
    display_name: membership.organization.displayName,
    role: membership.role,
    status: membership.organization.status.toLowerCase(),
    invite_status: membership.inviteStatus.toLowerCase(),
  }))
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    const [userRecord, memberships] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          jobTitle: true,
          timezone: true,
          avatarUrl: true,
          avatarAssetId: true,
          avatarAsset: {
            select: {
              url: true,
            },
          },
        },
      }),
      prisma.organizationMembership.findMany({
        where: {
          userId: user.id,
        },
        select: {
          role: true,
          inviteStatus: true,
          organization: {
            select: {
              id: true,
              displayName: true,
              status: true,
            },
          },
        },
        orderBy: [{ createdAt: 'asc' }],
      }),
    ])

    if (!userRecord) {
      throw new ApiError(404, 'NOT_FOUND', 'User settings unavailable')
    }

    const organizations = mapMemberships(memberships)

    return NextResponse.json({
      user: {
        ...buildUserPayload(userRecord),
        organizations,
      },
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to load user settings'))
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    const payload = await request.json().catch(() => ({}))
    const parsed = UpdateSettingsSchema.safeParse(payload)

    if (!parsed.success) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid settings payload', {
          issues: parsed.error.flatten(),
        }),
      )
    }

    const data = parsed.data

    if (data.timezone && !isValidTimezone(data.timezone)) {
      return errorResponse(
        new ApiError(400, 'VALIDATION_ERROR', 'Invalid timezone value', {
          timezone: data.timezone,
        }),
      )
    }

    if (data.avatar_asset_id) {
      await ensureUserAvatarAsset(data.avatar_asset_id, user.id)
    }

    const updateData: Record<string, string | null | undefined> = {}

    if (data.first_name !== undefined) {
      updateData.firstName = normalizeOptionalString(data.first_name)
    }

    if (data.last_name !== undefined) {
      updateData.lastName = normalizeOptionalString(data.last_name)
    }

    if (data.job_title !== undefined) {
      updateData.jobTitle = normalizeOptionalString(data.job_title)
    }

    if (data.timezone !== undefined) {
      updateData.timezone = normalizeOptionalString(data.timezone)
    }

    if (data.avatar_asset_id !== undefined) {
      updateData.avatarAssetId = data.avatar_asset_id
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined),
      ),
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        jobTitle: true,
        timezone: true,
        avatarUrl: true,
          avatarAssetId: true,
        avatarAsset: {
          select: {
            url: true,
          },
        },
      },
    })

    return NextResponse.json({
      user: buildUserPayload(updatedUser),
    })
  } catch (error) {
    return errorResponse(ensureApiError(error, 'Failed to update user settings'))
  }
}
