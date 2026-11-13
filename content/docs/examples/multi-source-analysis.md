---
title: "Multi-Source Analysis"
description: "All three adapters customized: evidence annotated with source, date, and handling label; an analyst prompt; and a ResultParser that produces a structured summary with confidence and gaps."
weight: 3
difficulty: advanced
keywords: [multi-source analysis, custom adapters, ResultParser, analytical workflow, MagicAF example]
---

The `intelligence_analysis` example shows a workflow where every adapter is domain-specific. It is deliberately neutral — no real intelligence data or doctrine — and the same shape fits audit review, incident analysis, or literature synthesis.

```bash
cargo run -p example-intelligence-analysis
```

## The adapters

| Adapter | What it does |
|---|---|
| `IntelEvidenceFormatter` | Renders each passage as a report with its `source`, `date`, handling label (`classification`), and relevance score, read from the payload with sensible fallbacks |
| `IntelPromptBuilder` | Asks for an analysis in a fixed JSON shape |
| `IntelResultParser` | Implements `ResultParser<IntelSummary>` by hand: key findings, a confidence assessment, information gaps, and recommended next steps |

It also sets a `GenerationConfig` — temperature 0.2, up to 4,096 output tokens, and an analyst system prompt — and allows the LLM 180 seconds for the longer analysis.

The example indexes three short synthetic reports from different sources into one collection, `intel_reports`, then asks for an analysis across them. To cross-reference genuinely separate sources, index them into the same collection with distinguishing `source` payloads, or run one workflow per collection and merge the results in your own code.

## Full source

<details class="source-details">
<summary><code>examples/intelligence_analysis/src/main.rs</code> — the file as it is in the MagicAF repository at <code>9d00780</code></summary>

