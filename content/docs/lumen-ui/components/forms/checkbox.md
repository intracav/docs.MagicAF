---
title: "Checkbox"
description: "Checkbox toggle with label and optional help text."
weight: 3
tags: [lumen-ui, checkbox, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Checkbox renders a binary toggle with an adjacent label. It is used for consent confirmations, boolean preferences, and multi-select scenarios where each option is independent. When toggled, Checkbox dispatches a `toggleState` action with the field's `id` and the new boolean `value`.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview — click to toggle</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Pre-Procedure Checklist</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Pre-Procedure Checklist</div>
          <div class="lm-card__description">Confirm all items before proceeding to the OR</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:12px;">
            <div class="lm-checkbox checked">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>Informed consent signed</span>
            </div>
            <div class="lm-checkbox checked">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>Allergies reviewed</span>
            </div>
            <div class="lm-checkbox">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>Recent labs reviewed (CBC, BMP, coags within 30 days)</span>
            </div>
            <div class="lm-checkbox">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>NPO status confirmed</span>
            </div>
            <div class="lm-checkbox">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>Surgical site marked</span>
            </div>
            <div class="lm-checkbox">
              <div class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></div>
              <span>Blood products on hold (if applicable)</span>
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
| `label` | string | — | **Required.** Text displayed next to the checkbox. |
| `checked` | bool | `false` | Whether the checkbox is currently checked. |
| `disabled` | bool | `false` | When true, the checkbox is non-interactive and visually dimmed. |
| `description` | string | — | Help text displayed below the label in a muted style. |

**Children:** No.

**Action:** Dispatches `toggleState` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
Checkbox(id="consent", label="Patient consent obtained", description="Required before procedure")
```

## JSON Example

```json
{
  "type": "checkbox",
  "props": {
    "id": "consent",
    "label": "Patient consent obtained",
    "checked": false,
    "description": "Required before procedure"
  }
}
```

## Composition

```
Card(title="Pre-Procedure Checklist",
  Stack(direction="vertical", gap=8,
    Checkbox(id="consent_signed", label="Informed consent signed", description="Witnessed signature required"),
    Checkbox(id="allergy_reviewed", label="Allergies reviewed"),
    Checkbox(id="labs_checked", label="Recent labs reviewed", description="CBC, BMP, coags within 30 days"),
    Checkbox(id="npo_confirmed", label="NPO status confirmed"),
    Checkbox(id="site_marked", label="Surgical site marked"),
    Separator(),
    Alert(title="Reminder", message="All items must be checked before proceeding to the OR.", variant="info")
  )
)
```

## Notes

- Checkbox dispatches `toggleState` (not `submitForm`) because it represents a binary state change rather than a value submission.
- The `description` prop is useful for regulatory or compliance context — it renders in a smaller, muted font below the label.
- For a group of mutually exclusive options, use RadioGroup instead. Checkboxes are independent — multiple can be checked simultaneously.
- When `disabled` is true and `checked` is true, the checkbox appears checked but cannot be unchecked. This is useful for displaying locked-in selections.
