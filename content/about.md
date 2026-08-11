---
title: "About MagicAF"
description: "What MagicAF is, the problem it solves, and where it fits: an open-source Rust framework for running RAG, NLP, and LLM orchestration entirely inside your own network."
weight: 0
keywords: [MagicAF, Rust AI framework, air-gapped AI, on-premises AI, self-hosted AI, open-source AI framework, Intracav]
---

Most AI frameworks assume the internet is one `await` away: models live behind a vendor's API, telemetry flows home, and even the build step wants the network. That assumption breaks in exactly the places AI could matter most — hospital networks, research labs, government enclaves, any room where the data is not allowed to leave.

MagicAF starts from the opposite assumption. It is an **open-source Rust framework** that gives you the building blocks of an AI system — embeddings, vector search, RAG pipelines, LLM orchestration, and a full NLP toolkit — as composable services you point at endpoints *you* run. If your machine can reach `localhost`, MagicAF works. The internet is optional.

**Who this page is for:** engineers deciding whether to build on MagicAF, and the people they need to convince. By the end you'll know what's in the framework, what it deliberately refuses to do, and where to start.

## Built for isolated networks

Every design decision follows from one rule: *assume the network boundary is closed.*

- **Air-gapped by design** — every service assumes a local endpoint. There is no cloud SDK in the dependency tree and no code path that requires one.
- **No outbound calls** — all processing runs against endpoints you configure. No telemetry, no phone-home.
- **Secrets stay secret** — API keys and sensitive configuration are never serialized or logged.
- **Vendorable** — the workspace and all dependencies can be vendored and built fully offline. The [air-gapped deployment guide](/docs/deployment/air-gapped/) walks through the procedure end to end.

A note on compliance, because it comes up in every evaluation: MagicAF is a framework, not a service — regulatory compliance is a property of *your deployment*, not of a library. What the framework contributes is architectural: processing that never leaves your network, logging that can be configured to exclude sensitive data, and no third party in the data path. The [security guide](/docs/deployment/security/) spells out exactly what MagicAF does and doesn't handle.

## More than an LLM client

Wrapping a chat API is the easy tenth of the problem. MagicAF covers the other nine:

- **Embedding generation** — dense vector embeddings for semantic search, batched and local
- **Vector search** — in-memory for development, [Qdrant](/docs/api-reference/core/vector-store/) for production
- **RAG workflows** — a [six-step pipeline](/docs/core-concepts/rag-pipeline/) with pluggable components at every step
- **LLM orchestration** — local inference through OpenAI-compatible APIs, so any local server (llama.cpp, vLLM, and friends) plugs in
- **NLP pipelines** — NER, sentiment, translation, question answering, and more, running in-process with no model server at all

## Why local-first is the design center

You could assemble the same capabilities from cloud services. Teams choose MagicAF when at least one of these is true:

- **The data cannot leave.** Policy, regulation, or contract says so. Local-first turns that constraint from an integration problem into a non-event.
- **The vendor cannot be in the loop.** No external dependency means no rate limits, no deprecations on someone else's schedule, no per-token pricing surprises.
- **The system must work offline.** Disconnected sites, edge deployments, and mobile targets need inference that doesn't degrade when the uplink does.
- **You need to audit what you run.** MagicAF is distributed as source. Read it, vendor it, pin it, build it yourself.

## Where it fits

- **Healthcare systems** — clinical decision support and document analysis in environments with strict data-protection requirements. MagicAF is the framework underneath [Lumen](https://lumen.intracav.ai), Intracav's clinical AI platform.
- **Government and defense** — document analysis and knowledge retrieval on networks that are physically separated from the internet.
- **Financial services** — document review and risk analysis under strict data-handling requirements.
- **Research institutions** — privacy-preserving analysis where data-sharing agreements rule out cloud processing.

## Why Rust

- **Memory safety** — eliminates entire classes of vulnerabilities before deployment, which matters most where patching is hardest
- **Performance** — production workloads without a garbage collector in the latency path
- **Reliability** — type-safe, compile-time guarantees; flat DTO structs and explicit error codes
- **FFI-ready** — clean interfaces for C, Python, Swift, and Java bindings

## Part of the Intracav ecosystem

MagicAF is built by [Intracav](https://intracav.ai/), the clinical AI infrastructure company behind:

- **[Lumen](https://lumen.intracav.ai)** — the clinical AI assistant ([user documentation](https://docs.intracav.ai))
- **[The Clinical Database](https://clinical-database.com)** — open clinical reference
- **[qPolicy](https://qpolicy.ai)** — policy and compliance for healthcare organizations

## Getting started

Start with the [Quickstart](/docs/getting-started/quickstart/) — a complete RAG pipeline in under 50 lines — or go straight to [air-gapped deployment](/docs/deployment/air-gapped/) if you're evaluating for an isolated network. The source lives at [github.com/magicaf/magicaf](https://github.com/magicaf/magicaf).
