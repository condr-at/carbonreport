import { OrganizationSettingsShellWithSuspense } from '../organization-settings-shell'
import { UsageTab } from './usage-tab-client'

export default function SettingsUsagePage() {
  return (
    <OrganizationSettingsShellWithSuspense
      activeTab="usage"
      renderContent={({ organizationId, currentOrganization, featureFlags }) => (
        <UsageTab
          organizationId={organizationId}
          plan={{
            code: currentOrganization.plan.code,
            label: currentOrganization.plan.label,
            valid_until: currentOrganization.plan.valid_until,
          }}
          billingUiEnabled={featureFlags.billingUiEnabled}
        />
      )}
    />
  )
}
