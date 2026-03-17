---
title: "RenalDose"
description: "Renal dose adjustment guidance with CrCl calculation, CKD staging, and FDA dosing recommendations."
weight: 10
tags: [lumen-ui, renal-dose, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

RenalDose renders renal dose adjustment guidance for a specific drug based on estimated creatinine clearance and CKD staging. The hero section displays the drug name, calculated CrCl value, and CKD stage badge (color-coded by severity). It includes patient parameters, FDA dosing guidance in a collapsible section, and the calculation formula in a code block.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `drug` | `string` | *required* | Drug name. Displayed uppercase in the hero section. |
| `crcl_ml_min` | `number` | — | Calculated creatinine clearance in mL/min. Displayed as a large heading. |
| `ckd_stage` | `string` | — | CKD stage (e.g., `"G1"`, `"G2"`, `"G3a"`, `"G3b"`, `"G4"`, `"G5"`). Displayed as a color-coded badge. |
| `patient` | `object` | `{}` | Patient parameters used in the calculation (e.g., `{weight, age, sex, scr}`). |
| `dosing_guidance` | `string` | — | FDA-recommended dosing adjustments by renal function. Rendered in a collapsible section. |
| `formula` | `string` | — | Calculation formula used (e.g., Cockcroft-Gault). Rendered in a monospace code block. |

**CKD stage color mapping:**

| Stage | Color |
|-------|-------|
| G5, G4 | Destructive red |
| G3, G3a, G3b | Orange (`#ED8936`) |
| G2 | Warning amber |
| G1 / other | Success green |

## DSL Example

```
RenalDose(
  drug="Vancomycin",
  crcl_ml_min=35.2,
  ckd_stage="G3b",
  patient={age:74, sex:"Male", weight:"72 kg", serum_creatinine:"1.8 mg/dL"},
  dosing_guidance="CrCl 30-49 mL/min: 750mg IV q24h\nCrCl 10-29 mL/min: 500mg IV q24-48h\nCrCl <10 mL/min: 500mg IV, re-dose based on trough levels\n\nTarget trough: 15-20 mcg/mL for serious infections",
  formula="CrCl = [(140 - age) x weight] / (72 x SCr) = [(140 - 74) x 72] / (72 x 1.8) = 36.7 mL/min"
)
```

## JSON Example

```json
{
  "type": "renal_dose",
  "props": {
    "drug": "Vancomycin",
    "crcl_ml_min": 35.2,
    "ckd_stage": "G3b",
    "patient": {
      "age": 74,
      "sex": "Male",
      "weight": "72 kg",
      "serum_creatinine": "1.8 mg/dL"
    },
    "dosing_guidance": "CrCl 30-49 mL/min: 750mg IV q24h\nCrCl 10-29 mL/min: 500mg IV q24-48h\nCrCl <10 mL/min: 500mg IV, re-dose based on trough levels",
    "formula": "CrCl = [(140 - age) x weight] / (72 x SCr)"
  }
}
```

## Composition

Renal dose adjustment in a nephrology consult workflow:

```
Stack(direction="vertical", gap=16,
  FhirPatient(
    patient={name:"Margaret Wilson", dob:"1952-08-19", gender:"female"},
    conditions=["CKD Stage 4", "Type 2 Diabetes", "UTI"],
    medications=["Insulin glargine 20 units daily", "Levofloxacin 750mg daily"]
  ),
  RenalDose(
    drug="Levofloxacin",
    crcl_ml_min=22,
    ckd_stage="G4",
    patient={age:73, sex:"Female", weight:"65 kg", serum_creatinine:"2.4 mg/dL"},
    dosing_guidance="CrCl 20-49 mL/min: 750mg q48h or 500mg q24h\nCrCl 10-19 mL/min: 500mg q48h\nHemodialysis: 500mg q48h, no supplemental dose needed",
    formula="CrCl = [(140 - 73) x 65 x 0.85] / (72 x 2.4) = 21.5 mL/min"
  ),
  Calculator(
    name="CKD-EPI GFR",
    score="22 mL/min/1.73m2",
    severity="High",
    interpretation="CKD Stage 4. Nephrology co-management recommended.",
    inputs={age:73, sex:"Female", creatinine:2.4}
  )
)
```

## Notes

- The hero section uses a purple accent (`#8C66D9`) with the drug name in uppercase tracking.
- Patient parameters are displayed as labeled info rows with keys auto-formatted from snake_case.
- The dosing guidance is rendered inside a collapsible "FDA Dosing Guidance" section as selectable text with 1.5x line height.
- The formula is displayed in a monospace code block with a muted background.
- The Cockcroft-Gault formula applies a 0.85 multiplier for female patients; this should be reflected in the `formula` prop when applicable.
- A clinical disclaimer is always included at the bottom.
