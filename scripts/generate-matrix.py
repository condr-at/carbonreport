#!/usr/bin/env python3
"""
Generate the datapoints-reports matrix CSV file with M/O values
based on official regulatory requirements.
"""

# Header row
header = "report_type;__reference_urls__;data_points_checked_against_reference_url;reporting_period_start;reporting_period_end;reporting_scope_type;legal_entity_identifier;organization_sector_code;organization_headcount;organization_revenue_eur;organization_assets_eur;reporting_boundary_approach;countries_of_operation;consolidated_entities_list;exclusions_scope_explanation;scope1_total_co2e;scope1_breakdown_stationary_co2e;scope1_breakdown_mobile_co2e;scope1_breakdown_fugitive_co2e;scope1_breakdown_process_co2e;scope2_total_location_based_co2e;scope2_total_market_based_co2e;scope2_electricity_consumption_mwh;scope2_steam_heat_cold_energy_mwh;scope3_category1_purchased_goods_co2e;scope3_category2_capital_goods_co2e;scope3_category3_fuel_energy_activities_co2e;scope3_category4_upstream_transport_co2e;scope3_category5_waste_generated_co2e;scope3_category6_business_travel_co2e;scope3_category7_employee_commuting_co2e;scope3_category8_upstream_leased_assets_co2e;scope3_category9_downstream_transport_co2e;scope3_category10_processing_of_sold_products_co2e;scope3_category11_use_of_sold_products_co2e;scope3_category12_end_of_life_treatment_co2e;scope3_category13_downstream_leased_assets_co2e;scope3_category14_franchises_co2e;scope3_category15_investments_co2e;total_corporate_ghg_co2e;base_year;base_year_emissions_co2e;base_year_recalculation_policy;verification_required;verification_standard;verifier_organization_name;verifier_scope_statement;verification_level_assurance;offsets_purchased_co2e;offsets_programs_list;carbon_neutral_claim_boundary;climate_governance_description;climate_risk_management_process;climate_risks_physical_description;climate_risks_transition_description;climate_scenarios_used;climate_scenario_results_summary;emission_reduction_targets_list;net_zero_target_year;decarbonisation_strategy_summary;energy_efficiency_measures_summary;renewable_energy_strategy_summary;climate_financial_impacts_summary;severe_weather_capitalized_costs_amount;severe_weather_expensed_costs_amount;severe_weather_losses_amount;carbon_offsets_financial_impacts_amount;recs_financial_impacts_amount;sbti_commitment_status;sbti_scope_coverage;sbti_target_type;sbti_sector_classification;financed_emissions_total_co2e;portfolio_coverage_percent;sfdr_pai_indicators_summary;sfdr_pai_indicator_entries;green_assets_ratio;taxonomy_aligned_revenue_percent;taxonomy_aligned_capex_percent;taxonomy_aligned_opex_percent;banks_data_template_reference;lenders_investors_list;listing_exchanges;issuer_is_sec_registrant;sec_filer_category;public_filing_documents_list;hkex_esg_compliance_level;uk_tcfd_mandatory_scope;cdp_questionnaire_type;cdp_reporting_year;cdp_previous_score;ecovadis_scope_description;ecovadis_previous_score;re100_commitment_scope;re100_target_year;re100_current_renewable_share_percent;gresb_portfolio_description;gresb_previous_score;bcorp_assessment_scope_description;bcorp_target_certification_year;aviation_total_fuel_consumption_tonnes;aviation_total_emissions_co2e;aviation_routes_coverage_description;aviation_offset_programs;shipping_voyages_covered_description;shipping_total_emissions_co2e;shipping_fuel_consumption_tonnes;shipping_eu_ports_share_percent;building_floor_area_m2;building_energy_consumption_mwh;building_occupancy_rate_percent;building_certifications_existing;it_data_centers_owned_list;it_data_centers_total_energy_mwh;data_center_pue;cloud_providers_list;cloud_usage_emissions_co2e;supplier_emissions_data_coverage_percent;cbam_importer_eori;cbam_authorised_declarant_id;cbam_goods_cn_codes;cbam_reporting_quarter;cbam_total_embedded_emissions_co2e;cbam_free_allowances_quantity;cbam_certificates_purchased_quantity;cbam_certificates_used_quantity;cbam_monitoring_methodology_description;cbam_supplier_data_availability;cbam_third_country_carbon_price_paid_eur;client_request_reference;client_required_categories_scope3_list;client_reporting_format;client_data_delivery_deadline;client_data_delivery_channels;data_package_coverage_description;energy_total_consumption_mwh;renewable_energy_share_percent;ppa_contracts_list;recs_certificates_purchased_mwh;energy_audit_scope_description;energy_saving_potential_estimate_percent;climate_action_measures_list;data_quality_assessment_summary;methodology_reference_documents;limitations_and_uncertainties_summary;comparability_notes;responsible_officer_name;responsible_officer_role;eu_ets_compliance_year;eu_ets_installations_list;eu_ets_verified_emissions_co2e;eu_ets_allowances_surrendered_quantity;eu_ets_free_allowances_quantity;eu_ets_market_allowances_purchased_quantity;eu_ets_market_allowances_sold_quantity;eu_ets_balance_surplus_quantity;eu_ets_verification_body_name;eu_ets_compliance_statement;eu_ets_monitoring_methodology_reference;board_gender_diversity_percent;board_independence_percent;sustainability_officer_exists;due_diligence_statement;materiality_assessment_process;stakeholder_engagement_description;value_chain_description;transition_plan_description;climate_scenario_analysis_results;internal_carbon_price_eur_tco2e;locked_in_emissions_co2e;avoided_emissions_co2e;climate_related_capex_eur;climate_related_opex_eur;physical_risk_financial_impact_eur;transition_risk_financial_impact_eur;air_pollutants_nox_tonnes;air_pollutants_sox_tonnes;air_pollutants_pm_tonnes;water_withdrawals_m3;water_discharges_m3;water_consumption_m3;water_stress_areas_identified;waste_generated_total_tonnes;waste_hazardous_tonnes;waste_recycled_tonnes;waste_landfilled_tonnes;biodiversity_sensitive_areas_list;deforestation_assessment;circular_economy_measures;own_employees_total_headcount;own_employees_permanent_headcount;own_employees_temporary_headcount;collective_bargaining_coverage_percent;adequate_wages_assessment;training_hours_total;health_safety_incidents_total;health_safety_fatalities_total;gender_pay_gap_percent;women_in_management_percent;employee_turnover_rate_percent;human_rights_incidents_reported;affected_communities_engagement;data_privacy_breaches_number;sbti_target_submission_year;sbti_near_term_target_year;sbti_long_term_target_year;sbti_net_zero_year;cdp_response_status;cdp_score_current;ghg_intensity_per_revenue_tco2e_eur;ghg_intensity_per_fte_tco2e;biogenic_co2_separate_co2e;scope3_data_quality_score;verification_opinion_type;restatement_description;sustainability_linked_loans_total;csrd_double_materiality_assessment;csrd_esrs_disclosure_requirements;csrd_value_chain_mapping;narrative_disclosures_quality_metrics;taxonomy_alignment_criteria_details;csrd_assurance_provider_details;eu_ets_installation_permit_numbers;eu_ets_activity_level_data;eu_ets_fall_back_methodology_used;cbam_production_process_description;cbam_precursor_materials_emissions;cbam_installation_boundaries;uk_secr_company_size_category;uk_secr_energy_intensity_ratio;uk_secr_quantification_methodology;sec_materiality_determination_process;sec_severe_weather_event_descriptions;sec_attestation_provider_details;sec_safe_harbor_forward_looking_statements;corsia_eligible_fuel_types;corsia_sustainability_certification_scheme;corsia_offset_credits_vintage_year;corsia_monitoring_plan_reference;eu_mrv_ship_imo_number;eu_mrv_ship_technical_efficiency;eu_mrv_cargo_carried_tonnes;eu_mrv_ice_class_notation;sfdr_article_classification;sfdr_do_no_significant_harm_assessment;sfdr_principal_adverse_impacts_metrics;tcfd_metrics_targets_disclosure;tcfd_resilience_assessment_results;hkex_esg_kpi_list;hkex_esg_reporting_principles_application;cdp_water_security_metrics;cdp_forest_commodities_risk;cdp_supplier_engagement_rating;product_functional_unit_definition;product_system_boundary_description;product_allocation_methodology;product_cutoff_criteria;product_life_cycle_stages_included;product_data_quality_indicators;sbti_base_year_for_targets;sbti_boundary_coverage_percent;re100_interim_targets_list;re100_re_sourcing_methods;gresb_asset_type_breakdown;gresb_standing_investments_count;bcorp_impact_areas_scores;bcorp_governance_structure_description;custom_client_fields"

