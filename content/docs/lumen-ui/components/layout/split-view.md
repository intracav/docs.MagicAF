---
title: "SplitView"
description: "Two-pane layout with adjustable width ratio."
weight: 10
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

SplitView divides its content area into two side-by-side panes with a configurable width ratio. The first child occupies the left pane and the second child occupies the right pane. Use SplitView for master-detail layouts, side-by-side comparisons, or any situation where two content areas should share horizontal space at a specific proportion.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ratio` | number | `0.5` | Fraction of total width allocated to the left pane, from `0.0` to `1.0`. For example, `0.6` gives 60% to the left pane and 40% to the right. |
| `gap` | number | — | Space in logical pixels between the two panes. |

**Children:** Expects exactly 2 children. The first child renders in the left pane, the second in the right pane. If more than 2 children are provided, extras are ignored. If fewer than 2, the missing pane is empty.

## DSL Example

```
SplitView(ratio=0.6, gap=16,
  Card(title="Patient Information",
    Stack(direction="vertical", gap=8,
      KeyValue(items=[
        {key:"Name", value:"Maria Santos"},
        {key:"DOB", value:"1958-11-23"},
        {key:"MRN", value:"00482916"},
        {key:"PCP", value:"Dr. James Chen"}
      ])
    )
  ),
  Card(title="Clinical Notes",
    Markdown(content="Patient presents for evaluation of persistent lower back pain radiating to the left leg. Symptoms began 3 weeks ago without antecedent trauma. Pain is worse with sitting and improves with walking.")
  )
)
```

## JSON Example

```json
{
  "type": "split_view",
  "props": {
    "ratio": 0.6,
    "gap": 16
  },
  "children": [
    {
      "type": "card",
      "title": "Patient Information",
      "children": [
        {
          "type": "key_value",
          "items": [
            {"key": "Name", "value": "Maria Santos"},
            {"key": "DOB", "value": "1958-11-23"},
            {"key": "MRN", "value": "00482916"}
          ]
        }
      ]
    },
    {
      "type": "card",
      "title": "Clinical Notes",
      "children": [
        {
          "type": "markdown",
          "content": "Patient presents for evaluation of persistent lower back pain."
        }
      ]
    }
  ]
}
```

## Composition

```
Card(title="Medication Reconciliation",
  SplitView(ratio=0.5, gap=16,
    Card(title="Home Medications", variant="outlined",
      ScrollArea(maxHeight=350,
        Table(
          columns=[{key:"drug", label:"Drug"}, {key:"dose", label:"Dose"}, {key:"route", label:"Route"}],
          rows=[
            {drug:"Lisinopril", dose:"10mg", route:"PO daily"},
            {drug:"Metformin", dose:"500mg", route:"PO BID"},
            {drug:"Atorvastatin", dose:"20mg", route:"PO QHS"},
            {drug:"Aspirin", dose:"81mg", route:"PO daily"},
            {drug:"Omeprazole", dose:"20mg", route:"PO daily"}
          ],
          striped=true
        )
      )
    ),
    Card(title="Inpatient Orders", variant="outlined",
      ScrollArea(maxHeight=350,
        Stack(direction="vertical", gap=8,
          Alert(title="New", message="Enoxaparin 40mg SQ daily — DVT prophylaxis", variant="info"),
          Alert(title="Held", message="Metformin — held for contrast study", variant="warning"),
          Alert(title="Continued", message="Lisinopril 10mg PO daily", variant="default"),
          Alert(title="Continued", message="Atorvastatin 20mg PO QHS", variant="default"),
          Alert(title="Continued", message="Aspirin 81mg PO daily", variant="default")
        )
      )
    )
  )
)
```

## Notes

- On narrow viewports (mobile), SplitView collapses to a vertical stack with both panes at full width. The left pane renders above the right pane.
- A `ratio` of `0.5` produces two equal-width panes. Values like `0.3` (30/70) or `0.7` (70/30) are common for sidebar/main layouts.
- SplitView does not support more than two panes. For three or more columns, use Grid.
- Nesting SplitViews is possible but not recommended — use Grid for multi-column layouts instead.
- If `gap` is omitted, the panes are placed directly adjacent with no spacing.
