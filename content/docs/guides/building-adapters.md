---
title: "Building Custom Adapters"
description: "Implement domain-specific logic by creating custom EvidenceFormatter, PromptBuilder, and ResultParser traits."
weight: 1
---

Adapters are how your domain logic plugs into the MagicAF RAG pipeline. You implement three traits — each one controls a different stage of the pipeline — without modifying any framework code.

## What You Need to Implement

| Trait | Pipeline Step | Responsibility |
|-------|--------------|----------------|
| `EvidenceFormatter` | After vector search | Turn search results into an LLM-ready text block |
| `PromptBuilder` | Before LLM call | Assemble the final prompt from query + evidence |
| `ResultParser<T>` | After LLM call | Parse the LLM's raw text into your domain type `T` |

You can mix custom and default implementations — use defaults for rapid prototyping, then replace them one at a time.

## Step 1 — Define Your Domain Result Type

Start by defining the output type your pipeline should produce:

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub summary: String,
    pub key_findings: Vec<String>,
    pub confidence: f32,
}
```

## Step 2 — Implement `EvidenceFormatter`

The evidence formatter controls what context the LLM sees. This is where you can filter, re-rank, annotate, or restructure the raw search results.

```rust
use async_trait::async_trait;
use magicaf_core::adapters::EvidenceFormatter;
use magicaf_core::errors::Result;
use magicaf_core::vector_store::SearchResult;

pub struct CustomEvidenceFormatter;

#[async_trait]
impl EvidenceFormatter for CustomEvidenceFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> Result<String> {
        let mut buf = String::new();

        for (i, r) in results.iter().enumerate() {
            let source = r.payload.get("source")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown");
            let content = r.payload.get("content")
                .and_then(|v| v.as_str())
                .unwrap_or("");

            buf.push_str(&format!(
                "Document {} [source: {}, relevance: {:.2}]\n{}\n\n",
                i + 1, source, r.score, content
            ));
        }

        Ok(buf)
    }
}
```

> **Tip:** The evidence formatter is the best place to implement re-ranking, deduplication, or relevance filtering before the content reaches the LLM.

## Step 3 — Implement `PromptBuilder`

The prompt builder is your primary prompt engineering surface. Control system instructions, output format directives, and few-shot examples here.

```rust
use async_trait::async_trait;
use magicaf_core::adapters::PromptBuilder;
use magicaf_core::errors::Result;

pub struct CustomPromptBuilder;

#[async_trait]
impl PromptBuilder for CustomPromptBuilder {
    async fn build_prompt(&self, query: &str, evidence: &str) -> Result<String> {
        Ok(format!(
            r#"Analyze the following documents and produce a structured analysis
in JSON format with fields: summary, key_findings (array), confidence (0.0–1.0).

Documents:
{evidence}

Analysis request: {query}

Respond ONLY with valid JSON."#
        ))
    }
}
```

## Step 4 — Implement `ResultParser<T>`

The result parser converts the LLM's raw text output into your strongly-typed domain struct.

```rust
use async_trait::async_trait;
use magicaf_core::adapters::ResultParser;
use magicaf_core::errors::{MagicError, Result};

pub struct CustomResultParser;

#[async_trait]
impl ResultParser<AnalysisResult> for CustomResultParser {
    async fn parse_result(&self, raw_output: &str) -> Result<AnalysisResult> {
        // LLMs sometimes wrap JSON in markdown code fences
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
            MagicError::SerializationError {
                message: format!("Failed to parse result: {e}"),
                source: Some(Box::new(e)),
            }
        })
    }
}
```

## Step 5 — Wire It Up

Plug your adapters into the `RAGWorkflow` builder:

```rust
use magicaf_core::rag::RAGWorkflow;

let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)
    .vector_store(store)
    .llm_service(llm)
    .evidence_formatter(CustomEvidenceFormatter)
    .prompt_builder(CustomPromptBuilder)
    .result_parser(CustomResultParser)
    .collection("my_documents")
    .top_k(10)
    .build()?;

let result = workflow.run("What are the key trends?", None).await?;
println!("Summary: {}", result.result.summary);
println!("Confidence: {:.0}%", result.result.confidence * 100.0);
```

## Best Practices

- **Keep adapters stateless** where possible — they're easier to test and share across workflows.
- **Use `JsonResultParser<T>`** for quick prototyping when your LLM reliably outputs JSON.
- **Implement multiple prompt builders** to A/B test different prompt strategies.
- **Filter in `EvidenceFormatter`** — re-rank, deduplicate, or drop irrelevant results before they consume context window tokens.
- **Log inside adapters** using `tracing::info!` / `debug!` to maintain full observability through the pipeline.
- **Handle malformed LLM output** gracefully in your `ResultParser` — LLMs occasionally produce invalid JSON or wrap it in explanation text.
