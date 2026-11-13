---
title: "Quickstart"
description: "Index three documents and answer a question from them with a complete retrieval-augmented pipeline — one Rust file, three local services."
weight: 3
keywords: [quickstart, RAG pipeline, local RAG, air-gapped RAG, Rust AI]
tags: [rag, pipeline, quickstart, embeddings, vector-search]
categories: [guide]
difficulty: beginner
---

In this quickstart you will embed three short documents, store them in Qdrant, and ask a question that MagicAF answers from them. The whole program is one file.

**Before you start:** the three local services from [Prerequisites](/docs/getting-started/prerequisites/) are running, and you can fetch the MagicAF crates ([Installation](/docs/getting-started/installation/)).

## 1. Create the project

```bash
cargo new magicaf-quickstart && cd magicaf-quickstart
```

```toml
# Cargo.toml
[dependencies]
magicaf-core      = { git = "ssh://git@github.com/intracav/MagicAF.git" }
magicaf-qdrant    = { git = "ssh://git@github.com/intracav/MagicAF.git" }
magicaf-local-llm = { git = "ssh://git@github.com/intracav/MagicAF.git" }
tokio      = { version = "1", features = ["full"] }
serde_json = "1"
anyhow     = "1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
```

## 2. Write the pipeline

Replace `src/main.rs` with:

```rust
use magicaf_core::embeddings::{EmbeddingService, LocalEmbeddingService};
use magicaf_core::prelude::*;
use magicaf_core::vector_store::VectorStore;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;
use serde_json::json;

const COLLECTION: &str = "quickstart";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter("info,magicaf=debug")
        .init();

    // 1. Point MagicAF at the three local services. Every field you leave out
    //    (timeouts, retry, circuit breaker, TLS) takes its documented default.
    let embedder = LocalEmbeddingService::new(serde_json::from_value(json!({
        "base_url": "http://localhost:8080",
        "model_name": "bge-large-en-v1.5"
    }))?)?;

    let store = QdrantVectorStore::new(serde_json::from_value(json!({
        "base_url": "http://localhost:6333"
    }))?)
    .await?;

    let llm = LocalLlmService::new(LlmConfig {
        base_url: "http://localhost:8000/v1".into(),
        model_name: "mistral-7b".into(),
        ..Default::default()
    })?;

    // 2. Index a few documents. bge-large-en-v1.5 produces 1024-dim vectors.
    let docs = [
        "MagicAF is a Rust framework for building AI systems that run inside your own network.",
        "A RAG workflow embeds the question, retrieves similar passages, and asks the LLM to answer from them.",
        "MagicAF services talk only to endpoints you configure; nothing calls out to a vendor cloud.",
    ];
    store.ensure_collection(COLLECTION, 1024).await?;
    let texts: Vec<String> = docs.iter().map(|d| d.to_string()).collect();
    let vectors = embedder.embed(&texts).await?;
    let payloads = docs.iter().map(|d| json!({ "content": d })).collect();
    store.index(COLLECTION, vectors, payloads).await?;

    // 3. Assemble the workflow. The builder takes ownership of the services,
    //    so index first, then build.
    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)
        .vector_store(store)
        .llm_service(llm)
        .evidence_formatter(DefaultEvidenceFormatter)
        .prompt_builder(DefaultPromptBuilder::new())
        .result_parser(RawResultParser)
        .collection(COLLECTION)
        .top_k(3)
        .build()?;

    // 4. Ask.
    let answer = workflow.run("Does MagicAF need internet access?", None).await?;
    println!("{}", answer.result);
    println!("(answered from {} retrieved passages)", answer.evidence_count);
    Ok(())
}
```

## 3. Run it

```bash
cargo run
```

The first build compiles the workspace and takes a few minutes. Then you will see debug logs for each pipeline stage, followed by the model's answer and the line `(answered from 3 retrieved passages)`.

If the program fails, the error names the service that failed. The common ones:

| Error message begins with | Likely cause |
|---|---|
| `Embedding service error`, `Vector store error`, `LLM service error` | The service is not running, or its URL is wrong. Re-run the `curl` checks in Prerequisites. |
| `HTTP error` with status 404 from the LLM | `base_url` is missing `/v1`, or `model_name` does not match the name the server serves (`--served-model-name` in vLLM). |
| `Circuit open for service` | Several calls in a row failed, so MagicAF stopped trying for a cool-down period. Fix the underlying service and retry. |

The full list is in [Errors](/docs/api-reference/core/errors/).

## What just happened

`workflow.run` executes a fixed sequence, and each stage is a trait you can replace:

| Stage | Component | What it does |
|---|---|---|
| Guard | `PromptGuard` (optional) | Rejects or sanitizes prompt-injection attempts before anything else runs |
| Embed | `EmbeddingService` | Turns the question into a vector |
| Retrieve | `VectorStore` | Finds the `top_k` nearest passages, then drops any below `min_score` |
| Rerank | `Reranker` (optional) | Reorders passages with a cross-encoder or score threshold |
| Format | `EvidenceFormatter` | Turns passages into an evidence block |
| Prompt | `PromptBuilder` | Combines evidence and question into the chat request |
| Generate | `LlmService` | Calls the model |
| Check | `ResponseGuard` (optional) | Validates the raw output before parsing |
| Parse | `ResultParser` | Turns the output into your result type — here a plain `String` |

Before every network call the workflow checks for a shutdown signal, and every run — success or failure — can emit an audit event and records `rag_pipeline_duration_seconds`. [The RAG pipeline](/docs/core-concepts/rag-pipeline/) walks through each stage in depth.

## Where to go next

- **Return structured data instead of text** — [Structured output](/docs/guides/structured-output/) replaces `RawResultParser` with a typed result.
- **Fit your domain** — [Building adapters](/docs/guides/building-adapters/) shows how to write your own formatter, prompt builder, and parser.
- **Go offline** — [Air-gapped deployment](/docs/tutorials/air-gapped-deployment/) takes this same pipeline onto a network with no internet.
- **See what else is in the box** — the [crate catalog](/docs/crates/) covers agents, tools, MCP, ingest, and on-device crates.
