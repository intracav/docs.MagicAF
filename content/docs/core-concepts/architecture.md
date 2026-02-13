---
title: "Architecture - Defense-Grade AI Framework Design"
description: "MagicAF's three-layer architecture for defense-grade, HIPAA-compliant AI systems. Comprehensive NLP, RAG, and AI analysis tools beyond LLMs in secure, airgapped environments."
weight: 1
keywords: "defense-grade ai architecture, hipaa-compliant ai architecture, airgapped ai architecture, secure ai architecture, secure llm architecture, secure nlp architecture, secure rag architecture, ai toolkit architecture"
---

MagicAF follows a strict three-layer architecture designed for **defense-grade, HIPAA-compliant, secure environments**. Each layer has a single responsibility, and layers communicate only through well-defined trait boundaries. MagicAF goes **far beyond LLMs** — it provides comprehensive **NLP, RAG, embeddings, vector search, and AI analysis tools** that are aggregated in a localized, secure way perfect for **SIPR/NIPR, secret, classified, and healthcare environments**.

## Layer Model

```
┌───────────────────────────────────────────────────┐
│              Domain Applications                  │
│   (your business logic, adapters, result types)   │
└──────────────────────┬────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────┐
│           3 · Adapter Layer                       │
│   EvidenceFormatter · PromptBuilder · ResultParser│
└──────────────────────┬────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────┐
│           2 · Orchestration Layer                 │
│              RAGWorkflow<S, V, L, …>              │
└──────────────────────┬────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────┐
│           1 · Infrastructure Layer                │
│   EmbeddingService · VectorStore · LlmService     │
└───────────────────────────────────────────────────┘
```

## Layer 1 — Infrastructure

The infrastructure layer provides the **fundamental AI primitives** that go far beyond just LLMs. MagicAF aggregates the full array of **NLP, RAG, and AI analysis tools** that have developed alongside language models. Each primitive is defined as an async trait, enabling secure, localized access to powerful AI capabilities.

| Module | Trait | Purpose |
|--------|-------|---------|
| `embeddings` | `EmbeddingService` | Produce dense vectors from text — **semantic understanding and NLP analysis** |
| `vector_store` | `VectorStore` | Index, search, and delete vectors with JSON payloads — **RAG and knowledge retrieval** |
| `llm` | `LlmService` | Chat completion and text generation via OpenAI-compatible API — **language generation** |

**Beyond LLMs**: MagicAF provides direct and easy access to the complete suite of AI tools — embeddings for semantic analysis, vector stores for knowledge retrieval, and LLMs for generation — all aggregated in a localized, secure framework perfect for defense-grade and HIPAA-compliant environments.

Concrete implementations ship in separate crates:

| Implementation | Crate | Backend |
|---------------|-------|---------|
| `LocalEmbeddingService` | `magicaf-core` | Any OpenAI-compatible `/v1/embeddings` endpoint |
| `QdrantVectorStore` | `magicaf-qdrant` | Qdrant (REST API) |
| `InMemoryVectorStore` | `magicaf-core` | In-process brute-force search (no external deps) |
| `LocalLlmService` | `magicaf-local-llm` | Any OpenAI-compatible `/v1/chat/completions` endpoint |

## Layer 2 — Orchestration

`RAGWorkflow` is the pipeline engine. It is fully generic over all service and adapter traits:

```rust
pub struct RAGWorkflow<S, V, L, EF, PB, RP, T>
where
    S: EmbeddingService,
    V: VectorStore,
    L: LlmService,
    EF: EvidenceFormatter,
    PB: PromptBuilder,
    RP: ResultParser<T>,
    T: Send,
```

The workflow executes a fixed six-step pipeline:

1. **Embed** the query → `EmbeddingService::embed_single`
2. **Search** the vector store → `VectorStore::search`
3. **Format** evidence → `EvidenceFormatter::format_evidence`
4. **Build** the prompt → `PromptBuilder::build_prompt`
5. **Invoke** the LLM → `LlmService::chat`
6. **Parse** the result → `ResultParser::parse_result`

## Layer 3 — Adapters

Three traits form the domain extension seam. This is where **your** application-specific logic lives.

| Trait | Injected at Step | Domain Responsibility |
|-------|------------------|-----------------------|
| `EvidenceFormatter` | 3 | Convert search results → text block for the LLM |
| `PromptBuilder` | 4 | Assemble system + evidence + query → prompt |
| `ResultParser<T>` | 6 | Parse raw LLM text → typed domain result |

Default implementations ship in `magicaf-core` for rapid prototyping:

- `DefaultEvidenceFormatter` — pretty-prints JSON payloads
- `DefaultPromptBuilder` — wraps evidence in `<context>` tags
- `RawResultParser` — returns the raw LLM output as `String`
- `JsonResultParser<T>` — deserializes JSON into any `T: DeserializeOwned`

## Crate Dependency Graph

```
magicaf-core  (traits, DTOs, RAG engine, adapters, config, errors)
     ↑                  ↑
magicaf-qdrant     magicaf-local-llm
(VectorStore impl)  (LlmService impl)
```

Both implementation crates depend **only** on `magicaf-core`. Downstream applications depend on all three.

## Guiding Principles

1. **Separation of concerns.** Infrastructure is independent of orchestration, which is independent of domain logic.
2. **Trait-driven extensibility.** Every major component is accessed through a trait — swapping implementations is a one-line config change.
3. **DTO-based public surface.** Request/response types are plain structs with `Serialize`/`Deserialize`, easy to expose over FFI or serialize to JSON.
4. **Error codes for FFI.** Every `MagicError` variant maps to a stable numeric code, enabling clean error propagation across language boundaries.
