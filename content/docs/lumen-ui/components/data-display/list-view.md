---
title: "ListView"
description: "Bulleted, numbered, or checklist-style list of items."
weight: 7
tags: [lumen-ui, list-view, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `ListView` component renders an ordered or unordered list of items. It supports four marker styles — bullet, numbered, check (green checkmark icons), and none — with configurable vertical gap. Items can be plain strings or objects with `text` and optional `description` fields for two-line entries.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `array` | *required* | Array of strings or `{text, description?}` objects. |
| `variant` | `enum` | `"bullet"` | Marker style. Options: `bullet`, `numbered`, `check`, `none`. |
| `gap` | `number` | `6` | Vertical spacing in logical pixels between items. |

## DSL Example

```
ListView(
  items=[
    "Take medications as prescribed",
    "Follow up in 7 days for wound check",
    "Call if fever exceeds 101.5F or pain increases",
    "Avoid heavy lifting for 2 weeks"
  ],
  variant="numbered",
  gap=8
)
```

## Live Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">ListView — Post-Op Instructions</span>
    </div>
    <div class="lumen-demo__content lm">
      <ol class="lm-list-view">
        <li>Take medications as prescribed</li>
        <li>Follow up in 7 days for wound check</li>
        <li>Call if fever exceeds 101.5&deg;F or pain increases</li>
        <li>Avoid heavy lifting for 2 weeks</li>
      </ol>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "list_view",
  "props": {
    "items": [
      "Take medications as prescribed",
      "Follow up in 7 days for wound check",
      "Call if fever exceeds 101.5F or pain increases",
      "Avoid heavy lifting for 2 weeks"
    ],
    "variant": "numbered",
    "gap": 8
  }
}
```

## Composition

Discharge instructions card with a checklist:

```
Card(title="Discharge Instructions",
  Alert(title="Important", message="Review all items before leaving.", variant="info"),
  ListView(
    items=[
      {text:"Medications reviewed", description:"Metformin 1000mg BID, Lisinopril 10mg daily"},
      {text:"Follow-up scheduled", description:"Dr. Smith, March 24 at 10:00 AM"},
      {text:"Activity restrictions explained", description:"No heavy lifting for 14 days"},
      {text:"Warning signs reviewed", description:"Fever, redness, increasing pain"}
    ],
    variant="check",
    gap=10
  )
)
```

## Composition Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card + Alert + ListView — Discharge Checklist</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header"><div class="lm-card__title">Discharge Instructions</div></div>
        <div class="lm-card__body">
          <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:8px;background:rgba(88,101,242,0.08);border:1px solid rgba(88,101,242,0.2);margin-bottom:14px;">
            <span style="font-size:16px;">&#9432;</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:2px;">Important</div>
              <div style="font-size:13px;color:var(--text-secondary);">Review all items before leaving.</div>
            </div>
          </div>
          <ul class="lm-list-view lm-list-view--checklist">
            <li><strong>Medications reviewed</strong><br><span style="font-size:12px;color:var(--text-secondary);">Metformin 1000mg BID, Lisinopril 10mg daily</span></li>
            <li><strong>Follow-up scheduled</strong><br><span style="font-size:12px;color:var(--text-secondary);">Dr. Smith, March 24 at 10:00 AM</span></li>
            <li><strong>Activity restrictions explained</strong><br><span style="font-size:12px;color:var(--text-secondary);">No heavy lifting for 14 days</span></li>
            <li><strong>Warning signs reviewed</strong><br><span style="font-size:12px;color:var(--text-secondary);">Fever, redness, increasing pain</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- **Rich items**: When items are objects with `text` and `description` fields, the text is rendered in the body style and the description in a smaller, muted caption below it.
- **Check variant**: Renders a green checkmark icon (success color) instead of a text marker. Useful for completed steps or confirmed items.
- **None variant**: No marker is rendered, just the text with consistent indentation removed. Useful when the list is wrapped inside another component that provides its own structure.
- **Type name**: The JSON `type` field is `list_view` (snake_case), matching the DSL name `ListView`.
- **Empty state**: If `items` is an empty array, the component renders nothing.
