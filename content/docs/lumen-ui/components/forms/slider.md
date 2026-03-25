---
title: "Slider"
description: "Numeric range slider with configurable min, max, and step."
weight: 5
tags: [lumen-ui, slider, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Slider renders a draggable track for selecting a numeric value within a defined range. It is well suited for pain scores, dosage adjustments, and any continuous or stepped numeric input where a visual position conveys magnitude. When the user releases the slider, it dispatches a `submitForm` action with the field's `id` and the selected numeric `value`.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Sedation Assessment</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Sedation Assessment</div>
          <div class="lm-card__description">RASS and CAM-ICU scoring</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:20px;">
            <div class="lm-form-group">
              <label class="lm-form-label">NRS Pain Score (0 - 10)</label>
              <div class="lm-slider">
                <div class="lm-slider__track">
                  <div class="lm-slider__fill" style="width:50%;"></div>
                  <div class="lm-slider__thumb" style="left:50%;"></div>
                </div>
                <div class="lm-slider__labels">
                  <span>0 — No pain</span>
                  <span>5</span>
                  <span>10 — Worst</span>
                </div>
              </div>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">RASS Score (-5 to +4)</label>
              <div class="lm-slider">
                <div class="lm-slider__track">
                  <div class="lm-slider__fill" style="width:56%;"></div>
                  <div class="lm-slider__thumb" style="left:56%;"></div>
                </div>
                <div class="lm-slider__labels">
                  <span>-5 Unarousable</span>
                  <span>0 Alert</span>
                  <span>+4 Combative</span>
                </div>
              </div>
              <span class="lm-form-hint">Richmond Agitation-Sedation Scale</span>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">CAM-ICU Score (0 - 7)</label>
              <div class="lm-slider">
                <div class="lm-slider__track">
                  <div class="lm-slider__fill" style="width:0%;"></div>
                  <div class="lm-slider__thumb" style="left:0%;"></div>
                </div>
                <div class="lm-slider__labels">
                  <span>0</span>
                  <span>7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Unique identifier used in the dispatched action payload. |
| `label` | string | — | Label text displayed above the slider. |
| `min` | number | `0` | Minimum allowed value. |
| `max` | number | `100` | Maximum allowed value. |
| `value` | number | — | Current slider position. |
| `step` | number | `1` | Increment between valid values. |
| `showValue` | bool | `true` | Whether to display the current numeric value next to the slider. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
Slider(id="pain_score", label="Pain Score (0-10)", min=0, max=10, value=5, step=1)
```

## JSON Example

```json
{
  "type": "slider",
  "props": {
    "id": "pain_score",
    "label": "Pain Score (0-10)",
    "min": 0,
    "max": 10,
    "value": 5,
    "step": 1,
    "showValue": true
  }
}
```

## Composition

```
Card(title="Sedation Assessment",
  Stack(direction="vertical", gap=16,
    Slider(id="rass", label="RASS Score", min=-5, max=4, value=0, step=1),
    Slider(id="cam_score", label="CAM-ICU Score", min=0, max=7, value=0, step=1),
    Separator(),
    Stack(direction="horizontal", gap=12,
      StatusBadge(status="success", label="No Delirium"),
      Badge(text="RASS 0: Alert and Calm", variant="default")
    )
  )
)
```

## Notes

- When `showValue` is true, the current numeric value renders inline next to the slider track, updating in real-time as the user drags.
- The `step` prop controls granularity. Use `step=0.1` for decimal precision or `step=5` for coarse adjustments.
- If `value` falls outside the `min`/`max` range, the slider clamps it to the nearest boundary.
- For clinical scoring systems (NRS, RASS, GCS), set `min`, `max`, and `step` to match the scale exactly.
