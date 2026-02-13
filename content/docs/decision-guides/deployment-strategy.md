---
title: "Deployment Strategy"
description: "Decision tree and comparison tables for choosing the right MagicAF deployment mode."
weight: 3
tags: [deployment, docker, air-gapped, edge, gpu, decision-tree, hardware]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/deployment/docker/
estimated_reading_time: "10 min"
last_reviewed: "2026-02-12"
---

{{< difficulty "intermediate" >}}

MagicAF supports multiple deployment modes. This guide helps you choose the right one based on your constraints.

## Decision Tree

Start here and follow the questions:

```
Does the target host have internet access?
├── Yes → Do you have Docker?
│   ├── Yes → DOCKER COMPOSE deployment
│   └── No  → NATIVE deployment (cargo build + systemd)
│
└── No (air-gapped) → Do you have Docker on the target?
    ├── Yes → AIR-GAPPED DOCKER deployment
    │         (vendor deps + save images + transfer)
    └── No  → AIR-GAPPED NATIVE deployment
              (vendor deps + InMemoryVectorStore + llama.cpp subprocess)

Additional constraints:
├── GPU available? → Full LLM inference locally
├── No GPU?       → CPU inference (llama.cpp GGUF) or no LLM (retrieval-only)
├── < 4 GB RAM?   → EDGE deployment (InMemoryVectorStore + small model)
└── Mobile?       → EDGE deployment (on-device embeddings, optional remote LLM)
```

## Deployment Mode Comparison

| | Docker Compose | Air-Gapped Docker | Native | Edge/Mobile |
|---|---|---|---|---|
| **Internet required** | At setup | At prep only | At setup | At prep only |
| **Docker required** | Yes | Yes (on target) | No | No |
| **GPU required** | Recommended | Recommended | Optional | No |
| **Vector store** | Qdrant | Qdrant | Qdrant or InMemory | InMemory |
| **Setup time** | ~15 min | ~1 hour + transfer | ~30 min | ~1 hour |
| **Maintenance** | `docker compose pull` | Full re-transfer | `cargo update` | App update |
| **Best for** | Development, staging | Classified networks | Custom environments | Phones, tablets, RPi |

## Performance Expectations by Hardware Tier

### Embedding Throughput

| Hardware | Model | Throughput | Latency (single) |
|----------|-------|-----------|-------------------|
| **CPU (4 core)** | BGE-small (Q8) | ~200 docs/s | ~5 ms |
| **CPU (4 core)** | BGE-large (Q8) | ~50 docs/s | ~20 ms |
| **RTX 3090 (24 GB)** | BGE-large (F16) | ~500 docs/s | ~2 ms |
| **A100 (80 GB)** | BGE-large (F16) | ~1000 docs/s | ~1 ms |

### LLM Generation Speed

| Hardware | Model | Tokens/second | Time for 200-token answer |
|----------|-------|--------------|---------------------------|
| **CPU (8 core)** | Mistral-7B (Q4) | ~5 tok/s | ~40 seconds |
| **RTX 3090 (24 GB)** | Mistral-7B (Q4) | ~25 tok/s | ~8 seconds |
| **RTX 3090 (24 GB)** | Mistral-7B (FP16) | ~20 tok/s | ~10 seconds |
| **A100 (80 GB)** | Mistral-7B (FP16) | ~40 tok/s | ~5 seconds |
| **A100 (80 GB)** | Llama-2-13B (FP16) | ~25 tok/s | ~8 seconds |

### Vector Search Latency (Qdrant)

| Document Count | Latency (p50) | Latency (p99) | RAM Usage (1024-dim) |
|---------------|---------------|---------------|----------------------|
| 10,000 | < 1 ms | ~2 ms | ~100 MB |
| 100,000 | ~2 ms | ~5 ms | ~1 GB |
| 1,000,000 | ~5 ms | ~15 ms | ~10 GB |

### Vector Search Latency (InMemoryVectorStore)

| Document Count | Latency | RAM Usage (1024-dim) |
|---------------|---------|----------------------|
| 1,000 | < 1 ms | ~10 MB |
| 10,000 | ~5 ms | ~100 MB |
| 100,000 | ~50 ms | ~1 GB |

---

## Deployment Guides

Once you have chosen your mode, follow the corresponding guide:

| Mode | Guide |
|------|-------|
| Docker Compose | [Docker Compose →](/docs/deployment/docker/) |
| Air-Gapped | [Air-Gapped Setup →](/docs/deployment/air-gapped/) |
| Edge/Mobile | [Edge & Mobile →](/docs/deployment/edge-mobile/) |
| Scaling (production) | [Scaling →](/docs/deployment/scaling/) |

## Common Questions

### Can I run everything on CPU?

Yes. Use llama.cpp with GGUF-quantized models for both embedding and LLM inference. Expect slower generation (~5 tokens/second for Mistral-7B Q4 on 8 cores) but fully functional pipelines. See [Choosing Models](/docs/decision-guides/choosing-models/) for CPU-friendly model recommendations.

### How much disk space do I need?

| Component | Size |
|-----------|------|
| MagicAF source + vendored deps | ~200 MB |
| Qdrant (empty) | ~100 MB |
| Embedding model (BGE-large F16) | ~1.3 GB |
| LLM model (Mistral-7B Q4) | ~4 GB |
| LLM model (Mistral-7B FP16) | ~14 GB |
| Docker images (all three) | ~3–6 GB |
| **Total (minimal)** | **~9 GB** |
| **Total (full FP16)** | **~22 GB** |

### Can I mix deployment modes?

Yes. A common pattern for air-gapped environments with limited hardware:
- Run Qdrant in Docker (it is lightweight)
- Run the embedding server natively with llama.cpp
- Run the LLM natively with llama.cpp
- Build the MagicAF application with `cargo build`

This avoids the GPU passthrough complexity of Docker while still using Docker for Qdrant's storage management.
