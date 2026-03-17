---
title: "DifferentialDx"
description: "Ranked differential diagnosis list with likelihood, ICD-10 codes, and workup suggestions."
weight: 6
tags: [lumen-ui, differential-dx, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

DifferentialDx renders a ranked list of differential diagnoses for a given chief complaint. Each diagnosis card displays its name, likelihood badge (color-coded), optional ICD-10 code, supporting evidence, and recommended workup. The component supports both structured diagnosis arrays and plain text content as a fallback.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `diagnoses` | `array<object>` | `[]` | Array of diagnosis objects. See fields below. Also accepts plain strings. |
| `chief_complaint` | `string` | — | The presenting complaint or symptom cluster. |
| `symptoms` | `string` | — | Alternative to `chief_complaint` (server envelope format). |
| `content` | `string` | — | Fallback plain text content when structured diagnoses are not available. |

**Diagnosis object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `diagnosis` | `string` | Diagnosis name. |
| `likelihood` | `string` | Likelihood level: `"High"`, `"Most Likely"`, `"Moderate"`, `"Medium"`, `"Low"`, `"Less Likely"`. |
| `icd10` | `string` | ICD-10 code (e.g., `"I21.9"`). Displayed as a muted badge. |
| `evidence` | `string` | Supporting clinical evidence or reasoning. |
| `workup` | `string` | Recommended diagnostic workup. Displayed in primary blue. |

**Additional envelope fields** (from server):

| Field | Type | Description |
|-------|------|-------------|
| `age` | `number` | Patient age. Displayed in metadata line. |
| `sex` | `string` | Patient sex. Displayed in metadata line. |
| `duration` | `string` | Symptom duration. Displayed in metadata line. |

## DSL Example

```
DifferentialDx(
  chief_complaint="Chest pain, substernal, radiating to left arm",
  diagnoses=[
    {diagnosis:"Acute Myocardial Infarction", likelihood:"High", icd10:"I21.9", evidence:"Substernal chest pain with left arm radiation and diaphoresis", workup:"ECG, troponin, CBC, BMP"},
    {diagnosis:"Unstable Angina", likelihood:"Moderate", icd10:"I20.0", evidence:"Similar presentation without biomarker elevation", workup:"Serial troponins q3h, stress test"},
    {diagnosis:"Pulmonary Embolism", likelihood:"Low", icd10:"I26.99", evidence:"Less typical presentation, no pleuritic component", workup:"D-dimer, CT angiography if elevated"},
    {diagnosis:"GERD", likelihood:"Low", icd10:"K21.0", evidence:"Diagnosis of exclusion after cardiac causes ruled out"}
  ]
)
```

## JSON Example

```json
{
  "type": "differential_dx",
  "props": {
    "chief_complaint": "Chest pain, substernal, radiating to left arm",
    "diagnoses": [
      {"diagnosis": "Acute Myocardial Infarction", "likelihood": "High", "icd10": "I21.9", "evidence": "Substernal chest pain with left arm radiation and diaphoresis", "workup": "ECG, troponin, CBC, BMP"},
      {"diagnosis": "Unstable Angina", "likelihood": "Moderate", "icd10": "I20.0", "evidence": "Similar presentation without biomarker elevation"},
      {"diagnosis": "Pulmonary Embolism", "likelihood": "Low", "icd10": "I26.99", "evidence": "Less typical presentation, no pleuritic component"},
      {"diagnosis": "GERD", "likelihood": "Low", "icd10": "K21.0", "evidence": "Diagnosis of exclusion after cardiac causes ruled out"}
    ]
  }
}
```

## Composition

A differential diagnosis as part of an emergency department workup:

```
Stack(direction="vertical", gap=16,
  TriageCard(
    level=2,
    chief_complaint="Acute dyspnea, SpO2 88% on room air",
    action="Supplemental O2, continuous pulse ox, ABG"
  ),
  DifferentialDx(
    chief_complaint="Acute dyspnea",
    diagnoses=[
      {diagnosis:"Pulmonary Embolism", likelihood:"High", workup:"CT pulmonary angiography"},
      {diagnosis:"Decompensated Heart Failure", likelihood:"Moderate", workup:"BNP, chest X-ray, echocardiogram"},
      {diagnosis:"Pneumonia", likelihood:"Moderate", workup:"Chest X-ray, CBC, blood cultures"},
      {diagnosis:"Pneumothorax", likelihood:"Low", workup:"Chest X-ray"}
    ]
  ),
  LabRanges(
    results=[
      {name:"D-Dimer", unit:"ng/mL", adult:"<500", notes:"Age-adjusted cutoff: age x 10 for patients >50"},
      {name:"BNP", unit:"pg/mL", adult:"<100", notes:"Elevated in heart failure, renal disease, PE"}
    ]
  )
)
```

## Notes

- Diagnoses are numbered sequentially (1, 2, 3...) with a blurple-tinted number badge.
- Likelihood colors: High/Most Likely = destructive red, Moderate/Medium = warning amber, Low/Less Likely = success green.
- ICD-10 codes are displayed as muted badges next to the likelihood badge.
- The `workup` field is rendered in the primary color to visually distinguish it from supporting evidence.
- When the `diagnoses` array is empty but `content` is provided, the component falls back to rendering the content as selectable text.
- A clinical disclaimer is always rendered at the bottom.
