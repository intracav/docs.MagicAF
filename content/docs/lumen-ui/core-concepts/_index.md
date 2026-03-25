---
title: "Core Concepts"
description: "The foundational concepts behind Lumen UI — DSL syntax, JSON format, rendering pipeline, theming, streaming, and actions."
weight: 3
---

Lumen UI is built around a small number of interlocking concepts. Understanding these will let you author components by hand, debug LLM-generated output, customize the rendering pipeline, and extend the system with new components.

<div class="lumen-demo">
  <div class="lumen-demo__label">The Full Pipeline</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">How Lumen UI Works, End to End</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128221;</div>
          <span class="lm-pipeline__label">DSL / JSON</span>
          <span class="lm-pipeline__sublabel">Input formats</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#9881;</div>
          <span class="lm-pipeline__label">Parser</span>
          <span class="lm-pipeline__sublabel">Stream-safe</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127795;</div>
          <span class="lm-pipeline__label">LumenNode</span>
          <span class="lm-pipeline__sublabel">Component tree</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127912;</div>
          <span class="lm-pipeline__label">Renderer</span>
          <span class="lm-pipeline__sublabel">Registry + Theme</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128241;</div>
          <span class="lm-pipeline__label">Flutter UI</span>
          <span class="lm-pipeline__sublabel">Interactive</span>
        </div>
      </div>
    </div>
  </div>
</div>

---

<div class="card-grid">
<div class="card">

### [DSL Syntax →](/docs/lumen-ui/core-concepts/dsl-syntax/)
The PascalCase function-call syntax that LLMs use to describe component trees.

</div>
<div class="card">

### [JSON Format →](/docs/lumen-ui/core-concepts/json-format/)
The JSON representation of component trees — an alternative to the DSL.

</div>
<div class="card">

### [Rendering →](/docs/lumen-ui/core-concepts/rendering/)
How parsed nodes become Flutter widgets — the registry, renderer, and error boundaries.

</div>
<div class="card">

### [Theming →](/docs/lumen-ui/core-concepts/theming/)
Zero-config theming with semantic colors, typography, chart palettes, and spacing.

</div>
<div class="card">

### [Streaming →](/docs/lumen-ui/core-concepts/streaming/)
How the parser and renderer handle partial, truncated, and in-progress content.

</div>
<div class="card">

### [Actions →](/docs/lumen-ui/core-concepts/actions/)
How components dispatch events back to the host application.

</div>
</div>
