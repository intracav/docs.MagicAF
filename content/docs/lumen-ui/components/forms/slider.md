---
title: "Slider"
description: "Numeric range slider with configurable min, max, and step."
weight: 5
tags: [lumen-ui, slider, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Slider renders a draggable track for selecting a numeric value within a defined range. It is well suited for pain scores, dosage adjustments, and any continuous or stepped numeric input where a visual position conveys magnitude. When the user releases the slider, it dispatches a `submitForm` action with the field's `id` and the selected numeric `value`.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Unique identifier used in the dispatched action payload. |
| `label` | string | — | Label text displayed above the slider. |
| `min` | number | `0` | Minimum allowed value. |
| `max` | number | `100` | Maximum allowed value. |
| `value` | number | — | Current slider position. |
| `step` | number | `1` | Increment between valid values. |
| `showValue` | bool | `true` | Whether to display the current numeric value next to the slider. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
Slider(id="pain_score", label="Pain Score (0-10)", min=0, max=10, value=5, step=1)
```

## JSON Example

```json
{
  "type": "slider",
  "props": {
    "id": "pain_score",
    "label": "Pain Score (0-10)",
    "min": 0,
    "max": 10,
    "value": 5,
    "step": 1,
    "showValue": true
  }
}
```

## Composition

```
Card(title="Sedation Assessment",
  Stack(direction="vertical", gap=16,
    Slider(id="rass", label="RASS Score", min=-5, max=4, value=0, step=1),
    Slider(id="cam_score", label="CAM-ICU Score", min=0, max=7, value=0, step=1),
    Separator(),
    Stack(direction="horizontal", gap=12,
      StatusBadge(status="success", label="No Delirium"),
      Badge(text="RASS 0: Alert and Calm", variant="default")
    )
  )
)
```

## Notes

- When `showValue` is true, the current numeric value renders inline next to the slider track, updating in real-time as the user drags.
- The `step` prop controls granularity. Use `step=0.1` for decimal precision or `step=5` for coarse adjustments.
- If `value` falls outside the `min`/`max` range, the slider clamps it to the nearest boundary.
- For clinical scoring systems (NRS, RASS, GCS), set `min`, `max`, and `step` to match the scale exactly.
