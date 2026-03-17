---
title: "Separator"
description: "Divider line with optional text label."
weight: 8
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "2 min"
last_reviewed: "2026-03-17"
---

Separator renders a thin divider line to visually separate groups of content. It can optionally display a text label centered on the line. Use Separator between logical sections within a card or stack to improve scannability without introducing a full heading.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Direction of the divider line. Horizontal spans the full width; vertical spans the full height of its parent. |
| `label` | string | — | Optional text displayed centered on the divider line. The line breaks around the label text. |

**Children:** No. Separator is a leaf component.

## DSL Example

```
Separator(label="Additional Information")
```

## JSON Example

```json
{
  "type": "separator",
  "props": {
    "label": "Additional Information"
  }
}
```

## Composition

```
Card(title="Discharge Summary",
  Stack(direction="vertical", gap=12,
    Section(title="Hospital Course",
      Markdown(content="Patient underwent uncomplicated laparoscopic cholecystectomy on hospital day 1. Post-operative course was unremarkable. Tolerating regular diet by POD1.")
    ),
    Separator(label="Discharge Instructions"),
    Markdown(content="""
    1. Resume normal diet as tolerated
    2. No heavy lifting (>10 lbs) for 2 weeks
    3. Incision care: keep clean and dry for 48 hours
    4. Follow up with surgery clinic in 2 weeks
    """),
    Separator(),
    Section(title="Medications at Discharge",
      Table(
        columns=[{key:"med", label:"Medication"}, {key:"dose", label:"Dose"}, {key:"freq", label:"Frequency"}],
        rows=[
          {med:"Acetaminophen", dose:"500mg", freq:"Q6H PRN"},
          {med:"Ondansetron", dose:"4mg", freq:"Q8H PRN"}
        ]
      )
    )
  )
)
```

## Notes

- A Separator with no props renders as a simple horizontal line — the most common usage.
- Vertical separators are useful inside horizontal Stacks or SplitViews to create a visual divider between panes.
- The label text is rendered in a muted foreground color with a small font size.
- Separator adds no additional spacing of its own. Control spacing with the parent Stack's `gap` or by adding explicit spacing.
