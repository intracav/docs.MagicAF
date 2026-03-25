---
title: "Card"
description: "Bordered container with optional title, description, and variant styling."
weight: 1
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The Card is the most common layout component in Lumen UI. It provides a bordered, padded container that groups related content under an optional title and description. Use cards to visually separate distinct sections of information — lab panels, patient summaries, clinical notes, or any discrete content block.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | — | Optional heading displayed at the top of the card. |
| `description` | string | — | Optional subtitle or secondary text below the title. |
| `variant` | `"default"` \| `"outlined"` \| `"elevated"` \| `"ghost"` | `"default"` | Visual style. `default` has a subtle background and border. `outlined` uses a prominent border with no fill. `elevated` adds a drop shadow. `ghost` renders with no border or background. |

**Children:** Yes. Any components placed as children render inside the card body below the title.

## DSL Example

```
Card(title="Patient Summary", variant="elevated",
  Stat(label="Age", value="67"),
  Stat(label="Sex", value="Male"),
  Stat(label="BMI", value="24.3")
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card — Elevated Variant</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Patient Summary</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--horizontal lm-stack--gap-24">
            <div class="lm-stat">
              <span class="lm-stat__label">Age</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">67</span>
              </div>
            </div>
            <div class="lm-stat">
              <span class="lm-stat__label">Sex</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">Male</span>
              </div>
            </div>
            <div class="lm-stat">
              <span class="lm-stat__label">BMI</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">24.3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

### Variant Gallery

<div class="lumen-demo">
  <div class="lumen-demo__label">All Four Card Variants</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card Variants</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--2" style="gap: 16px;">
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Default</div>
            <p class="lm-card__description">Subtle background with border</p>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">Heart Rate</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">72</span>
                <span class="lm-stat__unit">bpm</span>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-card lm-card--outlined">
          <div class="lm-card__header">
            <div class="lm-card__title">Outlined</div>
            <p class="lm-card__description">Prominent border, no fill</p>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">Blood Pressure</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">128/82</span>
                <span class="lm-stat__unit">mmHg</span>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-card lm-card--elevated">
          <div class="lm-card__header">
            <div class="lm-card__title">Elevated</div>
            <p class="lm-card__description">Drop shadow, no border</p>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">Temperature</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">37.1</span>
                <span class="lm-stat__unit">&deg;C</span>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-card lm-card--ghost">
          <div class="lm-card__header">
            <div class="lm-card__title">Ghost</div>
            <p class="lm-card__description">No border or background</p>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">SpO2</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">98</span>
                <span class="lm-stat__unit">%</span>
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
  "type": "card",
  "props": {
    "title": "Patient Summary",
    "variant": "elevated"
  },
  "children": [
    {"type": "stat", "label": "Age", "value": "67"},
    {"type": "stat", "label": "Sex", "value": "Male"},
    {"type": "stat", "label": "BMI", "value": "24.3"}
  ]
}
```

## Composition

```
Grid(columns=2, gap=16,
  Card(title="Vital Signs", variant="outlined",
    Table(
      columns=[{key:"vital", label:"Vital"}, {key:"value", label:"Value"}],
      rows=[
        {vital:"HR", value:"78 bpm"},
        {vital:"BP", value:"128/82 mmHg"},
        {vital:"SpO2", value:"97%"}
      ],
      compact=true
    )
  ),
  Card(title="Active Medications", variant="outlined",
    Stack(direction="vertical", gap=8,
      Badge(text="Lisinopril 10mg", variant="info"),
      Badge(text="Metformin 500mg", variant="info"),
      Badge(text="Atorvastatin 20mg", variant="info")
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card — Composition with Grid</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--2" style="gap: 16px;">
        <div class="lm-card lm-card--outlined">
          <div class="lm-card__header">
            <div class="lm-card__title">Vital Signs</div>
          </div>
          <div class="lm-card__body">
            <table class="lm-table lm-table--compact">
              <thead>
                <tr><th>Vital</th><th>Value</th></tr>
              </thead>
              <tbody>
                <tr><td>HR</td><td>78 bpm</td></tr>
                <tr><td>BP</td><td>128/82 mmHg</td></tr>
                <tr><td>SpO2</td><td>97%</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="lm-card lm-card--outlined">
          <div class="lm-card__header">
            <div class="lm-card__title">Active Medications</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
              <span class="lm-badge lm-badge--info">Lisinopril 10mg</span>
              <span class="lm-badge lm-badge--info">Metformin 500mg</span>
              <span class="lm-badge lm-badge--info">Atorvastatin 20mg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- A Card with no `title` and no `description` renders as a plain container — useful for visual grouping without a header.
- The `ghost` variant is useful for nesting cards inside other cards without doubling up borders.
- Cards are the standard top-level wrapper for most artifacts. When in doubt, wrap content in a Card.
- During streaming, a Card renders as soon as its type is parsed, even before children arrive. The title appears first, and children fill in progressively.
