---
title: "ThinkingBlock"
description: "Collapsible block showing AI reasoning and chain-of-thought text."
weight: 3
tags: [lumen-ui, thinking-block, ai]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `ThinkingBlock` component renders a collapsible section containing an AI agent's internal reasoning or chain-of-thought. It starts collapsed by default, allowing users to expand it when they want transparency into how the agent reached its conclusions. This is particularly valuable in clinical settings where auditability of reasoning matters.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `string` | *required* | The thinking/reasoning text. Rendered as markdown. |
| `label` | `string` | `"Thinking"` | Header text displayed on the collapsed bar. |

## DSL Example

```
ThinkingBlock(
  content="The patient presents with chest pain. Given the risk factors (age 65, hypertension, diabetes), I should consider ACS workup including troponin, ECG, and chest X-ray. The described pattern of substernal pressure radiating to the left arm with diaphoresis raises concern for STEMI...",
  label="Clinical Reasoning"
)
```

## JSON Example

```json
{
  "type": "thinking_block",
  "props": {
    "content": "The patient presents with chest pain. Given the risk factors (age 65, hypertension, diabetes), I should consider ACS workup including troponin, ECG, and chest X-ray.",
    "label": "Clinical Reasoning"
  }
}
```

## Composition

A thinking block preceding the agent's final response:

```
Stack(direction="vertical", gap=12,
  ThinkingBlock(
    content="Patient is on Lisinopril 10mg and Spironolactone 25mg. Both are potassium-sparing — need to flag hyperkalemia risk. Last K+ was 4.8 mEq/L (high-normal). Should recommend monitoring.",
    label="Drug Interaction Analysis"
  ),
  Markdown(content="**Warning:** Concurrent use of Lisinopril and Spironolactone increases the risk of hyperkalemia. The patient's last potassium level (4.8 mEq/L) is at the upper end of normal. Recommend checking serum potassium within 1 week."),
  FollowUp(suggestions=["What is the target potassium range?", "Alternative medications?", "Show full interaction details"])
)
```

## Notes

- **Default state**: The block starts collapsed, showing only the label and a chevron indicator. Tapping expands it to reveal the full content.
- **Markdown rendering**: The `content` string is rendered as markdown, so it supports formatting like bold, lists, and inline code within the reasoning text.
- **Streaming behavior**: During streaming, the thinking block may update incrementally. The collapsed bar shows an animated indicator while content is still arriving.
- **Multiple blocks**: An agent response can contain multiple `ThinkingBlock` components with different labels to separate distinct reasoning phases (e.g., "Differential Diagnosis", "Treatment Planning").
