---
title: "Tutorial: Your First RAG Pipeline"
description: "Build a working Retrieval-Augmented Generation pipeline from scratch and understand what each component does."
weight: 1
tags: [tutorial, rag, pipeline, beginner, embeddings, vector-search, llm]
categories: [tutorial]
difficulty: beginner
prerequisites:
  - /docs/getting-started/installation/
estimated_reading_time: "20 min"
last_reviewed: "2026-02-12"
---

{{< difficulty "beginner" >}}

{{< prerequisites >}}
- You have completed the [Installation](/docs/getting-started/installation/) guide
- Local services are running (Qdrant, embedding server, LLM server) — see [Prerequisites](/docs/getting-started/prerequisites/)
- You have a Rust project with MagicAF crates added to `Cargo.toml`
{{< /prerequisites >}}

## What You Will Build

By the end of this tutorial, you will have a working RAG pipeline that:

1. Converts documents into vector embeddings
2. Stores them in a searchable vector database
3. Accepts a natural-language question
4. Retrieves the most relevant documents
5. Sends them to an LLM to generate a grounded answer

More importantly, you will understand **what each piece does and why it exists** — so you can confidently modify the pipeline for your own use case.

## The Big Picture

Retrieval-Augmented Generation (RAG) solves a fundamental problem: LLMs are powerful text generators, but they hallucinate when asked about information they were not trained on. RAG fixes this by **retrieving relevant documents first**, then asking the LLM to answer **using only those documents**.

Here is the flow:

```
Your Question
     ↓
[1. Embed] → Convert question to a vector
     ↓
[2. Search] → Find similar documents in the vector store
     ↓
[3. Format] → Arrange the documents into a text block
     ↓
[4. Build Prompt] → Combine documents + question into a prompt
     ↓
[5. LLM] → Send to the language model
     ↓
[6. Parse] → Extract the answer
     ↓
Your Answer (grounded in real documents)
```

MagicAF makes each of these steps **pluggable** — you can swap any component without touching the others. But for this tutorial, we will use the defaults for everything.

---

## Step 1 — Set Up Structured Logging

Before building the pipeline, enable logging so you can see what is happening at each step:

```rust
use magicaf_core::prelude::*;
use magicaf_core::embeddings::LocalEmbeddingService;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Enable structured logging — you will see each pipeline step
    tracing_subscriber::fmt()
        .with_env_filter("info,magicaf=debug")
        .json()
        .init();

    println!("=== Your First RAG Pipeline ===\n");
```

**Why structured logging?** In production environments — especially classified and healthcare systems — you need a complete audit trail. Starting with structured logs from day one builds the right habit.

## Step 2 — Configure the Three Services

MagicAF connects to three local HTTP services. Each one handles a different part of the AI pipeline:

```rust
    // The embedding service converts text → vectors
    let embedder = LocalEmbeddingService::new(EmbeddingConfig {
        base_url: "http://localhost:8080".into(),
        model_name: "bge-large-en-v1.5".into(),
        batch_size: 32,
        timeout_secs: 30,
        api_key: None,
    })?;

    // The vector store indexes and searches those vectors
    let store = QdrantVectorStore::new(VectorStoreConfig {
        base_url: "http://localhost:6333".into(),
        api_key: None,
        timeout_secs: 30,
    }).await?;

    // The LLM generates answers from retrieved context
    let llm = LocalLlmService::new(LlmConfig {
        base_url: "http://localhost:8000/v1".into(),
        model_name: "mistral-7b".into(),
        api_key: None,
        timeout_secs: 120,
    })?;
```

**Why three separate services?** MagicAF's architecture separates infrastructure from logic. This means you can swap Qdrant for Milvus, or swap vLLM for Ollama, without changing any application code. In regulated environments, this separation lets you certify each component independently.

## Step 3 — Index Some Documents

Before you can query, you need documents in the vector store. Let's index a few sample strings:

