---
title: "Reranking"
description: "API reference for the Reranker trait, score-threshold filtering, and cross-encoder reranking."
weight: 15
tags: [api, reranking, cross-encoder, search-quality, rag]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/api-reference/core/rag-workflow/]
estimated_reading_time: "7 min"
last_reviewed: "2026-03-10"
---

Rerankers improve RAG pipeline quality by re-scoring vector search results with a more powerful model. MagicAF ships two implementations: a simple score threshold filter and an HTTP-based cross-encoder reranker.

**Module:** `magicaf_core::rag::reranker`

---

## `Reranker` Trait

```rust
#[async_trait]
pub trait Reranker: Send + Sync {
    async fn rerank(
        &self,
        query: &str,
        results: Vec<SearchResult>,
    ) -> Result<Vec<SearchResult>>;
}
```

Takes the original query and candidate search results, returns a re-ordered (and potentially filtered) list.

---

## `ScoreThresholdReranker`

The simplest reranker — filters out results below a minimum relevance score.

```rust
pub struct ScoreThresholdReranker {
    pub min_score: f32,
}
```

### Behavior

Keeps only results with `score >= min_score`. Order is preserved.

### Example

```rust
use magicaf_core::rag::reranker::ScoreThresholdReranker;

let reranker = ScoreThresholdReranker { min_score: 0.7 };
```

---

## `CrossEncoderReranker`

Calls an external cross-encoder HTTP API to re-score results based on query-passage relevance.

### `CrossEncoderConfig`

```rust
pub struct CrossEncoderConfig {
    pub base_url: String,
    pub model_name: String,
    pub api_key: Option<SecretString>,
    pub request_timeout_secs: u64,      // default: 30
    pub tls: TlsConfig,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL of the reranking server |
| `model_name` | `String` | — | Model identifier sent in the request |
| `api_key` | `Option<SecretString>` | `None` | Optional bearer token |
| `request_timeout_secs` | `u64` | `30` | HTTP timeout in seconds |
| `tls` | `TlsConfig` | default | TLS configuration |

### `CrossEncoderReranker`

```rust
pub struct CrossEncoderReranker { /* ... */ }
```

#### Constructor

```rust
pub fn new(config: CrossEncoderConfig) -> Result<Self>
```

### Wire Format

The reranker sends a POST request to `{base_url}/rerank`:

**Request:**
```json
{
  "model": "cross-encoder-model",
  "query": "user query",
  "passages": ["passage 1", "passage 2", "..."]
}
```

**Response:**
```json
{
  "results": [
    { "index": 0, "relevance_score": 0.95 },
    { "index": 1, "relevance_score": 0.72 }
  ]
}
```

Results are sorted by `relevance_score` descending and scores are updated on the `SearchResult` structs.

### Compatible Servers

| Server | Notes |
|--------|-------|
| **Cohere Rerank** | API-compatible (cloud or on-prem) |
| **Jina Reranker** | Self-hosted cross-encoder |
| **TEI Reranker** | HuggingFace Text Embeddings Inference |
| **Custom** | Any server implementing the `/rerank` endpoint above |

---

## RAG Pipeline Integration

Add a reranker to the RAG workflow using the builder:

```rust
use magicaf_core::rag::reranker::{CrossEncoderReranker, CrossEncoderConfig};

let reranker = CrossEncoderReranker::new(CrossEncoderConfig {
    base_url: "http://localhost:8787".into(),
    model_name: "cross-encoder/ms-marco-MiniLM-L-6-v2".into(),
    api_key: None,
    ..Default::default()
})?;

let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)
    .vector_store(store)
    .llm_service(llm)
    .collection("documents")
    .top_k(20)                      // Retrieve more candidates
    .reranker(Box::new(reranker))   // Re-score and re-order
    .build()?;
```

The pipeline flow becomes: embed → search (top_k=20) → **rerank** → format evidence → build prompt → LLM → parse.
