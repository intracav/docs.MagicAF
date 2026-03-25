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

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">RadarChart — Symptom Assessment</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Symptom Assessment</div>
          <div class="lm-card__description">Baseline vs. Week 4 comparison (0-10 scale)</div>
        </div>
        <div class="lm-card__body" style="display:flex;flex-direction:column;align-items:center;">
          <!-- Radar: 5 axes — Pain, Mobility, Sleep, Mood, Energy -->
          <!-- Pentagon center at 120,110. Scale: 10=80px radius -->
          <!-- Axis angles: Pain=90deg(top), Mobility=162, Sleep=234, Mood=306, Energy=18 -->
          <svg class="lm-radar-chart__svg" viewBox="0 0 240 220" style="width:240px;height:220px;">
            <!-- Grid rings (3 levels: 33%, 66%, 100%) -->
            <!-- Outer pentagon (100%) -->
            <polygon class="lm-radar-chart__grid" points="120,30 196.1,88.7 167.1,185.3 72.9,185.3 43.9,88.7"/>
            <!-- Middle pentagon (66%) -->
            <polygon class="lm-radar-chart__grid" points="120,56.8 170.2,95.5 151.1,159.5 88.9,159.5 69.8,95.5"/>
            <!-- Inner pentagon (33%) -->
            <polygon class="lm-radar-chart__grid" points="120,83.6 145.1,102.2 135.5,133.8 104.5,133.8 94.9,102.2"/>
            <!-- Axes -->
            <line class="lm-radar-chart__axis" x1="120" y1="110" x2="120" y2="30"/>
            <line class="lm-radar-chart__axis" x1="120" y1="110" x2="196.1" y2="88.7"/>
            <line class="lm-radar-chart__axis" x1="120" y1="110" x2="167.1" y2="185.3"/>
            <line class="lm-radar-chart__axis" x1="120" y1="110" x2="72.9" y2="185.3"/>
            <line class="lm-radar-chart__axis" x1="120" y1="110" x2="43.9" y2="88.7"/>
            <!-- Baseline series: Pain=8, Mobility=3, Sleep=4, Mood=3, Energy=2 -->
            <!-- Scale each: value/10 * 80px from center -->
            <polygon class="lm-radar-chart__area" fill="#ED4245" stroke="#ED4245"
              points="120,46 142.8,101.6 138.9,170.1 96.6,170.1 58.7,93"/>
            <!-- Week 4 series: Pain=4, Mobility=6, Sleep=7, Mood=6, Energy=5 -->
            <polygon class="lm-radar-chart__area" fill="#5865F2" stroke="#5865F2"
              points="120,78 165.7,97.2 152.9,162.7 91.8,162.7 74.4,93.6"/>
            <!-- Axis labels -->
            <text x="120" y="20" text-anchor="middle" style="font-size:11px;fill:var(--text-secondary);font-weight:600;">Pain</text>
            <text x="206" y="88" text-anchor="start" style="font-size:11px;fill:var(--text-secondary);font-weight:600;">Mobility</text>
            <text x="174" y="198" text-anchor="start" style="font-size:11px;fill:var(--text-secondary);font-weight:600;">Sleep</text>
            <text x="60" y="198" text-anchor="end" style="font-size:11px;fill:var(--text-secondary);font-weight:600;">Mood</text>
            <text x="34" y="88" text-anchor="end" style="font-size:11px;fill:var(--text-secondary);font-weight:600;">Energy</text>
          </svg>
          <!-- Legend -->
          <div style="display:flex;gap:16px;margin-top:4px;font-size:12px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;background:#ED4245;border-radius:3px;display:inline-block;opacity:0.7;"></span>
              <span style="color:var(--text-secondary);">Baseline</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;background:#5865F2;border-radius:3px;display:inline-block;opacity:0.7;"></span>
              <span style="color:var(--text-secondary);">Week 4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Clinical Report Composition

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">RadarChart — Functional Assessment</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Functional Assessment — Patient #4821</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-alert lm-alert--success" style="margin-bottom:16px;padding:10px 14px;">
            <span class="lm-alert__icon">&#10003;</span>
            <div class="lm-alert__content">
              <div class="lm-alert__title">Improvement Detected</div>
              <div class="lm-alert__message">Overall functional score improved by 38% over 4 weeks.</div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <!-- 6-axis radar: ADLs, Cognition, Balance, Strength, Endurance, Pain Mgmt -->
            <svg class="lm-radar-chart__svg" viewBox="0 0 240 220" style="width:240px;height:220px;">
              <!-- Outer hexagon -->
              <polygon class="lm-radar-chart__grid" points="120,30 189.3,65 189.3,155 120,190 50.7,155 50.7,65"/>
              <!-- Middle hexagon -->
              <polygon class="lm-radar-chart__grid" points="120,56.7 166.2,80 166.2,140 120,163.3 73.8,140 73.8,80"/>
              <!-- Inner hexagon -->
              <polygon class="lm-radar-chart__grid" points="120,83.3 143.1,95 143.1,125 120,136.7 96.9,125 96.9,95"/>
              <!-- Axes -->
              <line class="lm-radar-chart__axis" x1="120" y1="110" x2="120" y2="30"/>
              <line class="lm-radar-chart__axis" x1="120" y1="110" x2="189.3" y2="65"/>
              <line class="lm-radar-chart__axis" x1="120" y1="110" x2="189.3" y2="155"/>
              <line class="lm-radar-chart__axis" x1="120" y1="110" x2="120" y2="190"/>
              <line class="lm-radar-chart__axis" x1="120" y1="110" x2="50.7" y2="155"/>
              <line class="lm-radar-chart__axis" x1="120" y1="110" x2="50.7" y2="65"/>
              <!-- Admission: 3,5,2,3,2,4 out of 10 -->
              <polygon class="lm-radar-chart__area" fill="#ED4245" stroke="#ED4245"
                points="120,86 140.8,96.5 140.8,119 120,126 92.2,119 85.5,96.5"/>
              <!-- Discharge: 7,6,6,7,5,7 out of 10 -->
              <polygon class="lm-radar-chart__area" fill="#5865F2" stroke="#5865F2"
                points="120,54 161.6,83 161.6,137 120,166 78.4,147 64.1,78.5"/>
              <!-- Labels -->
              <text x="120" y="20" text-anchor="middle" style="font-size:10px;fill:var(--text-secondary);font-weight:600;">ADLs</text>
              <text x="198" y="62" text-anchor="start" style="font-size:10px;fill:var(--text-secondary);font-weight:600;">Cognition</text>
              <text x="198" y="160" text-anchor="start" style="font-size:10px;fill:var(--text-secondary);font-weight:600;">Balance</text>
              <text x="120" y="205" text-anchor="middle" style="font-size:10px;fill:var(--text-secondary);font-weight:600;">Strength</text>
              <text x="42" y="160" text-anchor="end" style="font-size:10px;fill:var(--text-secondary);font-weight:600;">Endurance</text>
              <text x="42" y="62" text-anchor="end" style="font-size:10px;fill:var(--text-secondary);font-weight:600;">Pain Mgmt</text>
            </svg>
            <div style="display:flex;gap:16px;margin-top:4px;font-size:12px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:10px;height:10px;background:#ED4245;border-radius:3px;display:inline-block;opacity:0.7;"></span>
                <span style="color:var(--text-secondary);">Admission</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="width:10px;height:10px;background:#5865F2;border-radius:3px;display:inline-block;opacity:0.7;"></span>
                <span style="color:var(--text-secondary);">Discharge</span>
              </div>
            </div>
          </div>
          <div style="border-top:1px solid var(--border);margin-top:16px;padding-top:12px;">
            <div class="lm-grid lm-grid--2">
              <div class="lm-stat">
                <span class="lm-stat__label">Admission Score</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">19</span><span class="lm-stat__unit">/60</span></div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">Discharge Score</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">38</span><span class="lm-stat__unit">/60</span></div>
                <span class="lm-stat__change lm-stat__change--up">&#9650; +100%</span>
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
