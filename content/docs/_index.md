---
title: "MagicAF Documentation - Defense-Grade, HIPAA-Compliant AI Toolkit"
description: "Complete documentation for MagicAF — the defense-grade, HIPAA-compliant, airgapped AI toolkit for secure, secret, SIPR/NIPR environments. Secure LLM, NLP, RAG, and AI analysis tools for on-premises deployments."
weight: 1
keywords: "defense-grade ai documentation, hipaa-compliant ai documentation, airgapped ai documentation, secure llm documentation, secure nlp documentation, secure rag documentation, sipr ai, nipr ai, secret ai, classified ai"
---

MagicAF is a **defense-grade, healthcare-grade, HIPAA-compliant** modular Rust framework that provides the foundational building blocks for secure AI-powered systems: **embeddings**, **vector search**, **LLM orchestration**, **RAG workflows**, and **comprehensive NLP/analysis tools**.

Designed from the ground up for **air-gapped, on-premises environments** — no cloud dependencies, no vendor lock-in. MagicAF goes **far beyond LLMs**, providing direct and easy access to the full array of NLP, RAG, and analysis tools that have developed alongside language models. These powerful tools are now aggregated in a localized, secure way — perfect for **SIPR/NIPR, secret, classified, and HIPAA-regulated environments**.

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

### [Guides →](/docs/guides/)
Step-by-step tutorials for building custom adapters, structured output parsing, and more.

</div>
<div class="card">

### [API Reference →](/docs/api-reference/)
Complete reference for every trait, struct, configuration option, and error type.

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
