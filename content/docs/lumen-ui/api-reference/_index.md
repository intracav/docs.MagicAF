---
title: "API Reference"
description: "Dart API reference for Lumen UI core classes — parser, renderer, registry, node model, theme, and render context."
weight: 7
---

Complete Dart API reference for the Lumen UI package.

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline" style="flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 8px;">
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 120px;">
          <div class="lm-pipeline__icon" style="color: #5865F2;">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 5h12M4 10h12M4 15h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 11px;">LumenParser</div>
        </div>
        <div class="lm-pipeline__arrow" style="transform: rotate(-90deg); padding: 0;">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 120px;">
          <div class="lm-pipeline__icon" style="color: #3BA55C;">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 7h6M7 10h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 11px;">LumenNode</div>
        </div>
        <div class="lm-pipeline__arrow" style="transform: rotate(-90deg); padding: 0;">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 120px;">
          <div class="lm-pipeline__icon" style="color: #FAA61A;">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 11px;">Registry</div>
        </div>
        <div class="lm-pipeline__arrow" style="transform: rotate(-90deg); padding: 0;">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M10 16l4-4M10 16l-4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="lm-pipeline__step" style="flex: 0 1 auto; min-width: 120px; border-color: var(--accent);">
          <div class="lm-pipeline__icon" style="color: #E91E63;">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 6h8v8H6z" stroke="currentColor" stroke-width="1.5"/></svg>
          </div>
          <div class="lm-pipeline__label" style="font-size: 11px;">LumenRenderer</div>
        </div>
      </div>
    </div>
  </div>
</div>

---

<div class="card-grid">
<div class="card">

### [LumenParser →](/docs/lumen-ui/api-reference/lumen-parser/)
Auto-detecting parser that handles both DSL and JSON input.

</div>
<div class="card">

### [LumenRenderer →](/docs/lumen-ui/api-reference/lumen-renderer/)
Top-level widget that converts node trees into Flutter widgets.

</div>
<div class="card">

### [ComponentRegistry →](/docs/lumen-ui/api-reference/component-registry/)
Singleton registry of all component definitions with catalog generation.

</div>
<div class="card">

### [LumenNode →](/docs/lumen-ui/api-reference/lumen-node/)
The data model for parsed component nodes — props, children, slots, and accessors.

</div>
<div class="card">

### [LumenThemeData →](/docs/lumen-ui/api-reference/lumen-theme-data/)
Theme data structure — colors, typography, chart colors, and factory constructors.

</div>
<div class="card">

### [LumenRenderContext →](/docs/lumen-ui/api-reference/render-context/)
Rendering context carrying action dispatch, streaming state, and depth.

</div>
</div>
