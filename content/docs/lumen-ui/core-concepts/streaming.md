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

<div class="lumen-demo">
  <div class="lumen-demo__label">Streaming Text with Cursor</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LLM Streaming In Progress</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-streaming-text">
        Based on the lab results, the patient's WBC count of 12.4 K/uL is elevated above the normal range (4.5-11.0), suggesting a possible<span class="lm-streaming-text__cursor"></span>
      </div>
    </div>
  </div>
</div>

## DSL Recovery

The DSL parser handles partial input by:

1. **Unterminated strings** — closed at end of input
2. **Unclosed parentheses** — node marked `isPartial: true`, children collected so far are kept
3. **Missing commas** — parser recovers and continues to the next token
4. **Incomplete arrays/objects** — balanced at end of input

The recovered tree is complete enough to render. As more tokens arrive, the tree is re-parsed and the UI updates.

<div class="lumen-demo">
  <div class="lumen-demo__label">Progressive Component Rendering</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Partial Tree &rarr; Complete Tree</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
        <!-- Stage 1: Just the card title -->
        <div>
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">Stage 1 &mdash; Title only</div>
          <div class="lm-card" style="opacity:0.7;">
            <div class="lm-card__header">
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="lm-card__title">Lab Results<span class="lm-streaming-text__cursor"></span></div>
                <span class="lm-badge lm-badge--warning" style="font-size:10px;">isPartial</span>
              </div>
            </div>
            <div class="lm-card__body" style="min-height:20px;"></div>
          </div>
        </div>
        <!-- Stage 2: Table headers appear -->
        <div>
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">Stage 2 &mdash; Table columns arrive</div>
          <div class="lm-card" style="opacity:0.85;">
            <div class="lm-card__header">
              <div style="display:flex; align-items:center; gap:8px;">
                <div class="lm-card__title">Lab Results</div>
                <span class="lm-badge lm-badge--warning" style="font-size:10px;">isPartial</span>
              </div>
            </div>
            <div class="lm-card__body">
              <table class="lm-table">
                <thead><tr><th>Test</th><th>Re<span class="lm-streaming-text__cursor"></span></th></tr></thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Stage 3: Complete -->
        <div>
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">Stage 3 &mdash; Complete</div>
          <div class="lm-card">
            <div class="lm-card__header"><div class="lm-card__title">Lab Results</div></div>
            <div class="lm-card__body">
              <table class="lm-table">
                <thead><tr><th>Test</th><th>Result</th></tr></thead>
                <tbody>
                  <tr><td>WBC</td><td>7.2 K/uL</td></tr>
                  <tr><td>Hgb</td><td>14.1 g/dL</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">isStreaming Behavior</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Streaming vs. Complete</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-split lm-split--horizontal">
        <div class="lm-split__pane">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#F5A623; animation:lm-pulse 1s ease-in-out infinite;"></span>
            isStreaming: true
          </div>
          <div class="lm-card" style="opacity:0.85;">
            <div class="lm-card__header"><div class="lm-card__title">Analysis</div></div>
            <div class="lm-card__body">
              <div class="lm-streaming-text" style="font-size:13px;">The patient presents with elevated inflammatory markers suggesting<span class="lm-streaming-text__cursor"></span></div>
            </div>
          </div>
        </div>
        <div class="lm-split__pane">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
            <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#3BA55C;"></span>
            isStreaming: false
          </div>
          <div class="lm-card">
            <div class="lm-card__header"><div class="lm-card__title">Analysis</div></div>
            <div class="lm-card__body">
              <p style="font-size:13px; color:var(--text-primary); margin:0;">The patient presents with elevated inflammatory markers suggesting an acute infectious process.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Partial Lumen Tag Rendering</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Chat with Streaming &lt;lumen&gt; Block</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <p style="font-size:14px; color:var(--text-primary); margin:0;">Here are the results:</p>
        <div class="lm-card" style="opacity:0.85;">
          <div class="lm-card__header">
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="lm-card__title">Results</div>
              <span class="lm-badge lm-badge--warning" style="font-size:10px;">Streaming</span>
            </div>
          </div>
          <div class="lm-card__body">
            <table class="lm-table">
              <thead><tr><th>Test</th><th>Value</th></tr></thead>
              <tbody>
                <tr><td>WBC</td><td>12.4 K/uL</td></tr>
                <tr>
                  <td>CRP</td>
                  <td><span class="lm-streaming-text">48.<span class="lm-streaming-text__cursor"></span></span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Re-Parse on Every Update

<div class="lumen-demo">
  <div class="lumen-demo__label">Streaming Re-Parse Cycle</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">SSE Event Loop</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128225;</div>
          <span class="lm-pipeline__label">SSE Event</span>
          <span class="lm-pipeline__sublabel">New tokens</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128220;</div>
          <span class="lm-pipeline__label">Accumulate</span>
          <span class="lm-pipeline__sublabel">Buffer text</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#9881;</div>
          <span class="lm-pipeline__label">Re-Parse</span>
          <span class="lm-pipeline__sublabel">O(n) tokenizer</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127795;</div>
          <span class="lm-pipeline__label">Diff</span>
          <span class="lm-pipeline__sublabel">Keyed update</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127912;</div>
          <span class="lm-pipeline__label">Render</span>
          <span class="lm-pipeline__sublabel">Incremental UI</span>
        </div>
      </div>
    </div>
  </div>
</div>

During streaming, the client re-parses the accumulated content on every SSE event. This is fast because:

1. The tokenizer is a simple state machine — O(n) in input length
2. Component registration is cached (runs once)
3. Flutter's widget diffing handles incremental updates efficiently
4. Keyed nodes (`id` field) minimize widget rebuilds

## Next Steps

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — the full rendering pipeline
- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — parser details and token types
- **[Envelope Protocol](/docs/lumen-ui/integration/envelope-protocol/)** — how server-side streaming works
