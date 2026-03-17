---
title: "Sparkline"
description: "Compact inline trend line designed for embedding in stats, cards, or table cells."
weight: 8
tags: [lumen-ui, sparkline, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Sparkline renders a minimal trend line from a flat array of numbers. It has no axes, labels, or gridlines — just the shape of the data. Designed to be embedded inline alongside text, stats, or inside table cells where a full chart would be too heavy but the trend direction is valuable context.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `array<number>` | *required* | Array of numeric values plotted left to right. |
| `width` | `number` | — | Chart width in logical pixels. When omitted, the sparkline expands to fill available horizontal space. |
| `height` | `number` | `40` | Chart height in logical pixels. |
| `color` | `string` | — | Line color. Accepts semantic names (`"success"`, `"warning"`, `"destructive"`) or hex values. Defaults to the theme's primary color. |
| `filled` | `bool` | `false` | When `true`, fills the area beneath the line with the line color at reduced opacity. |

## DSL Example

```
Sparkline(
  data=[72, 75, 68, 71, 74, 72, 70],
  height=32,
  filled=true
)
```

## JSON Example

```json
{
  "type": "sparkline",
  "props": {
    "data": [72, 75, 68, 71, 74, 72, 70],
    "height": 32,
    "filled": true
  }
}
```

## Composition

Sparklines embedded in a stats grid to show trend context for each metric:

```
Card(title="Vital Signs — Last 6 Hours",
  Grid(columns=3,
    Stack(direction="vertical", gap=4,
      Stat(label="Heart Rate", value="72", unit="bpm"),
      Sparkline(data=[68, 71, 74, 72, 70, 72], height=28, color="success")
    ),
    Stack(direction="vertical", gap=4,
      Stat(label="SpO2", value="97", unit="%"),
      Sparkline(data=[98, 97, 96, 97, 97, 97], height=28, filled=true)
    ),
    Stack(direction="vertical", gap=4,
      Stat(label="Temp", value="38.2", unit="C"),
      Sparkline(data=[37.0, 37.2, 37.5, 37.8, 38.0, 38.2], height=28, color="warning")
    )
  )
)
```

## Notes

- Sparklines are non-interactive — they do not display tooltips or respond to taps. Use LineChart or AreaChart when interactivity is needed.
- The y-axis range is derived automatically from the data's min and max values.
- Data is plotted left to right with equal spacing between points regardless of count.
- When `width` is omitted, the sparkline uses `Expanded` layout behavior and fills the available width of its parent container.
- The `filled` variant is useful for adding visual weight in dense layouts where the line alone may be too subtle.
- Use semantic color names (`"success"`, `"warning"`, `"destructive"`) to tie the sparkline to clinical significance rather than arbitrary styling.
