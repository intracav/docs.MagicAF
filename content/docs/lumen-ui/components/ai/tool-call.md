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

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">ToolCall States</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">

<div class="lm-tool-call" data-expandable>
<span class="lm-tool-call__icon lm-tool-call__icon--running"></span>
<span class="lm-tool-call__name">lab_reference_ranges</span>
<span class="lm-tool-call__primary-arg">HbA1c</span>
<div class="lm-tool-call__args">
<div class="lm-kv">
<span class="lm-kv__key">analyte</span><span class="lm-kv__value">HbA1c</span>
<span class="lm-kv__key">unit</span><span class="lm-kv__value">%</span>
</div>
</div>
</div>

<div class="lm-tool-call" data-expandable>
<span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span>
<span class="lm-tool-call__name">rxnorm_lookup</span>
<span class="lm-tool-call__primary-arg">Metformin</span>
<span class="lm-tool-call__duration">0.6s</span>
<div class="lm-tool-call__args">
<div class="lm-kv">
<span class="lm-kv__key">query</span><span class="lm-kv__value">metformin 500mg</span>
</div>
</div>
</div>

<div class="lm-tool-call" data-expandable>
<span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span>
<span class="lm-tool-call__name">drug_interactions</span>
<span class="lm-tool-call__primary-arg">Metformin</span>
<span class="lm-tool-call__duration">1.1s</span>
<div class="lm-tool-call__args">
<div class="lm-kv">
<span class="lm-kv__key">drug</span><span class="lm-kv__value">metformin</span>
<span class="lm-kv__key">against</span><span class="lm-kv__value">lisinopril, atorvastatin</span>
</div>
</div>
</div>

<div class="lm-tool-call" data-expandable>
<span class="lm-tool-call__icon lm-tool-call__icon--error">&#10005;</span>
<span class="lm-tool-call__name">formulary_check</span>
<span class="lm-tool-call__primary-arg">Entresto</span>
<span class="lm-tool-call__duration">3.2s</span>
<div class="lm-tool-call__args">
<div class="lm-kv">
<span class="lm-kv__key">drug</span><span class="lm-kv__value">sacubitril/valsartan</span>
<span class="lm-kv__key">error</span><span class="lm-kv__value">Formulary service timeout</span>
</div>
</div>
</div>

</div>
</div>
</div>
</div>

> **Try it** — Click any tool call card to expand and view its full arguments.

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Agent Activity</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Agent Activity</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-4">
<div class="lm-tool-call" data-expandable>
<span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span>
<span class="lm-tool-call__name">rxnorm_lookup</span>
<span class="lm-tool-call__primary-arg">Metformin</span>
<span class="lm-tool-call__duration">0.6s</span>
<div class="lm-tool-call__args">
<div class="lm-kv">
<span class="lm-kv__key">query</span><span class="lm-kv__value">metformin 500mg</span>
</div>
</div>
</div>
<div class="lm-tool-call" data-expandable>
<span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span>
<span class="lm-tool-call__name">drug_interactions</span>
<span class="lm-tool-call__primary-arg">Metformin</span>
<span class="lm-tool-call__duration">1.1s</span>
<div class="lm-tool-call__args">
<div class="lm-kv">
<span class="lm-kv__key">drug</span><span class="lm-kv__value">metformin</span>
</div>
</div>
</div>
<div class="lm-tool-call" data-expandable>
<span class="lm-tool-call__icon lm-tool-call__icon--running"></span>
<span class="lm-tool-call__name">lab_reference_ranges</span>
<span class="lm-tool-call__primary-arg">HbA1c</span>
<div class="lm-tool-call__args">
<div class="lm-kv">
<span class="lm-kv__key">analyte</span><span class="lm-kv__value">HbA1c</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- **Status indicators**: `running` shows an animated spinner, `completed` shows a green checkmark, and `error` shows a red error icon.
- **Primary arg**: The `primaryArg` prop provides a quick summary visible without expanding the card. For `rxnorm_lookup`, this would typically be the drug name; for `icd10_lookup`, the diagnosis query.
- **Args expansion**: When `args` is provided, the card is expandable. Tapping reveals the full argument key-value pairs.
- **Tool name display**: Tool names are automatically formatted for readability — underscores become spaces and the name is title-cased (e.g., `rxnorm_lookup` renders as "RxNorm Lookup").
- **Duration**: Only meaningful when `status` is `"completed"` or `"error"`. Omit it while the tool is still running.
