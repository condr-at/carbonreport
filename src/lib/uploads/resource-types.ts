export const UPLOAD_RESOURCE_TYPES = ['org_logo', 'user_avatar'] as const

export type UploadResourceType = (typeof UPLOAD_RESOURCE_TYPES)[number]
