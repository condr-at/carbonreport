"""Independent checks of the synthetic browser-downloaded review ZIP.

Run: python3 docs/qa/supplier-package-2026-10-11/verify-artifact.py
This is an engineering fixture, not a regulatory or client-approved example.
"""
import csv
import hashlib
import io
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent
archive = ROOT / "downloaded-package.zip"
saved = json.loads((ROOT / "input-dataset.json").read_text())
inputs = {p["field_id"]: p["value"] for p in saved["dataset"]["data_points"]}

with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None, "ZIP CRC failed"
    assert set(z.namelist()) == {"summary.html", "data.json", "values.csv", "evidence.csv", "README.txt"}
    data = json.loads(z.read("data.json"))
    values = {p["fieldId"]: p["rawValue"] for p in data["values"]}
    assert data["metadata"]["datasetVersion"] == saved["datasetVersion"] == 8
    assert data["metadata"]["projectId"] == saved["id"]
    assert data["metadata"]["profileVersion"] == "cbam-supplier-review/1.0"
    assert data["review"]["status"] == "ready_for_recipient_review"
    assert data["review"]["coverage"] == "partial"
    assert data["evidenceFilesIncluded"] is False
    for key, expected in {
        "cbam_pkg_recipient": "Example EU customer reviewer",
        "cbam_pkg_prepared_by": "Alex QA Preparer — revision 2",
        "product_name": "Example steel goods", "cbam_pkg_cn8": "72081000",
        "cbam_pkg_coverage_start": "2026-01-01", "cbam_pkg_coverage_end": "2026-09-30",
        "cbam_pkg_direct_see": "2.5", "cbam_pkg_indirect_see": "0.5",
        "cbam_pkg_lot_mass_tonnes": "12", "cbam_pkg_direct_basis": "actual",
    }.items():
        assert values[key] == inputs[key] == expected, key
    assert data["calculations"]["massTonnes"] == 12
    assert data["calculations"]["directLotEmissions"] == 30
    assert data["calculations"]["indirectLotEmissions"] == 6
    assert "total" not in data["calculations"]
    assert len(values) == 29
    assert set(values) <= set(inputs)
    assert "cbam_pkg_default_context" not in values
    assert "INACTIVE_DEFAULT_A" in inputs["cbam_pkg_default_context"]
    assert "INACTIVE_DEFAULT_B" in inputs["cbam_pkg_default_context"]
    evidence = data["evidence"]
    assert len(evidence) == 1 and evidence[0]["id"] == "operator-1"
    assert json.loads(values["cbam_pkg_evidence_json"]) == evidence
    rules = {i["ruleId"] for i in data["issues"]}
    assert {"PARTIAL_YEAR", "CN_REVIEW", "UNVERIFIED_DATA", "REVIEW_ONLY"} <= rules
    assert not any(i["severity"] == "error" for i in data["issues"])
    csv_values = list(csv.reader(io.StringIO(z.read("values.csv").decode("utf-8"))))
    csv_evidence = list(csv.reader(io.StringIO(z.read("evidence.csv").decode("utf-8"))))
    assert len(csv_values) == 30 and len(csv_evidence) == 2
    assert all(any(key in row and val in row for row in csv_values[1:]) for key, val in values.items())
    html = z.read("summary.html").decode("utf-8")
    assert "Example steel goods" in html and "30 tCO2e" in html and "6 tCO2e" in html
    assert "JSON array of" not in html and "<script" not in html.lower()
    for name in z.namelist():
        text = z.read(name).decode("utf-8")
        assert "INACTIVE_DEFAULT" not in text and "INACTIVE_TEST_VERSION" not in text, name
        assert "Unsaved conflict draft" not in text, name

print(json.dumps({
    "result": "pass", "datasetVersion": 8, "activeFields": 29,
    "directLotEmissions": 30, "indirectLotEmissions": 6,
    "zipSha256": hashlib.sha256(archive.read_bytes()).hexdigest(),
    "checked": ["CRC and fixed entries", "saved version and exact inputs", "separate arithmetic",
                "CSV/JSON consistency", "evidence references", "review warnings",
                "inactive draft exclusion", "conflict draft exclusion", "readable HTML"],
}, indent=2))
