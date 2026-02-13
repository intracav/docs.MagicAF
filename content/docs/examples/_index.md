---
title: "Examples"
description: "Working code examples for common MagicAF use cases."
weight: 6
---

Complete, runnable examples that demonstrate real-world usage patterns. Each example shows a different level of customization.

---

<div class="card-grid">
<div class="card">

### [Minimal RAG →](/docs/examples/minimal-rag/)
**Beginner** — The simplest possible RAG pipeline using default adapters.

</div>
<div class="card">

### [Document Q&A →](/docs/examples/document-qa/)
**Intermediate** — Structured Q&A with custom adapters and JSON output parsing.

</div>
<div class="card">

### [Multi-Source Analysis →](/docs/examples/multi-source-analysis/)
**Advanced** — Cross-referencing multiple sources with domain-specific adapters.

</div>
</div>

---

## Running Examples

All examples require the same local services (see [Prerequisites](/docs/getting-started/prerequisites/)):

```bash
# Start Qdrant, embedding server, and LLM server, then:
cargo run -p example-minimal-rag
cargo run -p example-document-qa
cargo run -p example-intelligence-analysis
```

## Progression

| Example | Custom Adapters | Output Type | Complexity |
|---------|----------------|-------------|-----------|
| Minimal RAG | None (all defaults) | `String` | ★☆☆ |
| Document Q&A | `EvidenceFormatter`, `PromptBuilder` | `QAAnswer` (JSON) | ★★☆ |
| Multi-Source Analysis | All three | `IntelSummary` (JSON) | ★★★ |