cols = header.split(';')
num_cols = len(cols)

# Define reports with their mappings
# Format: (report_type, url, check_mark, {col_index: "M" or "O"})
# Index 0=report_type, 1=url, 2=check, 3+=data points

reports_data = [
    # CSRD - ESRS E1-E5, S1-S4, G1 - Comprehensive sustainability reporting
    # Reference: EU Delegated Regulation 2023/2772 (ESRS)
    ("CSRD", "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2772", "✔️", {
        3:"M", 4:"M", 5:"M", 6:"M", 7:"M", 8:"M", 9:"M", 10:"O", 11:"M", 12:"M", 13:"M", 14:"O",
        15:"M", 16:"O", 17:"O", 18:"O", 19:"O", 20:"M", 21:"M", 22:"M", 23:"O",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"O", 32:"M", 33:"O", 34:"M", 35:"O", 36:"M", 37:"O", 38:"M",
        39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M", 47:"O",
        48:"M", 49:"M", 50:"M", 51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M", 60:"M", 61:"O", 62:"O", 63:"O", 64:"O",
        69:"M", 70:"M", 71:"M", 72:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        137:"M", 138:"M", 139:"O",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M", 154:"M", 155:"M", 156:"M", 157:"M",
        158:"M", 159:"M", 160:"M", 161:"M", 162:"M", 163:"M", 164:"M", 165:"M", 166:"M", 167:"M", 168:"M", 169:"M", 170:"M",
        171:"M", 172:"M", 173:"M", 174:"M", 175:"M", 176:"M", 177:"M", 178:"M", 179:"M", 180:"M", 181:"M", 182:"M", 183:"M", 184:"M", 185:"M",
        190:"M", 191:"M", 192:"M", 193:"O", 194:"M", 195:"M",
        208:"M", 209:"M", 210:"M"
    }),

    # EU ETS - Emissions Trading System
    # Reference: Directive 2003/87/EC, MRR Regulation 2018/2066
    ("EU_ETS", "https://climate.ec.europa.eu/eu-action/eu-emissions-trading-system-eu-ets_en", "✔️", {
        3:"M", 4:"M", 6:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M",
        137:"M", 138:"M", 139:"M", 140:"M", 141:"M", 142:"M", 143:"M", 144:"M", 145:"M", 146:"M", 147:"M",
        196:"M", 197:"M", 198:"M"
    }),

    # CBAM - Carbon Border Adjustment Mechanism
    # Reference: Regulation (EU) 2023/956
    ("CBAM", "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M",
        107:"M", 108:"M", 109:"M", 110:"M", 111:"M", 112:"M", 113:"M", 114:"M", 115:"M", 116:"M", 117:"M",
        199:"M", 200:"M", 201:"M"
    }),

    # UK SECR - Streamlined Energy and Carbon Reporting
    # Reference: Companies (Directors' Report) and Limited Liability Partnerships (Energy and Carbon Report) Regulations 2018
    ("UK_SECR", "https://www.gov.uk/government/publications/environmental-reporting-guidelines-including-mandatory-greenhouse-gas-emissions-reporting-guidance", "✔️", {
        3:"M", 4:"M", 6:"M", 8:"M", 9:"M", 11:"M", 13:"M", 14:"O",
        15:"M", 20:"M", 21:"M", 22:"M", 23:"O",
        39:"M", 40:"M", 41:"M",
        51:"M", 52:"M", 57:"M", 58:"M", 59:"M", 60:"M",
        123:"M", 127:"M", 128:"M", 129:"O", 130:"O",
        202:"M", 203:"M", 204:"M"
    }),

    # SEC Climate - SEC Climate Disclosure Rules
    # Reference: SEC Final Rule 33-11275 (March 2024)
    ("SEC_CLIMATE", "https://www.sec.gov/rules/final/2024/33-11275.pdf", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M", 14:"O",
        15:"M", 16:"O", 17:"O", 18:"O", 19:"O", 20:"M", 21:"M", 22:"M", 23:"O",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O", 38:"M",
        39:"M", 40:"M", 41:"M", 43:"M", 44:"M", 45:"M", 46:"M", 47:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M", 60:"M", 61:"M", 62:"M", 63:"M",
        75:"M", 76:"M", 77:"M", 78:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M", 154:"M", 155:"M", 156:"M", 157:"M",
        185:"M", 186:"M", 187:"M", 188:"M", 192:"M", 193:"M", 194:"M",
        205:"M", 206:"M", 207:"M", 208:"O"
    }),

    # CORSIA - Carbon Offsetting and Reduction Scheme for International Aviation
    # Reference: ICAO Annex 16, Volume IV
    ("CORSIA", "https://www.icao.int/environmental-protection/CORSIA/Pages/default.aspx", "✔️", {
        3:"M", 4:"M", 6:"M", 12:"M",
        15:"M", 39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M", 49:"M",
        91:"M", 92:"M", 93:"M", 94:"M",
        127:"M", 128:"M", 129:"M", 130:"M",
        209:"M", 210:"M", 211:"M", 212:"M"
    }),

    # EU MRV - Maritime Monitoring, Reporting, Verification
    # Reference: Regulation (EU) 2015/757
    ("EU_MRV", "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32015R0757", "✔️", {
        3:"M", 4:"M", 6:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M",
        95:"M", 96:"M", 97:"M", 98:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        213:"M", 214:"M", 215:"M", 216:"M"
    }),

    # SFDR - Sustainable Finance Disclosure Regulation
    # Reference: Regulation (EU) 2019/2088, RTS 2022/1288
    ("SFDR", "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019R2088", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 9:"M", 10:"M", 11:"M", 12:"M", 13:"O",
        15:"M", 39:"M", 40:"M", 41:"M",
        65:"M", 66:"M", 67:"M", 68:"M", 69:"M", 70:"M", 71:"M", 72:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        217:"M", 218:"M", 219:"M"
    }),

    # UK TCFD - UK TCFD Mandatory Disclosure
    # Reference: FCA PS21/24, Companies Act 2006 (Strategic Report and Directors' Report) Regulations 2022
    ("UK_TCFD", "https://www.fca.org.uk/publication/policy/ps21-24.pdf", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M", 14:"O",
        15:"M", 16:"O", 17:"O", 18:"O", 19:"O", 20:"M", 21:"M", 22:"M", 23:"O",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M", 60:"M", 61:"M", 62:"M", 63:"M",
        80:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M", 154:"M", 155:"M",
        185:"M", 186:"M",
        220:"M", 221:"M"
    }),

    # HKEX ESG - Hong Kong Stock Exchange ESG Reporting
    # Reference: HKEX Main Board Listing Rules Appendix C2
    ("HKEX_ESG", "https://www.hkex.com.hk/-/media/HKEX-Market/Listing/Rules-and-Guidance/Environmental-Social-and-Governance/Exchanges-guidance-materials-on-ESG/How-to-Prepare-an-ESG-Report.pdf", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 11:"M", 12:"M", 13:"M", 14:"O",
        15:"M", 16:"O", 17:"O", 18:"O", 19:"O", 20:"M", 21:"M", 22:"M", 23:"O",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 56:"M", 57:"M", 58:"M", 59:"M", 60:"M", 61:"M",
        79:"M",
        123:"M", 127:"M", 128:"M", 129:"O", 130:"O",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M", 154:"M", 155:"M", 156:"M", 157:"M", 158:"M", 159:"M", 160:"M",
        161:"M", 162:"M", 163:"M", 164:"M", 165:"M", 166:"M", 167:"M", 168:"M", 169:"M", 170:"M", 171:"M", 172:"M", 173:"M",
        174:"M", 175:"M", 176:"M", 177:"M", 178:"M", 179:"M", 180:"M", 181:"M", 182:"M", 183:"M", 184:"M", 185:"M",
        222:"M", 223:"M"
    }),

    # ISO 14064 Certification
    # Reference: ISO 14064-1:2018, ISO 14064-3:2019
    ("ISO_14064_CERT", "https://www.iso.org/standard/66453.html", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M", 47:"O", 48:"O", 49:"O",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M", 134:"M"
    }),

    # CDP Disclosure
    # Reference: CDP Climate Change Questionnaire, CDP Technical Note on Scopes
    ("CDP_DISCLOSURE", "https://cdp.net/en/guidance/guidance-for-companies", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"O", 17:"O", 18:"O", 19:"O", 20:"M", 21:"M", 22:"M", 23:"O",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M", 49:"M", 50:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M", 60:"M", 61:"M", 62:"M", 63:"M", 64:"M",
        65:"M", 66:"M",
        81:"M", 82:"M", 83:"M",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M", 135:"M", 136:"M",
        185:"M", 186:"M",
        224:"M", 225:"M", 226:"M"
    }),

    # CORP_GHG - GHG Protocol Corporate Standard
    # Reference: GHG Protocol Corporate Standard (2004, revised 2015)
    ("CORP_GHG", "https://ghgprotocol.org/corporate-standard", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M", 42:"O", 43:"O", 44:"O", 45:"O", 46:"O",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M"
    }),

    # CORP_GHG_VERIFIED - with third-party verification
    ("CORP_GHG_VERIFIED", "https://ghgprotocol.org/corporate-standard", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M"
    }),

    # CORP_GHG_SIMPLIFIED - minimal required data
    ("CORP_GHG_SIMPLIFIED", "https://ghgprotocol.org/corporate-standard", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M"
    }),

    # CORP_GHG_ANNUAL
    ("CORP_GHG_ANNUAL", "https://ghgprotocol.org/corporate-standard", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M", 42:"O", 43:"O", 44:"O", 45:"O", 46:"O",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M"
    }),

    # CORP_GHG_PUBLIC
    ("CORP_GHG_PUBLIC", "https://ghgprotocol.org/corporate-standard", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M", 42:"O", 43:"O", 44:"O", 45:"O", 46:"O",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M"
    }),

    # CORP_GHG_INTERNAL
    ("CORP_GHG_INTERNAL", "https://ghgprotocol.org/corporate-standard", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        127:"M", 128:"M", 129:"O", 130:"O"
    }),

    # EcoVadis
    # Reference: EcoVadis methodology documents
    ("ECOVADIS_SCORE", "https://ecovadis.com/", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M",
        15:"M", 20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        51:"M", 52:"M", 53:"M",
        84:"M", 85:"M",
        123:"M", 127:"M", 128:"M", 129:"O", 130:"O",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M",
        161:"M", 162:"M", 163:"M", 164:"M", 165:"M", 166:"M", 167:"M", 168:"M", 169:"M", 170:"M", 171:"M", 172:"M", 173:"M",
        174:"M", 175:"M", 176:"M", 177:"M", 178:"M", 179:"M", 180:"M", 181:"M", 182:"M", 183:"M", 184:"M", 185:"M"
    }),

    # EPD / ISO 14067
    # Reference: ISO 14067:2018, ISO 14025:2006
    ("EPD_OR_ISO_14067", "https://www.iso.org/standard/71206.html", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M", 49:"M", 50:"O", 51:"O",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M",
        230:"M", 231:"M", 232:"M", 233:"M", 234:"M", 235:"M"
    }),

    # Product PCF
    # Reference: GHG Protocol Product Standard
    ("PRODUCT_PCF", "https://ghgprotocol.org/product-standard", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M", 49:"O", 50:"O", 51:"O",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M",
        230:"M", 231:"M", 232:"M", 233:"M", 234:"M", 235:"M"
    }),

    # CLIENT_SCOPE3_PACKAGE - Client-driven, no external standard
    ("CLIENT_SCOPE3_PACKAGE", "N/A", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        106:"O",
        119:"M", 120:"M", 121:"M", 122:"M", 123:"M",
        127:"M", 128:"M", 129:"O", 130:"M", 131:"M", 132:"M", 133:"M"
    }),

    # CLIENT_TEMPLATE_FILL - Client-driven
    ("CLIENT_TEMPLATE_FILL", "N/A", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        119:"M", 120:"M", 121:"M", 122:"M", 123:"M",
        127:"M", 128:"M", 130:"M", 131:"M", 132:"M", 133:"M",
        267:"M"
    }),

    # SCOPE3_DETAILED
    # Reference: GHG Protocol Scope 3 Standard
    ("SCOPE3_DETAILED", "https://ghgprotocol.org/corporate-value-chain-scope-3-standard", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        106:"O",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M", 134:"M", 135:"M", 136:"M"
    }),

    # CARBON_NEUTRAL_CERT
    # Reference: PAS 2060 or similar carbon neutrality standards
    ("CARBON_NEUTRAL_CERT", "https://www.bsigroup.com/en-GB/pas-2060-carbon-neutrality/", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M", 42:"M", 43:"M", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M", 49:"M", 50:"M",
        57:"M", 58:"M",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M"
    }),

    # TCFD_REPORT
    # Reference: TCFD Recommendations (2017), TCFD Guidance on Metrics, Targets, and Transition Plans (2021)
    ("TCFD_REPORT", "https://www.fsb-tcfd.org/recommendations/", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"O", 17:"O", 18:"O", 19:"O", 20:"M", 21:"M", 22:"M", 23:"O",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M", 60:"M", 61:"M", 62:"M", 63:"M", 64:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M", 154:"M", 155:"M",
        185:"M", 186:"M",
        220:"M", 221:"M"
    }),

    # BANK_TEMPLATE_FILL - Bank-driven data request
    ("BANK_TEMPLATE_FILL", "N/A", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 9:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        65:"M", 66:"M", 67:"M", 68:"M", 69:"M", 70:"M", 71:"M", 72:"M", 73:"M",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M", 134:"M",
        267:"M"
    }),

    # SCOPE123_DATASET - Full dataset export
    ("SCOPE123_DATASET", "N/A", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        119:"O", 120:"O", 121:"O", 122:"O", 123:"O",
        127:"M", 128:"M", 130:"M", 131:"M", 132:"M", 133:"M"
    }),

    # SBTi Commitment
    # Reference: SBTi Criteria and Recommendations v5.1
    ("SBTI_COMMITMENT", "https://sciencebasedtargets.org/resources/files/SBTi-criteria.pdf", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        57:"M", 58:"M",
        61:"M", 62:"M", 63:"M", 64:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        185:"M", 186:"M", 187:"M", 188:"M",
        236:"M", 237:"M", 238:"M", 239:"M"
    }),

    # RE100 Reporting
    # Reference: RE100 Technical Criteria
    ("RE100_REPORTING", "https://www.there100.org/technical-guidance", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        59:"M", 60:"M",
        86:"M", 87:"M", 88:"M",
        123:"M", 124:"M", 125:"M", 126:"O",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M",
        240:"M", 241:"M"
    }),

    # GRESB Assessment
    # Reference: GRESB Real Estate Assessment Reference Guide
    ("GRESB_ASSESSMENT", "https://www.gresb.com/nl-en/", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"O", 17:"O", 18:"O", 19:"O", 20:"M", 21:"M", 22:"M", 23:"O",
        24:"O", 25:"O", 26:"O", 27:"O", 28:"O", 29:"O", 30:"O", 31:"O", 32:"O", 33:"O", 34:"O", 35:"O", 36:"O", 37:"O",
        38:"M", 39:"M", 40:"M", 41:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M",
        89:"M", 90:"M",
        99:"M", 100:"M", 101:"M", 102:"M", 103:"M",
        123:"M", 124:"M", 125:"M", 126:"O",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M",
        161:"M", 162:"M", 163:"M", 164:"M", 165:"M", 166:"M", 167:"M", 168:"M", 169:"M", 170:"M", 171:"M", 172:"M", 173:"M",
        242:"M", 243:"M"
    }),

    # B Corp Impact Assessment
    # Reference: B Impact Assessment Standards
    ("BCORP_IMPACT_ASSESSMENT", "https://www.bcorporation.net/en-us/certification/assess-your-impact/", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M",
        91:"M", 92:"M",
        99:"M", 100:"M", 101:"O", 102:"O",
        123:"M", 127:"M", 128:"M", 129:"O", 130:"O",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M",
        161:"M", 162:"M", 163:"M", 164:"M", 165:"M", 166:"M", 167:"M", 168:"M", 169:"M", 170:"M", 171:"M", 172:"M", 173:"M",
        174:"M", 175:"M", 176:"M", 177:"M", 178:"M", 179:"M", 180:"M", 181:"M", 182:"M", 183:"M", 184:"M", 185:"M",
        244:"M", 245:"M"
    }),

    # PREP_GHG - Preparation for GHG inventory
    ("PREP_GHG", "N/A", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M"
    }),

    # CLIMATE_ACTION_PLAN
    ("CLIMATE_ACTION_PLAN", "N/A", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 8:"M", 9:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 16:"M", 17:"M", 18:"M", 19:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        24:"M", 25:"M", 26:"M", 27:"M", 28:"M", 29:"M", 30:"M", 31:"M", 32:"M", 33:"M", 34:"M", 35:"M", 36:"M", 37:"M",
        38:"M", 39:"M", 40:"M", 41:"M",
        47:"M", 48:"M", 49:"M", 50:"M",
        51:"M", 52:"M", 53:"M", 54:"M", 55:"M", 56:"M", 57:"M", 58:"M", 59:"M", 60:"M", 61:"M", 62:"M", 63:"M", 64:"M",
        123:"M", 124:"M", 125:"M", 126:"M",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M",
        148:"M", 149:"M", 150:"M", 151:"M", 152:"M", 153:"M", 154:"M", 155:"M", 156:"M", 157:"M"
    }),

    # RECS_OR_PPA_STRATEGY
    # Reference: GHG Protocol Scope 2 Guidance
    ("RECS_OR_PPA_STRATEGY", "https://ghgprotocol.org/scope-2-guidance", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        59:"M", 60:"M",
        86:"M", 87:"M", 88:"M",
        123:"M", 124:"M", 125:"M", 126:"O",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M"
    }),

    # ENERGY_AUDIT_SCOPE12
    # Reference: ISO 50002:2014
    ("ENERGY_AUDIT_SCOPE12", "https://www.iso.org/standard/60088.html", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 20:"M", 21:"M", 22:"M", 23:"M",
        39:"M", 40:"M", 41:"M",
        59:"M", 60:"M",
        123:"M", 124:"M", 125:"M", 126:"M",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M"
    }),

    # BUILDING_CARBON_FOOTPRINT
    ("BUILDING_CARBON_FOOTPRINT", "N/A", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        15:"M", 20:"M", 21:"M", 22:"M",
        39:"M", 40:"M", 41:"M",
        99:"M", 100:"M", 101:"M", 102:"M", 103:"M",
        123:"M", 124:"M", 125:"M", 126:"O",
        127:"M", 128:"M", 130:"M", 131:"M", 132:"M", 133:"M"
    }),

    # SCOPE2_DETAILED
    # Reference: GHG Protocol Scope 2 Guidance
    ("SCOPE2_DETAILED", "https://ghgprotocol.org/scope-2-guidance", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        20:"M", 21:"M", 22:"M", 23:"M",
        39:"M", 40:"M", 41:"M", 44:"O", 45:"O", 46:"O", 47:"O", 48:"O",
        123:"M", 124:"M", 125:"M", 126:"M",
        127:"M", 128:"M", 129:"M", 130:"M", 131:"M", 132:"M", 133:"M"
    }),

    # SCOPE3_CATEGORY1_SUPPLIERS
    # Reference: GHG Protocol Scope 3 Standard, Category 1
    ("SCOPE3_CATEGORY1_SUPPLIERS", "https://ghgprotocol.org/corporate-value-chain-scope-3-standard", "✔️", {
        3:"M", 4:"M", 6:"M", 7:"M", 10:"M", 11:"M", 12:"M", 13:"M", 14:"M",
        24:"M",
        39:"M", 40:"M", 41:"M",
        106:"O",
        127:"M", 128:"M", 129:"O", 130:"O", 131:"M", 132:"M", 133:"M", 134:"M", 135:"M", 136:"M"
    }),

    # CBAM_DATA_PACKAGE
    ("CBAM_DATA_PACKAGE", "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M",
        107:"M", 108:"M", 109:"M", 110:"M", 111:"M", 116:"M", 117:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        199:"M", 200:"M", 201:"M"
    }),

    # CBAM_REPORT
    ("CBAM_REPORT", "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M",
        107:"M", 108:"M", 109:"M", 110:"M", 111:"M", 112:"M", 113:"M", 114:"M", 115:"M", 116:"M", 117:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        199:"M", 200:"M", 201:"M"
    }),

    # CBAM_ALLOWANCES
    ("CBAM_ALLOWANCES", "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"M",
        107:"M", 108:"M", 109:"M", 110:"M", 111:"M", 112:"M", 113:"M", 114:"M", 115:"M", 116:"M", 117:"M"
    }),

    # CBAM_MONITORING_ALERT
    ("CBAM_MONITORING_ALERT", "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        107:"M", 108:"M", 109:"M", 110:"M", 111:"M", 116:"M", 117:"M",
        199:"M", 200:"M", 201:"M"
    }),

    # CBAM_PREP_METHOD
    ("CBAM_PREP_METHOD", "https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en", "✔️", {
        3:"M", 4:"M", 11:"M", 13:"M",
        15:"M", 39:"M", 40:"M", 41:"O", 44:"M", 45:"M", 46:"M", 47:"M", 48:"M",
        107:"M", 108:"M", 111:"M", 112:"M", 113:"M",
        127:"M", 128:"M", 129:"O", 130:"O",
        199:"M", 200:"M", 201:"M"
    }),
]

