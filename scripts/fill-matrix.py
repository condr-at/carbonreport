#!/usr/bin/env python3
"""
Script to fill datapoints-reports matrix.csv with M/O/N values
based on regulatory requirements research.

M = Mandatory (explicitly required by regulation)
O = Optional (regulation mentions as "if applicable")
N = Not applicable (regulation doesn't mention this datapoint)
"""

import csv
from pathlib import Path

# Define the mappings based on regulatory research
# Format: { "REPORT_TYPE": { "column_name": "M|O|N", ... } }

MAPPINGS = {
    "CSRD": {
        # Core Reporting Period & Organization
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",
        "organization_headcount": "M",
        "organization_revenue_eur": "M",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "M",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions - Scope 1
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "O",
        "scope1_breakdown_process_co2e": "O",
        
        # GHG Emissions - Scope 2
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope2_electricity_consumption_mwh": "M",
        "scope2_steam_heat_cold_energy_mwh": "M",
        
        # GHG Emissions - Scope 3 (all if material per ESRS E1-6)
        "scope3_category1_purchased_goods_co2e": "M",
        "scope3_category2_capital_goods_co2e": "M",
        "scope3_category3_fuel_energy_activities_co2e": "M",
        "scope3_category4_upstream_transport_co2e": "M",
        "scope3_category5_waste_generated_co2e": "M",
        "scope3_category6_business_travel_co2e": "M",
        "scope3_category7_employee_commuting_co2e": "M",
        "scope3_category8_upstream_leased_assets_co2e": "M",
        "scope3_category9_downstream_transport_co2e": "M",
        "scope3_category10_processing_of_sold_products_co2e": "M",
        "scope3_category11_use_of_sold_products_co2e": "M",
        "scope3_category12_end_of_life_treatment_co2e": "M",
        "scope3_category13_downstream_leased_assets_co2e": "M",
        "scope3_category14_franchises_co2e": "M",
        "scope3_category15_investments_co2e": "M",
        
        # Totals & Base Year
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",
        "base_year_emissions_co2e": "M",
        "base_year_recalculation_policy": "M",
        
        # Verification & Assurance
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        
        # Offsets
        "offsets_purchased_co2e": "O",
        "offsets_programs_list": "O",
        "carbon_neutral_claim_boundary": "O",
        
        # Climate Governance & Strategy (ESRS E1-1 through E1-9)
        "climate_governance_description": "M",
        "climate_risk_management_process": "M",
        "climate_risks_physical_description": "M",
        "climate_risks_transition_description": "M",
        "climate_scenarios_used": "M",
        "climate_scenario_results_summary": "M",
        "emission_reduction_targets_list": "M",
        "net_zero_target_year": "O",
        "decarbonisation_strategy_summary": "M",
        "energy_efficiency_measures_summary": "O",
        "renewable_energy_strategy_summary": "O",
        "climate_financial_impacts_summary": "M",
        "severe_weather_capitalized_costs_amount": "O",
        "severe_weather_expensed_costs_amount": "O",
        "severe_weather_losses_amount": "O",
        "carbon_offsets_financial_impacts_amount": "O",
        "recs_financial_impacts_amount": "O",
        
        # SBTi fields - not required by CSRD itself
        "sbti_commitment_status": "O",
        "sbti_scope_coverage": "O",
        "sbti_target_type": "O",
        "sbti_sector_classification": "N",
        
        # Financed emissions - for financial entities under CSRD
        "financed_emissions_total_co2e": "O",
        "portfolio_coverage_percent": "O",
        
        # SFDR - separate regulation
        "sfdr_pai_indicators_summary": "N",
        "sfdr_pai_indicator_entries": "N",
        
        # Taxonomy alignment - required under CSRD
        "green_assets_ratio": "O",
        "taxonomy_aligned_revenue_percent": "M",
        "taxonomy_aligned_capex_percent": "M",
        "taxonomy_aligned_opex_percent": "M",
        
        # Bank specific
        "banks_data_template_reference": "N",
        "lenders_investors_list": "N",
        
        # Listing info
        "listing_exchanges": "N",
        "issuer_is_sec_registrant": "N",
        "sec_filer_category": "N",
        "public_filing_documents_list": "N",
        
        # HKEX - different jurisdiction
        "hkex_esg_compliance_level": "N",
        
        # UK TCFD - different jurisdiction
        "uk_tcfd_mandatory_scope": "N",
        
        # CDP - voluntary
        "cdp_questionnaire_type": "N",
        "cdp_reporting_year": "N",
        "cdp_previous_score": "N",
        
        # EcoVadis - voluntary
        "ecovadis_scope_description": "N",
        "ecovadis_previous_score": "N",
        
        # RE100 - voluntary
        "re100_commitment_scope": "N",
        "re100_target_year": "N",
        "re100_current_renewable_share_percent": "N",
        
        # GRESB - voluntary
        "gresb_portfolio_description": "N",
        "gresb_previous_score": "N",
        
        # BCorp - voluntary
        "bcorp_assessment_scope_description": "N",
        "bcorp_target_certification_year": "N",
        
        # Aviation - sector specific
        "aviation_total_fuel_consumption_tonnes": "N",
        "aviation_total_emissions_co2e": "N",
        "aviation_routes_coverage_description": "N",
        "aviation_offset_programs": "N",
        
        # Shipping - sector specific
        "shipping_voyages_covered_description": "N",
        "shipping_total_emissions_co2e": "N",
        "shipping_fuel_consumption_tonnes": "N",
        "shipping_eu_ports_share_percent": "N",
        
        # Building - may be relevant under E1-5
        "building_floor_area_m2": "O",
        "building_energy_consumption_mwh": "O",
        "building_occupancy_rate_percent": "N",
        "building_certifications_existing": "N",
        
        # IT/Data centers
        "it_data_centers_owned_list": "N",
        "it_data_centers_total_energy_mwh": "O",
        "data_center_pue": "N",
        "cloud_providers_list": "N",
        "cloud_usage_emissions_co2e": "O",
        
        # Supplier data
        "supplier_emissions_data_coverage_percent": "O",
        
        # CBAM - separate regulation
        "cbam_importer_eori": "N",
        "cbam_authorised_declarant_id": "N",
        "cbam_goods_cn_codes": "N",
        "cbam_reporting_quarter": "N",
        "cbam_total_embedded_emissions_co2e": "N",
        "cbam_free_allowances_quantity": "N",
        "cbam_certificates_purchased_quantity": "N",
        "cbam_certificates_used_quantity": "N",
        "cbam_monitoring_methodology_description": "N",
        "cbam_supplier_data_availability": "N",
        "cbam_third_country_carbon_price_paid_eur": "N",
        
        # Client specific
        "client_request_reference": "N",
        "client_required_categories_scope3_list": "N",
        "client_reporting_format": "N",
        "client_data_delivery_deadline": "N",
        "client_data_delivery_channels": "N",
        "data_package_coverage_description": "N",
        
        # Energy details (ESRS E1-5)
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "M",
        "ppa_contracts_list": "O",
        "recs_certificates_purchased_mwh": "O",
        "energy_audit_scope_description": "O",
        "energy_saving_potential_estimate_percent": "O",
        "climate_action_measures_list": "M",
        
        # Data quality
        "data_quality_assessment_summary": "M",
        "methodology_reference_documents": "M",
        "limitations_and_uncertainties_summary": "M",
        "comparability_notes": "M",
        "responsible_officer_name": "O",
        "responsible_officer_role": "O",
        
        # EU ETS - separate regulation (may need to disclose if applicable)
        "eu_ets_compliance_year": "O",
        "eu_ets_installations_list": "O",
        "eu_ets_verified_emissions_co2e": "O",
        "eu_ets_allowances_surrendered_quantity": "O",
        "eu_ets_free_allowances_quantity": "O",
        "eu_ets_market_allowances_purchased_quantity": "N",
        "eu_ets_market_allowances_sold_quantity": "N",
        "eu_ets_balance_surplus_quantity": "N",
        "eu_ets_verification_body_name": "N",
        "eu_ets_compliance_statement": "N",
        "eu_ets_monitoring_methodology_reference": "N",
        
        # Governance (ESRS G1, ESRS 2)
        "board_gender_diversity_percent": "M",
        "board_independence_percent": "O",
        "sustainability_officer_exists": "O",
        "due_diligence_statement": "M",
        "materiality_assessment_process": "M",
        "stakeholder_engagement_description": "M",
        "value_chain_description": "M",
        "transition_plan_description": "M",
        "climate_scenario_analysis_results": "M",
        "internal_carbon_price_eur_tco2e": "O",
        "locked_in_emissions_co2e": "O",
        "avoided_emissions_co2e": "O",
        "climate_related_capex_eur": "M",
        "climate_related_opex_eur": "M",
        "physical_risk_financial_impact_eur": "M",
        "transition_risk_financial_impact_eur": "M",
        
        # Environmental (ESRS E2, E3, E4, E5)
        "air_pollutants_nox_tonnes": "O",
        "air_pollutants_sox_tonnes": "O",
        "air_pollutants_pm_tonnes": "O",
        "water_withdrawals_m3": "O",
        "water_discharges_m3": "O",
        "water_consumption_m3": "O",
        "water_stress_areas_identified": "O",
        "waste_generated_total_tonnes": "O",
        "waste_hazardous_tonnes": "O",
        "waste_recycled_tonnes": "O",
        "waste_landfilled_tonnes": "O",
        "biodiversity_sensitive_areas_list": "O",
        "deforestation_assessment": "O",
        "circular_economy_measures": "O",
        
        # Social (ESRS S1-S4)
        "own_employees_total_headcount": "M",
        "own_employees_permanent_headcount": "M",
        "own_employees_temporary_headcount": "M",
        "collective_bargaining_coverage_percent": "M",
        "adequate_wages_assessment": "M",
        "training_hours_total": "M",
        "health_safety_incidents_total": "M",
        "health_safety_fatalities_total": "M",
        "gender_pay_gap_percent": "M",
        "women_in_management_percent": "M",
        "employee_turnover_rate_percent": "O",
        "human_rights_incidents_reported": "M",
        "affected_communities_engagement": "O",
        "data_privacy_breaches_number": "O",
        
        # SBTi specific
        "sbti_target_submission_year": "N",
        "sbti_near_term_target_year": "N",
        "sbti_long_term_target_year": "N",
        "sbti_net_zero_year": "N",
        
        # CDP specific
        "cdp_response_status": "N",
        "cdp_score_current": "N",
        
        # GHG intensity
        "ghg_intensity_per_revenue_tco2e_eur": "M",
        "ghg_intensity_per_fte_tco2e": "O",
        "biogenic_co2_separate_co2e": "M",
        "scope3_data_quality_score": "M",
        "verification_opinion_type": "M",
        "restatement_description": "O",
        "sustainability_linked_loans_total": "O",
        
        # CSRD specific
        "csrd_double_materiality_assessment": "M",
        "csrd_esrs_disclosure_requirements": "M",
        "csrd_value_chain_mapping": "M",
        "narrative_disclosures_quality_metrics": "O",
        "taxonomy_alignment_criteria_details": "M",
        "csrd_assurance_provider_details": "M",
        
        # EU ETS specific
        "eu_ets_installation_permit_numbers": "N",
        "eu_ets_activity_level_data": "N",
        "eu_ets_fall_back_methodology_used": "N",
        
        # CBAM specific
        "cbam_production_process_description": "N",
        "cbam_precursor_materials_emissions": "N",
        "cbam_installation_boundaries": "N",
        
        # UK SECR specific
        "uk_secr_company_size_category": "N",
        "uk_secr_energy_intensity_ratio": "N",
        "uk_secr_quantification_methodology": "N",
        
        # SEC specific
        "sec_materiality_determination_process": "N",
        "sec_severe_weather_event_descriptions": "N",
        "sec_attestation_provider_details": "N",
        "sec_safe_harbor_forward_looking_statements": "N",
        
        # CORSIA specific
        "corsia_eligible_fuel_types": "N",
        "corsia_sustainability_certification_scheme": "N",
        "corsia_offset_credits_vintage_year": "N",
        "corsia_monitoring_plan_reference": "N",
        
        # EU MRV specific
        "eu_mrv_ship_imo_number": "N",
        "eu_mrv_ship_technical_efficiency": "N",
        "eu_mrv_cargo_carried_tonnes": "N",
        "eu_mrv_ice_class_notation": "N",
        
        # SFDR specific
        "sfdr_article_classification": "N",
        "sfdr_do_no_significant_harm_assessment": "N",
        "sfdr_principal_adverse_impacts_metrics": "N",
        
        # TCFD specific
        "tcfd_metrics_targets_disclosure": "O",
        "tcfd_resilience_assessment_results": "O",
        
        # HKEX specific
        "hkex_esg_kpi_list": "N",
        "hkex_esg_reporting_principles_application": "N",
        
        # CDP specific metrics
        "cdp_water_security_metrics": "N",
        "cdp_forest_commodities_risk": "N",
        "cdp_supplier_engagement_rating": "N",
        
        # Product specific
        "product_functional_unit_definition": "N",
        "product_system_boundary_description": "N",
        "product_allocation_methodology": "N",
        "product_cutoff_criteria": "N",
        "product_life_cycle_stages_included": "N",
        "product_data_quality_indicators": "N",
        
        # SBTi target fields
        "sbti_base_year_for_targets": "N",
        "sbti_boundary_coverage_percent": "N",
        
        # RE100 specific
        "re100_interim_targets_list": "N",
        "re100_re_sourcing_methods": "N",
        
        # GRESB specific
        "gresb_asset_type_breakdown": "N",
        "gresb_standing_investments_count": "N",
        
        # BCorp specific
        "bcorp_impact_areas_scores": "N",
        "bcorp_governance_structure_description": "N",
    },
    
    # SEC Climate Disclosure Rules (Rule 33-11275) - SEC CLIMATE
    # Source: https://www.sec.gov/rules/final/2024/33-11275.pdf
    "SEC_CLIMATE": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "N",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions - Large Accelerated Filers & Accelerated Filers
        "scope1_total_co2e": "M",  # Required for LAF and AF
        "scope1_breakdown_stationary_co2e": "N",
        "scope1_breakdown_mobile_co2e": "N",
        "scope1_breakdown_fugitive_co2e": "N",
        "scope1_breakdown_process_co2e": "N",
        "scope2_total_location_based_co2e": "M",  # Required for LAF and AF
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "N",
        "scope2_steam_heat_cold_energy_mwh": "N",
        
        # Scope 3 - NOT required under final SEC rules (removed from final rule)
        "scope3_category1_purchased_goods_co2e": "N",
        "scope3_category2_capital_goods_co2e": "N",
        "scope3_category3_fuel_energy_activities_co2e": "N",
        "scope3_category4_upstream_transport_co2e": "N",
        "scope3_category5_waste_generated_co2e": "N",
        "scope3_category6_business_travel_co2e": "N",
        "scope3_category7_employee_commuting_co2e": "N",
        "scope3_category8_upstream_leased_assets_co2e": "N",
        "scope3_category9_downstream_transport_co2e": "N",
        "scope3_category10_processing_of_sold_products_co2e": "N",
        "scope3_category11_use_of_sold_products_co2e": "N",
        "scope3_category12_end_of_life_treatment_co2e": "N",
        "scope3_category13_downstream_leased_assets_co2e": "N",
        "scope3_category14_franchises_co2e": "N",
        "scope3_category15_investments_co2e": "N",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        "base_year_recalculation_policy": "O",
        
        # Verification - Required for LAF (reasonable assurance) and AF (limited)
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        
        # Climate Governance - Required under SEC Climate
        "climate_governance_description": "M",
        "climate_risk_management_process": "M",
        "climate_risks_physical_description": "M",
        "climate_risks_transition_description": "M",
        "climate_scenarios_used": "O",
        "climate_scenario_results_summary": "O",
        "emission_reduction_targets_list": "M",  # If targets exist, must disclose
        "net_zero_target_year": "O",
        "decarbonisation_strategy_summary": "O",
        
        # Severe weather - Mandatory financial disclosure
        "severe_weather_capitalized_costs_amount": "M",
        "severe_weather_expensed_costs_amount": "M",
        "severe_weather_losses_amount": "M",
        "climate_financial_impacts_summary": "M",
        
        # GHG intensity
        "ghg_intensity_per_revenue_tco2e_eur": "O",
        "ghg_intensity_per_fte_tco2e": "O",
        
        # SEC specific fields
        "issuer_is_sec_registrant": "M",
        "sec_filer_category": "M",
        "public_filing_documents_list": "M",
        "sec_materiality_determination_process": "M",
        "sec_severe_weather_event_descriptions": "M",
        "sec_attestation_provider_details": "M",
        "sec_safe_harbor_forward_looking_statements": "M",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # CORSIA - Carbon Offsetting and Reduction Scheme for International Aviation
    # Source: ICAO Annex 16 Volume IV, CORSIA SARPs
    "CORSIA": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",  # Must be aviation sector
        "organization_headcount": "N",
        "organization_revenue_eur": "N",
        "organization_assets_eur": "N",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "M",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions - Aviation specific
        "scope1_total_co2e": "N",  # CORSIA uses aviation-specific emissions
        "scope1_breakdown_stationary_co2e": "N",
        "scope1_breakdown_mobile_co2e": "N",
        "scope1_breakdown_fugitive_co2e": "N",
        "scope1_breakdown_process_co2e": "N",
        "scope2_total_location_based_co2e": "N",
        "scope2_total_market_based_co2e": "N",
        "scope3_category1_purchased_goods_co2e": "N",
        "total_corporate_ghg_co2e": "N",
        "base_year": "N",
        
        # Verification - Required under CORSIA
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        
        # Aviation-specific mandatory fields
        "aviation_total_fuel_consumption_tonnes": "M",
        "aviation_total_emissions_co2e": "M",
        "aviation_routes_coverage_description": "M",
        "aviation_offset_programs": "M",
        
        # CORSIA-specific fields
        "corsia_eligible_fuel_types": "M",
        "corsia_sustainability_certification_scheme": "M",
        "corsia_offset_credits_vintage_year": "M",
        "corsia_monitoring_plan_reference": "M",
        
        # Offsets - Core to CORSIA
        "offsets_purchased_co2e": "M",
        "offsets_programs_list": "M",
        
        # Data quality
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "O",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # EU MRV Shipping (Regulation 2015/757)
    # Source: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32015R0757
    "EU_MRV": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",  # Shipping
        "organization_headcount": "N",
        "organization_revenue_eur": "N",
        "organization_assets_eur": "N",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "M",
        "consolidated_entities_list": "N",
        "exclusions_scope_explanation": "O",
        
        # GHG Emissions - Ship-level CO2 only
        "scope1_total_co2e": "N",  # EU MRV uses ship-specific emissions
        "scope1_breakdown_stationary_co2e": "N",
        "scope1_breakdown_mobile_co2e": "N",
        "scope2_total_location_based_co2e": "N",
        "scope3_category1_purchased_goods_co2e": "N",
        "total_corporate_ghg_co2e": "N",
        "base_year": "N",
        
        # Verification - Required under EU MRV
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        
        # Shipping-specific mandatory fields
        "shipping_voyages_covered_description": "M",
        "shipping_total_emissions_co2e": "M",
        "shipping_fuel_consumption_tonnes": "M",
        "shipping_eu_ports_share_percent": "M",
        
        # EU MRV-specific fields
        "eu_mrv_ship_imo_number": "M",
        "eu_mrv_ship_technical_efficiency": "M",
        "eu_mrv_cargo_carried_tonnes": "M",
        "eu_mrv_ice_class_notation": "O",
        
        # Energy/fuel
        "energy_total_consumption_mwh": "O",
        
        # Data quality
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "O",
        "responsible_officer_name": "M",
        "responsible_officer_role": "M",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # UK TCFD (PS21/24, FCA rules for premium-listed companies)
    # Source: https://www.fca.org.uk/publication/policy/ps21-24.pdf
    "UK_TCFD": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "O",
        
        # GHG Emissions - TCFD recommends but comply-or-explain
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "O",
        "scope1_breakdown_process_co2e": "O",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "O",
        
        # Scope 3 - TCFD recommends if material
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "O",
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        
        # Verification - not mandatory under UK TCFD
        "verification_required": "O",
        "verification_standard": "O",
        "verifier_organization_name": "O",
        
        # Climate Governance - TCFD Pillar 1 MANDATORY
        "climate_governance_description": "M",
        "climate_risk_management_process": "M",
        "climate_risks_physical_description": "M",
        "climate_risks_transition_description": "M",
        "climate_scenarios_used": "M",
        "climate_scenario_results_summary": "M",
        "emission_reduction_targets_list": "M",
        "net_zero_target_year": "O",
        "decarbonisation_strategy_summary": "M",
        "transition_plan_description": "M",
        "climate_scenario_analysis_results": "M",
        
        # TCFD specific
        "uk_tcfd_mandatory_scope": "M",
        "tcfd_metrics_targets_disclosure": "M",
        "tcfd_resilience_assessment_results": "M",
        
        # Financial impacts
        "climate_financial_impacts_summary": "M",
        "physical_risk_financial_impact_eur": "O",
        "transition_risk_financial_impact_eur": "O",
        
        # GHG intensity - TCFD metric
        "ghg_intensity_per_revenue_tco2e_eur": "O",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # HKEX ESG (Environmental, Social and Governance Reporting Guide)
    # Source: https://www.hkex.com.hk/Listing/Rules-and-Guidance/Environmental-Social-and-Governance
    "HKEX_ESG": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "M",  # KPI B1.1
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions - Mandatory KPIs A1.1, A1.2
        "scope1_total_co2e": "M",  # KPI A1.2 - Direct emissions
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "O",
        "scope1_breakdown_process_co2e": "O",
        "scope2_total_location_based_co2e": "M",  # KPI A1.2 - Indirect emissions (energy)
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "M",  # KPI A2.1
        "scope2_steam_heat_cold_energy_mwh": "O",
        
        # Scope 3 - NOT mandatory under HKEX
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "O",
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        
        # Verification - not mandatory but recommended
        "verification_required": "O",
        "verification_standard": "O",
        "verifier_organization_name": "O",
        
        # Climate Governance - Required for climate-related disclosures
        "climate_governance_description": "M",
        "climate_risk_management_process": "M",
        "climate_risks_physical_description": "M",
        "climate_risks_transition_description": "M",
        "climate_scenarios_used": "O",
        "climate_scenario_results_summary": "O",
        "emission_reduction_targets_list": "M",
        "net_zero_target_year": "O",
        "decarbonisation_strategy_summary": "O",
        
        # Energy - KPI A2.1, A2.3
        "energy_total_consumption_mwh": "M",  # KPI A2.1
        "renewable_energy_share_percent": "O",
        "energy_efficiency_measures_summary": "M",  # KPI A2.3
        
        # Water - KPI A2.2, A2.4
        "water_withdrawals_m3": "M",  # KPI A2.2
        "water_consumption_m3": "O",
        
        # Waste - KPI A1.3, A1.4, A1.6
        "waste_generated_total_tonnes": "M",  # KPI A1.4
        "waste_hazardous_tonnes": "M",  # KPI A1.3
        "waste_recycled_tonnes": "O",
        
        # Air pollutants - KPI A1.1
        "air_pollutants_nox_tonnes": "M",  # KPI A1.1
        "air_pollutants_sox_tonnes": "M",  # KPI A1.1
        "air_pollutants_pm_tonnes": "M",  # KPI A1.1
        
        # Social - Employment KPIs
        "own_employees_total_headcount": "M",  # KPI B1.1
        "own_employees_permanent_headcount": "O",
        "own_employees_temporary_headcount": "O",
        "employee_turnover_rate_percent": "M",  # KPI B1.2
        "gender_pay_gap_percent": "O",
        "women_in_management_percent": "O",
        "board_gender_diversity_percent": "M",
        
        # Health & Safety - KPIs B2.1, B2.2, B2.3
        "health_safety_incidents_total": "M",  # KPI B2.1
        "health_safety_fatalities_total": "M",  # KPI B2.1
        "training_hours_total": "M",  # KPI B3.2
        
        # HKEX specific
        "hkex_esg_compliance_level": "M",
        "hkex_esg_kpi_list": "M",
        "hkex_esg_reporting_principles_application": "M",
        
        # GHG intensity
        "ghg_intensity_per_revenue_tco2e_eur": "M",  # KPI A1.2 intensity
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # ISO 14064-1:2018 - GHG Inventory Certification
    # Source: ISO 14064-1:2018 standard
    "ISO_14064_CERT": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",  # Required: control or equity share
        "countries_of_operation": "M",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",  # Required: must explain any exclusions
        
        # GHG Emissions - All required under ISO 14064-1
        "scope1_total_co2e": "M",  # Category 1 Direct GHG
        "scope1_breakdown_stationary_co2e": "M",
        "scope1_breakdown_mobile_co2e": "M",
        "scope1_breakdown_fugitive_co2e": "M",
        "scope1_breakdown_process_co2e": "M",
        "scope2_total_location_based_co2e": "M",  # Category 2 Indirect Energy
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "M",
        "scope2_steam_heat_cold_energy_mwh": "M",
        
        # Scope 3 - Categories 3-6 (ISO 14064 categories)
        "scope3_category1_purchased_goods_co2e": "O",  # Category 3
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",  # Category 4
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",  # Category 5
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "O",  # Category 6
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",  # Required for comparison
        "base_year_emissions_co2e": "M",
        "base_year_recalculation_policy": "M",
        
        # Verification - Core to ISO 14064-3
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        
        # Data quality - Required under ISO 14064
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "M",
        "uncertainty_assessment_summary": "M",  # ISO 14064-1 requires uncertainty quantification
        
        # ISO 14064 specific
        "iso_14064_certification_scope": "M",
        "iso_14064_version": "M",
        "iso_14064_category_breakdown": "M",
        
        # GHG by gas type - Required under ISO 14064-1
        "ghg_co2_tonnes": "M",
        "ghg_ch4_co2e": "M",
        "ghg_n2o_co2e": "M",
        "ghg_hfcs_co2e": "O",
        "ghg_pfcs_co2e": "O",
        "ghg_sf6_co2e": "O",
        "ghg_nf3_co2e": "O",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # CDP Climate Change Questionnaire
    # Source: https://www.cdp.net/en/guidance/guidance-for-companies
    "CDP_DISCLOSURE": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",
        "organization_headcount": "M",
        "organization_revenue_eur": "M",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",  # C0.3
        "countries_of_operation": "M",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",  # C0.4
        
        # GHG Emissions - Scope 1 (C6)
        "scope1_total_co2e": "M",  # C6.1
        "scope1_breakdown_stationary_co2e": "M",  # C6.1 breakdown
        "scope1_breakdown_mobile_co2e": "M",
        "scope1_breakdown_fugitive_co2e": "M",
        "scope1_breakdown_process_co2e": "M",
        
        # Scope 2 (C6)
        "scope2_total_location_based_co2e": "M",  # C6.2
        "scope2_total_market_based_co2e": "M",  # C6.3
        "scope2_electricity_consumption_mwh": "M",  # C8.2a
        "scope2_steam_heat_cold_energy_mwh": "M",
        
        # Scope 3 (C6.5) - All categories requested
        "scope3_category1_purchased_goods_co2e": "M",
        "scope3_category2_capital_goods_co2e": "M",
        "scope3_category3_fuel_energy_activities_co2e": "M",
        "scope3_category4_upstream_transport_co2e": "M",
        "scope3_category5_waste_generated_co2e": "M",
        "scope3_category6_business_travel_co2e": "M",
        "scope3_category7_employee_commuting_co2e": "M",
        "scope3_category8_upstream_leased_assets_co2e": "M",
        "scope3_category9_downstream_transport_co2e": "M",
        "scope3_category10_processing_of_sold_products_co2e": "M",
        "scope3_category11_use_of_sold_products_co2e": "M",
        "scope3_category12_end_of_life_treatment_co2e": "M",
        "scope3_category13_downstream_leased_assets_co2e": "M",
        "scope3_category14_franchises_co2e": "M",
        "scope3_category15_investments_co2e": "M",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",  # C5.1
        "base_year_emissions_co2e": "M",
        "base_year_recalculation_policy": "M",
        
        # Verification (C10)
        "verification_required": "M",  # C10.1
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        
        # Climate Governance (C1)
        "climate_governance_description": "M",  # C1.1
        "climate_risk_management_process": "M",  # C2.1
        "climate_risks_physical_description": "M",  # C2.3
        "climate_risks_transition_description": "M",  # C2.3
        "climate_scenarios_used": "M",  # C3.2
        "climate_scenario_results_summary": "M",  # C3.2
        "emission_reduction_targets_list": "M",  # C4.1
        "net_zero_target_year": "M",  # C4.2
        "decarbonisation_strategy_summary": "M",  # C3.1
        "transition_plan_description": "M",  # C3.3
        
        # Energy (C8)
        "energy_total_consumption_mwh": "M",  # C8.2a
        "renewable_energy_share_percent": "M",  # C8.2c
        
        # Carbon pricing (C11)
        "internal_carbon_price_type": "M",  # C11.1
        "internal_carbon_price_value_eur_tco2e": "M",
        
        # Offsets (C11)
        "offsets_purchased_co2e": "M",  # C11.2
        "offsets_programs_list": "M",
        
        # GHG intensity
        "ghg_intensity_per_revenue_tco2e_eur": "M",  # C6.10
        "ghg_intensity_per_fte_tco2e": "O",
        
        # Financial impacts (C2)
        "climate_financial_impacts_summary": "M",  # C2.4
        "physical_risk_financial_impact_eur": "M",
        "transition_risk_financial_impact_eur": "M",
        
        # CDP specific
        "cdp_score_climate": "M",
        "cdp_questionnaire_version": "M",
        "cdp_sector_pathway": "M",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # GHG Protocol Corporate Standard
    # Source: https://ghgprotocol.org/corporate-standard
    "GHG_CORPORATE": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",  # Control vs equity share required
        "countries_of_operation": "O",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions - Scope 1 (Mandatory)
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "O",
        "scope1_breakdown_process_co2e": "O",
        
        # Scope 2 (Mandatory)
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",  # GHG Protocol Scope 2 Guidance
        "scope2_electricity_consumption_mwh": "M",
        "scope2_steam_heat_cold_energy_mwh": "O",
        
        # Scope 3 - Optional under Corporate Standard (see Scope 3 Standard)
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "O",
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",
        "base_year_emissions_co2e": "M",
        "base_year_recalculation_policy": "M",
        
        # Verification - Optional but recommended
        "verification_required": "O",
        "verification_standard": "O",
        "verifier_organization_name": "O",
        
        # GHG by gas type - Required for separate reporting
        "ghg_co2_tonnes": "M",
        "ghg_ch4_co2e": "M",
        "ghg_n2o_co2e": "M",
        "ghg_hfcs_co2e": "M",
        "ghg_pfcs_co2e": "M",
        "ghg_sf6_co2e": "M",
        "ghg_nf3_co2e": "O",
        
        # Methodology
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "O",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # GHG Protocol Scope 3 Standard
    # Source: https://ghgprotocol.org/standards/scope-3-standard
    "GHG_SCOPE3": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions - Scope 1 & 2 for context
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        
        # Scope 3 - ALL categories required with explanation if N/A
        "scope3_category1_purchased_goods_co2e": "M",
        "scope3_category2_capital_goods_co2e": "M",
        "scope3_category3_fuel_energy_activities_co2e": "M",
        "scope3_category4_upstream_transport_co2e": "M",
        "scope3_category5_waste_generated_co2e": "M",
        "scope3_category6_business_travel_co2e": "M",
        "scope3_category7_employee_commuting_co2e": "M",
        "scope3_category8_upstream_leased_assets_co2e": "M",
        "scope3_category9_downstream_transport_co2e": "M",
        "scope3_category10_processing_of_sold_products_co2e": "M",
        "scope3_category11_use_of_sold_products_co2e": "M",
        "scope3_category12_end_of_life_treatment_co2e": "M",
        "scope3_category13_downstream_leased_assets_co2e": "M",
        "scope3_category14_franchises_co2e": "M",
        "scope3_category15_investments_co2e": "M",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",
        "base_year_emissions_co2e": "M",
        "base_year_recalculation_policy": "M",
        
        # Verification
        "verification_required": "O",
        "verification_standard": "O",
        "verifier_organization_name": "O",
        
        # Methodology - Required for Scope 3
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "M",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # Science Based Targets initiative (SBTi)
    # Source: https://sciencebasedtargets.org/resources/files/SBTi-criteria.pdf
    "SBTI_COMMITMENT": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",  # Sector-specific pathways
        "organization_headcount": "O",
        "organization_revenue_eur": "M",  # For SME vs Corporate distinction
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",  # Max 5% exclusions
        
        # GHG Emissions - Scope 1 & 2 (Mandatory coverage)
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "O",
        "scope1_breakdown_process_co2e": "O",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope2_electricity_consumption_mwh": "O",
        
        # Scope 3 - Required if >40% of total emissions
        "scope3_category1_purchased_goods_co2e": "M",  # Required for most companies
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "M",  # Often significant
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "M",  # Often significant
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",  # Critical for SBTi
        "base_year_emissions_co2e": "M",
        "base_year_recalculation_policy": "M",
        
        # Verification - Required for validation
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        
        # Targets - Core to SBTi
        "emission_reduction_targets_list": "M",
        "net_zero_target_year": "M",
        "decarbonisation_strategy_summary": "M",
        
        # SBTi specific
        "sbti_target_type": "M",  # Near-term, long-term, net-zero
        "sbti_target_status": "M",  # Committed, targets set, validated
        "sbti_target_ambition_level": "M",  # 1.5C, well-below 2C
        "sbti_boundary_coverage_percent": "M",  # Must cover 95%+ of S1&2
        "sbti_scope3_screening_results": "M",  # Required for threshold determination
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # RE100 - 100% Renewable Electricity
    # Source: https://www.there100.org/technical-guidance
    "RE100_REPORTING": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "M",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions - Scope 2 focused
        "scope1_total_co2e": "O",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",  # Critical for RE100
        "scope2_electricity_consumption_mwh": "M",  # Core metric
        "scope2_steam_heat_cold_energy_mwh": "O",
        
        # Scope 3 - Not applicable for RE100
        "scope3_category1_purchased_goods_co2e": "N",
        "scope3_category2_capital_goods_co2e": "N",
        "scope3_category3_fuel_energy_activities_co2e": "O",  # Transmission losses
        
        # Energy - Core to RE100
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "M",  # Core metric
        "renewable_energy_sourcing_methods": "M",
        "renewable_energy_certificates_mwh": "M",
        "power_purchase_agreements_mwh": "M",
        "onsite_renewable_generation_mwh": "M",
        
        # RE100 specific
        "re100_target_year": "M",  # Must commit to 100% by 2050 at latest
        "re100_interim_targets": "M",
        "re100_electricity_coverage_percent": "M",
        "re100_renewable_sources_list": "M",
        
        # Verification
        "verification_required": "M",
        "verification_standard": "O",
        "verifier_organization_name": "O",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # GRESB Real Estate Assessment
    # Source: https://www.gresb.com/nl-en/real-estate-reference-guide/
    "GRESB_ASSESSMENT": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",  # Real estate/infrastructure
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "M",  # GAV required
        "reporting_boundary_approach": "M",
        "countries_of_operation": "M",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "M",
        
        # GHG Emissions
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "M",  # Refrigerants important for RE
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope2_electricity_consumption_mwh": "M",
        "scope2_steam_heat_cold_energy_mwh": "M",
        
        # Scope 3 - Selected categories for RE
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "N",
        "scope3_category5_waste_generated_co2e": "M",  # Waste important for RE
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "N",
        "scope3_category9_downstream_transport_co2e": "N",
        "scope3_category10_processing_of_sold_products_co2e": "N",
        "scope3_category11_use_of_sold_products_co2e": "N",
        "scope3_category12_end_of_life_treatment_co2e": "N",
        "scope3_category13_downstream_leased_assets_co2e": "M",  # Tenant emissions
        "scope3_category14_franchises_co2e": "N",
        "scope3_category15_investments_co2e": "O",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        
        # Verification
        "verification_required": "M",  # Data verification required
        "verification_standard": "M",
        "verifier_organization_name": "M",
        
        # Climate Governance
        "climate_governance_description": "M",
        "climate_risk_management_process": "M",
        "climate_risks_physical_description": "M",
        "climate_risks_transition_description": "M",
        "emission_reduction_targets_list": "M",
        "decarbonisation_strategy_summary": "M",
        
        # Energy - Important for GRESB
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "M",
        "energy_efficiency_measures_summary": "M",
        
        # Water - Important for RE
        "water_withdrawals_m3": "M",
        "water_consumption_m3": "M",
        
        # Waste
        "waste_generated_total_tonnes": "M",
        "waste_recycled_tonnes": "M",
        
        # GHG intensity - Like-for-like metrics important
        "ghg_intensity_per_revenue_tco2e_eur": "O",
        "ghg_intensity_per_sqm_tco2e": "M",  # Core GRESB metric
        
        # GRESB specific
        "gresb_score": "M",
        "gresb_peer_ranking": "M",
        "gresb_coverage_assets_percent": "M",
        "gresb_building_certifications_list": "M",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "O",  # Some overlap
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # B Corp Impact Assessment
    # Source: https://www.bcorporation.net/en-us/standards/
    "BCORP_IMPACT_ASSESSMENT": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",
        "organization_headcount": "M",  # Size impacts assessment
        "organization_revenue_eur": "M",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "M",
        "consolidated_entities_list": "M",
        "exclusions_scope_explanation": "O",
        
        # GHG Emissions - Environment section
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "M",
        
        # Scope 3 - Supply chain questions
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        
        # Totals
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        
        # Verification - Not mandatory but improves score
        "verification_required": "O",
        "verification_standard": "O",
        
        # Climate/Environment
        "climate_governance_description": "M",
        "emission_reduction_targets_list": "M",
        "decarbonisation_strategy_summary": "O",
        
        # Energy
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "M",
        
        # Water
        "water_withdrawals_m3": "M",
        
        # Waste
        "waste_generated_total_tonnes": "M",
        "waste_recycled_tonnes": "M",
        
        # Social - Workers section
        "own_employees_total_headcount": "M",
        "own_employees_permanent_headcount": "M",
        "own_employees_temporary_headcount": "M",
        "employee_turnover_rate_percent": "M",
        "gender_pay_gap_percent": "M",
        "women_in_management_percent": "M",
        "board_gender_diversity_percent": "M",
        "training_hours_total": "M",
        "health_safety_incidents_total": "M",
        
        # BCorp specific
        "bcorp_impact_areas_scores": "M",  # 5 impact areas
        "bcorp_governance_structure_description": "M",
        "bcorp_overall_score": "M",  # Min 80 points required
        "bcorp_verification_status": "M",
        
        # Other regulations - not applicable
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    # Corporate GHG Report (generic based on GHG Protocol)
    "CORP_GHG": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "O",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "O",
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        "verification_required": "O",
        "methodology_reference_documents": "M",
        "ghg_co2_tonnes": "O",
        "ghg_ch4_co2e": "O",
        "ghg_n2o_co2e": "O",
    },
    
    # Corporate GHG Verified
    "CORP_GHG_VERIFIED": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "O",
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",
        "base_year_emissions_co2e": "M",
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "M",
    },
    
    # Corporate GHG Simplified (basic version)
    "CORP_GHG_SIMPLIFIED": {
        "regulatory_requirements_checked": "O",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "reporting_boundary_approach": "O",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "total_corporate_ghg_co2e": "M",
        "methodology_reference_documents": "O",
    },
    
    # Corporate GHG Annual Report
    "CORP_GHG_ANNUAL": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "O",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope3_category1_purchased_goods_co2e": "O",
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",
        "base_year_emissions_co2e": "M",
        "base_year_recalculation_policy": "O",
        "verification_required": "O",
        "emission_reduction_targets_list": "O",
        "climate_governance_description": "O",
        "methodology_reference_documents": "M",
        "ghg_intensity_per_revenue_tco2e_eur": "O",
    },
    
    # Corporate GHG Public Report
    "CORP_GHG_PUBLIC": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",
        "base_year_emissions_co2e": "M",
        "verification_required": "O",
        "verification_standard": "O",
        "verifier_organization_name": "O",
        "emission_reduction_targets_list": "M",
        "net_zero_target_year": "O",
        "climate_governance_description": "M",
        "decarbonisation_strategy_summary": "O",
        "methodology_reference_documents": "M",
        "ghg_intensity_per_revenue_tco2e_eur": "O",
    },
    
    # Corporate GHG Internal Report
    "CORP_GHG_INTERNAL": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "reporting_boundary_approach": "O",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "total_corporate_ghg_co2e": "M",
        "methodology_reference_documents": "O",
    },
    
    # EcoVadis Score Report
    "ECOVADIS_SCORE": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",
        "organization_headcount": "M",
        "organization_revenue_eur": "O",
        "countries_of_operation": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "total_corporate_ghg_co2e": "M",
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "O",
        "water_withdrawals_m3": "O",
        "waste_generated_total_tonnes": "O",
        "waste_hazardous_tonnes": "O",
        "own_employees_total_headcount": "M",
        "health_safety_incidents_total": "M",
        "climate_governance_description": "O",
        "emission_reduction_targets_list": "O",
    },
    
    # Environmental Product Declaration / ISO 14067
    "EPD_OR_ISO_14067": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "product_name": "M",
        "product_functional_unit": "M",
        "product_carbon_footprint_kgco2e": "M",
        "product_lca_scope": "M",
        "product_lca_methodology": "M",
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
    },
    
    # Product Carbon Footprint
    "PRODUCT_PCF": {
        "regulatory_requirements_checked": "O",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "product_name": "M",
        "product_functional_unit": "M",
        "product_carbon_footprint_kgco2e": "M",
        "product_lca_scope": "M",
        "product_lca_methodology": "M",
        "verification_required": "O",
    },
    
    # Client Scope 3 Package (for supply chain requests)
    "CLIENT_SCOPE3_PACKAGE": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope3_category1_purchased_goods_co2e": "O",
        "total_corporate_ghg_co2e": "M",
        "ghg_intensity_per_revenue_tco2e_eur": "M",
        "methodology_reference_documents": "O",
    },
    
    # Client Template Fill
    "CLIENT_TEMPLATE_FILL": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "scope1_total_co2e": "O",
        "scope2_total_location_based_co2e": "O",
        "total_corporate_ghg_co2e": "O",
    },
    
    # Scope 3 Detailed Report
    "SCOPE3_DETAILED": {
        "regulatory_requirements_checked": "O",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "reporting_boundary_approach": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope3_category1_purchased_goods_co2e": "M",
        "scope3_category2_capital_goods_co2e": "M",
        "scope3_category3_fuel_energy_activities_co2e": "M",
        "scope3_category4_upstream_transport_co2e": "M",
        "scope3_category5_waste_generated_co2e": "M",
        "scope3_category6_business_travel_co2e": "M",
        "scope3_category7_employee_commuting_co2e": "M",
        "scope3_category8_upstream_leased_assets_co2e": "M",
        "scope3_category9_downstream_transport_co2e": "M",
        "scope3_category10_processing_of_sold_products_co2e": "M",
        "scope3_category11_use_of_sold_products_co2e": "M",
        "scope3_category12_end_of_life_treatment_co2e": "M",
        "scope3_category13_downstream_leased_assets_co2e": "M",
        "scope3_category14_franchises_co2e": "M",
        "scope3_category15_investments_co2e": "M",
        "total_corporate_ghg_co2e": "M",
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "M",
    },
    
    # Carbon Neutral Certification
    "CARBON_NEUTRAL_CERT": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "reporting_boundary_approach": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "total_corporate_ghg_co2e": "M",
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "offsets_purchased_co2e": "M",
        "offsets_programs_list": "M",
        "carbon_neutral_claim_boundary": "M",
        "carbon_neutral_certification_scheme": "M",
    },
    
    # TCFD Report (generic TCFD following recommendations)
    "TCFD_REPORT": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_revenue_eur": "O",
        "reporting_boundary_approach": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope3_category1_purchased_goods_co2e": "O",
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "verification_required": "O",
        "climate_governance_description": "M",
        "climate_risk_management_process": "M",
        "climate_risks_physical_description": "M",
        "climate_risks_transition_description": "M",
        "climate_scenarios_used": "M",
        "climate_scenario_results_summary": "M",
        "emission_reduction_targets_list": "M",
        "net_zero_target_year": "O",
        "decarbonisation_strategy_summary": "M",
        "transition_plan_description": "M",
        "climate_financial_impacts_summary": "M",
        "physical_risk_financial_impact_eur": "O",
        "transition_risk_financial_impact_eur": "O",
        "ghg_intensity_per_revenue_tco2e_eur": "O",
    },
    
    # Bank Template Fill
    "BANK_TEMPLATE_FILL": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_revenue_eur": "O",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "total_corporate_ghg_co2e": "M",
        "verification_required": "O",
        "ghg_intensity_per_revenue_tco2e_eur": "O",
    },
    
    # Scope 1, 2, 3 Dataset Export
    "SCOPE123_DATASET": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "reporting_boundary_approach": "O",
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "O",
        "scope1_breakdown_process_co2e": "O",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope3_category1_purchased_goods_co2e": "O",
        "scope3_category2_capital_goods_co2e": "O",
        "scope3_category3_fuel_energy_activities_co2e": "O",
        "scope3_category4_upstream_transport_co2e": "O",
        "scope3_category5_waste_generated_co2e": "O",
        "scope3_category6_business_travel_co2e": "O",
        "scope3_category7_employee_commuting_co2e": "O",
        "scope3_category8_upstream_leased_assets_co2e": "O",
        "scope3_category9_downstream_transport_co2e": "O",
        "scope3_category10_processing_of_sold_products_co2e": "O",
        "scope3_category11_use_of_sold_products_co2e": "O",
        "scope3_category12_end_of_life_treatment_co2e": "O",
        "scope3_category13_downstream_leased_assets_co2e": "O",
        "scope3_category14_franchises_co2e": "O",
        "scope3_category15_investments_co2e": "O",
        "total_corporate_ghg_co2e": "M",
    },
    
    # Preparation for GHG Reporting
    "PREP_GHG": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "reporting_boundary_approach": "M",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "O",
        "methodology_reference_documents": "O",
    },
    
    # Climate Action Plan
    "CLIMATE_ACTION_PLAN": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "total_corporate_ghg_co2e": "M",
        "base_year": "M",
        "base_year_emissions_co2e": "M",
        "emission_reduction_targets_list": "M",
        "net_zero_target_year": "O",
        "decarbonisation_strategy_summary": "M",
        "energy_efficiency_measures_summary": "M",
        "renewable_energy_strategy_summary": "O",
    },
    
    # RECs or PPA Strategy
    "RECS_OR_PPA_STRATEGY": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope2_electricity_consumption_mwh": "M",
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "M",
        "renewable_energy_sourcing_methods": "M",
        "renewable_energy_certificates_mwh": "M",
        "power_purchase_agreements_mwh": "O",
        "recs_financial_impacts_amount": "O",
    },
    
    # Energy Audit Scope 1 & 2
    "ENERGY_AUDIT_SCOPE12": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "reporting_boundary_approach": "M",
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "M",
        "scope1_breakdown_mobile_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_electricity_consumption_mwh": "M",
        "scope2_steam_heat_cold_energy_mwh": "O",
        "energy_total_consumption_mwh": "M",
        "energy_efficiency_measures_summary": "M",
    },
    
    # Building Carbon Footprint
    "BUILDING_CARBON_FOOTPRINT": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "scope1_total_co2e": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "M",
        "scope2_steam_heat_cold_energy_mwh": "O",
        "energy_total_consumption_mwh": "M",
        "ghg_intensity_per_sqm_tco2e": "M",
        "building_floor_area_sqm": "M",
        "building_certification_type": "O",
    },
    
    # Scope 2 Detailed Report
    "SCOPE2_DETAILED": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "reporting_boundary_approach": "M",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "M",
        "scope2_electricity_consumption_mwh": "M",
        "scope2_steam_heat_cold_energy_mwh": "M",
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "O",
        "renewable_energy_sourcing_methods": "O",
        "renewable_energy_certificates_mwh": "O",
        "power_purchase_agreements_mwh": "O",
        "methodology_reference_documents": "M",
    },
    
    # Scope 3 Category 1 Suppliers
    "SCOPE3_CATEGORY1_SUPPLIERS": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "scope3_category1_purchased_goods_co2e": "M",
        "supplier_engagement_rate_percent": "O",
        "methodology_reference_documents": "M",
        "data_quality_assessment_summary": "M",
    },
    
    # CBAM Data Package
    "CBAM_DATA_PACKAGE": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "cbam_importer_eori": "M",
        "cbam_goods_category": "M",
        "cbam_embedded_emissions_co2e": "M",
        "cbam_country_of_origin": "M",
        "cbam_installation_id": "M",
        "cbam_production_process_description": "M",
        "cbam_carbon_price_paid_eur": "O",
    },
    
    # CBAM Report
    "CBAM_REPORT": {
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "cbam_importer_eori": "M",
        "cbam_goods_category": "M",
        "cbam_embedded_emissions_co2e": "M",
        "cbam_country_of_origin": "M",
        "cbam_installation_id": "M",
        "cbam_production_process_description": "M",
        "cbam_carbon_price_paid_eur": "M",
        "cbam_certificates_required": "M",
        "verification_required": "M",
        "verifier_organization_name": "M",
    },
    
    # CBAM Allowances Calculation
    "CBAM_ALLOWANCES": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "cbam_importer_eori": "M",
        "cbam_goods_category": "M",
        "cbam_embedded_emissions_co2e": "M",
        "cbam_carbon_price_paid_eur": "M",
        "cbam_certificates_required": "M",
    },
    
    # CBAM Monitoring Alert
    "CBAM_MONITORING_ALERT": {
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "legal_entity_identifier": "M",
        "cbam_importer_eori": "M",
        "cbam_goods_category": "O",
    },
    
    # CBAM Preparation Method
    "CBAM_PREP_METHOD": {
        "legal_entity_identifier": "M",
        "cbam_importer_eori": "O",
        "cbam_goods_category": "O",
        "cbam_production_process_description": "O",
    },
    
    "EU_ETS": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "M",
        "organization_headcount": "N",
        "organization_revenue_eur": "N",
        "organization_assets_eur": "N",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "N",
        "consolidated_entities_list": "N",
        "exclusions_scope_explanation": "O",
        
        # GHG - Only Scope 1 for EU ETS
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "M",
        "scope1_breakdown_mobile_co2e": "N",
        "scope1_breakdown_fugitive_co2e": "M",
        "scope1_breakdown_process_co2e": "M",
        "scope2_total_location_based_co2e": "N",
        "scope2_total_market_based_co2e": "N",
        "scope2_electricity_consumption_mwh": "N",
        "scope2_steam_heat_cold_energy_mwh": "N",
        
        # Scope 3 - Not applicable to EU ETS
        "scope3_category1_purchased_goods_co2e": "N",
        "scope3_category2_capital_goods_co2e": "N",
        "scope3_category3_fuel_energy_activities_co2e": "N",
        "scope3_category4_upstream_transport_co2e": "N",
        "scope3_category5_waste_generated_co2e": "N",
        "scope3_category6_business_travel_co2e": "N",
        "scope3_category7_employee_commuting_co2e": "N",
        "scope3_category8_upstream_leased_assets_co2e": "N",
        "scope3_category9_downstream_transport_co2e": "N",
        "scope3_category10_processing_of_sold_products_co2e": "N",
        "scope3_category11_use_of_sold_products_co2e": "N",
        "scope3_category12_end_of_life_treatment_co2e": "N",
        "scope3_category13_downstream_leased_assets_co2e": "N",
        "scope3_category14_franchises_co2e": "N",
        "scope3_category15_investments_co2e": "N",
        
        # Totals
        "total_corporate_ghg_co2e": "N",
        "base_year": "N",
        "base_year_emissions_co2e": "N",
        "base_year_recalculation_policy": "N",
        
        # Verification - MANDATORY for EU ETS
        "verification_required": "M",
        "verification_standard": "M",
        "verifier_organization_name": "M",
        "verifier_scope_statement": "M",
        "verification_level_assurance": "M",
        
        # Offsets
        "offsets_purchased_co2e": "N",
        "offsets_programs_list": "N",
        "carbon_neutral_claim_boundary": "N",
        
        # Climate Governance - not required by EU ETS
        "climate_governance_description": "N",
        "climate_risk_management_process": "N",
        "climate_risks_physical_description": "N",
        "climate_risks_transition_description": "N",
        "climate_scenarios_used": "N",
        "climate_scenario_results_summary": "N",
        "emission_reduction_targets_list": "N",
        "net_zero_target_year": "N",
        "decarbonisation_strategy_summary": "N",
        "energy_efficiency_measures_summary": "N",
        "renewable_energy_strategy_summary": "N",
        "climate_financial_impacts_summary": "N",
        
        # Energy - used in calculations
        "energy_total_consumption_mwh": "O",
        "renewable_energy_share_percent": "N",
        
        # EU ETS specific - MANDATORY
        "eu_ets_compliance_year": "M",
        "eu_ets_installations_list": "M",
        "eu_ets_verified_emissions_co2e": "M",
        "eu_ets_allowances_surrendered_quantity": "M",
        "eu_ets_free_allowances_quantity": "M",
        "eu_ets_market_allowances_purchased_quantity": "O",
        "eu_ets_market_allowances_sold_quantity": "O",
        "eu_ets_balance_surplus_quantity": "O",
        "eu_ets_verification_body_name": "M",
        "eu_ets_compliance_statement": "M",
        "eu_ets_monitoring_methodology_reference": "M",
        "eu_ets_installation_permit_numbers": "M",
        "eu_ets_activity_level_data": "M",
        "eu_ets_fall_back_methodology_used": "O",
        
        # Data quality
        "data_quality_assessment_summary": "O",
        "methodology_reference_documents": "M",
        "limitations_and_uncertainties_summary": "O",
        "comparability_notes": "N",
        "responsible_officer_name": "M",
        "responsible_officer_role": "M",
        
        # CBAM, UK SECR, SFDR, CSRD - separate regulations
        "cbam_importer_eori": "N",
        "cbam_goods_cn_codes": "N",
        "uk_secr_company_size_category": "N",
        "sfdr_pai_indicators_summary": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    "UK_SECR": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "O",
        "organization_revenue_eur": "O",
        "organization_assets_eur": "O",
        "reporting_boundary_approach": "M",
        "countries_of_operation": "O",
        "consolidated_entities_list": "O",
        "exclusions_scope_explanation": "O",
        
        # GHG - Scope 1 and 2 mandatory
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "O",
        "scope1_breakdown_mobile_co2e": "O",
        "scope1_breakdown_fugitive_co2e": "O",
        "scope1_breakdown_process_co2e": "O",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "O",
        "scope2_steam_heat_cold_energy_mwh": "O",
        
        # Scope 3 - NOT required by UK SECR
        "scope3_category1_purchased_goods_co2e": "N",
        "scope3_category2_capital_goods_co2e": "N",
        "scope3_category3_fuel_energy_activities_co2e": "N",
        "scope3_category4_upstream_transport_co2e": "N",
        "scope3_category5_waste_generated_co2e": "N",
        "scope3_category6_business_travel_co2e": "N",
        "scope3_category7_employee_commuting_co2e": "N",
        "scope3_category8_upstream_leased_assets_co2e": "N",
        "scope3_category9_downstream_transport_co2e": "N",
        "scope3_category10_processing_of_sold_products_co2e": "N",
        "scope3_category11_use_of_sold_products_co2e": "N",
        "scope3_category12_end_of_life_treatment_co2e": "N",
        "scope3_category13_downstream_leased_assets_co2e": "N",
        "scope3_category14_franchises_co2e": "N",
        "scope3_category15_investments_co2e": "N",
        
        # Totals
        "total_corporate_ghg_co2e": "O",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        "base_year_recalculation_policy": "N",
        
        # Verification - NOT required by UK SECR
        "verification_required": "N",
        "verification_standard": "N",
        "verifier_organization_name": "N",
        "verifier_scope_statement": "N",
        "verification_level_assurance": "N",
        
        # Energy - MANDATORY for UK SECR
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "O",
        
        # UK SECR specific - MANDATORY
        "uk_secr_company_size_category": "M",
        "uk_secr_energy_intensity_ratio": "M",
        "uk_secr_quantification_methodology": "M",
        
        # Data quality
        "methodology_reference_documents": "M",
        "comparability_notes": "O",
        
        # Climate governance - not required
        "climate_governance_description": "N",
        "climate_risk_management_process": "N",
        "emission_reduction_targets_list": "O",
        
        # EU specific - separate jurisdiction
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "sfdr_pai_indicators_summary": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    "CBAM": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "N",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "N",
        "organization_revenue_eur": "N",
        "reporting_boundary_approach": "N",
        
        # GHG - CBAM uses embedded emissions, not corporate scope
        "scope1_total_co2e": "N",
        "scope2_total_location_based_co2e": "N",
        "scope3_category1_purchased_goods_co2e": "N",
        "total_corporate_ghg_co2e": "N",
        "base_year": "N",
        
        # Verification
        "verification_required": "M",
        "verification_standard": "O",
        "verifier_organization_name": "O",
        
        # CBAM specific - MANDATORY
        "cbam_importer_eori": "M",
        "cbam_authorised_declarant_id": "M",
        "cbam_goods_cn_codes": "M",
        "cbam_reporting_quarter": "M",
        "cbam_total_embedded_emissions_co2e": "M",
        "cbam_free_allowances_quantity": "O",
        "cbam_certificates_purchased_quantity": "M",
        "cbam_certificates_used_quantity": "M",
        "cbam_monitoring_methodology_description": "M",
        "cbam_supplier_data_availability": "M",
        "cbam_third_country_carbon_price_paid_eur": "M",
        "cbam_production_process_description": "M",
        "cbam_precursor_materials_emissions": "M",
        "cbam_installation_boundaries": "M",
        
        # Climate governance - not required
        "climate_governance_description": "N",
        "emission_reduction_targets_list": "N",
        
        # Energy
        "energy_total_consumption_mwh": "O",
        
        # Other regulations
        "eu_ets_compliance_year": "N",
        "uk_secr_company_size_category": "N",
        "sfdr_pai_indicators_summary": "N",
        "csrd_double_materiality_assessment": "N",
    },
    
    "SFDR": {
        # Core Reporting
        "regulatory_requirements_checked": "M",
        "reporting_period_start": "M",
        "reporting_period_end": "M",
        "reporting_scope_type": "M",
        "legal_entity_identifier": "M",
        "organization_sector_code": "O",
        "organization_headcount": "M",
        "organization_revenue_eur": "O",
        "reporting_boundary_approach": "M",
        
        # GHG - PAI 1-3 MANDATORY
        "scope1_total_co2e": "M",
        "scope1_breakdown_stationary_co2e": "N",
        "scope1_breakdown_mobile_co2e": "N",
        "scope1_breakdown_fugitive_co2e": "N",
        "scope1_breakdown_process_co2e": "N",
        "scope2_total_location_based_co2e": "M",
        "scope2_total_market_based_co2e": "O",
        "scope2_electricity_consumption_mwh": "N",
        
        # Scope 3 - MANDATORY as part of PAI 1
        "scope3_category1_purchased_goods_co2e": "M",
        "scope3_category2_capital_goods_co2e": "M",
        "scope3_category3_fuel_energy_activities_co2e": "M",
        "scope3_category4_upstream_transport_co2e": "M",
        "scope3_category5_waste_generated_co2e": "M",
        "scope3_category6_business_travel_co2e": "M",
        "scope3_category7_employee_commuting_co2e": "M",
        "scope3_category8_upstream_leased_assets_co2e": "M",
        "scope3_category9_downstream_transport_co2e": "M",
        "scope3_category10_processing_of_sold_products_co2e": "M",
        "scope3_category11_use_of_sold_products_co2e": "M",
        "scope3_category12_end_of_life_treatment_co2e": "M",
        "scope3_category13_downstream_leased_assets_co2e": "M",
        "scope3_category14_franchises_co2e": "M",
        "scope3_category15_investments_co2e": "M",
        
        # Totals - MANDATORY
        "total_corporate_ghg_co2e": "M",
        "base_year": "O",
        "base_year_emissions_co2e": "O",
        
        # Verification - NOT required by SFDR
        "verification_required": "N",
        "verification_standard": "N",
        "verifier_organization_name": "N",
        
        # Financed emissions - MANDATORY for financial entities
        "financed_emissions_total_co2e": "M",
        "portfolio_coverage_percent": "M",
        
        # SFDR specific - MANDATORY
        "sfdr_pai_indicators_summary": "M",
        "sfdr_pai_indicator_entries": "M",
        "sfdr_article_classification": "M",
        "sfdr_do_no_significant_harm_assessment": "M",
        "sfdr_principal_adverse_impacts_metrics": "M",
        
        # Taxonomy alignment - MANDATORY for Art 8/9
        "green_assets_ratio": "M",
        "taxonomy_aligned_revenue_percent": "M",
        "taxonomy_aligned_capex_percent": "M",
        "taxonomy_aligned_opex_percent": "M",
        
        # Energy - PAI 5/6 MANDATORY
        "energy_total_consumption_mwh": "M",
        "renewable_energy_share_percent": "O",
        
        # GHG intensity - PAI 2/3 MANDATORY
        "ghg_intensity_per_revenue_tco2e_eur": "M",
        "ghg_intensity_per_fte_tco2e": "O",
        
        # Governance/Social - MANDATORY PAI
        "board_gender_diversity_percent": "M",
        "board_independence_percent": "O",
        "gender_pay_gap_percent": "M",
        
        # Biodiversity - PAI 7 MANDATORY
        "biodiversity_sensitive_areas_list": "M",
        
        # Water - PAI 8 MANDATORY
        "water_consumption_m3": "M",
        
        # Waste - PAI 9 MANDATORY
        "waste_hazardous_tonnes": "M",
        
        # Social - PAI 10-14 MANDATORY
        "human_rights_incidents_reported": "M",
        
        # Climate governance - not directly required
        "climate_governance_description": "O",
        "emission_reduction_targets_list": "O",
        
        # Other regulations
        "eu_ets_compliance_year": "N",
        "cbam_importer_eori": "N",
        "uk_secr_company_size_category": "N",
        "csrd_double_materiality_assessment": "N",
    },
}

