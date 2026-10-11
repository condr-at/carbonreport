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
    title: 'CBAM Declaration Preparation',
    subtitle: 'Import and emissions data for the selected CBAM reporting period.',
    useWhen: 'Prepare inputs for annual declarations from 2026 or historical transitional reports.',
  },
  CBAM: {
    title: 'CBAM Importer Data',
    subtitle: 'Product, shipment and embedded-emissions inputs.',
    useWhen: 'Gather an importer summary for review with suppliers and advisers.',
  },
  CBAM_DATA_PACKAGE: {
    title: 'CBAM Supplier Review Package',
    subtitle: 'Guided supplier inputs with a downloadable review package.',
    useWhen: 'Share reported emissions and evidence references for one product and installation from 2026.',
  },
  CBAM_PREP_METHOD: {
    title: 'CBAM Preparation Checklist',
    subtitle: 'Sourcing and methodology inputs for an internal review.',
    useWhen: 'Organize data collection and review before a CBAM declaration.',
  },
  CBAM_ALLOWANCES: {
    title: 'CBAM Certificate Planning',
    subtitle: 'Certificate quantities and cost assumptions for the reporting year.',
    useWhen: 'Collect inputs for a certificate purchase and surrender plan.',
  },
  CBAM_MONITORING_ALERT: {
    title: 'CBAM Monitoring Data',
    subtitle: 'Supplier data and monitoring-method inputs for review.',
    useWhen: 'Record the inputs and methods to check before the reporting deadline.',
  },
  PRODUCT_PCF: {
    title: 'Product Carbon Footprint Data',
    subtitle: 'Product life-cycle inputs for a GHG Protocol study.',
    useWhen: 'Collect activity data, boundaries and methodology notes for footprint calculation and review.',
  },
  ISO14067: {
    title: 'ISO 14067 PCF — Compact',
    subtitle: 'Core product and emissions fields for starting a footprint study.',
    useWhen: 'Start with a shorter collection form before calculation or verification.',
  },
  ISO_14067: {
    title: 'ISO 14067 PCF — Detailed',
    subtitle: 'Expanded fields for product, life-cycle and methodology data.',
    useWhen: 'Collect more detailed inputs for a footprint study and independent review.',
  },
  EPD: {
    title: 'EPD Data Preparation',
    subtitle: 'Product LCA inputs for the chosen programme and product category rules.',
    useWhen: 'Collect data for an EPD study, programme review and external verification.',
  },
  BUILDING_CARBON_FOOTPRINT: {
    title: 'Building Carbon Data',
    subtitle: 'Material, life-cycle module and operational-energy inputs.',
    useWhen: 'Prepare data for a building assessment using the agreed method and study period.',
  },
  CARBON_NEUTRAL_CERT: {
    title: 'Carbon Neutrality Claim Preparation',
    subtitle: 'Emissions, reductions and compensation evidence for review.',
    useWhen: 'Gather the basis for assessing a proposed claim under the applicable standard and local rules.',
  },
  BCORP_IMPACT_ASSESSMENT: {
    title: 'B Corp Assessment Preparation',
    subtitle: 'Company data and evidence for a B Lab assessment.',
    useWhen: 'Prepare inputs for the applicable certification pathway and independent review.',
  },
  CSRD: {
    title: 'CSRD / ESRS Data Preparation',
    subtitle: 'Sustainability inputs for an ESRS statement.',
    useWhen: 'Collect information after confirming scope, reporting year and the applicable ESRS edition.',
  },
  EU_ETS: {
    title: 'EU ETS Installation Data',
    subtitle: 'Installation emissions and monitoring inputs for annual reporting.',
    useWhen: 'Prepare stationary-installation data for verifier review and the national reporting process.',
  },
  EU_MRV: {
    title: 'EU MRV Shipping Data',
    subtitle: 'Ship activity, fuel and emissions inputs for maritime reporting.',
    useWhen: 'Prepare data for MRV review and, where applicable, the parallel EU ETS process.',
  },
  SEC_CLIMATE: {
    title: 'SEC Climate Disclosure Preparation',
    subtitle: 'Climate-risk and emissions inputs for legal review.',
    useWhen: 'Prepare relevant disclosure information; the 2024 SEC climate rule remains stayed.',
  },
  UK_SECR: {
    title: 'UK SECR Data Preparation',
    subtitle: 'Energy, emissions and methodology inputs for annual reporting.',
    useWhen: 'Prepare data after confirming quoted-company, unquoted-company or LLP reporting requirements.',
  },
  UK_TCFD: {
    title: 'UK Climate Disclosure Preparation',
    subtitle: 'Climate governance, risk and metrics inputs for UK reporting.',
    useWhen: 'Prepare for the applicable TCFD or UK SRS regime for your entity and reporting period.',
  },
  SFDR: {
    title: 'SFDR Entity PAI — Initial Inputs',
    subtitle: 'Initial company and emissions data for PAI preparation.',
    useWhen: 'Prepare source data for a separate mapping to the entity-level principal adverse impacts statement.',
  },
  HKEX_ESG: {
    title: 'HKEX ESG Data Preparation',
    subtitle: 'Company data for Appendix C2 ESG Reporting Code disclosures.',
    useWhen: 'Gather inputs for the requirements applicable to your listing tier and reporting year.',
  },
  IFRS_S2_CLIMATE: {
    title: 'IFRS S2 Climate Data',
    subtitle: 'Climate-risk, strategy and emissions inputs for reporting.',
    useWhen: 'Prepare data for voluntary IFRS S2 use or the applicable local reporting regime.',
  },
  ISO_14064_CERT: {
    title: 'ISO 14064-1 Inventory Preparation',
    subtitle: 'Organization-level emissions and methodology inputs.',
    useWhen: 'Collect data for an inventory study and, when required, independent verification.',
  },
  CORP_GHG: {
    title: 'Corporate GHG Inventory Data',
    subtitle: 'Scope 1–3 inputs and methodology notes.',
    useWhen: 'Collect the activity data and reported emissions needed for a corporate inventory.',
  },
  CORP_GHG_VERIFIED: {
    title: 'Corporate GHG Verification Preparation',
    subtitle: 'Inventory information and verification-related fields.',
    useWhen: 'Prepare data for an independent verifier to assess.',
  },
  CORP_GHG_PUBLIC: {
    title: 'Corporate GHG Disclosure Preparation',
    subtitle: 'Inventory inputs for an external communications review.',
    useWhen: 'Prepare selected emissions information for approval before public disclosure.',
  },
  CORP_GHG_INTERNAL: {
    title: 'Corporate GHG Operational Data',
    subtitle: 'Inventory inputs for internal emissions analysis.',
    useWhen: 'Collect data to support facilities and procurement reduction planning.',
  },
  CORP_GHG_ANNUAL: {
    title: 'Corporate GHG Annual Data',
    subtitle: 'Reporting-year emissions and comparison inputs.',
    useWhen: 'Prepare annual inventory information and explanations of changes.',
  },
  CORP_GHG_SIMPLIFIED: {
    title: 'Corporate GHG Overview Data',
    subtitle: 'High-level emissions and organization fields.',
    useWhen: 'Start an inventory or gather emissions totals for a buyer request.',
  },
  TCFD_REPORT: {
    title: 'TCFD Disclosure Preparation',
    subtitle: 'Governance, strategy, risk and metrics inputs.',
    useWhen: 'Prepare information for a TCFD-based request after checking the applicable local reporting rules.',
  },
  CORSIA: {
    title: 'CORSIA Emissions Data',
    subtitle: 'Aircraft-operator emissions and monitoring inputs.',
    useWhen: 'Prepare annual data for verification and reporting to the responsible State authority.',
  },
  CDP_DISCLOSURE: {
    title: 'CDP Disclosure Preparation',
    subtitle: 'Company and environmental data for a CDP response.',
    useWhen: 'Gather inputs for the reporting year and questionnaire assigned to your organization.',
  },
  GRESB_ASSESSMENT: {
    title: 'GRESB Assessment Preparation',
    subtitle: 'Portfolio and environmental inputs for a GRESB response.',
    useWhen: 'Collect data before mapping it to the assessment type, year and asset-level requirements.',
  },
  ECOVADIS_SCORE: {
    title: 'EcoVadis Assessment Preparation',
    subtitle: 'Company and environmental inputs for an evidence review.',
    useWhen: 'Gather source information to support the questionnaire and documents requested by EcoVadis.',
  },
  SBTI_COMMITMENT: {
    title: 'SBTi Target Preparation',
    subtitle: 'Inventory and target inputs for the next SBTi step.',
    useWhen: 'Prepare data for a commitment or target submission using the relevant pathway and standard version.',
  },
  RE100_REPORTING: {
    title: 'RE100 Electricity Data',
    subtitle: 'Renewable-electricity consumption and procurement inputs.',
    useWhen: 'Gather data for annual RE100 reporting and review of eligible renewable claims.',
  },
  CLIMATE_ACTION_PLAN: {
    title: 'Climate Action Planning Data',
    subtitle: 'Emissions, targets and transition-planning inputs.',
    useWhen: 'Collect information for an internal plan before assigning measures, owners and budgets.',
  },
  RECS_STRATEGY: {
    title: 'Renewable Certificate Planning',
    subtitle: 'Electricity and certificate inputs for procurement review.',
    useWhen: 'Prepare sourcing, coverage and budget information for the relevant certificate market.',
  },
  PPA_STRATEGY: {
    title: 'PPA Planning Data',
    subtitle: 'Energy demand and contract assumptions for a power purchase agreement.',
    useWhen: 'Gather information for finance and legal review before comparing offers.',
  },
  ENERGY_AUDIT_SCOPE12: {
    title: 'Energy Audit Preparation',
    subtitle: 'Energy consumption and site information for an audit.',
    useWhen: 'Collect inputs for an assessor under the applicable country and audit scheme.',
  },
  SCOPE2_DETAILED: {
    title: 'Scope 2 Inventory Data',
    subtitle: 'Purchased electricity, heat, steam and cooling inputs.',
    useWhen: 'Prepare information for location-based and, where applicable, market-based emissions calculations.',
  },
  SCOPE3_DETAILED: {
    title: 'Scope 3 Inventory Data',
    subtitle: 'Value-chain category inputs and methodology notes.',
    useWhen: 'Gather data for the relevant Scope 3 categories and explain exclusions.',
  },
  SCOPE3_CATEGORY1_SUPPLIERS: {
    title: 'Scope 3 Purchased Goods Data',
    subtitle: 'Supplier and activity inputs for purchased goods and services.',
    useWhen: 'Collect Category 1 data with procurement teams and suppliers.',
  },
  CLIENT_SCOPE3_PACKAGE: {
    title: 'Client Scope 3 Data Preparation',
    subtitle: 'Emissions inputs for an agreed customer reporting request.',
    useWhen: 'Collect data, boundaries and methodology notes before mapping them to the customer format.',
  },
  SCOPE123_DATASET: {
    title: 'Scope 1–3 Data Collection',
    subtitle: 'Shared emissions inputs for internal or external review.',
    useWhen: 'Build a dataset for later calculation, review and recipient-specific formatting.',
  },
  CLIENT_TEMPLATE_FILL: {
    title: 'Client Questionnaire Preparation',
    subtitle: 'Source data for a customer-provided form or portal.',
    useWhen: 'Collect requested information before mapping it to the current customer template.',
  },
  BANK_TEMPLATE_FILL: {
    title: 'Bank Questionnaire Preparation',
    subtitle: 'Company and sustainability inputs for a lender request.',
    useWhen: 'Gather information for the specific bank questionnaire and reporting period.',
  },
  PREP_GHG: {
    title: 'GHG Preparation Checklist',
    subtitle: 'Boundary, methodology and data-source inputs.',
    useWhen: 'Organize collection and review ahead of an inventory or disclosure deadline.',
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
