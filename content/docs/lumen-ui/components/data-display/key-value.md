---
title: "KeyValue"
description: "Displays key-value pairs in stacked or inline layout with optional separators."
weight: 2
tags: [lumen-ui, key-value, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `KeyValue` component renders a list of label-value pairs. It supports two layout modes: `stacked` (label above value) and `inline` (label and value side by side), with an optional divider between items. Commonly used for patient demographics, encounter details, and configuration summaries.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `array` | *required* | Array of objects, each with `key` (string) and `value` (string). |
| `layout` | `enum` | `"stacked"` | Display layout. Options: `stacked` (label above value), `inline` (label and value in a row with fixed-width label column). |
| `separator` | `bool` | `false` | Show a horizontal divider between items. |

## DSL Example

```
KeyValue(
  items=[
    {key:"Name", value:"Jane Doe"},
    {key:"DOB", value:"1985-04-12"},
    {key:"MRN", value:"MRN-00412389"},
    {key:"Insurance", value:"Blue Cross PPO"}
  ],
  layout="inline",
  separator=true
)
```

## JSON Example

```json
{
  "type": "key_value",
  "props": {
    "items": [
      {"key": "Name", "value": "Jane Doe"},
      {"key": "DOB", "value": "1985-04-12"},
      {"key": "MRN", "value": "MRN-00412389"},
      {"key": "Insurance", "value": "Blue Cross PPO"}
    ],
    "layout": "inline",
    "separator": true
  }
}
```

## Composition

Patient demographics card using `KeyValue` alongside a `Badge`:

```
Card(title="Patient Demographics",
  KeyValue(
    items=[
      {key:"Full Name", value:"Jane Doe"},
      {key:"Date of Birth", value:"April 12, 1985"},
      {key:"Sex", value:"Female"},
      {key:"Primary Phone", value:"(555) 012-3456"}
    ],
    layout="stacked",
    separator=true
  ),
  Badge(text="Verified", variant="success")
)
```

## Notes

- **Inline label width**: In `inline` mode, the label column has a fixed width of 120px. Values fill the remaining space.
- **Stacked spacing**: In `stacked` mode, items are separated by 8px of vertical space (or by a divider if `separator` is true).
- **Type name**: The JSON `type` field is `key_value` (snake_case), matching the DSL name `KeyValue`.
- **Empty state**: If `items` is an empty array, the component renders nothing.
