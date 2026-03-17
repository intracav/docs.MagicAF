---
title: "CodeBlock"
description: "Syntax-highlighted code block with language detection, header, and copy button."
weight: 5
tags: [lumen-ui, code-block, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `CodeBlock` component displays syntax-highlighted source code. It uses `flutter_highlight` with Atom One Dark/Light themes (auto-selected based on the current brightness), renders an optional header with a title or language label, and includes a built-in copy-to-clipboard button.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `code` | `string` | *required* | The source code to display. Can also be provided via the node's `text` field. |
| `language` | `string` | — | Programming language for syntax highlighting (e.g., `"python"`, `"json"`, `"dart"`, `"sql"`). Falls back to `"plaintext"` if omitted. |
| `title` | `string` | — | Header text displayed above the code (e.g., a filename or description). |
| `showLineNumbers` | `bool` | `false` | Display line numbers alongside the code. |

## DSL Example

```
CodeBlock(
  language="json",
  title="FHIR Patient Resource",
  code="""
{
  "resourceType": "Patient",
  "id": "example",
  "name": [{
    "use": "official",
    "family": "Doe",
    "given": ["Jane"]
  }],
  "birthDate": "1985-04-12",
  "gender": "female"
}
""",
  showLineNumbers=true
)
```

## JSON Example

```json
{
  "type": "code_block",
  "props": {
    "language": "sql",
    "title": "Patient Query",
    "code": "SELECT p.name, p.dob, e.diagnosis\nFROM patients p\nJOIN encounters e ON p.id = e.patient_id\nWHERE e.date >= '2026-01-01'\nORDER BY e.date DESC;",
    "showLineNumbers": true
  }
}
```

## Composition

API documentation card showing a request and response:

```
Card(title="RxNorm Lookup API",
  Markdown(content="Query the RxNorm API for drug information by name or RxCUI."),
  CodeBlock(
    language="bash",
    title="Request",
    code="curl -X GET 'https://rxnav.nlm.nih.gov/REST/rxcui.json?name=lisinopril'"
  ),
  CodeBlock(
    language="json",
    title="Response",
    code="""
{
  "idGroup": {
    "name": "lisinopril",
    "rxnormId": ["104377"]
  }
}
"""
  )
)
```

## Notes

- **Code source**: The component reads from the `code` prop first, then falls back to the node's `text` field. This allows both explicit and implicit content.
- **Copy button**: A copy button appears in the header bar. It shows a checkmark with "Copied" feedback for 2 seconds after clicking.
- **Header visibility**: The header row (containing the title/language label and copy button) is only rendered if at least one of `title` or `language` is provided.
- **Horizontal scrolling**: The code content is horizontally scrollable, so long lines are never truncated or wrapped.
- **Theme awareness**: Uses Atom One Dark in dark mode and Atom One Light in light mode, selected automatically from the Lumen theme's brightness.
