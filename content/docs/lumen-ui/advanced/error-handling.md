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

<div class="lumen-demo">
  <div class="lumen-demo__label">Error Boundary in Action</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Graceful Degradation</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <!-- Working component -->
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Patient Summary</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">Heart Rate</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">72</span><span class="lm-stat__unit">bpm</span></div>
            </div>
          </div>
        </div>
        <!-- Broken component (error boundary) -->
        <div style="padding: 12px 16px; background: rgba(218,55,60,0.08); border: 1px dashed rgba(218,55,60,0.3); border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="color: #DA373C; font-size: 14px;">&#9888;</span>
            <span style="font-size: 13px; font-weight: 600; color: #DA373C;">Error in: table</span>
          </div>
          <div style="font-size: 12px; color: var(--text-tertiary); font-family: var(--font-mono);">type 'Null' is not a subtype of type 'List&lt;dynamic&gt;'</div>
        </div>
        <!-- Another working component after the error -->
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Medications</div>
          </div>
          <div class="lm-card__body">
            <div style="font-size: 13px; color: var(--text-secondary);">Furosemide 40mg PO BID, Lisinopril 10mg PO Daily</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 16px; padding: 10px 14px; background: var(--entry); border-radius: 8px; font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;">
        <span style="color: #3BA55C;">&#10003;</span>
        The broken Table component is isolated. Sibling Card components above and below render normally.
      </div>
    </div>
  </div>
</div>

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

The fallback is a gray container with a border, showing the unknown type name and any text content from the node.

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
        <div style="padding: 10px 14px; background: var(--entry); border: 1px solid var(--border); border-radius: 8px;">
          <div style="font-size: 12px; font-weight: 600; color: var(--text-tertiary);">Unknown: <code>fancy_widget</code></div>
          <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">This component is not registered in the current client version.</div>
        </div>
      </div>
    </div>
  </div>
</div>

This means:

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

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Five Layers of Error Handling</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <table class="lm-table">
        <thead>
          <tr><th>Layer</th><th>Error Type</th><th>Handling</th><th>Result</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><span style="background: #5865F2; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px;">1</span> Tokenizer</td>
            <td>Invalid character</td>
            <td>Skip, continue</td>
            <td><span style="color: #FAA61A; font-weight: 600;">Warning</span></td>
          </tr>
          <tr>
            <td><span style="background: #3BA55C; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px;">2</span> Parser</td>
            <td>Syntax error</td>
            <td>Recovery + continue</td>
            <td><span style="color: #FAA61A; font-weight: 600;">Partial tree</span></td>
          </tr>
          <tr>
            <td><span style="background: #FAA61A; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px;">3</span> Registry</td>
            <td>Unknown type</td>
            <td>Fallback component</td>
            <td><span style="color: var(--text-tertiary);">Gray card</span></td>
          </tr>
          <tr>
            <td><span style="background: #DA373C; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px;">4</span> Builder</td>
            <td>Runtime exception</td>
            <td>ErrorBoundary</td>
            <td><span style="color: #DA373C; font-weight: 600;">Error card</span></td>
          </tr>
          <tr>
            <td><span style="background: #9B59B6; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px;">5</span> Props</td>
            <td>Wrong type / missing</td>
            <td>Default value</td>
            <td><span style="color: #3BA55C; font-weight: 600;">Renders OK</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

## Next Steps

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — rendering pipeline details
- **[Streaming](/docs/lumen-ui/core-concepts/streaming/)** — partial content recovery
- **[API Reference: LumenParser](/docs/lumen-ui/api-reference/lumen-parser/)** — parser error API
