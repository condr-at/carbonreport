'use client'

import { OrganizationSettingsShellWithSuspense } from '../organization-settings-shell'
import { OrganizationProfileTab } from './profile-tab-client'

export default function SettingsProfilePage() {
  return (
    <OrganizationSettingsShellWithSuspense
      activeTab="profile"
      renderContent={({ organizationId, currentOrganization }) => (
        <OrganizationProfileTab
          organizationId={organizationId}
          organization={{
            display_name: currentOrganization.display_name,
            description: currentOrganization.description,
            slug: currentOrganization.slug,
            logo_asset_id: currentOrganization.logo_asset_id,
            logo_url: currentOrganization.logo_url,
            plan: {
              label: currentOrganization.plan.label,
              code: currentOrganization.plan.code,
              valid_until: currentOrganization.plan.valid_until,
            },
          }}
        />
      )}
    />
  )
}
