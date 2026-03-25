---
title: "ScatterChart"
description: "Scatter plot for correlation analysis between two continuous variables."
weight: 6
tags: [lumen-ui, scatter-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

ScatterChart plots individual data points on a two-dimensional plane, revealing relationships, clusters, and outliers between two continuous variables. Supports multiple series for comparing distinct populations or groups side by side.

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">ScatterChart — Age vs Systolic BP</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Age vs Systolic BP</div>
          <div class="lm-card__description">Patient cohort correlation analysis</div>
        </div>
        <div class="lm-card__body">
          <div style="position:relative;">
            <svg class="lm-scatter-chart__svg" viewBox="0 0 400 200" style="width:100%;height:200px;">
              <!-- Grid lines -->
              <line class="lm-line-chart__grid-line" x1="40" y1="20" x2="390" y2="20"/>
              <line class="lm-line-chart__grid-line" x1="40" y1="60" x2="390" y2="60"/>
              <line class="lm-line-chart__grid-line" x1="40" y1="100" x2="390" y2="100"/>
              <line class="lm-line-chart__grid-line" x1="40" y1="140" x2="390" y2="140"/>
              <line class="lm-line-chart__grid-line" x1="40" y1="180" x2="390" y2="180"/>
              <!-- Axes -->
              <line stroke="var(--border)" stroke-width="1" x1="40" y1="180" x2="390" y2="180"/>
              <line stroke="var(--border)" stroke-width="1" x1="40" y1="20" x2="40" y2="180"/>
              <!-- Data points: age mapped 30-75 to x:40-390, BP mapped 105-145 to y:180-20 -->
              <!-- {45,120} -->
              <circle class="lm-scatter-chart__dot" cx="116" cy="120" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {62,135} -->
              <circle class="lm-scatter-chart__dot" cx="262" cy="60" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {38,118} -->
              <circle class="lm-scatter-chart__dot" cx="80" cy="128" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {55,128} -->
              <circle class="lm-scatter-chart__dot" cx="198" cy="88" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {71,142} -->
              <circle class="lm-scatter-chart__dot" cx="338" cy="32" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {48,122} -->
              <circle class="lm-scatter-chart__dot" cx="140" cy="112" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {33,110} -->
              <circle class="lm-scatter-chart__dot" cx="56" cy="160" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {59,131} -->
              <circle class="lm-scatter-chart__dot" cx="236" cy="76" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {67,138} -->
              <circle class="lm-scatter-chart__dot" cx="304" cy="48" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {42,115} -->
              <circle class="lm-scatter-chart__dot" cx="96" cy="140" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {51,125} -->
              <circle class="lm-scatter-chart__dot" cx="166" cy="100" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- {73,140} -->
              <circle class="lm-scatter-chart__dot" cx="354" cy="40" r="5" fill="#5865F2" opacity="0.8"/>
              <!-- Axis labels -->
              <text class="lm-line-chart__axis-label" x="40" y="196">30</text>
              <text class="lm-line-chart__axis-label" x="116" y="196">40</text>
              <text class="lm-line-chart__axis-label" x="198" y="196">50</text>
              <text class="lm-line-chart__axis-label" x="276" y="196">60</text>
              <text class="lm-line-chart__axis-label" x="354" y="196">70</text>
              <text class="lm-line-chart__axis-label" x="215" y="210" text-anchor="middle" style="font-size:11px;font-weight:600;">Age (years)</text>
              <!-- Y-axis labels -->
              <text class="lm-line-chart__axis-label" x="36" y="184" text-anchor="end">110</text>
              <text class="lm-line-chart__axis-label" x="36" y="144" text-anchor="end">120</text>
              <text class="lm-line-chart__axis-label" x="36" y="104" text-anchor="end">130</text>
              <text class="lm-line-chart__axis-label" x="36" y="64" text-anchor="end">140</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Multi-Cohort Comparison

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">ScatterChart — BMI vs HbA1c</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">BMI vs. HbA1c — Study Cohorts</div>
        </div>
        <div class="lm-card__body">
          <svg class="lm-scatter-chart__svg" viewBox="0 0 400 200" style="width:100%;height:200px;">
            <!-- Grid -->
            <line class="lm-line-chart__grid-line" x1="40" y1="20" x2="390" y2="20"/>
            <line class="lm-line-chart__grid-line" x1="40" y1="60" x2="390" y2="60"/>
            <line class="lm-line-chart__grid-line" x1="40" y1="100" x2="390" y2="100"/>
            <line class="lm-line-chart__grid-line" x1="40" y1="140" x2="390" y2="140"/>
            <line class="lm-line-chart__grid-line" x1="40" y1="180" x2="390" y2="180"/>
            <line stroke="var(--border)" stroke-width="1" x1="40" y1="180" x2="390" y2="180"/>
            <line stroke="var(--border)" stroke-width="1" x1="40" y1="20" x2="40" y2="180"/>
            <!-- Treatment group (BMI 22-35 mapped to x:40-390, HbA1c 5.5-8.0 mapped to y:180-20) -->
            <circle class="lm-scatter-chart__dot" cx="75" cy="130" r="5" fill="#5865F2" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="180" cy="112" r="5" fill="#5865F2" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="260" cy="98" r="5" fill="#5865F2" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="128" cy="125" r="5" fill="#5865F2" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="312" cy="84" r="5" fill="#5865F2" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="210" cy="118" r="5" fill="#5865F2" opacity="0.8"/>
            <!-- Control group -->
            <circle class="lm-scatter-chart__dot" cx="100" cy="92" r="5" fill="#ED4245" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="210" cy="52" r="5" fill="#ED4245" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="290" cy="32" r="5" fill="#ED4245" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="155" cy="72" r="5" fill="#ED4245" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="340" cy="20" r="5" fill="#ED4245" opacity="0.8"/>
            <circle class="lm-scatter-chart__dot" cx="240" cy="60" r="5" fill="#ED4245" opacity="0.8"/>
            <!-- Axis labels -->
            <text class="lm-line-chart__axis-label" x="40" y="196">22</text>
            <text class="lm-line-chart__axis-label" x="145" y="196">25</text>
            <text class="lm-line-chart__axis-label" x="250" y="196">30</text>
            <text class="lm-line-chart__axis-label" x="355" y="196">35</text>
            <text class="lm-line-chart__axis-label" x="215" y="210" text-anchor="middle" style="font-size:11px;font-weight:600;">BMI (kg/m2)</text>
            <text class="lm-line-chart__axis-label" x="36" y="184" text-anchor="end">5.5</text>
            <text class="lm-line-chart__axis-label" x="36" y="104" text-anchor="end">7.0</text>
            <text class="lm-line-chart__axis-label" x="36" y="24" text-anchor="end">8.0</text>
          </svg>
          <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;background:#5865F2;border-radius:50%;display:inline-block;opacity:0.8;"></span>
              <span style="color:var(--text-secondary);">Treatment</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:10px;height:10px;background:#ED4245;border-radius:50%;display:inline-block;opacity:0.8;"></span>
              <span style="color:var(--text-secondary);">Control</span>
            </div>
          </div>
          <div style="border-top:1px solid var(--border);margin-top:16px;padding-top:12px;">
            <div class="lm-grid lm-grid--2">
              <div class="lm-stat">
                <span class="lm-stat__label">Treatment Mean HbA1c</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">6.2</span><span class="lm-stat__unit">%</span></div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">Control Mean HbA1c</span>
                <div class="lm-stat__value-row"><span class="lm-stat__value">7.1</span><span class="lm-stat__unit">%</span></div>
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
| `xLabel` | `string` | — | Label for the x-axis. |
| `yLabel` | `string` | — | Label for the y-axis. |

## DSL Example

```
ScatterChart(
  series=[
    {label:"Patients", data:[
      {x:45, y:120}, {x:62, y:135}, {x:38, y:118},
      {x:55, y:128}, {x:71, y:142}, {x:48, y:122},
      {x:33, y:110}, {x:59, y:131}, {x:67, y:138}
    ]}
  ],
  title="Age vs Systolic BP",
  xLabel="Age",
  yLabel="Systolic BP"
)
```

## JSON Example

```json
{
  "type": "scatter_chart",
  "props": {
    "series": [
      {
        "label": "Patients",
        "data": [
          {"x": 45, "y": 120},
          {"x": 62, "y": 135},
          {"x": 38, "y": 118},
          {"x": 55, "y": 128},
          {"x": 71, "y": 142},
          {"x": 48, "y": 122},
          {"x": 33, "y": 110},
          {"x": 59, "y": 131},
          {"x": 67, "y": 138}
        ]
      }
    ],
    "title": "Age vs Systolic BP",
    "x_label": "Age",
    "y_label": "Systolic BP"
  }
}
```

## Composition

A scatter plot comparing two cohorts inside a research results card:

```
Card(title="BMI vs. HbA1c — Study Cohorts",
  Stack(direction="vertical", gap=16,
    ScatterChart(
      series=[
        {label:"Treatment", data:[
          {x:24, y:5.8}, {x:28, y:6.2}, {x:31, y:6.5},
          {x:26, y:5.9}, {x:33, y:6.8}, {x:29, y:6.1}
        ]},
        {label:"Control", data:[
          {x:25, y:6.4}, {x:29, y:7.1}, {x:32, y:7.5},
          {x:27, y:6.7}, {x:34, y:7.8}, {x:30, y:7.0}
        ]}
      ],
      title="BMI vs. HbA1c",
      xLabel="BMI (kg/m2)",
      yLabel="HbA1c (%)",
      height=280
    ),
    Separator(),
    Grid(columns=2,
      Stat(label="Treatment Mean HbA1c", value="6.2%"),
      Stat(label="Control Mean HbA1c", value="7.1%")
    )
  )
)
```

## Notes

- Each series is rendered with a distinct color from the theme's `chartColors` palette.
- Tapping a data point shows a tooltip with the series label and the exact x/y coordinates.
- Axis ranges are computed automatically from the data extents with padding.
- In JSON format, prop names use snake_case: `x_label` and `y_label`. In the DSL, use camelCase: `xLabel` and `yLabel`. The parser normalizes both.
- The legend appears automatically when more than one series is present.
- For large datasets (100+ points), consider reducing point size or grouping into summary statistics for readability.
