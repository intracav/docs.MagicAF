---
title: "Documentation"
description: "MagicAF documentation — install the framework, understand the architecture, make the big decisions, and ship a local-first AI system."
weight: 1
keywords: [MagicAF documentation, Rust AI framework, RAG framework, air-gapped AI, NLP toolkit]
hideAutoGrid: true
---

MagicAF is a modular, production-grade Rust framework — built by [Intracav](https://intracav.ai/) — that provides the foundational building blocks for AI systems: **embeddings**, **vector search**, **LLM orchestration**, and **RAG workflows**.

It is designed from the ground up for **air-gapped, on-premises environments** — no cloud dependencies, no vendor lock-in — and is used in healthcare and other settings [where data cannot leave the network](/about/).

The docs follow the path you'll actually take: get it running, understand how it thinks, make the decisions that are expensive to reverse, then build and ship.

## Start here

{{< card-grid >}}
{{< card title="Getting Started" href="/docs/getting-started/" tint="accent" label="Install and run" >}}
Install MagicAF, set up local services, and run your first RAG pipeline in one sitting.
{{< /card >}}
{{< card title="Learning Paths" href="/docs/learning-paths/" tint="green" label="Pick a route" >}}
Guided routes through these docs by role — developer, evaluator, or operator.
{{< /card >}}
{{< /card-grid >}}

## Understand it

{{< card-grid >}}
{{< card title="Core Concepts" href="/docs/core-concepts/" tint="accent" label="Learn the model" >}}
The three-layer architecture, the RAG pipeline, and the trait system that keeps your domain logic out of the framework.
{{< /card >}}
{{< card title="Decision Guides" href="/docs/decision-guides/" tint="blue" label="Weigh the options" >}}
The three decisions that are expensive to reverse: which models, which adapter pattern, which deployment shape.
{{< /card >}}
{{< /card-grid >}}

## Build with it

{{< card-grid >}}
{{< card title="Tutorials" href="/docs/tutorials/" tint="green" label="Follow along" >}}
Narrative walkthroughs that build something real — from a first pipeline to a clinical RAG system.
{{< /card >}}
{{< card title="Guides" href="/docs/guides/" tint="accent" label="Get it done" >}}
Task-focused how-tos: custom adapters, structured output, testing.
{{< /card >}}
{{< card title="Examples" href="/docs/examples/" tint="blue" label="Read the code" >}}
Working code for minimal RAG, document Q&A, and multi-source analysis.
{{< /card >}}
{{< /card-grid >}}

## Ship it

{{< card-grid >}}
{{< card title="Deployment" href="/docs/deployment/" tint="accent" label="Go to production" >}}
Docker Compose, air-gapped setup, edge and mobile targets, observability, scaling, and security hardening.
{{< /card >}}
{{< card title="API Reference" href="/docs/api-reference/" tint="blue" label="Look it up" >}}
Every trait, struct, configuration option, and error type — core services and NLP pipelines.
{{< /card >}}
{{< /card-grid >}}

## The interface layer

{{< card-grid >}}
{{< card title="Lumen UI" href="/docs/lumen-ui/" tint="blue" label="Explore components" >}}
The component DSL for AI-generated interfaces — {{< stat "lumen_ui_components" >}} components across {{< stat "lumen_ui_categories" >}} categories, a streaming parser, and LLM integration.
{{< /card >}}
{{< /card-grid >}}

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
