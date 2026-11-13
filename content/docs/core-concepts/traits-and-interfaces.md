---
title: "Traits & Interfaces"
description: "The trait system that makes every MagicAF component swappable."
weight: 3
tags: [traits, interfaces, extensibility, generics, async]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/core-concepts/architecture/
---

You already put an interface in front of any dependency you don't want owning you — the repository trait in front of the database, the client trait in front of the third-party API. MagicAF applies the same rule to itself. Every major component is accessed through an **async trait**, and every trait can be implemented by your application. The traits are the framework's contract with you: service traits where infrastructure plugs in, and adapter traits where your domain logic does. Everything behind a seam is replaceable; the seam itself stays stable.

If you're working out what you can swap and what you'd be committing to, this page is the full contract — every trait, its methods, what ships in the box, and what you'd implement yourself.

## Why Traits Instead of Concrete Types?

MagicAF uses Rust traits (interfaces) rather than concrete types for three engineering reasons:

**Static types where it matters.** `RAGWorkflow` is generic over its services and adapters, so the compiler checks that every piece fits and resolves those calls without a vtable. Two kinds of overhead remain, both small next to a network round trip: `#[async_trait]` boxes each async call's future, and the optional stages — reranker and audit logger — are held as `Arc<dyn …>` so they can be shared and swapped at runtime.

**Testability with mocks.** Every trait can be implemented by a mock struct. This means you can unit-test your adapters without running Qdrant, without loading an LLM, and without an embedding server. The test suite runs in milliseconds, not minutes.

**Swap implementations without changing callers.** The `RAGWorkflow` builder accepts any type that implements the required traits. Switching from `QdrantVectorStore` to `InMemoryVectorStore` changes one line in the builder call — no other code needs to be modified.

## Infrastructure Traits

These traits define the fundamental AI building blocks.

### `EmbeddingService`

Produces dense vector embeddings from text input.

```rust
#[async_trait]
pub trait EmbeddingService: Send + Sync {
    /// Embed a batch of input strings, returning one vector per input.
    async fn embed(&self, inputs: &[String]) -> Result<Vec<Vec<f32>>>;

    /// Embed a single string.
    async fn embed_single(&self, input: &str) -> Result<Vec<f32>>;

    /// Verify the upstream service is reachable.
    async fn health_check(&self) -> Result<()>;
}
```

**Shipped implementation:** `LocalEmbeddingService` — calls any OpenAI-compatible `/v1/embeddings` endpoint.

**You might implement this for:** ONNX Runtime, CoreML, TensorFlow Lite, gRPC endpoints, or in-process inference.

### `VectorStore`

Stores, searches, and manages dense vectors with JSON payloads. Four methods are required; the rest have defaults, so a minimal backend stays small.

```rust
#[async_trait]
pub trait VectorStore: Send + Sync {
    // Required
    async fn index(&self, collection: &str, embeddings: Vec<Vec<f32>>,
                   payloads: Vec<serde_json::Value>) -> Result<()>;
    async fn search(&self, collection: &str, query_vector: Vec<f32>, limit: usize,
                    filter: Option<serde_json::Value>) -> Result<Vec<SearchResult>>;
    async fn delete_by_entity(&self, collection: &str, entity_id: Uuid) -> Result<()>;
    async fn ensure_collection(&self, collection: &str, vector_size: usize) -> Result<()>;

    // Provided
    async fn search_scoped(&self, collection: &str, query_vector: Vec<f32>, limit: usize,
                           filter: serde_json::Value) -> Result<Vec<SearchResult>>;
    async fn set_payload(&self, collection: &str, filter: serde_json::Value,
                         payload: serde_json::Value) -> Result<()>;
    async fn delete_by_filter(&self, collection: &str, filter: serde_json::Value) -> Result<u64>;
    async fn scroll_paginated(&self, collection: &str, filter: Option<serde_json::Value>,
                              limit: usize, offset: Option<String>) -> Result<ScrollPage>;
    async fn count_by_filter(&self, collection: &str,
                             filter: Option<serde_json::Value>) -> Result<u64>;
    async fn recreate_with_quantization(&self, collection: &str, vector_size: usize,
                                        quantization: Option<QuantizationConfig>) -> Result<()>;
}
```

The provided methods behave differently when a backend does not override them: `search_scoped` calls `search` with the filter; `set_payload` does nothing and succeeds; `delete_by_filter`, `scroll_paginated`, `count_by_filter`, and `recreate_with_quantization` return a `VectorStoreError` saying the backend does not support them. `QdrantVectorStore` implements all of them.

