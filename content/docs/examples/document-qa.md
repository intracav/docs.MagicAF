---
title: "Document Q&A"
description: "Structured question answering: an evidence formatter that numbers sources, a prompt that asks for JSON, and JsonResultParser turning the reply into a typed answer with citations."
weight: 2
difficulty: intermediate
keywords: [document question answering, structured output, JSON parser, citations, MagicAF example]
---

The `document_qa` example returns a typed answer instead of text. It defines a `QAAnswer` with an answer, a confidence, and the indices of the sources it used, and makes the model produce exactly that.

```bash
cargo run -p example-document-qa
```

## The three moves

**1. Number the evidence.** `IndexedEvidenceFormatter` labels each retrieved passage `[Source 0]`, `[Source 1]`, … with its relevance score, so the model can cite them by index.

**2. Ask for JSON.** `StructuredQAPromptBuilder` puts the evidence and question into a prompt that spells out the JSON shape, including `source_indices`.

**3. Parse into a type.** `JsonResultParser::<QAAnswer>` deserializes the reply. The workflow's result type becomes `QAAnswer`, so `result.result.answer` and `result.result.confidence` are ordinary fields.

The example first indexes four short documents into `doc_qa_example`, so it runs against an empty Qdrant. `JsonResultParser` calls `serde_json::from_str` on the raw reply. If your model wraps JSON in a Markdown code fence or adds prose, write a parser that strips it — [Structured output](/docs/guides/structured-output/) shows one — or use a server that supports constrained JSON output.

## Full source

<details class="source-details">
<summary><code>examples/document_qa/src/main.rs</code> — the file as it is in the MagicAF repository at <code>9d00780</code></summary>

```rust
//! # Document Q&A Example
//!
//! Demonstrates a document-oriented question-answering system built on MagicAF.
//!
//! This example shows how to:
//!
//! * Implement custom [`EvidenceFormatter`] and [`PromptBuilder`] adapters
//! * Use [`JsonResultParser`] to extract structured answers from the LLM
//! * Build a multi-document Q&A pipeline
//!
//! ## Prerequisites
//!
//! Same local services as `minimal_rag`.

use async_trait::async_trait;
use magicaf_core::adapters::{EvidenceFormatter, JsonResultParser, PromptBuilder};
use magicaf_core::config::{EmbeddingConfig, LlmConfig, VectorStoreConfig};
use magicaf_core::embeddings::LocalEmbeddingService;
use magicaf_core::errors::Result as MagicResult;
use magicaf_core::rag::RAGWorkflow;
use magicaf_core::vector_store::SearchResult;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;
use serde::{Deserialize, Serialize};

// ── Domain result type ───────────────────────────────────────────────────

/// A structured Q&A answer the LLM should produce.
#[derive(Debug, Serialize, Deserialize)]
struct QAAnswer {
    answer: String,
    confidence: f32,
    source_indices: Vec<usize>,
}

// ── Custom adapters ──────────────────────────────────────────────────────

/// Formats evidence with source indices so the LLM can cite them.
struct IndexedEvidenceFormatter;

#[async_trait]
impl EvidenceFormatter for IndexedEvidenceFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> MagicResult<String> {
        let mut buf = String::new();
        for (i, r) in results.iter().enumerate() {
            let content = r
                .payload
                .get("content")
                .and_then(|v| v.as_str())
                .unwrap_or("[no content]");
            buf.push_str(&format!(
                "[Source {}] (score {:.3})\n{}\n\n",
                i, r.score, content
            ));
        }
        Ok(buf)
    }
}

/// Builds a prompt that requests structured JSON output.
struct StructuredQAPromptBuilder;

#[async_trait]
impl PromptBuilder for StructuredQAPromptBuilder {
    async fn build_prompt(&self, query: &str, evidence: &str) -> MagicResult<String> {
        Ok(format!(
            r#"You are a document Q&A assistant. Answer the question using ONLY the provided sources.

Return your answer as a JSON object with these fields:
- "answer": a concise answer string
- "confidence": a float 0.0–1.0 indicating how confident you are
- "source_indices": an array of source indices (integers) you relied on

Sources:
{evidence}

Question: {query}

JSON answer:"#,
        ))
    }
}

// ── Main ─────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter("info,magicaf=debug")
        .init();

    println!("=== MagicAF · Document Q&A Example ===\n");

    // Services
    let embedder = LocalEmbeddingService::new(EmbeddingConfig {
        base_url: env("EMBEDDING_URL", "http://localhost:8080"),
        model_name: env("EMBEDDING_MODEL", "bge-large-en-v1.5"),
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
    })?;

    let store = QdrantVectorStore::new(VectorStoreConfig {
        base_url: env("QDRANT_URL", "http://localhost:6333"),
        api_key: None,
        connect_timeout_secs: 5,
        request_timeout_secs: 30,
        health_check_timeout_secs: 5,
        retry: Default::default(),
        circuit_breaker: Default::default(),
        rate_limit: Default::default(),
        tls: Default::default(),
        connection_pool: Default::default(),
    })
    .await?;

    let llm = LocalLlmService::new(LlmConfig {
        base_url: env("LLM_URL", "http://localhost:8000/v1"),
        model_name: env("LLM_MODEL", "mistral-7b"),
        api_key: None,
        connect_timeout_secs: 5,
        request_timeout_secs: 120,
        health_check_timeout_secs: 5,
        retry: Default::default(),
        circuit_breaker: Default::default(),
        rate_limit: Default::default(),
        tls: Default::default(),
        connection_pool: Default::default(),
    })?;

    // Index a small corpus so the example has something to retrieve.
    // (The builder takes ownership of the services, so index first.)
    let collection = "doc_qa_example";
    let docs = [
        "MagicAF is a Rust framework for AI systems that run inside your own network.",
        "MagicAF services talk only to endpoints you configure: an embedding server, a vector store, and an LLM server.",
        "A RAG workflow embeds the question, retrieves similar passages, and asks the LLM to answer from them.",
        "MagicAF can be built and deployed on networks with no internet access by vendoring its dependencies.",
    ];
    {
        use magicaf_core::embeddings::EmbeddingService;
        use magicaf_core::vector_store::VectorStore;
        store.ensure_collection(collection, 1024).await?;
        let texts: Vec<String> = docs.iter().map(|d| d.to_string()).collect();
        let vectors = embedder.embed(&texts).await?;
        let payloads = docs
            .iter()
            .map(|d| serde_json::json!({ "content": d }))
            .collect();
        store.index(collection, vectors, payloads).await?;
        println!("Indexed {} documents into '{collection}'\n", docs.len());
    }

    // Build workflow with custom adapters and a JSON result parser.
    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)
        .vector_store(store)
        .llm_service(llm)
        .evidence_formatter(IndexedEvidenceFormatter)
        .prompt_builder(StructuredQAPromptBuilder)
        .result_parser(JsonResultParser::<QAAnswer>::new())
        .collection(collection)
        .top_k(5)
        .min_score(0.5)
        .build()?;

    let result = workflow.run("What is MagicAF?", None).await?;

    println!("Answer:      {}", result.result.answer);
    println!("Confidence:  {:.0}%", result.result.confidence * 100.0);
    println!("Sources:     {:?}", result.result.source_indices);
    println!("Evidence:    {} items", result.evidence_count);

    Ok(())
}

fn env(key: &str, default: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| default.into())
}
```

</details>

