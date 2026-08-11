---
title: "Examples"
description: "Working code examples for common MagicAF use cases."
weight: 6
---

Sometimes you don't want a walkthrough — you want working code you can read, run, and rip parts out of. That's what this section is: complete, runnable examples demonstrating real-world usage patterns, each at a different level of customization. If you'd rather be taught, start with the [Tutorials](/docs/tutorials/); if you need one task done, use the [Guides](/docs/guides/). Come here when the code itself is the documentation you're after.

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
