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
