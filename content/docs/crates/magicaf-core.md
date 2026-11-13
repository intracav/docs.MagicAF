---
title: "magicaf-core"
description: "The foundation of every MagicAF program: service traits, DTOs, configuration, numeric error codes, the RAG workflow engine, resilience, security helpers, and the decision contract."
weight: 1
---

{{< crate-header "magicaf-core" >}}

`magicaf-core` defines what a MagicAF service *is*. Each capability — embeddings, vector search, chat completion, speech, text-to-speech, calibrated decisions — is a trait, so the rest of the framework and your own code depend on the interface, not on a vendor. The crate also carries the machinery every service shares: typed configuration with retry, circuit-breaker, rate-limit, and TLS settings; one error enum with stable numeric codes; structured logging and Prometheus metrics; audit events; health checks and graceful shutdown; and prompt-injection, response, and PII guards.

It ships two implementations of its own — `LocalEmbeddingService` for any OpenAI-compatible embeddings endpoint and an `InMemoryVectorStore` — and the `RAGWorkflow` engine that composes services into a retrieval pipeline.

## Documentation

| Page | Covers |
|---|---|
| [Traits and interfaces](/docs/core-concepts/traits-and-interfaces/) | The service traits and the adapter seams |
| [RAG workflow](/docs/api-reference/core/rag-workflow/) | The builder and the pipeline stages |
| [Configuration](/docs/api-reference/core/configuration/) | Every config struct and its defaults |
| [Errors](/docs/api-reference/core/errors/) | The error enum and numeric codes |
| [Resilience](/docs/api-reference/core/resilience/) | Retry, circuit breaker, rate limiting |
| [Security](/docs/api-reference/core/security/) | Prompt, response, and PII guards; FIPS |
| [Observability](/docs/api-reference/core/observability/) | Logging, metrics, audit |
| [Full core reference](/docs/api-reference/core/) | Everything else |
