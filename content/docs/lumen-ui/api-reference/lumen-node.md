---
title: "LumenNode"
description: "API reference for LumenNode — the data model for parsed component nodes with typed prop accessors."
weight: 4
tags: [lumen-ui, api, node, model]
categories: [api-reference]
difficulty: intermediate
estimated_reading_time: "4 min"
last_reviewed: "2026-03-17"
---

`LumenNode` is the core data model representing a parsed component. It holds the component type, props, children, and provides typed accessors for reading prop values.

**Source:** `packages/lumen_ui/lib/src/core/parser/parse_result.dart`

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Node Structure</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--outlined" style="font-family: var(--font-mono); font-size: 12px;">
        <div class="lm-card__body" style="padding: 14px;">
          <div style="color: #5865F2; font-weight: 700; margin-bottom: 8px;">LumenNode</div>
          <div style="display: grid; grid-template-columns: auto 1fr; gap: 3px 12px; color: var(--text-secondary);">
            <span style="color: var(--text-tertiary);">type</span><span><code>String</code> &mdash; <span style="color: #3BA55C;">"card"</span></span>
            <span style="color: var(--text-tertiary);">props</span><span><code>Map&lt;String, dynamic&gt;</code> &mdash; <span style="color: #FAA61A;">{title: "Summary"}</span></span>
            <span style="color: var(--text-tertiary);">children</span><span><code>List&lt;LumenNode&gt;</code> &mdash; <span style="color: #9B59B6;">[Stat(...), Table(...)]</span></span>
            <span style="color: var(--text-tertiary);">slots</span><span><code>Map&lt;String, LumenNode&gt;</code> &mdash; <span style="color: var(--text-tertiary);">{header: ...}</span></span>
            <span style="color: var(--text-tertiary);">text</span><span><code>String?</code> &mdash; leaf content</span>
            <span style="color: var(--text-tertiary);">id</span><span><code>String?</code> &mdash; stable key for streaming</span>
            <span style="color: var(--text-tertiary);">isPartial</span><span><code>bool</code> &mdash; recovered from incomplete input</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Constructor

```dart
LumenNode({
  required String type,
  Map<String, dynamic> props = const {},
  List<LumenNode> children = const [],
  Map<String, LumenNode> slots = const {},
  String? text,
  String? id,
  bool isPartial = false,
})
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | `String` | snake_case component type (e.g., `card`, `bar_chart`) |
| `props` | `Map<String, dynamic>` | Component properties |
| `children` | `List<LumenNode>` | Child component nodes |
| `slots` | `Map<String, LumenNode>` | Named child slots (e.g., `header`, `footer`) |
| `text` | `String?` | Raw text content for leaf nodes |
| `id` | `String?` | Stable identifier for keyed rendering during streaming |
| `isPartial` | `bool` | `true` if this node was recovered from incomplete input |

## Typed Accessors

### `prop<T>`

```dart
T? prop<T>(String key)
```

Generic typed access. Returns `null` if the prop doesn't exist or is the wrong type.

### `stringProp`

```dart
String stringProp(String key, [String defaultValue = ''])
```

Returns the string value of a prop, or the default if missing.

### `numProp`

```dart
num numProp(String key, [num defaultValue = 0])
```

Returns the numeric value of a prop, or the default if missing. Works for both integers and doubles.

### `boolProp`

```dart
bool boolProp(String key, [bool defaultValue = false])
```

Returns the boolean value of a prop, or the default if missing.

### `listProp`

```dart
List<dynamic> listProp(String key)
```

Returns the list value of a prop, or an empty list if missing.

### `mapProp`

```dart
Map<String, dynamic> mapProp(String key)
```

Returns the map value of a prop, or an empty map if missing.

### `textContent`

```dart
String get textContent
```

Returns the `text` field or an empty string. Useful for components that render raw text content (Markdown, CodeBlock, etc.).

## Usage in Component Builders

```dart
Widget _buildStat(LumenNode node, LumenThemeData theme, LumenRenderContext ctx) {
  final label = node.stringProp('label');           // Required — empty string if missing
  final value = node.stringProp('value');           // Required
  final unit = node.stringProp('unit');             // Optional
  final trend = node.stringProp('trend');           // Optional: 'up', 'down', 'neutral'
  final change = node.stringProp('change');         // Optional: '+3', '-2'

  return Column(
    children: [
      Text(value, style: theme.typography.headingXl),
      if (unit.isNotEmpty) Text(unit, style: theme.typography.caption),
      Text(label, style: theme.typography.bodySm),
    ],
  );
}
```

## Tree Navigation

```dart
// Count children
final childCount = node.children.length;

// Access specific child
final firstChild = node.children.first;

// Check for slot
final header = node.slots['header'];

// Check if partially parsed
if (node.isPartial) {
  // This node was recovered from incomplete input
}
```

## See Also

- **[LumenParser](/docs/lumen-ui/api-reference/lumen-parser/)** — produces LumenNode trees
- **[LumenRenderer](/docs/lumen-ui/api-reference/lumen-renderer/)** — renders LumenNode trees
- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — how nodes become widgets
