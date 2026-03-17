---
title: "RadarChart"
description: "Spider/radar chart for multi-axis comparison across two or more series."
weight: 5
tags: [lumen-ui, radar-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

RadarChart (also known as a spider chart) plots multiple variables on axes radiating from a shared center, connecting values to form a polygon. It is effective for comparing two or more profiles across the same set of dimensions — baseline vs. follow-up assessments, treatment outcomes, or multi-domain scoring rubrics.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `axes` | `array<string>` | *required* | Labels for each axis, rendered around the perimeter. |
| `series` | `array<{label, data: [number]}>` | *required* | Array of series objects. Each has a `label` (string) and `data` (array of numbers). Each `data` array must have the same length as `axes`. |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |

## DSL Example

```
RadarChart(
  axes=["Pain", "Mobility", "Sleep", "Mood", "Energy"],
  series=[
    {label:"Baseline", data:[8, 3, 4, 3, 2]},
    {label:"Week 4", data:[4, 6, 7, 6, 5]}
  ],
  title="Symptom Assessment"
)
```

## JSON Example

```json
{
  "type": "radar_chart",
  "props": {
    "axes": ["Pain", "Mobility", "Sleep", "Mood", "Energy"],
    "series": [
      {
        "label": "Baseline",
        "data": [8, 3, 4, 3, 2]
      },
      {
        "label": "Week 4",
        "data": [4, 6, 7, 6, 5]
      }
    ],
    "title": "Symptom Assessment"
  }
}
```

## Composition

A radar chart comparing pre- and post-treatment scores inside a clinical report:

```
Card(title="Functional Assessment — Patient #4821",
  Stack(direction="vertical", gap=16,
    Alert(title="Improvement Detected", message="Overall functional score improved by 38% over 4 weeks.", variant="success"),
    RadarChart(
      axes=["ADLs", "Cognition", "Balance", "Strength", "Endurance", "Pain Mgmt"],
      series=[
        {label:"Admission", data:[3, 5, 2, 3, 2, 4]},
        {label:"Discharge", data:[7, 6, 6, 7, 5, 7]}
      ],
      title="Functional Domains",
      height=320
    ),
    Grid(columns=2,
      Stat(label="Admission Score", value="19/60"),
      Stat(label="Discharge Score", value="38/60", trend="up", change="+100%")
    )
  )
)
```

## Notes

- Each series polygon is filled with its assigned color at reduced opacity, with the outline rendered at full opacity.
- The axis scale is determined automatically from the maximum value across all series and axes.
- Every `data` array must have exactly as many entries as the `axes` array. Mismatched lengths will result in a rendering error.
- Radar charts work best with 4 to 8 axes. Fewer than 4 produces a visually ambiguous shape; more than 8 becomes hard to read.
- The legend appears automatically when more than one series is present.
