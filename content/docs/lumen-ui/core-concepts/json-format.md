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

<div class="lumen-demo">
  <div class="lumen-demo__label">Both JSON Forms Produce the Same Output</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Stat Component</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stat">
        <span class="lm-stat__label">Heart Rate</span>
        <div class="lm-stat__value-row">
          <span class="lm-stat__value">72</span>
          <span class="lm-stat__unit">bpm</span>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Rendered Result</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card with Children</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header"><div class="lm-card__title">Dashboard</div></div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--horizontal lm-stack--gap-24">
            <div class="lm-stat">
              <span class="lm-stat__label">HR</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">72</span>
                <span class="lm-stat__unit">bpm</span>
              </div>
            </div>
            <div class="lm-stat">
              <span class="lm-stat__label">SpO2</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">98</span>
                <span class="lm-stat__unit">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Slots: Badge in Card Header</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div class="lm-card__title">Report</div>
            <span class="lm-badge lm-badge--warning">Draft</span>
          </div>
        </div>
        <div class="lm-card__body">
          <p style="font-size:14px; color:var(--text-primary); margin:0;">Report body...</p>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Recovery in Action</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Partial JSON &rarr; Recovered Rendering</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <div style="font-family:'SF Mono',Monaco,monospace; font-size:12px; line-height:1.6; color:var(--text-primary); background:var(--entry); padding:10px 14px; border-radius:6px; border-left:3px solid #F5A623;">
          <span style="color:var(--text-tertiary);">// Truncated input:</span><br>
          {"type":"card","props":{"title":"Results<span class="lm-streaming-text__cursor"></span>
        </div>
        <div style="display:flex; align-items:center; justify-content:center; gap:8px; padding:4px 0;">
          <span style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary);">Recovery</span>
          <span style="color:var(--text-tertiary);">&#8595;</span>
        </div>
        <div class="lm-card">
          <div class="lm-card__header">
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="lm-card__title">Results</div>
              <span class="lm-badge lm-badge--warning" style="font-size:10px;">isPartial</span>
            </div>
          </div>
          <div class="lm-card__body" style="min-height:20px;"></div>
        </div>
      </div>
    </div>
  </div>
</div>

## DSL vs. JSON: Side by Side

The same component tree can be expressed in either format. The DSL is more compact; the JSON is more explicit.

<div class="lumen-demo">
  <div class="lumen-demo__label">Structural Comparison</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Same Component, Two Formats</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-split lm-split--horizontal">
        <div class="lm-split__pane">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">DSL &mdash; 3 lines</div>
          <div style="font-family:'SF Mono',Monaco,monospace; font-size:12px; line-height:1.6; color:var(--text-primary); white-space:pre; background:var(--entry); padding:12px; border-radius:6px;">Card(title="Labs",
  Stat(label="WBC", value="7.2"),
  Stat(label="Hgb", value="14.1")
)</div>
        </div>
        <div class="lm-split__pane">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">JSON &mdash; 14 lines</div>
          <div style="font-family:'SF Mono',Monaco,monospace; font-size:12px; line-height:1.6; color:var(--text-primary); white-space:pre; background:var(--entry); padding:12px; border-radius:6px;">{"type":"card",
 "props":{"title":"Labs"},
 "children":[
  {"type":"stat",
   "label":"WBC",
   "value":"7.2"},
  {"type":"stat",
   "label":"Hgb",
   "value":"14.1"}
 ]}</div>
        </div>
      </div>
    </div>
  </div>
</div>

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
