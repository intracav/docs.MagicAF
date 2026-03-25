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

<div class="lumen-demo">
  <div class="lumen-demo__label">Catalog Generation Flow</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Prompt Injection Pipeline</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 7h8M6 10h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label">ComponentRegistry</div>
          <div class="lm-pipeline__sublabel">72 definitions + PropSchema</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>registerAll()</span>
        </div>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon" style="color: #3BA55C;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 5h12M4 10h12M4 15h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label">PromptGenerator</div>
          <div class="lm-pipeline__sublabel">Compact text catalog (~2-8 KB)</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>HTTP POST</span>
        </div>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon" style="color: #FAA61A;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 18H2L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="10" cy="13" r="1" fill="currentColor"/><path d="M10 8v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label">Server (Rust)</div>
          <div class="lm-pipeline__sublabel">Injects into system prompt</div>
        </div>
        <div class="lm-pipeline__arrow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>system prompt</span>
        </div>
        <div class="lm-pipeline__step" style="border-color: var(--accent);">
          <div class="lm-pipeline__icon" style="color: #5865F2;">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 8c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 2-2 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="14" r="0.75" fill="currentColor"/></svg>
          </div>
          <div class="lm-pipeline__label">LLM (Claude)</div>
          <div class="lm-pipeline__sublabel">Emits &lt;lumen&gt; component blocks</div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Size Comparison</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-bar-chart lm-bar-chart--horizontal">
        <div class="lm-bar-chart__bars">
          <div class="lm-bar-chart__bar-group">
            <span class="lm-bar-chart__bar-label" style="width: 180px;">generateComponentCatalog()</span>
            <div class="lm-bar-chart__bar lm-chart-1" style="width: 25%; height: 20px;"></div>
            <span class="lm-bar-chart__bar-value" style="opacity: 1;">~2 KB</span>
          </div>
          <div class="lm-bar-chart__bar-group">
            <span class="lm-bar-chart__bar-label" style="width: 180px;">generate()</span>
            <div class="lm-bar-chart__bar lm-chart-2" style="width: 50%; height: 20px;"></div>
            <span class="lm-bar-chart__bar-value" style="opacity: 1;">~4 KB</span>
          </div>
          <div class="lm-bar-chart__bar-group">
            <span class="lm-bar-chart__bar-label" style="width: 180px;">generateFullSystemPrompt()</span>
            <div class="lm-bar-chart__bar lm-chart-4" style="width: 100%; height: 20px;"></div>
            <span class="lm-bar-chart__bar-value" style="opacity: 1;">~8 KB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## System Prompt Structure

The full system prompt section (`generateFullSystemPrompt()`) includes four sections, each teaching the LLM about a different layer of the component system:

<div class="lumen-demo">
  <div class="lumen-demo__label">System Prompt Anatomy</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">What the LLM Receives</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
        <!-- Section 1 -->
        <div class="lm-card lm-card--outlined" style="border-left: 3px solid #5865F2;">
          <div class="lm-card__body" style="padding: 12px 16px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="background: #5865F2; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">1</span>
              <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Artifact Format</span>
            </div>
            <code style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; display: block; white-space: pre; font-family: var(--font-mono);">&lt;artifact type="code|document|data|html" title="..." language="..."&gt;
  content
&lt;/artifact&gt;</code>
          </div>
        </div>
        <!-- Section 2 -->
        <div class="lm-card lm-card--outlined" style="border-left: 3px solid #3BA55C;">
          <div class="lm-card__body" style="padding: 12px 16px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="background: #3BA55C; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">2</span>
              <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Lumen Component Syntax</span>
            </div>
            <code style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; display: block; white-space: pre; font-family: var(--font-mono);">&lt;lumen&gt;ComponentName(key=value, ...)&lt;/lumen&gt;
PascalCase. Nest components. Do NOT reproduce tool results.</code>
          </div>
        </div>
        <!-- Section 3 -->
        <div class="lm-card lm-card--outlined" style="border-left: 3px solid #FAA61A;">
          <div class="lm-card__body" style="padding: 12px 16px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="background: #FAA61A; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">3</span>
              <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Complete Component Catalog</span>
              <span style="font-size: 11px; color: var(--text-tertiary); margin-left: auto;">72 components</span>
            </div>
            <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; font-family: var(--font-mono);">
              <div style="margin-bottom: 4px; color: var(--text-tertiary); font-weight: 600;">#### Layout</div>
              <div>- Card(title?: string, variant?: default|outlined|elevated|ghost)</div>
              <div>- Grid(columns?: number, gap?: number)</div>
              <div style="margin-top: 4px; color: var(--text-tertiary); font-weight: 600;">#### Data Display</div>
              <div>- Table(columns: {key,label}[], rows: object[])</div>
              <div>- Stat(label: string, value: string, unit?: string)</div>
              <div style="color: var(--text-tertiary); margin-top: 4px;">... 68 more components</div>
            </div>
          </div>
        </div>
        <!-- Section 4 -->
        <div class="lm-card lm-card--outlined" style="border-left: 3px solid #E91E63;">
          <div class="lm-card__body" style="padding: 12px 16px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="background: #E91E63; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px;">4</span>
              <span style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Composition Patterns</span>
            </div>
            <code style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; display: block; white-space: pre; font-family: var(--font-mono);">Dashboard: Grid(columns=2, Card(Stat(...)), Card(BarChart(...)))
Tabbed:    Tabs(labels=[...], Card(...), Table(...))
Clinical:  Card(Stack(TriageCard(...), LabRanges(...)))</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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
