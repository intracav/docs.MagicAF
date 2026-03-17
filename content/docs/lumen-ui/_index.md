---
title: "Lumen UI"
description: "A component DSL for AI-generated user interfaces. 72 components across 8 categories, rendered from structured definitions in real time."
weight: 9
keywords: [lumen ui, component dsl, ai-generated ui, generative ui, structured output, clinical components]
---

Lumen UI is a declarative component system that turns structured definitions — written by an LLM or by hand — into rich, interactive Flutter widgets in real time. It ships 72 production-ready components across 8 categories, a streaming-resilient parser, and a dynamic prompt system that teaches any LLM how to use every component.

It is the rendering layer that powers [Intracav Lumen](https://www.intracav.ai/) — the AI clinical assistant — and is designed to be the bridge between structured AI output and pixel-perfect UI.

---

<div class="card-grid">
<div class="card">

### [Introduction →](/docs/lumen-ui/introduction/)
What Lumen UI is, how it works, and the problems it solves.

</div>
<div class="card">

### [Quick Start →](/docs/lumen-ui/quick-start/)
Render your first component in under 20 lines of code.

</div>
<div class="card">

### [Core Concepts →](/docs/lumen-ui/core-concepts/)
DSL syntax, JSON format, rendering pipeline, theming, streaming, and actions.

</div>
<div class="card">

### [Component Reference →](/docs/lumen-ui/components/)
Complete reference for all 72 components — props, examples, and usage guidance.

</div>
<div class="card">

### [Integration →](/docs/lumen-ui/integration/)
LLM prompt injection, artifact adapters, the envelope protocol, and rendering surfaces.

</div>
<div class="card">

### [Advanced →](/docs/lumen-ui/advanced/)
Full language specification, composition patterns, custom components, and error handling.

</div>
<div class="card">

### [API Reference →](/docs/lumen-ui/api-reference/)
Dart API for LumenParser, LumenRenderer, ComponentRegistry, and supporting classes.

</div>
</div>

---

## At a Glance

| Dimension | Detail |
|-----------|--------|
| **Components** | 72 across 8 categories |
| **Input formats** | Lumen DSL (PascalCase function calls) and JSON |
| **Rendering target** | Flutter (web, desktop, mobile) |
| **Streaming** | Partial-content resilient — renders incomplete trees mid-stream |
| **Theming** | Zero-config, auto-detects light/dark from Flutter context |
| **LLM integration** | Dynamic component catalog injected into every system prompt |
| **Clinical** | 20 healthcare-specialized components (drug info, lab ranges, triage, FHIR, etc.) |
| **Charts** | 8 chart types via `fl_chart` (bar, line, area, pie, radar, scatter, gauge, sparkline) |

## Component Categories

| Category | Count | Examples |
|----------|-------|----------|
| [Layout](/docs/lumen-ui/components/layout/) | 10 | Card, Grid, Tabs, Accordion, Steps |
| [Data Display](/docs/lumen-ui/components/data-display/) | 9 | Table, Stat, CodeBlock, Timeline, KeyValue |
| [Charts](/docs/lumen-ui/components/charts/) | 8 | BarChart, LineChart, PieChart, Gauge, Sparkline |
| [Forms](/docs/lumen-ui/components/forms/) | 8 | Input, Select, Checkbox, Slider, DatePicker |
| [Clinical](/docs/lumen-ui/components/clinical/) | 20 | DrugCard, LabRanges, TriageCard, FhirPatient, IVDrip |
| [Media](/docs/lumen-ui/components/media/) | 5 | Image, ImageGallery, FileCard, PdfViewer |
| [Feedback](/docs/lumen-ui/components/feedback/) | 6 | Alert, Badge, Progress, StatusBadge, EmptyState |
| [AI / Chat](/docs/lumen-ui/components/ai/) | 6 | ToolCall, ToolResult, ThinkingBlock, FollowUp |
