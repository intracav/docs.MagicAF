---
title: "Integration"
description: "How Lumen UI connects to LLMs, servers, and rendering surfaces — prompt injection, artifact adapters, the envelope protocol, and integration points."
weight: 5
---

Lumen UI is designed to be the rendering layer in an AI-first application. This section covers how it integrates with the broader system — from teaching LLMs the component vocabulary to handling server-side tool results.

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
