---
title: "Grid"
description: "Responsive multi-column grid layout."
weight: 3
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Grid distributes its children across a fixed number of equal-width columns with consistent spacing. Use Grid for dashboards, card galleries, or any layout where content should be arranged in a uniform multi-column structure.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | number | `2` | Number of columns. Children fill columns left-to-right, top-to-bottom. |
| `gap` | number | — | Space in logical pixels between both rows and columns. |

**Children:** Yes. Each child occupies one grid cell. If the number of children is not evenly divisible by `columns`, the last row is partially filled.

## DSL Example

```
Grid(columns=3, gap=16,
  Card(title="CBC", Stat(label="WBC", value="7.2", unit="K/uL")),
  Card(title="BMP", Stat(label="Na", value="140", unit="mEq/L")),
  Card(title="LFTs", Stat(label="ALT", value="28", unit="U/L"))
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview — 3-Column Grid</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Grid — columns=3, gap=16</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--3" style="gap: 16px;">
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">CBC</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">WBC</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">7.2</span>
                <span class="lm-stat__unit">K/uL</span>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">BMP</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">Na</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">140</span>
                <span class="lm-stat__unit">mEq/L</span>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">LFTs</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">ALT</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">28</span>
                <span class="lm-stat__unit">U/L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "grid",
  "props": {
    "columns": 3,
    "gap": 16
  },
  "children": [
    {
      "type": "card",
      "title": "CBC",
      "children": [{"type": "stat", "label": "WBC", "value": "7.2", "unit": "K/uL"}]
    },
    {
      "type": "card",
      "title": "BMP",
      "children": [{"type": "stat", "label": "Na", "value": "140", "unit": "mEq/L"}]
    },
    {
      "type": "card",
      "title": "LFTs",
      "children": [{"type": "stat", "label": "ALT", "value": "28", "unit": "U/L"}]
    }
  ]
}
```

## Composition

```
Card(title="Patient Dashboard",
  Grid(columns=2, gap=16,
    Card(title="Vital Signs", variant="outlined",
      Stack(direction="vertical", gap=8,
        Stat(label="HR", value="72", unit="bpm", trend="stable"),
        Stat(label="BP", value="120/78", unit="mmHg"),
        Stat(label="RR", value="16", unit="/min")
      )
    ),
    Card(title="Lab Trends", variant="outlined",
      LineChart(
        data=[{label:"Day 1", value:7.1}, {label:"Day 2", value:7.4}, {label:"Day 3", value:7.2}],
        title="WBC Trend"
      )
    ),
    Card(title="Medications", variant="outlined",
      Table(
        columns=[{key:"drug", label:"Drug"}, {key:"dose", label:"Dose"}],
        rows=[{drug:"Lisinopril", dose:"10mg daily"}, {drug:"Metformin", dose:"500mg BID"}],
        compact=true
      )
    ),
    Card(title="Alerts", variant="outlined",
      Alert(title="A1c overdue", message="Last HbA1c was 8 months ago.", variant="warning")
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview — Patient Dashboard</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Grid — 2-Column Dashboard</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Patient Dashboard</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--2" style="gap: 16px;">
            <div class="lm-card lm-card--outlined">
              <div class="lm-card__header">
                <div class="lm-card__title">Vital Signs</div>
              </div>
              <div class="lm-card__body">
                <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
                  <div class="lm-stat">
                    <span class="lm-stat__label">HR</span>
                    <div class="lm-stat__value-row">
                      <span class="lm-stat__value">72</span>
                      <span class="lm-stat__unit">bpm</span>
                    </div>
                  </div>
                  <div class="lm-stat">
                    <span class="lm-stat__label">BP</span>
                    <div class="lm-stat__value-row">
                      <span class="lm-stat__value">120/78</span>
                      <span class="lm-stat__unit">mmHg</span>
                    </div>
                  </div>
                  <div class="lm-stat">
                    <span class="lm-stat__label">RR</span>
                    <div class="lm-stat__value-row">
                      <span class="lm-stat__value">16</span>
                      <span class="lm-stat__unit">/min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="lm-card lm-card--outlined">
              <div class="lm-card__header">
                <div class="lm-card__title">Medications</div>
              </div>
              <div class="lm-card__body">
                <table class="lm-table lm-table--compact">
                  <thead>
                    <tr><th>Drug</th><th>Dose</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Lisinopril</td><td>10mg daily</td></tr>
                    <tr><td>Metformin</td><td>500mg BID</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="lm-card lm-card--outlined">
              <div class="lm-card__header">
                <div class="lm-card__title">Lab Trends</div>
              </div>
              <div class="lm-card__body">
                <div class="lm-stack lm-stack--vertical lm-stack--gap-4">
                  <div class="lm-stat">
                    <span class="lm-stat__label">WBC Trend</span>
                    <div class="lm-stat__value-row">
                      <span class="lm-stat__value">7.2</span>
                      <span class="lm-stat__unit">K/uL</span>
                    </div>
                    <span class="lm-stat__change lm-stat__change--neutral">&#8596; stable</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="lm-card lm-card--outlined">
              <div class="lm-card__header">
                <div class="lm-card__title">Alerts</div>
              </div>
              <div class="lm-card__body">
                <div class="lm-alert lm-alert--warning">
                  <span class="lm-alert__icon">&#9888;</span>
                  <div class="lm-alert__content">
                    <div class="lm-alert__title">A1c overdue</div>
                    <div class="lm-alert__message">Last HbA1c was 8 months ago.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- Grid cells are always equal width. For unequal-width layouts, use SplitView (two panes) or nested Stacks.
- On very narrow viewports, the renderer may reduce the column count to prevent content from becoming unreadably small. This behavior is automatic.
- A Grid with `columns=1` is equivalent to a vertical Stack with the same gap.
- Grid is the recommended component for dashboard-style layouts with 2-4 columns.
