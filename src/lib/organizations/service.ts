import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'
import { AssetType, Prisma, type PrismaClient } from '@prisma/client'
import { slugify } from '@/lib/slugify'

export async function ensureLogoAsset(assetId: string, userId: string) {
  const asset = await prisma.asset.findUnique({ where: { id: assetId } })

  if (!asset) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Logo asset not found', {
      asset_id: assetId,
    })
  }

  if (asset.type !== AssetType.ORG_LOGO) {
    throw new ApiError(415, 'VALIDATION_ERROR', 'Asset is not an organization logo', {
      asset_id: assetId,
      expected_type: AssetType.ORG_LOGO,
      actual_type: asset.type,
    })
  }

  if (asset.uploadedByUserId !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Logo asset belongs to a different user')
  }

  return asset
}

export async function generateUniqueOrganizationSlug(displayName: string) {
  const base = slugify(displayName)
  const fallbackBase = base.length ? base : 'organization'
  let candidate = fallbackBase
  let suffix = 1

  while (true) {
    const existing = await prisma.organization.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing) {
      return candidate
    }

    suffix += 1
    candidate = `${fallbackBase}-${suffix}`
  }
}

type PlanDefinitionInput = {
  planCode: string
  label: string
  description: string
  maxActiveProjects: number
  maxEditors: number
  maxVerifiers: number
  maxViewers: number | null
}

const DEFAULT_PLANS: PlanDefinitionInput[] = [
  {
    planCode: 'free',
    label: 'Free',
    description: 'Single project workspace',
    maxActiveProjects: 1,
    maxEditors: 0,
    maxVerifiers: 0,
    maxViewers: null,
  },
  {
    planCode: 'pro_beta',
    label: 'Pro Beta',
    description: 'Expanded seats and manual billing support',
    maxActiveProjects: 3,
    maxEditors: 2,
    maxVerifiers: 0,
    maxViewers: null,
  },
]

type PrismaExecutor = PrismaClient | Prisma.TransactionClient

export async function ensureDefaultPlans(executor: PrismaExecutor) {
  await Promise.all(
    DEFAULT_PLANS.map((plan) =>
      executor.planDefinition.upsert({
        where: { planCode: plan.planCode },
        create: {
          planCode: plan.planCode,
          label: plan.label,
          description: plan.description,
          maxActiveProjects: plan.maxActiveProjects,
          maxEditors: plan.maxEditors,
          maxVerifiers: plan.maxVerifiers,
          maxViewers: plan.maxViewers,
        },
        update: {},
      }),
    ),
  )
}
