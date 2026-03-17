---
title: "Alert"
description: "Alert banner with variant-based styling for info, warning, error, and success states."
weight: 1
tags: [lumen-ui, alert, feedback]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Alert renders a prominent banner for communicating important information, warnings, errors, or success confirmations. Each variant applies a distinct color scheme — blue for info, amber for warning, red for error, green for success. Alerts are commonly used to surface drug interaction warnings, contraindication notices, or confirmation messages within clinical artifacts.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | — | **Required.** Bold heading text for the alert. |
| `message` | string | — | Body text with additional detail, displayed below the title. |
| `variant` | `"info"` \| `"warning"` \| `"error"` \| `"success"` | `"info"` | Controls the color scheme and icon. |
| `dismissible` | bool | `false` | When true, a close button is rendered. Dismissal dispatches a UI-level hide — no action is sent to the host. |

**Children:** No.

## DSL Example

```
Alert(title="Drug Interaction Detected", message="Lisinopril + Potassium may cause hyperkalemia", variant="warning")
```

## JSON Example

```json
{
  "type": "alert",
  "props": {
    "title": "Drug Interaction Detected",
    "message": "Lisinopril + Potassium may cause hyperkalemia",
    "variant": "warning"
  }
}
```

## Composition

```
Card(title="Prescription Review",
  Stack(direction="vertical", gap=12,
    Alert(title="Allergy Warning", message="Patient has documented penicillin allergy. Amoxicillin is contraindicated.", variant="error"),
    Alert(title="Renal Dosing Required", message="eGFR 38 mL/min — adjust metformin dose per renal guidelines.", variant="warning"),
    Separator(),
    Table(
      columns=[
        {key:"medication", label:"Medication"},
        {key:"dose", label:"Dose"},
        {key:"route", label:"Route"},
        {key:"frequency", label:"Frequency"}
      ],
      rows=[
        {medication:"Lisinopril", dose:"10mg", route:"PO", frequency:"Daily"},
        {medication:"Metformin", dose:"500mg", route:"PO", frequency:"BID"},
        {medication:"Atorvastatin", dose:"20mg", route:"PO", frequency:"QHS"}
      ]
    ),
    Alert(title="Interaction Check Complete", message="No additional interactions found.", variant="success", dismissible=true)
  )
)
```

## Notes

- Alert is a leaf component — it does not accept children. For a similar component that supports rich child content, use Callout instead.
- The `dismissible` prop adds a close button. Dismissal is handled entirely within the renderer and does not dispatch an action to the host application.
- Alerts render with a left border accent in the variant color, a tinted background, and an appropriate icon (info circle, warning triangle, error octagon, or success checkmark).
- Use `variant="error"` sparingly — reserve it for genuine errors and contraindications, not general cautions.