**Shipped implementations:**
- `QdrantVectorStore` — Qdrant REST API
- `InMemoryVectorStore` — in-process, brute-force cosine search; can `save` to and `load` from a file

**You might implement this for:** pgvector, Milvus, Weaviate, OpenSearch, or any custom backend.

### `LlmService`

Sends chat completion requests to a language model.

```rust
#[async_trait]
pub trait LlmService: Send + Sync {
    /// Structured chat completion request.
    async fn chat(&self, request: ChatRequest) -> Result<ChatResponse>;

    /// Convenience: turn a prompt into generated text.
    async fn generate(&self, prompt: &str, config: GenerationConfig) -> Result<String>;

    /// Verify the upstream service is reachable.
    async fn health_check(&self) -> Result<()>;
}
```

**Shipped implementation:** `LocalLlmService` — calls any OpenAI-compatible `/v1/chat/completions` endpoint.

**You might implement this for:** gRPC model servers, in-process inference (llama.cpp bindings), or custom APIs.

{{< callout type="info" title="Planned: DecisionService" >}}
The design for [MagicAF Reflex](/docs/reflex/) adds a fourth infrastructure trait, `DecisionService`, for small calibrated decision models that answer typed questions with an explicit abstain instead of generating text. It is not in `magicaf-core` yet. See [Running Reflex in Other Runtimes](/docs/reflex/other-runtimes/#lumen_server-rust).
{{< /callout >}}

---

## Other service traits

| Trait | Methods | Shipped implementations |
|---|---|---|
| `DecisionService` | `id`, `version`, `supports(question_set, key)`, `decide(question, state) -> Answer`, `decide_many` | Reflex runtimes in [`magicaf-reflex-onnx`](/docs/crates/magicaf-reflex-onnx/) |
| `AsrService` | Transcribe an audio buffer | `WhisperAsrService` |
| `StreamingAsrService` | `open_session`, then `accept_pcm_i16` / `finalize_utterance` on the session | [`magicaf-asr-onnx`](/docs/crates/magicaf-asr-onnx/) |
| `TtsService` | `synthesize`, `synthesize_stream` | `KokoroTtsService`, `DeepgramTtsService` |
| `Reranker` | `rerank(query, results)` | `CrossEncoderReranker`, `ScoreThresholdReranker` |
| `CacheService` | Get and put embedding vectors by key | — (bring your own; used by `CachedEmbeddingService`) |
| `TokenBudget` | `acquire`, `record`, `release`, `usage` | `NoopTokenBudget` |
| `AuditLogger` | Receive an `AuditEvent` | `TracingAuditLogger` |
| `NamedHealthcheck` | A named readiness probe | Used by `HealthGate` |

Call a `DecisionService` through the free functions `ask` and `ask_many` rather than directly: they return an `Unsupported` abstention for questions the backend does not support, check the answer's shape against the question, and record latency. [MagicAF Reflex](/docs/reflex/) explains the decision contract.

## Adapter Traits

These traits are the domain extension seam — where your application-specific logic plugs in.

### `EvidenceFormatter`

Converts vector search results into a text block for the LLM prompt.

```rust
#[async_trait]
pub trait EvidenceFormatter: Send + Sync {
    async fn format_evidence(&self, results: &[SearchResult]) -> Result<String>;
}
```

### `PromptBuilder`

Assembles the final prompt from the user query and formatted evidence.

```rust
#[async_trait]
pub trait PromptBuilder: Send + Sync {
    async fn build_prompt(&self, query: &str, evidence: &str) -> Result<String>;
}
```

### `ResultParser<T>`

Parses raw LLM output into a strongly-typed domain result.

```rust
#[async_trait]
pub trait ResultParser<T>: Send + Sync {
    async fn parse_result(&self, raw_output: &str) -> Result<T>;
}
```

## Thread Safety

Every service and adapter trait requires `Send + Sync`, so one instance can be shared across Tokio tasks — wrap it in an `Arc` and clone the handle. The exception is `StreamingAsrSession`, which is `Send` only: a session holds per-utterance decoder state and belongs to one task at a time. MagicAF is `tokio`-native and uses `#[async_trait]` throughout.

## Trait Composition

`RAGWorkflow` is generic over its services and adapters, so those calls are resolved at compile time:

```rust
// All type parameters are resolved at compile time
let workflow: RAGWorkflow<
    LocalEmbeddingService,
    QdrantVectorStore,
    LocalLlmService,
    DefaultEvidenceFormatter,
    DefaultPromptBuilder,
    RawResultParser,
    String,
> = RAGWorkflow::builder()
    // ...
    .build()?;
```

In practice, Rust infers all type parameters from the builder calls — you never need to write them out.
