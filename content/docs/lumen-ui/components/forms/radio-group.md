---
title: "RadioGroup"
description: "Radio button group for single selection from multiple options."
weight: 4
tags: [lumen-ui, radio-group, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

RadioGroup renders a set of mutually exclusive radio buttons under a shared label. Exactly one option can be selected at a time. When the selection changes, RadioGroup dispatches a `submitForm` action with the group's `id` and the selected `value`.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview — click to select</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Pain Assessment</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Pain Assessment</div>
          <div class="lm-card__description">Classify pain type and severity</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:18px;">
            <div class="lm-form-group">
              <label class="lm-form-label">Pain Type</label>
              <div class="lm-radio-group" data-radio-group="pain_type">
                <div class="lm-radio" data-value="acute">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Acute</span>
                </div>
                <div class="lm-radio" data-value="chronic">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Chronic</span>
                </div>
                <div class="lm-radio" data-value="neuropathic">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Neuropathic</span>
                </div>
                <div class="lm-radio" data-value="referred">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Referred</span>
                </div>
              </div>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Severity</label>
              <div class="lm-radio-group" data-radio-group="severity">
                <div class="lm-radio" data-value="mild">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Mild</span>
                </div>
                <div class="lm-radio selected" data-value="moderate">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Moderate</span>
                </div>
                <div class="lm-radio" data-value="severe">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Severe</span>
                </div>
                <div class="lm-radio" data-value="critical">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Critical</span>
                </div>
              </div>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Laterality</label>
              <div class="lm-radio-group" data-radio-group="laterality">
                <div class="lm-radio" data-value="left">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Left</span>
                </div>
                <div class="lm-radio" data-value="right">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Right</span>
                </div>
                <div class="lm-radio" data-value="bilateral">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Bilateral</span>
                </div>
                <div class="lm-radio" data-value="na">
                  <div class="lm-radio__circle"><div class="lm-radio__dot"></div></div>
                  <span>Not Applicable</span>
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
| `label` | string | — | Group label displayed above the radio buttons. |
| `options` | array | — | **Required.** Array of strings or `{label, value}` objects defining the available choices. |
| `value` | string | — | Currently selected value. |
| `disabled` | bool | `false` | When true, all radio buttons are non-interactive. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
RadioGroup(id="severity", label="Pain Severity", options=["Mild","Moderate","Severe","Critical"], value="Moderate")
```

## JSON Example

```json
{
  "type": "radio_group",
  "props": {
    "id": "severity",
    "label": "Pain Severity",
    "options": ["Mild", "Moderate", "Severe", "Critical"],
    "value": "Moderate"
  }
}
```

Using `{label, value}` objects:

```json
{
  "type": "radio_group",
  "props": {
    "id": "laterality",
    "label": "Laterality",
    "options": [
      {"label": "Left", "value": "L"},
      {"label": "Right", "value": "R"},
      {"label": "Bilateral", "value": "B"},
      {"label": "Not Applicable", "value": "NA"}
    ]
  }
}
```

## Composition

```
Card(title="Pain Assessment",
  Stack(direction="vertical", gap=16,
    RadioGroup(id="pain_type", label="Pain Type", options=["Acute","Chronic","Neuropathic","Referred"]),
    RadioGroup(id="severity", label="Severity", options=["Mild","Moderate","Severe","Critical"], value="Moderate"),
    Slider(id="pain_score", label="NRS Pain Score (0-10)", min=0, max=10, value=5, step=1),
    TextArea(id="pain_description", label="Description", placeholder="Location, quality, aggravating/relieving factors...")
  )
)
```

## Notes

- RadioGroup enforces single selection. For independent multi-select, use multiple Checkbox components instead.
- Like Select, `options` can be strings or `{label, value}` objects. Use objects when the display text differs from the submitted value.
- If `value` does not match any option, no radio button is pre-selected.
- The JSON type is `radio_group` (snake_case), matching the DSL name `RadioGroup` (PascalCase).
