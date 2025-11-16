import { OrganizationSettingsShellWithSuspense } from '../organization-settings-shell'
import { DangerZoneTab } from './danger-zone-tab-client'

export default function SettingsDangerPage() {

  return (
    <OrganizationSettingsShellWithSuspense
      activeTab="danger"
      renderContent={({ organizationId, currentOrganization, refetch }) => (
        <DangerZoneTab
          organizationId={organizationId}
          slug={currentOrganization.slug}
          organizationName={currentOrganization.display_name}
          onDeleted={() => {
            refetch()
          }}
        />
      )}
    />
  )
}
