### README (inline, do not remove)
datapoints-reports matrix.csv
One column = one `fieldId` from `data points expansion plan.md`.
Rows:
- data_point: exact `fieldId` (source of truth: the plan).
- implemented: `yes` if present in `DATASET_FIELD_SEED`, otherwise `no`.
- primary_report_class: coarse class of usage (REGULATORY/FINANCIAL/CLIENT/SECTORAL/INTERNAL/METADATA).
- CSRD, SEC_CLIMATE, TCFD_REPORT, CBAM, EU_ETS, CLIENT_SCOPE3_PACKAGE:
    - `M` = mandatory / core for this report type.
    - `O` = optional / nice-to-have / sometimes required.
    - blank = generally not used.
This file is derived from the plan and decision engine; when adding new fields,
first update `data points expansion plan.md`, then sync this matrix.