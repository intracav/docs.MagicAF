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

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">AreaChart — Blood Pressure Trend</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Blood Pressure Trend</div>
          <div class="lm-card__description">Systolic and diastolic readings over 4 hours</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-line-chart">
            <svg class="lm-line-chart__svg" viewBox="0 0 400 160" preserveAspectRatio="none" style="width:100%;height:180px;">
              <!-- Grid lines -->
              <line class="lm-line-chart__grid-line" x1="0" y1="32" x2="400" y2="32"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="64" x2="400" y2="64"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="96" x2="400" y2="96"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="128" x2="400" y2="128"/>
              <!-- Systolic area fill (120-125 range, mapped higher in chart) -->
              <polygon class="lm-line-chart__area" fill="#5865F2" points="0,48 100,32 200,56 300,40 400,52 400,160 0,160"/>
              <!-- Diastolic area fill (78-82 range, mapped lower) -->
              <polygon class="lm-line-chart__area" fill="#3BA55C" points="0,104 100,96 200,112 300,100 400,108 400,160 0,160"/>
              <!-- Systolic line -->
              <polyline class="lm-line-chart__line" stroke="#5865F2" points="0,48 100,32 200,56 300,40 400,52"/>
              <!-- Diastolic line -->
              <polyline class="lm-line-chart__line" stroke="#3BA55C" points="0,104 100,96 200,112 300,100 400,108"/>
              <!-- Data points - Systolic -->
              <circle class="lm-line-chart__dot" cx="0" cy="48" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="100" cy="32" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="200" cy="56" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="300" cy="40" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="400" cy="52" r="3.5" fill="#5865F2"/>
              <!-- Data points - Diastolic -->
              <circle class="lm-line-chart__dot" cx="0" cy="104" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="100" cy="96" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="200" cy="112" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="300" cy="100" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="400" cy="108" r="3.5" fill="#3BA55C"/>
              <!-- Axis labels -->
              <text class="lm-line-chart__axis-label" x="0" y="156">0h</text>
              <text class="lm-line-chart__axis-label" x="100" y="156">1h</text>
              <text class="lm-line-chart__axis-label" x="200" y="156">2h</text>
              <text class="lm-line-chart__axis-label" x="300" y="156">3h</text>
              <text class="lm-line-chart__axis-label" x="390" y="156">4h</text>
            </svg>
            <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:12px;height:3px;background:#5865F2;border-radius:2px;display:inline-block;"></span>
                <span style="color:var(--text-secondary);">Systolic</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:12px;height:3px;background:#3BA55C;border-radius:2px;display:inline-block;"></span>
                <span style="color:var(--text-secondary);">Diastolic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Stacked Area — ICU Resource Utilization

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">AreaChart — Stacked</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">ICU Resource Utilization</div>
          <div class="lm-card__description">24-hour equipment usage (stacked)</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-line-chart">
            <div class="lm-line-chart__title">24-Hour Equipment In Use</div>
            <svg class="lm-line-chart__svg" viewBox="0 0 400 160" preserveAspectRatio="none" style="width:100%;height:180px;">
              <line class="lm-line-chart__grid-line" x1="0" y1="40" x2="400" y2="40"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="80" x2="400" y2="80"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="120" x2="400" y2="120"/>
              <!-- Infusion Pumps (bottom layer, stacked) -->
              <polygon class="lm-line-chart__area" fill="#FAA61A" points="0,52 67,60 133,36 200,44 267,56 333,40 400,48 400,160 0,160"/>
              <!-- Monitors (middle layer) -->
              <polygon class="lm-line-chart__area" fill="#3BA55C" points="0,92 67,88 133,76 200,80 267,88 333,72 400,84 400,160 0,160" style="opacity:0.2;"/>
              <!-- Ventilators (top layer) -->
              <polygon class="lm-line-chart__area" fill="#5865F2" points="0,128 67,124 133,112 200,120 267,128 333,116 400,124 400,160 0,160" style="opacity:0.2;"/>
              <!-- Lines -->
              <polyline class="lm-line-chart__line" stroke="#FAA61A" points="0,52 67,60 133,36 200,44 267,56 333,40 400,48"/>
              <polyline class="lm-line-chart__line" stroke="#3BA55C" points="0,92 67,88 133,76 200,80 267,88 333,72 400,84"/>
              <polyline class="lm-line-chart__line" stroke="#5865F2" points="0,128 67,124 133,112 200,120 267,128 333,116 400,124"/>
              <!-- Axis labels -->
              <text class="lm-line-chart__axis-label" x="0" y="156">0h</text>
              <text class="lm-line-chart__axis-label" x="133" y="156">8h</text>
              <text class="lm-line-chart__axis-label" x="267" y="156">16h</text>
              <text class="lm-line-chart__axis-label" x="390" y="156">24h</text>
            </svg>
            <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:10px;height:10px;background:#FAA61A;border-radius:3px;display:inline-block;opacity:0.6;"></span>
                <span style="color:var(--text-secondary);">Pumps</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:10px;height:10px;background:#3BA55C;border-radius:3px;display:inline-block;opacity:0.6;"></span>
                <span style="color:var(--text-secondary);">Monitors</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:10px;height:10px;background:#5865F2;border-radius:3px;display:inline-block;opacity:0.6;"></span>
                <span style="color:var(--text-secondary);">Ventilators</span>
              </div>
            </div>
          </div>
          <div style="border-top:1px solid var(--border);margin-top:16px;padding-top:12px;">
            <div class="lm-grid lm-grid--3">
              <div class="lm-stat">
                <span class="lm-stat__label">Ventilators</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">14</span><span class="lm-stat__unit">active</span></div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">Monitors</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">22</span><span class="lm-stat__unit">active</span></div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">Pumps</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">31</span><span class="lm-stat__unit">active</span></div>
              </div>
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
