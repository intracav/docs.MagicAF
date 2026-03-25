---
title: "Lumen UI"
description: "A component DSL for AI-generated user interfaces. 72 components across 8 categories, rendered from structured definitions in real time."
weight: 9
keywords: [lumen ui, component dsl, ai-generated ui, generative ui, structured output, clinical components]
---

Lumen UI is a declarative component system that turns structured definitions — written by an LLM or by hand — into rich, interactive Flutter widgets in real time. It ships 72 production-ready components across 8 categories, a streaming-resilient parser, and a dynamic prompt system that teaches any LLM how to use every component.

It is the rendering layer that powers [Intracav Lumen](https://www.intracav.ai/) — the AI clinical assistant — and is designed to be the bridge between structured AI output and pixel-perfect UI.

---

## See It in Action

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Lumen UI — Clinical Dashboard</span>
    </div>
    <div class="lumen-demo__content lm">
      <!-- Card with Triage -->
      <div class="lm-card lm-card--elevated" style="margin-bottom:16px;">
        <div class="lm-card__header"><div class="lm-card__title">Emergency Assessment</div></div>
        <div class="lm-card__body">
          <div class="lm-triage lm-triage--3" style="margin-bottom:12px;">
            <div class="lm-triage__banner">
              <span class="lm-triage__level-badge">ESI 3 — Urgent</span>
              <span class="lm-triage__wait">~30 min</span>
            </div>
            <div class="lm-triage__body">
              <div><div class="lm-triage__row-label">Chief Complaint</div><div class="lm-triage__row-value">Chest pain, onset 2 hours ago, radiating to left arm</div></div>
              <div><div class="lm-triage__row-label">Action</div><div class="lm-triage__row-value">12-lead ECG, troponin, chest X-ray. Place on cardiac monitor.</div></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Stats Grid -->
      <div class="lm-grid lm-grid--3" style="margin-bottom:16px;">
        <div class="lm-card lm-card--outlined">
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">Heart Rate</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">92</span><span class="lm-stat__unit">bpm</span></div>
              <span class="lm-stat__change lm-stat__change--up">&#9650; +8</span>
            </div>
          </div>
        </div>
        <div class="lm-card lm-card--outlined">
          <div class="lm-card__body">
            <div class="lm-stat">
              <span class="lm-stat__label">Blood Pressure</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">145/90</span><span class="lm-stat__unit">mmHg</span></div>
              <span class="lm-stat__change lm-stat__change--up">&#9650; Elevated</span>
            </div>
          </div>
        </div>
        <div class="lm-card lm-card--outlined">
          <div class="lm-card__body">
            <div class="lm-stat lm-stat--success">
              <span class="lm-stat__label">SpO2</span>
              <div class="lm-stat__value-row"><span class="lm-stat__value">96</span><span class="lm-stat__unit">%</span></div>
              <span class="lm-stat__change lm-stat__change--neutral">&#8212; Stable</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Alert -->
      <div class="lm-alert lm-alert--warning" style="margin-bottom:12px;">
        <span class="lm-alert__icon">&#9888;</span>
        <div class="lm-alert__content">
          <div class="lm-alert__title">Drug Interaction Detected</div>
          <div class="lm-alert__message">Lisinopril + Potassium may cause hyperkalemia. Monitor serum potassium levels.</div>
        </div>
      </div>
      <!-- Follow ups -->
      <div class="lm-follow-up">
        <button class="lm-follow-up__btn">View lab results</button>
        <button class="lm-follow-up__btn">Check drug interactions</button>
        <button class="lm-follow-up__btn">Generate clinical note</button>
      </div>
    </div>
  </div>
</div>

This entire dashboard — triage card, vitals stats, drug interaction alert, and follow-up suggestions — was generated from a single LLM response using Lumen UI's component DSL.

---

## How It Works

<div class="lm-pipeline" style="justify-content:center; margin: 2em 0;">
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#128172;</div>
    <span class="lm-pipeline__label">LLM</span>
    <span class="lm-pipeline__sublabel">Writes DSL</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#128196;</div>
    <span class="lm-pipeline__label">Parser</span>
    <span class="lm-pipeline__sublabel">Auto-detects</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#127795;</div>
    <span class="lm-pipeline__label">Node Tree</span>
    <span class="lm-pipeline__sublabel">LumenNode</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#127912;</div>
    <span class="lm-pipeline__label">Renderer</span>
    <span class="lm-pipeline__sublabel">Widget builder</span>
  </div>
  <span class="lm-pipeline__arrow">&#8594;</span>
  <div class="lm-pipeline__step">
    <div class="lm-pipeline__icon">&#128241;</div>
    <span class="lm-pipeline__label">Flutter UI</span>
    <span class="lm-pipeline__sublabel">Pixel-perfect</span>
  </div>
</div>

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

<div class="lm-showcase">
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <div class="lm-card lm-card--outlined" style="width:100%;padding:8px;">
        <div style="font-size:12px;font-weight:600;color:var(--text-primary);padding:4px 8px;">Card</div>
        <div style="height:24px;background:var(--entry);border-radius:4px;margin:4px 8px;"></div>
      </div>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/layout/">Layout</a></div>
    <div class="lm-showcase__category">10 components</div>
  </div>
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <table class="lm-table lm-table--compact" style="margin:0;">
        <thead><tr><th>Key</th><th>Value</th></tr></thead>
        <tbody><tr><td>WBC</td><td>7.2</td></tr><tr><td>Hgb</td><td>14.1</td></tr></tbody>
      </table>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/data-display/">Data Display</a></div>
    <div class="lm-showcase__category">9 components</div>
  </div>
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <div class="lm-bar-chart" style="padding:4px;">
        <div class="lm-bar-chart__bars" style="height:60px;gap:4px;">
          <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-1" style="height:60%;"></div></div>
          <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-2" style="height:85%;"></div></div>
          <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-3" style="height:45%;"></div></div>
          <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-4" style="height:90%;"></div></div>
        </div>
      </div>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/charts/">Charts</a></div>
    <div class="lm-showcase__category">8 components</div>
  </div>
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <div style="width:100%;display:flex;flex-direction:column;gap:6px;">
        <input class="lm-input" type="text" placeholder="Enter value..." style="font-size:12px;padding:4px 8px;" disabled>
        <div class="lm-toggle on" style="pointer-events:none;"><div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div><span style="font-size:12px;">Active</span></div>
      </div>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/forms/">Forms</a></div>
    <div class="lm-showcase__category">8 components</div>
  </div>
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <div class="lm-triage lm-triage--2" style="width:100%;border-radius:8px;">
        <div class="lm-triage__banner" style="padding:6px 10px;"><span class="lm-triage__level-badge" style="font-size:11px;padding:2px 8px;">ESI 2</span></div>
      </div>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/clinical/">Clinical</a></div>
    <div class="lm-showcase__category">20 components</div>
  </div>
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <div class="lm-image" style="width:100%;">
        <div class="lm-image__placeholder" style="height:48px;font-size:16px;">&#128444;</div>
      </div>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/media/">Media</a></div>
    <div class="lm-showcase__category">5 components</div>
  </div>
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <div style="display:flex;flex-direction:column;gap:4px;width:100%;">
        <div class="lm-alert lm-alert--warning" style="padding:6px 8px;font-size:11px;"><span class="lm-alert__icon" style="font-size:12px;">&#9888;</span><div class="lm-alert__content"><div class="lm-alert__title" style="font-size:11px;">Warning</div></div></div>
        <div class="lm-alert lm-alert--success" style="padding:6px 8px;font-size:11px;"><span class="lm-alert__icon" style="font-size:12px;">&#10003;</span><div class="lm-alert__content"><div class="lm-alert__title" style="font-size:11px;">Success</div></div></div>
      </div>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/feedback/">Feedback</a></div>
    <div class="lm-showcase__category">6 components</div>
  </div>
  <div class="lm-showcase__item">
    <div class="lm-showcase__preview">
      <div style="display:flex;flex-direction:column;gap:4px;width:100%;">
        <div class="lm-tool-call" style="padding:4px 8px;font-size:11px;"><span class="lm-tool-call__icon lm-tool-call__icon--completed" style="width:14px;height:14px;font-size:8px;">&#10003;</span><span class="lm-tool-call__name" style="font-size:11px;">Lookup</span><span class="lm-tool-call__duration" style="font-size:10px;">0.8s</span></div>
        <div class="lm-streaming-text" style="font-size:11px;">Analyzing results<span class="lm-streaming-text__cursor"></span></div>
      </div>
    </div>
    <div class="lm-showcase__name"><a href="/docs/lumen-ui/components/ai/">AI / Chat</a></div>
    <div class="lm-showcase__category">6 components</div>
  </div>
</div>
