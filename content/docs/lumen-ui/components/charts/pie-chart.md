---
title: "PieChart"
description: "Pie or donut chart for proportional distribution of categorical data."
weight: 4
tags: [lumen-ui, pie-chart, charts]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

PieChart renders categorical data as proportional segments of a circle. Set `donut=true` to render as a donut chart with a hollow center. Best used when showing how parts relate to a whole — referral distributions, diagnosis breakdowns, resource allocation.

## Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">PieChart — Referral Distribution</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Referral Distribution</div>
          <div class="lm-card__description">Inbound referrals by specialty</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-pie-chart">
            <!-- Donut chart using stroke-dasharray on circle -->
            <svg class="lm-pie-chart__svg" viewBox="0 0 140 140" style="width:140px;height:140px;">
              <!-- Cardiology: 35% = 35% of 440 (circumference) = 154 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#5865F2" stroke-width="24" stroke-dasharray="154 286" stroke-dashoffset="0" transform="rotate(-90 70 70)"/>
              <!-- Neurology: 25% = 110 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#3BA55C" stroke-width="24" stroke-dasharray="110 330" stroke-dashoffset="-154" transform="rotate(-90 70 70)"/>
              <!-- Orthopedics: 20% = 88 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#FAA61A" stroke-width="24" stroke-dasharray="88 352" stroke-dashoffset="-264" transform="rotate(-90 70 70)"/>
              <!-- Other: 20% = 88 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#ED4245" stroke-width="24" stroke-dasharray="88 352" stroke-dashoffset="-352" transform="rotate(-90 70 70)"/>
              <!-- Center hole for donut effect -->
              <circle cx="70" cy="70" r="36" fill="var(--theme)"/>
              <text x="70" y="66" text-anchor="middle" style="font-size:16px;font-weight:800;fill:var(--text-primary);">100</text>
              <text x="70" y="80" text-anchor="middle" style="font-size:10px;fill:var(--text-tertiary);font-weight:500;">Total</text>
            </svg>
            <div class="lm-pie-chart__legend">
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#5865F2;"></span>
                <span class="lm-pie-chart__legend-label">Cardiology</span>
                <span class="lm-pie-chart__legend-value">35%</span>
              </div>
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#3BA55C;"></span>
                <span class="lm-pie-chart__legend-label">Neurology</span>
                <span class="lm-pie-chart__legend-value">25%</span>
              </div>
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#FAA61A;"></span>
                <span class="lm-pie-chart__legend-label">Orthopedics</span>
                <span class="lm-pie-chart__legend-value">20%</span>
              </div>
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#ED4245;"></span>
                <span class="lm-pie-chart__legend-label">Other</span>
                <span class="lm-pie-chart__legend-value">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Payer Mix Composition

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">PieChart — Payer Mix Dashboard</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Payer Mix — Q1 2026</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-pie-chart">
            <svg class="lm-pie-chart__svg" viewBox="0 0 140 140" style="width:140px;height:140px;">
              <!-- Commercial: 42% = 184.8 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#5865F2" stroke-width="24" stroke-dasharray="184.8 255.2" stroke-dashoffset="0" transform="rotate(-90 70 70)"/>
              <!-- Medicare: 28% = 123.2 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#3BA55C" stroke-width="24" stroke-dasharray="123.2 316.8" stroke-dashoffset="-184.8" transform="rotate(-90 70 70)"/>
              <!-- Medicaid: 18% = 79.2 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#FAA61A" stroke-width="24" stroke-dasharray="79.2 360.8" stroke-dashoffset="-308" transform="rotate(-90 70 70)"/>
              <!-- Self-Pay: 8% = 35.2 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#ED4245" stroke-width="24" stroke-dasharray="35.2 404.8" stroke-dashoffset="-387.2" transform="rotate(-90 70 70)"/>
              <!-- Other: 4% = 17.6 -->
              <circle class="lm-pie-chart__slice" cx="70" cy="70" r="55" fill="none" stroke="#9B59B6" stroke-width="24" stroke-dasharray="17.6 422.4" stroke-dashoffset="-422.4" transform="rotate(-90 70 70)"/>
              <circle cx="70" cy="70" r="36" fill="var(--theme)"/>
            </svg>
            <div class="lm-pie-chart__legend">
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#5865F2;"></span>
                <span class="lm-pie-chart__legend-label">Commercial</span>
                <span class="lm-pie-chart__legend-value">42%</span>
              </div>
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#3BA55C;"></span>
                <span class="lm-pie-chart__legend-label">Medicare</span>
                <span class="lm-pie-chart__legend-value">28%</span>
              </div>
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#FAA61A;"></span>
                <span class="lm-pie-chart__legend-label">Medicaid</span>
                <span class="lm-pie-chart__legend-value">18%</span>
              </div>
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#ED4245;"></span>
                <span class="lm-pie-chart__legend-label">Self-Pay</span>
                <span class="lm-pie-chart__legend-value">8%</span>
              </div>
              <div class="lm-pie-chart__legend-item">
                <span class="lm-pie-chart__legend-dot" style="background:#9B59B6;"></span>
                <span class="lm-pie-chart__legend-label">Other</span>
                <span class="lm-pie-chart__legend-value">4%</span>
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
| `data` | `array<{label, value}>` | *required* | Array of objects, each with a `label` (string) and `value` (number). Values are normalized to percentages automatically. |
| `title` | `string` | — | Optional chart title displayed above the chart area. |
| `height` | `number` | `300` | Chart height in logical pixels. |
| `donut` | `bool` | `false` | When `true`, renders as a donut chart with a hollow center. |

## DSL Example

```
PieChart(
  data=[
    {label:"Cardiology", value:35},
    {label:"Neurology", value:25},
    {label:"Orthopedics", value:20},
    {label:"Other", value:20}
  ],
  title="Referral Distribution",
  donut=true
)
```

## JSON Example

```json
{
  "type": "pie_chart",
  "props": {
    "data": [
      {"label": "Cardiology", "value": 35},
      {"label": "Neurology", "value": 25},
      {"label": "Orthopedics", "value": 20},
      {"label": "Other", "value": 20}
    ],
    "title": "Referral Distribution",
    "donut": true
  }
}
```

## Composition

A donut chart paired with a legend-style breakdown inside a split layout:

```
Card(title="Payer Mix — Q1 2026",
  SplitView(ratio=0.5,
    PieChart(
      data=[
        {label:"Commercial", value:42},
        {label:"Medicare", value:28},
        {label:"Medicaid", value:18},
        {label:"Self-Pay", value:8},
        {label:"Other", value:4}
      ],
      donut=true,
      height=220
    ),
    Stack(direction="vertical", gap=8,
      Stat(label="Commercial", value="42%"),
      Stat(label="Medicare", value="28%"),
      Stat(label="Medicaid", value="18%"),
      Stat(label="Self-Pay", value="8%"),
      Stat(label="Other", value="4%")
    )
  )
)
```

## Notes

- Segment colors are assigned from the theme's `chartColors` palette in array order.
- Values do not need to sum to 100 — the chart normalizes values into proportional segments automatically.
- Tapping a segment highlights it and displays a tooltip with the label, value, and computed percentage.
- The donut variant is generally preferred for dashboards because the hollow center can accommodate a summary label or total.
- Limit data to roughly 7 or fewer segments for readability. Consolidate smaller categories into an "Other" group.
