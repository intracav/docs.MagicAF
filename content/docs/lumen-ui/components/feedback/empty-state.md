---
title: "EmptyState"
description: "Placeholder for empty content areas with optional call-to-action."
weight: 6
tags: [lumen-ui, empty-state, feedback]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

EmptyState renders a centered placeholder when a content area has no data to display. It provides a title, optional explanatory message, an icon, and an optional call-to-action button. Use it inside cards, tabs, or panels to guide the user when results are empty — no lab results, no medications, no matching records.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | — | **Required.** Primary heading for the empty state. |
| `message` | string | — | Secondary text providing context or instructions. |
| `icon` | string | — | Material icon name displayed above the title (e.g., `"science"`, `"medication"`, `"search_off"`). |
| `action` | string | — | Label for an optional call-to-action button displayed below the message. |

**Children:** No.

## DSL Example

```
EmptyState(title="No Lab Results", message="No lab results found for this patient", icon="science")
```

## JSON Example

```json
{
  "type": "empty_state",
  "props": {
    "title": "No Lab Results",
    "message": "No lab results found for this patient",
    "icon": "science"
  }
}
```

## Composition

```
Card(title="Patient Record",
  Tabs(labels=["Medications","Labs","Imaging","Notes"],
    Stack(direction="vertical", gap=8,
      Badge(text="Lisinopril 10mg", variant="default"),
      Badge(text="Metformin 500mg", variant="default"),
      Badge(text="Atorvastatin 20mg", variant="default")
    ),
    EmptyState(title="No Lab Results", message="No labs have been ordered or resulted for this encounter.", icon="science", action="Order Labs"),
    EmptyState(title="No Imaging Studies", message="No imaging studies found.", icon="radiology"),
    EmptyState(title="No Clinical Notes", message="No notes have been authored for this encounter.", icon="edit_note", action="Create Note")
  )
)
```

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Empty State</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-empty-state">
<div class="lm-empty-state__icon" style="font-size:36px; opacity:0.4;">&#128300;</div>
<div class="lm-empty-state__title">No Lab Results</div>
<div class="lm-empty-state__message">No labs have been ordered or resulted for this encounter.</div>
<button class="lm-empty-state__action">Order Labs</button>
</div>
</div>
</div>
</div>

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Patient Record</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Patient Record</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">Medications</div>
<div class="lm-stack lm-stack--horizontal lm-stack--gap-8" style="flex-wrap:wrap;">
<span class="lm-badge lm-badge--default">Lisinopril 10mg</span>
<span class="lm-badge lm-badge--default">Metformin 500mg</span>
<span class="lm-badge lm-badge--default">Atorvastatin 20mg</span>
</div>
</div>

<hr style="border:none; border-top:1px solid var(--border); margin:0;">

<div class="lm-empty-state" style="padding:24px 0;">
<div class="lm-empty-state__icon" style="font-size:28px; opacity:0.4;">&#128300;</div>
<div class="lm-empty-state__title">No Lab Results</div>
<div class="lm-empty-state__message">No labs have been ordered or resulted for this encounter.</div>
<button class="lm-empty-state__action">Order Labs</button>
</div>

<hr style="border:none; border-top:1px solid var(--border); margin:0;">

<div class="lm-empty-state" style="padding:24px 0;">
<div class="lm-empty-state__icon" style="font-size:28px; opacity:0.4;">&#128221;</div>
<div class="lm-empty-state__title">No Clinical Notes</div>
<div class="lm-empty-state__message">No notes have been authored for this encounter.</div>
<button class="lm-empty-state__action">Create Note</button>
</div>

</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The JSON type is `empty_state` (snake_case), matching the DSL name `EmptyState` (PascalCase).
- The `icon` prop accepts Material icon names. Common choices for clinical contexts: `"science"` (labs), `"medication"` (meds), `"radiology"` (imaging), `"edit_note"` (notes), `"search_off"` (no results), `"person_off"` (no patient).
- The `action` prop renders a button label. When clicked, it dispatches a `submitForm` action with `{id: "empty_state_action", value: action}` — the host application decides what to do with it.
- EmptyState is vertically centered within its parent container. It works best as the sole child of a Card or Tab panel.
