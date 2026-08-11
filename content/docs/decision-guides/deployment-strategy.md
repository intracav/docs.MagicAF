---
title: "Deployment Strategy"
description: "Decision tree and comparison tables for choosing the right MagicAF deployment mode."
weight: 3
tags: [deployment, docker, air-gapped, edge, gpu, decision-tree, hardware]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/deployment/docker/
---

{{< difficulty "intermediate" >}}

You are used to picking deployment targets by preference — the orchestrator your team likes, the cloud you already have credits on. A local-first AI stack does not work that way. Your **deployment mode** is decided by two facts you mostly do not control: whether the target host can reach the internet, and what your ops reality permits (Docker or not, GPU or not, how much RAM). Answer those honestly and the mode picks itself.

This guide is for engineers choosing how to ship a MagicAF pipeline. You will leave with a mode, the performance you should expect from your hardware tier, and a link to the setup guide for the path you chose. The default position: **run Docker Compose. Move to air-gapped preparation when the target has no internet. Go native when the target has no Docker. Go edge when you have less than 4 GB of RAM or a mobile target.** Preference does not appear anywhere in that sentence.

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

Notice what the tree asks about: network boundary first, ops tooling second, hardware third. It never asks what you would rather run.

## Deployment Mode Comparison

| | Docker Compose | Air-Gapped Docker | Native | Edge/Mobile |
|---|---|---|---|---|
| **Internet required** | At setup | At prep only | At setup | At prep only |
| **Docker required** | Yes | Yes (on target) | No | No |
| **GPU required** | Recommended | Recommended | Optional | No |
| **Vector store** | Qdrant | Qdrant | Qdrant or InMemory | InMemory |
| **Setup time** | ~15 min | ~1 hour + transfer | ~30 min | ~1 hour |
| **Maintenance** | `docker compose pull` | Full re-transfer | `cargo update` | App update |
| **Best for** | Development, staging | Air-gapped networks | Custom environments | Phones, tablets, RPi |

The maintenance row is the one teams underweight. Docker Compose updates with one command; an air-gapped deployment updates by repeating the entire transfer ceremony. Choose air-gapped because your network boundary requires it, never because it sounds robust.

{{< card-grid >}}
{{< decision-card title="Docker Compose" tint="green" >}}
- The target host has internet access and Docker
- You want the ~15 minute setup and one-command updates
- Development, staging, or connected production
- This is the **default** — start here unless a constraint forces you off it
{{< /decision-card >}}
{{< decision-card title="Air-Gapped" tint="blue" >}}
- The target host has no internet access — this is a network fact, not a preference
- You can prepare on a connected machine and physically transfer
- Data must never leave your network
- You accept full re-transfer as the update path
{{< /decision-card >}}
{{< decision-card title="Native" tint="accent" >}}
- Docker is unavailable or prohibited on the target
- You need `cargo build` + systemd in a custom environment
- You want Qdrant or InMemory as the vector store, your call
- Your team is comfortable owning the process lifecycle
{{< /decision-card >}}
{{< decision-card title="Edge / Mobile" tint="accent" >}}
- Less than 4 GB of RAM, or the target is a phone, tablet, or RPi
- InMemoryVectorStore and a small model fit the workload
- On-device embeddings with an optional remote LLM
- Retrieval-focused pipelines where a full LLM is optional
{{< /decision-card >}}
{{< /card-grid >}}

## Performance Expectations by Hardware Tier

Set expectations before you deploy, not after. These numbers are what the hardware gives you — no configuration heroics change the tier you are in.

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

Read the two vector store tables together: InMemory is fine to about 10,000 documents, and past that Qdrant is the answer. That crossover — not architecture taste — is what should move you between them.

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

This avoids the GPU passthrough complexity of Docker while still using Docker for Qdrant's storage management. The modes are ingredients, not camps — combine them where your constraints point in different directions for different components.
