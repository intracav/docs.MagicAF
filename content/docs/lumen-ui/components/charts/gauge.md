---
title: "Gauge"
description: "Semi-circular gauge for single-value display with configurable thresholds."
weight: 7
tags: [lumen-ui, gauge, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Gauge renders a semi-circular arc representing a single value within a defined range. Configurable thresholds allow color-coded zones — normal, warning, and critical — making it ideal for vital signs, compliance scores, and real-time metrics where the relationship between the current value and acceptable bounds matters.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `number` | *required* | The current value to display on the gauge. |
| `min` | `number` | `0` | Minimum value (left end of the arc). |
| `max` | `number` | `100` | Maximum value (right end of the arc). |
| `label` | `string` | — | Text label displayed below the value. |
| `unit` | `string` | — | Unit suffix displayed alongside the value (e.g., `%`, `bpm`). |
| `thresholds` | `array<{value, color}>` | — | Array of threshold objects defining color-change boundaries. `color` accepts semantic names: `"success"`, `"warning"`, `"destructive"`, or hex values. |

## DSL Example

```
Gauge(
  value=98,
  min=90,
  max=100,
  label="SpO2",
  unit="%",
  thresholds=[
    {value:95, color:"warning"},
    {value:92, color:"destructive"}
  ]
)
```

## JSON Example

```json
{
  "type": "gauge",
  "props": {
    "value": 98,
    "min": 90,
    "max": 100,
    "label": "SpO2",
    "unit": "%",
    "thresholds": [
      {"value": 95, "color": "warning"},
      {"value": 92, "color": "destructive"}
    ]
  }
}
```

## Composition

A row of gauges inside a vitals monitoring dashboard:

```
Card(title="Patient Vitals — Room 412",
  Grid(columns=3,
    Gauge(
      value=98,
      min=90, max=100,
      label="SpO2", unit="%",
      thresholds=[{value:95, color:"warning"}, {value:92, color:"destructive"}]
    ),
    Gauge(
      value=72,
      min=40, max=180,
      label="Heart Rate", unit="bpm",
      thresholds=[{value:100, color:"warning"}, {value:120, color:"destructive"}]
    ),
    Gauge(
      value=37.1,
      min=35, max=42,
      label="Temperature", unit="C",
      thresholds=[{value:38.0, color:"warning"}, {value:39.0, color:"destructive"}]
    )
  )
)
```

## Notes

- Thresholds define the **boundaries** where color changes. The gauge arc color is determined by which zone the current `value` falls into.
- Threshold evaluation works downward: the arc is `"destructive"` if the value is at or below the destructive threshold, `"warning"` if at or below the warning threshold, and the default theme color otherwise. This convention suits metrics like SpO2 where lower is worse.
- For metrics where higher is worse (e.g., temperature, heart rate), list thresholds in ascending order — the gauge applies the first threshold the value exceeds.
- If no `thresholds` are provided, the gauge uses the theme's primary color throughout.
- The current value is rendered as large centered text inside the arc, with the `unit` as a suffix and the `label` beneath.
- Values outside the `min`/`max` range are clamped to the arc endpoints.
