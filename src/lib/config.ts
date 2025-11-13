function envBoolean(key: string, defaultValue: boolean) {
  const value = process.env[key]
  if (value === undefined) {
    return defaultValue
  }
  return value === '1' || value?.toLowerCase() === 'true'
}

export const featureFlags = {
  lazyDataset: envBoolean('NEXT_PUBLIC_LAZY_DATASET', false),
  lazyDataRequests: envBoolean('NEXT_PUBLIC_LAZY_DATA_REQUESTS', false),
  verifierRoleEnabled: envBoolean('NEXT_PUBLIC_VERIFIER_ROLE_ENABLED', false),
  billingUiEnabled: envBoolean('NEXT_PUBLIC_BILLING_UI_ENABLED', true),
  approvalsEnabled: envBoolean('NEXT_PUBLIC_APPROVALS_ENABLED', false),
} as const

export type FeatureFlagName = keyof typeof featureFlags

export function isFeatureEnabled(flag: FeatureFlagName): boolean {
  return featureFlags[flag]
}
