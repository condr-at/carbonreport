import prisma from '@/lib/db'
import { ApiError } from '@/lib/api-error'
import { AssetType } from '@prisma/client'

export async function ensureAssetOwnership(
  assetId: string,
  expectedType: AssetType,
  userId: string,
) {
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    select: {
      id: true,
      type: true,
      uploadedByUserId: true,
      url: true,
    },
  })

  if (!asset) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Asset not found', {
      asset_id: assetId,
    })
  }

  if (asset.type !== expectedType) {
    throw new ApiError(415, 'VALIDATION_ERROR', 'Asset type mismatch', {
      expected_type: expectedType,
      actual_type: asset.type,
    })
  }

  if (asset.uploadedByUserId !== userId) {
    throw new ApiError(403, 'FORBIDDEN', 'Asset belongs to a different user', {
      asset_id: assetId,
    })
  }

  return asset
}

export async function ensureUserAvatarAsset(assetId: string, userId: string) {
  return ensureAssetOwnership(assetId, AssetType.USER_AVATAR, userId)
}
