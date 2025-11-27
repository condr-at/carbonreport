#!/usr/bin/env python3
"""
Comprehensive validator for datapoints-reports matrix.csv
Run: python3 scripts/validate-matrix.py
"""

import csv
import sys
from collections import defaultdict

MATRIX_PATH = "docs/data points guide/datapoints-reports matrix.csv"

def load_matrix():
    with open(MATRIX_PATH, "r", encoding="utf-8") as f:
        reader = csv.reader(f, delimiter=';')
        return list(reader)

def validate_structure(rows, header):
    """Check structural integrity"""
    print("=" * 70)
    print("1. СТРУКТУРНАЯ ВАЛИДАЦИЯ")
    print("=" * 70)
    
    errors = []
    num_cols = len(header)
    print(f"   Колонок в header: {num_cols}")
    
    for i, row in enumerate(rows):
        if len(row) != num_cols:
            errors.append(f"Row {i+1} ({row[0]}): {len(row)} cols (expected {num_cols})")
    
    if errors:
        print(f"❌ ОШИБКИ количества колонок ({len(errors)}):")
        for e in errors[:10]:
            print(f"   {e}")
        return False
    else:
        print("✅ Все строки имеют одинаковое количество колонок")
        return True

def validate_values(rows, header):
    """Check all data values are M, O, or empty"""
    print("\n" + "=" * 70)
    print("2. ВАЛИДАЦИЯ ЗНАЧЕНИЙ (только M, O или пусто)")
    print("=" * 70)
    
    invalid_values = []
    data_rows = rows[1:-3]  # Exclude header and utility rows
    
    for row in data_rows:
        report = row[0]
        for j, val in enumerate(row[3:], start=3):
            if val not in ["M", "O", ""]:
                invalid_values.append(f"{report}[col {j} = {header[j]}]: '{val}'")
    
    if invalid_values:
        print(f"❌ Найдено {len(invalid_values)} невалидных значений:")
        for v in invalid_values[:20]:
            print(f"   {v}")
        return False
    else:
        print("✅ Все значения в data points колонках валидны (M/O/пусто)")
        return True

def validate_urls(rows):
    """Check reference URLs"""
    print("\n" + "=" * 70)
    print("3. ПРОВЕРКА REFERENCE URLs")
    print("=" * 70)
    
    data_rows = rows[1:-3]
    issues = []
    
    for row in data_rows:
        report = row[0]
        url = row[1]
        check = row[2]
        
        if not url or url == "":
            issues.append(f"⚠️  {report}: пустой URL")
        elif url == "N/A":
            print(f"ℹ️  {report}: N/A (внутренний шаблон)")
        elif not url.startswith("http"):
            issues.append(f"❌ {report}: невалидный URL: {url}")
        
        if check not in ["✔️", "❌"]:
            issues.append(f"⚠️  {report}: странный check mark: '{check}'")
    
    for issue in issues:
        print(f"   {issue}")
    
    return len([i for i in issues if i.startswith("❌")]) == 0

def get_statistics(rows, header):
    """Get M/O/empty statistics per report"""
    print("\n" + "=" * 70)
    print("4. СТАТИСТИКА ПО ОТЧЁТАМ (M/O/empty)")
    print("=" * 70)
    
    data_rows = rows[1:-3]
    stats = []
    
    for row in data_rows:
        report = row[0]
        m_count = sum(1 for v in row[3:] if v == "M")
        o_count = sum(1 for v in row[3:] if v == "O")
        empty_count = sum(1 for v in row[3:] if v == "")
        total_filled = m_count + o_count
        stats.append((report, m_count, o_count, empty_count, total_filled))
    
    stats.sort(key=lambda x: x[4], reverse=True)
    
    print(f"{'Report':<35} {'M':>5} {'O':>5} {'Empty':>6} {'Total':>6}")
    print("-" * 60)
    for report, m, o, e, t in stats:
        print(f"{report:<35} {m:>5} {o:>5} {e:>6} {t:>6}")
    
    return stats

