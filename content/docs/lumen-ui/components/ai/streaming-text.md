---
title: "StreamingText"
description: "Text display with blinking cursor for streaming AI responses."
weight: 6
tags: [lumen-ui, streaming-text, ai]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `StreamingText` component renders text content with an optional blinking cursor to indicate that the AI agent is still generating output. It provides the familiar "typing" visual cue seen in chat interfaces. Use it for in-progress agent responses where the text is being streamed token by token.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `string` | *required* | The text content to display. Updated incrementally as tokens arrive during streaming. |
| `showCursor` | `bool` | `true` | Show a blinking cursor at the end of the text to indicate ongoing generation. |

## DSL Example

```
StreamingText(
  content="Based on the lab results, the patient's renal function shows...",
  showCursor=true
)
```

## JSON Example

```json
{
  "type": "streaming_text",
  "props": {
    "content": "Based on the lab results, the patient's renal function shows a mild elevation in creatinine at 1.4 mg/dL, suggesting early stage CKD. The eGFR of 52 mL/min places this in Stage 3a.",
    "show_cursor": true
  }
}
```

## Composition

Streaming text alongside a thinking block during an active agent response:

```
Stack(direction="vertical", gap=12,
  ThinkingBlock(
    content="Creatinine 1.4 is above normal (0.7-1.3). eGFR 52 = Stage 3a CKD. Need to check for proteinuria and adjust medication doses.",
    label="Reasoning"
  ),
  StreamingText(
    content="Based on the lab results, the patient's renal function shows a mild elevation in creatinine (1.4 mg/dL, reference 0.7-1.3). The estimated GFR of 52 mL/min/1.73m² places this in **CKD Stage 3a**.",
    showCursor=true
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
<span class="lumen-demo__bar-title">Streaming Text</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">With Cursor (streaming)</div>
<div class="lm-streaming-text">Based on the lab results, the patient's renal function shows a mild elevation in creatinine at 1.4 mg/dL, suggesting early stage CKD. The eGFR of 52 mL/min places this in <strong>Stage 3a</strong><span class="lm-streaming-text__cursor"></span></div>
</div>

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">Without Cursor (complete)</div>
<div class="lm-streaming-text">Based on the lab results, the patient's renal function shows a mild elevation in creatinine at 1.4 mg/dL, suggesting early stage CKD. The eGFR of 52 mL/min/1.73m&sup2; places this in <strong>CKD Stage 3a</strong>.</div>
</div>

</div>
</div>
</div>
</div>

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Active Agent Response</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-thinking open">
<div class="lm-thinking__trigger">
<span class="lm-thinking__trigger-icon">&#9654;</span>
Reasoning
</div>
<div class="lm-thinking__body">Creatinine 1.4 is above normal (0.7-1.3). eGFR 52 = Stage 3a CKD. Need to check for proteinuria and adjust medication doses.</div>
</div>

<div class="lm-streaming-text" style="font-size:13px; line-height:1.6;">Based on the lab results, the patient's renal function shows a mild elevation in creatinine (1.4 mg/dL, reference 0.7-1.3). The estimated GFR of 52 mL/min/1.73m&sup2; places this in <strong>CKD Stage 3a</strong><span class="lm-streaming-text__cursor"></span></div>

</div>
</div>
</div>
</div>

## Notes

- **Cursor behavior**: The blinking cursor appears at the end of the rendered text. Set `showCursor=false` once streaming is complete to indicate the response is finalized.
- **Markdown support**: The `content` string is rendered as markdown, supporting bold, italic, lists, links, and other formatting as tokens arrive.
- **Incremental updates**: During streaming, the `content` prop is replaced with the full accumulated text on each update (not appended). The component handles the visual transition smoothly.
- **Performance**: The component is optimized for frequent re-renders during token streaming. It avoids full layout recalculations on each content update.
- **Final state**: After streaming completes, a `StreamingText` with `showCursor=false` is functionally identical to a `Markdown` component. The server typically replaces it with `Markdown` in the final artifact.
