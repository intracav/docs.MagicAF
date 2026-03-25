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

### Live Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">RenalDose &mdash; Vancomycin</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-card">
<div style="padding:16px;text-align:center;background:rgba(140,102,217,0.06);border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8C66D9;margin-bottom:4px;">VANCOMYCIN</div>
<div style="font-size:36px;font-weight:800;color:#8C66D9;">35.2</div>
<div style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;">mL/min (CrCl)</div>
<div style="display:flex;align-items:center;justify-content:center;gap:8px;">
<span class="lm-badge lm-badge--warning" style="background:rgba(237,137,54,0.1);color:#ED8936;">CKD Stage G3b</span>
</div>
</div>
<div style="padding:16px;">
<div class="lm-renal-dose__stages" style="margin-bottom:12px;">
<div class="lm-renal-dose__stage lm-renal-dose__stage--1">G1</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--2">G2</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--3 active">G3b</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--4">G4</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--5">G5</div>
</div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:8px;">Patient Parameters</div>
<div class="lm-kv" style="margin-bottom:12px;">
<span class="lm-kv__key">Age</span><span class="lm-kv__value">74</span>
<span class="lm-kv__key">Sex</span><span class="lm-kv__value">Male</span>
<span class="lm-kv__key">Weight</span><span class="lm-kv__value">72 kg</span>
<span class="lm-kv__key">Serum Creatinine</span><span class="lm-kv__value">1.8 mg/dL</span>
</div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:8px;">FDA Dosing Guidance</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;padding:10px 12px;background:var(--entry);border-radius:6px;">
CrCl 30&ndash;49 mL/min: 750mg IV q24h<br>
CrCl 10&ndash;29 mL/min: 500mg IV q24&ndash;48h<br>
CrCl &lt;10 mL/min: 500mg IV, re-dose based on trough levels<br><br>
Target trough: 15&ndash;20 mcg/mL for serious infections
</div>
</div>
<div style="padding:0 16px 12px;">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:6px;">Formula</div>
<div style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);background:var(--entry);padding:8px 12px;border-radius:6px;">CrCl = [(140 - 74) &times; 72] / (72 &times; 1.8) = 36.7 mL/min</div>
</div>
</div>
</div>
</div>
</div>
</div>

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

### Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Nephrology Consult &mdash; Levofloxacin</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-fhir-patient">
<div class="lm-fhir-patient__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-fhir-patient__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">M</div>
<div>
<div class="lm-fhir-patient__name">Margaret Wilson</div>
<div class="lm-fhir-patient__mrn">DOB: 1952-08-19 &middot; Female &middot; CKD Stage 4, DM2, UTI</div>
</div>
</div>
</div>
<div class="lm-card">
<div style="padding:12px 16px;text-align:center;background:rgba(140,102,217,0.06);border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8C66D9;">LEVOFLOXACIN</div>
<div style="font-size:28px;font-weight:800;color:#8C66D9;">22</div>
<div style="font-size:13px;color:var(--text-secondary);">mL/min (CrCl) &middot; <span class="lm-badge lm-badge--error" style="font-size:11px;">CKD G4</span></div>
</div>
<div style="padding:12px 16px;font-size:13px;color:var(--text-primary);line-height:1.6;">
CrCl 20&ndash;49 mL/min: 750mg q48h or 500mg q24h<br>
CrCl 10&ndash;19 mL/min: 500mg q48h
</div>
</div>
<div class="lm-calculator">
<div class="lm-calculator__header"><div class="lm-calculator__name">CKD-EPI GFR</div></div>
<div class="lm-calculator__result" style="background:rgba(218,55,60,0.06);">
<div class="lm-calculator__score" style="color:#DA373C;">22</div>
<div style="font-size:13px;color:var(--text-secondary);">mL/min/1.73m&sup2;</div>
<div class="lm-calculator__interpretation">CKD Stage 4. Nephrology co-management recommended.</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The hero section uses a purple accent (`#8C66D9`) with the drug name in uppercase tracking.
- Patient parameters are displayed as labeled info rows with keys auto-formatted from snake_case.
- The dosing guidance is rendered inside a collapsible "FDA Dosing Guidance" section as selectable text with 1.5x line height.
- The formula is displayed in a monospace code block with a muted background.
- The Cockcroft-Gault formula applies a 0.85 multiplier for female patients; this should be reflected in the `formula` prop when applicable.
- A clinical disclaimer is always included at the bottom.
