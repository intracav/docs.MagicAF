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
