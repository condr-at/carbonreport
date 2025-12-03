// Centralizes which report templates are visible to end users and
// how they are described/explained inside the UI. This is the single
// source of truth for template naming, grouping, and ordering.
import { ReportTemplateCode } from './types';

export interface UserFacingReportMeta {
  title: string;
  subtitle: string;
  useWhen: string;
}

export const USER_FACING_REPORT_TEMPLATE_ORDER: ReportTemplateCode[] = [
  // Product — CBAM stack
  'CBAM_REPORT',
  'CBAM',
  'CBAM_DATA_PACKAGE',
  'CBAM_PREP_METHOD',
  'CBAM_ALLOWANCES',
  'CBAM_MONITORING_ALERT',
  // Product — LCA / product-level deliverables
  'PRODUCT_PCF',
  'ISO14067',
  'ISO_14067',
  'EPD',
  'BUILDING_CARBON_FOOTPRINT',
  'CARBON_NEUTRAL_CERT',
  'BCORP_IMPACT_ASSESSMENT',
  // Corporate & regulatory disclosures
  'CSRD',
  'EU_ETS',
  'EU_MRV',
  'SEC_CLIMATE',
  'UK_SECR',
  'UK_TCFD',
  'SFDR',
  'HKEX_ESG',
  'IFRS_S2_CLIMATE',
  'ISO_14064_CERT',
  'CORP_GHG',
  'CORP_GHG_VERIFIED',
  'CORP_GHG_PUBLIC',
  'CORP_GHG_INTERNAL',
  'CORP_GHG_ANNUAL',
  'CORP_GHG_SIMPLIFIED',
  'TCFD_REPORT',
  'CORSIA',
  'CDP_DISCLOSURE',
  'GRESB_ASSESSMENT',
  'ECOVADIS_SCORE',
  'SBTI_COMMITMENT',
  'RE100_REPORTING',
  'CLIMATE_ACTION_PLAN',
  'RECS_STRATEGY',
  'PPA_STRATEGY',
  'ENERGY_AUDIT_SCOPE12',
  'SCOPE2_DETAILED',
  'SCOPE3_DETAILED',
  'SCOPE3_CATEGORY1_SUPPLIERS',
  'CLIENT_SCOPE3_PACKAGE',
  'SCOPE123_DATASET',
  'CLIENT_TEMPLATE_FILL',
  'BANK_TEMPLATE_FILL',
  'PREP_GHG',
];

