---
title: "RAGWorkflow"
description: "API reference for the RAG pipeline engine — builder, execution, and result types."
weight: 4
---

## Overview

`RAGWorkflow` is the central pipeline engine. It is fully generic over all service and adapter traits, with zero runtime overhead — all dispatch is static.

**Module:** `magicaf_core::rag`

## Type Signature

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

> In practice, you never write out the type parameters — Rust infers them from the builder.

---

## Builder

### `RAGWorkflow::builder()`

Returns a `RAGWorkflowBuilder` for constructing the workflow.

```rust
let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)       // Required
    .vector_store(store)               // Required
    .llm_service(llm)                  // Required
    .evidence_formatter(formatter)     // Required
    .prompt_builder(prompt_builder)    // Required
    .result_parser(parser)             // Required
    .collection("my_docs")             // Required
    .top_k(10)                         // Optional (default: 10)
    .min_score(0.5)                    // Optional (default: None)
    .generation_config(gen_config)     // Optional (default: GenerationConfig::default())
    .build()?;
```

### Builder Methods

| Method | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `embedding_service` | `S: EmbeddingService` | ✓ | — | Embedding provider |
| `vector_store` | `V: VectorStore` | ✓ | — | Vector database |
| `llm_service` | `L: LlmService` | ✓ | — | Language model |
| `evidence_formatter` | `EF: EvidenceFormatter` | ✓ | — | Evidence formatting logic |
| `prompt_builder` | `PB: PromptBuilder` | ✓ | — | Prompt assembly logic |
| `result_parser` | `RP: ResultParser<T>` | ✓ | — | Output parsing logic |
| `collection` | `impl Into<String>` | ✓ | — | Vector store collection name |
| `top_k` | `usize` | | `10` | Number of results to retrieve |
| `min_score` | `f32` | | `None` | Minimum similarity score filter |
| `generation_config` | `GenerationConfig` | | `Default` | LLM generation parameters |

### Build Errors

`.build()` returns `Err(MagicError::ConfigError)` if any required field is missing.

---

## Execution

### `run`

```rust
pub async fn run(
    &self,
    query: &str,
    filter: Option<serde_json::Value>,
) -> Result<RAGResult<T>>
```

Execute the full six-step RAG pipeline.

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `&str` | The user's question or task |
| `filter` | `Option<serde_json::Value>` | Backend-specific vector store filter |

**Returns:** `RAGResult<T>` containing the typed result and metadata.

**Pipeline steps:**
1. Embed query → `embedding_service.embed_single(query)`
2. Search → `vector_store.search(collection, vector, top_k, filter)`
3. Filter by `min_score` (if configured)
4. Format evidence → `evidence_formatter.format_evidence(&results)`
5. Build prompt → `prompt_builder.build_prompt(query, &evidence)`
6. LLM call → `llm_service.chat(request)` with `generation_config`
7. Parse → `result_parser.parse_result(&raw_output)`

---

## `RAGResult<T>`

```rust
pub struct RAGResult<T> {
    /// The domain-typed result from the ResultParser.
    pub result: T,

    /// Number of evidence items retrieved from the vector store.
    pub evidence_count: usize,

    /// The raw text returned by the LLM (before parsing).
    pub raw_llm_output: String,

    /// Token usage reported by the LLM, if available.
    pub usage: Option<Usage>,
}
```

### Accessing Results

```rust
let result = workflow.run("My question", None).await?;

// The typed result (String, QAAnswer, custom struct, etc.)
let answer = &result.result;

// Observability
println!("Evidence: {} items", result.evidence_count);
println!("Raw output: {}", result.raw_llm_output);
if let Some(usage) = &result.usage {
    println!("Tokens: {}", usage.total_tokens);
}
```

---

## Complete Example

```rust
use magicaf_core::prelude::*;
use magicaf_core::embeddings::LocalEmbeddingService;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;

let workflow = RAGWorkflow::builder()
    .embedding_service(LocalEmbeddingService::new(embedding_config)?)
    .vector_store(QdrantVectorStore::new(vector_config).await?)
    .llm_service(LocalLlmService::new(llm_config)?)
    .evidence_formatter(DefaultEvidenceFormatter)
    .prompt_builder(DefaultPromptBuilder::new().with_system(
        "Answer using only the provided evidence."
    ))
    .result_parser(RawResultParser)
    .collection("documents")
    .top_k(5)
    .min_score(0.4)
    .generation_config(GenerationConfig {
        temperature: 0.2,
        max_tokens: 2048,
        ..Default::default()
    })
    .build()?;

let result = workflow.run("What are the key findings?", None).await?;
```
