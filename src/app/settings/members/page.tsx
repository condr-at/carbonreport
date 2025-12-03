'use client'

import { OrganizationSettingsShellWithSuspense } from '../organization-settings-shell'
import { MembersTab } from './members-tab-client'

export default function SettingsMembersPage() {
  return (
    <OrganizationSettingsShellWithSuspense
      activeTab="members"
      renderContent={({ organizationId, currentOrganization, featureFlags }) => (
        <MembersTab
          organizationId={organizationId}
          limits={{
            max_editors: currentOrganization.plan.max_editors,
            max_verifiers: currentOrganization.plan.max_verifiers,
          }}
          featureFlags={featureFlags}
        />
      )}
    />
  )
}