def check_unused_columns(rows, header):
    """Find columns never used"""
    print("\n" + "=" * 70)
    print("5. DATA POINTS НИКОГДА НЕ ИСПОЛЬЗУЕМЫЕ")
    print("=" * 70)
    
    data_rows = rows[1:-3]
    unused_cols = []
    
    for col_idx in range(3, len(header)):
        col_name = header[col_idx]
        has_value = any(row[col_idx] in ["M", "O"] for row in data_rows)
        if not has_value:
            unused_cols.append((col_idx, col_name))
    
    if unused_cols:
        print(f"⚠️  Найдено {len(unused_cols)} неиспользуемых data points:")
        for idx, name in unused_cols:
            print(f"   col {idx}: {name}")
    else:
        print("✅ Все data points используются хотя бы в одном отчёте")
    
    return unused_cols

def semantic_validation(rows, header):
    """Check semantic correctness of mappings"""
    print("\n" + "=" * 70)
    print("6. СЕМАНТИЧЕСКАЯ ВАЛИДАЦИЯ")
    print("=" * 70)
    
    data_rows = rows[1:-3]
    issues = []
    
    # Build column index lookup
    col_idx = {name: i for i, name in enumerate(header)}
    
    # Helper to get row by report name
    def get_row(report_name):
        return next((r for r in data_rows if r[0] == report_name), None)
    
    # 6.1 Core GHG fields should be M for GHG-focused reports
    print("\n6.1 Core GHG fields для GHG-отчётов:")
    core_ghg_fields = [
        "scope1_total_co2e",
        "scope2_total_location_based_co2e", 
        "scope2_total_market_based_co2e",
        "total_corporate_ghg_co2e",
        "base_year",
        "base_year_emissions_co2e"
    ]
    
    ghg_reports = ["CORP_GHG", "CORP_GHG_VERIFIED", "ISO_14064_CERT", "CSRD", "CDP_DISCLOSURE", "TCFD_REPORT"]
    
    for report_name in ghg_reports:
        row = get_row(report_name)
        if row:
            missing = []
            for field in core_ghg_fields:
                if field in col_idx:
                    val = row[col_idx[field]]
                    if val != "M":
                        missing.append(f"{field}={val or 'empty'}")
            if missing:
                print(f"   ⚠️  {report_name}: отсутствует M для: {', '.join(missing)}")
                issues.append(f"{report_name} missing core GHG: {missing}")
            else:
                print(f"   ✅ {report_name}: все core GHG fields = M")
    
    # 6.2 CBAM fields for CBAM reports
    print("\n6.2 CBAM-specific fields для CBAM-отчётов:")
    cbam_fields = [
        "cbam_importer_eori",
        "cbam_goods_cn_codes",
        "cbam_reporting_quarter",
        "cbam_total_embedded_emissions_co2e",
        "cbam_monitoring_methodology_description"
    ]
    
    cbam_reports = ["CBAM", "CBAM_REPORT", "CBAM_DATA_PACKAGE"]
    
    for report_name in cbam_reports:
        row = get_row(report_name)
        if row:
            filled = 0
            missing = []
            for field in cbam_fields:
                if field in col_idx:
                    val = row[col_idx[field]]
                    if val in ["M", "O"]:
                        filled += 1
                    else:
                        missing.append(field)
            if filled == len(cbam_fields):
                print(f"   ✅ {report_name}: все CBAM fields заполнены")
            else:
                print(f"   ❌ {report_name}: {filled}/{len(cbam_fields)} CBAM fields, отсутствует: {missing[:3]}...")
                issues.append(f"{report_name} missing CBAM fields")
    
    # 6.3 EU ETS fields for EU_ETS report
    print("\n6.3 EU ETS-specific fields для EU_ETS:")
    eu_ets_fields = [
        "eu_ets_compliance_year",
        "eu_ets_installations_list",
        "eu_ets_verified_emissions_co2e",
        "eu_ets_allowances_surrendered_quantity"
    ]
    
    row = get_row("EU_ETS")
    if row:
        filled = []
        missing = []
        for field in eu_ets_fields:
            if field in col_idx:
                val = row[col_idx[field]]
                if val in ["M", "O"]:
                    filled.append(field)
                else:
                    missing.append(field)
        if missing:
            print(f"   ❌ EU_ETS: отсутствует: {missing}")
            issues.append(f"EU_ETS missing fields: {missing}")
        else:
            print(f"   ✅ EU_ETS: все EU ETS fields заполнены")
    
    # 6.4 UK SECR specific fields
    print("\n6.4 UK SECR-specific fields:")
    uk_secr_fields = [
        "uk_secr_company_size_category",
        "uk_secr_energy_intensity_ratio",
        "uk_secr_quantification_methodology"
    ]
    
    row = get_row("UK_SECR")
    if row:
        filled = []
        missing = []
        for field in uk_secr_fields:
            if field in col_idx:
                val = row[col_idx[field]]
                if val in ["M", "O"]:
                    filled.append(field)
                else:
                    missing.append(field)
        if missing:
            print(f"   ⚠️  UK_SECR: отсутствует: {missing}")
            issues.append(f"UK_SECR missing fields: {missing}")
        else:
            print(f"   ✅ UK_SECR: все UK SECR fields заполнены")
    
    # 6.5 SFDR fields for SFDR report
    print("\n6.5 SFDR-specific fields:")
    sfdr_fields = [
        "sfdr_pai_indicators_summary",
        "sfdr_article_classification",
        "sfdr_do_no_significant_harm_assessment"
    ]
    
    row = get_row("SFDR")
    if row:
        filled = []
        missing = []
        for field in sfdr_fields:
            if field in col_idx:
                val = row[col_idx[field]]
                if val in ["M", "O"]:
                    filled.append(field)
                else:
                    missing.append(field)
        if missing:
            print(f"   ⚠️  SFDR: отсутствует: {missing}")
            issues.append(f"SFDR missing fields: {missing}")
        else:
            print(f"   ✅ SFDR: все SFDR fields заполнены")
    
    # 6.6 Product-specific fields for EPD/PCF
    print("\n6.6 Product-specific fields для EPD/Product reports:")
    product_fields = [
        "product_functional_unit_definition",
        "product_system_boundary_description",
        "product_life_cycle_stages_included"
    ]
    
    product_reports = ["EPD_OR_ISO_14067", "PRODUCT_PCF"]
    
    for report_name in product_reports:
        row = get_row(report_name)
        if row:
            filled = []
            missing = []
            for field in product_fields:
                if field in col_idx:
                    val = row[col_idx[field]]
                    if val in ["M", "O"]:
                        filled.append(field)
                    else:
                        missing.append(field)
            if missing:
                print(f"   ⚠️  {report_name}: отсутствует: {missing}")
                issues.append(f"{report_name} missing product fields")
            else:
                print(f"   ✅ {report_name}: все product fields заполнены")
    
    # 6.7 SBTi fields for SBTI_COMMITMENT
    print("\n6.7 SBTi-specific fields:")
    sbti_fields = [
        "sbti_commitment_status",
        "sbti_scope_coverage",
        "sbti_target_type",
        "sbti_base_year_for_targets"
    ]
    
    row = get_row("SBTI_COMMITMENT")
    if row:
        filled = []
        missing = []
        for field in sbti_fields:
            if field in col_idx:
                val = row[col_idx[field]]
                if val in ["M", "O"]:
                    filled.append(field)
                else:
                    missing.append(field)
        if missing:
            print(f"   ⚠️  SBTI_COMMITMENT: отсутствует: {missing}")
            issues.append(f"SBTI_COMMITMENT missing fields: {missing}")
        else:
            print(f"   ✅ SBTI_COMMITMENT: все SBTi fields заполнены")
    
    return issues

