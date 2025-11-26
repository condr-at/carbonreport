### datapoints-reports matrix.csv

This file is the **source of truth** for how each data point (`fieldId`) is
used across report types and products.

One **column** = one `fieldId` from `data points expansion plan.md`.

**Row semantics**:

- `data_point`: exact `fieldId` string.
- `implemented`: `yes` if this field is present in `DATASET_FIELD_SEED`,
    otherwise `no`.
- `primary_report_class`: coarse usage class for this field:
    `REGULATORY`, `FINANCIAL`, `CLIENT`, `SECTORAL`, `INTERNAL`, `METADATA`.
- One row per report / product id (e.g. `CSRD`, `EU_ETS`, `CBAM`,
    `UK_SECR`, `SEC_CLIMATE`, `CORSIA`, `SFDR`, `CDP_DISCLOSURE`, etc.).
    For these rows each cell is:
    - `M` — mandatory / core for this report type.
    - `O` — optional / nice-to-have / sometimes required.
    - blank — generally not used for this report.
- `regulatory_requirements_checked`: status indicating if the requirements have been checked against regulations.
- `__reference_urls__`: service row with links to official sources for
    selected report ids (CSRD, SEC, TCFD, CBAM, EU ETS, SBTi, ...).

**Division of responsibilities**:

- List of fields, their meaning and grouping →
    `data points expansion plan.md` (source of truth for semantics).
- Implementation status and usage classes (`implemented`, `primary_report_class`)
    → this matrix.
- Mapping "fieldId × report id → M/O/blank" → this matrix.

**Workflow**

When adding or changing fields:

1. Add / update the field in `data points expansion plan.md`.
2. Add / rename the corresponding column in `datapoints-reports matrix.csv`.
3. Set `implemented` once the field is wired into `DATASET_FIELD_SEED`.
4. Adjust `M/O/blank` cells in report rows where this field is relevant.

Decision logic and UI should treat this matrix as the authoritative map of
which fields are required or optional for each report type.