---
title: "Rendering"
description: "How Lumen UI converts parsed component trees into Flutter widgets — the registry, renderer, context, and error boundaries."
weight: 3
tags: [lumen-ui, rendering, renderer, registry, error-boundary]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/core-concepts/dsl-syntax/
estimated_reading_time: "8 min"
last_reviewed: "2026-03-17"
---

Rendering in Lumen UI is the process of converting a `LumenNode` tree (produced by the parser) into Flutter widgets. This page covers the four pieces that make it work: the **Component Registry**, the **Renderer**, the **Render Context**, and **Error Boundaries**.

## Pipeline Overview

```
                    ┌──────────────────┐
  DSL / JSON ──→    │   LumenParser    │ ──→ List<LumenNode>
                    └──────────────────┘
                              │
                    ┌─────────▼────────┐
                    │  LumenRenderer   │
                    │  (StatelessWidget)│
                    └─────────┬────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
    ┌───────▼──────┐  ┌──────▼───────┐  ┌──────▼───────┐
    │  Registry    │  │   Theme      │  │   Context    │
    │  (lookup)    │  │   (colors)   │  │   (actions)  │
    └───────┬──────┘  └──────┬───────┘  └──────┬───────┘
            │                │                 │
            └────────────────┼─────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  ErrorBoundary   │
                    │  (per node)      │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Flutter Widget  │
                    └──────────────────┘
```

## Component Registry

The `ComponentRegistry` is a singleton that maps component type strings to `ComponentDefinition` objects:

```dart
// Initialization (happens once, automatically in LumenRenderer)
ComponentRegistry.instance.registerAll();

// Lookup
final def = ComponentRegistry.instance['card'];
// def.builder(node, theme, context) → Widget

// Check availability
ComponentRegistry.instance.isRegistered('card'); // true
ComponentRegistry.instance.isRegistered('foo');  // false

// Filter by category
final charts = ComponentRegistry.instance.byCategory(ComponentCategory.charts);
```

### ComponentDefinition

Each registered component has:

```dart
ComponentDefinition {
  type: String,                          // 'card', 'bar_chart', etc.
  category: ComponentCategory,           // layout, dataDisplay, charts, etc.
  description: String,                   // Used in LLM prompts
  allowsChildren: bool,                  // Can contain child components
  props: List<PropSchema>,              // Property definitions
  builder: ComponentBuilder,             // (node, theme, context) → Widget
  examples: List<ComponentExample>,      // Usage examples for prompts
}
```

### PropSchema

Each prop has a typed schema:

```dart
PropSchema {
  name: String,                          // 'title', 'value', 'variant'
  type: PropType,                        // string, number, bool, array, object, enums, color
  required: bool,
  defaultValue: dynamic,
  description: String,                   // Used in LLM prompts
  enumValues: List<String>?,             // For enum types: ['default', 'outlined', ...]
}
```

## LumenRenderer

`LumenRenderer` is the top-level widget. It takes a list of nodes and produces the widget tree:

```dart
LumenRenderer(
  nodes: result.nodes,           // Required: parsed LumenNode list
  theme: null,                   // Optional: auto-detected if null
  isStreaming: false,             // Optional: streaming mode flag
  onAction: (action, data) {},   // Optional: action callback
)
```

### Rendering Flow

1. On first build, calls `ComponentRegistry.instance.registerAll()` (idempotent)
2. Auto-detects theme from Flutter's `Brightness` if no theme is provided
3. Creates a `LumenRenderContext` with the action callback and streaming state
4. For each node in the list:
   - Looks up `ComponentRegistry[node.type]`
   - If found, calls `definition.builder(node, theme, context)`
   - If not found, renders a fallback card
   - Wraps the result in an `ErrorBoundary`
5. Returns a `Column` of all rendered widgets

### Rendering Children

Components that accept children use the static helper:

```dart
// Inside a component builder:
final children = LumenRenderer.renderChildren(node, theme, context);
// Returns List<Widget> — one widget per child node
```

## LumenRenderContext

The render context carries state through the rendering tree:

```dart
LumenRenderContext {
  dispatch: (LumenAction, Map<String, dynamic>) → void,
  isStreaming: bool,
  depth: int,           // Nesting depth (incremented for children)
}
```

Components use the context to dispatch actions and check streaming state:

```dart
Widget _buildFollowUp(LumenNode node, LumenThemeData theme, LumenRenderContext ctx) {
  final suggestions = node.listProp('suggestions');
  return Wrap(
    children: suggestions.map((s) =>
      ActionChip(
        label: Text(s),
        onPressed: () => ctx.dispatch(LumenAction.sendMessage, {'message': s}),
      )
    ).toList(),
  );
}
```

## Error Boundaries

Every node is wrapped in an `ErrorBoundary` widget. If a builder throws an exception, the error boundary catches it and renders a fallback card instead of crashing:

```dart
// What the user sees when a component fails:
Container(
  padding: EdgeInsets.all(12),
  decoration: BoxDecoration(
    color: theme.colors.muted,
    borderRadius: BorderRadius.circular(6),
    border: Border.all(color: theme.colors.border),
  ),
  child: Column(children: [
    Text('Error in: $type'),
    Text(error.toString(), style: theme.typography.caption),
  ]),
)
```

This means:
- A malformed prop on one component doesn't take down the entire tree
- Unknown component types render as gray fallback cards with the type name
- The rest of the tree continues to render normally

## LumenNode Accessors

Components read props through typed accessors on `LumenNode`:

| Accessor | Return Type | Behavior |
|----------|-------------|----------|
| `node.prop<T>(key)` | `T?` | Generic typed access |
| `node.stringProp(key, [default])` | `String` | String with optional default |
| `node.numProp(key, [default])` | `num` | Number with optional default |
| `node.boolProp(key, [default])` | `bool` | Boolean with optional default |
| `node.listProp(key)` | `List<dynamic>` | Array prop (empty list if missing) |
| `node.mapProp(key)` | `Map<String, dynamic>` | Object prop (empty map if missing) |
| `node.textContent` | `String` | Text field or empty string |

## Fallback Rendering

When a component type is not registered:

```dart
Container(
  padding: EdgeInsets.all(12),
  decoration: BoxDecoration(
    color: theme.colors.muted,
    borderRadius: BorderRadius.circular(6),
    border: Border.all(color: theme.colors.border),
  ),
  child: Column(children: [
    Text('Unknown: $type', style: theme.typography.caption),
    if (node.text != null) Text(node.text!),
  ]),
)
```

This fail-open design means new component types can be added on the server (in LLM prompts) before the client knows about them — the client will render a placeholder until the component is implemented.

## Next Steps

- **[Theming](/docs/lumen-ui/core-concepts/theming/)** — customize the visual appearance
- **[Actions](/docs/lumen-ui/core-concepts/actions/)** — handle component interactions
- **[API Reference: LumenRenderer](/docs/lumen-ui/api-reference/lumen-renderer/)** — full API documentation