def check_regulatory_consistency(rows, header):
    """Check that regulatory reports have appropriate fields marked"""
    print("\n" + "=" * 70)
    print("7. ПРОВЕРКА РЕГУЛЯТОРНОЙ КОНСИСТЕНТНОСТИ")
    print("=" * 70)
    
    data_rows = rows[1:-3]
    col_idx = {name: i for i, name in enumerate(header)}
    
    def get_row(report_name):
        return next((r for r in data_rows if r[0] == report_name), None)
    
    # Reports that MUST have verification fields
    print("\n7.1 Отчёты с обязательной верификацией:")
    verification_fields = ["verification_required", "verification_standard", "verifier_organization_name"]
    verified_reports = ["CORP_GHG_VERIFIED", "ISO_14064_CERT", "EU_ETS", "CORSIA"]
    
    for report_name in verified_reports:
        row = get_row(report_name)
        if row:
            has_verification = any(
                row[col_idx[f]] == "M" 
                for f in verification_fields 
                if f in col_idx
            )
            if has_verification:
                print(f"   ✅ {report_name}: имеет verification fields = M")
            else:
                print(f"   ❌ {report_name}: ДОЛЖЕН иметь verification fields = M")
    
    # Reports with Scope 3 requirements
    print("\n7.2 Отчёты с требованием Scope 3:")
    scope3_reports = ["CSRD", "CDP_DISCLOSURE", "TCFD_REPORT", "SCOPE3_DETAILED", "SBTI_COMMITMENT"]
    
    for report_name in scope3_reports:
        row = get_row(report_name)
        if row:
            scope3_cols = [i for i, name in enumerate(header) if name.startswith("scope3_category")]
            scope3_filled = sum(1 for i in scope3_cols if row[i] in ["M", "O"])
            print(f"   {report_name}: {scope3_filled}/{len(scope3_cols)} Scope 3 categories filled")

