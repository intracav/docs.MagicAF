---
title: "Checklist"
description: "Interactive checklist with toggleable items, section headers, and progress tracking."
weight: 20
tags: [lumen-ui, checklist, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Checklist renders an interactive list of toggleable items with a progress bar and completion counter. Items can be organized under section headers for logical grouping. Checked items display with a green checkbox, strikethrough text, and muted color. The progress bar updates in real-time as items are toggled. State changes dispatch a `toggleState` action for external tracking.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | — | Checklist title displayed alongside the progress counter. |
| `items` | `array<object>` | *required* | Array of checklist items. See fields below. Also accepts plain strings. |

**Item object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `text` | `string` | Item label text. |
| `checked` | `bool` | Initial checked state. Defaults to `false`. |
| `section` | `bool` | When `true`, renders the item as a section header instead of a toggleable checkbox. |

## DSL Example

```
Checklist(
  title="Pre-Operative Safety Checklist",
  items=[
    {text:"Documentation", section:true},
    {text:"Informed consent signed and witnessed", checked:true},
    {text:"H&P completed within 30 days", checked:true},
    {text:"Surgical site marked", checked:false},
    {text:"Pre-Op Assessment", section:true},
    {text:"NPO status confirmed (>8h solids, >2h clear liquids)", checked:true},
    {text:"Allergies reviewed and documented", checked:true},
    {text:"Antibiotic prophylaxis administered within 60 min", checked:false},
    {text:"Equipment & Safety", section:true},
    {text:"Blood products available if needed", checked:false},
    {text:"IV access established (18g or larger)", checked:false},
    {text:"Anesthesia machine check completed", checked:false}
  ]
)
```

### Live Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview &mdash; Click items to toggle</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Checklist &mdash; Pre-Operative Safety</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-card">
<div class="lm-card__header">
<div class="lm-card__title">Pre-Operative Safety Checklist <span style="font-weight:400;color:var(--text-tertiary);font-size:13px;">4/8</span></div>
</div>
<div class="lm-card__body" style="padding:8px 16px 16px;">
<div style="border-left:3px solid var(--accent);padding-left:12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-secondary);margin-bottom:8px;">Documentation</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Informed consent signed and witnessed</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">H&amp;P completed within 30 days</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Surgical site marked</span>
</div>
<div style="border-left:3px solid var(--accent);padding-left:12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-secondary);margin:12px 0 8px;">Pre-Op Assessment</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">NPO status confirmed (&gt;8h solids, &gt;2h clear liquids)</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Allergies reviewed and documented</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Antibiotic prophylaxis administered within 60 min</span>
</div>
<div style="border-left:3px solid var(--accent);padding-left:12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-secondary);margin:12px 0 8px;">Equipment &amp; Safety</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Blood products available if needed</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">IV access established (18g or larger)</span>
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
  "type": "checklist",
  "props": {
    "title": "Pre-Operative Safety Checklist",
    "items": [
      {"text": "Documentation", "section": true},
      {"text": "Informed consent signed and witnessed", "checked": true},
      {"text": "H&P completed within 30 days", "checked": true},
      {"text": "Surgical site marked", "checked": false},
      {"text": "Pre-Op Assessment", "section": true},
      {"text": "NPO status confirmed", "checked": true},
      {"text": "Allergies reviewed and documented", "checked": true},
      {"text": "Antibiotic prophylaxis administered within 60 min", "checked": false}
    ]
  }
}
```

## Composition

A checklist alongside clinical context in a procedural preparation workflow:

```
Stack(direction="vertical", gap=16,
  FhirPatient(
    patient={name:"Thomas Rivera", dob:"1965-03-14", gender:"male"},
    conditions=["Right knee osteoarthritis", "Hypertension", "Type 2 Diabetes"],
    allergies=["Penicillin - Rash"],
    medications=["Metformin 1000mg BID", "Lisinopril 20mg daily", "Metoprolol 25mg BID"]
  ),
  AllergySafety(
    drug="Cefazolin",
    allergen="Penicillin",
    reaction_type="Rash",
    risk_level="Low",
    recommendation="Low cross-reactivity risk (<2%). Cefazolin acceptable for surgical prophylaxis."
  ),
  Checklist(
    title="TKA Pre-Op Checklist",
    items=[
      {text:"Patient verified (name, DOB, MRN)", checked:true},
      {text:"Surgical site confirmed: RIGHT knee", checked:true},
      {text:"Consent on file for right TKA", checked:true},
      {text:"Metformin held 24h pre-op", checked:true},
      {text:"Cefazolin 2g IV ordered (allergy cleared)", checked:false},
      {text:"DVT prophylaxis plan documented", checked:false},
      {text:"Physical therapy consulted", checked:false}
    ]
  )
)
```

### Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Preview &mdash; Click items to toggle</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">TKA Pre-Op Workflow</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-fhir-patient">
<div class="lm-fhir-patient__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-fhir-patient__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">T</div>
<div>
<div class="lm-fhir-patient__name">Thomas Rivera</div>
<div class="lm-fhir-patient__mrn">DOB: 1965-03-14 &middot; Male &middot; Right knee OA, HTN, DM2</div>
</div>
</div>
</div>
<div class="lm-allergy-safety">
<div class="lm-allergy-safety__header lm-allergy-safety__header--safe" style="padding:10px 16px;border-radius:8px;">
<span style="font-weight:600;font-size:13px;">Cefazolin vs Penicillin (Rash)</span>
<span class="lm-badge lm-badge--success">Low Risk</span>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">TKA Pre-Op Checklist</div></div>
<div class="lm-card__body" style="padding:8px 16px 16px;">
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Patient verified (name, DOB, MRN)</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Surgical site confirmed: RIGHT knee</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Consent on file for right TKA</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Metformin held 24h pre-op</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Cefazolin 2g IV ordered (allergy cleared)</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">DVT prophylaxis plan documented</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Physical therapy consulted</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The progress bar uses the theme's success color and updates in real-time as checkboxes are toggled.
- The completion counter is displayed as `"N/M"` (e.g., `"4/7"`) next to the title.
- Section headers render with a 3px primary-colored left border and are not toggleable. They do not count toward the progress total.
- Checked items display with: green-filled checkbox, strikethrough text decoration, and muted text color.
- Tapping a checkbox dispatches a `toggleState` action with `{index, checked}` payload, enabling external state persistence.
- When plain strings are passed instead of objects, they are treated as unchecked items.
