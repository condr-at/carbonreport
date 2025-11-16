import { OrganizationSettingsShellWithSuspense } from '../organization-settings-shell'
import { BillingTab } from './billing-tab-client'

export default function SettingsBillingPage() {
  return (
    <OrganizationSettingsShellWithSuspense
      activeTab="billing"
      renderContent={({ organizationId, currentOrganization, featureFlags }) => (
        <BillingTab
          organizationId={organizationId}
          organizationName={currentOrganization.display_name}
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
