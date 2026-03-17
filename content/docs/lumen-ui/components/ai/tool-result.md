---
title: "ToolResult"
description: "Labeled container wrapping tool output content with status and summary."
weight: 2
tags: [lumen-ui, tool-result, ai]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `ToolResult` component provides a labeled wrapper around tool output. It shows the originating tool name, a status indicator, and an optional summary line. The actual result content is rendered as children — any Lumen UI component can be nested inside. Use it to give structure and provenance to data returned by agent tool calls.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tool` | `string` | *required* | Name of the tool that produced this result. |
| `status` | `"success"` \| `"error"` | — | Outcome status. Drives the header color (green for success, red for error). |
| `summary` | `string` | — | Brief result summary displayed in the header (e.g., `"Found 3 results"`). |

**Children:** Yes. Any components placed as children render inside the result body.

## DSL Example

```
ToolResult(
  tool="rxnorm_lookup",
  status="success",
  summary="Found 3 results",
  DrugCard(name="Lisinopril 10 MG Oral Tablet")
)
```

## JSON Example

```json
{
  "type": "tool_result",
  "props": {
    "tool": "rxnorm_lookup",
    "status": "success",
    "summary": "Found 3 results"
  },
  "children": [
    {
      "type": "drug_card",
      "props": {
        "name": "Lisinopril 10 MG Oral Tablet",
        "rxcui": "314076",
        "tty": "SCD"
      }
    }
  ]
}
```

## Composition

A tool call followed by its result, showing a full lookup sequence:

```
Stack(direction="vertical", gap=8,
  ToolCall(name="icd10_lookup", status="completed", primaryArg="Type 2 Diabetes", duration="0.5s"),
  ToolResult(tool="icd10_lookup", status="success", summary="Found 5 codes",
    Table(
      columns=[
        {key:"code", label:"Code"},
        {key:"description", label:"Description"}
      ],
      rows=[
        {code:"E11.9", description:"Type 2 diabetes mellitus without complications"},
        {code:"E11.65", description:"Type 2 diabetes mellitus with hyperglycemia"},
        {code:"E11.22", description:"Type 2 diabetes mellitus with diabetic chronic kidney disease"}
      ],
      compact=true
    )
  )
)
```

## Notes

- **Status styling**: A `success` result displays with a green accent border/icon. An `error` result uses red and typically wraps an error message or fallback content.
- **Children flexibility**: The body accepts any component — `Table`, `DrugCard`, `Markdown`, `JsonViewer`, or custom compositions. This makes `ToolResult` a general-purpose output frame.
- **Summary line**: The `summary` prop appears in the header next to the tool name. Keep it concise (e.g., "Found 3 results", "Error: timeout", "No matches").
- **Pairing with ToolCall**: A `ToolResult` is typically rendered after a corresponding `ToolCall` component to show the complete invocation-to-result flow.
