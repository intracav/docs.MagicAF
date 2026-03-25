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

### Live Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">DifferentialDx &mdash; Chest Pain</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-ddx">
<div class="lm-ddx__header">
<div class="lm-ddx__title">Differential Dx &mdash; Chest pain, substernal, radiating to left arm</div>
</div>
<ul class="lm-ddx__list">
<li class="lm-ddx__item">
<span class="lm-ddx__rank">1</span>
<span class="lm-ddx__name">Acute Myocardial Infarction<br><span style="font-size:11px;color:var(--text-tertiary);font-weight:400;">I21.9 &middot; ECG, troponin, CBC, BMP</span></span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--high">High</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">2</span>
<span class="lm-ddx__name">Unstable Angina<br><span style="font-size:11px;color:var(--text-tertiary);font-weight:400;">I20.0 &middot; Serial troponins q3h, stress test</span></span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--moderate">Moderate</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">3</span>
<span class="lm-ddx__name">Pulmonary Embolism<br><span style="font-size:11px;color:var(--text-tertiary);font-weight:400;">I26.99 &middot; D-dimer, CT angiography</span></span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--low">Low</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">4</span>
<span class="lm-ddx__name">GERD<br><span style="font-size:11px;color:var(--text-tertiary);font-weight:400;">K21.0 &middot; Diagnosis of exclusion</span></span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--low">Low</span>
</li>
</ul>
</div>
</div>
</div>
</div>
</div>

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

### Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">ED Workup &mdash; Acute Dyspnea</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-triage lm-triage--2">
<div class="lm-triage__banner">
<span class="lm-triage__level-badge">ESI 2 &mdash; Emergent</span>
<span class="lm-triage__wait">Immediate</span>
</div>
<div class="lm-triage__body">
<div>
<div class="lm-triage__row-label">Chief Complaint</div>
<div class="lm-triage__row-value">Acute dyspnea, SpO2 88% on room air</div>
</div>
<div>
<div class="lm-triage__row-label">Action</div>
<div class="lm-triage__row-value">Supplemental O2, continuous pulse ox, ABG</div>
</div>
</div>
</div>
<div class="lm-ddx">
<div class="lm-ddx__header"><div class="lm-ddx__title">Differential Dx &mdash; Acute dyspnea</div></div>
<ul class="lm-ddx__list">
<li class="lm-ddx__item">
<span class="lm-ddx__rank">1</span>
<span class="lm-ddx__name">Pulmonary Embolism</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--high">High</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">2</span>
<span class="lm-ddx__name">Decompensated Heart Failure</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--moderate">Moderate</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">3</span>
<span class="lm-ddx__name">Pneumonia</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--moderate">Moderate</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">4</span>
<span class="lm-ddx__name">Pneumothorax</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--low">Low</span>
</li>
</ul>
</div>
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-lab-ranges__header">
<span class="lm-lab-ranges__name">D-Dimer</span>
<span class="lm-badge lm-badge--default">ng/mL</span>
</div>
</div>
<div class="lm-card__body">
<div class="lm-kv"><span class="lm-kv__key">Adult</span><span class="lm-kv__value">&lt; 500</span></div>
<div style="margin-top:6px;font-size:12px;color:var(--text-tertiary);">&#9432; Age-adjusted cutoff: age &times; 10 for patients &gt;50</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- Diagnoses are numbered sequentially (1, 2, 3...) with a blurple-tinted number badge.
- Likelihood colors: High/Most Likely = destructive red, Moderate/Medium = warning amber, Low/Less Likely = success green.
- ICD-10 codes are displayed as muted badges next to the likelihood badge.
- The `workup` field is rendered in the primary color to visually distinguish it from supporting evidence.
- When the `diagnoses` array is empty but `content` is provided, the component falls back to rendering the content as selectable text.
- A clinical disclaimer is always rendered at the bottom.
