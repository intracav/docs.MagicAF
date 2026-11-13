---
title: "The RAG Pipeline"
description: "What RAGWorkflow does between your question and your typed result — every stage, its defaults, how filters and generation settings apply, and how each stage fails."
weight: 2
keywords: [RAG pipeline, retrieval-augmented generation, RAGWorkflow, Rust RAG, local RAG]
tags: [rag, pipeline, retrieval, generation]
categories: [concept]
difficulty: intermediate
---

A language model answers from what it was trained on unless you give it something better. Retrieval-augmented generation gives it something better: before the model speaks, retrieve the passages that bear on the question, put them in front of it, and ask it to answer from them.

`RAGWorkflow` makes that a fixed, inspectable sequence. Every call to `run` executes the same stages in the same order, each stage is a trait you can replace, and every stage runs on services you host.

## The stages

Solid stages always run. Dashed stages run when you add them to the builder.

{{< rag-pipeline >}}

Before the embed, retrieve, and generate stages — each a network call — the workflow checks whether shutdown has been signaled and stops with `MagicError::Shutdown` if so.

## Each stage in detail

**Guard.** A `PromptGuard` scans the question for prompt-injection patterns. Depending on its configuration it rejects the request with `PromptInjectionDetected` or passes on a sanitized copy; either way the decision is audited.

**Embed.** `EmbeddingService::embed_single` turns the question into a vector. It must use the same model that embedded your documents — vectors from different models are not comparable.

**Retrieve.** `VectorStore::search` returns the `top_k` nearest passages (default **10**), restricted by the optional filter you pass to `run`. If you set `min_score`, passages below it are dropped. An empty result is not an error: the model is called with an empty evidence block, and a well-written prompt tells it to say so.

**Rerank.** A `Reranker` reorders the passages — `CrossEncoderReranker` by a cross-encoder's score, `ScoreThresholdReranker` by filtering and sorting on the existing score. See [Reranking](/docs/api-reference/core/reranking/).

**Format.** Your `EvidenceFormatter` decides what the model sees of each passage: which payload fields, in what order, with what labels. This is the single biggest lever on answer quality and citation.

**Prompt.** Your `PromptBuilder` combines evidence and question into the user message.

**Generate.** The workflow sends a chat request: a system message if `GenerationConfig.system_prompt` is set, then the prompt as the user message, with the configured temperature (default 0.1), top-p (0.95), max tokens (2048), and stop sequences.

**Check.** A `ResponseGuard` validates the raw reply — size limits and, if configured, required structure — before anything parses it.

**Parse.** Your `ResultParser<T>` turns the reply into `T`.

**Audit.** If an `AuditLogger` is set, every run emits an event — on success and on every failure — with a hash of the query rather than its text, and the run's duration is recorded as `rag_pipeline_duration_seconds`.

## Two places for instructions

`DefaultPromptBuilder::new().with_system("…")` puts your instruction at the top of the **user** message, before the `<context>` block. `GenerationConfig { system_prompt: Some("…"), .. }` sends it as a separate **system** message. Most instruction-tuned models weight the system role more heavily; use it for rules the model must follow, and the prompt for task framing.

## What you get back

```rust
pub struct RAGResult<T> {
    pub result: T,                 // what your ResultParser produced
    pub evidence_count: usize,     // passages that reached the model
    pub raw_llm_output: String,    // the reply before parsing
    pub usage: Option<Usage>,      // token counts, if the server reported them
}
```

Keep `raw_llm_output` when a parse fails or an answer looks wrong: it shows exactly what the model said.

## Filters

The second argument to `run` is passed to the vector store as-is:

```rust
let filter = serde_json::json!({
    "must": [{ "key": "department", "match": { "value": "cardiology" } }]
});
let result = workflow.run("What is the escalation policy?", Some(filter)).await?;
```

With `QdrantVectorStore` this is [Qdrant filter syntax](https://qdrant.tech/documentation/concepts/filtering/). `InMemoryVectorStore` supports the common subset — `must`, `must_not`, and `should`, nested groups, and `match` conditions on a `value` or `any` list — and treats any condition shape it does not understand as not matching, so an unsupported filter can never widen a search to the whole collection. Use filters for access control as well as relevance: a passage the filter excludes never reaches the model.

## How it fails

Every stage returns `Result<_, MagicError>`, and the first failure ends the run. Nothing fails silently, and the variant tells you which stage broke.

| Stage | Typical errors |
|---|---|
| Any | `Shutdown` |
| Guard | `PromptInjectionDetected` |
| Embed | `EmbeddingError`, `HttpError`, `Timeout`, `CircuitOpen`, `RateLimitExceeded` |
| Retrieve | `VectorStoreError`, `HttpError`, `Timeout`, `CircuitOpen` |
| Rerank, format, prompt | `AdapterError` |
| Generate | `LlmError`, `HttpError`, `Throttled`, `Timeout`, `CircuitOpen` |
| Check | `ResponseTooLarge`, `ResponseSchemaViolation` |
| Parse | `SerializationError`, `AdapterError` |

Transient failures — timeouts, 429s, 5xx responses — are retried inside each service according to its `RetryConfig` before they surface here. `MagicError::is_retryable()` tells you whether retrying the whole run might help. The full list, with numeric codes, is in [Errors](/docs/api-reference/core/errors/).
