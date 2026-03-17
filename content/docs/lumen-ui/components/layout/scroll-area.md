---
title: "ScrollArea"
description: "Scrollable container with configurable maximum height and direction."
weight: 9
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

ScrollArea wraps its children in a scrollable container with a configurable maximum height. When content exceeds the specified height, a scrollbar appears and the container becomes independently scrollable. Use ScrollArea to constrain long content — large tables, lengthy lab results, or verbose notes — to a fixed region without forcing the entire artifact to grow unbounded.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `maxHeight` | number | — | Maximum height in logical pixels. If content exceeds this height, the area becomes scrollable. If omitted, the container grows to fit its content (no scroll). |
| `direction` | `"vertical"` \| `"horizontal"` | `"vertical"` | Scroll direction. Vertical scrolls up/down; horizontal scrolls left/right. |

**Children:** Yes. Any components placed as children render inside the scrollable area.

## DSL Example

```
ScrollArea(maxHeight=300,
  Table(
    columns=[{key:"test", label:"Test"}, {key:"value", label:"Result"}, {key:"ref", label:"Reference"}, {key:"flag", label:"Flag"}],
    rows=[
      {test:"WBC", value:"7.2 K/uL", ref:"4.5-11.0", flag:""},
      {test:"RBC", value:"4.8 M/uL", ref:"4.5-5.5", flag:""},
      {test:"Hgb", value:"14.1 g/dL", ref:"12.0-16.0", flag:""},
      {test:"Hct", value:"42.3%", ref:"36-46%", flag:""},
      {test:"MCV", value:"88.1 fL", ref:"80-100", flag:""},
      {test:"MCH", value:"29.4 pg", ref:"27-33", flag:""},
      {test:"MCHC", value:"33.3 g/dL", ref:"32-36", flag:""},
      {test:"Plt", value:"245 K/uL", ref:"150-400", flag:""},
      {test:"RDW", value:"13.2%", ref:"11.5-14.5", flag:""},
      {test:"MPV", value:"9.8 fL", ref:"7.4-10.4", flag:""},
      {test:"Neutrophils", value:"62%", ref:"40-70%", flag:""},
      {test:"Lymphocytes", value:"28%", ref:"20-40%", flag:""},
      {test:"Monocytes", value:"7%", ref:"2-8%", flag:""},
      {test:"Eosinophils", value:"2%", ref:"1-4%", flag:""},
      {test:"Basophils", value:"1%", ref:"0-1%", flag:""}
    ],
    striped=true
  )
)
```

## JSON Example

```json
{
  "type": "scroll_area",
  "props": {
    "maxHeight": 300,
    "direction": "vertical"
  },
  "children": [
    {
      "type": "table",
      "columns": [
        {"key": "test", "label": "Test"},
        {"key": "value", "label": "Result"},
        {"key": "ref", "label": "Reference"}
      ],
      "rows": [
        {"test": "WBC", "value": "7.2 K/uL", "ref": "4.5-11.0"},
        {"test": "RBC", "value": "4.8 M/uL", "ref": "4.5-5.5"},
        {"test": "Hgb", "value": "14.1 g/dL", "ref": "12.0-16.0"},
        {"test": "Plt", "value": "245 K/uL", "ref": "150-400"}
      ]
    }
  ]
}
```

## Composition

```
SplitView(ratio=0.5,
  Card(title="Patient Encounters",
    ScrollArea(maxHeight=400,
      Stack(direction="vertical", gap=8,
        Card(variant="outlined", title="2026-03-15 — Follow-up",
          Markdown(content="Routine diabetes follow-up. A1c improved to 6.9%. Continue current regimen.")
        ),
        Card(variant="outlined", title="2026-02-10 — Urgent",
          Markdown(content="Presented with URI symptoms. Rapid strep negative. Supportive care.")
        ),
        Card(variant="outlined", title="2026-01-05 — Annual",
          Markdown(content="Annual wellness visit. Screening labs ordered. Vaccinations up to date.")
        ),
        Card(variant="outlined", title="2025-11-20 — Follow-up",
          Markdown(content="Post-hospitalization follow-up. Wound healing well. Resumed activity.")
        ),
        Card(variant="outlined", title="2025-09-08 — Emergency",
          Markdown(content="Acute cholecystitis. Admitted for laparoscopic cholecystectomy.")
        )
      )
    )
  ),
  Card(title="Selected Encounter Details",
    Markdown(content="Select an encounter from the list to view full details.")
  )
)
```

## Notes

- If `maxHeight` is not specified, ScrollArea behaves as a normal container with no scrolling. Always provide `maxHeight` to enable scroll behavior.
- Horizontal scroll areas are useful for wide tables or timelines that should not wrap. Set `direction="horizontal"` for this behavior.
- The scrollbar style adapts to the platform — thin overlay scrollbars on macOS/web, standard scrollbars on other platforms.
- ScrollArea can be nested inside other layout components (Cards, Tabs, SplitView panes) to constrain specific regions independently.
