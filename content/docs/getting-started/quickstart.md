---
title: "Quickstart - Defense-Grade, HIPAA-Compliant AI Toolkit"
description: "Build a complete secure RAG pipeline in under 50 lines of Rust. Defense-grade, HIPAA-compliant, airgapped AI toolkit for secure environments."
weight: 3
keywords: "defense-grade ai quickstart, hipaa-compliant ai quickstart, airgapped ai quickstart, secure llm quickstart, secure rag quickstart, secure ai toolkit quickstart"
---

This guide walks you through building a full **secure Retrieval-Augmented Generation pipeline** using MagicAF — the **defense-grade, HIPAA-compliant, airgapped AI toolkit**: embed documents, store them in a vector database, and answer questions using a secure, local LLM. All components run on-premises with **zero cloud dependencies**, perfect for **SIPR/NIPR, secret, classified, and healthcare environments**.

## The Complete Pipeline

```rust
use magicaf_core::prelude::*;
use magicaf_core::embeddings::LocalEmbeddingService;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // 1. Configure services
    let embedder = LocalEmbeddingService::new(EmbeddingConfig {
        base_url: "http://localhost:8080".into(),
        model_name: "bge-large-en-v1.5".into(),
        batch_size: 32,
        timeout_secs: 30,
        api_key: None,
    })?;

    let store = QdrantVectorStore::new(VectorStoreConfig {
        base_url: "http://localhost:6333".into(),
        api_key: None,
        timeout_secs: 30,
    }).await?;

    let llm = LocalLlmService::new(LlmConfig {
        base_url: "http://localhost:8000/v1".into(),
        model_name: "mistral-7b".into(),
        api_key: None,
        timeout_secs: 120,
    })?;

    // 2. Build the RAG workflow
    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)
        .vector_store(store)
        .llm_service(llm)
        .evidence_formatter(DefaultEvidenceFormatter)
        .prompt_builder(DefaultPromptBuilder::new())
        .result_parser(RawResultParser)
        .collection("my_docs")
        .top_k(5)
        .build()?;

    // 3. Run a query
    let result = workflow.run("What is MagicAF?", None).await?;

    println!("{}", result.result);
    println!("Evidence items: {}", result.evidence_count);

    Ok(())
}
```

## What Just Happened

The `RAGWorkflow` executes a six-step pipeline:

| Step | Component | What it does |
|------|-----------|-------------|
| 1 | `EmbeddingService` | Converts the query text into a dense vector |
| 2 | `VectorStore` | Searches for the most similar documents |
| 3 | `EvidenceFormatter` | Formats search results into a text block |
| 4 | `PromptBuilder` | Assembles the final prompt (evidence + query) |
| 5 | `LlmService` | Sends the prompt to the language model |
| 6 | `ResultParser` | Parses the LLM output into a typed result |

Every step is pluggable — swap any component by implementing its trait.

## Index Documents First

Before querying, you need to index documents into the vector store:

```rust
use magicaf_core::embeddings::EmbeddingService;
use magicaf_core::vector_store::VectorStore;

// Prepare documents
let docs = vec![
    "Rust is a systems programming language focused on safety and speed.",
    "MagicAF provides embeddings, vector search, and LLM orchestration.",
    "RAG combines retrieval with language model generation.",
];

// Create the collection
store.ensure_collection("my_docs", 1024).await?;

// Embed documents
let texts: Vec<String> = docs.iter().map(|s| s.to_string()).collect();
let embeddings = embedder.embed(&texts).await?;

// Build payloads
let payloads: Vec<serde_json::Value> = docs.iter().enumerate()
    .map(|(i, text)| serde_json::json!({
        "content": text,
        "doc_index": i,
    }))
    .collect();

// Index
store.index("my_docs", embeddings, payloads).await?;
```

## Add Structured Logging

MagicAF uses `tracing` for structured, JSON-formatted logs:

```rust
tracing_subscriber::fmt()
    .json()
    .with_env_filter("info,magicaf=debug")
    .init();
```

This gives you full visibility into every pipeline step — embedding latency, search result counts, LLM response times.

## Next Steps

- **[Core Concepts →](/docs/core-concepts/)** — Understand the architecture and extensibility model
- **[Building Adapters →](/docs/guides/building-adapters/)** — Create custom domain logic
- **[API Reference →](/docs/api-reference/)** — Complete trait and type documentation
- **[Examples →](/docs/examples/)** — Working code for common use cases
