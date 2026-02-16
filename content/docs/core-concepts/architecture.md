---
title: "Architecture"
description: "MagicAF's secure, three-layer architecture for defense-grade AI systems. Designed for air-gapped, HIPAA-compliant deployments with complete separation of concerns."
weight: 1
keywords: [architecture, secure architecture, defense-grade architecture, air-gapped architecture, HIPAA-compliant architecture]
tags: [architecture, layers, traits, separation-of-concerns]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/getting-started/quickstart/
estimated_reading_time: "7 min"
last_reviewed: "2026-02-12"
---

MagicAF follows a strict three-layer architecture, reflecting Intracav's commitment to clean separation of concerns in regulated environments. Each layer has a single responsibility, and layers communicate only through well-defined trait boundaries.

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

## Why This Architecture?

MagicAF separates concerns into three layers for a specific reason: **in regulated environments, you need to swap components without changing business logic**.

Consider a defense lab that certifies their RAG pipeline for use on a classified network. Six months later, they need to replace Qdrant with Milvus because of a new infrastructure mandate. With MagicAF's architecture, they implement the `VectorStore` trait for Milvus and change one line in the builder — the adapters, orchestration logic, and all tests remain untouched.

The same principle applies to healthcare: a hospital might start with vLLM on a GPU server, then move to Ollama on CPU-only hardware when deploying to a satellite clinic. The `LlmService` implementation changes; the prompt engineering, evidence formatting, and result parsing stay identical.

This is not theoretical flexibility. It is a concrete engineering requirement in environments where:

- **Certification is expensive** — changing business logic triggers re-certification, but swapping infrastructure does not
- **Vendor lock-in is unacceptable** — government contracts often prohibit dependency on a single vendor
- **Hardware varies across sites** — the same codebase deploys to GPU servers, CPU workstations, and edge devices
- **Testing must be comprehensive** — mock implementations slot into the same trait boundaries, enabling full pipeline testing without live services

## Layer 1 — Infrastructure

The infrastructure layer provides the fundamental AI primitives. Each primitive is defined as an async trait.

| Module | Trait | Purpose |
|--------|-------|---------|
| `embeddings` | `EmbeddingService` | Produce dense vectors from text |
| `vector_store` | `VectorStore` | Index, search, and delete vectors with JSON payloads |
| `llm` | `LlmService` | Chat completion and text generation via OpenAI-compatible API |

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