def main():
    print("\n" + "=" * 70)
    print("КОМПЛЕКСНАЯ ВАЛИДАЦИЯ МАТРИЦЫ DATA POINTS")
    print("=" * 70 + "\n")
    
    rows = load_matrix()
    header = rows[0]
    
    all_passed = True
    
    all_passed &= validate_structure(rows, header)
    all_passed &= validate_values(rows, header)
    all_passed &= validate_urls(rows)
    
    stats = get_statistics(rows, header)
    unused = check_unused_columns(rows, header)
    
    semantic_issues = semantic_validation(rows, header)
    check_regulatory_consistency(rows, header)
    
    # Summary
    print("\n" + "=" * 70)
    print("ИТОГОВЫЙ ОТЧЁТ")
    print("=" * 70)
    
    data_rows = rows[1:-3]
    total_reports = len(data_rows)
    total_m = sum(s[1] for s in stats)
    total_o = sum(s[2] for s in stats)
    total_cells = total_reports * (len(header) - 3)
    fill_rate = (total_m + total_o) / total_cells * 100
    
    print(f"   Всего отчётов: {total_reports}")
    print(f"   Всего data points: {len(header) - 3}")
    print(f"   Всего M значений: {total_m}")
    print(f"   Всего O значений: {total_o}")
    print(f"   Заполненность: {fill_rate:.1f}%")
    print(f"   Неиспользуемых колонок: {len(unused)}")
    print(f"   Семантических проблем: {len(semantic_issues)}")
    
    if semantic_issues:
        print("\n   ⚠️  ТРЕБУЕТ ВНИМАНИЯ:")
        for issue in semantic_issues:
            print(f"      - {issue}")
    
    if all_passed and not semantic_issues:
        print("\n   ✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ")
        return 0
    else:
        print("\n   ⚠️  ЕСТЬ ПРОБЛЕМЫ, ТРЕБУЮЩИЕ ВНИМАНИЯ")
        return 1

if __name__ == "__main__":
    sys.exit(main())
