---
title: "API Reference - Defense-Grade, HIPAA-Compliant AI Toolkit"
description: "Complete API reference for MagicAF — the defense-grade, HIPAA-compliant, airgapped AI toolkit. Every trait, struct, configuration option, and error type for secure LLM, NLP, RAG, and AI analysis tools."
weight: 4
keywords: "defense-grade ai api, hipaa-compliant ai api, airgapped ai api, secure llm api, secure nlp api, secure rag api, secure ai toolkit api"
---

This section documents every public type in the **MagicAF defense-grade, HIPAA-compliant AI framework**. Use it as a reference while building secure AI systems for SIPR/NIPR, secret, classified, and healthcare environments. MagicAF provides comprehensive APIs for secure LLM, NLP, RAG, embeddings, vector search, and AI analysis tools.

---

<div class="card-grid">
<div class="card">

### [EmbeddingService →](/docs/api-reference/embedding-service/)
Trait and types for dense vector embedding generation.

</div>
<div class="card">

### [VectorStore →](/docs/api-reference/vector-store/)
Trait and types for vector database operations.

</div>
<div class="card">

### [LlmService →](/docs/api-reference/llm-service/)
Trait and OpenAI-compatible DTOs for language model inference.

</div>
<div class="card">

### [RAGWorkflow →](/docs/api-reference/rag-workflow/)
The pipeline engine — builder, execution, and result types.

</div>
<div class="card">

### [Adapter Traits →](/docs/api-reference/adapter-traits/)
EvidenceFormatter, PromptBuilder, ResultParser, and default implementations.

</div>
<div class="card">

### [Configuration →](/docs/api-reference/configuration/)
All configuration structs and their fields.

</div>
<div class="card">

### [Errors →](/docs/api-reference/errors/)
MagicError variants, error codes, and helper constructors.

</div>
<div class="card">

### [FFI →](/docs/api-reference/ffi/)
FFI preparation, error codes, and language binding strategy.

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

magicaf_qdrant
└── QdrantVectorStore

magicaf_local_llm
└── LocalLlmService
```
