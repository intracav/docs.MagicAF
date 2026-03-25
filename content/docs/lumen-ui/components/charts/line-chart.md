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

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LineChart — Vital Trends</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Vital Trends</div>
          <div class="lm-card__description">Heart rate and SpO2 over 4-hour window</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-line-chart">
            <svg class="lm-line-chart__svg" viewBox="0 0 400 160" preserveAspectRatio="none" style="width:100%;height:180px;">
              <!-- Grid lines -->
              <line class="lm-line-chart__grid-line" x1="0" y1="40" x2="400" y2="40"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="80" x2="400" y2="80"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="120" x2="400" y2="120"/>
              <!-- Heart Rate line (scaled: 68-78 bpm mapped to 160-0) -->
              <polyline class="lm-line-chart__line" stroke="#5865F2" points="0,96 80,72 160,128 240,104 320,80 400,64"/>
              <!-- SpO2 line (scaled: 96-99 mapped to 160-0) -->
              <polyline class="lm-line-chart__line" stroke="#3BA55C" points="0,27 80,53 160,0 240,27 320,53 400,80"/>
              <!-- Data points - HR -->
              <circle class="lm-line-chart__dot" cx="0" cy="96" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="80" cy="72" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="160" cy="128" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="240" cy="104" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="320" cy="80" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="400" cy="64" r="3.5" fill="#5865F2"/>
              <!-- Data points - SpO2 -->
              <circle class="lm-line-chart__dot" cx="0" cy="27" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="80" cy="53" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="160" cy="0" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="240" cy="27" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="320" cy="53" r="3.5" fill="#3BA55C"/>
              <circle class="lm-line-chart__dot" cx="400" cy="80" r="3.5" fill="#3BA55C"/>
              <!-- Axis labels -->
              <text class="lm-line-chart__axis-label" x="0" y="156">0h</text>
              <text class="lm-line-chart__axis-label" x="80" y="156">1h</text>
              <text class="lm-line-chart__axis-label" x="160" y="156">2h</text>
              <text class="lm-line-chart__axis-label" x="240" y="156">3h</text>
              <text class="lm-line-chart__axis-label" x="320" y="156">4h</text>
              <text class="lm-line-chart__axis-label" x="390" y="156">5h</text>
            </svg>
            <!-- Legend -->
            <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:12px;height:3px;background:#5865F2;border-radius:2px;display:inline-block;"></span>
                <span style="color:var(--text-secondary);">Heart Rate (bpm)</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:12px;height:3px;background:#3BA55C;border-radius:2px;display:inline-block;"></span>
                <span style="color:var(--text-secondary);">SpO2 (%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Multi-Series Composition

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LineChart — 48-Hour Vitals</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">48-Hour Vitals</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-line-chart">
            <div class="lm-line-chart__title">Heart Rate & Respiratory Rate</div>
            <svg class="lm-line-chart__svg" viewBox="0 0 400 140" preserveAspectRatio="none" style="width:100%;height:160px;">
              <line class="lm-line-chart__grid-line" x1="0" y1="35" x2="400" y2="35"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="70" x2="400" y2="70"/>
              <line class="lm-line-chart__grid-line" x1="0" y1="105" x2="400" y2="105"/>
              <!-- Heart Rate: 69-78 bpm -->
              <polyline class="lm-line-chart__line" stroke="#5865F2" points="0,70 50,35 100,56 150,84 200,63 250,42 300,77 350,91 400,70"/>
              <!-- Resp Rate: 15-19 /min -->
              <polyline class="lm-line-chart__line" stroke="#FAA61A" points="0,98 50,70 100,84 150,112 200,98 250,56 300,84 350,98 400,98"/>
              <!-- Data points - HR -->
              <circle class="lm-line-chart__dot" cx="0" cy="70" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="50" cy="35" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="100" cy="56" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="150" cy="84" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="200" cy="63" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="250" cy="42" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="300" cy="77" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="350" cy="91" r="3.5" fill="#5865F2"/>
              <circle class="lm-line-chart__dot" cx="400" cy="70" r="3.5" fill="#5865F2"/>
              <!-- Data points - RR -->
              <circle class="lm-line-chart__dot" cx="0" cy="98" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="50" cy="70" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="100" cy="84" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="150" cy="112" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="200" cy="98" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="250" cy="56" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="300" cy="84" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="350" cy="98" r="3.5" fill="#FAA61A"/>
              <circle class="lm-line-chart__dot" cx="400" cy="98" r="3.5" fill="#FAA61A"/>
              <!-- X-axis labels -->
              <text class="lm-line-chart__axis-label" x="0" y="136">0h</text>
              <text class="lm-line-chart__axis-label" x="100" y="136">12h</text>
              <text class="lm-line-chart__axis-label" x="200" y="136">24h</text>
              <text class="lm-line-chart__axis-label" x="300" y="136">36h</text>
              <text class="lm-line-chart__axis-label" x="390" y="136">48h</text>
            </svg>
            <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:12px;height:3px;background:#5865F2;border-radius:2px;display:inline-block;"></span>
                <span style="color:var(--text-secondary);">Heart Rate</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:12px;height:3px;background:#FAA61A;border-radius:2px;display:inline-block;"></span>
                <span style="color:var(--text-secondary);">Resp Rate</span>
              </div>
            </div>
          </div>
          <div style="border-top:1px solid var(--border);margin-top:16px;padding-top:12px;">
            <div class="lm-grid lm-grid--2">
              <div class="lm-stat">
                <span class="lm-stat__label">Avg HR</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">73</span><span class="lm-stat__unit">bpm</span></div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">Avg RR</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">17</span><span class="lm-stat__unit">/min</span></div>
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
