---
title: "Error Handling"
description: "How Lumen UI handles errors at every level — parse errors, render errors, unknown components, and malformed props."
weight: 4
tags: [lumen-ui, errors, error-boundary, fallback, debugging]
categories: [guide]
difficulty: intermediate
estimated_reading_time: "5 min"
last_reviewed: "2026-03-17"
---

Lumen UI is designed to fail open. At every level — parsing, registry lookup, and rendering — errors are caught and handled gracefully rather than crashing.

## Parse Errors

When the parser encounters invalid syntax, it:

1. Records the error in `LumenParseResult.errors`
2. Attempts to recover and continue parsing
3. Returns whatever nodes it was able to parse

```dart
final result = LumenParser.parse('Card(title="Test", BadSyntax!!!))');

// result.nodes may contain the Card (partially parsed)
// result.errors contains details about the syntax issue
for (final error in result.errors) {
  print('${error.line}:${error.column} — ${error.message}');
}
```

Parse errors do not prevent rendering. Valid portions of the input are rendered normally; only the malformed section is affected.

## Unknown Components

When the renderer encounters a component type that is not registered in the `ComponentRegistry`, it renders a **fallback card**:

```
┌──────────────────────────┐
│  Unknown: fancy_widget   │
│  (any text content)      │
└──────────────────────────┘
```

The fallback is a gray container with a border, showing the unknown type name and any text content from the node. This means:

- New component types can be added to LLM prompts before the client supports them
- The rest of the tree renders normally around the unknown component
- No crash, no blank screen

## Render Errors (ErrorBoundary)

Every component node is wrapped in an `ErrorBoundary` widget. If a builder function throws an exception — due to a malformed prop, a null access, or any other runtime error — the error boundary catches it and renders a fallback:

```
┌──────────────────────────┐
│  Error in: table         │
│  type 'Null' is not a    │
│  subtype of type 'List'  │
└──────────────────────────┘
```

This isolation means:

- A broken component does not take down the entire tree
- Sibling and parent components continue to render
- The error message helps diagnose the issue

## Malformed Props

Components use typed prop accessors with defaults:

```dart
final title = node.stringProp('title', '');     // Default: empty string
final count = node.numProp('count', 0);          // Default: 0
final items = node.listProp('items');             // Default: empty list
final config = node.mapProp('config');            // Default: empty map
final active = node.boolProp('active', false);   // Default: false
```

If a prop is the wrong type (e.g., a string where a number is expected), the default value is used. Components should always provide sensible defaults for optional props.

## Debugging

### Check Parse Results

```dart
final result = LumenParser.parse(input);
print('Nodes: ${result.nodes.length}');
print('Errors: ${result.errors.length}');
print('Partial: ${result.isPartial}');
for (final error in result.errors) {
  print('  ${error.line}:${error.column} ${error.message}');
}
```

### Inspect Node Trees

```dart
void printTree(LumenNode node, [int indent = 0]) {
  final prefix = '  ' * indent;
  print('$prefix${node.type} (${node.props.keys.join(', ')})');
  for (final child in node.children) {
    printTree(child, indent + 1);
  }
}
```

### Validate Against Schema

The `SchemaValidator` can check a node against its registered definition:

```dart
final errors = SchemaValidator.validate(node, definition);
for (final error in errors) {
  print('Validation: $error');
}
```

## Error Hierarchy

| Level | Error Type | Handling | Result |
|-------|-----------|----------|--------|
| Tokenizer | Invalid character | Skip character, continue | Parse warning |
| Parser | Syntax error | Recovery + continue | Partial tree + errors |
| Registry | Unknown type | — | Fallback card |
| Builder | Runtime exception | ErrorBoundary catches | Error card |
| Props | Wrong type / missing | Default value used | Component renders with defaults |

## Next Steps

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — rendering pipeline details
- **[Streaming](/docs/lumen-ui/core-concepts/streaming/)** — partial content recovery
- **[API Reference: LumenParser](/docs/lumen-ui/api-reference/lumen-parser/)** — parser error API
