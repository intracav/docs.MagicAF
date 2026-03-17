---
title: "TextArea"
description: "Multi-line text input for longer-form content."
weight: 8
tags: [lumen-ui, text-area, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

TextArea renders a multi-line text input for collecting longer-form content — clinical notes, assessment narratives, procedure descriptions, or free-text comments. It supports configurable height via the `rows` prop. When the user submits or blurs the field, TextArea dispatches a `submitForm` action with the field's `id` and current `value`.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Unique identifier used in the dispatched action payload. |
| `label` | string | — | Label text displayed above the text area. |
| `placeholder` | string | — | Hint text shown when the field is empty. |
| `value` | string | — | Current text content. |
| `rows` | number | `4` | Number of visible text lines, controlling the default height. |
| `disabled` | bool | `false` | When true, the text area is non-interactive and visually dimmed. |

**Children:** No.

**Action:** Dispatches `submitForm` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
TextArea(id="clinical_notes", label="Clinical Notes", placeholder="Enter assessment findings...", rows=6)
```

## JSON Example

```json
{
  "type": "text_area",
  "props": {
    "id": "clinical_notes",
    "label": "Clinical Notes",
    "placeholder": "Enter assessment findings...",
    "rows": 6
  }
}
```

## Composition

```
Card(title="Discharge Summary",
  Stack(direction="vertical", gap=12,
    Stack(direction="horizontal", gap=12,
      Input(id="discharge_dx", label="Discharge Diagnosis", placeholder="Primary diagnosis"),
      DatePicker(id="discharge_date", label="Discharge Date")
    ),
    TextArea(id="hospital_course", label="Hospital Course", placeholder="Summarize the patient's hospital course...", rows=6),
    TextArea(id="discharge_instructions", label="Patient Instructions", placeholder="Activity restrictions, diet, follow-up...", rows=4),
    Separator(),
    Select(id="disposition", label="Disposition", options=["Home","Home with Services","Skilled Nursing","Rehab","AMA"], placeholder="Select disposition"),
    Checkbox(id="patient_educated", label="Patient/family education completed")
  )
)
```

## Notes

- The `rows` prop sets the initial visible height. The text area does not auto-expand; content scrolls vertically when it exceeds the visible area.
- The JSON type is `text_area` (snake_case), matching the DSL name `TextArea` (PascalCase).
- For single-line text collection, use Input instead. TextArea is intended for multi-line narrative content.
- Line breaks entered by the user are preserved in the dispatched `value`.
