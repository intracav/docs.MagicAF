---
title: "TriageCard"
description: "ESI triage assessment card with color-coded acuity level, wait time, and recommended action."
weight: 1
tags: [lumen-ui, triage-card, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

TriageCard renders an Emergency Severity Index (ESI) triage assessment with a prominent acuity level badge, chief complaint, expected wait time, and recommended action. Each ESI level (1-5) is color-coded to match standard triage conventions, making it immediately scannable in clinical workflows.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `level` | `number` | *required* | ESI acuity level from 1 (most acute) to 5 (least acute). |
| `label` | `string` | Auto from level | Human-readable acuity label. Defaults to the standard ESI label for the given level. |
| `chief_complaint` | `string` | — | The patient's presenting complaint. |
| `expected_wait` | `string` | — | Estimated wait time (e.g., `"30 min"`, `"Immediate"`). |
| `action` | `string` | — | Recommended clinical action or disposition. |
| `vitals` | `string` | — | Vital signs assessment text. |
| `trace` | `string` | — | Algorithm trace showing how the ESI level was determined. |

**Level color mapping:**

| Level | Label | Color |
|-------|-------|-------|
| 1 | Resuscitation | Red (`#E53E3E`) |
| 2 | Emergent | Orange (`#ED8936`) |
| 3 | Urgent | Amber (`#D69E2E`) |
| 4 | Less Urgent | Green (`#38A169`) |
| 5 | Non-Urgent | Blurple (`#5865F2`) |

## DSL Example

```
TriageCard(
  level=3,
  label="Urgent",
  chief_complaint="Chest pain, onset 2 hours ago",
  expected_wait="30 min",
  action="12-lead ECG, troponin, chest X-ray. Place on cardiac monitor.",
  vitals="HR 92, BP 145/90, SpO2 96%, RR 18, Temp 98.6F"
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
<span class="lumen-demo__bar-title">TriageCard &mdash; ESI Level 3</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-triage lm-triage--3">
<div class="lm-triage__banner">
<span class="lm-triage__level-badge">ESI 3 &mdash; Urgent</span>
<span class="lm-triage__wait">Wait: 30 min</span>
</div>
<div class="lm-triage__body">
<div>
<div class="lm-triage__row-label">Chief Complaint</div>
<div class="lm-triage__row-value">Chest pain, onset 2 hours ago</div>
</div>
<div>
<div class="lm-triage__row-label">Vitals</div>
<div class="lm-triage__row-value">HR 92, BP 145/90, SpO2 96%, RR 18, Temp 98.6&deg;F</div>
</div>
<div>
<div class="lm-triage__row-label">Recommended Action</div>
<div class="lm-triage__row-value">12-lead ECG, troponin, chest X-ray. Place on cardiac monitor.</div>
</div>
</div>
<div class="lm-triage__footer">Clinical decision support &mdash; verify with attending physician</div>
</div>
</div>
</div>
</div>
</div>

## JSON Example

```json
{
  "type": "triage_card",
  "props": {
    "level": 3,
    "label": "Urgent",
    "chief_complaint": "Chest pain, onset 2 hours ago",
    "expected_wait": "30 min",
    "action": "12-lead ECG, troponin, chest X-ray. Place on cardiac monitor.",
    "vitals": "HR 92, BP 145/90, SpO2 96%, RR 18, Temp 98.6F"
  }
}
```

## Composition

A triage card alongside a differential diagnosis and clinical note in an ED assessment dashboard:

```
Stack(direction="vertical", gap=16,
  TriageCard(
    level=2,
    chief_complaint="Severe headache, worst of life, sudden onset",
    expected_wait="Immediate",
    action="CT head without contrast STAT. Neurosurgery consult."
  ),
  DifferentialDx(
    chief_complaint="Thunderclap headache",
    diagnoses=[
      {diagnosis:"Subarachnoid hemorrhage", likelihood:"High", workup:"CT head, LP if CT negative"},
      {diagnosis:"Hypertensive emergency", likelihood:"Moderate"},
      {diagnosis:"Migraine", likelihood:"Low"}
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
<span class="lumen-demo__bar-title">ED Assessment Dashboard</span>
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
<div class="lm-triage__row-value">Severe headache, worst of life, sudden onset</div>
</div>
<div>
<div class="lm-triage__row-label">Recommended Action</div>
<div class="lm-triage__row-value">CT head without contrast STAT. Neurosurgery consult.</div>
</div>
</div>
<div class="lm-triage__footer">Clinical decision support &mdash; verify with attending physician</div>
</div>
<div class="lm-ddx">
<div class="lm-ddx__header">
<div class="lm-ddx__title">Differential Dx &mdash; Thunderclap headache</div>
</div>
<ul class="lm-ddx__list">
<li class="lm-ddx__item">
<span class="lm-ddx__rank">1</span>
<span class="lm-ddx__name">Subarachnoid hemorrhage</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--high">High</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">2</span>
<span class="lm-ddx__name">Hypertensive emergency</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--moderate">Moderate</span>
</li>
<li class="lm-ddx__item">
<span class="lm-ddx__rank">3</span>
<span class="lm-ddx__name">Migraine</span>
<span class="lm-ddx__likelihood lm-ddx__likelihood--low">Low</span>
</li>
</ul>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The `label` prop is optional. When omitted, the component automatically maps the level to its standard ESI label (Resuscitation, Emergent, Urgent, Less Urgent, Non-Urgent).
- The acuity banner uses the level's color at 10% opacity for the background and 30% opacity for borders, keeping the card readable in both light and dark themes.
- A standard clinical disclaimer footer is always rendered at the bottom of the card.
- The `level` value is clamped to the 1-5 range; values outside this range are normalized to the nearest valid level.
