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

## Notes

- The `label` prop is optional. When omitted, the component automatically maps the level to its standard ESI label (Resuscitation, Emergent, Urgent, Less Urgent, Non-Urgent).
- The acuity banner uses the level's color at 10% opacity for the background and 30% opacity for borders, keeping the card readable in both light and dark themes.
- A standard clinical disclaimer footer is always rendered at the bottom of the card.
- The `level` value is clamped to the 1-5 range; values outside this range are normalized to the nearest valid level.
