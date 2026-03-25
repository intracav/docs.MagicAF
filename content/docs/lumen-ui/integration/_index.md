---
title: "Integration"
description: "How Lumen UI connects to LLMs, servers, and rendering surfaces — prompt injection, artifact adapters, the envelope protocol, and integration points."
weight: 5
---

Lumen UI is designed to be the rendering layer in an AI-first application. This section covers how it integrates with the broader system — from teaching LLMs the component vocabulary to handling server-side tool results.

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline" style="flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 8px;">
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 140px;">
          <div class="lm-pipeline__icon" style="color: #5865F2;">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M6 7h8M6 10h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 12px;">Registry</div>
        </div>
        <div class="lm-pipeline__arrow" style="transform: rotate(-90deg); padding: 0;">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 140px;">
          <div class="lm-pipeline__icon" style="color: #3BA55C;">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 5h12M4 10h12M4 15h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 12px;">Catalog</div>
        </div>
        <div class="lm-pipeline__arrow" style="transform: rotate(-90deg); padding: 0;">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 140px;">
          <div class="lm-pipeline__icon" style="color: #FAA61A;">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 12px;">Server</div>
        </div>
        <div class="lm-pipeline__arrow" style="transform: rotate(-90deg); padding: 0;">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 140px; border-color: var(--accent);">
          <div class="lm-pipeline__icon" style="color: #E91E63;">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 8c0-1.1.9-2 2-2s2 .9 2 2c0 1.5-2 2-2 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="10" cy="14" r="0.75" fill="currentColor"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 12px;">LLM</div>
        </div>
      </div>
    </div>
  </div>
</div>

---

<div class="card-grid">
<div class="card">

### [LLM Integration →](/docs/lumen-ui/integration/llm-integration/)
How the component catalog is generated and injected into LLM system prompts.

</div>
<div class="card">

### [Envelope Protocol →](/docs/lumen-ui/integration/envelope-protocol/)
The `__lumen__` envelope format used by MCP tools to send structured results.

</div>
<div class="card">

### [Artifact Adapter →](/docs/lumen-ui/integration/artifact-adapter/)
Converting legacy artifact types (RxNorm, FHIR, code, etc.) into Lumen component trees.

</div>
<div class="card">

### [Rendering Surfaces →](/docs/lumen-ui/integration/rendering-surfaces/)
The five places where Lumen components are rendered — chat, artifacts, agents, workflows, and blueprints.

</div>
</div>
