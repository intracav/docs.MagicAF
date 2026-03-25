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

<div class="lm-pipeline" style="justify-content:center; margin: 2em 0;">
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#128172;</div>
    <span class="lm-pipeline__label">LLM Output</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#128196;</div>
    <span class="lm-pipeline__label">Parser</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#127795;</div>
    <span class="lm-pipeline__label">LumenNode Tree</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#127912;</div>
    <span class="lm-pipeline__label">Renderer</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#128241;</div>
    <span class="lm-pipeline__label">Flutter Widgets</span>
  </div>
</div>

This is not a template engine. The LLM is the author. Lumen UI is the typesetter.

## The Problem

LLMs are good at generating text. They are bad at generating UI. The standard approach — returning markdown or HTML strings — leads to:

<div class="lm-grid lm-grid--2" style="margin: 1.5em 0;">
  <div class="lm-alert lm-alert--error">
    <span class="lm-alert__icon">&#10006;</span>
    <div class="lm-alert__content">
      <div class="lm-alert__title">Inconsistent formatting</div>
      <div class="lm-alert__message">Every response looks slightly different. No visual consistency across queries.</div>
    </div>
  </div>
  <div class="lm-alert lm-alert--error">
    <span class="lm-alert__icon">&#10006;</span>
    <div class="lm-alert__content">
      <div class="lm-alert__title">No interactivity</div>
      <div class="lm-alert__message">Markdown tables can't sort. Markdown charts don't exist. Dead-end content.</div>
    </div>
  </div>
  <div class="lm-alert lm-alert--error">
    <span class="lm-alert__icon">&#10006;</span>
    <div class="lm-alert__content">
      <div class="lm-alert__title">Lost structure</div>
      <div class="lm-alert__message">An LLM that returns drug data as a paragraph throws away the structure it already had.</div>
    </div>
  </div>
  <div class="lm-alert lm-alert--error">
    <span class="lm-alert__icon">&#10006;</span>
    <div class="lm-alert__content">
      <div class="lm-alert__title">Unsafe rendering</div>
      <div class="lm-alert__message">Raw HTML from an LLM is an injection vector. XSS, layout-breaking, uncloseable tags.</div>
    </div>
  </div>
</div>

Lumen UI solves this by giving the LLM a controlled vocabulary of 72 typed components, each with a defined schema. The LLM chooses the right component and fills in the props. The renderer handles the rest.

## How It Works

### 1. The LLM Knows the Components

On every API request, the client sends a **component catalog** — a compact, auto-generated listing of every available component, its props, and an example. The server injects this catalog into the system prompt, so the LLM always knows exactly what it can render.

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Component Catalog (sent to LLM)</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">System Prompt — Component Catalog</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-code-block">
        <div class="lm-code-block__header"><span class="lm-code-block__lang">Catalog</span></div>
        <div class="lm-code-block__body">AVAILABLE COMPONENTS:

#### Layout
- Card(title?, description?, variant?)
- Grid(columns?, gap?)
- Tabs(labels)

#### Data Display
- Table(columns, rows, striped?, compact?)
- Stat(label, value, unit?, trend?, change?)

#### Charts
- BarChart(data, title?, height?)
- LineChart(series, labels, title?)

#### Clinical
- TriageCard(level, chief_complaint?, action?)
- DrugCard(name, rxcui, ingredients, brand_names)
...</div>
      </div>
    </div>
  </div>
</div>

### 2. The LLM Writes DSL (or JSON)

When the LLM decides that structured UI is the right response, it wraps its output in `<lumen>` tags:

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">LLM Response</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LLM Output Stream</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-streaming-text" style="margin-bottom:12px;">Here are the lab results for your patient:<span class="lm-streaming-text__cursor"></span></div>
      <div class="lm-code-block">
        <div class="lm-code-block__header"><span class="lm-code-block__lang">Lumen DSL</span></div>
        <div class="lm-code-block__body">&lt;lumen&gt;
