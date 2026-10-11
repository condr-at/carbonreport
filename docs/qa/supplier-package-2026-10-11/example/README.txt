CBAM Supplier Review Package v1
A preparation package for recipient review. This is not a CBAM declaration, a statutory operator emissions report, or verification of emissions.

STATUS AND SCOPE
Ready for recipient review under application profile cbam-supplier-review/1.0.
Coverage: partial. Partial-year data remains provisional.
One product, one producing installation, one production year.
This status is not confirmation of statutory completeness or recipient acceptance.

CONTENTS
summary.html — standalone summary, print-friendly; open locally in a browser.
data.json — UTF-8 JSON, schemaVersion cbam-supplier-review-package/1.0; whitelisted field values, metadata, evidence references, review issues and separate calculation results.
Inactive conditional draft fields are omitted; active blank fields remain blank.
Scalar text values are preserved. Structured evidence and default-value JSON is normalized to permitted properties; inactive default components and unrelated draft properties are omitted. Saved drafts are unchanged.
values.csv — UTF-8, quoted CSV, CRLF rows; field_id, label, raw_value, unit, hint.
evidence.csv — UTF-8, quoted CSV, CRLF rows; id, title, reference, version, period, owner, disclosure.
README.txt — this scope and handling note.
Evidence consists of references only. No referenced file or attachment is included or downloaded.
CSV cells that could execute as spreadsheet formulas have an apostrophe prefix; the corresponding values without this CSV safety prefix remain in data.json. CSV cells are quoted, including embedded quotes and newlines.

CALCULATION RULES
Only the confirmed reported unit tCO2e/t_goods is supported. No conversion is performed.
Optional lot net mass (t goods) × the corresponding reported specific embedded emissions (tCO2e/t goods) gives an indicative component result (tCO2e).
Direct and indirect results remain separate; no combined total is produced.
No precursor amounts are added automatically. The preparer must explain the contribution already included in the reported figures.
Blank or unknown values are not zero. Declared not applicable is distinct from unknown and needs goods-specific review.
Default or mixed data needs traceable provenance; the application does not select a default or assess markup treatment.

HUMAN REVIEW
Confirm recipient requirements, goods and CN classification, legal applicability, process boundary, attribution, production period and coverage.
Check the direct and indirect data bases separately and obtain the referenced evidence with appropriate disclosure permission.
Review declared non-applicability, default provenance, precursor treatment and verification evidence. The application does not verify emissions or check verifier accreditation.
This package is not a CBAM Registry import, a declaration, the statutory operator emissions report or an official Commission template. It does not calculate certificate requirements, carbon-price deductions or financial liability.

OFFICIAL SOURCES
European Commission — CBAM legislation and guidance
https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en

European Commission — Guidance No. 2: quick guide for non-EU operators (14 August 2026)
https://taxation-customs.ec.europa.eu/document/download/91e1056c-4524-4705-aaa7-e25c1439a87a_en?filename=Guidance%20No.%202%20-%20Quick%20guide%20for%20non-EU%20operators%20on%20CBAM%20implementation.pdf

European Commission — Guidance No. 3: methods for embedded emissions (14 August 2026)
https://taxation-customs.ec.europa.eu/document/download/29b9eec7-1a4b-4eb6-ab85-96a0c9e35fd0_en?filename=Guidance%20No.%203%20-%20CBAM%20methods%20for%20the%20calculation%20of%20emissions%20embedded%20in%20goods.pdf
Source links identify the guidance used for this preparation profile. Confirm current legislation and relevant-period source versions; links and guidance do not certify this package.

SNAPSHOT
Generated: 2026-10-11T08:46:04.782Z
Project ID: 3ca3f18e-81bf-467b-97d4-8b193b0ae68b
Report ID: 3e5a85b6-a6ed-4693-abfd-6d9bced78921
Template: CBAM_DATA_PACKAGE
Dataset version: 8
Profile: cbam-supplier-review/1.0
