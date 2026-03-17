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

## Notes

- The patient header uses a teal accent (`#38B2AC`) with a circular avatar showing the first letter of the patient name.
- Each data section (Conditions, Medications, Allergies, Encounters, Observations) renders as a collapsible panel with an item count in the title.
- Lists are limited to 10 items per section to keep the card manageable. Longer lists are truncated.
- Allergies use an orange warning accent to distinguish them from other sections.
- Contact information (phone, address, PCP) is displayed as labeled info rows below the header.
