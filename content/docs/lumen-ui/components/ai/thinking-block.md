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

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Thinking Block</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-thinking">
<div class="lm-thinking__trigger">
<span class="lm-thinking__trigger-icon">&#9654;</span>
Clinical Reasoning
</div>
<div class="lm-thinking__body">The patient presents with chest pain. Given the risk factors (age 65, hypertension, diabetes), I should consider ACS workup including troponin, ECG, and chest X-ray. The described pattern of substernal pressure radiating to the left arm with diaphoresis raises concern for STEMI. Immediate 12-lead ECG and serial troponins are indicated.</div>
</div>

<div class="lm-thinking">
<div class="lm-thinking__trigger">
<span class="lm-thinking__trigger-icon">&#9654;</span>
Drug Interaction Analysis
</div>
<div class="lm-thinking__body">Patient is on Lisinopril 10mg and Spironolactone 25mg. Both are potassium-sparing &mdash; need to flag hyperkalemia risk. Last K+ was 4.8 mEq/L (high-normal). Should recommend monitoring within 1 week.</div>
</div>

</div>
</div>
</div>
</div>

> **Try it** — Click the thinking block headers to expand and collapse the reasoning content.

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Agent Response</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-thinking">
<div class="lm-thinking__trigger">
<span class="lm-thinking__trigger-icon">&#9654;</span>
Drug Interaction Analysis
</div>
<div class="lm-thinking__body">Patient is on Lisinopril 10mg and Spironolactone 25mg. Both are potassium-sparing &mdash; need to flag hyperkalemia risk. Last K+ was 4.8 mEq/L (high-normal). Should recommend monitoring.</div>
</div>

<div style="font-size:13px; color:var(--text-primary); line-height:1.6;">
<strong>Warning:</strong> Concurrent use of Lisinopril and Spironolactone increases the risk of hyperkalemia. The patient's last potassium level (4.8 mEq/L) is at the upper end of normal. Recommend checking serum potassium within 1 week.
</div>

<div class="lm-follow-up">
<button class="lm-follow-up__btn">What is the target potassium range?</button>
<button class="lm-follow-up__btn">Alternative medications?</button>
<button class="lm-follow-up__btn">Show full interaction details</button>
</div>

</div>
</div>
</div>
</div>

## Notes

- **Default state**: The block starts collapsed, showing only the label and a chevron indicator. Tapping expands it to reveal the full content.
- **Markdown rendering**: The `content` string is rendered as markdown, so it supports formatting like bold, lists, and inline code within the reasoning text.
- **Streaming behavior**: During streaming, the thinking block may update incrementally. The collapsed bar shows an animated indicator while content is still arriving.
- **Multiple blocks**: An agent response can contain multiple `ThinkingBlock` components with different labels to separate distinct reasoning phases (e.g., "Differential Diagnosis", "Treatment Planning").
