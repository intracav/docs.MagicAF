---
title: "Air-Gapped Setup"
description: "Deploy MagicAF in fully disconnected, classified, and defense-grade environments. Complete guide for SIPR/NIPR, HIPAA-compliant, and air-gapped AI deployments with zero internet dependencies."
weight: 2
keywords: [air-gapped, airgapped, classified deployment, SIPR, NIPR, defense-grade, HIPAA-compliant, offline AI, disconnected AI, secure deployment]
tags: [deployment, air-gapped, offline, cargo-vendor, classified]
categories: [deployment]
difficulty: advanced
prerequisites: [/docs/deployment/docker/]
estimated_reading_time: "7 min"
last_reviewed: "2026-02-12"
---

MagicAF is designed for air-gapped environments from the ground up — a hallmark of Intracav's approach to secure AI. Every service runs locally, and all dependencies can be vendored for offline use. For more information about MagicAF's security architecture and compliance features, see the [About page](/about/).

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

---

## FAQ

### How do I update models on an air-gapped network?

Follow the same transfer process: download the new model weights on the connected machine, compute checksums, transfer via approved media, verify checksums, and swap the model directory. Restart the embedding or LLM server to load the new weights. No application code changes are needed — model names are configured via environment variables or config files.

### What if `cargo vendor` misses a dependency?

This typically happens when `Cargo.lock` is out of date. On the connected machine, run `cargo update` followed by `cargo vendor` to ensure all resolved dependencies are captured. Verify with `cargo build --release --offline` before transferring. If a build-time dependency (proc-macro, build script) triggers a network fetch, check for `build-dependencies` in your dependency tree with `cargo tree -e build`.

### Can I use Podman instead of Docker?

Yes. Podman is a drop-in replacement for Docker in this context. Replace `docker save` with `podman save`, `docker load` with `podman load`, and `docker compose` with `podman-compose`. All other steps remain the same. Podman's rootless mode is an additional security benefit for classified environments.

### How do I verify model integrity after transfer?

Generate SHA-256 checksums for all model files before transfer:

```bash
find ./models -type f -exec sha256sum {} \; > MODEL_MANIFEST.sha256
```

After transfer, verify on the air-gapped host:

```bash
sha256sum -c MODEL_MANIFEST.sha256
```

For classified environments, your organization may require additional integrity verification procedures (e.g., dual-person integrity checks).