Card(title="Complete Blood Count",
  Table(
    columns=[{key:"test", label:"Test"},
             {key:"value", label:"Result"},
             {key:"range", label:"Reference"}],
    rows=[
      {test:"WBC", value:"7.2 K/uL", range:"4.5-11.0"},
      {test:"Hgb", value:"14.1 g/dL", range:"12.0-16.0"},
      {test:"Plt", value:"245 K/uL", range:"150-400"}
    ],
    striped=true
  )
)
&lt;/lumen&gt;</div>
      </div>
    </div>
  </div>
</div>

### 3. The Renderer Produces Widgets

That DSL is parsed and rendered into real, interactive components:

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Rendered Output</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Lumen UI — Rendered</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header"><div class="lm-card__title">Complete Blood Count</div></div>
        <div class="lm-card__body">
          <table class="lm-table lm-table--striped">
            <thead><tr><th>Test</th><th>Result</th><th>Reference</th></tr></thead>
            <tbody>
              <tr><td>WBC</td><td>7.2 K/uL</td><td>4.5-11.0</td></tr>
              <tr><td>Hgb</td><td>14.1 g/dL</td><td>12.0-16.0</td></tr>
              <tr><td>Plt</td><td>245 K/uL</td><td>150-400</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

Every node is wrapped in an `ErrorBoundary`, so a malformed prop on one component doesn't take down the entire tree.

## Design Principles

### Declarative, Not Imperative

Components are stateless data structures. The LLM declares **what** to render, not **how**. There is no scripting, no event handlers in the DSL, no control flow. The DSL is a pure description of UI state.

### Schema-Driven

Every component has a `ComponentDefinition` with typed `PropSchema` entries. This schema serves three purposes:

<div class="lm-steps" style="margin: 1em 0 1.5em;">
  <div class="lm-steps__item lm-steps__item--completed">
    <span class="lm-steps__number">1</span>
    <div class="lm-steps__title">Prompt generation</div>
    <div class="lm-steps__desc">The LLM knows what props are available and their types</div>
  </div>
  <div class="lm-steps__item lm-steps__item--completed">
    <span class="lm-steps__number">2</span>
    <div class="lm-steps__title">Validation</div>
    <div class="lm-steps__desc">Malformed props are caught before rendering</div>
  </div>
  <div class="lm-steps__item lm-steps__item--completed">
    <span class="lm-steps__number">3</span>
    <div class="lm-steps__title">Documentation</div>
    <div class="lm-steps__desc">Component reference pages are generated from the schema</div>
  </div>
</div>

### Streaming-First

The parser is designed to handle truncated input gracefully. Unclosed brackets, missing props, and partial strings are all recovered into renderable (if incomplete) trees. This means the UI builds up progressively as the LLM streams, rather than waiting for the complete response.

### Fail-Open

Unknown component types render as fallback cards. Malformed props use defaults. Exceptions in builders are caught by error boundaries. The system is designed to always render *something* — a degraded view is better than a crash.

### Zero-Config Theming

`LumenRenderer` auto-detects light or dark mode from Flutter's `BuildContext`. No theme wrapper or configuration is required. Colors, typography, and chart palettes adapt automatically.

