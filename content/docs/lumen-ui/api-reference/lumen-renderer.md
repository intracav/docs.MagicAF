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

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Rendering Pipeline</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-steps">
        <div class="lm-steps__item lm-steps__item--completed">
          <div class="lm-steps__number">1</div>
          <div class="lm-steps__title">Registry Initialization</div>
          <div class="lm-steps__desc">Calls <code>ComponentRegistry.instance.registerAll()</code> (idempotent)</div>
        </div>
        <div class="lm-steps__item lm-steps__item--completed">
          <div class="lm-steps__number">2</div>
          <div class="lm-steps__title">Theme Resolution</div>
          <div class="lm-steps__desc">Reads <code>Theme.of(context).brightness</code> &#8594; <code>LumenThemeData.dark()</code> or <code>.light()</code></div>
        </div>
        <div class="lm-steps__item lm-steps__item--completed">
          <div class="lm-steps__number">3</div>
          <div class="lm-steps__title">Context Creation</div>
          <div class="lm-steps__desc">Creates <code>LumenRenderContext</code> with <code>onAction</code> callback and <code>isStreaming</code></div>
        </div>
        <div class="lm-steps__item">
          <div class="lm-steps__number">4</div>
          <div class="lm-steps__title">Node Rendering</div>
          <div class="lm-steps__desc">Looks up definition &#8594; calls builder &#8594; wraps in <code>ErrorBoundary</code></div>
        </div>
        <div class="lm-steps__item lm-steps__item--pending">
          <div class="lm-steps__number">5</div>
          <div class="lm-steps__title">Layout</div>
          <div class="lm-steps__desc">Returns <code>Column(crossAxisAlignment: stretch)</code> of rendered widgets</div>
        </div>
      </div>
    </div>
  </div>
</div>

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
