---
title: "Edge & Mobile"
description: "What runs on the device and what stays on a server: model-free helpers and calibrated decisions on phones, speech and in-process retrieval at the edge, and the boundaries between them."
weight: 3
tags: [deployment, edge, mobile, flutter, swift, in-memory]
categories: [deployment]
difficulty: advanced
prerequisites: [/docs/core-concepts/architecture/]
---

A phone or a small edge box cannot host an LLM server and a vector database the way a data center can, so an edge deployment is a decision about what moves onto the device. MagicAF gives you four pieces that run there today, and a clean trait boundary for anything else.

## What runs on the device

| Need | Use | Runs on | Status |
|---|---|---|---|
| Text helpers on every keystroke — titles, keywords, readability, jargon, voice activity | [`magicaf-mobile`](/docs/crates/magicaf-mobile/) | iOS, Android, macOS through Flutter | {{< crate-status "stable" >}} |
| Small calibrated decisions, with abstention | [`magicaf-reflex`](/docs/crates/magicaf-reflex/) | Swift package (iOS 17, macOS 14), WebAssembly, Rust | {{< crate-status "preview" >}} |
| Streaming speech recognition | [`magicaf-asr-onnx`](/docs/crates/magicaf-asr-onnx/) | Anywhere sherpa-onnx builds | {{< crate-status "experimental" >}} |
| Retrieval without a database server | `InMemoryVectorStore` in [`magicaf-core`](/docs/crates/magicaf-core/) | Any Rust target with `std` | {{< crate-status "stable" >}} |

Generation is the piece that usually stays off the device: the LLM runs on a server the device reaches over the network, or the feature degrades to retrieval-only results when offline.

## Mobile apps (Flutter)

`magicaf-mobile` is built to be called synchronously from Dart through `flutter_rust_bridge`, with no model download and no async runtime. Depend on it with `default-features = false` — the default `guard` feature pulls in the full `magicaf-core` dependency tree (about 52 MB on iOS). The [crate page](/docs/crates/magicaf-mobile/#calling-it-from-flutter) shows the wrapper-crate pattern that shipping apps use.

## On-device decisions (Swift, WebAssembly)

`magicaf-reflex` has no async runtime, no networking by default, and no dependency on `magicaf-core`, which keeps it small enough for an app binary. It ships as a Swift package with Core ML heads, and as WebAssembly for browser use. See [the on-device scorer](/docs/reflex/on-device-scorer/).

## Retrieval at the edge

`InMemoryVectorStore` implements the same `VectorStore` trait as Qdrant, so a `RAGWorkflow` built for a server runs unchanged on an edge box with the store swapped:

```rust
use std::path::Path;
use magicaf_core::vector_store::{InMemoryVectorStore, VectorStore};

// Build once on a connected machine…
let store = InMemoryVectorStore::new();
store.ensure_collection("docs", 384).await?;
store.index("docs", vectors, payloads).await?;
store.save(Path::new("docs.store.json"))?;

// …ship the file, and load it on the device.
let store = InMemoryVectorStore::load(Path::new("docs.store.json"))?;
```

Search is an exact, brute-force cosine scan — no index to tune, and results identical to a full comparison. Measured with the repository's benchmark (`cargo bench -p magicaf-benches --bench in_memory_search`), 384-dimensional vectors, top 10, on an Apple M1, measured on 2026-11-13 with Criterion's quick mode on a machine doing other work — treat the figures as upper bounds:

| Points | Search, top 10 | Vector memory (384-dim `f32`) |
|---|---|---|
| 1,000 | 0.6 ms | 1.5 MB |
| 10,000 | 8.8 ms | 15 MB |
| 100,000 | 120 ms | 150 MB |

Payloads add to memory on top of the vectors.

Latency grows linearly with the number of points: the store is comfortable into the tens of thousands of vectors for interactive use, workable at 100,000 for batch use, and beyond that Qdrant is the right tool.

### Embeddings on the device

MagicAF does not ship an on-device embedding model. The query still has to be embedded with the same model that built the store, so you have two options:

- **Embed on a small server** — a CPU text-embeddings-inference container with `bge-small-en-v1.5` (384 dimensions) runs comfortably on an edge box, and `LocalEmbeddingService` talks to it as usual.
- **Implement `EmbeddingService` over a local runtime** — wrap ONNX Runtime, Core ML, or another runtime in a type that implements the three-method trait. Everything downstream is unchanged.

## Retrieval without generation

When there is no LLM to call, skip the workflow and return passages directly: embed the question, call `store.search(...)`, and show the top results with their source fields. Users get grounded results offline, and generation resumes when a server is reachable.
