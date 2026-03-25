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

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Sparkline — Inline Trends</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Vital Signs — Last 6 Hours</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--3">
            <!-- Heart Rate -->
            <div class="lm-stack lm-stack--vertical lm-stack--gap-4">
              <div class="lm-stat">
                <span class="lm-stat__label">Heart Rate</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">72</span><span class="lm-stat__unit">bpm</span></div>
              </div>
              <div class="lm-sparkline">
                <svg class="lm-sparkline__svg" viewBox="0 0 80 24" style="width:100%;height:28px;">
                  <polyline class="lm-sparkline__line" points="0,18 13,12 27,6 40,10 53,14 67,10 80,12" stroke="#3BA55C"/>
                </svg>
              </div>
            </div>
            <!-- SpO2 -->
            <div class="lm-stack lm-stack--vertical lm-stack--gap-4">
              <div class="lm-stat">
                <span class="lm-stat__label">SpO2</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">97</span><span class="lm-stat__unit">%</span></div>
              </div>
              <div class="lm-sparkline">
                <svg class="lm-sparkline__svg" viewBox="0 0 80 24" style="width:100%;height:28px;">
                  <polygon class="lm-sparkline__area" points="0,4 13,8 27,12 40,8 53,8 67,8 80,8 80,24 0,24" fill="var(--accent)"/>
                  <polyline class="lm-sparkline__line" points="0,4 13,8 27,12 40,8 53,8 67,8 80,8"/>
                </svg>
              </div>
            </div>
            <!-- Temperature -->
            <div class="lm-stack lm-stack--vertical lm-stack--gap-4">
              <div class="lm-stat lm-stat--warning">
                <span class="lm-stat__label">Temp</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">38.2</span><span class="lm-stat__unit">&#176;C</span></div>
              </div>
              <div class="lm-sparkline">
                <svg class="lm-sparkline__svg" viewBox="0 0 80 24" style="width:100%;height:28px;">
                  <polyline class="lm-sparkline__line" points="0,22 13,18 27,14 40,10 53,6 67,2 80,0" stroke="#FAA61A"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Standalone Sparklines

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Sparkline — Variants</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
            <!-- Stable trend -->
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:12px;font-weight:600;color:var(--text-secondary);width:60px;">Stable</span>
              <div class="lm-sparkline" style="flex:1;">
                <svg class="lm-sparkline__svg" viewBox="0 0 120 24" style="width:100%;height:24px;">
                  <polyline class="lm-sparkline__line" points="0,12 15,10 30,14 45,11 60,13 75,10 90,12 105,11 120,12" stroke="#3BA55C"/>
                </svg>
              </div>
              <span style="font-size:13px;font-weight:700;color:var(--text-primary);">72 bpm</span>
            </div>
            <!-- Rising trend -->
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:12px;font-weight:600;color:var(--text-secondary);width:60px;">Rising</span>
              <div class="lm-sparkline" style="flex:1;">
                <svg class="lm-sparkline__svg" viewBox="0 0 120 24" style="width:100%;height:24px;">
                  <polyline class="lm-sparkline__line" points="0,22 15,20 30,18 45,16 60,12 75,10 90,6 105,4 120,2" stroke="#FAA61A"/>
                </svg>
              </div>
              <span style="font-size:13px;font-weight:700;color:#FAA61A;">38.4&#176;C</span>
            </div>
            <!-- Declining trend -->
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:12px;font-weight:600;color:var(--text-secondary);width:60px;">Falling</span>
              <div class="lm-sparkline" style="flex:1;">
                <svg class="lm-sparkline__svg" viewBox="0 0 120 24" style="width:100%;height:24px;">
                  <polyline class="lm-sparkline__line" points="0,4 15,6 30,8 45,10 60,12 75,14 90,18 105,20 120,22" stroke="#ED4245"/>
                </svg>
              </div>
              <span style="font-size:13px;font-weight:700;color:#ED4245;">88 mmHg</span>
            </div>
            <!-- Filled variant -->
            <div style="display:flex;align-items:center;gap:12px;">
              <span style="font-size:12px;font-weight:600;color:var(--text-secondary);width:60px;">Filled</span>
              <div class="lm-sparkline" style="flex:1;">
                <svg class="lm-sparkline__svg" viewBox="0 0 120 24" style="width:100%;height:24px;">
                  <polygon class="lm-sparkline__area" points="0,16 15,12 30,8 45,14 60,6 75,10 90,4 105,8 120,6 120,24 0,24"/>
                  <polyline class="lm-sparkline__line" points="0,16 15,12 30,8 45,14 60,6 75,10 90,4 105,8 120,6"/>
                </svg>
              </div>
              <span style="font-size:13px;font-weight:700;color:var(--text-primary);">97%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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
