---
title: "Introduction"
description: "What Lumen UI is, how it works, and the design principles behind AI-generated component rendering."
weight: 1
tags: [lumen-ui, introduction, generative-ui, dsl]
categories: [concept]
difficulty: beginner
estimated_reading_time: "8 min"
last_reviewed: "2026-03-17"
---

## What Is Lumen UI?

Lumen UI is a **component DSL and rendering engine** that lets an LLM produce structured, rich UI as part of its response — not just plain text or markdown.

When an LLM in the Lumen ecosystem responds to a query, it can emit structured component definitions using either the **Lumen DSL** (a PascalCase function-call syntax) or **JSON**. The Lumen parser converts these definitions into a tree of `LumenNode` objects. The `LumenRenderer` walks that tree and produces real Flutter widgets — tables, charts, clinical cards, forms, and more — in real time, including during streaming.

```
LLM Output → Parser → LumenNode Tree → Renderer → Flutter Widgets
```

This is not a template engine. The LLM is the author. Lumen UI is the typesetter.

## The Problem

LLMs are good at generating text. They are bad at generating UI. The standard approach — returning markdown or HTML strings — leads to:

- **Inconsistent formatting.** Every response looks slightly different.
- **No interactivity.** Markdown tables can't sort. Markdown charts don't exist.
- **Lost structure.** An LLM that returns a drug interaction as a paragraph has thrown away the structure it already had.
- **Unsafe rendering.** Raw HTML from an LLM is an injection vector.

Lumen UI solves this by giving the LLM a controlled vocabulary of 72 typed components, each with a defined schema. The LLM chooses the right component and fills in the props. The renderer handles the rest.

## How It Works

### 1. The LLM Knows the Components

On every API request, the client sends a **component catalog** — a compact, auto-generated listing of every available component, its props, and an example. The server injects this catalog into the system prompt, so the LLM always knows exactly what it can render.

```
AVAILABLE COMPONENTS:

#### Layout
- Card(title?: string, description?: string, variant?: default|outlined|elevated|ghost)
  Example: Card(title="Patient Summary")

#### Data Display
- Table(columns: array, rows: array, striped?: bool, compact?: bool)
  Example: Table(columns=[{key:"test",label:"Test"}], rows=[...])

#### Charts
- BarChart(data: array, title?: string, height?: number)
  Example: BarChart(data=[{label:"Q1",value:42}], title="Revenue")
...
```

### 2. The LLM Writes DSL (or JSON)

When the LLM decides that structured UI is the right response, it wraps its output in `<lumen>` tags:

```
Here are the lab results for your patient:

<lumen>
Card(title="Complete Blood Count",
  Table(
    columns=[{key:"test", label:"Test"}, {key:"value", label:"Result"}, {key:"range", label:"Reference"}],
    rows=[
      {test:"WBC", value:"7.2 K/uL", range:"4.5-11.0"},
      {test:"Hgb", value:"14.1 g/dL", range:"12.0-16.0"},
      {test:"Plt", value:"245 K/uL", range:"150-400"}
    ],
    striped=true
  )
)
</lumen>
```

### 3. The Parser Handles the Rest

The `LumenParser` auto-detects the format (DSL or JSON), tokenizes and parses the input, and produces a tree of `LumenNode` objects. It is **streaming-resilient** — it can produce partial, renderable trees from incomplete input, so the UI updates progressively as the LLM streams tokens.

### 4. The Renderer Produces Widgets

`LumenRenderer` walks the node tree and looks up each component type in the `ComponentRegistry`. Each registered component has a builder function that converts `(node, theme, context) → Widget`. Unknown types render as a gray fallback card — they never crash.

Every node is wrapped in an `ErrorBoundary`, so a malformed prop on one component doesn't take down the entire tree.

## Design Principles

### Declarative, Not Imperative

Components are stateless data structures. The LLM declares **what** to render, not **how**. There is no scripting, no event handlers in the DSL, no control flow. The DSL is a pure description of UI state.

### Schema-Driven

Every component has a `ComponentDefinition` with typed `PropSchema` entries. This schema serves three purposes:

1. **Prompt generation** — the LLM knows what props are available and their types
2. **Validation** — malformed props are caught before rendering
3. **Documentation** — component reference pages are generated from the schema

### Streaming-First

The parser is designed to handle truncated input gracefully. Unclosed brackets, missing props, and partial strings are all recovered into renderable (if incomplete) trees. This means the UI builds up progressively as the LLM streams, rather than waiting for the complete response.

### Fail-Open

Unknown component types render as fallback cards. Malformed props use defaults. Exceptions in builders are caught by error boundaries. The system is designed to always render *something* — a degraded view is better than a crash.

### Zero-Config Theming

`LumenRenderer` auto-detects light or dark mode from Flutter's `BuildContext`. No theme wrapper or configuration is required. Colors, typography, and chart palettes adapt automatically.

## What You Can Build

Lumen UI is designed for AI-first interfaces where the LLM is the primary content author:

- **Clinical decision support** — drug cards, lab ranges, triage assessments, differential diagnoses
- **Data dashboards** — multi-panel layouts with stats, charts, and tables
- **Research summaries** — clinical trials, guidelines, citation cards with sources
- **Interactive forms** — intake questionnaires, checklists, calculators
- **Agent tool results** — structured rendering of API call outputs
- **Workflow outputs** — step-by-step pipeline results with progress indicators

## Next Steps

- **[Quick Start](/docs/lumen-ui/quick-start/)** — render your first component in 20 lines
- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — learn the Lumen DSL
- **[Component Reference](/docs/lumen-ui/components/)** — browse all 72 components
