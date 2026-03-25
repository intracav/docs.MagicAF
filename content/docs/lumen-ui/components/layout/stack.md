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

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview — Horizontal Stack</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Stack — Horizontal, gap=16</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--horizontal lm-stack--gap-16">
        <div class="lm-stat">
          <span class="lm-stat__label">Systolic</span>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">128</span>
            <span class="lm-stat__unit">mmHg</span>
          </div>
        </div>
        <div class="lm-stat">
          <span class="lm-stat__label">Diastolic</span>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">82</span>
            <span class="lm-stat__unit">mmHg</span>
          </div>
        </div>
        <div class="lm-stat">
          <span class="lm-stat__label">MAP</span>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">97</span>
            <span class="lm-stat__unit">mmHg</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Stack — Nested Vertical + Horizontal</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Post-Op Day 1 Summary</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
            <div class="lm-stack lm-stack--horizontal lm-stack--gap-12" style="align-items: center;">
              <span class="lm-badge lm-badge--success">Stable</span>
              <span class="lm-badge lm-badge--default">Floor</span>
            </div>
            <div class="lm-separator">
              <div class="lm-separator__line"></div>
            </div>
            <div class="lm-stack lm-stack--horizontal lm-stack--gap-16">
              <div class="lm-stat">
                <span class="lm-stat__label">Temp</span>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">37.2</span>
                  <span class="lm-stat__unit">&deg;C</span>
                </div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">HR</span>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">74</span>
                  <span class="lm-stat__unit">bpm</span>
                </div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">UOP</span>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">1.2</span>
                  <span class="lm-stat__unit">mL/kg/hr</span>
                </div>
              </div>
            </div>
            <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">Patient tolerating clear liquids. Ambulated twice. Pain controlled with scheduled acetaminophen.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- A vertical Stack with no gap behaves like a plain column — children are packed together with no spacing.
- Horizontal stacks do not wrap. If you need responsive wrapping behavior, use Grid instead.
- Stack is often the first component nested inside a Card to arrange its contents.
- The `align` prop maps to Flutter's `CrossAxisAlignment`. If omitted, the renderer uses `start` for vertical and `center` for horizontal.
