---
title: "ComponentRegistry"
description: "API reference for ComponentRegistry — the singleton registry of all component definitions with catalog generation."
weight: 3
tags: [lumen-ui, api, registry, catalog]
categories: [api-reference]
difficulty: intermediate
estimated_reading_time: "5 min"
last_reviewed: "2026-03-17"
---

`ComponentRegistry` is a singleton that holds all `ComponentDefinition` objects and provides lookup, filtering, and catalog generation.

**Source:** `packages/lumen_ui/lib/src/core/registry/component_registry.dart`

## Singleton Access

```dart
final registry = ComponentRegistry.instance;
```

## Methods

### `registerAll`

```dart
void registerAll()
```

Registers all 72 built-in components. Idempotent — safe to call multiple times. Called automatically by `LumenRenderer` on first build.

Also generates and caches the component catalog string.

### `register`

```dart
void register(ComponentDefinition definition)
```

Registers a single component definition. Use this to add custom components after `registerAll()`.

### `operator []`

```dart
ComponentDefinition? operator [](String type)
```

Looks up a component definition by its snake_case type string.

```dart
final cardDef = registry['card'];           // ComponentDefinition
final chartDef = registry['bar_chart'];     // ComponentDefinition
final missing = registry['nonexistent'];    // null
```

### `isRegistered`

```dart
bool isRegistered(String type)
```

Returns `true` if a component with the given type is registered.

### `byCategory`

```dart
List<ComponentDefinition> byCategory(ComponentCategory category)
```

Returns all component definitions in the given category.

```dart
final clinicalComponents = registry.byCategory(ComponentCategory.clinical);
// Returns 20 ComponentDefinition objects
```

## Properties

### `componentCatalog`

```dart
String get componentCatalog
```

Cached compact text listing of all components, suitable for sending to the server as part of API requests. Generated once on `registerAll()`.

Format:

```
#### Layout
- Card(title?: string, description?: string, variant?: default|outlined|elevated|ghost)
  Example: Card(title="Patient Summary")
...
```

### `chatPromptSection`

```dart
String get chatPromptSection
```

Lazy-generated full prompt section for chat contexts. Includes artifact format, Lumen syntax guide, complete catalog, and composition patterns.

### `agentPromptSection`

```dart
String get agentPromptSection
```

Lazy-generated prompt section for agent contexts. Similar to `chatPromptSection` but with agent-specific language.

## ComponentCategory

```dart
enum ComponentCategory {
  layout,
  dataDisplay,
  charts,
  forms,
  clinical,
  media,
  feedback,
  ai,
}
```

## ComponentDefinition

```dart
class ComponentDefinition {
  final String type;
  final ComponentCategory category;
  final String description;
  final bool allowsChildren;
  final List<PropSchema> props;
  final ComponentBuilder builder;
  final List<ComponentExample> examples;
}
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `String` | snake_case type identifier |
| `category` | `ComponentCategory` | Category grouping |
| `description` | `String` | Description for LLM prompts |
| `allowsChildren` | `bool` | Whether the component accepts child nodes |
| `props` | `List<PropSchema>` | Property definitions |
| `builder` | `ComponentBuilder` | `(LumenNode, LumenThemeData, LumenRenderContext) → Widget` |
| `examples` | `List<ComponentExample>` | Usage examples for prompt generation |

## PropSchema

```dart
class PropSchema {
  final String name;
  final PropType type;
  final bool required;
  final dynamic defaultValue;
  final String description;
  final List<String>? enumValues;
}
```

## PropType

```dart
enum PropType {
  string,
  number,
  bool,
  array,
  object,
  enums,
  color,
}
```

## See Also

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — how the registry is used during rendering
- **[LLM Integration](/docs/lumen-ui/integration/llm-integration/)** — how the catalog reaches the LLM
- **[Custom Components](/docs/lumen-ui/advanced/custom-components/)** — registering new components
