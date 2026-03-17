---
title: "ToolCall"
description: "Compact badge/card displaying an AI tool invocation with status, arguments, and duration."
weight: 1
tags: [lumen-ui, tool-call, ai]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `ToolCall` component renders a compact representation of an AI tool invocation. It shows the tool name, execution status, primary argument, and optional duration. Use it to give users visibility into which tools the agent is calling during a conversation — drug lookups, code searches, API requests, and more.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | *required* | Tool name (e.g., `"rxnorm_lookup"`, `"icd10_lookup"`). |
| `status` | `"running"` \| `"completed"` \| `"error"` | — | Current execution status. Drives the visual indicator (spinner, checkmark, or error icon). |
| `args` | `object` | — | Tool input arguments as key-value pairs. Displayed in an expandable detail section. |
| `duration` | `string` | — | Execution time (e.g., `"0.8s"`, `"1.2s"`). Shown after completion. |
| `primaryArg` | `string` | — | The most important argument value to display inline alongside the tool name, without expanding. |

## DSL Example

```
ToolCall(
  name="rxnorm_lookup",
  status="completed",
  primaryArg="Lisinopril",
  duration="0.8s",
  args={query:"lisinopril 10mg"}
)
```

## JSON Example

```json
{
  "type": "tool_call",
  "props": {
    "name": "rxnorm_lookup",
    "status": "completed",
    "primary_arg": "Lisinopril",
    "duration": "0.8s",
    "args": {
      "query": "lisinopril 10mg"
    }
  }
}
```

## Composition

A group of tool calls inside a card representing an agent's lookup sequence:

```
Card(title="Agent Activity",
  Stack(direction="vertical", gap=4,
    ToolCall(name="rxnorm_lookup", status="completed", primaryArg="Metformin", duration="0.6s"),
    ToolCall(name="drug_interactions", status="completed", primaryArg="Metformin", duration="1.1s"),
    ToolCall(name="lab_reference_ranges", status="running", primaryArg="HbA1c")
  )
)
```

## Notes

- **Status indicators**: `running` shows an animated spinner, `completed` shows a green checkmark, and `error` shows a red error icon.
- **Primary arg**: The `primaryArg` prop provides a quick summary visible without expanding the card. For `rxnorm_lookup`, this would typically be the drug name; for `icd10_lookup`, the diagnosis query.
- **Args expansion**: When `args` is provided, the card is expandable. Tapping reveals the full argument key-value pairs.
- **Tool name display**: Tool names are automatically formatted for readability — underscores become spaces and the name is title-cased (e.g., `rxnorm_lookup` renders as "RxNorm Lookup").
- **Duration**: Only meaningful when `status` is `"completed"` or `"error"`. Omit it while the tool is still running.
