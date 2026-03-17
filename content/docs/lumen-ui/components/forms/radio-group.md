---
title: "RadioGroup"
description: "Radio button group for single selection from multiple options."
weight: 4
tags: [lumen-ui, radio-group, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

RadioGroup renders a set of mutually exclusive radio buttons under a shared label. Exactly one option can be selected at a time. When the selection changes, RadioGroup dispatches a `submitForm` action with the group's `id` and the selected `value`.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Unique identifier used in the dispatched action payload. |
| `label` | string | — | Group label displayed above the radio buttons. |
| `options` | array | — | **Required.** Array of strings or `{label, value}` objects defining the available choices. |
| `value` | string | — | Currently selected value. |
| `disabled` | bool | `false` | When true, all radio buttons are non-interactive. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
RadioGroup(id="severity", label="Pain Severity", options=["Mild","Moderate","Severe","Critical"], value="Moderate")
```

## JSON Example

```json
{
  "type": "radio_group",
  "props": {
    "id": "severity",
    "label": "Pain Severity",
    "options": ["Mild", "Moderate", "Severe", "Critical"],
    "value": "Moderate"
  }
}
```

Using `{label, value}` objects:

```json
{
  "type": "radio_group",
  "props": {
    "id": "laterality",
    "label": "Laterality",
    "options": [
      {"label": "Left", "value": "L"},
      {"label": "Right", "value": "R"},
      {"label": "Bilateral", "value": "B"},
      {"label": "Not Applicable", "value": "NA"}
    ]
  }
}
```

## Composition

```
Card(title="Pain Assessment",
  Stack(direction="vertical", gap=16,
    RadioGroup(id="pain_type", label="Pain Type", options=["Acute","Chronic","Neuropathic","Referred"]),
    RadioGroup(id="severity", label="Severity", options=["Mild","Moderate","Severe","Critical"], value="Moderate"),
    Slider(id="pain_score", label="NRS Pain Score (0-10)", min=0, max=10, value=5, step=1),
    TextArea(id="pain_description", label="Description", placeholder="Location, quality, aggravating/relieving factors...")
  )
)
```

## Notes

- RadioGroup enforces single selection. For independent multi-select, use multiple Checkbox components instead.
- Like Select, `options` can be strings or `{label, value}` objects. Use objects when the display text differs from the submitted value.
- If `value` does not match any option, no radio button is pre-selected.
- The JSON type is `radio_group` (snake_case), matching the DSL name `RadioGroup` (PascalCase).
