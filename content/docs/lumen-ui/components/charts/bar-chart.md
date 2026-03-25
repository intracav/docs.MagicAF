---
title: "BarChart"
description: "Categorical bar chart for comparing discrete values across groups."
weight: 1
tags: [lumen-ui, bar-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

BarChart renders a categorical bar chart from an array of label/value pairs. Use it to compare discrete categories — departments, time periods, diagnosis codes, or any grouping where each bar represents a single value. Supports vertical (default) and horizontal orientations.

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">BarChart — Quarterly Admissions</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Quarterly Admissions</div>
          <div class="lm-card__description">Hospital-wide patient admissions by quarter</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-bar-chart lm-animate-bars">
            <div class="lm-bar-chart__bars" style="height:180px;">
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-1" style="height:69%;"><span class="lm-bar-chart__bar-value">42</span></div>
                <span class="lm-bar-chart__bar-label">Q1</span>
              </div>
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-2" style="height:95%;"><span class="lm-bar-chart__bar-value">58</span></div>
                <span class="lm-bar-chart__bar-label">Q2</span>
              </div>
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-3" style="height:57%;"><span class="lm-bar-chart__bar-value">35</span></div>
                <span class="lm-bar-chart__bar-label">Q3</span>
              </div>
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-4" style="height:100%;"><span class="lm-bar-chart__bar-value">61</span></div>
                <span class="lm-bar-chart__bar-label">Q4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Horizontal Variant

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">BarChart — Horizontal</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Admissions by Department</div>
          <div class="lm-card__description">Current quarter department breakdown</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-bar-chart lm-bar-chart--horizontal lm-animate-bars">
            <div class="lm-bar-chart__bars">
              <div class="lm-bar-chart__bar-group">
                <span class="lm-bar-chart__bar-label">Cardiology</span>
                <div class="lm-bar-chart__bar lm-chart-1" style="width:88%;"><span class="lm-bar-chart__bar-value">52</span></div>
              </div>
              <div class="lm-bar-chart__bar-group">
                <span class="lm-bar-chart__bar-label">Neurology</span>
                <div class="lm-bar-chart__bar lm-chart-2" style="width:64%;"><span class="lm-bar-chart__bar-value">38</span></div>
              </div>
              <div class="lm-bar-chart__bar-group">
                <span class="lm-bar-chart__bar-label">Orthopedics</span>
                <div class="lm-bar-chart__bar lm-chart-3" style="width:80%;"><span class="lm-bar-chart__bar-value">47</span></div>
              </div>
              <div class="lm-bar-chart__bar-group">
                <span class="lm-bar-chart__bar-label">Oncology</span>
                <div class="lm-bar-chart__bar lm-chart-4" style="width:100%;"><span class="lm-bar-chart__bar-value">59</span></div>
              </div>
              <div class="lm-bar-chart__bar-group">
                <span class="lm-bar-chart__bar-label">Pediatrics</span>
                <div class="lm-bar-chart__bar lm-chart-5" style="width:54%;"><span class="lm-bar-chart__bar-value">32</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Dashboard Composition

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">BarChart — Dashboard Card</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Department Overview</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stat" style="margin-bottom:16px;">
            <span class="lm-stat__label">Total Admissions</span>
            <div class="lm-stat__value-row"><span class="lm-stat__value">196</span></div>
            <span class="lm-stat__change lm-stat__change--up">&#9650; +12%</span>
          </div>
          <div class="lm-bar-chart lm-animate-bars">
            <div class="lm-bar-chart__title">Admissions by Department</div>
            <div class="lm-bar-chart__bars" style="height:140px;">
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-1" style="height:88%;"><span class="lm-bar-chart__bar-value">52</span></div>
                <span class="lm-bar-chart__bar-label">Cardio</span>
              </div>
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-2" style="height:64%;"><span class="lm-bar-chart__bar-value">38</span></div>
                <span class="lm-bar-chart__bar-label">Neuro</span>
              </div>
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-3" style="height:80%;"><span class="lm-bar-chart__bar-value">47</span></div>
                <span class="lm-bar-chart__bar-label">Ortho</span>
              </div>
              <div class="lm-bar-chart__bar-group">
                <div class="lm-bar-chart__bar lm-chart-4" style="height:100%;"><span class="lm-bar-chart__bar-value">59</span></div>
                <span class="lm-bar-chart__bar-label">Onco</span>
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
| `data` | `array<{label, value}>` | *required* | Array of objects, each with a `label` (string) and `value` (number). |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |
| `horizontal` | `bool` | `false` | When `true`, bars render horizontally with labels on the y-axis. |

## DSL Example

```
BarChart(
  data=[
    {label:"Q1", value:42},
    {label:"Q2", value:58},
    {label:"Q3", value:35},
    {label:"Q4", value:61}
  ],
  title="Quarterly Admissions",
  height=250
)
```

## JSON Example

```json
{
  "type": "bar_chart",
  "props": {
    "data": [
      {"label": "Q1", "value": 42},
      {"label": "Q2", "value": 58},
      {"label": "Q3", "value": 35},
      {"label": "Q4", "value": 61}
    ],
    "title": "Quarterly Admissions",
    "height": 250
  }
}
```

## Composition

A bar chart inside a dashboard card alongside a stat:

```
Card(title="Department Overview",
  Stack(direction="vertical", gap=16,
    Stat(label="Total Admissions", value="196", trend="up", change="+12%"),
    BarChart(
      data=[
        {label:"Cardiology", value:52},
        {label:"Neurology", value:38},
        {label:"Orthopedics", value:47},
        {label:"Oncology", value:59}
      ],
      title="Admissions by Department",
      height=200
    )
  )
)
```

## Notes

- Chart bar colors are assigned automatically from the theme's `chartColors` palette in order.
- The `horizontal` orientation is useful when category labels are long (e.g., full diagnosis names).
- Zero and negative values are supported; negative bars extend below/left of the axis.
- The chart is touch-interactive — tapping a bar shows a tooltip with the exact value.
