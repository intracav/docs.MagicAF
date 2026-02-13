---
title: "RAG Pipeline - Secure Retrieval-Augmented Generation"
description: "How MagicAF's six-step Retrieval-Augmented Generation pipeline works in defense-grade, HIPAA-compliant, airgapped environments. Secure RAG for SIPR/NIPR, secret, and classified systems."
weight: 2
keywords: "secure rag pipeline, defense-grade rag, hipaa-compliant rag, airgapped rag, secure retrieval augmented generation, sipr rag, nipr rag, secret rag, classified rag"
---

The `RAGWorkflow` engine executes a deterministic six-step pipeline every time you call `.run()`. Each step is handled by a pluggable component, all running securely in **airgapped, on-premises environments** perfect for **defense-grade, HIPAA-compliant, SIPR/NIPR, secret, and classified deployments**. MagicAF's RAG pipeline goes beyond simple LLM queries — it provides comprehensive **NLP analysis, semantic search, and knowledge retrieval** capabilities.

## Pipeline Overview

```
Query → [Embed] → [Search] → [Format] → [Build Prompt] → [LLM] → [Parse] → Result<T>
```

## Step-by-Step Breakdown

### Step 1 — Embed the Query

```rust
let query_vector = embedding_service.embed_single(query).await?;
```

The user's question is converted into a dense vector using the configured `EmbeddingService`. This vector represents the semantic meaning of the query.

### Step 2 — Search the Vector Store

```rust
let results = vector_store.search(collection, query_vector, top_k, filter).await?;
```

The query vector is used to find the `top_k` most similar documents in the vector store. Results include a similarity score and the original JSON payload.

If `min_score` is configured, results below the threshold are filtered out.

### Step 3 — Format Evidence

```rust
let evidence = evidence_formatter.format_evidence(&results).await?;
```

The `EvidenceFormatter` converts raw search results into a text block that the LLM can reason over. This is where you can:

- **Filter** irrelevant results
- **Re-rank** by domain-specific criteria
- **Annotate** with source metadata
- **Deduplicate** overlapping content

### Step 4 — Build the Prompt

```rust
let prompt = prompt_builder.build_prompt(query, &evidence).await?;
```

The `PromptBuilder` assembles the final prompt from the user query and formatted evidence. This is where prompt engineering lives:

- System instructions
- Output format directives (JSON schema, etc.)
- Few-shot examples
- Domain-specific context

### Step 5 — Invoke the LLM

```rust
let chat_response = llm_service.chat(chat_request).await?;
```

The assembled prompt is sent to the LLM as an OpenAI-compatible chat completion request. Generation parameters (temperature, top_p, max_tokens, stop sequences) are controlled via `GenerationConfig`.

### Step 6 — Parse the Result

```rust
let result = result_parser.parse_result(&raw_llm_output).await?;
```

The `ResultParser` converts the raw LLM text into your domain type `T`. Options include:

- `RawResultParser` → returns `String`
- `JsonResultParser<T>` → deserializes JSON
- **Custom parser** → regex extraction, validation, multi-field parsing

## Return Type

Every pipeline execution returns a `RAGResult<T>`:

```rust
pub struct RAGResult<T> {
    /// The domain-typed result produced by the ResultParser.
    pub result: T,

    /// Number of evidence items retrieved from the vector store.
    pub evidence_count: usize,

    /// The raw text returned by the LLM (before parsing).
    pub raw_llm_output: String,

    /// Token usage reported by the LLM, if available.
    pub usage: Option<Usage>,
}
```

This gives you both the parsed result and full observability metadata.

## Configuration

The pipeline is configured through the builder:

```rust
let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)       // Required
    .vector_store(store)               // Required
    .llm_service(llm)                  // Required
    .evidence_formatter(my_formatter)  // Required
    .prompt_builder(my_prompt)         // Required
    .result_parser(my_parser)          // Required
    .collection("my_collection")       // Required — vector store collection name
    .top_k(10)                         // Optional — default: 10
    .min_score(0.5)                    // Optional — minimum similarity threshold
    .generation_config(gen_config)     // Optional — LLM generation parameters
    .build()?;
```

## Filters

Pass backend-specific filters to narrow the vector search:

```rust
let filter = serde_json::json!({
    "must": [{
        "key": "category",
        "match": { "value": "technical" }
    }]
});

let result = workflow.run("What is MagicAF?", Some(filter)).await?;
```

Filter format depends on your vector store backend (e.g., Qdrant filter syntax).

## Error Handling

Every pipeline step returns `Result<T, MagicError>`. If any step fails, the pipeline short-circuits with the appropriate error variant:

| Step | Error Variant |
|------|--------------|
| Embed | `MagicError::EmbeddingError` or `MagicError::HttpError` |
| Search | `MagicError::VectorStoreError` or `MagicError::HttpError` |
| Format | `MagicError::AdapterError` |
| Build prompt | `MagicError::AdapterError` |
| LLM call | `MagicError::LlmError` or `MagicError::HttpError` |
| Parse result | `MagicError::SerializationError` or `MagicError::AdapterError` |
