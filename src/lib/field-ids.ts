/**
 * Field ID Registry
 * 
 * Centralized enum of all valid field_id values used across report templates.
 * Ensures type safety and prevents typos when referencing data points.
 * 
 * Naming Convention: {Entity}_{Attribute}[_{Subtype}]
 * - Entity: Product, Material, Transport, Energy, Emission, etc.
 * - Attribute: Name, Amount, Distance, Consumption, Total, etc.
 * - Subtype (optional): ISO14067, CBAM, Air, Renewable, etc.
 * 
 * For tabular data: use same field_id with different item_id values in dataset.
 */

export enum FieldId {
  // ================================
  // Product Information
  // ================================
  Product_Name = 'Product_Name',
  Product_Description = 'Product_Description',
  Product_Category = 'Product_Category',
  Product_Weight = 'Product_Weight',
  Product_Units = 'Product_Units',
  Product_LifespanYears = 'Product_LifespanYears',

  // ================================
  // Materials (Tabular)
  // ================================
  Material_Name = 'Material_Name',
  Material_Type = 'Material_Type',
  Material_Amount = 'Material_Amount',
  Material_Unit = 'Material_Unit',
  Material_Source = 'Material_Source',
  Material_EmissionFactor = 'Material_EmissionFactor',

  // ================================
  // Energy Consumption
  // ================================
  Energy_Consumption_Total = 'Energy_Consumption_Total',
  Energy_Consumption_Electricity = 'Energy_Consumption_Electricity',
  Energy_Consumption_Gas = 'Energy_Consumption_Gas',
  Energy_Consumption_Renewable = 'Energy_Consumption_Renewable',
  Energy_Unit = 'Energy_Unit',

  // ================================
  // Transportation (Tabular)
  // ================================
  Transport_Mode = 'Transport_Mode',
  Transport_Distance_Air = 'Transport_Distance_Air',
  Transport_Distance_Sea = 'Transport_Distance_Sea',
  Transport_Distance_Road = 'Transport_Distance_Road',
  Transport_Distance_Rail = 'Transport_Distance_Rail',
  Transport_Weight = 'Transport_Weight',
  Transport_EmissionFactor = 'Transport_EmissionFactor',

  // ================================
  // Manufacturing Process
  // ================================
  Manufacturing_Location = 'Manufacturing_Location',
  Manufacturing_Duration = 'Manufacturing_Duration',
  Manufacturing_WasteGenerated = 'Manufacturing_WasteGenerated',
  Manufacturing_WaterConsumption = 'Manufacturing_WaterConsumption',

  // ================================
  // Emissions (Calculations)
  // ================================
  Emission_Total_ISO14067 = 'Emission_Total_ISO14067',
  Emission_Total_CBAM = 'Emission_Total_CBAM',
  Emission_Scope1 = 'Emission_Scope1',
  Emission_Scope2 = 'Emission_Scope2',
  Emission_Scope3 = 'Emission_Scope3',
  Emission_Unit = 'Emission_Unit',
  Emission_PerUnit = 'Emission_PerUnit',

  // ================================
  // Packaging (Tabular)
  // ================================
  Packaging_Type = 'Packaging_Type',
  Packaging_Material = 'Packaging_Material',
  Packaging_Weight = 'Packaging_Weight',
  Packaging_Recyclable = 'Packaging_Recyclable',

  // ================================
  // Use Phase
  // ================================
  UsePhase_EnergyPerYear = 'UsePhase_EnergyPerYear',
  UsePhase_MaintenanceFrequency = 'UsePhase_MaintenanceFrequency',
  UsePhase_ConsumablesUsed = 'UsePhase_ConsumablesUsed',

  // ================================
  // End of Life
  // ================================
  EndOfLife_DisposalMethod = 'EndOfLife_DisposalMethod',
  EndOfLife_RecyclingRate = 'EndOfLife_RecyclingRate',
  EndOfLife_LandfillPercentage = 'EndOfLife_LandfillPercentage',
  EndOfLife_IncinerationPercentage = 'EndOfLife_IncinerationPercentage',

  // ================================
  // Company Information
  // ================================
  Company_Name = 'Company_Name',
  Company_Address = 'Company_Address',
  Company_ContactPerson = 'Company_ContactPerson',
  Company_Email = 'Company_Email',
  Company_Phone = 'Company_Phone',

  // ================================
  // Assessment Metadata
  // ================================
  Assessment_Date = 'Assessment_Date',
  Assessment_Standard = 'Assessment_Standard',
  Assessment_Boundary = 'Assessment_Boundary',
  Assessment_FunctionalUnit = 'Assessment_FunctionalUnit',
  Assessment_ReferenceYear = 'Assessment_ReferenceYear',
  Assessment_GeographicScope = 'Assessment_GeographicScope',
  Assessment_Methodology = 'Assessment_Methodology',

  // Add more field IDs as needed for new templates
}

/**
 * Helper to check if a string is a valid FieldId
 */
export function isValidFieldId(value: string): value is FieldId {
  return Object.values(FieldId).includes(value as FieldId)
}

/**
 * Get all field IDs as an array
 */
export function getAllFieldIds(): FieldId[] {
  return Object.values(FieldId)
}

/**
 * Field ID metadata (optional - for enhanced validation/documentation)
 */
export interface FieldMetadata {
  id: FieldId
  label: string
  category: 'product' | 'material' | 'energy' | 'transport' | 'emission' | 'packaging' | 'company' | 'assessment'
  dataType: 'text' | 'number' | 'boolean' | 'date' | 'select'
  isTabular: boolean
  unit?: string
}

/**
 * Example metadata registry (can be expanded)
 */
export const FIELD_METADATA: Partial<Record<FieldId, FieldMetadata>> = {
  [FieldId.Product_Name]: {
    id: FieldId.Product_Name,
    label: 'Product Name',
    category: 'product',
    dataType: 'text',
    isTabular: false,
  },
  [FieldId.Material_Name]: {
    id: FieldId.Material_Name,
    label: 'Material Name',
    category: 'material',
    dataType: 'text',
    isTabular: true,
  },
  [FieldId.Energy_Consumption_Total]: {
    id: FieldId.Energy_Consumption_Total,
    label: 'Total Energy Consumption',
    category: 'energy',
    dataType: 'number',
    isTabular: false,
    unit: 'kWh',
  },
  // Add more metadata as needed
}
