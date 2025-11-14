import { AssetType } from '@prisma/client'
import type { UploadResourceType } from '@/lib/uploads/resource-types'

export const RESOURCE_TYPE_TO_ASSET: Record<UploadResourceType, AssetType> = {
  org_logo: AssetType.ORG_LOGO,
  user_avatar: AssetType.USER_AVATAR,
}
