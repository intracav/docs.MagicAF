---
title: "API Reference"
description: "Reference for MagicAF's foundation crates — the service traits, DTOs, configuration, errors, resilience, security, and observability in magicaf-core and magicaf-local-llm — plus the NLP and mobile APIs."
weight: 4
keywords: [API reference, MagicAF API, Rust AI API, air-gapped AI, NLP pipelines]
---

This section is the reference for the foundation crates — `magicaf-core`, `magicaf-local-llm`, and `magicaf-qdrant` — and for the NLP and mobile APIs. Each other crate is documented on its own [crate page](/docs/crates/), with its key types and a compiled example.

For signature-level detail on anything here, `cargo doc --open` in a checkout of the MagicAF repository builds the complete rustdoc; the workspace builds its docs with warnings denied.

---

## Core Services

Traits, DTOs, configuration, and error types from the `magicaf_core` crate.

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
Retry, circuit breaker, and rate limiter.
{{< /card >}}
{{< card title="Security" href="/docs/api-reference/core/security/" >}}
Prompt guard, PII redaction, response validation, FIPS.
{{< /card >}}
{{< card title="Compliance" href="/docs/api-reference/core/compliance/" >}}
GDPR right-to-erasure workflows.
{{< /card >}}
{{< card title="Observability" href="/docs/api-reference/core/observability/" >}}
Audit logging and OpenTelemetry metrics.
{{< /card >}}
{{< card title="Health & Shutdown" href="/docs/api-reference/core/health-shutdown/" >}}
Startup health gates and graceful shutdown.
{{< /card >}}
{{< card title="Embedding Cache" href="/docs/api-reference/core/embedding-cache/" >}}
LRU cache with TTL for embedding vectors.
{{< /card >}}
{{< card title="Reranking" href="/docs/api-reference/core/reranking/" >}}
Cross-encoder and threshold reranking for RAG.
{{< /card >}}
{{< card title="Streaming & Tool Calling" href="/docs/api-reference/core/streaming/" >}}
SSE streaming, function calling, multi-provider gateway.
{{< /card >}}
{{< card title="Speech-to-Text (ASR)" href="/docs/api-reference/core/asr/" >}}
AsrService, Whisper, and Voice Activity Detection.
{{< /card >}}
{{< /card-grid >}}

---

## NLP Pipelines

Production-grade NLP pipelines from the `magicaf_nlp` crate — all run in-process with no external services.

{{< card-grid >}}
{{< card title="Overview" href="/docs/api-reference/nlp/" >}}
Architecture, feature flags, and how NLP pipelines differ from core services.
{{< /card >}}
{{< card title="Quick Start" href="/docs/api-reference/nlp/quickstart/" >}}
Get up and running with your first NLP pipeline in minutes.
{{< /card >}}
{{< card title="Setup & Configuration" href="/docs/api-reference/nlp/setup/" >}}
Install native dependencies, configure models, and set up for air-gapped deployments.
{{< /card >}}
{{< card title="Pipelines" href="/docs/api-reference/nlp/pipelines/" >}}
Complete reference for all available NLP pipelines.
{{< /card >}}
{{< card title="Question Answering" href="/docs/api-reference/nlp/question-answering/" >}}
Extract answer spans from context with DistilBERT / SQuAD.
{{< /card >}}
{{< card title="Named Entity Recognition" href="/docs/api-reference/nlp/named-entity-recognition/" >}}
Extract persons, locations, and organizations with BERT / CoNLL-03.
{{< /card >}}
{{< card title="Sentiment Analysis" href="/docs/api-reference/nlp/sentiment-analysis/" >}}
Positive/negative prediction with DistilBERT / SST-2.
{{< /card >}}
{{< card title="Zero-Shot Classification" href="/docs/api-reference/nlp/zero-shot-classification/" >}}
Classify into arbitrary labels with BART-MNLI.
{{< /card >}}
{{< card title="Translation" href="/docs/api-reference/nlp/translation/" >}}
Translate between 100+ languages with Marian / M2M100.
{{< /card >}}
{{< card title="Summarization" href="/docs/api-reference/nlp/summarization/" >}}
Abstractive text summarization with BART-large-CNN.
{{< /card >}}
{{< card title="Dialogue" href="/docs/api-reference/nlp/dialogue/" >}}
Multi-turn conversation with DialoGPT.
{{< /card >}}
{{< card title="Text Generation" href="/docs/api-reference/nlp/text-generation/" >}}
Auto-regressive language generation with GPT-2.
{{< /card >}}
{{< card title="Keyword Extraction" href="/docs/api-reference/nlp/keyword-extraction/" >}}
Key terms from documents using sentence embeddings.
{{< /card >}}
{{< card title="POS Tagging" href="/docs/api-reference/nlp/pos-tagging/" >}}
Grammatical category tagging with BERT / Penn Treebank.
{{< /card >}}
{{< card title="Masked Language Model" href="/docs/api-reference/nlp/masked-language-model/" >}}
Fill-in-the-blank prediction with BERT base.
{{< /card >}}
{{< card title="Use Cases & Examples" href="/docs/api-reference/nlp/use-cases/" >}}
Working code examples for common NLP tasks.
{{< /card >}}
{{< /card-grid >}}

---

## Mobile

On-device text intelligence for Flutter mobile clients from the `magicaf_mobile` crate.

{{< card-grid >}}
{{< card title="Mobile API" href="/docs/api-reference/mobile/" >}}
Keyword extraction, prompt injection detection, audio utilities, and Flutter bindings.
{{< /card >}}
{{< /card-grid >}}

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
├── asr             # AsrService, StreamingAsrService, voice activity detection
├── audit           # Structured audit logging
├── cancel          # CancelToken for cooperative cancellation
├── circuit_breaker # Circuit breaker state machine
├── compliance      # GDPR right-to-erasure workflows
├── config          # Configuration structs
├── decision        # DecisionService, decision records, the Reflex wire contract
├── embeddings      # EmbeddingService trait + LocalEmbeddingService + cache
├── errors          # MagicError enum + Result alias
├── health          # Startup health gates
├── llm             # LlmService trait + OpenAI DTOs + tool calling
├── metrics         # OpenTelemetry + Prometheus integration
├── rag             # RAGWorkflow engine + RAGResult + reranking
├── rate_limiter    # Semaphore-based concurrency limiter
├── retry           # Exponential backoff with jitter
├── security        # Prompt guard, PII filter, response guard, FIPS
├── shutdown        # Graceful shutdown primitives
├── telemetry       # Tracing initialization helpers
├── token_budget    # TokenBudget trait for token spend limits
├── tts             # TtsService trait
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
├── LocalLlmService     # OpenAI-compatible LLM client
├── AnthropicLlmService # Anthropic Messages API client
├── LlmGateway          # Multi-provider router with token budgets and JSON mode
├── FallbackGateway     # Failover across gateways, each with a circuit breaker
├── StreamTiming        # Time-to-first-token and duration for streams
├── WhisperAsrService   # Whisper-compatible ASR client
├── KokoroTtsService    # Local text-to-speech client
└── DeepgramTtsService  # Hosted text-to-speech client

magicaf_mobile
├── extract_keywords    # Keyword extraction
├── suggest_title       # Title generation
├── is_prompt_injection # Prompt injection detection
├── audio_energy_level  # Audio RMS energy
├── word_count          # Unicode word counting
└── truncate_to_words   # Word-bounded truncation
```
