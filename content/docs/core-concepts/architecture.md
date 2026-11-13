---
title: "Architecture"
description: "How MagicAF is put together: service traits at the bottom, composable engines in the middle, your domain code on top — and the crates that implement each layer."
weight: 1
keywords: [architecture, trait boundaries, Rust framework design, air-gapped architecture, crate map]
tags: [architecture, layers, traits, separation-of-concerns]
categories: [concept]
difficulty: intermediate
---

MagicAF is built on one rule: **every capability is a trait, and nothing above a trait knows what implements it.** An embedding model, a vector database, a language model, a speech engine, a calibrated decision model — each is an interface in `magicaf-core`. The engines that compose them, and the domain code you write, depend only on those interfaces.

That rule is what lets the same application run against a GPU cluster in one deployment and a CPU-only box on an isolated network in another: you change which implementation you construct, not the code that uses it.

## The crates, by layer

{{< crate-map >}}

Read the map from the bottom. **Foundation** crates define the traits and ship the reference implementations. Everything above builds on them. The [crate catalog](/docs/crates/) explains each status.

## Service traits

These are the seams between MagicAF and the systems it talks to. All are async, `Send + Sync`, and defined in `magicaf-core`.

| Trait | Capability | Implementations |
|---|---|---|
| `EmbeddingService` | Text → vectors | `LocalEmbeddingService` (any OpenAI-compatible `/v1/embeddings`), `CachedEmbeddingService` (wraps another with a cache) |
| `VectorStore` | Index, search, filter, scroll, delete | `QdrantVectorStore` ([`magicaf-qdrant`](/docs/crates/magicaf-qdrant/)), `InMemoryVectorStore` |
| `LlmService` | Chat completion, streaming, tool calls | `LocalLlmService` (OpenAI-compatible), `AnthropicLlmService`, `LlmGateway`, `FallbackGateway` ([`magicaf-local-llm`](/docs/crates/magicaf-local-llm/)) |
| `AsrService` / `StreamingAsrService` | Speech → text | `WhisperAsrService`; `OnnxStreamingAsrEngine` ([`magicaf-asr-onnx`](/docs/crates/magicaf-asr-onnx/)) |
| `TtsService` | Text → speech | `KokoroTtsService`, `DeepgramTtsService` |
| `DecisionService` | Calibrated answers to typed questions | Reflex runtimes ([`magicaf-reflex-onnx`](/docs/crates/magicaf-reflex-onnx/)) |
| `Reranker` | Reorder retrieved passages | `CrossEncoderReranker`, `ScoreThresholdReranker` |
| `CacheService` | Key-value cache for embeddings | Your implementation |
| `TokenBudget` | Reserve and record token spend | `NoopTokenBudget`, or yours |
| `AuditLogger` | Receive audit events | `TracingAuditLogger`, or yours |

Each service also takes the same configuration vocabulary — timeouts, retry with backoff, a circuit breaker, a rate limiter, TLS, and a connection pool — and reports failures through one error enum with stable numeric codes. See [Traits and interfaces](/docs/core-concepts/traits-and-interfaces/).

## Engines

Engines compose services into behavior. They are generic over the traits, so they work with any implementation.

| Engine | Crate | Composes |
|---|---|---|
| `RAGWorkflow` | `magicaf-core` | Embeddings, a vector store, an LLM, and three adapters into a retrieval pipeline |
| `run_turn` | [`magicaf-agent`](/docs/crates/magicaf-agent/) | A model provider and a tool executor into an agent turn, recorded in a session log |
| `RoutingPolicy` | [`magicaf-routing`](/docs/crates/magicaf-routing/) | A model catalog and request features into a routing decision |

### The retrieval pipeline

`RAGWorkflow` runs a fixed sequence. Solid stages are required; dashed ones run when you add them to the builder.

{{< rag-pipeline >}}

Before every network call the workflow checks for a shutdown signal, so a draining process does not start new work. [The RAG pipeline](/docs/core-concepts/rag-pipeline/) covers each stage in depth.

## Your code: adapters

Three traits are where a retrieval application becomes *yours*:

| Trait | Decides | Default |
|---|---|---|
| `EvidenceFormatter` | What the model sees of each retrieved passage | `DefaultEvidenceFormatter` — pretty-printed payloads with scores |
| `PromptBuilder` | How evidence and question are put to the model | `DefaultPromptBuilder` — evidence in a `<context>` block, then the question |
| `ResultParser<T>` | What type you get back | `RawResultParser` (a `String`), `JsonResultParser<T>` (any `Deserialize` type) |

The defaults are enough to get a pipeline running. Production systems usually replace all three — see [Building adapters](/docs/guides/building-adapters/) and [Adapter patterns](/docs/decision-guides/adapter-patterns/).

## Why the boundaries sit here

- **Infrastructure changes should not touch domain code.** Moving from vLLM on a GPU server to Ollama on a CPU workstation is a different `LlmService`; your formatter, prompt, and parser do not change, and neither do their tests.
- **Every boundary is a test seam.** Because each service is a trait, a test can replace the network with an in-memory fake and still run the whole pipeline — see [Testing](/docs/guides/testing/).
- **No vendor in the dependency tree by default.** The reference implementations speak open protocols (OpenAI-compatible HTTP, Qdrant REST), and anything that calls a hosted service — `AnthropicLlmService`, Deepgram, the browser crate's search helpers — is something you construct deliberately.
- **Flat data at the edges.** Requests and responses are plain `Serialize`/`Deserialize` structs and errors carry numeric codes, so the surface can cross a process or language boundary — as it already does in [`magicaf-mobile`](/docs/crates/magicaf-mobile/) and the Reflex C ABI.