export const USER_FACING_REPORT_META: Partial<Record<ReportTemplateCode, UserFacingReportMeta>> = {
  CBAM_REPORT: {
    title: 'CBAM Quarterly Declaration',
    subtitle: 'Official Annex IV filing for the EU CBAM transitional registry.',
    useWhen: 'Submit embedded emissions, certificates, and third-country carbon price data each quarter.',
  },
  CBAM: {
    title: 'CBAM Importer Summary',
    subtitle: 'Narrative CBAM report for stakeholders outside the registry UI.',
    useWhen: 'Share a CBAM-ready PDF with importers, auditors, or executives when XML upload happens elsewhere.',
  },
  CBAM_DATA_PACKAGE: {
    title: 'CBAM Data Package',
    subtitle: 'Evidence locker for CN codes, BoMs, invoices, and lab tests.',
    useWhen: 'Hand regulators or customers the raw calculations that support the declaration.',
  },
  CBAM_PREP_METHOD: {
    title: 'CBAM Prep Checklist',
    subtitle: 'Internal QA checklist before filing.',
    useWhen: 'Track which CBAM data points are sourced, reviewed, and referenced ahead of submission.',
  },
  CBAM_ALLOWANCES: {
    title: 'CBAM Allowance Ledger',
    subtitle: 'Certificate balance and forecast dashboard.',
    useWhen: 'Plan free allocations, purchases, and surrender obligations during the definitive phase.',
  },
  CBAM_MONITORING_ALERT: {
    title: 'CBAM Monitoring Alerts',
    subtitle: 'Monitoring-plan and supplier data watchlist.',
    useWhen: 'Highlight missing supplier data or fallback methodologies before the reporting window closes.',
  },
  PRODUCT_PCF: {
    title: 'Product Carbon Footprint (GHG Protocol)',
    subtitle: 'GHG Protocol Product Standard-aligned disclosure.',
    useWhen: 'Provide customers or internal teams with cradle-to-gate/cradle-to-grave results without formal certification.',
  },
  ISO14067: {
    title: 'ISO 14067 Product Carbon Footprint',
    subtitle: 'Curated layout for ISO 14067 attestations.',
    useWhen: 'Deliver ISO-branded reports for tenders or verification engagements.',
  },
  ISO_14067: {
    title: 'ISO 14067 (Dataset Layout)',
    subtitle: 'Auto-generated template mapped directly from the data matrix.',
    useWhen: 'Need a data-complete export that mirrors the dataset structure without custom design.',
  },
  EPD: {
    title: 'Environmental Product Declaration (EPD)',
    subtitle: 'EN 15804 / ISO 14025 verified disclosure.',
    useWhen: 'Share product LCAs with green-building certifiers or procurement teams requiring published EPDs.',
  },
  BUILDING_CARBON_FOOTPRINT: {
    title: 'Building Life Cycle Assessment',
    subtitle: 'EN 15978 whole-building embodied + operational carbon view.',
    useWhen: 'Support permitting, LEED/BREEAM submissions, or investor updates for construction projects.',
  },
  CARBON_NEUTRAL_CERT: {
    title: 'Carbon Neutral Certification Dossier',
    subtitle: 'PAS 2060 / neutrality evidence pack.',
    useWhen: 'Document reductions, offsets, and statements needed to claim carbon neutrality.',
  },
  BCORP_IMPACT_ASSESSMENT: {
    title: 'B Corp Impact Assessment Pack',
    subtitle: 'Structured responses for B Lab verification.',
    useWhen: 'Prepare sustainability responses and evidence files ahead of the official B Corp review.',
  },
  CSRD: {
    title: 'CSRD Sustainability Statement',
    subtitle: 'ESRS-compliant annual disclosure.',
    useWhen: 'EU companies preparing mandatory Corporate Sustainability Reporting Directive filings.',
  },
  EU_ETS: {
    title: 'EU ETS Annual Emissions Report',
    subtitle: 'Verified installation emissions and allowance summary.',
    useWhen: 'Operators submitting data to national administrators under the EU ETS.',
  },
  EU_MRV: {
    title: 'EU MRV Shipping Report',
    subtitle: 'Fuel and emissions monitoring for maritime operators.',
    useWhen: 'Ship owners subject to EU MRV rules prior to ETS onboarding.',
  },
  SEC_CLIMATE: {
    title: 'SEC Climate Disclosure',
    subtitle: 'US SEC Subpart 1500 climate filing.',
    useWhen: 'US-listed companies preparing Form 10-K climate sections once the rule goes live.',
  },
  UK_SECR: {
    title: 'UK SECR Report',
    subtitle: 'Streamlined Energy and Carbon Reporting package.',
    useWhen: 'UK entities meeting SECR thresholds for Companies House submissions.',
  },
  UK_TCFD: {
    title: 'UK TCFD Report',
    subtitle: 'Mandatory TCFD-aligned disclosure for UK premium listings.',
    useWhen: 'Provide the PRA/FCA-ready TCFD narrative to investors and regulators.',
  },
  SFDR: {
    title: 'SFDR PAI Statement',
    subtitle: 'EU Sustainable Finance Disclosure Regulation annex.',
    useWhen: 'Asset managers publishing Principal Adverse Impact indicators each reporting year.',
  },
  HKEX_ESG: {
    title: 'HKEX ESG Report',
    subtitle: 'Hong Kong Listing Rule (Appendix 27) compliance.',
    useWhen: 'HK-listed issuers preparing yearly ESG statements.',
  },
  IFRS_S2_CLIMATE: {
    title: 'IFRS S2 Climate Disclosure',
    subtitle: 'ISSB baseline report.',
    useWhen: 'Multinationals adopting IFRS S2 templates ahead of jurisdictional mandates.',
  },
  ISO_14064_CERT: {
    title: 'ISO 14064-1 Corporate GHG Report',
    subtitle: 'Assurance-ready corporate inventory.',
    useWhen: 'Support ISO 14064 certification or third-party verification engagements.',
  },
  CORP_GHG: {
    title: 'Corporate GHG Inventory (Full)',
    subtitle: 'Scopes 1–3 with methodology notes.',
    useWhen: 'Provide a baseline inventory for strategy work or voluntary disclosure.',
  },
  CORP_GHG_VERIFIED: {
    title: 'Corporate GHG Inventory – Verified',
    subtitle: 'Includes assurance statements and evidence checklist.',
    useWhen: 'Share audit-ready documentation with verifiers or regulators.',
  },
  CORP_GHG_PUBLIC: {
    title: 'Corporate GHG Inventory – Public Summary',
    subtitle: 'External communications-friendly narrative.',
    useWhen: 'Publish a CSR or website snapshot while keeping proprietary detail offline.',
  },
  CORP_GHG_INTERNAL: {
    title: 'Corporate GHG Inventory – Operational Detail',
    subtitle: 'Site and category breakdown for operations.',
    useWhen: 'Distribute granular data to facilities and procurement teams for reduction planning.',
  },
  CORP_GHG_ANNUAL: {
    title: 'Corporate GHG Inventory – Annual Update',
    subtitle: 'Year-on-year comparison view.',
    useWhen: 'Report incremental progress to leadership or board committees.',
  },
  CORP_GHG_SIMPLIFIED: {
    title: 'Corporate GHG Inventory – Lite',
    subtitle: 'High-level inventory for SMEs.',
    useWhen: 'Quickly answer buyer questionnaires when only totals are required.',
  },
  TCFD_REPORT: {
    title: 'Global TCFD Report',
    subtitle: 'Task Force on Climate-related Financial Disclosures.',
    useWhen: 'Provide a single PDF for markets where TCFD is still voluntary.',
  },
  CORSIA: {
    title: 'CORSIA Emissions Report',
    subtitle: 'ICAO airline monitoring and verification.',
    useWhen: 'Airlines submitting annual CO₂ to their national authority.',
  },
  CDP_DISCLOSURE: {
    title: 'CDP Climate Questionnaire',
    subtitle: 'Investor version with scoring guidance.',
    useWhen: 'Answer CDP portal questions and circulate an offline copy internally.',
  },
  GRESB_ASSESSMENT: {
    title: 'GRESB Assessment Pack',
    subtitle: 'Real estate / infrastructure sustainability questionnaire.',
    useWhen: 'Upload verified ESG data to GRESB or brief executives before submission.',
  },
  ECOVADIS_SCORE: {
    title: 'EcoVadis Submission Dossier',
    subtitle: 'Supplier assessment evidence pack.',
    useWhen: 'Compile the documentation requested by EcoVadis scorers.',
  },
  SBTI_COMMITMENT: {
    title: 'SBTi Commitment Package',
    subtitle: 'Commitment letter, inventory extracts, and target summary.',
    useWhen: 'Send data to SBTi or brief leadership before target validation.',
  },
  RE100_REPORTING: {
    title: 'RE100 Progress Report',
    subtitle: 'Annual update on renewable electricity consumption.',
    useWhen: 'Report progress to RE100 and share with customers or investors.',
  },
  CLIMATE_ACTION_PLAN: {
    title: 'Climate Action Plan',
    subtitle: 'Roadmap of decarbonization levers and investments.',
    useWhen: 'Socialize prioritized initiatives, timelines, and costs with executives.',
  },
  RECS_STRATEGY: {
    title: 'RECs Procurement Strategy',
    subtitle: 'Renewable certificate sourcing plan.',
    useWhen: 'Align procurement, finance, and sustainability on REC coverage and budget.',
  },
  PPA_STRATEGY: {
    title: 'PPA Strategy Brief',
    subtitle: 'Power purchase agreement pipeline and economics.',
    useWhen: 'Evaluate PPAs with finance/legal stakeholders before negotiations.',
  },
  ENERGY_AUDIT_SCOPE12: {
    title: 'Energy Audit (Scope 1 & 2)',
    subtitle: 'Operational efficiency findings and actions.',
    useWhen: 'Deliver audit outputs for compliance or ISO 50001 programs.',
  },
  SCOPE2_DETAILED: {
    title: 'Scope 2 Detailed Report',
    subtitle: 'Location- and market-based electricity profile.',
    useWhen: 'Provide buyers or auditors with granular scope 2 calculations and data quality notes.',
  },
  SCOPE3_DETAILED: {
    title: 'Scope 3 Detailed Report',
    subtitle: 'All 15 category breakdown with methodology disclosures.',
    useWhen: 'Share scope 3 hotspots and data lineage with leadership or customers.',
  },
  SCOPE3_CATEGORY1_SUPPLIERS: {
    title: 'Scope 3 Category 1 Suppliers',
    subtitle: 'Purchased goods and services deep dive.',
    useWhen: 'Engage procurement and suppliers with category 1-specific data requests.',
  },
  CLIENT_SCOPE3_PACKAGE: {
    title: 'Client Scope 3 Package',
    subtitle: 'Deliverable-ready dataset for downstream partners.',
    useWhen: 'Provide OEMs or customers with scope 3 data mapped to their questionnaires.',
  },
  SCOPE123_DATASET: {
    title: 'Scope 1-2-3 Data Export',
    subtitle: 'Machine-readable dataset for API or portal uploads.',
    useWhen: 'Feed auditors, investors, or client systems with raw emissions tables.',
  },
  CLIENT_TEMPLATE_FILL: {
    title: 'Client Template Fill',
    subtitle: 'Custom Excel / portal template population.',
    useWhen: 'Mirror a customer-provided form (e.g., Walmart, Amazon) with verified data.',
  },
  BANK_TEMPLATE_FILL: {
    title: 'Bank Template Fill',
    subtitle: 'Financing / lender ESG responses.',
    useWhen: 'Supply sustainability answers demanded by banks or debt providers.',
  },
  PREP_GHG: {
    title: 'GHG Prep Checklist',
    subtitle: 'Internal readiness tracker before corporate filings.',
    useWhen: 'Coordinate evidence collection ahead of assurance or disclosure deadlines.',
  },
};

export const USER_FACING_REPORT_TEMPLATE_CODES = new Set<ReportTemplateCode>(
  USER_FACING_REPORT_TEMPLATE_ORDER,
);

export function getVisibleReportTemplateCodes(): ReportTemplateCode[] {
  return USER_FACING_REPORT_TEMPLATE_ORDER;
}

export function isUserFacingReportTemplate(
  code: string | null | undefined,
): code is ReportTemplateCode {
  if (!code) {
    return false;
  }
  return USER_FACING_REPORT_TEMPLATE_CODES.has(code as ReportTemplateCode);
}

export function getUserFacingReportMeta(
  code: string | null | undefined,
): UserFacingReportMeta | undefined {
  if (!code) {
    return undefined;
  }
  return USER_FACING_REPORT_META[code as ReportTemplateCode];
}