```rust
    use magicaf_core::embeddings::EmbeddingService;
    use magicaf_core::vector_store::VectorStore;

    let collection = "tutorial_docs";
    store.ensure_collection(collection, 1024).await?;

    let docs = vec![
        "Rust is a systems programming language focused on safety, speed, and concurrency.",
        "MagicAF provides embeddings, vector search, and LLM orchestration for secure environments.",
        "RAG combines document retrieval with language model generation to produce grounded answers.",
        "Air-gapped deployments run entirely offline with no internet connectivity.",
        "The EvidenceFormatter trait controls what context the LLM sees during a RAG query.",
    ];

    // Convert text → vectors
    let texts: Vec<String> = docs.iter().map(|s| s.to_string()).collect();
    let embeddings = embedder.embed(&texts).await?;

    // Attach metadata so we can see which document was retrieved
    let payloads: Vec<serde_json::Value> = docs.iter().enumerate()
        .map(|(i, text)| serde_json::json!({
            "content": text,
            "doc_index": i,
        }))
        .collect();

    // Store vectors + metadata in Qdrant
    store.index(collection, embeddings, payloads).await?;
    println!("Indexed {} documents into '{collection}'\n", docs.len());
```

**What just happened?** Each document was converted into a 1024-dimensional vector (a list of 1024 floating-point numbers) that captures its semantic meaning. Documents about similar topics will have vectors that are close together in this high-dimensional space. The vector store indexes these vectors so it can quickly find the closest ones to any query.

## Step 4 — Build the RAG Workflow

Now wire everything together into a `RAGWorkflow`:

```rust
    let workflow = RAGWorkflow::builder()
        .embedding_service(embedder)            // Step 1: Embed
        .vector_store(store)                     // Step 2: Search
        .llm_service(llm)                        // Step 5: Generate
        .evidence_formatter(DefaultEvidenceFormatter)  // Step 3: Format
        .prompt_builder(DefaultPromptBuilder::new())   // Step 4: Build prompt
        .result_parser(RawResultParser)                // Step 6: Parse
        .collection(collection)
        .top_k(3)                                // Retrieve 3 most similar docs
        .build()?;
```

**Why a builder pattern?** Every component is required — the builder ensures you cannot accidentally forget one. The `top_k(3)` setting means the vector store will return the 3 most similar documents to your query.

## Step 5 — Run a Query

```rust
    let result = workflow.run("What is MagicAF?", None).await?;

    println!("── Answer ──────────────────────────");
    println!("{}", result.result);
    println!("────────────────────────────────────");
    println!("Evidence items: {}", result.evidence_count);
    if let Some(usage) = &result.usage {
        println!("Tokens used: {}", usage.total_tokens);
    }

    Ok(())
}
```

Run it:

```bash
cargo run
```

You should see an answer that references MagicAF's capabilities — grounded in the documents you indexed, not hallucinated from the model's training data.

---

## What Just Happened — The Full Picture

When you called `workflow.run("What is MagicAF?", None)`, here is exactly what happened:

| Step | Component | What Happened |
|------|-----------|---------------|
| 1 | `LocalEmbeddingService` | Your question was sent to the embedding server and converted into a 1024-dim vector |
| 2 | `QdrantVectorStore` | That vector was compared against all indexed documents; the 3 closest were returned |
| 3 | `DefaultEvidenceFormatter` | The 3 search results were formatted into a text block with scores |
| 4 | `DefaultPromptBuilder` | The evidence + your question were assembled into a prompt wrapped in `<context>` tags |
| 5 | `LocalLlmService` | The prompt was sent to Mistral-7B, which generated an answer |
| 6 | `RawResultParser` | The raw text was returned as-is (no parsing needed for strings) |

Every one of these components can be replaced. That is the power of MagicAF's trait-based architecture.

---

## Experiments to Try

Now that you have a working pipeline, try these modifications to build intuition:

### Change `top_k`

```rust
.top_k(1)   // Only use the single best match
```

How does the answer quality change with fewer evidence items?

### Add a system instruction

```rust
.prompt_builder(DefaultPromptBuilder::new().with_system(
    "You are a concise technical assistant. Answer in one sentence."
))
```

### Add a minimum score filter

```rust
.min_score(0.7)  // Only use highly relevant documents
```

### Index your own documents

Replace the sample strings with content from your domain — technical manuals, research papers, or internal documentation.

---

## Next Steps

You now have a working RAG pipeline and understand what each component does. Next:

- **[Tutorial: Custom Adapters →](/docs/tutorials/custom-adapters/)** — learn when and how to replace default components with domain-specific logic
- **[Core Concepts: Architecture →](/docs/core-concepts/architecture/)** — dive deeper into the three-layer model
- **[Core Concepts: RAG Pipeline →](/docs/core-concepts/rag-pipeline/)** — understand each pipeline step in detail
