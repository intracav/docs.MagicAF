---
title: "Stack"
description: "Flex layout container for vertical or horizontal arrangement of children."
weight: 2
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Stack arranges its children along a single axis — either vertically (top to bottom) or horizontally (left to right). It is the primary tool for linear flow layouts. Use Stack when you need to control spacing and alignment between sibling components without the overhead of a full grid.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `direction` | `"vertical"` \| `"horizontal"` | `"vertical"` | Axis along which children are laid out. |
| `gap` | number | — | Space in logical pixels between each child. |
| `align` | string | — | Cross-axis alignment. For a horizontal stack: `"top"`, `"center"`, `"bottom"`, `"stretch"`. For a vertical stack: `"start"`, `"center"`, `"end"`, `"stretch"`. |

**Children:** Yes. Any number of child components, rendered in order along the chosen axis.

## DSL Example

```
Stack(direction="horizontal", gap=16,
  Stat(label="Systolic", value="128", unit="mmHg"),
  Stat(label="Diastolic", value="82", unit="mmHg"),
  Stat(label="MAP", value="97", unit="mmHg")
)
```

## JSON Example

```json
{
  "type": "stack",
  "props": {
    "direction": "horizontal",
    "gap": 16
  },
  "children": [
    {"type": "stat", "label": "Systolic", "value": "128", "unit": "mmHg"},
    {"type": "stat", "label": "Diastolic", "value": "82", "unit": "mmHg"},
    {"type": "stat", "label": "MAP", "value": "97", "unit": "mmHg"}
  ]
}
```

## Composition

```
Card(title="Post-Op Day 1 Summary",
  Stack(direction="vertical", gap=16,
    Stack(direction="horizontal", gap=12, align="center",
      Badge(text="Stable", variant="success"),
      Badge(text="Floor", variant="default")
    ),
    Separator(),
    Stack(direction="horizontal", gap=16,
      Stat(label="Temp", value="37.2", unit="°C"),
      Stat(label="HR", value="74", unit="bpm"),
      Stat(label="UOP", value="1.2", unit="mL/kg/hr")
    ),
    Markdown(content="Patient tolerating clear liquids. Ambulated twice. Pain controlled with scheduled acetaminophen.")
  )
)
```

## Notes

- A vertical Stack with no gap behaves like a plain column — children are packed together with no spacing.
- Horizontal stacks do not wrap. If you need responsive wrapping behavior, use Grid instead.
- Stack is often the first component nested inside a Card to arrange its contents.
- The `align` prop maps to Flutter's `CrossAxisAlignment`. If omitted, the renderer uses `start` for vertical and `center` for horizontal.
