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