def fill_row(row_data, headers, report_type):
    """Fill a row with M/O/N values based on mapping."""
    mapping = MAPPINGS.get(report_type, {})
    new_row = list(row_data)
    
    for i, header in enumerate(headers):
        if i < 2:  # Skip data_point and __reference_urls__ columns
            continue
        
        if header in mapping:
            new_row[i] = mapping[header]
        elif row_data[i] == '':
            # If no mapping and cell is empty, default behavior
            # Keep as empty - will be N for unmapped columns
            if report_type in MAPPINGS:
                # For mapped reports, unmarked columns are N
                new_row[i] = 'N'
    
    return new_row


def main():
    csv_path = Path("/Users/user/Documents/github/carbonreport/docs/data points guide/datapoints-reports matrix.csv")
    
    # Read the CSV
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f, delimiter=';')
        rows = list(reader)
    
    headers = rows[0]
    data_rows = rows[1:]
    
    # Process each row
    new_rows = [headers]
    for row in data_rows:
        if len(row) == 0:
            new_rows.append(row)
            continue
            
        report_type = row[0]
        
        # Check if this is a report type we have mappings for
        if report_type in MAPPINGS:
            new_row = fill_row(row, headers, report_type)
            new_rows.append(new_row)
            print(f"Filled: {report_type}")
        else:
            # Keep row as-is for unmapped reports
            new_rows.append(row)
            print(f"Skipped (no mapping): {report_type}")
    
    # Write back to CSV
    output_path = csv_path  # Overwrite original
    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerows(new_rows)
    
    print(f"\nMatrix updated: {output_path}")


if __name__ == "__main__":
    main()
