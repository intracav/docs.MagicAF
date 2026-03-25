---
title: "FhirPatient"
description: "FHIR patient summary with demographics, conditions, medications, allergies, and encounters."
weight: 8
tags: [lumen-ui, fhir-patient, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

FhirPatient renders an aggregated patient summary from FHIR EHR data. The card displays a patient header with avatar initial, name, date of birth, and gender, followed by contact information and collapsible sections for active conditions, medications, allergies, recent encounters, and observations. Each section shows an item count and is initially collapsed to keep the overview compact.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `patient` | `object` | *required* | Patient demographics object. See fields below. |
| `encounters` | `array<string>` | `[]` | List of recent encounter descriptions. |
| `conditions` | `array<string>` | `[]` | Active problem list / conditions. |
| `medications` | `array<string>` | `[]` | Active medication list. |
| `allergies` | `array<string>` | `[]` | Known allergies and reactions. |
| `observations` | `array<string>` | `[]` | Clinical observations (vitals, labs, etc.). |

**Patient object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Full patient name. First character is used for the avatar. |
| `dob` | `string` | Date of birth. |
| `gender` | `string` | Gender (`"male"`, `"female"`, etc.). |
| `phone` | `string` | Contact phone number. |
| `address` | `string` | Home address. |
| `pcp` | `string` | Primary care provider name. |
| `language` | `string` | Preferred language. |

## DSL Example

```
FhirPatient(
  patient={name:"Jane Doe", dob:"1985-04-12", gender:"female", phone:"555-0142", pcp:"Dr. Michael Torres"},
  conditions=["Type 2 Diabetes Mellitus (E11.9)", "Essential Hypertension (I10)", "Hyperlipidemia (E78.5)"],
  medications=["Metformin 500mg BID", "Lisinopril 10mg daily", "Atorvastatin 20mg daily"],
  allergies=["Penicillin - Rash", "Sulfa drugs - Anaphylaxis"],
  encounters=["2026-03-01: Office visit - Diabetes follow-up", "2026-01-15: Lab work - HbA1c, lipid panel"],
  observations=["BP 132/84 mmHg", "HR 72 bpm", "HbA1c 7.2%", "BMI 28.4"]
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
<span class="lumen-demo__bar-title">FhirPatient &mdash; Patient Summary</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-fhir-patient">
<div class="lm-fhir-patient__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-fhir-patient__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">J</div>
<div>
<div class="lm-fhir-patient__name">Jane Doe</div>
<div class="lm-fhir-patient__mrn">DOB: 1985-04-12 &middot; Female &middot; PCP: Dr. Michael Torres</div>
</div>
</div>
<div style="padding:12px 16px;border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:6px;">Active Conditions (3)</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Type 2 Diabetes Mellitus (E11.9)<br>Essential Hypertension (I10)<br>Hyperlipidemia (E78.5)</div>
</div>
<div style="padding:12px 16px;border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:6px;">Medications (3)</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Metformin 500mg BID<br>Lisinopril 10mg daily<br>Atorvastatin 20mg daily</div>
</div>
<div style="padding:12px 16px;border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#ED8936;margin-bottom:6px;">Allergies (2)</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Penicillin &mdash; Rash<br>Sulfa drugs &mdash; Anaphylaxis</div>
</div>
<div style="padding:12px 16px;">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:6px;">Recent Observations</div>
<div style="display:flex;flex-wrap:wrap;gap:6px;">
<span class="lm-badge lm-badge--default">BP 132/84</span>
<span class="lm-badge lm-badge--default">HR 72</span>
<span class="lm-badge lm-badge--warning">HbA1c 7.2%</span>
<span class="lm-badge lm-badge--default">BMI 28.4</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## JSON Example

```json
{
  "type": "fhir_patient",
  "props": {
    "patient": {
      "name": "Jane Doe",
      "dob": "1985-04-12",
      "gender": "female",
      "phone": "555-0142",
      "pcp": "Dr. Michael Torres"
    },
    "conditions": ["Type 2 Diabetes Mellitus (E11.9)", "Essential Hypertension (I10)", "Hyperlipidemia (E78.5)"],
    "medications": ["Metformin 500mg BID", "Lisinopril 10mg daily", "Atorvastatin 20mg daily"],
    "allergies": ["Penicillin - Rash", "Sulfa drugs - Anaphylaxis"],
    "encounters": ["2026-03-01: Office visit - Diabetes follow-up", "2026-01-15: Lab work - HbA1c, lipid panel"]
  }
}
```

## Composition

A patient summary alongside medication-specific lookups:

```
Stack(direction="vertical", gap=16,
  FhirPatient(
    patient={name:"Robert Kim", dob:"1958-11-03", gender:"male", pcp:"Dr. Lisa Nguyen"},
    conditions=["Atrial Fibrillation", "CKD Stage 3b", "Type 2 Diabetes"],
    medications=["Apixaban 2.5mg BID", "Metformin 1000mg BID", "Amlodipine 5mg daily"],
    allergies=["ACE Inhibitors - Angioedema"]
  ),
  RenalDose(
    drug="Apixaban",
    crcl_ml_min=38,
    ckd_stage="G3b",
    dosing_guidance="2.5mg BID (reduced dose for CrCl 15-50 mL/min or age >=80 with body weight <=60kg or SCr >=1.5)"
  ),
  AllergySafety(
    drug="Amlodipine",
    allergen="ACE Inhibitors",
    risk_level="Low",
    recommendation="Calcium channel blockers are not cross-reactive with ACE inhibitors. Safe to use."
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
<span class="lumen-demo__bar-title">Patient Review &mdash; Medication Safety</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-fhir-patient">
<div class="lm-fhir-patient__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-fhir-patient__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">R</div>
<div>
<div class="lm-fhir-patient__name">Robert Kim</div>
<div class="lm-fhir-patient__mrn">DOB: 1958-11-03 &middot; Male &middot; PCP: Dr. Lisa Nguyen</div>
</div>
</div>
<div style="padding:12px 16px;border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:6px;">Conditions</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Atrial Fibrillation &middot; CKD Stage 3b &middot; Type 2 Diabetes</div>
</div>
<div style="padding:12px 16px;">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#ED8936;margin-bottom:6px;">Allergies</div>
<div style="font-size:13px;color:var(--text-primary);">ACE Inhibitors &mdash; Angioedema</div>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #8C66D9;padding-left:13px;">
<div class="lm-card__title">Renal Dose &mdash; APIXABAN</div>
<div class="lm-card__description">CrCl: 38 mL/min &middot; CKD Stage G3b</div>
</div>
<div class="lm-card__body">
<div style="font-size:13px;color:var(--text-primary);">2.5mg BID (reduced dose for CrCl 15&ndash;50 mL/min)</div>
</div>
</div>
<div class="lm-allergy-safety">
<div class="lm-allergy-safety__header lm-allergy-safety__header--safe" style="padding:12px 16px;border-radius:8px 8px 0 0;">
<span style="font-weight:700;">Amlodipine vs ACE Inhibitor Allergy</span>
<span class="lm-badge lm-badge--success">Low Risk</span>
</div>
<div style="padding:8px 16px;font-size:13px;color:var(--text-secondary);border:1px solid var(--border);border-top:0;border-radius:0 0 8px 8px;">Calcium channel blockers are not cross-reactive with ACE inhibitors. Safe to use.</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The patient header uses a teal accent (`#38B2AC`) with a circular avatar showing the first letter of the patient name.
- Each data section (Conditions, Medications, Allergies, Encounters, Observations) renders as a collapsible panel with an item count in the title.
- Lists are limited to 10 items per section to keep the card manageable. Longer lists are truncated.
- Allergies use an orange warning accent to distinguish them from other sections.
- Contact information (phone, address, PCP) is displayed as labeled info rows below the header.
