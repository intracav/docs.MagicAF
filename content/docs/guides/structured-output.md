---
title: "Structured Output"
description: "Get typed JSON responses from the LLM using JsonResultParser<T> or custom parsers."
weight: 2
---

MagicAF makes it straightforward to get structured, typed responses from your RAG pipeline. Instead of working with raw text, define a struct and let the framework deserialize it automatically.

## Using `JsonResultParser<T>`

The fastest way to get structured output: define a struct that derives `Deserialize`, then use `JsonResultParser`.

### 1. Define your result type

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct QAAnswer {
    pub answer: String,
    pub confidence: f32,
    pub sources: Vec<usize>,
}
```

### 2. Tell the LLM to output JSON

Use a `PromptBuilder` that instructs the LLM to respond in your expected format:

```rust
use async_trait::async_trait;
use magicaf_core::adapters::PromptBuilder;
use magicaf_core::errors::Result;

pub struct JsonPromptBuilder;

#[async_trait]
impl PromptBuilder for JsonPromptBuilder {
    async fn build_prompt(&self, query: &str, evidence: &str) -> Result<String> {
        Ok(format!(
            r#"Answer the question using ONLY the provided sources.

Return a JSON object with these exact fields:
- "answer": a concise answer string
- "confidence": a float from 0.0 to 1.0
- "sources": an array of source index integers you relied on

Sources:
{evidence}

Question: {query}

JSON:"#
        ))
    }
}
```

### 3. Wire it up

```rust
use magicaf_core::adapters::JsonResultParser;

let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)
    .vector_store(store)
    .llm_service(llm)
    .evidence_formatter(DefaultEvidenceFormatter)
    .prompt_builder(JsonPromptBuilder)
    .result_parser(JsonResultParser::<QAAnswer>::new())
    .collection("docs")
    .top_k(5)
    .build()?;

let result = workflow.run("What does MagicAF do?", None).await?;

// result.result is a fully typed QAAnswer
println!("Answer: {}", result.result.answer);
println!("Confidence: {:.0}%", result.result.confidence * 100.0);
println!("Sources: {:?}", result.result.sources);
```

## Handling Malformed Output

LLMs sometimes wrap JSON in explanation text or markdown code fences. If you encounter parsing errors, write a custom `ResultParser` that extracts the JSON first:

```rust
use async_trait::async_trait;
use magicaf_core::adapters::ResultParser;
use magicaf_core::errors::{MagicError, Result};

pub struct RobustJsonParser<T> {
    _phantom: std::marker::PhantomData<T>,
}

impl<T> RobustJsonParser<T> {
    pub fn new() -> Self {
        Self { _phantom: std::marker::PhantomData }
    }
}

#[async_trait]
impl<T> ResultParser<T> for RobustJsonParser<T>
where
    T: serde::de::DeserializeOwned + Send + Sync,
{
    async fn parse_result(&self, raw_output: &str) -> Result<T> {
        let trimmed = raw_output.trim();

        // Try to extract JSON object from the output
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
                message: format!("JSON parse failed: {e}\nRaw output: {raw_output}"),
                source: Some(Box::new(e)),
            }
        })
    }
}
```

## Nested and Complex Types

Your result type can be as complex as needed:

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct DetailedAnalysis {
    pub summary: String,
    pub sections: Vec<Section>,
    pub metadata: AnalysisMetadata,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Section {
    pub title: String,
    pub content: String,
    pub relevance: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisMetadata {
    pub total_sources: usize,
    pub confidence: f32,
    pub gaps: Vec<String>,
}
```

As long as the struct derives `Deserialize` and the LLM produces matching JSON, `JsonResultParser` handles everything.

## Tips for Reliable JSON Output

1. **Be explicit in your prompt** — list every field name and its type
2. **Include "Respond ONLY with valid JSON"** — reduces LLM chattiness
3. **Set `temperature` low** (0.1–0.3) for consistent formatting
4. **Use stop sequences** like `\n\n` to prevent trailing explanation
5. **Test with your model** — different models have varying JSON reliability
