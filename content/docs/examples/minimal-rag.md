---
title: "Minimal RAG"
description: "The simplest possible MagicAF RAG pipeline — default adapters, zero customization."
weight: 1
---

This example demonstrates the bare minimum needed to build a working RAG pipeline. It uses all default adapters and returns raw text output.

**Difficulty:** ★☆☆ Beginner
**Custom adapters:** None
**Output type:** `String`

## What This Example Does

1. Connects to local embedding, vector store, and LLM services
2. Indexes a handful of sample documents
3. Runs a RAG query and prints the answer

## Full Code

```rust
use magicaf_core::adapters::{
    DefaultEvidenceFormatter, DefaultPromptBuilder, RawResultParser,
};
use magicaf_core::config::{EmbeddingConfig, LlmConfig, VectorStoreConfig};
use magicaf_core::embeddings::LocalEmbeddingService;
use magicaf_core::rag::RAGWorkflow;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // ── Structured logging ─────────────────────────────────────────
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,magicaf=debug".parse().unwrap()),
        )
        .json()
        .init();

    println!("=== MagicAF · Minimal RAG Example ===\n");

    // ── Configuration ──────────────────────────────────────────────
    let embedding_config = EmbeddingConfig {
        base_url: std::env::var("EMBEDDING_URL")
            .unwrap_or_else(|_| "http://localhost:8080".into()),
        model_name: std::env::var("EMBEDDING_MODEL")
            .unwrap_or_else(|_| "bge-large-en-v1.5".into()),
        batch_size: 32,
        timeout_secs: 30,
        api_key: None,
    };

    let vector_config = VectorStoreConfig {
        base_url: std::env::var("QDRANT_URL")
            .unwrap_or_else(|_| "http://localhost:6333".into()),
        api_key: None,
        timeout_secs: 30,
    };

    let llm_config = LlmConfig {
        base_url: std::env::var("LLM_URL")
            .unwrap_or_else(|_| "http://localhost:8000/v1".into()),
        model_name: std::env::var("LLM_MODEL")
            .unwrap_or_else(|_| "mistral-7b".into()),
        api_key: None,
        timeout_secs: 120,
    };

    // ── Service construction ───────────────────────────────────────
    let embedder = LocalEmbeddingService::new(embedding_config)?;
    let store = QdrantVectorStore::new(vector_config).await?;
    let llm = LocalLlmService::new(llm_config)?;

    // ── Index sample documents ─────────────────────────────────────
    let collection = "example_docs";
    store.ensure_collection(collection, 1024).await.ok();

    let docs = vec![
        "Rust is a systems programming language focused on safety.",
        "MagicAF provides embeddings, vector search, and LLM orchestration.",
        "RAG combines retrieval with language model generation.",
    ];
    let doc_texts: Vec<String> = docs.iter().map(|s| s.to_string()).collect();

    use magicaf_core::embeddings::EmbeddingService;
    let embeddings = embedder.embed(&doc_texts).await?;

    let payloads: Vec<serde_json::Value> = docs.iter().enumerate()
        .map(|(i, text)| serde_json::json!({
            "content": text,
            "doc_index": i,
        }))
        .collect();

    use magicaf_core::vector_store::VectorStore;
    store.index(collection, embeddings, payloads).await?;
    println!("Indexed {} documents into '{collection}'\n", docs.len());

    // ── Build and run RAG workflow ─────────────────────────────────
    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)
        .vector_store(store)
        .llm_service(llm)
        .evidence_formatter(DefaultEvidenceFormatter)
        .prompt_builder(DefaultPromptBuilder::new().with_system(
            "You are a helpful technical assistant. \
             Answer using only the provided evidence.",
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
        "Evidence items: {} | Tokens: {:?}",
        result.evidence_count,
        result.usage.map(|u| u.total_tokens)
    );

    Ok(())
}
```

## Key Points

- **`DefaultEvidenceFormatter`** — pretty-prints each search result's JSON payload
- **`DefaultPromptBuilder::new().with_system(...)`** — wraps evidence in `<context>` tags with an optional system instruction
- **`RawResultParser`** — returns the LLM's output as a plain `String`
- **`top_k(3)`** — retrieve the 3 most similar documents

## Running

```bash
cargo run -p example-minimal-rag
```

## Next Steps

→ [Document Q&A](/docs/examples/document-qa/) — add custom adapters and structured output
