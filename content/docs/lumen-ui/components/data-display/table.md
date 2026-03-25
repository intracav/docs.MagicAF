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

## Live Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Table — Complete Blood Count</span>
    </div>
    <div class="lumen-demo__content lm">
      <table class="lm-table lm-table--striped">
        <thead>
          <tr><th>Test</th><th>Result</th><th>Reference</th><th>Flag</th></tr>
        </thead>
        <tbody>
          <tr><td>WBC</td><td class="flag-h">12.4 K/uL</td><td>4.5–11.0</td><td class="flag-h">H</td></tr>
          <tr><td>RBC</td><td>4.82 M/uL</td><td>4.20–5.80</td><td></td></tr>
          <tr><td>Hemoglobin</td><td>14.1 g/dL</td><td>12.0–17.5</td><td></td></tr>
          <tr><td>Hematocrit</td><td>42.3 %</td><td>36.0–51.0</td><td></td></tr>
          <tr><td>Platelets</td><td class="flag-l">138 K/uL</td><td>150–400</td><td class="flag-l">L</td></tr>
          <tr><td>MCV</td><td>87.8 fL</td><td>80.0–100.0</td><td></td></tr>
          <tr><td>MCH</td><td>29.3 pg</td><td>27.0–33.0</td><td></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

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

## Composition Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card + Stat + Table</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header"><div class="lm-card__title">Complete Blood Count</div></div>
        <div class="lm-card__body">
          <div class="lm-stat" style="margin-bottom:16px;">
            <div class="lm-stat__label">Hemoglobin</div>
            <div class="lm-stat__value-row">
              <span class="lm-stat__value">14.1</span>
              <span class="lm-stat__unit">g/dL</span>
            </div>
            <div class="lm-stat__change lm-stat__change--up">&#9650; +0.3</div>
          </div>
          <table class="lm-table lm-table--striped lm-table--compact">
            <thead>
              <tr><th>Test</th><th>Result</th><th>Flag</th></tr>
            </thead>
            <tbody>
              <tr><td>WBC</td><td class="flag-h">12.4 K/uL</td><td class="flag-h">H</td></tr>
              <tr><td>Hgb</td><td>14.1 g/dL</td><td></td></tr>
              <tr><td>Platelets</td><td class="flag-l">145 K/uL</td><td class="flag-l">L</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- **Row flags**: If a row object contains a `flag` field with value `"H"` (high), `"L"` (low), or `"C"` (critical), the cell text is colored accordingly — destructive for high/critical, info for low. This is independent of the `striped` prop.
- **Horizontal scrolling**: The table is wrapped in a horizontal `SingleChildScrollView`, so it handles datasets wider than the available viewport without overflow.
- **Column key mapping**: Each column's `key` is used to look up the corresponding value in each row object. If a row is missing a key, the cell renders as empty.
- **Empty state**: If `columns` is an empty array, the component renders nothing.
