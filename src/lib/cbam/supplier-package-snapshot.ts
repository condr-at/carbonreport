import type { SupplierPackageValidation } from './supplier-package'

/** Saved, server-validated view of one CBAM supplier package in Project.dataset. */
export interface SupplierPackageSnapshot {
  projectId: string
  projectName: string
  reportId: string
  templateCode: 'CBAM_DATA_PACKAGE'
  datasetVersion: number
  generatedAt: string
  profileVersion: string
  validation: SupplierPackageValidation
  canEdit: boolean
}
