---
title: "Select"
description: "Dropdown selector for choosing from a list of predefined options."
weight: 2
tags: [lumen-ui, select, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Select renders a dropdown menu that lets the user choose one value from a predefined list. Options can be provided as simple strings or as `{label, value}` objects when the display text differs from the underlying value. When the selection changes, Select dispatches a `submitForm` action with the field's `id` and selected `value`.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Allergy Entry</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Allergy Entry</div>
          <div class="lm-card__description">Document a new allergy for this patient</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:14px;">
            <div class="lm-form-group">
              <label class="lm-form-label">Allergen</label>
              <input class="lm-input" type="text" placeholder="e.g. Penicillin">
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Reaction Type</label>
              <select class="lm-select">
                <option value="" disabled selected>Select reaction</option>
                <option value="anaphylaxis">Anaphylaxis</option>
                <option value="rash">Rash</option>
                <option value="gi_upset">GI Upset</option>
                <option value="angioedema">Angioedema</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Severity</label>
              <select class="lm-select">
                <option value="" disabled selected>Select severity</option>
                <option value="mild">Mild — localized</option>
                <option value="moderate">Moderate — systemic</option>
                <option value="severe">Severe — life-threatening</option>
              </select>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Department</label>
              <select class="lm-select">
                <option value="" disabled selected>Select department</option>
                <option value="em">Emergency Medicine</option>
                <option value="im">Internal Medicine</option>
                <option value="gs">General Surgery</option>
                <option value="peds">Pediatrics</option>
              </select>
              <span class="lm-form-hint">Department that documented the allergy</span>
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
| `label` | string | — | Label text displayed above the dropdown. |
| `options` | array | — | **Required.** Array of strings or `{label, value}` objects defining the available choices. |
| `value` | string | — | Currently selected value. |
| `placeholder` | string | — | Hint text shown when no option is selected. |
| `disabled` | bool | `false` | When true, the dropdown is non-interactive and visually dimmed. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
Select(id="blood_type", label="Blood Type", options=["A+","A-","B+","B-","AB+","AB-","O+","O-"], placeholder="Select blood type")
```

## JSON Example

```json
{
  "type": "select",
  "props": {
    "id": "blood_type",
    "label": "Blood Type",
    "placeholder": "Select blood type",
    "options": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  }
}
```

Using `{label, value}` objects for options with distinct display text and submission values:

```json
{
  "type": "select",
  "props": {
    "id": "department",
    "label": "Department",
    "options": [
      {"label": "Emergency Medicine", "value": "em"},
      {"label": "Internal Medicine", "value": "im"},
      {"label": "General Surgery", "value": "gs"},
      {"label": "Pediatrics", "value": "peds"}
    ]
  }
}
```

## Composition

```
Card(title="Allergy Entry",
  Stack(direction="vertical", gap=12,
    Input(id="allergen", label="Allergen", placeholder="e.g. Penicillin"),
    Select(id="reaction_type", label="Reaction Type", options=["Anaphylaxis","Rash","GI Upset","Angioedema","Other"], placeholder="Select reaction"),
    Select(id="severity", label="Severity", options=[
      {label: "Mild — localized", value: "mild"},
      {label: "Moderate — systemic", value: "moderate"},
      {label: "Severe — life-threatening", value: "severe"}
    ]),
    Checkbox(id="confirmed", label="Allergy confirmed by testing")
  )
)
```

## Notes

- When `options` are simple strings, the string serves as both the display label and the submitted value.
- Use `{label, value}` objects when the user-facing text should differ from the programmatic value — for example, displaying "Emergency Medicine" while submitting `"em"`.
- If `value` does not match any option, the dropdown shows the `placeholder` text (or blank if no placeholder is set).
- The dropdown renders using the platform's native select on mobile and a custom overlay on desktop.
