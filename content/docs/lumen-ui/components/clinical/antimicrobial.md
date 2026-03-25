---
title: "Antimicrobial"
description: "Antibiotic selection guidance with spectrum, dosing, duration, and monitoring recommendations."
weight: 11
tags: [lumen-ui, antimicrobial, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Antimicrobial renders antibiotic selection guidance for a given infection, including dosing regimen, duration, monitoring parameters, and spectrum coverage. The component supports both structured format (drug name with detail sections) and server envelope format (infection type with free-text content). Severity is displayed as a color-coded badge in the header.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `drug` | `string` | — | Drug name (structured format). Falls back to `infection` for the header title. |
| `infection` | `string` | — | Infection type (server envelope format). Used as header title when `drug` is not provided. |
| `severity` | `string` | — | Infection severity: `"Critical"`, `"Severe"`, `"Moderate"`, `"Mild"`. Color-coded badge. |
| `setting` | `string` | — | Clinical setting (e.g., `"ICU"`, `"Inpatient"`, `"Outpatient"`). |
| `sections` | `array<object>` | `[]` | Array of detail sections. Each object has `title` (string) and `content` (string). |
| `content` | `string` | — | Fallback text content when sections are not provided. |

**Severity color mapping:**

| Severity | Color |
|----------|-------|
| Critical, Severe | Destructive red |
| Moderate | Warning amber |
| Mild | Success green |

## DSL Example

```
Antimicrobial(
  drug="Piperacillin-Tazobactam",
  infection="Hospital-acquired pneumonia",
  severity="Severe",
  setting="ICU",
  sections=[
    {title:"Dosing", content:"4.5g IV q6h (extended infusion over 4 hours preferred)"},
    {title:"Duration", content:"7-10 days. Consider de-escalation at 48-72h based on culture data."},
    {title:"Spectrum", content:"Gram-negative including Pseudomonas, Gram-positive excluding MRSA, anaerobes"},
    {title:"Monitoring", content:"Renal function (BUN/Cr), CBC with differential, hepatic function\nConsider therapeutic drug monitoring if renal impairment"}
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
<span class="lumen-demo__bar-title">Antimicrobial &mdash; Piperacillin-Tazobactam</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #3DBF80;padding-left:13px;">
<div class="lm-card__title" style="display:flex;align-items:center;gap:8px;">Piperacillin-Tazobactam <span class="lm-badge lm-badge--error">Severe</span></div>
<div class="lm-card__description">Hospital-acquired pneumonia &middot; ICU</div>
</div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Dosing</div>
<div style="font-size:13px;color:var(--text-primary);">4.5g IV q6h (extended infusion over 4 hours preferred)</div>
</div>
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Duration</div>
<div style="font-size:13px;color:var(--text-primary);">7&ndash;10 days. Consider de-escalation at 48&ndash;72h based on culture data.</div>
</div>
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Spectrum</div>
<div style="display:flex;flex-wrap:wrap;gap:6px;">
<span class="lm-badge lm-badge--success">Gram-negative incl. Pseudomonas</span>
<span class="lm-badge lm-badge--info">Gram-positive excl. MRSA</span>
<span class="lm-badge lm-badge--default">Anaerobes</span>
</div>
</div>
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Monitoring</div>
<div style="font-size:13px;color:var(--text-primary);">Renal function (BUN/Cr), CBC with differential, hepatic function</div>
</div>
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
  "type": "antimicrobial",
  "props": {
    "drug": "Piperacillin-Tazobactam",
    "infection": "Hospital-acquired pneumonia",
    "severity": "Severe",
    "setting": "ICU",
    "sections": [
      {"title": "Dosing", "content": "4.5g IV q6h (extended infusion over 4 hours preferred)"},
      {"title": "Duration", "content": "7-10 days. Consider de-escalation at 48-72h based on culture data."},
      {"title": "Spectrum", "content": "Gram-negative including Pseudomonas, Gram-positive excluding MRSA, anaerobes"},
      {"title": "Monitoring", "content": "Renal function (BUN/Cr), CBC with differential, hepatic function"}
    ]
  }
}
```

## Composition

Antimicrobial guidance as part of an infectious disease workup:

```
Stack(direction="vertical", gap=16,
  DifferentialDx(
    chief_complaint="Fever, productive cough, hypoxia",
    diagnoses=[
      {diagnosis:"Community-acquired pneumonia", likelihood:"High", icd10:"J18.9"},
      {diagnosis:"COVID-19", likelihood:"Moderate"},
      {diagnosis:"Pulmonary embolism with infarction", likelihood:"Low"}
    ]
  ),
  Antimicrobial(
    drug="Ceftriaxone + Azithromycin",
    infection="Community-acquired pneumonia",
    severity="Moderate",
    setting="Inpatient",
    sections=[
      {title:"Dosing", content:"Ceftriaxone 1g IV q24h + Azithromycin 500mg IV/PO q24h"},
      {title:"Duration", content:"5-7 days. Switch to oral when clinically improving and tolerating PO."},
      {title:"De-escalation", content:"Narrow based on sputum/blood culture results at 48-72h"}
    ]
  ),
  RenalDose(
    drug="Ceftriaxone",
    crcl_ml_min=85,
    ckd_stage="G1",
    dosing_guidance="No dose adjustment needed for CrCl > 10 mL/min"
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
<span class="lumen-demo__bar-title">Infectious Disease Workup &mdash; CAP</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-ddx">
<div class="lm-ddx__header"><div class="lm-ddx__title">Differential Dx &mdash; Fever, productive cough, hypoxia</div></div>
<ul class="lm-ddx__list">
<li class="lm-ddx__item">
<span class="lm-ddx__rank">1</span>
<span class="lm-ddx__name">Community-acquired pneumonia<br><span style="font-size:11px;color:var(--text-tertiary);font-weight:400;">J18.9</span></span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--high">High</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">2</span>
<span class="lm-ddx__name">COVID-19</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--moderate">Moderate</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">3</span>
<span class="lm-ddx__name">PE with infarction</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--low">Low</span>
</li>
</ul>
</div>
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #3DBF80;padding-left:13px;">
<div class="lm-card__title" style="display:flex;align-items:center;gap:8px;">Ceftriaxone + Azithromycin <span class="lm-badge lm-badge--warning">Moderate</span></div>
<div class="lm-card__description">Community-acquired pneumonia &middot; Inpatient</div>
</div>
<div class="lm-card__body">
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Ceftriaxone 1g IV q24h + Azithromycin 500mg IV/PO q24h<br>Duration: 5&ndash;7 days. Switch to oral when clinically improving.</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The header uses a green accent (`#3DBF80`) and falls back to `"Antimicrobial"` if neither `drug` nor `infection` is provided.
- Sections render as collapsible panels, initially collapsed.
- When only `content` is provided without sections, the text is rendered as a single selectable block.
- The `setting` field is displayed below the header as a muted label.
- A clinical disclaimer is always included at the bottom.
