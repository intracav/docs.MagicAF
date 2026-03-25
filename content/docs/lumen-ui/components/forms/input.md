---
title: "Input"
description: "Single-line text input with label, placeholder, type variants, and validation error display."
weight: 1
tags: [lumen-ui, input, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Input renders a single-line text field for collecting short-form user input — patient names, dosages, identifiers, or any scalar value. It supports type variants for email, number, and password entry, and can display inline validation errors. When the user submits or blurs the field, Input dispatches a `submitForm` action with the field's `id` and current `value`.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">New Patient Registration</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">New Patient Registration</div>
          <div class="lm-card__description">Enter patient demographic information</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:14px;">
            <div class="lm-form-group">
              <label class="lm-form-label">Full Name</label>
              <input class="lm-input" type="text" placeholder="Last, First MI">
            </div>
            <div class="lm-stack lm-stack--horizontal" style="gap:12px;">
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">Date of Birth</label>
                <input class="lm-input" type="text" placeholder="MM/DD/YYYY">
              </div>
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">MRN</label>
                <input class="lm-input" type="text" placeholder="Medical record number">
              </div>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Email</label>
              <input class="lm-input" type="email" placeholder="patient@example.com">
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Weight (kg)</label>
              <input class="lm-input" type="number" placeholder="0.0">
              <span class="lm-form-hint">Used for dosage calculations</span>
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
| `id` | string | — | **Required.** Unique identifier used in the dispatched action payload. |
| `label` | string | — | Label text displayed above the input field. |
| `placeholder` | string | — | Hint text shown when the field is empty. |
| `value` | string | — | Current value of the input. |
| `type` | `"text"` \| `"email"` \| `"number"` \| `"password"` | `"text"` | Controls keyboard type and basic validation behavior. |
| `disabled` | bool | `false` | When true, the input is non-interactive and visually dimmed. |
| `error` | string | — | Validation error message displayed below the input in a destructive color. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
Input(id="patient_name", label="Patient Name", placeholder="Enter full name", type="text")
```

## JSON Example

```json
{
  "type": "input",
  "props": {
    "id": "patient_name",
    "label": "Patient Name",
    "placeholder": "Enter full name",
    "type": "text"
  }
}
```

## Composition

```
Card(title="New Patient Registration",
  Stack(direction="vertical", gap=12,
    Input(id="patient_name", label="Full Name", placeholder="Last, First MI"),
    Stack(direction="horizontal", gap=12,
      Input(id="dob", label="Date of Birth", placeholder="MM/DD/YYYY"),
      Input(id="mrn", label="MRN", placeholder="Medical record number")
    ),
    Input(id="email", label="Email", placeholder="patient@example.com", type="email"),
    Input(id="weight_kg", label="Weight (kg)", placeholder="0.0", type="number")
  )
)
```

## Notes

- The `id` prop is required. Without it, the host application cannot identify which field dispatched the action.
- The `error` prop is display-only — validation logic lives in the host application. Set `error` on subsequent renders to show or clear messages.
- The `type` prop affects the soft keyboard on mobile and basic browser-level validation but does not enforce constraints at the component level.
- Input fields are not masked by default. Use `type="password"` for sensitive values like access codes.
