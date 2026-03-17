---
title: "Steps"
description: "Numbered step indicator for wizard flows and multi-stage processes."
weight: 6
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Steps renders a numbered progress indicator for multi-stage workflows. Each step displays a title, an optional description, and a status (pending, active, completed, or error). Use Steps to show where a patient is in a clinical pathway, the progress of a prior authorization request, or the stages of a diagnostic workup.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | array of objects | — | **Required.** Each object has: `title` (string, required), `description` (string, optional), `status` (string, optional). |
| `current` | number | — | Zero-based index of the currently active step. If provided, this overrides individual `status` values — steps before `current` are marked completed, the step at `current` is active, and steps after are pending. |

### Step Status Values

| Status | Appearance |
|--------|------------|
| `"pending"` | Dimmed circle with step number. |
| `"active"` | Highlighted circle with step number, bold title. |
| `"completed"` | Filled circle with checkmark. |
| `"error"` | Red circle with exclamation mark. |

**Children:** No. Steps is a self-contained data-driven component.

## DSL Example

```
Steps(
  items=[
    {title:"Patient Intake", description:"Demographics and insurance", status:"completed"},
    {title:"Clinical Assessment", description:"Vitals and chief complaint", status:"active"},
    {title:"Diagnostic Orders", description:"Labs and imaging", status:"pending"},
    {title:"Treatment Plan", status:"pending"}
  ],
  current=1
)
```

## JSON Example

```json
{
  "type": "steps",
  "props": {
    "current": 1,
    "items": [
      {"title": "Patient Intake", "description": "Demographics and insurance", "status": "completed"},
      {"title": "Clinical Assessment", "description": "Vitals and chief complaint", "status": "active"},
      {"title": "Diagnostic Orders", "description": "Labs and imaging", "status": "pending"},
      {"title": "Treatment Plan", "status": "pending"}
    ]
  }
}
```

## Composition

```
Card(title="Prior Authorization Workflow",
  Stack(direction="vertical", gap=16,
    Steps(
      items=[
        {title:"Submit Request", status:"completed"},
        {title:"Clinical Review", description:"Peer-to-peer if needed", status:"completed"},
        {title:"Insurance Decision", status:"active"},
        {title:"Notification", description:"Patient and provider notified", status:"pending"}
      ],
      current=2
    ),
    Separator(),
    Alert(
      title="Awaiting Decision",
      message="Aetna clinical review completed. Decision expected within 48 hours.",
      variant="info"
    )
  )
)
```

## Notes

- When `current` is provided, it takes precedence over individual `status` fields. This makes it easy to advance the indicator by changing a single number.
- If neither `current` nor individual `status` values are provided, all steps default to `"pending"`.
- Steps renders horizontally on wide viewports and vertically on narrow viewports.
- The `error` status is useful for indicating a step that failed or was rejected — for example, a denied prior authorization.
- Steps is display-only. It does not support click-to-navigate behavior.
