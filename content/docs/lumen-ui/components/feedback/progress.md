---
title: "Progress"
description: "Progress bar for visualizing completion percentage."
weight: 4
tags: [lumen-ui, progress, feedback]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Progress renders a horizontal bar that fills proportionally to a given value, visualizing completion or capacity. Use it for treatment progress, protocol adherence rates, task completion, or any metric expressed as a percentage of a known total.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | number | — | **Required.** Current progress as a percentage (0-100). |
| `label` | string | — | Descriptive text displayed above the progress bar. |
| `variant` | `"default"` \| `"success"` \| `"warning"` \| `"error"` | `"default"` | Controls the fill color. `default` is the primary accent. `success` is green. `warning` is amber. `error` is red. |
| `showPercentage` | bool | `true` | Whether to display the numeric percentage next to the bar. |
| `height` | number | — | Height of the bar in logical pixels. Defaults to a standard size when omitted. |

**Children:** No.

## DSL Example

```
Progress(value=75, label="Treatment Progress", variant="success", showPercentage=true)
```

## JSON Example

```json
{
  "type": "progress",
  "props": {
    "value": 75,
    "label": "Treatment Progress",
    "variant": "success",
    "showPercentage": true
  }
}
```

## Composition

```
Card(title="Chemotherapy Protocol — Cycle 3 of 6",
  Stack(direction="vertical", gap=16,
    Progress(value=50, label="Overall Protocol Completion", variant="default"),
    Separator(),
    Stack(direction="vertical", gap=8,
      Progress(value=100, label="Day 1 — Cisplatin", variant="success"),
      Progress(value=100, label="Day 2 — Etoposide", variant="success"),
      Progress(value=60, label="Day 3 — Etoposide (in progress)", variant="warning"),
      Progress(value=0, label="Day 4 — Rest"),
      Progress(value=0, label="Day 5 — Labs")
    ),
    Separator(),
    Alert(title="On Track", message="Patient tolerating therapy well. No dose modifications required.", variant="success")
  )
)
```

## Notes

- The `value` prop is clamped to the 0-100 range. Values below 0 render as empty; values above 100 render as full.
- Use `variant` to encode meaning: `success` for completed or on-track, `warning` for approaching a threshold, `error` for off-track or critical.
- When `showPercentage` is false, only the bar is rendered — useful when the percentage is already displayed elsewhere or when the visual proportion is sufficient.
- The `height` prop allows thicker bars for prominence or thinner bars for compact layouts. If omitted, the renderer uses a default height appropriate for the current context.
