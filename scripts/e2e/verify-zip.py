"""Independent oracle for the actual browser download; imports no app renderer."""
import csv
import hashlib
import html
import io
import json
import sys
import zipfile
from pathlib import Path

archive, expectation = map(Path, sys.argv[1:3])
expected = json.loads(expectation.read_text())
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None, "ZIP CRC failure"
    assert len(z.namelist()) == 5
    assert set(z.namelist()) == {"summary.html", "data.json", "values.csv", "evidence.csv", "README.txt"}
    data = json.loads(z.read("data.json"))
    assert data["schemaVersion"] == "cbam-supplier-review-package/1.0"
    for field in ["projectId", "reportId", "datasetVersion"]:
        assert data["metadata"][field] == expected[field], field
    assert data["metadata"]["profileVersion"] == "cbam-supplier-review/1.0"
    assert data["review"]["status"] == "ready_for_recipient_review"
    assert data["review"]["coverage"] == "partial"
    assert data["evidenceFilesIncluded"] is False
    values = {row["fieldId"]: row["rawValue"] for row in data["values"]}
    for key, value in expected["values"].items():
        assert values[key] == value, f"Wrong saved value: {key}"
    for field in ["cbam_pkg_default_context", "cbam_pkg_verifier", "cbam_pkg_verification_source", "cbam_pkg_indirect_rationale", "cbam_pkg_supplier_name"]:
        assert field not in values, f"Inactive field exported: {field}"
    assert data["calculations"]["massTonnes"] == 12
    assert data["calculations"]["directLotEmissions"] == 30
    assert data["calculations"]["indirectLotEmissions"] == 6
    assert "total" not in data["calculations"]
    assert data["evidence"] == json.loads(expected["values"]["cbam_pkg_evidence_json"])
    assert {"PARTIAL_YEAR", "CN_REVIEW", "UNVERIFIED_DATA", "REVIEW_ONLY"} <= {row["ruleId"] for row in data["issues"]}
    assert not any(row["severity"] == "error" for row in data["issues"])
    csv_values = list(csv.DictReader(io.StringIO(z.read("values.csv").decode())))
    assert {row["field_id"]: row["raw_value"] for row in csv_values} == values
    csv_evidence = list(csv.DictReader(io.StringIO(z.read("evidence.csv").decode())))
    assert csv_evidence == data["evidence"]
    summary = z.read("summary.html").decode()
    assert expected["values"]["product_name"] in html.unescape(summary)
    assert "30 tCO2e" in summary and "6 tCO2e" in summary
    assert "<script" not in summary.lower()
    for name in z.namelist():
        assert "OUTSIDER_WRITE_MUST_FAIL" not in z.read(name).decode(), name

print(json.dumps({"result": "pass", "datasetVersion": expected["datasetVersion"],
                  "directLotEmissions": 30, "indirectLotEmissions": 6,
                  "zipSha256": hashlib.sha256(archive.read_bytes()).hexdigest()}))
