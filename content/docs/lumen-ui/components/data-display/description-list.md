---
title: "DescriptionList"
description: "Definition list with term-description pairs in a bordered list layout."
weight: 9
tags: [lumen-ui, description-list, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `DescriptionList` component renders term-description pairs in a vertical list with a fixed-width term column and an expanding description column. When bordered, items are separated by dividers and alternate rows have a subtle muted background. It is well-suited for structured clinical data like diagnosis summaries, coding details, and configuration panels.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `array` | *required* | Array of objects, each with `term` (string) and `description` (string). |
| `columns` | `number` | `1` | Number of columns for grid layout. |
| `bordered` | `bool` | `true` | Wrap the list in a rounded border with row dividers and alternating row backgrounds. |

## DSL Example

```
DescriptionList(
  items=[
    {term:"Diagnosis", description:"Type 2 Diabetes Mellitus"},
    {term:"ICD-10", description:"E11.9"},
    {term:"Onset", description:"January 2024"},
    {term:"Status", description:"Active"},
    {term:"Provider", description:"Dr. Smith, Endocrinology"}
  ],
  bordered=true
)
```

## JSON Example

```json
{
  "type": "description_list",
  "props": {
    "items": [
      {"term": "Diagnosis", "description": "Type 2 Diabetes Mellitus"},
      {"term": "ICD-10", "description": "E11.9"},
      {"term": "Onset", "description": "January 2024"},
      {"term": "Status", "description": "Active"},
      {"term": "Provider", "description": "Dr. Smith, Endocrinology"}
    ],
    "bordered": true
  }
}
```

## Composition

A procedure summary card using `DescriptionList` with a timeline:

```
Card(title="Procedure Summary",
  DescriptionList(
    items=[
      {term:"Procedure", description:"Laparoscopic Appendectomy"},
      {term:"CPT Code", description:"44970"},
      {term:"Surgeon", description:"Dr. Martinez"},
      {term:"Anesthesia", description:"General"},
      {term:"Duration", description:"47 minutes"},
      {term:"EBL", description:"< 50 mL"},
      {term:"Complications", description:"None"}
    ],
    bordered=true
  ),
  Timeline(events=[
    {title:"Pre-op cleared", variant:"success"},
    {title:"Anesthesia induced", variant:"info"},
    {title:"Procedure completed", variant:"success"},
    {title:"Recovery room", variant:"success"}
  ])
)
```

## Notes

- **Term column width**: The term column has a fixed width of 140px. Descriptions fill the remaining horizontal space.
- **Alternating rows**: When `bordered` is `true`, odd-numbered rows (0-indexed) receive a subtle muted background for visual separation.
- **Bordered layout**: With `bordered=true`, the component is wrapped in a rounded container with a border, row dividers between items, and horizontal/vertical padding. With `bordered=false`, items render with minimal vertical spacing and no border.
- **Type name**: The JSON `type` field is `description_list` (snake_case), matching the DSL name `DescriptionList`.
- **Empty state**: If `items` is an empty array, the component renders nothing.
- **KeyValue vs. DescriptionList**: Both display label-value data. `KeyValue` offers stacked/inline layouts and is suited for short-form demographics. `DescriptionList` is better for longer-form definitions with its wider term column, alternating rows, and bordered container.
