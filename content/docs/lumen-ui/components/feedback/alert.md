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

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Alert Variants</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-alert lm-alert--info">
<span class="lm-alert__icon">&#9432;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">New Lab Results Available</div>
<div class="lm-alert__message">CBC and BMP results from 03/21 are ready for review.</div>
</div>
</div>

<div class="lm-alert lm-alert--warning">
<span class="lm-alert__icon">&#9888;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Drug Interaction Detected</div>
<div class="lm-alert__message">Lisinopril + Potassium may cause hyperkalemia. Monitor serum K+ levels.</div>
</div>
</div>

<div class="lm-alert lm-alert--error">
<span class="lm-alert__icon">&#10005;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Allergy Contraindication</div>
<div class="lm-alert__message">Patient has documented penicillin allergy. Amoxicillin is contraindicated.</div>
</div>
</div>

<div class="lm-alert lm-alert--success">
<span class="lm-alert__icon">&#10003;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Interaction Check Complete</div>
<div class="lm-alert__message">No additional interactions found for current medication list.</div>
</div>
<button class="lm-alert__dismiss" aria-label="Dismiss">&times;</button>
</div>

</div>
</div>
</div>
</div>

> **Try it** — Click the **&times;** button on the success alert to dismiss it.

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Prescription Review</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Prescription Review</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-alert lm-alert--error">
<span class="lm-alert__icon">&#10005;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Allergy Warning</div>
<div class="lm-alert__message">Patient has documented penicillin allergy. Amoxicillin is contraindicated.</div>
</div>
</div>

<div class="lm-alert lm-alert--warning">
<span class="lm-alert__icon">&#9888;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Renal Dosing Required</div>
<div class="lm-alert__message">eGFR 38 mL/min — adjust metformin dose per renal guidelines.</div>
</div>
</div>

<table class="lm-table">
<thead><tr><th>Medication</th><th>Dose</th><th>Route</th><th>Frequency</th></tr></thead>
<tbody>
<tr><td>Lisinopril</td><td>10mg</td><td>PO</td><td>Daily</td></tr>
<tr><td>Metformin</td><td>500mg</td><td>PO</td><td>BID</td></tr>
<tr><td>Atorvastatin</td><td>20mg</td><td>PO</td><td>QHS</td></tr>
</tbody>
</table>

<div class="lm-alert lm-alert--success">
<span class="lm-alert__icon">&#10003;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Interaction Check Complete</div>
<div class="lm-alert__message">No additional interactions found.</div>
</div>
<button class="lm-alert__dismiss" aria-label="Dismiss">&times;</button>
</div>

</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- Alert is a leaf component — it does not accept children. For a similar component that supports rich child content, use Callout instead.
- The `dismissible` prop adds a close button. Dismissal is handled entirely within the renderer and does not dispatch an action to the host application.
- Alerts render with a left border accent in the variant color, a tinted background, and an appropriate icon (info circle, warning triangle, error octagon, or success checkmark).
- Use `variant="error"` sparingly — reserve it for genuine errors and contraindications, not general cautions.
