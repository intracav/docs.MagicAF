---
title: "Table"
description: "Data table with column headers, row striping, and flag-based cell highlighting."
weight: 1
tags: [lumen-ui, table, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `Table` component renders tabular data with typed column definitions and row objects. It supports alternating row backgrounds, compact mode, horizontal scrolling for wide datasets, and automatic cell coloring based on a `flag` field in row data (useful for flagging abnormal lab values).

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | `array` | *required* | Column definitions. Each element is an object with `key` (string), `label` (string), and optional `align` (string). |
| `rows` | `array` | *required* | Row data. Each element is an object whose keys correspond to column `key` values. Supports an optional `flag` field (`"H"`, `"L"`, `"C"`) for cell coloring. |
| `striped` | `bool` | `true` | Alternate row background colors for readability. |
| `compact` | `bool` | `false` | Reduce cell padding and row height for denser display. |

## DSL Example

```
Table(
  columns=[
    {key:"test", label:"Test"},
    {key:"result", label:"Result"},
    {key:"range", label:"Reference"}
  ],
  rows=[
    {test:"WBC", result:"7.2 K/uL", range:"4.5-11.0"},
    {test:"Hgb", result:"14.1 g/dL", range:"12.0-17.5"},
    {test:"Platelets", result:"245 K/uL", range:"150-400"}
  ],
  striped=true,
  compact=false
)
```

## JSON Example

```json
{
  "type": "table",
  "props": {
    "columns": [
      {"key": "test", "label": "Test"},
      {"key": "result", "label": "Result"},
      {"key": "range", "label": "Reference"}
    ],
    "rows": [
      {"test": "WBC", "result": "7.2 K/uL", "range": "4.5-11.0"},
      {"test": "Hgb", "result": "14.1 g/dL", "range": "12.0-17.5"},
      {"test": "Platelets", "result": "245 K/uL", "range": "150-400"}
    ],
    "striped": true
  }
}
```

## Composition

A `Table` inside a `Card` with a `Stat` summary above it:

```
Card(title="Complete Blood Count",
  Stat(label="Hemoglobin", value="14.1", unit="g/dL", trend="up", change="+0.3"),
  Table(
    columns=[
      {key:"test", label:"Test"},
      {key:"result", label:"Result"},
      {key:"flag", label:"Flag"}
    ],
    rows=[
      {test:"WBC", result:"12.4 K/uL", flag:"H"},
      {test:"Hgb", result:"14.1 g/dL", flag:""},
      {test:"Platelets", result:"145 K/uL", flag:"L"}
    ],
    striped=true,
    compact=true
  )
)
```

## Notes

- **Row flags**: If a row object contains a `flag` field with value `"H"` (high), `"L"` (low), or `"C"` (critical), the cell text is colored accordingly — destructive for high/critical, info for low. This is independent of the `striped` prop.
- **Horizontal scrolling**: The table is wrapped in a horizontal `SingleChildScrollView`, so it handles datasets wider than the available viewport without overflow.
- **Column key mapping**: Each column's `key` is used to look up the corresponding value in each row object. If a row is missing a key, the cell renders as empty.
- **Empty state**: If `columns` is an empty array, the component renders nothing.