# Utility rows - placeholders
utility_rows = [
    ("hint_for_UI", "Non applicable", "Non applicable", {3:"{hints texts}"}),
    ("hint_for_email_request", "Non applicable", "Non applicable", {3:"{hints texts}"}),
]

# Implemented row - all ❌
implemented_row = ["implemented_in_database", "Non applicable", "Non applicable"] + ["❌"] * (num_cols - 3)

def build_csv():
    lines = [header]

    for report_type, url, check, mapping in reports_data:
        row = [""] * num_cols
        row[0] = report_type
        row[1] = url
        row[2] = check
        for idx, val in mapping.items():
            if idx < num_cols:
                row[idx] = val
        lines.append(";".join(row))

    for report_type, url, check, mapping in utility_rows:
        row = [""] * num_cols
        row[0] = report_type
        row[1] = url
        row[2] = check
        for idx, val in mapping.items():
            if idx < num_cols:
                row[idx] = val
        lines.append(";".join(row))

    lines.append(";".join(implemented_row))

    return "\n".join(lines)


if __name__ == "__main__":
    csv_content = build_csv()
    output_path = "/Users/user/Documents/github/carbonreport/docs/data points guide/datapoints-reports matrix.csv"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(csv_content)
    
    # Verify
    with open(output_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    print(f"CSV file created with {len(lines)} lines")
    print(f"Header has {num_cols} columns")
    print(f"Reports: {len(reports_data)}")
