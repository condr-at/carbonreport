export const featureFlags = {
  lazyDataset: process.env.NEXT_PUBLIC_LAZY_DATASET === 'true',
  lazyDataRequests: process.env.NEXT_PUBLIC_LAZY_DATA_REQUESTS === 'true',
} as const;

export type FeatureFlagName = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlagName): boolean {
  return featureFlags[flag];
}
