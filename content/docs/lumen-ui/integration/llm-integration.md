---
title: "LLM Integration"
description: "How the Lumen UI component catalog is generated and injected into LLM system prompts so the LLM knows how to render rich UI."
weight: 1
tags: [lumen-ui, llm, prompts, catalog, integration]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/introduction/
  - /docs/lumen-ui/core-concepts/dsl-syntax/
estimated_reading_time: "7 min"
last_reviewed: "2026-03-17"
---

The core insight behind Lumen UI is that the LLM needs to know what components exist, what props they accept, and how to use them. This is accomplished by a **dynamic component catalog** that is generated from the registry at runtime and injected into every LLM system prompt.

## The Catalog Pipeline

```
┌─────────────────────┐
│  ComponentRegistry   │  72 ComponentDefinitions
│  (Flutter client)    │  with PropSchema entries
└──────────┬──────────┘
           │ registerAll()
           ▼
┌─────────────────────┐
│  PromptGenerator     │  Generates compact catalog text
│  (Flutter client)    │  from definitions + examples
└──────────┬──────────┘
           │ componentCatalog
           ▼
┌─────────────────────┐
│  API Request         │  Catalog sent as field in
│  (HTTP POST)         │  every chat/agent request
└──────────┬──────────┘
           │ component_catalog
           ▼
┌─────────────────────┐
│  Server              │  Injects catalog into
│  (Rust/Lumen)        │  system prompt dynamically
└──────────┬──────────┘
           │ system prompt
           ▼
┌─────────────────────┐
│  LLM                 │  Now knows all 72 components
│  (Claude, etc.)      │  and can emit <lumen> blocks
└─────────────────────┘
```

## Catalog Generation

The `PromptGenerator` reads all registered `ComponentDefinition` objects and produces a compact text catalog. Each component gets 2-3 lines:

```
#### Layout
- Card(title?: string, description?: string, variant?: default|outlined|elevated|ghost)
  Example: Card(title="Patient Summary", variant="elevated")
- Grid(columns?: number, gap?: number)
  Example: Grid(columns=2, Card(...), Card(...))
- Tabs(labels: string[], defaultIndex?: number)
  Example: Tabs(labels=["Overview","Labs"], Card(...), Table(...))

#### Data Display
- Table(columns: {key,label}[], rows: object[], striped?: bool, compact?: bool)
  Example: Table(columns=[{key:"test",label:"Test"}], rows=[...])
- Stat(label: string, value: string, unit?: string, trend?: up|down|neutral)
  Example: Stat(label="HR", value="72", unit="bpm")
...
```

### Three Generation Modes

| Method | Purpose | Size |
|--------|---------|------|
| `generateComponentCatalog()` | Compact listing for API requests | ~2KB |
| `generate()` | Basic prompt with descriptions | ~4KB |
| `generateFullSystemPrompt()` | Complete prompt with syntax guide + patterns | ~8KB |

## System Prompt Structure

The full system prompt section (`generateFullSystemPrompt()`) includes:

### 1. Artifact Format

```
ARTIFACT FORMAT:
  <artifact type="code|document|data|html" title="..." language="...">
    content
  </artifact>
  Types: code | document | data | html. Only >= 15 lines.
```

### 2. Lumen Component Syntax

```
RICH UI COMPONENTS:
  <lumen>ComponentName(key=value, ...)</lumen>
  Syntax: PascalCase. Nest components. Use for structured data.
  Do NOT reproduce tool results in text — render via components.
```

### 3. Complete Component Catalog

All 72 components with prop signatures and examples, grouped by category.

### 4. Composition Patterns

```
COMPOSITION PATTERNS:
- Dashboard: Grid(columns=2, Card(Stat(...)), Card(BarChart(...)))
- Tabbed: Tabs(labels=[...], Card(...), Table(...))
- Comparison: Table with multiple value columns
- Clinical Summary: Card(Stack(TriageCard(...), LabRanges(...)))
```

## Agent vs. Chat Context

The prompt generator has an `isAgentContext` flag that adjusts the language:

- **Chat context** — instructs the LLM to use `<lumen>` tags inline
- **Agent context** — instructs the LLM to use the `lumen_ui` tool for composing component trees programmatically

All 11+ agent types in the Lumen platform include artifact and Lumen instructions in their system prompts.

## Client-Side Integration

On app startup:

```dart
// Registry initializes and caches the catalog
ComponentRegistry.instance.registerAll();

// Access the cached catalog string
final catalog = ComponentRegistry.instance.componentCatalog;

// Send with API requests
final response = await http.post('/api/chat', body: {
  'message': userMessage,
  'component_catalog': catalog,  // Injected into system prompt server-side
});
```

The catalog is generated once on `registerAll()` and cached. It does not change during the app's lifetime.

## Prompt Sections

Two pre-built prompt sections are available:

```dart
// For chat contexts
final chatPrompt = ComponentRegistry.instance.chatPromptSection;

// For agent contexts
final agentPrompt = ComponentRegistry.instance.agentPromptSection;
```

Both are lazy-generated and cached on first access.

## Why Dynamic?

The catalog is generated from the live registry, not hardcoded. This means:

- Adding a new component automatically makes it available to the LLM
- Component prop changes are reflected in the next prompt
- No manual prompt engineering needed when extending the component library
- The server doesn't need to know about specific components — it just injects whatever the client sends

## Next Steps

- **[Envelope Protocol](/docs/lumen-ui/integration/envelope-protocol/)** — how server tools send structured results
- **[Rendering Surfaces](/docs/lumen-ui/integration/rendering-surfaces/)** — where Lumen components appear in the app
- **[API Reference: ComponentRegistry](/docs/lumen-ui/api-reference/component-registry/)** — full registry API
