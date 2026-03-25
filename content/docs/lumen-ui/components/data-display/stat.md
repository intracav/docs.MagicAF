---
title: "Stat"
description: "Big number KPI card with label, unit, trend arrow, and change indicator."
weight: 3
tags: [lumen-ui, stat, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `Stat` component displays a single metric prominently — a large value with a descriptive label, optional unit suffix, trend arrow, and change text. It is the primary building block for dashboards, vitals displays, and KPI summaries.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | *required* | The primary numeric value to display. |
| `label` | `string` | *required* | Descriptive label shown above the value. |
| `unit` | `string` | — | Unit suffix displayed next to the value (e.g., `"bpm"`, `"mg/dL"`, `"%"`). |
| `trend` | `enum` | — | Trend direction. Options: `up`, `down`, `neutral`. Controls the arrow icon and its color. |
| `change` | `string` | — | Change text shown alongside the trend arrow (e.g., `"+3"`, `"-0.5"`, `"+12%"`). |
| `variant` | `enum` | `"default"` | Color variant for the value text. Options: `default`, `success`, `warning`, `danger`. |

## DSL Example

```
Stat(
  label="Heart Rate",
  value="72",
  unit="bpm",
  trend="up",
  change="+3"
)
```

## Live Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Stat — All Variants</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--3" style="margin-bottom:16px;">
        <div class="lm-stat">
          <div class="lm-stat__label">Heart Rate</div>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">72</span>
            <span class="lm-stat__unit">bpm</span>
          </div>
          <div class="lm-stat__change lm-stat__change--up">&#9650; +3</div>
        </div>
        <div class="lm-stat lm-stat--success">
          <div class="lm-stat__label">SpO2</div>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">98</span>
            <span class="lm-stat__unit">%</span>
          </div>
          <div class="lm-stat__change lm-stat__change--up">&#9650; +1</div>
        </div>
        <div class="lm-stat lm-stat--danger">
          <div class="lm-stat__label">Temperature</div>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">101.2</span>
            <span class="lm-stat__unit">&deg;F</span>
          </div>
          <div class="lm-stat__change lm-stat__change--up">&#9650; +2.1</div>
        </div>
      </div>
      <div class="lm-grid lm-grid--3">
        <div class="lm-stat lm-stat--warning">
          <div class="lm-stat__label">Glucose</div>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">142</span>
            <span class="lm-stat__unit">mg/dL</span>
          </div>
          <div class="lm-stat__change lm-stat__change--up">&#9650; +22</div>
        </div>
        <div class="lm-stat">
          <div class="lm-stat__label">Blood Pressure</div>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">120/80</span>
            <span class="lm-stat__unit">mmHg</span>
          </div>
          <div class="lm-stat__change lm-stat__change--neutral">&#9654; stable</div>
        </div>
        <div class="lm-stat">
          <div class="lm-stat__label">Respiratory Rate</div>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">18</span>
            <span class="lm-stat__unit">/min</span>
          </div>
          <div class="lm-stat__change lm-stat__change--down">&#9660; -5</div>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "stat",
  "props": {
    "label": "Heart Rate",
    "value": "72",
    "unit": "bpm",
    "trend": "up",
    "change": "+3"
  }
}
```

## Composition

A vitals dashboard using multiple `Stat` components in a `Grid`:

```
Card(title="Current Vitals",
  Grid(columns=3, gap=16,
    Stat(label="Heart Rate", value="72", unit="bpm", trend="down", change="-5"),
    Stat(label="Blood Pressure", value="120/80", unit="mmHg", trend="neutral"),
    Stat(label="SpO2", value="98", unit="%", trend="up", change="+1", variant="success"),
    Stat(label="Temperature", value="101.2", unit="F", variant="danger", trend="up", change="+2.1"),
    Stat(label="Respiratory Rate", value="18", unit="/min"),
    Stat(label="Glucose", value="142", unit="mg/dL", variant="warning", trend="up", change="+22")
  )
)
```

## Composition Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card + Grid + Stat — Vitals Dashboard</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header"><div class="lm-card__title">Current Vitals</div></div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--3" style="margin-bottom:16px;">
            <div class="lm-stat">
              <div class="lm-stat__label">Heart Rate</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">72</span>
                <span class="lm-stat__unit">bpm</span>
              </div>
              <div class="lm-stat__change lm-stat__change--down">&#9660; -5</div>
            </div>
            <div class="lm-stat">
              <div class="lm-stat__label">Blood Pressure</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">120/80</span>
                <span class="lm-stat__unit">mmHg</span>
              </div>
              <div class="lm-stat__change lm-stat__change--neutral">&#9654; stable</div>
            </div>
            <div class="lm-stat lm-stat--success">
              <div class="lm-stat__label">SpO2</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">98</span>
                <span class="lm-stat__unit">%</span>
              </div>
              <div class="lm-stat__change lm-stat__change--up">&#9650; +1</div>
            </div>
          </div>
          <div class="lm-grid lm-grid--3">
            <div class="lm-stat lm-stat--danger">
              <div class="lm-stat__label">Temperature</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">101.2</span>
                <span class="lm-stat__unit">&deg;F</span>
              </div>
              <div class="lm-stat__change lm-stat__change--up">&#9650; +2.1</div>
            </div>
            <div class="lm-stat">
              <div class="lm-stat__label">Respiratory Rate</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">18</span>
                <span class="lm-stat__unit">/min</span>
              </div>
            </div>
            <div class="lm-stat lm-stat--warning">
              <div class="lm-stat__label">Glucose</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">142</span>
                <span class="lm-stat__unit">mg/dL</span>
              </div>
              <div class="lm-stat__change lm-stat__change--up">&#9650; +22</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- **Value is a string**: The `value` prop is a string, not a number. This allows formatted values like `"120/80"`, `"1,247"`, or `">500"`.
- **Trend coloring**: `up` renders in the success color (green), `down` in the destructive color (red). This follows a "higher is better" convention. For metrics where a decrease is positive (e.g., reducing blood pressure), consider omitting the `trend` prop and using `variant` instead to control the value color directly.
- **Variant vs. trend**: The `variant` prop controls the color of the value text itself. The `trend` prop controls the color and direction of the arrow/change text. They can be used independently or together.
- **Layout**: The component renders as a vertical column (label, value+unit, change) and uses `MainAxisSize.min`, making it suitable for grid cells.
