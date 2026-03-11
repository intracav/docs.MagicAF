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
<div class="card">

### [Resilience →](/docs/api-reference/core/resilience/)
Retry, circuit breaker, and rate limiter.

</div>
<div class="card">

### [Security →](/docs/api-reference/core/security/)
Prompt guard, PII redaction, response validation, FIPS.

</div>
<div class="card">

### [Compliance →](/docs/api-reference/core/compliance/)
GDPR right-to-erasure workflows.

</div>
<div class="card">

### [Observability →](/docs/api-reference/core/observability/)
Audit logging and OpenTelemetry metrics.

</div>
<div class="card">

### [Health & Shutdown →](/docs/api-reference/core/health-shutdown/)
Startup health gates and graceful shutdown.

</div>
<div class="card">

### [Embedding Cache →](/docs/api-reference/core/embedding-cache/)
LRU cache with TTL for embedding vectors.

</div>
<div class="card">

### [Reranking →](/docs/api-reference/core/reranking/)
Cross-encoder and threshold reranking for RAG.

</div>
<div class="card">

### [Streaming & Tool Calling →](/docs/api-reference/core/streaming/)
SSE streaming, function calling, multi-provider gateway.

</div>
<div class="card">

### [Speech-to-Text (ASR) →](/docs/api-reference/core/asr/)
AsrService, Whisper, and Voice Activity Detection.

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

### [Text Generation →](/docs/api-reference/nlp/text-generation/)
Auto-regressive language generation with GPT-2.

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

## Mobile

On-device text intelligence for Flutter mobile clients from the `magicaf_mobile` crate.

<div class="card-grid">
<div class="card">

### [Mobile API →](/docs/api-reference/mobile/)
Keyword extraction, prompt injection detection, audio utilities, and Flutter bindings.

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
├── asr             # AsrService trait + Voice Activity Detection
├── audit           # Structured audit logging
├── circuit_breaker # Circuit breaker state machine
├── compliance      # GDPR right-to-erasure workflows
├── config          # Configuration structs
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
├── LlmGateway          # Multi-provider router
└── WhisperAsrService   # Whisper-compatible ASR client

magicaf_mobile
├── extract_keywords    # Keyword extraction
├── suggest_title       # Title generation
├── is_prompt_injection # Prompt injection detection
├── audio_energy_level  # Audio RMS energy
├── word_count          # Unicode word counting
└── truncate_to_words   # Word-bounded truncation
```
