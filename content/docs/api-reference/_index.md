---
title: "API Reference"
description: "Complete API reference for defense-grade AI toolkit. Every trait, struct, configuration option, and error type for secure, air-gapped AI deployments."
weight: 4
keywords: [API reference, secure AI API, defense-grade API, HIPAA-compliant API, air-gapped API, NLP pipelines]
---

This section documents every public type in the MagicAF framework, Intracav's defense-grade AI toolkit. Use it as a reference while building.

---

## Core Services

Traits, DTOs, configuration, and error types from the `magicaf_core` crate.

<div class="card-grid">
<div class="card">

### [EmbeddingService →](/docs/api-reference/core/embedding-service/)
Trait and types for dense vector embedding generation.

</div>
<div class="card">

### [VectorStore →](/docs/api-reference/core/vector-store/)
Trait and types for vector database operations.

</div>
<div class="card">

### [LlmService →](/docs/api-reference/core/llm-service/)
Trait and OpenAI-compatible DTOs for language model inference.

</div>
<div class="card">

### [RAGWorkflow →](/docs/api-reference/core/rag-workflow/)
The pipeline engine — builder, execution, and result types.

</div>
<div class="card">

### [Adapter Traits →](/docs/api-reference/core/adapter-traits/)
EvidenceFormatter, PromptBuilder, ResultParser, and default implementations.

</div>
<div class="card">

### [Configuration →](/docs/api-reference/core/configuration/)
All configuration structs and their fields.

</div>
<div class="card">

### [Errors →](/docs/api-reference/core/errors/)
MagicError variants, error codes, and helper constructors.

</div>
<div class="card">

### [FFI →](/docs/api-reference/core/ffi/)
FFI preparation, error codes, and language binding strategy.

</div>
</div>

---

## NLP Pipelines

Production-grade NLP pipelines from the `magicaf_nlp` crate — all run in-process with no external services.

<div class="card-grid">
<div class="card">

### [Overview →](/docs/api-reference/nlp/)
Architecture, feature flags, and how NLP pipelines differ from core services.

</div>
<div class="card">

### [Quick Start →](/docs/api-reference/nlp/quickstart/)
Get up and running with your first NLP pipeline in minutes.

</div>
<div class="card">

### [Setup & Configuration →](/docs/api-reference/nlp/setup/)
Install native dependencies, configure models, and set up for air-gapped deployments.

</div>
<div class="card">

### [Pipelines →](/docs/api-reference/nlp/pipelines/)
Complete reference for all available NLP pipelines.

</div>
<div class="card">

### [Question Answering →](/docs/api-reference/nlp/question-answering/)
Extract answer spans from context with DistilBERT / SQuAD.

</div>
<div class="card">

### [Named Entity Recognition →](/docs/api-reference/nlp/named-entity-recognition/)
Extract persons, locations, and organizations with BERT / CoNLL-03.

</div>
<div class="card">

### [Sentiment Analysis →](/docs/api-reference/nlp/sentiment-analysis/)
Positive/negative prediction with DistilBERT / SST-2.

</div>
<div class="card">

### [Zero-Shot Classification →](/docs/api-reference/nlp/zero-shot-classification/)
Classify into arbitrary labels with BART-MNLI.

</div>
<div class="card">

### [Translation →](/docs/api-reference/nlp/translation/)
Translate between 100+ languages with Marian / M2M100.

</div>
<div class="card">

### [Summarization →](/docs/api-reference/nlp/summarization/)
Abstractive text summarization with BART-large-CNN.

</div>
<div class="card">

### [Dialogue →](/docs/api-reference/nlp/dialogue/)
Multi-turn conversation with DialoGPT.

</div>
<div class="card">

### [Keyword Extraction →](/docs/api-reference/nlp/keyword-extraction/)
Key terms from documents using sentence embeddings.

</div>
<div class="card">

### [POS Tagging →](/docs/api-reference/nlp/pos-tagging/)
Grammatical category tagging with BERT / Penn Treebank.

</div>
<div class="card">

### [Masked Language Model →](/docs/api-reference/nlp/masked-language-model/)
Fill-in-the-blank prediction with BERT base.

</div>
<div class="card">

### [Use Cases & Examples →](/docs/api-reference/nlp/use-cases/)
Working code examples for common NLP tasks.

</div>
</div>

---

## Generating Rust API Docs

For inline documentation with full type signatures, generate Rust docs:

```bash
cargo doc --workspace --no-deps --open
```

## Module Map

```
magicaf_core
├── adapters        # Extension traits + defaults
├── config          # Configuration structs
├── embeddings      # EmbeddingService trait + LocalEmbeddingService
├── errors          # MagicError enum + Result alias
├── llm             # LlmService trait + OpenAI DTOs
├── rag             # RAGWorkflow engine + RAGResult
├── vector_store    # VectorStore trait + InMemoryVectorStore
└── prelude         # Convenience re-exports

magicaf_nlp
├── config          # NLP pipeline configuration (ModelSource, Device)
├── pipelines       # Pipeline implementations (NER, QA, sentiment, etc.)
├── keywords        # Keyword extraction via sentence embeddings
└── prelude         # Convenience re-exports

magicaf_qdrant
└── QdrantVectorStore

magicaf_local_llm
└── LocalLlmService
```
