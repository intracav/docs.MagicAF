---
title: "Examples - Defense-Grade, HIPAA-Compliant AI Toolkit"
description: "Working code examples for MagicAF — the defense-grade, HIPAA-compliant, airgapped AI toolkit. Secure LLM, NLP, RAG, and AI analysis examples for SIPR/NIPR, secret, and classified environments."
weight: 6
keywords: "defense-grade ai examples, hipaa-compliant ai examples, airgapped ai examples, secure llm examples, secure nlp examples, secure rag examples, secure ai toolkit examples"
---

Complete, runnable examples that demonstrate real-world usage patterns for **MagicAF — the defense-grade, HIPAA-compliant, airgapped AI toolkit**. Each example shows a different level of customization for secure AI systems in **SIPR/NIPR, secret, classified, and healthcare environments**. These examples showcase MagicAF's comprehensive **NLP, RAG, embeddings, vector search, and AI analysis capabilities** beyond just LLMs.

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
