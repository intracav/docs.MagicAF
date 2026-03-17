---
title: "PieChart"
description: "Pie or donut chart for proportional distribution of categorical data."
weight: 4
tags: [lumen-ui, pie-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

PieChart renders categorical data as proportional segments of a circle. Set `donut=true` to render as a donut chart with a hollow center. Best used when showing how parts relate to a whole — referral distributions, diagnosis breakdowns, resource allocation.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `array<{label, value}>` | *required* | Array of objects, each with a `label` (string) and `value` (number). Values are normalized to percentages automatically. |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |
| `donut` | `bool` | `false` | When `true`, renders as a donut chart with a hollow center. |

## DSL Example

```
PieChart(
  data=[
    {label:"Cardiology", value:35},
    {label:"Neurology", value:25},
    {label:"Orthopedics", value:20},
    {label:"Other", value:20}
  ],
  title="Referral Distribution",
  donut=true
)
```

## JSON Example

```json
{
  "type": "pie_chart",
  "props": {
    "data": [
      {"label": "Cardiology", "value": 35},
      {"label": "Neurology", "value": 25},
      {"label": "Orthopedics", "value": 20},
      {"label": "Other", "value": 20}
    ],
    "title": "Referral Distribution",
    "donut": true
  }
}
```

## Composition

A donut chart paired with a legend-style breakdown inside a split layout:

```
Card(title="Payer Mix — Q1 2026",
  SplitView(ratio=0.5,
    PieChart(
      data=[
        {label:"Commercial", value:42},
        {label:"Medicare", value:28},
        {label:"Medicaid", value:18},
        {label:"Self-Pay", value:8},
        {label:"Other", value:4}
      ],
      donut=true,
      height=220
    ),
    Stack(direction="vertical", gap=8,
      Stat(label="Commercial", value="42%"),
      Stat(label="Medicare", value="28%"),
      Stat(label="Medicaid", value="18%"),
      Stat(label="Self-Pay", value="8%"),
      Stat(label="Other", value="4%")
    )
  )
)
```

## Notes

- Segment colors are assigned from the theme's `chartColors` palette in array order.
- Values do not need to sum to 100 — the chart normalizes values into proportional segments automatically.
- Tapping a segment highlights it and displays a tooltip with the label, value, and computed percentage.
- The donut variant is generally preferred for dashboards because the hollow center can accommodate a summary label or total.
- Limit data to roughly 7 or fewer segments for readability. Consolidate smaller categories into an "Other" group.