```rust
//! # Intelligence Analysis Example
//!
//! Demonstrates a multi-source intelligence analysis pipeline:
//!
//! * Ingest reports from multiple sources into separate collections
//! * Cross-reference findings using RAG
//! * Produce a structured intelligence summary
//!
//! This is a **domain-neutral** example — no classified material or specific
//! intelligence domain logic is included.  It shows how MagicAF adapters can
//! be tailored for analytical workflows.
//!
//! ## Prerequisites
//!
//! Same local services as `minimal_rag`.

use async_trait::async_trait;
use magicaf_core::adapters::{EvidenceFormatter, PromptBuilder, ResultParser};
use magicaf_core::config::{EmbeddingConfig, GenerationConfig, LlmConfig, VectorStoreConfig};
use magicaf_core::embeddings::LocalEmbeddingService;
use magicaf_core::errors::Result as MagicResult;
use magicaf_core::rag::RAGWorkflow;
use magicaf_core::vector_store::SearchResult;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;
use serde::{Deserialize, Serialize};

// ── Domain types ─────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Deserialize)]
struct IntelSummary {
    key_findings: Vec<String>,
    confidence_assessment: String,
    information_gaps: Vec<String>,
    recommended_actions: Vec<String>,
}

// ── Custom adapters ──────────────────────────────────────────────────────

struct IntelEvidenceFormatter;

#[async_trait]
impl EvidenceFormatter for IntelEvidenceFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> MagicResult<String> {
        let mut buf = String::from("## Collected Intelligence Reports\n\n");
        for (i, r) in results.iter().enumerate() {
            let source = r
                .payload
                .get("source")
                .and_then(|v| v.as_str())
                .unwrap_or("UNKNOWN");
            let date = r
                .payload
                .get("date")
                .and_then(|v| v.as_str())
                .unwrap_or("N/A");
            let content = r
                .payload
                .get("content")
                .and_then(|v| v.as_str())
                .unwrap_or("");
            let classification = r
                .payload
                .get("classification")
                .and_then(|v| v.as_str())
                .unwrap_or("UNCLASSIFIED");

            buf.push_str(&format!(
                "### Report {idx} [{classification}]\n\
                 Source: {source} | Date: {date} | Relevance: {score:.3}\n\
                 {content}\n\n",
                idx = i + 1,
                score = r.score,
            ));
        }
        Ok(buf)
    }
}

struct IntelPromptBuilder;

#[async_trait]
impl PromptBuilder for IntelPromptBuilder {
    async fn build_prompt(&self, query: &str, evidence: &str) -> MagicResult<String> {
        Ok(format!(
            r#"You are an intelligence analyst. Given the following reports, produce a
structured analysis in JSON format with these fields:

- "key_findings": array of strings — the most important findings
- "confidence_assessment": string — HIGH / MODERATE / LOW with brief justification
- "information_gaps": array of strings — what information is missing
- "recommended_actions": array of strings — suggested next steps

{evidence}

Analytical question: {query}

Respond ONLY with valid JSON."#,
        ))
    }
}

struct IntelResultParser;

#[async_trait]
impl ResultParser<IntelSummary> for IntelResultParser {
    async fn parse_result(&self, raw_output: &str) -> MagicResult<IntelSummary> {
        // Try to extract JSON from the raw output (LLMs sometimes wrap it).
        let trimmed = raw_output.trim();
        let json_str = if let Some(start) = trimmed.find('{') {
            if let Some(end) = trimmed.rfind('}') {
                &trimmed[start..=end]
            } else {
                trimmed
            }
        } else {
            trimmed
        };

        serde_json::from_str(json_str).map_err(|e| {
            magicaf_core::errors::MagicError::SerializationError {
                message: format!("Failed to parse intelligence summary: {e}\nRaw: {raw_output}"),
                source: Some(Box::new(e)),
            }
        })
    }
}

// ── Main ─────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter("info,magicaf=debug")
        .init();

    println!("=== MagicAF · Intelligence Analysis Example ===\n");

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
        request_timeout_secs: 180,
        health_check_timeout_secs: 5,
        retry: Default::default(),
        circuit_breaker: Default::default(),
        rate_limit: Default::default(),
        tls: Default::default(),
        connection_pool: Default::default(),
    })?;

    // Index a few synthetic reports from different sources so the analysis has
    // something to cross-reference. (The builder takes ownership of the
    // services, so index first.)
    let collection = "intel_reports";
    let reports = [
        ("field-team-a", "2026-03-02", "UNCLASSIFIED", "Field team A observed increased truck traffic at the north depot over three consecutive nights."),
        ("technical-assessment", "2026-03-04", "UNCLASSIFIED", "Technical assessment: the north depot's loading bays were resurfaced last month, consistent with heavier vehicles."),
        ("open-source-monitoring", "2026-03-05", "UNCLASSIFIED", "Local news reports a new logistics contract awarded for the north depot region, starting in March."),
    ];
    {
        use magicaf_core::embeddings::EmbeddingService;
        use magicaf_core::vector_store::VectorStore;
        store.ensure_collection(collection, 1024).await?;
        let texts: Vec<String> = reports.iter().map(|r| r.3.to_string()).collect();
        let vectors = embedder.embed(&texts).await?;
        let payloads = reports
            .iter()
            .map(|(source, date, classification, content)| {
                serde_json::json!({
                    "source": source,
                    "date": date,
                    "classification": classification,
                    "content": content,
                })
            })
            .collect();
        store.index(collection, vectors, payloads).await?;
        println!("Indexed {} reports into '{collection}'\n", reports.len());
    }

    // Build the workflow with intelligence-specific adapters.
    let gen_config = GenerationConfig {
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 4096,
        system_prompt: Some(
            "You are a precise intelligence analyst. Follow instructions exactly.".into(),
        ),
        ..Default::default()
    };

    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)
        .vector_store(store)
        .llm_service(llm)
        .evidence_formatter(IntelEvidenceFormatter)
        .prompt_builder(IntelPromptBuilder)
        .result_parser(IntelResultParser)
        .collection(collection)
        .top_k(15)
        .min_score(0.4)
        .generation_config(gen_config)
        .build()?;

    let result = workflow
        .run(
            "What are the key technology trends observed across all sources?",
            None,
        )
        .await?;

    println!("── Intelligence Summary ─────────────────────");
    println!("Key Findings:");
    for (i, f) in result.result.key_findings.iter().enumerate() {
        println!("  {}. {f}", i + 1);
    }
    println!("\nConfidence: {}", result.result.confidence_assessment);
    println!("\nInformation Gaps:");
    for gap in &result.result.information_gaps {
        println!("  • {gap}");
    }
    println!("\nRecommended Actions:");
    for action in &result.result.recommended_actions {
        println!("  → {action}");
    }
    println!("─────────────────────────────────────────────");

    Ok(())
}

fn env(key: &str, default: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| default.into())
}
```

</details>

