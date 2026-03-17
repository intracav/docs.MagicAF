---
title: "Component Reference"
description: "Complete reference for all 72 Lumen UI components — props, examples, and usage guidance across 8 categories."
weight: 4
---

Lumen UI ships 72 production-ready components organized into 8 categories. Each component has a typed schema, DSL and JSON examples, and composition patterns.

---

<div class="card-grid">
<div class="card">

### [Layout →](/docs/lumen-ui/components/layout/)
**10 components** — Card, Stack, Grid, Tabs, Accordion, Steps, Section, Separator, ScrollArea, SplitView

</div>
<div class="card">

### [Data Display →](/docs/lumen-ui/components/data-display/)
**9 components** — Table, KeyValue, Stat, Markdown, CodeBlock, JsonViewer, ListView, Timeline, DescriptionList

</div>
<div class="card">

### [Charts & Visualization →](/docs/lumen-ui/components/charts/)
**8 components** — BarChart, LineChart, AreaChart, PieChart, RadarChart, ScatterChart, Gauge, Sparkline

</div>
<div class="card">

### [Forms & Input →](/docs/lumen-ui/components/forms/)
**8 components** — Input, Select, Checkbox, RadioGroup, Slider, DatePicker, Toggle, TextArea

</div>
<div class="card">

### [Clinical →](/docs/lumen-ui/components/clinical/)
**20 components** — DrugCard, LabRanges, TriageCard, FhirPatient, IVDrip, RenalDose, and 14 more

</div>
<div class="card">

### [Media →](/docs/lumen-ui/components/media/)
**5 components** — Image, ImageGallery, FileCard, PdfViewer, HtmlEmbed

</div>
<div class="card">

### [Feedback & Status →](/docs/lumen-ui/components/feedback/)
**6 components** — Alert, Callout, Badge, Progress, StatusBadge, EmptyState

</div>
<div class="card">

### [AI / Chat →](/docs/lumen-ui/components/ai/)
**6 components** — ToolCall, ToolResult, ThinkingBlock, FollowUp, SourceCard, StreamingText

</div>
</div>

---

## Quick Reference

Every component follows the same pattern:

| Concept | Detail |
|---------|--------|
| **DSL name** | PascalCase (e.g., `BarChart`, `DrugCard`) |
| **Registry type** | snake_case (e.g., `bar_chart`, `drug_card`) |
| **Props** | Typed key-value pairs (string, number, bool, array, object, enum) |
| **Children** | Some components accept nested child components |
| **Actions** | Form components dispatch `submitForm` / `toggleState` |
| **Rendering** | Each component maps to a Flutter widget via a builder function |
| **Errors** | Wrapped in ErrorBoundary — failures render a fallback card |

## Finding the Right Component

| I need to... | Use |
|--------------|-----|
| Show structured data in rows and columns | [Table](/docs/lumen-ui/components/data-display/table/) |
| Display a big number / KPI | [Stat](/docs/lumen-ui/components/data-display/stat/) |
| Show a trend over time | [LineChart](/docs/lumen-ui/components/charts/line-chart/) or [Sparkline](/docs/lumen-ui/components/charts/sparkline/) |
| Compare categories | [BarChart](/docs/lumen-ui/components/charts/bar-chart/) |
| Show part-of-whole | [PieChart](/docs/lumen-ui/components/charts/pie-chart/) |
| Display drug information | [DrugCard](/docs/lumen-ui/components/clinical/drug-card/) |
| Show lab reference ranges | [LabRanges](/docs/lumen-ui/components/clinical/lab-ranges/) |
| Render markdown text | [Markdown](/docs/lumen-ui/components/data-display/markdown/) |
| Collect user input | [Input](/docs/lumen-ui/components/forms/input/), [Select](/docs/lumen-ui/components/forms/select/), etc. |
| Show AI tool execution | [ToolCall](/docs/lumen-ui/components/ai/tool-call/) + [ToolResult](/docs/lumen-ui/components/ai/tool-result/) |
| Suggest follow-up questions | [FollowUp](/docs/lumen-ui/components/ai/follow-up/) |
| Show an alert or warning | [Alert](/docs/lumen-ui/components/feedback/alert/) |
| Organize content in tabs | [Tabs](/docs/lumen-ui/components/layout/tabs/) |
| Build a multi-panel layout | [Grid](/docs/lumen-ui/components/layout/grid/) + [Card](/docs/lumen-ui/components/layout/card/) |
