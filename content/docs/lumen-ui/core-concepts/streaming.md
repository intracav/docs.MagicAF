---
title: "Streaming"
description: "How Lumen UI handles partial, truncated, and in-progress content during LLM streaming."
weight: 5
tags: [lumen-ui, streaming, partial-content, sse]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/core-concepts/rendering/
estimated_reading_time: "6 min"
last_reviewed: "2026-03-17"
---

Lumen UI is designed for streaming-first rendering. LLMs emit tokens one at a time, which means the parser frequently receives incomplete input. Rather than waiting for the full response, Lumen renders progressively — building up the UI as tokens arrive.

## The Problem

During streaming, the parser may receive input like:

```
Card(title="Lab Results",
  Table(
    columns=[{key:"test", label:"Test"}, {key:"value", label:"Re
```

The string `"Re` is unterminated, the `Table` call is unclosed, and the `Card` is unclosed. A strict parser would reject this. Lumen's parser recovers it into a renderable tree.

## DSL Recovery

The DSL parser handles partial input by:

1. **Unterminated strings** — closed at end of input
2. **Unclosed parentheses** — node marked `isPartial: true`, children collected so far are kept
3. **Missing commas** — parser recovers and continues to the next token
4. **Incomplete arrays/objects** — balanced at end of input

The recovered tree is complete enough to render. As more tokens arrive, the tree is re-parsed and the UI updates.

## JSON Recovery

The JSON parser (`JsonComponentParser`) applies explicit recovery steps:

1. Count unmatched `{` and `[` characters
2. Close any unterminated string with `"`
3. Append missing `]` and `}` to balance the structure
4. Parse the repaired JSON
5. Mark the result as `isPartial: true`

Example:

```json
// Input (truncated):
{"type":"card","props":{"title":"Results

// Recovery adds:
{"type":"card","props":{"title":"Results"}}

// Result: a Card with title "Results", isPartial=true
```

## The `isPartial` Flag

`LumenParseResult.isPartial` is `true` when the parser detected and recovered from incomplete input. Components can check this flag via `LumenRenderContext.isStreaming` to adjust their rendering:

- Charts may show placeholder axes
- Tables may show columns without complete rows
- Text components may show a blinking cursor

## The `isStreaming` Flag

Pass `isStreaming: true` to `LumenRenderer` when the LLM is still generating:

```dart
LumenRenderer(
  nodes: result.nodes,
  isStreaming: true,
)
```

This flag is passed through the `LumenRenderContext` to all component builders. Components can use it to:

- Show loading indicators for incomplete data
- Skip animations that would fire repeatedly during updates
- Display a cursor at the end of text content

## Keyed Rendering

`LumenNode` has an optional `id` field. When present, the renderer uses it as a `ValueKey` for the widget, enabling Flutter to efficiently diff and update nodes during streaming rather than rebuilding the entire tree.

## `<lumen>` Tag Handling

During streaming, a `<lumen>` tag may be opened but not yet closed:

```
Here are the results:

<lumen>
Card(title="Results",
  Table(columns=[...], rows=[
```

The envelope handler strips unclosed `<lumen>` tags and passes the content to the parser, which applies its streaming recovery. When the closing `</lumen>` arrives, the full content is re-parsed.

## Re-Parse on Every Update

During streaming, the client re-parses the accumulated content on every SSE event. This is fast because:

1. The tokenizer is a simple state machine — O(n) in input length
2. Component registration is cached (runs once)
3. Flutter's widget diffing handles incremental updates efficiently
4. Keyed nodes (`id` field) minimize widget rebuilds

## Next Steps

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — the full rendering pipeline
- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — parser details and token types
- **[Envelope Protocol](/docs/lumen-ui/integration/envelope-protocol/)** — how server-side streaming works
