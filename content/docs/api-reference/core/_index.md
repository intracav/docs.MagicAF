---
title: "Core Services"
description: "API reference for MagicAF Core — traits, DTOs, configuration, and error types for embeddings, vector search, LLM orchestration, and RAG workflows."
weight: 1
---

Reference documentation for the `magicaf_core` crate: every trait, struct, configuration option, and error type.

---

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
<div class="card">

### [Resilience →](/docs/api-reference/core/resilience/)
Retry with exponential backoff, circuit breaker, and rate limiter.

</div>
<div class="card">

### [Security →](/docs/api-reference/core/security/)
Prompt guard, PII redaction, response validation, and FIPS mode.

</div>
<div class="card">

### [Compliance →](/docs/api-reference/core/compliance/)
GDPR right-to-erasure workflows with verification and audit trail.

</div>
<div class="card">

### [Observability →](/docs/api-reference/core/observability/)
Structured audit logging, OpenTelemetry metrics, and Prometheus integration.

</div>
<div class="card">

### [Health & Shutdown →](/docs/api-reference/core/health-shutdown/)
Startup health gates, health reports, and graceful shutdown primitives.

</div>
<div class="card">

### [Embedding Cache →](/docs/api-reference/core/embedding-cache/)
LRU embedding cache with TTL and GDPR-aware purging.

</div>
<div class="card">

### [Reranking →](/docs/api-reference/core/reranking/)
Score threshold filtering and cross-encoder reranking for RAG.

</div>
<div class="card">

### [Streaming & Tool Calling →](/docs/api-reference/core/streaming/)
SSE streaming, function calling, and the multi-provider LLM gateway.

</div>
<div class="card">

### [Speech-to-Text (ASR) →](/docs/api-reference/core/asr/)
AsrService trait, Whisper integration, and Voice Activity Detection.

</div>
</div>
