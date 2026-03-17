---
title: "AreaChart"
description: "Filled area chart — line chart variant with shaded regions beneath each series."
weight: 3
tags: [lumen-ui, area-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

AreaChart renders one or more data series as lines with filled regions beneath them. It shares the same data shape as LineChart but adds visual emphasis to the magnitude of values. Supports stacked mode for part-to-whole comparisons over time.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `series` | `array<{label, data: [{x, y}]}>` | *required* | Array of series objects. Each has a `label` (string) and `data` (array of `{x, y}` number pairs). |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |
| `stacked` | `bool` | `false` | When `true`, series are stacked on top of each other rather than overlapping. |

## DSL Example

```
AreaChart(
  series=[
    {label:"Systolic", data:[{x:0,y:120},{x:1,y:125},{x:2,y:118},{x:3,y:122},{x:4,y:119}]},
    {label:"Diastolic", data:[{x:0,y:80},{x:1,y:82},{x:2,y:78},{x:3,y:81},{x:4,y:79}]}
  ],
  title="Blood Pressure Trend",
  stacked=false
)
```

## JSON Example

```json
{
  "type": "area_chart",
  "props": {
    "series": [
      {
        "label": "Systolic",
        "data": [
          {"x": 0, "y": 120},
          {"x": 1, "y": 125},
          {"x": 2, "y": 118},
          {"x": 3, "y": 122},
          {"x": 4, "y": 119}
        ]
      },
      {
        "label": "Diastolic",
        "data": [
          {"x": 0, "y": 80},
          {"x": 1, "y": 82},
          {"x": 2, "y": 78},
          {"x": 3, "y": 81},
          {"x": 4, "y": 79}
        ]
      }
    ],
    "title": "Blood Pressure Trend",
    "stacked": false
  }
}
```

## Composition

A stacked area chart showing resource utilization inside a dashboard section:

```
Card(title="ICU Resource Utilization",
  Stack(direction="vertical", gap=12,
    AreaChart(
      series=[
        {label:"Ventilators", data:[{x:0,y:12},{x:4,y:14},{x:8,y:18},{x:12,y:15},{x:16,y:13},{x:20,y:16},{x:24,y:14}]},
        {label:"Monitors", data:[{x:0,y:20},{x:4,y:22},{x:8,y:25},{x:12,y:23},{x:16,y:21},{x:20,y:24},{x:24,y:22}]},
        {label:"Infusion Pumps", data:[{x:0,y:30},{x:4,y:28},{x:8,y:35},{x:12,y:32},{x:16,y:29},{x:20,y:33},{x:24,y:31}]}
      ],
      title="24-Hour Equipment In Use",
      stacked=true,
      height=250
    ),
    Separator(),
    Grid(columns=3,
      Stat(label="Ventilators", value="14", unit="active"),
      Stat(label="Monitors", value="22", unit="active"),
      Stat(label="Pumps", value="31", unit="active")
    )
  )
)
```

## Notes

- Fill color is derived from the series line color at reduced opacity (approximately 20%).
- In stacked mode, series are rendered bottom-to-top in array order — the first series sits at the base.
- Like LineChart, lines use cubic bezier interpolation by default. The fill tracks the curve.
- The legend appears automatically when more than one series is present.
- Use non-stacked mode when series operate on different scales (e.g., systolic vs. diastolic). Use stacked mode when series represent parts of a total (e.g., resource categories).
