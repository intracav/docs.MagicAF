---
title: "Multi-Source Analysis"
description: "Cross-reference multiple sources with fully custom adapters and complex structured output."
weight: 3
tags: [example, analysis, advanced, custom-adapters, generation-config]
categories: [example]
difficulty: advanced
prerequisites: [/docs/examples/document-qa/]
estimated_reading_time: "10 min"
last_reviewed: "2026-02-12"
---

Imagine you are an analyst at a research lab. Reports arrive from three different sources — field observations, technical assessments, and open-source monitoring. Each has a different format, classification level, and reliability. Your job is to cross-reference them and produce a structured summary: key findings, confidence assessment, information gaps, and recommended next steps.

This is exactly the kind of task RAG excels at — the LLM reasons over retrieved evidence rather than generating from memory. But raw default adapters are not enough: you need domain-specific evidence formatting, a carefully structured prompt, and a parser that can handle complex nested output.

This example demonstrates a multi-source analysis pipeline with custom implementations of all three adapter traits and a complex output schema.

**Difficulty:** ★★★ Advanced
**Custom adapters:** `EvidenceFormatter`, `PromptBuilder`, `ResultParser`
**Output type:** `IntelSummary` (complex nested JSON)

## What This Example Does

1. Implements all three adapter traits with domain-specific logic
2. Uses a complex nested output type
3. Configures custom `GenerationConfig` for analytical precision
4. Handles potentially malformed LLM output gracefully

## Domain Result Type

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct IntelSummary {
    key_findings: Vec<String>,
    confidence_assessment: String,
    information_gaps: Vec<String>,
    recommended_actions: Vec<String>,
}
```

## Custom Evidence Formatter

Formats evidence with source metadata, dates, and classification levels:

```rust
use async_trait::async_trait;
use magicaf_core::adapters::EvidenceFormatter;
use magicaf_core::errors::Result as MagicResult;
use magicaf_core::vector_store::SearchResult;

struct IntelEvidenceFormatter;

#[async_trait]
impl EvidenceFormatter for IntelEvidenceFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> MagicResult<String> {
        let mut buf = String::from("## Collected Reports\n\n");
        for (i, r) in results.iter().enumerate() {
            let source = r.payload.get("source")
                .and_then(|v| v.as_str()).unwrap_or("UNKNOWN");
            let date = r.payload.get("date")
                .and_then(|v| v.as_str()).unwrap_or("N/A");
            let content = r.payload.get("content")
                .and_then(|v| v.as_str()).unwrap_or("");
            let classification = r.payload.get("classification")
                .and_then(|v| v.as_str()).unwrap_or("UNCLASSIFIED");

            buf.push_str(&format!(
                "### Report {} [{}]\n\
                 Source: {} | Date: {} | Relevance: {:.3}\n\
                 {}\n\n",
                i + 1, classification, source, date, r.score, content
            ));
        }
        Ok(buf)
    }
}
```

## Custom Prompt Builder

Requests a multi-field analytical summary:

```rust
struct IntelPromptBuilder;

#[async_trait]
impl PromptBuilder for IntelPromptBuilder {
    async fn build_prompt(&self, query: &str, evidence: &str) -> MagicResult<String> {
        Ok(format!(
            r#"You are an analyst. Given the following reports, produce a
structured analysis in JSON format with these fields:

- "key_findings": array of strings — the most important findings
- "confidence_assessment": string — HIGH / MODERATE / LOW with justification
- "information_gaps": array of strings — what is missing
- "recommended_actions": array of strings — suggested next steps

{evidence}

Analytical question: {query}

Respond ONLY with valid JSON."#,
        ))
    }
}
```

## Custom Result Parser

Handles LLMs that wrap JSON in explanation text:

```rust
use magicaf_core::adapters::ResultParser;
use magicaf_core::errors::MagicError;

struct IntelResultParser;

#[async_trait]
impl ResultParser<IntelSummary> for IntelResultParser {
    async fn parse_result(&self, raw_output: &str) -> MagicResult<IntelSummary> {
        let trimmed = raw_output.trim();

        // Extract JSON even if wrapped in markdown or explanation
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
                message: format!("Parse failed: {e}\nRaw: {raw_output}"),
                source: Some(Box::new(e)),
            }
        })
    }
}
```

## Wiring It Together

```rust
use magicaf_core::config::GenerationConfig;
use magicaf_core::rag::RAGWorkflow;

let gen_config = GenerationConfig {
    temperature: 0.2,
    top_p: 0.9,
    max_tokens: 4096,
    system_prompt: Some(
        "You are a precise analyst. Follow instructions exactly.".into(),
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
    .collection("reports")
    .top_k(15)
    .min_score(0.4)
    .generation_config(gen_config)
    .build()?;

let result = workflow.run(
    "What are the key technology trends across all sources?",
    None,
).await?;

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
```

## Key Points

- **All three adapters custom** — full control over every pipeline stage
- **`GenerationConfig`** — lower temperature (0.2) for consistent analytical output
- **`top_k(15)`** — higher retrieval count for comprehensive analysis
- **`min_score(0.4)`** — lower threshold to cast a wider net
- **Robust JSON extraction** — handles LLMs that wrap JSON in markdown or explanation
- **`max_tokens: 4096`** — more room for detailed analysis

## Running

```bash
cargo run -p example-intelligence-analysis
```
