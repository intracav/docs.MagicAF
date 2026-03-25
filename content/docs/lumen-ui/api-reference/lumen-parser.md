---
title: "LumenParser"
description: "API reference for LumenParser — the auto-detecting parser that handles both DSL and JSON input formats."
weight: 1
tags: [lumen-ui, api, parser]
categories: [api-reference]
difficulty: intermediate
estimated_reading_time: "4 min"
last_reviewed: "2026-03-17"
---

`LumenParser` is the unified entry point for parsing component definitions. It auto-detects the input format and delegates to the appropriate parser.

**Source:** `packages/lumen_ui/lib/src/core/parser/lumen_parser.dart`

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Parser Architecture</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon" style="color: var(--text-secondary);">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 5h12M4 10h12M4 15h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label">Input String</div>
          <div class="lm-pipeline__sublabel">DSL or JSON</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>auto-detect</span>
        </div>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon" style="color: #5865F2;">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7 4l-4 6 4 6M13 4l4 6-4 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div class="lm-pipeline__label">LumenParser.parse()</div>
          <div class="lm-pipeline__sublabel">{ or [ &#8594; JSON | else &#8594; DSL</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>returns</span>
        </div>
        <div class="lm-pipeline__step" style="border-color: var(--accent);">
          <div class="lm-pipeline__icon" style="color: #3BA55C;">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h6M7 10h4M7 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label">LumenParseResult</div>
          <div class="lm-pipeline__sublabel">nodes[] + errors[] + isPartial</div>
        </div>
      </div>
    </div>
  </div>
</div>

## Static Methods

### `parse`

```dart
static LumenParseResult parse(String input)
```

Parses a string containing component definitions in either DSL or JSON format.

**Format detection:**
- Input starting with `{` or `[` → JSON (`JsonComponentParser`)
- Everything else → DSL (`DslParser`)

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `String` | The component definition string to parse |

**Returns:** `LumenParseResult`

**Example:**

```dart
// DSL input
final result1 = LumenParser.parse('Card(title="Hello")');

// JSON input
final result2 = LumenParser.parse('{"type":"card","props":{"title":"Hello"}}');

// Both produce equivalent LumenNode trees
```

## LumenParseResult

The return type of `LumenParser.parse()`:

```dart
class LumenParseResult {
  final List<LumenNode> nodes;
  final List<ParseError> errors;
  final bool isPartial;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `nodes` | `List<LumenNode>` | Parsed component nodes (may be empty if parsing failed) |
| `errors` | `List<ParseError>` | Parse errors encountered (may be empty) |
| `isPartial` | `bool` | `true` if the input was incomplete and recovery was applied |

## ParseError

```dart
class ParseError {
  final String message;
  final int position;
  final int line;
  final int column;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `message` | `String` | Human-readable error description |
| `position` | `int` | Character offset in input (0-based) |
| `line` | `int` | Line number (1-based) |
| `column` | `int` | Column number (1-based) |

## Sub-Parsers

### DslParser

The DSL parser. Not typically used directly — use `LumenParser.parse()` instead.

```dart
// Direct usage (if needed)
final parser = DslParser(input);
final result = parser.parse();
```

### JsonComponentParser

The JSON parser with streaming recovery. Not typically used directly.

```dart
// Direct usage (if needed)
final result = JsonComponentParser.parse(jsonString);
```

## Streaming Usage

For streaming scenarios, call `parse()` on every content update:

```dart
String accumulated = '';

void onStreamEvent(String content) {
  accumulated = content;  // Server sends full content, not deltas
  final result = LumenParser.parse(accumulated);
  setState(() {
    nodes = result.nodes;
    isPartial = result.isPartial;
  });
}
```

The parser is stateless — each call is independent. It is safe to call repeatedly with growing input.

## See Also

- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — the DSL format
- **[JSON Format](/docs/lumen-ui/core-concepts/json-format/)** — the JSON format
- **[Streaming](/docs/lumen-ui/core-concepts/streaming/)** — streaming recovery behavior
- **[Language Specification](/docs/lumen-ui/advanced/language-specification/)** — formal grammar
