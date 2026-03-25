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

<div class="lumen-demo">
  <div class="lumen-demo__label">Rendering Pipeline</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">DSL / JSON &rarr; Flutter Widget</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128196;</div>
          <span class="lm-pipeline__label">DSL / JSON</span>
          <span class="lm-pipeline__sublabel">Raw input</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#9881;</div>
          <span class="lm-pipeline__label">LumenParser</span>
          <span class="lm-pipeline__sublabel">Parse &amp; tokenize</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127795;</div>
          <span class="lm-pipeline__label">LumenNode</span>
          <span class="lm-pipeline__sublabel">Component tree</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128218;</div>
          <span class="lm-pipeline__label">Registry</span>
          <span class="lm-pipeline__sublabel">Lookup builder</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128295;</div>
          <span class="lm-pipeline__label">Builder</span>
          <span class="lm-pipeline__sublabel">Build widget</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127912;</div>
          <span class="lm-pipeline__label">Widget</span>
          <span class="lm-pipeline__sublabel">Flutter UI</span>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Registry Lookup</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">ComponentRegistry.instance["card"]</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-family:'SF Mono',Monaco,monospace; font-size:12px; background:var(--entry); padding:4px 10px; border-radius:6px; color:var(--text-primary);">node.type = "card"</span>
          <span style="color:var(--text-tertiary);">&#8594;</span>
          <span class="lm-badge lm-badge--success">Found</span>
        </div>
        <table class="lm-table lm-table--compact">
          <thead><tr><th>Type</th><th>Category</th><th>Allows Children</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td style="font-family:'SF Mono',Monaco,monospace; font-size:12px;">card</td><td>Layout</td><td>Yes</td><td><span class="lm-badge lm-badge--success">Registered</span></td></tr>
            <tr><td style="font-family:'SF Mono',Monaco,monospace; font-size:12px;">bar_chart</td><td>Charts</td><td>No</td><td><span class="lm-badge lm-badge--success">Registered</span></td></tr>
            <tr><td style="font-family:'SF Mono',Monaco,monospace; font-size:12px;">stat</td><td>Data Display</td><td>No</td><td><span class="lm-badge lm-badge--success">Registered</span></td></tr>
            <tr><td style="font-family:'SF Mono',Monaco,monospace; font-size:12px;">foo_widget</td><td>&mdash;</td><td>&mdash;</td><td><span class="lm-badge lm-badge--error">Not Found</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Render Steps</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LumenRenderer.build()</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-steps">
        <div class="lm-steps__item lm-steps__item--completed">
          <span class="lm-steps__number">1</span>
          <div class="lm-steps__title">Register Components</div>
          <div class="lm-steps__desc">ComponentRegistry.instance.registerAll() &mdash; idempotent, runs once</div>
        </div>
        <div class="lm-steps__item lm-steps__item--completed">
          <span class="lm-steps__number">2</span>
          <div class="lm-steps__title">Detect Theme</div>
          <div class="lm-steps__desc">Auto-detect from Flutter's Brightness, or use explicit theme</div>
        </div>
        <div class="lm-steps__item lm-steps__item--completed">
          <span class="lm-steps__number">3</span>
          <div class="lm-steps__title">Create RenderContext</div>
          <div class="lm-steps__desc">Action callback + streaming state propagated to all builders</div>
        </div>
        <div class="lm-steps__item lm-steps__item--completed">
          <span class="lm-steps__number">4</span>
          <div class="lm-steps__title">Build Each Node</div>
          <div class="lm-steps__desc">Registry lookup &rarr; builder(node, theme, ctx) &rarr; ErrorBoundary wrap</div>
        </div>
        <div class="lm-steps__item lm-steps__item--completed">
          <span class="lm-steps__number">5</span>
          <div class="lm-steps__title">Return Column</div>
          <div class="lm-steps__desc">All widgets arranged vertically as the final output</div>
        </div>
      </div>
    </div>
  </div>
</div>

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
        <div class="lm-card">
          <div class="lm-card__header"><div class="lm-card__title">Patient Dashboard</div></div>
          <div class="lm-card__body">
            <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
              <div class="lm-stat">
                <span class="lm-stat__label">Heart Rate</span>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">72</span>
                  <span class="lm-stat__unit">bpm</span>
                </div>
              </div>
              <!-- Error fallback card -->
              <div style="padding:12px; background:var(--entry); border-radius:6px; border:1px solid var(--border);">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                  <span style="color:#DA373C; font-size:14px;">&#9888;</span>
                  <span style="font-size:13px; font-weight:600; color:var(--text-primary);">Error in: custom_vitals_graph</span>
                </div>
                <span style="font-size:12px; color:var(--text-tertiary);">TypeError: Cannot read property 'data' of undefined</span>
              </div>
              <!-- Working component continues -->
              <div class="lm-stat lm-stat--success">
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
</div>

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

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Unknown Component Fallback</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <div style="padding:12px; background:var(--entry); border-radius:6px; border:1px dashed var(--border);">
          <span style="font-size:12px; color:var(--text-tertiary);">Unknown: <strong>fancy_3d_chart</strong></span>
        </div>
        <div style="padding:12px; background:var(--entry); border-radius:6px; border:1px dashed var(--border);">
          <span style="font-size:12px; color:var(--text-tertiary);">Unknown: <strong>hologram_viewer</strong></span>
          <p style="font-size:12px; color:var(--text-tertiary); margin:4px 0 0;">Interactive 3D molecule visualization</p>
        </div>
      </div>
    </div>
  </div>
</div>

This fail-open design means new component types can be added on the server (in LLM prompts) before the client knows about them — the client will render a placeholder until the component is implemented.

## Next Steps

- **[Theming](/docs/lumen-ui/core-concepts/theming/)** — customize the visual appearance
- **[Actions](/docs/lumen-ui/core-concepts/actions/)** — handle component interactions
- **[API Reference: LumenRenderer](/docs/lumen-ui/api-reference/lumen-renderer/)** — full API documentation
