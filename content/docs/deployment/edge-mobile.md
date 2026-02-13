---
title: "Edge & Mobile"
description: "Deploy MagicAF on resource-constrained devices — phones, tablets, embedded systems, and edge servers."
weight: 3
tags: [deployment, edge, mobile, onnx, coreml, in-memory]
categories: [deployment]
difficulty: advanced
prerequisites: [/docs/core-concepts/traits-and-interfaces/]
estimated_reading_time: "7 min"
last_reviewed: "2026-02-12"
---

MagicAF supports deployment on resource-constrained devices where running Qdrant and a full LLM server is impractical.

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│                    Edge Device                            │
│                                                           │
│  ┌──────────────┐  ┌─────────────────────┐               │
│  │  On-Device    │  │ InMemoryVectorStore │               │
│  │  Embedding    │  │  (magicaf-core)     │               │
│  │  (ONNX/CoreML)│  │                     │               │
│  └──────┬───────┘  └──────────┬──────────┘               │
│         └──────┬──────────────┘                           │
│         ┌──────▼──────┐                                   │
│         │ RAGWorkflow │  ← Full MagicAF orchestration     │
│         └──────┬──────┘                                   │
│         ┌──────▼──────┐                                   │
│         │  Remote LLM │  ← When network available         │
│         │  or Cached   │                                  │
│         └─────────────┘                                   │
└───────────────────────────────────────────────────────────┘
```

## Component Availability

| Component | Server Deployment | Edge Deployment |
|-----------|------------------|-----------------|
| Vector Store | Qdrant (`magicaf-qdrant`) | `InMemoryVectorStore` (in `magicaf-core`) |
| Embeddings | llama.cpp / TEI server | On-device (ONNX, CoreML, TFLite) |
| LLM | vLLM / llama.cpp | Omitted, or remote when online |
| Persistence | Qdrant handles it | `InMemoryVectorStore::save()` / `load()` |

## `InMemoryVectorStore`

The zero-dependency vector store that ships with `magicaf-core`:

```rust
use magicaf_core::prelude::*;

// Create a new store
let store = InMemoryVectorStore::new();
store.ensure_collection("docs", 1024).await?;
store.index("docs", embeddings, payloads).await?;

let results = store.search("docs", query_vec, 5, None).await?;

// Persist to disk
store.save(Path::new("store.json"))?;

// Load on next startup
let store = InMemoryVectorStore::load(Path::new("store.json"))?;
```

### Performance Characteristics

| Points | Search Latency | Memory (1024-dim) |
|--------|----------------|-------------------|
| 1,000 | < 1ms | ~10 MB |
| 10,000 | ~5ms | ~100 MB |
| 100,000 | ~50ms | ~1 GB |

## Edge Embedding Strategies

### Option A — On-Device ONNX Runtime

Implement the `EmbeddingService` trait using ONNX Runtime for fully offline embeddings:

```rust
use magicaf_core::prelude::*;
use async_trait::async_trait;

pub struct OnnxEmbeddingService {
    session: ort::Session,
}

#[async_trait]
impl EmbeddingService for OnnxEmbeddingService {
    async fn embed(&self, inputs: &[String]) -> Result<Vec<Vec<f32>>> {
        // Tokenize + run ONNX inference
        // Runs entirely on-device, no network required
        todo!("Implement with ort crate")
    }

    async fn embed_single(&self, input: &str) -> Result<Vec<f32>> {
        let results = self.embed(&[input.to_string()]).await?;
        results.into_iter().next()
            .ok_or_else(|| MagicError::embedding("empty"))
    }

    async fn health_check(&self) -> Result<()> {
        Ok(()) // Always healthy — local
    }
}
```

### Option B — Apple CoreML (iOS/macOS)

Wrap a CoreML `.mlmodel` behind the `EmbeddingService` trait via FFI. The MagicAF FFI surface is designed for this pattern.

### Option C — Local llama.cpp

For devices with 4GB+ RAM, run llama.cpp as a subprocess for embeddings only.

## Offline Workflow

1. **Pre-index on a server** — run the full MagicAF stack and index your documents
2. **Export the store** — `InMemoryVectorStore::save("portable_store.json")`
3. **Bundle with app** — ship the JSON file with your mobile app
4. **Load on device** — `InMemoryVectorStore::load("portable_store.json")`

## Edge RAG Without LLM

On mobile, you may not need (or be able to run) an LLM:

- **Retrieval-only** — use embedding + vector store to find relevant documents, display directly
- **Remote LLM fallback** — call a remote server when network is available
- **Cached responses** — pre-compute LLM responses for common queries

## Platform Notes

| Platform | Embeddings | Vector Store | Notes |
|----------|-----------|-------------|-------|
| **iOS (Swift)** | CoreML `.mlmodel` | `InMemoryVectorStore` via C FFI | Bundle store in app bundle |
| **Android (Kotlin)** | ONNX Runtime Mobile / TFLite | `InMemoryVectorStore` via JNI | Store in internal storage |
| **Linux Edge (RPi, Jetson)** | llama.cpp on ARM64 | Qdrant or InMemory | Full stack possible with 8GB+ RAM |
