---
title: "Markdown"
description: "Renders markdown-formatted text with themed styling."
weight: 4
tags: [lumen-ui, markdown, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `Markdown` component renders markdown text into styled Flutter widgets. It supports headings, bold/italic text, inline code, code blocks, blockquotes, lists, tables, and horizontal rules — all themed to match the current Lumen theme. This is the primary component for rendering free-form text content from LLM output.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `string` | *required* | The markdown text to render. Can also be provided via the node's `text` field. |
| `selectable` | `bool` | `true` | Whether the rendered text is selectable by the user. |

## DSL Example

```
Markdown(content="""
## Discharge Summary

Patient **Jane Doe** (MRN: 12345) was admitted on 2026-03-15 for acute appendicitis.

### Procedure
- Laparoscopic appendectomy performed without complications
- Estimated blood loss: < 50 mL

### Follow-Up
1. Return to clinic in 7 days for wound check
2. Resume normal diet as tolerated
3. Call if fever > 101.5F or increasing pain
""")
```

## JSON Example

```json
{
  "type": "markdown",
  "props": {
    "content": "## Discharge Summary\n\nPatient **Jane Doe** (MRN: 12345) was admitted on 2026-03-15.\n\n### Follow-Up\n1. Return in 7 days\n2. Resume normal diet\n3. Call if fever > 101.5F",
    "selectable": true
  }
}
```

## Composition

A clinical note card combining `Markdown` with structured data:

```
Card(title="Encounter Note",
  KeyValue(
    items=[
      {key:"Provider", value:"Dr. Smith"},
      {key:"Date", value:"2026-03-17"},
      {key:"Type", value:"Follow-Up Visit"}
    ],
    layout="inline"
  ),
  Markdown(content="""
### Assessment
Patient presents with well-controlled type 2 diabetes. HbA1c improved from 8.2% to 7.1%.

### Plan
- Continue metformin 1000mg BID
- Recheck HbA1c in 3 months
- Referral to ophthalmology for annual screening
""")
)
```

## Notes

- **Content source**: The component reads markdown from the `content` prop first. If that is absent, it falls back to the node's `text` field. This allows both explicit prop-based content and implicit text content.
- **Themed elements**: All markdown elements (headings, code, blockquotes, tables, list bullets, horizontal rules) are styled using the current `LumenThemeData`. No custom CSS is needed.
- **Selectable text**: Defaults to `true`. Set `selectable=false` to prevent text selection, which can be useful in contexts where selection interferes with scrolling or drag interactions.
- **Triple-quoted strings**: Use the DSL's triple-quote syntax (`"""..."""`) for multi-line markdown content to avoid escape sequences.
