---
title: "ClinicalNote"
description: "Structured clinical note viewer for SOAP notes, H&P, discharge summaries, and progress notes."
weight: 7
tags: [lumen-ui, clinical-note, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

ClinicalNote renders structured clinical documentation with section highlighting. It supports SOAP notes, H&P reports, discharge summaries, and progress notes. When sections are provided, each is rendered as a collapsible panel with a color-coded accent based on the SOAP convention (Subjective = blurple, Objective = green, Assessment = amber, Plan = blue). Metadata badges show the note type, date, and provider.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `note_type` | `string` | — | Note category (e.g., `"soap_note"`, `"h_and_p"`, `"discharge_summary"`, `"progress"`). Auto-formatted to title case. |
| `provider` | `string` | — | Authoring provider name. Displayed as a metadata badge. |
| `date` | `string` | — | Note date. Displayed as a metadata badge. |
| `content` | `string` | *required* | Full note content as markdown. Used when `sections` is not provided. |
| `sections` | `array<object>` | `[]` | Pre-parsed note sections. Each object has `title` (string) and `content` (string). |

**SOAP section colors:**

| Section Initial | Color |
|-----------------|-------|
| S (Subjective) | Blurple (`#5865F2`) |
| O (Objective) | Green (`#3DBF80`) |
| A (Assessment) | Amber (`#D69E2E`) |
| P (Plan) | Blue (`#3B82F6`) |
| Other | Primary theme color |

## DSL Example

```
ClinicalNote(
  note_type="soap_note",
  provider="Dr. Sarah Chen",
  date="2026-03-17",
  sections=[
    {title:"Subjective", content:"Patient reports persistent cough x 2 weeks, productive with yellow sputum. Denies fever, hemoptysis, chest pain. Tried OTC cough suppressant without relief."},
    {title:"Objective", content:"Vitals: T 98.8F, HR 78, BP 128/82, RR 16, SpO2 97%\nLungs: Scattered rhonchi bilateral bases, no wheezing.\nOropharynx: Mild erythema, no exudates."},
    {title:"Assessment", content:"Acute bronchitis, likely viral. Low suspicion for pneumonia given normal vitals and afebrile status."},
    {title:"Plan", content:"1. Supportive care: hydration, rest\n2. Guaifenesin 400mg q4h PRN\n3. Return if fever develops or symptoms worsen beyond 10 days\n4. Chest X-ray if not improving in 1 week"}
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
<span class="lumen-demo__bar-title">ClinicalNote &mdash; SOAP Note</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-clinical-note">
<div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap;">
<span class="lm-badge lm-badge--default">SOAP Note</span>
<span class="lm-badge" style="background:var(--entry);color:var(--text-secondary);">2026-03-17</span>
<span class="lm-badge" style="background:var(--entry);color:var(--text-secondary);">Dr. Sarah Chen</span>
</div>
<div class="lm-clinical-note__section" style="border-left:3px solid #5865F2;">
<div class="lm-clinical-note__section-title" style="color:#5865F2;">Subjective</div>
<div class="lm-clinical-note__section-body">Patient reports persistent cough x 2 weeks, productive with yellow sputum. Denies fever, hemoptysis, chest pain. Tried OTC cough suppressant without relief.</div>
</div>
<div class="lm-clinical-note__section" style="border-left:3px solid #3DBF80;">
<div class="lm-clinical-note__section-title" style="color:#3DBF80;">Objective</div>
<div class="lm-clinical-note__section-body">Vitals: T 98.8&deg;F, HR 78, BP 128/82, RR 16, SpO2 97%<br>Lungs: Scattered rhonchi bilateral bases, no wheezing.<br>Oropharynx: Mild erythema, no exudates.</div>
</div>
<div class="lm-clinical-note__section" style="border-left:3px solid #D69E2E;">
<div class="lm-clinical-note__section-title" style="color:#D69E2E;">Assessment</div>
<div class="lm-clinical-note__section-body">Acute bronchitis, likely viral. Low suspicion for pneumonia given normal vitals and afebrile status.</div>
</div>
<div class="lm-clinical-note__section" style="border-left:3px solid #3B82F6;">
<div class="lm-clinical-note__section-title" style="color:#3B82F6;">Plan</div>
<div class="lm-clinical-note__section-body">1. Supportive care: hydration, rest<br>2. Guaifenesin 400mg q4h PRN<br>3. Return if fever develops or symptoms worsen beyond 10 days<br>4. Chest X-ray if not improving in 1 week</div>
</div>
</div>
</div>
</div>
</div>
</div>

## JSON Example

```json
{
  "type": "clinical_note",
  "props": {
    "note_type": "soap_note",
    "provider": "Dr. Sarah Chen",
    "date": "2026-03-17",
    "sections": [
      {"title": "Subjective", "content": "Patient reports persistent cough x 2 weeks, productive with yellow sputum."},
      {"title": "Objective", "content": "Vitals: T 98.8F, HR 78, BP 128/82. Lungs: Scattered rhonchi bilateral bases."},
      {"title": "Assessment", "content": "Acute bronchitis, likely viral."},
      {"title": "Plan", "content": "1. Supportive care\n2. Guaifenesin 400mg q4h PRN\n3. Return if fever develops"}
    ]
  }
}
```

## Composition

A clinical note alongside a differential diagnosis and lab results:

```
Stack(direction="vertical", gap=16,
  ClinicalNote(
    note_type="h_and_p",
    provider="Dr. James Park",
    date="2026-03-17",
    sections=[
      {title:"History of Present Illness", content:"72-year-old male presents with 3-day history of progressive dyspnea on exertion. Orthopnea (2 pillows). Bilateral lower extremity edema noted by patient."},
      {title:"Past Medical History", content:"CHF (EF 35%), HTN, DM2, CKD Stage 3"},
      {title:"Assessment", content:"Acute on chronic systolic heart failure exacerbation"},
      {title:"Plan", content:"1. IV furosemide 40mg x1\n2. Daily weights, I&O\n3. BNP, BMP, chest X-ray\n4. Cardiology consult"}
    ]
  ),
  LabRanges(
    results=[
      {name:"BNP", unit:"pg/mL", adult:"<100", notes:"Expected elevated in acute CHF exacerbation"},
      {name:"Creatinine", unit:"mg/dL", male:"0.7-1.3"}
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
<span class="lumen-demo__bar-title">CHF Workup &mdash; H&amp;P + Labs</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-clinical-note">
<div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap;">
<span class="lm-badge lm-badge--default">H&amp;P</span>
<span class="lm-badge" style="background:var(--entry);color:var(--text-secondary);">Dr. James Park</span>
</div>
<div class="lm-clinical-note__section">
<div class="lm-clinical-note__section-title">History of Present Illness</div>
<div class="lm-clinical-note__section-body">72-year-old male presents with 3-day history of progressive dyspnea on exertion. Orthopnea (2 pillows). Bilateral lower extremity edema.</div>
</div>
<div class="lm-clinical-note__section">
<div class="lm-clinical-note__section-title" style="color:#D69E2E;">Assessment</div>
<div class="lm-clinical-note__section-body">Acute on chronic systolic heart failure exacerbation</div>
</div>
<div class="lm-clinical-note__section" style="border-left:3px solid #3B82F6;">
<div class="lm-clinical-note__section-title" style="color:#3B82F6;">Plan</div>
<div class="lm-clinical-note__section-body">1. IV furosemide 40mg x1<br>2. Daily weights, I&amp;O<br>3. BNP, BMP, chest X-ray<br>4. Cardiology consult</div>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-lab-ranges__header">
<span class="lm-lab-ranges__name">BNP</span>
<span class="lm-badge lm-badge--default">pg/mL</span>
</div>
</div>
<div class="lm-card__body">
<div class="lm-kv"><span class="lm-kv__key">Adult</span><span class="lm-kv__value">&lt; 100</span></div>
<div style="margin-top:6px;font-size:12px;color:var(--text-tertiary);">&#9432; Expected elevated in acute CHF exacerbation</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- When `sections` is provided, each section renders as a collapsible panel. When only `content` is available, the full text is rendered as selectable text in a single block.
- The `note_type` value is auto-formatted: underscores are replaced with spaces and each word is capitalized (e.g., `"soap_note"` becomes `"Soap Note"`).
- Section content is rendered as selectable text with 1.5x line height for readability.
- A clinical disclaimer is always rendered at the bottom of the card.
- Metadata badges (note type, date, provider) only appear when at least one of these props is provided.
