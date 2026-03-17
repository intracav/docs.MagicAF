---
title: "ScatterChart"
description: "Scatter plot for correlation analysis between two continuous variables."
weight: 6
tags: [lumen-ui, scatter-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

ScatterChart plots individual data points on a two-dimensional plane, revealing relationships, clusters, and outliers between two continuous variables. Supports multiple series for comparing distinct populations or groups side by side.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `series` | `array<{label, data: [{x, y}]}>` | *required* | Array of series objects. Each has a `label` (string) and `data` (array of `{x, y}` number pairs). |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |
| `xLabel` | `string` | — | Label for the x-axis. |
| `yLabel` | `string` | — | Label for the y-axis. |

## DSL Example

```
ScatterChart(
  series=[
    {label:"Patients", data:[
      {x:45, y:120}, {x:62, y:135}, {x:38, y:118},
      {x:55, y:128}, {x:71, y:142}, {x:48, y:122},
      {x:33, y:110}, {x:59, y:131}, {x:67, y:138}
    ]}
  ],
  title="Age vs Systolic BP",
  xLabel="Age",
  yLabel="Systolic BP"
)
```

## JSON Example

```json
{
  "type": "scatter_chart",
  "props": {
    "series": [
      {
        "label": "Patients",
        "data": [
          {"x": 45, "y": 120},
          {"x": 62, "y": 135},
          {"x": 38, "y": 118},
          {"x": 55, "y": 128},
          {"x": 71, "y": 142},
          {"x": 48, "y": 122},
          {"x": 33, "y": 110},
          {"x": 59, "y": 131},
          {"x": 67, "y": 138}
        ]
      }
    ],
    "title": "Age vs Systolic BP",
    "x_label": "Age",
    "y_label": "Systolic BP"
  }
}
```

## Composition

A scatter plot comparing two cohorts inside a research results card:

```
Card(title="BMI vs. HbA1c — Study Cohorts",
  Stack(direction="vertical", gap=16,
    ScatterChart(
      series=[
        {label:"Treatment", data:[
          {x:24, y:5.8}, {x:28, y:6.2}, {x:31, y:6.5},
          {x:26, y:5.9}, {x:33, y:6.8}, {x:29, y:6.1}
        ]},
        {label:"Control", data:[
          {x:25, y:6.4}, {x:29, y:7.1}, {x:32, y:7.5},
          {x:27, y:6.7}, {x:34, y:7.8}, {x:30, y:7.0}
        ]}
      ],
      title="BMI vs. HbA1c",
      xLabel="BMI (kg/m2)",
      yLabel="HbA1c (%)",
      height=280
    ),
    Separator(),
    Grid(columns=2,
      Stat(label="Treatment Mean HbA1c", value="6.2%"),
      Stat(label="Control Mean HbA1c", value="7.1%")
    )
  )
)
```

## Notes

- Each series is rendered with a distinct color from the theme's `chartColors` palette.
- Tapping a data point shows a tooltip with the series label and the exact x/y coordinates.
- Axis ranges are computed automatically from the data extents with padding.
- In JSON format, prop names use snake_case: `x_label` and `y_label`. In the DSL, use camelCase: `xLabel` and `yLabel`. The parser normalizes both.
- The legend appears automatically when more than one series is present.
- For large datasets (100+ points), consider reducing point size or grouping into summary statistics for readability.
