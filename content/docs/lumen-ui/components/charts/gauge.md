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

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Gauge — SpO2 Monitor</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">SpO2 Monitor</div>
          <div class="lm-card__description">Oxygen saturation — normal range</div>
        </div>
        <div class="lm-card__body" style="display:flex;justify-content:center;">
          <div class="lm-gauge">
            <svg class="lm-gauge__svg" viewBox="0 0 180 100" style="width:180px;height:100px;">
              <!-- Track (full semi-circle arc) -->
              <!-- Arc from 180deg to 0deg, center at 90,90, radius 70 -->
              <path class="lm-gauge__track" d="M 20,90 A 70,70 0 0,1 160,90"/>
              <!-- Fill: 98% of 90-100 range = 80% of arc -->
              <!-- Arc sweep for 80%: need dasharray approach -->
              <path class="lm-gauge__fill" d="M 20,90 A 70,70 0 0,1 160,90"
                stroke="#3BA55C"
                stroke-dasharray="220"
                stroke-dashoffset="44"/>
              <!-- Value display -->
              <text class="lm-gauge__value" x="90" y="82">98<tspan style="font-size:14px;font-weight:500;">%</tspan></text>
            </svg>
            <div class="lm-gauge__label">SpO2</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Vitals Dashboard — Triple Gauge

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Gauge — Patient Vitals Dashboard</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Patient Vitals — Room 412</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--3">
            <!-- SpO2 Gauge: 98% in 90-100 range (normal) -->
            <div class="lm-gauge">
              <svg class="lm-gauge__svg" viewBox="0 0 180 100" style="width:180px;height:100px;">
                <path class="lm-gauge__track" d="M 20,90 A 70,70 0 0,1 160,90"/>
                <path class="lm-gauge__fill" d="M 20,90 A 70,70 0 0,1 160,90"
                  stroke="#3BA55C"
                  stroke-dasharray="220"
                  stroke-dashoffset="44"/>
                <text class="lm-gauge__value" x="90" y="82">98<tspan style="font-size:14px;font-weight:500;">%</tspan></text>
              </svg>
              <div class="lm-gauge__label">SpO2</div>
            </div>
            <!-- HR Gauge: 72 bpm in 40-180 range (normal) -->
            <div class="lm-gauge">
              <svg class="lm-gauge__svg" viewBox="0 0 180 100" style="width:180px;height:100px;">
                <path class="lm-gauge__track" d="M 20,90 A 70,70 0 0,1 160,90"/>
                <path class="lm-gauge__fill" d="M 20,90 A 70,70 0 0,1 160,90"
                  stroke="#5865F2"
                  stroke-dasharray="220"
                  stroke-dashoffset="120"/>
                <text class="lm-gauge__value" x="90" y="76">72</text>
                <text x="90" y="92" text-anchor="middle" style="font-size:10px;fill:var(--text-tertiary);">bpm</text>
              </svg>
              <div class="lm-gauge__label">Heart Rate</div>
            </div>
            <!-- Temp Gauge: 37.1 C in 35-42 range (normal) -->
            <div class="lm-gauge">
              <svg class="lm-gauge__svg" viewBox="0 0 180 100" style="width:180px;height:100px;">
                <path class="lm-gauge__track" d="M 20,90 A 70,70 0 0,1 160,90"/>
                <path class="lm-gauge__fill" d="M 20,90 A 70,70 0 0,1 160,90"
                  stroke="#3BA55C"
                  stroke-dasharray="220"
                  stroke-dashoffset="154"/>
                <text class="lm-gauge__value" x="90" y="76">37.1</text>
                <text x="90" y="92" text-anchor="middle" style="font-size:10px;fill:var(--text-tertiary);">&#176;C</text>
              </svg>
              <div class="lm-gauge__label">Temperature</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Warning State

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Gauge — Threshold Warning</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__body" style="display:flex;justify-content:center;">
          <div class="lm-gauge">
            <svg class="lm-gauge__svg" viewBox="0 0 180 100" style="width:180px;height:100px;">
              <path class="lm-gauge__track" d="M 20,90 A 70,70 0 0,1 160,90"/>
              <path class="lm-gauge__fill" d="M 20,90 A 70,70 0 0,1 160,90"
                stroke="#FAA61A"
                stroke-dasharray="220"
                stroke-dashoffset="110"/>
              <text class="lm-gauge__value" x="90" y="76" style="fill:#FAA61A;">93</text>
              <text x="90" y="92" text-anchor="middle" style="font-size:10px;fill:var(--text-tertiary);">%</text>
            </svg>
            <div class="lm-gauge__label">SpO2 — Warning</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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
