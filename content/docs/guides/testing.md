---
title: "Testing"
description: "Unit-test adapters on their own, and test whole workflows with in-memory fakes — no embedding server, vector database, or LLM required."
weight: 3
tags: [testing, fakes, unit-tests, integration-tests]
categories: [guide]
difficulty: intermediate
prerequisites: [/docs/guides/building-adapters/]
---

Everything in a MagicAF pipeline is a trait, so tests can replace the network-bound pieces with small fakes and still exercise your real adapters end to end. This guide covers both levels: unit tests for each adapter, and workflow tests that run the full pipeline in memory.

## Testing a Custom ResultParser

The simplest unit test — verify that your parser handles valid and invalid LLM output:

```rust
use magicaf_core::adapters::ResultParser;

#[tokio::test]
async fn parser_handles_valid_json() {
    let parser = CustomResultParser;
    let raw = r#"{"summary": "test", "key_findings": ["a"], "confidence": 0.9}"#;

    let result = parser.parse_result(raw).await.unwrap();
    assert_eq!(result.summary, "test");
    assert!((result.confidence - 0.9).abs() < f32::EPSILON);
}

#[tokio::test]
async fn parser_rejects_invalid_json() {
    let parser = CustomResultParser;
    let result = parser.parse_result("not json").await;
    assert!(result.is_err());
}
```

## Testing EvidenceFormatters

Test that your formatter produces the expected text from mock search results:

```rust
use magicaf_core::adapters::EvidenceFormatter;
use magicaf_core::vector_store::SearchResult;

#[tokio::test]
async fn formatter_includes_source_metadata() {
    let formatter = CustomEvidenceFormatter;
    let results = vec![
        SearchResult {
            id: "1".into(),
            score: 0.95,
            payload: serde_json::json!({
                "source": "doc_a",
                "content": "Test content"
            }),
        },
    ];

    let evidence = formatter.format_evidence(&results).await.unwrap();
    assert!(evidence.contains("doc_a"));
    assert!(evidence.contains("Test content"));
    assert!(evidence.contains("0.95"));
}
```

## Testing PromptBuilders

Verify your prompt contains the expected structure:

```rust
use magicaf_core::adapters::PromptBuilder;

#[tokio::test]
async fn prompt_contains_evidence_and_query() {
    let builder = CustomPromptBuilder;
    let prompt = builder.build_prompt("my question", "evidence text").await.unwrap();

    assert!(prompt.contains("my question"));
    assert!(prompt.contains("evidence text"));
    assert!(prompt.contains("JSON")); // Verify format instruction
}
```

## Fakes for whole-workflow tests

MagicAF's own mock services live in a test-only module of the MagicAF repository and are not exported, so write the two you need in your crate. They are short. Put them in `tests/support/mod.rs`:

```rust
use async_trait::async_trait;
use magicaf_core::embeddings::EmbeddingService;
use magicaf_core::errors::Result;
use magicaf_core::llm::{ChatChoice, ChatMessage, ChatRequest, ChatResponse, LlmService};
use magicaf_core::prelude::GenerationConfig;

/// Deterministic embeddings: the same text always maps to the same vector,
/// and texts sharing words land near each other. No model, no network.
pub struct FakeEmbedder {
    pub dim: usize,
}

impl FakeEmbedder {
    fn vector(&self, text: &str) -> Vec<f32> {
        let mut v = vec![0.0; self.dim];
        for word in text.to_lowercase().split_whitespace() {
            let h = word.bytes().fold(7u64, |h, b| h.wrapping_mul(31).wrapping_add(b as u64));
            v[(h as usize) % self.dim] += 1.0;
        }
        let norm = v.iter().map(|x| x * x).sum::<f32>().sqrt().max(1e-6);
        v.iter().map(|x| x / norm).collect()
    }
}

#[async_trait]
impl EmbeddingService for FakeEmbedder {
    async fn embed(&self, inputs: &[String]) -> Result<Vec<Vec<f32>>> {
        Ok(inputs.iter().map(|t| self.vector(t)).collect())
    }
    async fn embed_single(&self, input: &str) -> Result<Vec<f32>> {
        Ok(self.vector(input))
    }
    async fn health_check(&self) -> Result<()> {
        Ok(())
    }
}

/// Returns the same reply to every request.
pub struct CannedLlm(pub String);

#[async_trait]
impl LlmService for CannedLlm {
    async fn chat(&self, _request: ChatRequest) -> Result<ChatResponse> {
        Ok(ChatResponse {
            id: "test".into(),
            object: "chat.completion".into(),
            created: 0,
            model: "canned".into(),
            choices: vec![ChatChoice {
                index: 0,
                message: ChatMessage::assistant(self.0.clone()),
                finish_reason: Some("stop".into()),
            }],
            usage: None,
        })
    }
    async fn generate(&self, _prompt: &str, _config: GenerationConfig) -> Result<String> {
        Ok(self.0.clone())
    }
    async fn health_check(&self) -> Result<()> {
        Ok(())
    }
}
```

`FakeEmbedder` is deterministic and gives texts that share words similar vectors, so retrieval in tests behaves sensibly. For the vector store you need no fake at all: `InMemoryVectorStore` from `magicaf-core` is a real implementation that keeps everything in process.

## Testing a complete workflow

```rust
mod support;
use support::{CannedLlm, FakeEmbedder};

use magicaf_core::embeddings::EmbeddingService;
use magicaf_core::prelude::*;
use magicaf_core::vector_store::{InMemoryVectorStore, VectorStore};

#[derive(serde::Deserialize, Debug)]
struct Answer {
    answer: String,
    confidence: f32,
}

#[tokio::test]
async fn workflow_parses_structured_answer() {
    let embedder = FakeEmbedder { dim: 64 };
    let store = InMemoryVectorStore::new();
    store.ensure_collection("kb", 64).await.unwrap();

    let docs = ["Qdrant listens on port 6333.", "The embedding server listens on port 8080."];
    let texts: Vec<String> = docs.iter().map(|d| d.to_string()).collect();
    let vectors = embedder.embed(&texts).await.unwrap();
    let payloads = docs.iter().map(|d| serde_json::json!({ "content": d })).collect();
    store.index("kb", vectors, payloads).await.unwrap();

    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)
        .vector_store(store)
        .llm_service(CannedLlm(r#"{"answer": "6333", "confidence": 0.9}"#.into()))
        .evidence_formatter(DefaultEvidenceFormatter)
        .prompt_builder(DefaultPromptBuilder::new())
        .result_parser(JsonResultParser::<Answer>::new())
        .collection("kb")
        .top_k(1)
        .build()
        .unwrap();

    let result = workflow.run("Which port does Qdrant use?", None).await.unwrap();
    assert_eq!(result.result.answer, "6333");
    assert!(result.result.confidence > 0.5);
    assert_eq!(result.evidence_count, 1);
}
```

This test runs every stage — embed, retrieve, format, prompt, generate, parse — with your real adapters and no services. Swap in your own formatter, prompt builder, and parser to test them together.

## Testing against real services

Keep tests that need live services separate so the default `cargo test` stays hermetic. A common pattern is an environment-gated test:

```rust
#[tokio::test]
#[ignore = "needs the local services from Prerequisites"]
async fn answers_from_live_stack() {
    // build the workflow with LocalEmbeddingService, QdrantVectorStore, LocalLlmService
}
```

```bash
cargo test                        # hermetic tests only
cargo test -- --ignored           # also run the live-service tests
```
