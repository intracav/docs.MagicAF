---
title: "Minimal RAG"
description: "The smallest complete MagicAF pipeline: three services, three documents, the default adapters, and one question."
weight: 1
difficulty: beginner
keywords: [minimal RAG example, Rust RAG, MagicAF example]
---

The `minimal_rag` example is the reference for a pipeline with no custom code: it indexes three sentences, wires the default formatter, prompt builder, and parser, and prints the answer with its token usage.

```bash
cargo run -p example-minimal-rag
```

It reads `EMBEDDING_URL`, `EMBEDDING_MODEL`, `QDRANT_URL`, `LLM_URL`, and `LLM_MODEL` from the environment, with the defaults from [Prerequisites](/docs/getting-started/prerequisites/). The library itself reads no environment variables — this is the example choosing to.

## What to notice

- **Every config field is spelled out.** The example builds `EmbeddingConfig`, `VectorStoreConfig`, and `LlmConfig` field by field so you can see every knob. In your own code, deserialize them from a file and let the defaults fill in — see [Installation](/docs/getting-started/installation/#configuration).
- **Indexing happens before the workflow is built**, because the builder takes ownership of the embedder and the store.
- **`DefaultPromptBuilder::new().with_system(...)`** sets the system prompt without writing an adapter.
- **`result.usage`** carries the model's token counts when the server reports them.

The [Quickstart](/docs/getting-started/quickstart/) is the same program written more compactly.

## Full source

<details class="source-details">
<summary><code>examples/minimal_rag/src/main.rs</code> — the file as it is in the MagicAF repository at <code>9d00780</code></summary>

```rust
//! # Minimal RAG Example
//!
//! Demonstrates the simplest possible MagicAF RAG pipeline:
//!
//! 1. Connect to local services (embedding, Qdrant, LLM)
//! 2. Index a handful of documents
//! 3. Run a RAG query
//!
//! ## Prerequisites
//!
//! ```bash
//! # Qdrant
//! docker run -d -p 6333:6333 qdrant/qdrant
//!
//! # Embedding server (llama.cpp example)
//! ./llama-server -m bge-large-en-v1.5.Q4_K_M.gguf --embedding --port 8080
//!
//! # LLM server (vLLM example)
//! python -m vllm.entrypoints.openai.api_server --model mistralai/Mistral-7B-Instruct-v0.2 --port 8000
//! ```
//!
//! ## Running
//!
//! ```bash
//! cargo run -p example-minimal-rag
//! ```

use magicaf_core::adapters::{DefaultEvidenceFormatter, DefaultPromptBuilder, RawResultParser};
use magicaf_core::config::{EmbeddingConfig, LlmConfig, VectorStoreConfig};
use magicaf_core::embeddings::LocalEmbeddingService;
use magicaf_core::rag::RAGWorkflow;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // ── Structured logging ───────────────────────────────────────────────
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,magicaf=debug".parse().unwrap()),
        )
        .json()
        .init();

    println!("=== MagicAF · Minimal RAG Example ===\n");

    // ── Configuration ────────────────────────────────────────────────────
    let embedding_config = EmbeddingConfig {
        base_url: std::env::var("EMBEDDING_URL").unwrap_or_else(|_| "http://localhost:8080".into()),
        model_name: std::env::var("EMBEDDING_MODEL").unwrap_or_else(|_| "bge-large-en-v1.5".into()),
        batch_size: 32,
        connect_timeout_secs: 5,
        request_timeout_secs: 30,
        health_check_timeout_secs: 5,
        api_key: None,
        retry: Default::default(),
        circuit_breaker: Default::default(),
        rate_limit: Default::default(),
        tls: Default::default(),
        connection_pool: Default::default(),
        parallel_batches: 1,
    };

    let vector_config = VectorStoreConfig {
        base_url: std::env::var("QDRANT_URL").unwrap_or_else(|_| "http://localhost:6333".into()),
        api_key: None,
        connect_timeout_secs: 5,
        request_timeout_secs: 30,
        health_check_timeout_secs: 5,
        retry: Default::default(),
        circuit_breaker: Default::default(),
        rate_limit: Default::default(),
        tls: Default::default(),
        connection_pool: Default::default(),
    };

    let llm_config = LlmConfig {
        base_url: std::env::var("LLM_URL").unwrap_or_else(|_| "http://localhost:8000/v1".into()),
        model_name: std::env::var("LLM_MODEL").unwrap_or_else(|_| "mistral-7b".into()),
        api_key: None,
        connect_timeout_secs: 5,
        request_timeout_secs: 120,
        health_check_timeout_secs: 5,
        retry: Default::default(),
        circuit_breaker: Default::default(),
        rate_limit: Default::default(),
        tls: Default::default(),
        connection_pool: Default::default(),
    };

    // ── Service construction ─────────────────────────────────────────────
    let embedder = LocalEmbeddingService::new(embedding_config)?;
    let store = QdrantVectorStore::new(vector_config).await?;
    let llm = LocalLlmService::new(llm_config)?;

    // ── Index some sample documents ──────────────────────────────────────
    let collection = "example_docs";
    store.ensure_collection(collection, 1024).await.ok(); // ignore if exists

    let docs = [
        "Rust is a systems programming language focused on safety, speed, and concurrency.",
        "MagicAF provides embeddings, vector search, and LLM orchestration.",
        "Retrieval-Augmented Generation combines search with language models.",
    ];
    let doc_texts: Vec<String> = docs.iter().map(|s| s.to_string()).collect();

    use magicaf_core::embeddings::EmbeddingService;
    let embeddings = embedder.embed(&doc_texts).await?;

    let payloads: Vec<serde_json::Value> = docs
        .iter()
        .enumerate()
        .map(|(i, text)| {
            serde_json::json!({
                "content": text,
                "doc_index": i,
            })
        })
        .collect();

    use magicaf_core::vector_store::VectorStore;
    store.index(collection, embeddings, payloads).await?;
    println!("Indexed {} documents into '{collection}'\n", docs.len());

    // ── Build and run RAG workflow ───────────────────────────────────────
    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)
        .vector_store(store)
        .llm_service(llm)
        .evidence_formatter(DefaultEvidenceFormatter)
        .prompt_builder(DefaultPromptBuilder::new().with_system(
            "You are a helpful technical assistant. Answer using only the provided evidence.",
        ))
        .result_parser(RawResultParser)
        .collection(collection)
        .top_k(3)
        .build()?;

    let result = workflow.run("What is MagicAF?", None).await?;

    println!("── Answer ──────────────────────────");
    println!("{}", result.result);
    println!("────────────────────────────────────");
    println!(
        "Evidence items: {} | Raw tokens: {:?}",
        result.evidence_count,
        result.usage.map(|u| u.total_tokens)
    );

    Ok(())
}
```

</details>

