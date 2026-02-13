---
title: "Documentation"
description: "Defense-grade, HIPAA-compliant AI toolkit documentation. Build secure RAG pipelines, NLP analysis, and AI-powered systems for air-gapped, classified, and healthcare environments."
weight: 1
keywords: [defense-grade AI, healthcare-grade AI, HIPAA-compliant, secure AI, air-gapped AI, RAG framework, NLP toolkit]
---

MagicAF is a modular, production-grade Rust framework that provides the foundational building blocks for AI-powered systems: **embeddings**, **vector search**, **LLM orchestration**, and **RAG workflows**.

It is designed from the ground up for **air-gapped, on-premises environments** — no cloud dependencies, no vendor lock-in. MagicAF is a [defense-grade, HIPAA-compliant AI toolkit](/about/) suitable for classified, healthcare, and regulated deployments.

---

<div class="card-grid">
<div class="card">

### [Getting Started →](/docs/getting-started/)
Install MagicAF, set up local services, and run your first RAG pipeline in under 5 minutes.

</div>
<div class="card">

### [Core Concepts →](/docs/core-concepts/)
Understand the architecture, layered design, and trait-based extensibility model.

</div>
<div class="card">

### [Tutorials →](/docs/tutorials/)
Guided, narrative walkthroughs that teach MagicAF concepts through hands-on projects.

</div>
<div class="card">

### [Guides →](/docs/guides/)
Step-by-step how-to references for building custom adapters, structured output parsing, and more.

</div>
<div class="card">

### [Decision Guides →](/docs/decision-guides/)
Trade-off analysis for choosing models, adapter patterns, and deployment strategies.

</div>
<div class="card">

### [API Reference →](/docs/api-reference/)
Complete reference for core services and NLP pipelines — every trait, struct, configuration option, and error type.

</div>
<div class="card">

### [Deployment →](/docs/deployment/)
Docker Compose, air-gapped setup, edge/mobile deployment, observability, and scaling.

</div>
<div class="card">

### [Examples →](/docs/examples/)
Working code for minimal RAG, document Q&A, and multi-source analysis pipelines.

</div>
</div>

---

## Design Philosophy

| Principle | Rationale |
|-----------|-----------|
| **Extensibility over cleverness** | Clean trait boundaries; domain logic lives in adapters, not the framework. |
| **Clarity over abstraction** | Flat DTO structs, explicit error codes, straightforward module layout. |
| **Interface stability over optimization** | Public API surface is small and versioned; internals can change freely. |
| **Local-first** | Every component assumes a local endpoint — no cloud SDK required. |
| **FFI-ready** | Flat structs + numeric error codes prepare the surface for C / Swift / Python / Java bindings. |

---

## What's in the Box

| Crate | Purpose |
|-------|---------|
| `magicaf-core` | Traits, DTOs, config, error types, RAG engine, adapter interfaces, in-memory vector store |
| `magicaf-qdrant` | Qdrant vector store implementation (REST API) |
| `magicaf-local-llm` | OpenAI-compatible local LLM client |
| `magicaf-nlp` | Production-grade NLP pipelines (NER, sentiment, translation, QA, etc.) — all run in-process |