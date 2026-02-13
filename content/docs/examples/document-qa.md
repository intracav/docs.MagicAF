---
title: "Document Q&A"
description: "Structured question-answering with custom adapters and JSON output parsing."
weight: 2
---

This example builds a document Q&A system with custom adapters that produce structured JSON answers.

**Difficulty:** ★★☆ Intermediate
**Custom adapters:** `EvidenceFormatter`, `PromptBuilder`
**Output type:** `QAAnswer` (JSON struct)

## What This Example Does

1. Implements a custom `EvidenceFormatter` that includes source indices
2. Implements a custom `PromptBuilder` that requests JSON output
3. Uses `JsonResultParser<QAAnswer>` to get typed results

## Domain Result Type

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct QAAnswer {
    answer: String,
    confidence: f32,
    source_indices: Vec<usize>,
}
```

## Custom Evidence Formatter

Formats results with source indices so the LLM can cite them:

```rust
use async_trait::async_trait;
use magicaf_core::adapters::EvidenceFormatter;
use magicaf_core::errors::Result as MagicResult;
use magicaf_core::vector_store::SearchResult;

struct IndexedEvidenceFormatter;

#[async_trait]
impl EvidenceFormatter for IndexedEvidenceFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> MagicResult<String> {
        let mut buf = String::new();
        for (i, r) in results.iter().enumerate() {
            let content = r.payload.get("content")
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
```

## Custom Prompt Builder

Requests structured JSON output with specific fields:

```rust
use async_trait::async_trait;
use magicaf_core::adapters::PromptBuilder;
use magicaf_core::errors::Result as MagicResult;

struct StructuredQAPromptBuilder;

#[async_trait]
impl PromptBuilder for StructuredQAPromptBuilder {
    async fn build_prompt(&self, query: &str, evidence: &str) -> MagicResult<String> {
        Ok(format!(
            r#"You are a document Q&A assistant. Answer the question using
ONLY the provided sources.

Return your answer as a JSON object with these fields:
- "answer": a concise answer string
- "confidence": a float 0.0–1.0 indicating confidence
- "source_indices": an array of source indices you relied on

Sources:
{evidence}

Question: {query}

JSON answer:"#,
        ))
    }
}
```

## Wiring It Together

```rust
use magicaf_core::adapters::JsonResultParser;
use magicaf_core::rag::RAGWorkflow;

let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)
    .vector_store(store)
    .llm_service(llm)
    .evidence_formatter(IndexedEvidenceFormatter)
    .prompt_builder(StructuredQAPromptBuilder)
    .result_parser(JsonResultParser::<QAAnswer>::new())
    .collection("doc_qa_example")
    .top_k(5)
    .min_score(0.5)
    .build()?;

let result = workflow.run("What is MagicAF?", None).await?;

println!("Answer:     {}", result.result.answer);
println!("Confidence: {:.0}%", result.result.confidence * 100.0);
println!("Sources:    {:?}", result.result.source_indices);
println!("Evidence:   {} items", result.evidence_count);
```

## Key Points

- **`IndexedEvidenceFormatter`** — adds `[Source N]` labels so the LLM can reference them
- **`StructuredQAPromptBuilder`** — specifies the exact JSON schema in the prompt
- **`JsonResultParser::<QAAnswer>::new()`** — deserializes the LLM output directly into `QAAnswer`
- **`min_score(0.5)`** — filters out low-relevance results before they enter the prompt

## Running

```bash
cargo run -p example-document-qa
```

## Next Steps

→ [Multi-Source Analysis](/docs/examples/multi-source-analysis/) — all three custom adapters with complex output