## What You Can Build

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Example — Data Dashboard</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Dashboard Composition</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated" style="margin-bottom:16px;">
        <div class="lm-card__header"><div class="lm-card__title">Department Overview</div><div class="lm-card__description">Q1 2026 Performance Metrics</div></div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--4" style="margin-bottom:16px;">
            <div class="lm-stat">
              <span class="lm-stat__label">Total Admissions</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">1,247</span></div>
              <span class="lm-stat__change lm-stat__change--up">&#9650; +12%</span>
            </div>
            <div class="lm-stat">
              <span class="lm-stat__label">Avg LOS</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">4.2</span><span class="lm-stat__unit">days</span></div>
              <span class="lm-stat__change lm-stat__change--down">&#9660; -0.5</span>
            </div>
            <div class="lm-stat lm-stat--success">
              <span class="lm-stat__label">Satisfaction</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">94</span><span class="lm-stat__unit">%</span></div>
              <span class="lm-stat__change lm-stat__change--up">&#9650; +3%</span>
            </div>
            <div class="lm-stat lm-stat--warning">
              <span class="lm-stat__label">Readmission</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">8.1</span><span class="lm-stat__unit">%</span></div>
              <span class="lm-stat__change lm-stat__change--up">&#9650; +1.2%</span>
            </div>
          </div>
          <div class="lm-bar-chart lm-animate-bars">
            <div class="lm-bar-chart__title">Admissions by Department</div>
            <div class="lm-bar-chart__bars" style="height:120px;">
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-1" style="height:65%;"><span class="lm-bar-chart__bar-value">312</span></div><span class="lm-bar-chart__bar-label">Cardiology</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-2" style="height:48%;"><span class="lm-bar-chart__bar-value">228</span></div><span class="lm-bar-chart__bar-label">Neurology</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-3" style="height:55%;"><span class="lm-bar-chart__bar-value">264</span></div><span class="lm-bar-chart__bar-label">Ortho</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-4" style="height:80%;"><span class="lm-bar-chart__bar-value">383</span></div><span class="lm-bar-chart__bar-label">Oncology</span></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-5" style="height:30%;"><span class="lm-bar-chart__bar-value">142</span></div><span class="lm-bar-chart__bar-label">Pediatrics</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

Lumen UI is designed for AI-first interfaces where the LLM is the primary content author:

- **Clinical decision support** — drug cards, lab ranges, triage assessments, differential diagnoses
- **Data dashboards** — multi-panel layouts with stats, charts, and tables
- **Research summaries** — clinical trials, guidelines, citation cards with sources
- **Interactive forms** — intake questionnaires, checklists, calculators
- **Agent tool results** — structured rendering of API call outputs
- **Workflow outputs** — step-by-step pipeline results with progress indicators

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Agent Tool Results</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Agent Run — Drug Lookup</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-4" style="margin-bottom:12px;">
        <div class="lm-tool-call"><span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span><span class="lm-tool-call__name">RxNorm Lookup</span><span class="lm-tool-call__primary-arg">Lisinopril</span><span class="lm-tool-call__duration">0.6s</span></div>
        <div class="lm-tool-call"><span class="lm-tool-call__icon lm-tool-call__icon--completed">&#10003;</span><span class="lm-tool-call__name">Drug Interactions</span><span class="lm-tool-call__primary-arg">Lisinopril</span><span class="lm-tool-call__duration">1.1s</span></div>
        <div class="lm-tool-call"><span class="lm-tool-call__icon lm-tool-call__icon--running">&#8635;</span><span class="lm-tool-call__name">Lab Reference Ranges</span><span class="lm-tool-call__primary-arg">Potassium</span></div>
      </div>
      <div class="lm-tool-result">
        <div class="lm-tool-result__label">Result</div>
        <div class="lm-drug-card">
          <div class="lm-drug-card__header">
            <div class="lm-drug-card__name">Lisinopril 10 MG Oral Tablet</div>
            <div class="lm-drug-card__rxcui">RXCUI: 104377 · SCD</div>
          </div>
          <div class="lm-drug-card__body">
            <div><div class="lm-drug-card__section-label">Ingredients</div><div class="lm-drug-card__tags"><span class="lm-drug-card__tag">Lisinopril</span></div></div>
            <div><div class="lm-drug-card__section-label">Brand Names</div><div class="lm-drug-card__tags"><span class="lm-drug-card__tag">Prinivil</span><span class="lm-drug-card__tag">Zestril</span></div></div>
            <div><div class="lm-drug-card__section-label">Dose Forms</div><div class="lm-drug-card__tags"><span class="lm-drug-card__tag">Oral Tablet</span></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Next Steps

- **[Quick Start](/docs/lumen-ui/quick-start/)** — render your first component in 20 lines
- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — learn the Lumen DSL
- **[Component Reference](/docs/lumen-ui/components/)** — browse all 72 components
