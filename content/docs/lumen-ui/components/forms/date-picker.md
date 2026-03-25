---
title: "DatePicker"
description: "Date selection field with ISO-format output."
weight: 6
tags: [lumen-ui, date-picker, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

DatePicker renders a date input field that lets the user select a calendar date. The selected value is always formatted as an ISO 8601 date string (`YYYY-MM-DD`). When the date changes, DatePicker dispatches a `submitForm` action with the field's `id` and the formatted date `value`.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Medication History</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Medication History</div>
          <div class="lm-card__description">Record current and past medications</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:14px;">
            <div class="lm-form-group">
              <label class="lm-form-label">Medication</label>
              <input class="lm-input" type="text" placeholder="e.g. Lisinopril 10mg">
            </div>
            <div class="lm-stack lm-stack--horizontal" style="gap:12px;">
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">Start Date</label>
                <div class="lm-date-picker">
                  <input class="lm-input" type="date" value="2025-11-01">
                  <span class="lm-date-picker__icon">&#128197;</span>
                </div>
              </div>
              <div class="lm-form-group" style="flex:1;">
                <label class="lm-form-label">End Date</label>
                <div class="lm-date-picker">
                  <input class="lm-input" type="date" placeholder="YYYY-MM-DD">
                  <span class="lm-date-picker__icon">&#128197;</span>
                </div>
              </div>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Symptom Onset Date</label>
              <div class="lm-date-picker">
                <input class="lm-input" type="date" value="2026-03-10">
                <span class="lm-date-picker__icon">&#128197;</span>
              </div>
              <span class="lm-form-hint">ISO 8601 format (YYYY-MM-DD)</span>
            </div>
            <div class="lm-checkbox">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>Currently taking this medication</span>
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
| `label` | string | — | Label text displayed above the date field. |
| `value` | string | — | Current date in ISO format (`YYYY-MM-DD`). |
| `disabled` | bool | `false` | When true, the date picker is non-interactive and visually dimmed. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
DatePicker(id="symptom_onset", label="Symptom Onset Date", value="2026-03-10")
```

## JSON Example

```json
{
  "type": "date_picker",
  "props": {
    "id": "symptom_onset",
    "label": "Symptom Onset Date",
    "value": "2026-03-10"
  }
}
```

## Composition

```
Card(title="Medication History",
  Stack(direction="vertical", gap=12,
    Input(id="med_name", label="Medication", placeholder="e.g. Lisinopril 10mg"),
    Stack(direction="horizontal", gap=12,
      DatePicker(id="start_date", label="Start Date", value="2025-11-01"),
      DatePicker(id="end_date", label="End Date")
    ),
    Select(id="frequency", label="Frequency", options=["Once daily","Twice daily","Three times daily","As needed","Weekly"], placeholder="Select frequency"),
    Checkbox(id="current", label="Currently taking this medication")
  )
)
```

## Notes

- The `value` prop must be in `YYYY-MM-DD` format. Other date formats are not supported and will render as empty.
- The JSON type is `date_picker` (snake_case), matching the DSL name `DatePicker` (PascalCase).
- On desktop, DatePicker renders a calendar overlay. On mobile, it delegates to the platform's native date picker.
- To collect a date range, use two DatePicker components side by side — one for the start date and one for the end date.
