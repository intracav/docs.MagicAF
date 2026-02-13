---
title: "Air-Gapped Deployment - SIPR/NIPR, Secret, Classified Environments"
description: "Deploy MagicAF in fully air-gapped, disconnected environments with no internet access. Perfect for SIPR/NIPR, secret, classified, and defense-grade deployments requiring complete network isolation."
weight: 2
keywords: "airgapped ai, air-gapped ai deployment, sipr ai deployment, nipr ai deployment, secret ai deployment, classified ai deployment, defense ai deployment, airgapped llm, air-gapped llm, disconnected ai, offline ai, secure airgapped ai"
---

MagicAF is designed for **air-gapped environments from the ground up** — ideal for **SIPR/NIPR networks**, **secret and classified systems**, **defense infrastructure**, and **HIPAA-regulated healthcare environments** requiring complete network isolation. Every service runs locally, and all dependencies can be vendored for offline use. This makes MagicAF the perfect solution for environments where data must never leave the network boundary.

## Overview

An air-gapped deployment requires four preparation steps on an internet-connected machine, followed by transfer and build on the isolated host.

## Step 1 — Vendor Rust Dependencies

On an internet-connected machine:

```bash
# From the MagicAF workspace root
cargo vendor > .cargo/config.toml
```

This downloads all crate dependencies into a `vendor/` directory and generates a `.cargo/config.toml` that redirects Cargo to use local sources.

Copy the entire workspace (including `vendor/`) to the air-gapped host.

## Step 2 — Pre-pull Container Images

Save Docker images as tarballs:

```bash
docker save qdrant/qdrant:v1.9.4 > qdrant.tar
docker save vllm/vllm-openai:latest > vllm.tar
docker save ghcr.io/huggingface/text-embeddings-inference:1.2 > tei.tar
```

Transfer tarballs to the air-gapped host and load:

```bash
docker load < qdrant.tar
docker load < vllm.tar
docker load < tei.tar
```

## Step 3 — Pre-download Models

Download model weights on the internet-connected machine:

```bash
# Embedding model
huggingface-cli download BAAI/bge-large-en-v1.5 --local-dir ./models/embedding/

# LLM model
huggingface-cli download mistralai/Mistral-7B-Instruct-v0.2 --local-dir ./models/llm/
```

Copy the `./models/` directory to the air-gapped host.

## Step 4 — Build on Air-Gapped Host

```bash
# Cargo will use vendored dependencies — no network needed
cargo build --release
```

## Complete Transfer Checklist

| Artifact | Size (approx.) | Purpose |
|----------|----------------|---------|
| MagicAF source + `vendor/` | ~200 MB | Application code + dependencies |
| `qdrant.tar` | ~100 MB | Vector database |
| `vllm.tar` or `tei.tar` | ~2–5 GB | Inference servers |
| `./models/embedding/` | ~1–2 GB | Embedding model weights |
| `./models/llm/` | ~4–14 GB | LLM weights (varies by model) |

## Verification

After setup, verify all services are running:

```bash
# Qdrant
curl http://localhost:6333/healthz

# Embedding server
curl http://localhost:8080/health

# LLM server
curl http://localhost:8000/v1/models
```

Then run the health check in code:

```rust
embedder.health_check().await?;
llm.health_check().await?;
```

## Using `InMemoryVectorStore` Without Docker

For environments where Docker is unavailable, use the in-memory vector store:

```rust
use magicaf_core::vector_store::InMemoryVectorStore;

// No Qdrant needed
let store = InMemoryVectorStore::new();

// Or load from a pre-built snapshot
let store = InMemoryVectorStore::load(Path::new("store.json"))?;
```

This eliminates the Qdrant dependency entirely. See [Edge & Mobile](/docs/deployment/edge-mobile/) for details.
