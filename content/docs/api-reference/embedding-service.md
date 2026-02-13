---
title: "EmbeddingService"
description: "API reference for the EmbeddingService trait and LocalEmbeddingService."
weight: 1
tags: [api, embeddings, trait, local-embedding-service]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/traits-and-interfaces/]
estimated_reading_time: "8 min"
last_reviewed: "2026-02-12"
---

## Trait Definition

```rust
#[async_trait]
pub trait EmbeddingService: Send + Sync {
    async fn embed(&self, inputs: &[String]) -> Result<Vec<Vec<f32>>>;
    async fn embed_single(&self, input: &str) -> Result<Vec<f32>>;
    async fn health_check(&self) -> Result<()>;
}
```

**Module:** `magicaf_core::embeddings`

---

## Methods

### `embed`

```rust
async fn embed(&self, inputs: &[String]) -> Result<Vec<Vec<f32>>>
```

Embed a batch of input strings, returning one vector per input.

| Parameter | Type | Description |
|-----------|------|-------------|
| `inputs` | `&[String]` | Texts to embed. Empty slice returns empty vec. |

**Returns:** `Vec<Vec<f32>>` — one embedding vector per input, in the same order.

**Errors:** `MagicError::EmbeddingError`, `MagicError::HttpError`

> **Implementation note:** Implementations should respect batching limits internally. `LocalEmbeddingService` automatically chunks inputs according to `batch_size`.

---

### `embed_single`

```rust
async fn embed_single(&self, input: &str) -> Result<Vec<f32>>
```

Convenience method: embed a single string.

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `&str` | Text to embed |

**Returns:** `Vec<f32>` — the embedding vector.

**Errors:** `MagicError::EmbeddingError`, `MagicError::HttpError`

---

### `health_check`

```rust
async fn health_check(&self) -> Result<()>
```

Verify that the upstream embedding service is reachable and healthy.

**Errors:** `MagicError::HealthCheckFailed`

---

## `LocalEmbeddingService`

**Crate:** `magicaf-core`
**Module:** `magicaf_core::embeddings`

HTTP client that calls any server exposing an OpenAI-compatible `/v1/embeddings` endpoint.

### Constructor

```rust
impl LocalEmbeddingService {
    pub fn new(config: EmbeddingConfig) -> Result<Self>
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `EmbeddingConfig` | Service configuration (see [Configuration](/docs/api-reference/configuration/)) |

### Compatible Servers

| Server | Notes |
|--------|-------|
| llama.cpp | Run with `--embedding` flag |
| text-embeddings-inference | HuggingFace's dedicated embedding server |
| vLLM | Supports `/v1/embeddings` endpoint |
| Custom FastAPI / Actix / Axum | Must mirror the OpenAI embeddings schema |

### Wire Format

**Request:** `POST /v1/embeddings`
```json
{
  "model": "bge-large-en-v1.5",
  "input": ["text to embed", "another text"]
}
```

**Response:**
```json
{
  "data": [
    { "embedding": [0.1, 0.2, ...], "index": 0 },
    { "embedding": [0.3, 0.4, ...], "index": 1 }
  ]
}
```

### Example

```rust
use magicaf_core::config::EmbeddingConfig;
use magicaf_core::embeddings::{EmbeddingService, LocalEmbeddingService};

let embedder = LocalEmbeddingService::new(EmbeddingConfig {
    base_url: "http://localhost:8080".into(),
    model_name: "bge-large-en-v1.5".into(),
    batch_size: 32,
    timeout_secs: 30,
    api_key: None,
})?;

// Single embedding
let vector = embedder.embed_single("Hello, world!").await?;

// Batch embedding
let texts = vec!["First doc".into(), "Second doc".into()];
let vectors = embedder.embed(&texts).await?;
```

## Implementing Custom Backends

Implement `EmbeddingService` for any backend:

```rust
use async_trait::async_trait;
use magicaf_core::embeddings::EmbeddingService;
use magicaf_core::errors::Result;

pub struct MyEmbeddingService { /* ... */ }

#[async_trait]
impl EmbeddingService for MyEmbeddingService {
    async fn embed(&self, inputs: &[String]) -> Result<Vec<Vec<f32>>> {
        // Your implementation: ONNX Runtime, CoreML, gRPC, etc.
        todo!()
    }

    async fn embed_single(&self, input: &str) -> Result<Vec<f32>> {
        let results = self.embed(&[input.to_string()]).await?;
        results.into_iter().next()
            .ok_or_else(|| magicaf_core::errors::MagicError::embedding("empty result"))
    }

    async fn health_check(&self) -> Result<()> {
        Ok(()) // Implement as appropriate
    }
}
```
