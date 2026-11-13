---
title: "Reranking"
description: "API reference for the Reranker trait, score-threshold filtering, and cross-encoder reranking."
weight: 15
tags: [api, reranking, cross-encoder, search-quality, rag]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/api-reference/core/rag-workflow/]
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

Keeps only results with `score >= min_score`, sorted by score, highest first.

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
| **Custom** | Any server implementing the `/rerank` contract above |

The request body uses a `passages` field. Several hosted and self-hosted rerankers name it `documents` or `texts` instead (Cohere, Jina, and Hugging Face text-embeddings-inference among them), so put a thin adapter in front of those, or implement the `Reranker` trait directly against their API.

The passage sent for each result is its payload's `text` field; if there is none, the whole payload is serialized. Store your passage under `text` when you plan to rerank.

---

## RAG Pipeline Integration

Add a reranker to the RAG workflow using the builder:

```rust
use magicaf_core::rag::reranker::{CrossEncoderReranker, CrossEncoderConfig};

let reranker = std::sync::Arc::new(CrossEncoderReranker::new(serde_json::from_value::<CrossEncoderConfig>(
    serde_json::json!({
        "base_url": "http://localhost:8787",
        "model_name": "cross-encoder/ms-marco-MiniLM-L-6-v2"
    }),
)?)?);

let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)
    .vector_store(store)
    .llm_service(llm)
    .evidence_formatter(DefaultEvidenceFormatter)
    .prompt_builder(DefaultPromptBuilder::new())
    .result_parser(RawResultParser)
    .collection("documents")
    .top_k(8)               // passages the model will read
    .reranker(reranker)     // best first
    .build()?;
```

The pipeline flow becomes: embed → search → **rerank** → format evidence → build prompt → LLM → parse. `CrossEncoderReranker` reorders and rescores; it does not drop results, so every retrieved passage still reaches the model.
