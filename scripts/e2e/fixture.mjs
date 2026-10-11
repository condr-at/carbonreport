// Synthetic preparation data, not a regulatory or recipient-approved golden case.
export const evidence = {
  id: 'operator-1', title: 'Illustrative operator emissions statement',
  reference: 'OPS-2026-JAN, pages 1-5', version: '2026-02-01 revision 1',
  period: '2026-01-01 through 2026-01-31', owner: 'Northstar Metals', disclosure: 'shareable',
}
export const groups = [
  ['1. Recipient & period', {
    cbam_pkg_recipient: 'Example EU Importer', cbam_pkg_prepared_by: 'Northstar reporting team',
    cbam_pkg_supplier_role: 'operator', cbam_pkg_production_year: '2026',
    cbam_pkg_coverage_start: '2026-01-01', cbam_pkg_coverage_end: '2026-01-31',
  }],
  ['2. Installation', {
    cbam_operator_name: 'Northstar Metals', cbam_operator_contact: 'Operator reporting team',
    cbam_installation_country: 'Serbia', cbam_pkg_installation_name: 'Northstar works',
    cbam_pkg_installation_address: 'Example industrial road 1 — synthetic address',
  }],
  ['3. Goods & boundaries', {
    product_name: 'Hot-rolled steel coils', cbam_pkg_cn8: '72081000', cbam_pkg_cn_review: 'not_reviewed',
    cbam_pkg_boundary: 'Operator process attribution and saleable output; see OPS-2026-JAN.',
    cbam_pkg_precursor_statement: 'Reported direct value includes relevant precursor contribution.',
    cbam_pkg_lot_mass_tonnes: '12',
  }],
  ['4. Emissions', {
    cbam_pkg_unit: 'tCO2e/t_goods', cbam_pkg_direct_see: '2.5', cbam_pkg_direct_basis: 'actual',
    cbam_pkg_direct_source: 'operator-1', cbam_pkg_indirect_status: 'reported',
    cbam_pkg_indirect_see: '0.5', cbam_pkg_indirect_basis: 'actual', cbam_pkg_indirect_source: 'operator-1',
  }],
  ['5. Evidence', { cbam_pkg_verification_status: 'not_verified' }],
]
export const values = Object.assign({}, ...groups.map(([, fields]) => fields), { cbam_pkg_evidence_json: JSON.stringify([evidence]) })
