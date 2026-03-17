---
title: "LineChart"
description: "Trend line chart with one or more series for continuous data over time."
weight: 2
tags: [lumen-ui, line-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

LineChart renders one or more data series as trend lines on a shared axis. Each series is an independent line with its own label and color, making it well suited for tracking vitals, lab values, or any metric over time.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `series` | `array<{label, data: [{x, y}]}>` | *required* | Array of series objects. Each has a `label` (string) and `data` (array of `{x, y}` number pairs). |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |
| `curved` | `bool` | `true` | When `true`, lines use cubic bezier interpolation. When `false`, lines connect points with straight segments. |

## DSL Example

```
LineChart(
  series=[
    {label:"HR", data:[{x:0,y:72},{x:1,y:75},{x:2,y:68},{x:3,y:71},{x:4,y:74}]},
    {label:"SpO2", data:[{x:0,y:98},{x:1,y:97},{x:2,y:99},{x:3,y:98},{x:4,y:97}]}
  ],
  title="Vital Trends",
  height=280,
  curved=true
)
```

## JSON Example

```json
{
  "type": "line_chart",
  "props": {
    "series": [
      {
        "label": "HR",
        "data": [
          {"x": 0, "y": 72},
          {"x": 1, "y": 75},
          {"x": 2, "y": 68},
          {"x": 3, "y": 71},
          {"x": 4, "y": 74}
        ]
      },
      {
        "label": "SpO2",
        "data": [
          {"x": 0, "y": 98},
          {"x": 1, "y": 97},
          {"x": 2, "y": 99},
          {"x": 3, "y": 98},
          {"x": 4, "y": 97}
        ]
      }
    ],
    "title": "Vital Trends",
    "height": 280,
    "curved": true
  }
}
```

## Composition

Multiple vital trend lines inside a tabbed dashboard:

```
Tabs(labels=["Trends", "Summary"],
  Card(title="48-Hour Vitals",
    LineChart(
      series=[
        {label:"Heart Rate", data:[{x:0,y:72},{x:6,y:78},{x:12,y:74},{x:18,y:70},{x:24,y:73},{x:30,y:76},{x:36,y:71},{x:42,y:69},{x:48,y:72}]},
        {label:"Resp Rate", data:[{x:0,y:16},{x:6,y:18},{x:12,y:17},{x:18,y:15},{x:24,y:16},{x:30,y:19},{x:36,y:17},{x:42,y:16},{x:48,y:16}]}
      ],
      title="Heart Rate & Respiratory Rate",
      height=250
    )
  ),
  Card(title="Summary",
    Grid(columns=2,
      Stat(label="Avg HR", value="73", unit="bpm"),
      Stat(label="Avg RR", value="17", unit="/min")
    )
  )
)
```

## Notes

- Each series receives a distinct color from the theme's `chartColors` palette.
- The legend is displayed automatically when more than one series is present.
- Data points do not need to share the same x-values across series; each series is plotted independently.
- Tapping a data point shows a tooltip with the series label and exact x/y values.
- Set `curved=false` for step-like data (e.g., discrete readings at intervals) where interpolation would be misleading.
