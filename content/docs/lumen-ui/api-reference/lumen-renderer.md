---
title: "LumenRenderer"
description: "API reference for LumenRenderer — the top-level widget that converts LumenNode trees into Flutter widgets."
weight: 2
tags: [lumen-ui, api, renderer, widget]
categories: [api-reference]
difficulty: intermediate
estimated_reading_time: "4 min"
last_reviewed: "2026-03-17"
---

`LumenRenderer` is a `StatelessWidget` that renders a list of `LumenNode` objects into Flutter widgets using the `ComponentRegistry`.

**Source:** `packages/lumen_ui/lib/src/core/renderer/lumen_renderer.dart`

## Constructor

```dart
const LumenRenderer({
  required List<LumenNode> nodes,
  LumenThemeData? theme,
  bool isStreaming = false,
  void Function(LumenAction, Map<String, dynamic>)? onAction,
})
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `nodes` | `List<LumenNode>` | Required | Parsed component nodes to render |
| `theme` | `LumenThemeData?` | Auto-detected | Theme data; if null, detected from `BuildContext` |
| `isStreaming` | `bool` | `false` | Whether the content is still being streamed |
| `onAction` | `Function?` | `null` | Callback for component actions |

## Behavior

1. **Registry initialization** — On first build, calls `ComponentRegistry.instance.registerAll()` (idempotent)
2. **Theme resolution** — If `theme` is null, reads `Theme.of(context).brightness` and creates `LumenThemeData.dark()` or `LumenThemeData.light()`
3. **Context creation** — Creates a `LumenRenderContext` with the `onAction` callback and `isStreaming` flag
4. **Node rendering** — For each node, looks up the component definition and calls its builder, wrapped in an `ErrorBoundary`
5. **Layout** — Returns a `Column` with `CrossAxisAlignment.stretch` containing all rendered widgets

## Static Methods

### `renderChildren`

```dart
static List<Widget> renderChildren(
  LumenNode node,
  LumenThemeData theme,
  LumenRenderContext context,
)
```

Renders a node's children as a list of widgets. Used by component builders that accept children (e.g., Card, Grid, Tabs).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `node` | `LumenNode` | Parent node whose children to render |
| `theme` | `LumenThemeData` | Theme data |
| `context` | `LumenRenderContext` | Render context (depth is incremented) |

**Returns:** `List<Widget>` — one widget per child node

**Example:**

```dart
Widget _buildCard(LumenNode node, LumenThemeData theme, LumenRenderContext ctx) {
  final children = LumenRenderer.renderChildren(node, theme, ctx);
  return Container(
    child: Column(children: children),
  );
}
```

## Usage Examples

### Basic

```dart
final result = LumenParser.parse(dslInput);
return LumenRenderer(nodes: result.nodes);
```

### With Actions

```dart
LumenRenderer(
  nodes: result.nodes,
  onAction: (action, data) {
    if (action == LumenAction.sendMessage) {
      chatProvider.send(data['message']);
    }
  },
)
```

### With Explicit Theme

```dart
LumenRenderer(
  nodes: result.nodes,
  theme: LumenThemeData.dark(),
)
```

### Streaming

```dart
LumenRenderer(
  nodes: result.nodes,
  isStreaming: isLlmStillGenerating,
)
```

## See Also

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — rendering pipeline concepts
- **[LumenNode](/docs/lumen-ui/api-reference/lumen-node/)** — the node data model
- **[LumenRenderContext](/docs/lumen-ui/api-reference/render-context/)** — the context object
- **[Actions](/docs/lumen-ui/core-concepts/actions/)** — action types and handling
