---
title: "Testing"
description: "Unit test your adapters and workflows using mock services."
weight: 3
tags: [testing, mocks, unit-tests, integration-tests]
categories: [guide]
difficulty: intermediate
prerequisites: [/docs/guides/building-adapters/]
estimated_reading_time: "8 min"
last_reviewed: "2026-02-12"
---

MagicAF's trait-based design makes testing straightforward. You can test each adapter in isolation and test complete workflows using mock services — no live infrastructure required.

## Mock Services

The test crate provides mock implementations of all infrastructure traits:

```rust
use magicaf_tests::mocks::*;
```

| Mock | Trait | Behavior |
|------|-------|----------|
| `MockEmbeddingService` | `EmbeddingService` | Returns fixed-dimension zero vectors |
| `MockVectorStore` | `VectorStore` | Returns configurable search results |
| `MockLlmService` | `LlmService` | Returns a configurable text response |

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

## Testing a Complete Workflow

Use mock services to test the full pipeline without any live infrastructure:

```rust
use magicaf_core::rag::RAGWorkflow;

#[tokio::test]
async fn workflow_returns_valid_analysis() {
    // Configure mock LLM to return valid JSON
    let llm = MockLlmService::new(
        r#"{"summary":"test analysis","key_findings":["finding 1"],"confidence":0.85}"#,
    );

    let workflow = RAGWorkflow::builder()
        .embedding_service(MockEmbeddingService::new(1024))
        .vector_store(MockVectorStore::with_results(vec![/* mock results */]))
        .llm_service(llm)
        .evidence_formatter(CustomEvidenceFormatter)
        .prompt_builder(CustomPromptBuilder)
        .result_parser(CustomResultParser)
        .collection("test")
        .build()
        .unwrap();

    let result = workflow.run("test query", None).await.unwrap();
    assert_eq!(result.result.summary, "test analysis");
    assert_eq!(result.evidence_count, 0);
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

## Using `InMemoryVectorStore` for Integration Tests

For integration tests that need a real vector store but no external services:

```rust
use magicaf_core::vector_store::{InMemoryVectorStore, VectorStore};

#[tokio::test]
async fn integration_test_with_in_memory_store() {
    let store = InMemoryVectorStore::new();
    store.ensure_collection("test", 3).await.unwrap();

    store.index(
        "test",
        vec![vec![1.0, 0.0, 0.0], vec![0.0, 1.0, 0.0]],
        vec![
            serde_json::json!({"content": "first doc"}),
            serde_json::json!({"content": "second doc"}),
        ],
    ).await.unwrap();

    let results = store.search("test", vec![0.9, 0.1, 0.0], 1, None).await.unwrap();
    assert_eq!(results.len(), 1);
    assert_eq!(results[0].payload["content"], "first doc");
}
```

## Running Tests

```bash
# Unit + integration tests (no live services required)
cargo test -p magicaf-tests

# All workspace tests
cargo test --workspace
```
