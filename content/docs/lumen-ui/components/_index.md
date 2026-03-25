---
title: "Component Reference"
description: "Complete reference for all 72 Lumen UI components — props, examples, and usage guidance across 8 categories."
weight: 4
---

Lumen UI ships 72 production-ready components organized into 8 categories. Each component has a typed schema, DSL and JSON examples, and composition patterns.

---

## Component Gallery

<div class="lumen-demo">
  <div class="lumen-demo__label">Component Sampler</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Lumen UI — 72 Components</span>
    </div>
    <div class="lumen-demo__content lm">
      <!-- Row 1: Stats + Chart -->
      <div class="lm-card lm-card--elevated" style="margin-bottom:12px;">
        <div class="lm-card__header"><div class="lm-card__title">Patient Dashboard</div></div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--3" style="margin-bottom:12px;">
            <div class="lm-stat">
              <span class="lm-stat__label">Heart Rate</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">72</span><span class="lm-stat__unit">bpm</span></div>
              <span class="lm-stat__change lm-stat__change--down">&#9660; -5</span>
            </div>
            <div class="lm-stat lm-stat--success">
              <span class="lm-stat__label">SpO2</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">98</span><span class="lm-stat__unit">%</span></div>
              <span class="lm-stat__change lm-stat__change--up">&#9650; +1</span>
            </div>
            <div class="lm-stat lm-stat--warning">
              <span class="lm-stat__label">Glucose</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">142</span><span class="lm-stat__unit">mg/dL</span></div>
              <span class="lm-stat__change lm-stat__change--up">&#9650; +22</span>
            </div>
          </div>
          <div class="lm-bar-chart lm-animate-bars">
            <div class="lm-bar-chart__bars" style="height:80px;">
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-1" style="height:65%;"><span class="lm-bar-chart__bar-value">72</span></div><span class="lm-bar-chart__bar-label">Mon</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-1" style="height:80%;"><span class="lm-bar-chart__bar-value">88</span></div><span class="lm-bar-chart__bar-label">Tue</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-1" style="height:55%;"><span class="lm-bar-chart__bar-value">61</span></div><span class="lm-bar-chart__bar-label">Wed</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-1" style="height:90%;"><span class="lm-bar-chart__bar-value">98</span></div><span class="lm-bar-chart__bar-label">Thu</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-2" style="height:70%;"><span class="lm-bar-chart__bar-value">76</span></div><span class="lm-bar-chart__bar-label">Fri</span></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Row 2: Table + Alert -->
      <div class="lm-grid lm-grid--2" style="margin-bottom:12px;">
        <div>
          <table class="lm-table lm-table--striped lm-table--compact">
            <thead><tr><th>Test</th><th>Result</th><th>Flag</th></tr></thead>
            <tbody>
              <tr><td>WBC</td><td>12.4 K/uL</td><td><span class="flag-h">H</span></td></tr>
              <tr><td>Hgb</td><td>14.1 g/dL</td><td></td></tr>
              <tr><td>Plt</td><td>145 K/uL</td><td><span class="flag-l">L</span></td></tr>
            </tbody>
          </table>
        </div>
        <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
          <div class="lm-alert lm-alert--warning" style="font-size:12px;">
            <span class="lm-alert__icon">&#9888;</span>
            <div class="lm-alert__content"><div class="lm-alert__title">Elevated WBC</div><div class="lm-alert__message">Consider infection workup</div></div>
          </div>
          <div class="lm-alert lm-alert--info" style="font-size:12px;">
            <span class="lm-alert__icon">&#8505;</span>
            <div class="lm-alert__content"><div class="lm-alert__title">Low Platelets</div><div class="lm-alert__message">Repeat in 24h if trending</div></div>
          </div>
        </div>
      </div>
      <!-- Row 3: Tool calls + Follow-ups -->
      <div class="lm-stack lm-stack--vertical lm-stack--gap-4" style="margin-bottom:12px;">
        <div class="lm-tool-call"><span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span><span class="lm-tool-call__name">Lab Results</span><span class="lm-tool-call__primary-arg">CBC Panel</span><span class="lm-tool-call__duration">0.4s</span></div>
        <div class="lm-tool-call"><span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span><span class="lm-tool-call__name">Drug Check</span><span class="lm-tool-call__primary-arg">Interactions</span><span class="lm-tool-call__duration">0.8s</span></div>
      </div>
      <div class="lm-follow-up">
        <button class="lm-follow-up__btn">Order repeat CBC</button>
        <button class="lm-follow-up__btn">View trend graph</button>
        <button class="lm-follow-up__btn">Generate note</button>
      </div>
    </div>
  </div>
</div>

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
