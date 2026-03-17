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

## Notes

- A Card with no `title` and no `description` renders as a plain container — useful for visual grouping without a header.
- The `ghost` variant is useful for nesting cards inside other cards without doubling up borders.
- Cards are the standard top-level wrapper for most artifacts. When in doubt, wrap content in a Card.
- During streaming, a Card renders as soon as its type is parsed, even before children arrive. The title appears first, and children fill in progressively.
