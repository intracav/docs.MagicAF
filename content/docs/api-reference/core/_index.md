---
title: "Core Services"
description: "API reference for MagicAF Core — traits, DTOs, configuration, and error types for embeddings, vector search, LLM orchestration, and RAG workflows."
weight: 1
---

Reference documentation for the `magicaf_core` crate: every trait, struct, configuration option, and error type.

---

{{< card-grid >}}
{{< card title="EmbeddingService" href="/docs/api-reference/core/embedding-service/" >}}
Trait and types for dense vector embedding generation.
{{< /card >}}
{{< card title="VectorStore" href="/docs/api-reference/core/vector-store/" >}}
Trait and types for vector database operations.
{{< /card >}}
{{< card title="LlmService" href="/docs/api-reference/core/llm-service/" >}}
Trait and OpenAI-compatible DTOs for language model inference.
{{< /card >}}
{{< card title="RAGWorkflow" href="/docs/api-reference/core/rag-workflow/" >}}
The pipeline engine — builder, execution, and result types.
{{< /card >}}
{{< card title="Adapter Traits" href="/docs/api-reference/core/adapter-traits/" >}}
EvidenceFormatter, PromptBuilder, ResultParser, and default implementations.
{{< /card >}}
{{< card title="Configuration" href="/docs/api-reference/core/configuration/" >}}
All configuration structs and their fields.
{{< /card >}}
{{< card title="Errors" href="/docs/api-reference/core/errors/" >}}
MagicError variants, error codes, and helper constructors.
{{< /card >}}
{{< card title="FFI" href="/docs/api-reference/core/ffi/" >}}
FFI preparation, error codes, and language binding strategy.
{{< /card >}}
{{< card title="Resilience" href="/docs/api-reference/core/resilience/" >}}
Retry with exponential backoff, circuit breaker, and rate limiter.
{{< /card >}}
{{< card title="Security" href="/docs/api-reference/core/security/" >}}
Prompt guard, PII redaction, response validation, and FIPS mode.
{{< /card >}}
{{< card title="Compliance" href="/docs/api-reference/core/compliance/" >}}
GDPR right-to-erasure workflows with verification and audit trail.
{{< /card >}}
{{< card title="Observability" href="/docs/api-reference/core/observability/" >}}
Structured audit logging, OpenTelemetry metrics, and Prometheus integration.
{{< /card >}}
{{< card title="Health & Shutdown" href="/docs/api-reference/core/health-shutdown/" >}}
Startup health gates, health reports, and graceful shutdown primitives.
{{< /card >}}
{{< card title="Embedding Cache" href="/docs/api-reference/core/embedding-cache/" >}}
LRU embedding cache with TTL and GDPR-aware purging.
{{< /card >}}
{{< card title="Reranking" href="/docs/api-reference/core/reranking/" >}}
Score threshold filtering and cross-encoder reranking for RAG.
{{< /card >}}
{{< card title="Streaming & Tool Calling" href="/docs/api-reference/core/streaming/" >}}
SSE streaming, function calling, and the multi-provider LLM gateway.
{{< /card >}}
{{< card title="Speech-to-Text (ASR)" href="/docs/api-reference/core/asr/" >}}
AsrService trait, Whisper integration, and Voice Activity Detection.
{{< /card >}}
{{< /card-grid >}}
