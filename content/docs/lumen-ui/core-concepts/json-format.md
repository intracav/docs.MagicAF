---
title: "JSON Format"
description: "The JSON representation of Lumen UI component trees — structure, conventions, and streaming recovery."
weight: 2
tags: [lumen-ui, json, format, parser]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/core-concepts/dsl-syntax/
estimated_reading_time: "6 min"
last_reviewed: "2026-03-17"
---

Lumen UI accepts component trees in JSON as an alternative to the DSL. The parser auto-detects the format — if the input starts with `{` or `[`, JSON parsing is used.

## Structure

A JSON component has the following shape:

```json
{
  "type": "component_type",
  "props": {
    "key": "value"
  },
  "children": [],
  "slots": {},
  "text": "",
  "id": "stable-id"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `type` | Yes | snake_case component type (e.g., `card`, `bar_chart`, `drug_card`) |
| `props` | No | Object of typed properties |
| `children` | No | Array of child component objects |
| `slots` | No | Named child components (e.g., `{"header": {...}, "footer": {...}}`) |
| `text` | No | Raw text content for leaf nodes |
| `id` | No | Stable identifier for keyed rendering during streaming |

## Props: Nested vs. Top-Level

Props can be nested inside a `props` object or placed at the top level alongside `type`. Both are equivalent:

```json
{
  "type": "stat",
  "props": {
    "label": "Heart Rate",
    "value": "72",
    "unit": "bpm"
  }
}
```

```json
{
  "type": "stat",
  "label": "Heart Rate",
  "value": "72",
  "unit": "bpm"
}
```

The parser merges top-level keys into the props map. If both forms are present, `props` takes precedence.

## Children

Child components are an array under `children`:

```json
{
  "type": "card",
  "props": {"title": "Dashboard"},
  "children": [
    {
      "type": "stat",
      "label": "HR",
      "value": "72",
      "unit": "bpm"
    },
    {
      "type": "stat",
      "label": "SpO2",
      "value": "98",
      "unit": "%"
    }
  ]
}
```

## Slots

Named children for components that have specific placement areas:

```json
{
  "type": "card",
  "props": {"title": "Report"},
  "slots": {
    "header": {
      "type": "badge",
      "text": "Draft",
      "variant": "warning"
    }
  },
  "children": [
    {"type": "markdown", "content": "Report body..."}
  ]
}
```

## Multiple Root Components

Wrap multiple top-level components in an array:

```json
[
  {"type": "alert", "title": "Notice", "variant": "info"},
  {"type": "card", "props": {"title": "Content"}, "children": [...]}
]
```

## Streaming Recovery

The JSON parser (`JsonComponentParser`) is designed to handle truncated JSON gracefully. When the LLM is still streaming, the JSON may be incomplete:

```json
{"type":"card","props":{"title":"Results
```

The parser applies recovery:

1. Counts unmatched `{` and `[` braces/brackets
2. Closes unterminated strings with `"`
3. Appends missing `]` and `}` to balance the structure
4. Returns the result with `isPartial: true`

This means partial JSON produces renderable (if incomplete) trees during streaming, just like the DSL parser.

## When to Use JSON vs. DSL

| Consideration | DSL | JSON |
|---------------|-----|------|
| LLM output | Preferred — more token-efficient | Works, but more verbose |
| Programmatic generation | Possible, but string concatenation | Natural fit — use `jsonEncode` |
| Server envelope protocol | Not used | Standard format for `__lumen__` envelopes |
| Readability | More readable for humans | More readable for machines |
| Streaming recovery | Better — more forgiving | Good — auto-balances brackets |

In practice, the DSL is used for LLM-authored content in chat responses (`<lumen>` blocks), while JSON is used for server-side tool results (via the envelope protocol) and programmatic component generation.

## Next Steps

- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — the more compact alternative
- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — how parsed nodes become widgets
- **[Envelope Protocol](/docs/lumen-ui/integration/envelope-protocol/)** — how the server wraps tool results in JSON
