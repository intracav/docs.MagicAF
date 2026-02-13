---
title: "Traits & Interfaces"
description: "The trait system that makes every MagicAF component swappable."
weight: 3
tags: [traits, interfaces, extensibility, generics, async]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/core-concepts/architecture/
estimated_reading_time: "10 min"
last_reviewed: "2026-02-12"
---

MagicAF's extensibility comes from its trait-based design. Every major component is accessed through an async trait, and every trait can be implemented by your application.

## Why Traits Instead of Concrete Types?

MagicAF uses Rust traits (interfaces) rather than concrete types for three engineering reasons:

**Compile-time dispatch, zero runtime overhead.** `RAGWorkflow` is generic over all trait parameters. The Rust compiler resolves every method call at compile time through monomorphization — there are no virtual function tables, no dynamic dispatch, no boxing. Your production binary runs as fast as if every component were hardcoded.

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

Stores, searches, and manages dense vectors with JSON payloads.

```rust
#[async_trait]
pub trait VectorStore: Send + Sync {
    /// Index a batch of embeddings with payloads.
    async fn index(
        &self,
        collection: &str,
        embeddings: Vec<Vec<f32>>,
        payloads: Vec<serde_json::Value>,
    ) -> Result<()>;

    /// Nearest-neighbor search.
    async fn search(
        &self,
        collection: &str,
        query_vector: Vec<f32>,
        limit: usize,
        filter: Option<serde_json::Value>,
    ) -> Result<Vec<SearchResult>>;

    /// Delete all vectors for a given entity ID.
    async fn delete_by_entity(
        &self,
        collection: &str,
        entity_id: Uuid,
    ) -> Result<()>;

    /// Ensure a collection exists with the given vector dimensions.
    async fn ensure_collection(
        &self,
        collection: &str,
        vector_size: usize,
    ) -> Result<()>;
}
```

**Shipped implementations:**
- `QdrantVectorStore` — Qdrant REST API
- `InMemoryVectorStore` — zero-dependency, in-process store

**You might implement this for:** Milvus, Weaviate, pgvector, FAISS, or any custom backend.

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

---

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

All traits require `Send + Sync`, meaning implementations are safe for concurrent use across Tokio tasks. MagicAF is fully `tokio`-native and uses `#[async_trait]` throughout.

## Trait Composition

The `RAGWorkflow` is generic over all traits. This means the compiler statically dispatches all calls — **zero runtime overhead** from the trait-based design:

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
