---
title: "BarChart"
description: "Categorical bar chart for comparing discrete values across groups."
weight: 1
tags: [lumen-ui, bar-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

BarChart renders a categorical bar chart from an array of label/value pairs. Use it to compare discrete categories — departments, time periods, diagnosis codes, or any grouping where each bar represents a single value. Supports vertical (default) and horizontal orientations.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `array<{label, value}>` | *required* | Array of objects, each with a `label` (string) and `value` (number). |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |
| `horizontal` | `bool` | `false` | When `true`, bars render horizontally with labels on the y-axis. |

## DSL Example

```
BarChart(
  data=[
    {label:"Q1", value:42},
    {label:"Q2", value:58},
    {label:"Q3", value:35},
    {label:"Q4", value:61}
  ],
  title="Quarterly Admissions",
  height=250
)
```

## JSON Example

```json
{
  "type": "bar_chart",
  "props": {
    "data": [
      {"label": "Q1", "value": 42},
      {"label": "Q2", "value": 58},
      {"label": "Q3", "value": 35},
      {"label": "Q4", "value": 61}
    ],
    "title": "Quarterly Admissions",
    "height": 250
  }
}
```

## Composition

A bar chart inside a dashboard card alongside a stat:

```
Card(title="Department Overview",
  Stack(direction="vertical", gap=16,
    Stat(label="Total Admissions", value="196", trend="up", change="+12%"),
    BarChart(
      data=[
        {label:"Cardiology", value:52},
        {label:"Neurology", value:38},
        {label:"Orthopedics", value:47},
        {label:"Oncology", value:59}
      ],
      title="Admissions by Department",
      height=200
    )
  )
)
```

## Notes

- Chart bar colors are assigned automatically from the theme's `chartColors` palette in order.
- The `horizontal` orientation is useful when category labels are long (e.g., full diagnosis names).
- Zero and negative values are supported; negative bars extend below/left of the axis.
- The chart is touch-interactive — tapping a bar shows a tooltip with the exact value.
