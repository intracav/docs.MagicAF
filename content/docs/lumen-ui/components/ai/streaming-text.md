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

## Notes

- **Cursor behavior**: The blinking cursor appears at the end of the rendered text. Set `showCursor=false` once streaming is complete to indicate the response is finalized.
- **Markdown support**: The `content` string is rendered as markdown, supporting bold, italic, lists, links, and other formatting as tokens arrive.
- **Incremental updates**: During streaming, the `content` prop is replaced with the full accumulated text on each update (not appended). The component handles the visual transition smoothly.
- **Performance**: The component is optimized for frequent re-renders during token streaming. It avoids full layout recalculations on each content update.
- **Final state**: After streaming completes, a `StreamingText` with `showCursor=false` is functionally identical to a `Markdown` component. The server typically replaces it with `Markdown` in the final artifact.
