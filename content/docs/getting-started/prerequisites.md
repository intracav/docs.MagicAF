---
title: "Prerequisites"
description: "System requirements and local services needed to run MagicAF."
weight: 1
tags: [setup, rust, docker, infrastructure]
categories: [guide]
difficulty: beginner
prerequisites: []
estimated_reading_time: "5 min"
last_reviewed: "2026-02-12"
---

MagicAF requires three local services and a Rust toolchain. All services communicate over HTTP — no cloud accounts, no vendor SDKs.

{{< callout type="info" title="Hardware Expectations" >}}
| Tier | CPU | RAM | GPU | Use Case |
|------|-----|-----|-----|----------|
| **Minimum** | 4 cores | 8 GB | None | CPU-only with small models (Phi-2, BGE-small) |
| **Recommended** | 8 cores | 16 GB | 8+ GB VRAM | Mistral-7B (Q4) + BGE-large — good development experience |
| **Production** | 16+ cores | 64+ GB | 24+ GB VRAM | Full FP16 models, concurrent users, large document collections |

For detailed model-to-hardware mapping, see [Choosing Models](/docs/decision-guides/choosing-models/).
{{< /callout >}}

## Rust Toolchain

MagicAF requires **Rust 1.75+** (2024 edition). Install via [rustup](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Verify your installation:

```bash
rustc --version   # 1.75.0 or later
cargo --version
```

## Local Services

MagicAF connects to three local HTTP services. You can use any compatible software.

| Service | Default Port | Purpose | Recommended Software |
|---------|-------------|---------|---------------------|
| **Embedding server** | `8080` | Produce dense vector embeddings | llama.cpp (`--embedding`), text-embeddings-inference, vLLM |
| **Vector database** | `6333` | Store and search embeddings | Qdrant |
| **LLM server** | `8000` | Chat completion / text generation | vLLM, llama.cpp, TGI, Ollama |

### Quick Setup with Docker

The fastest way to get all services running:

**1. Qdrant** — Vector database

```bash
docker run -d --name qdrant \
  -p 6333:6333 -p 6334:6334 \
  qdrant/qdrant:latest
```

**2. Embedding Server** — llama.cpp with an embedding model

```bash
# Download a quantized embedding model
wget https://huggingface.co/second-state/BGE-large-EN-v1.5-GGUF/resolve/main/bge-large-en-v1.5-Q4_K_M.gguf

# Start the embedding server
./llama-server \
  -m bge-large-en-v1.5-Q4_K_M.gguf \
  --embedding \
  --port 8080
```

**3. LLM Server** — vLLM with an instruction-tuned model

```bash
python -m vllm.entrypoints.openai.api_server \
  --model mistralai/Mistral-7B-Instruct-v0.2 \
  --port 8000
```

> **Tip:** Any server that exposes an OpenAI-compatible `/v1/chat/completions` endpoint will work — Ollama, LocalAI, text-generation-inference, or a custom FastAPI server.

## Verify Services

Check that all services are responding:

```bash
# Qdrant
curl http://localhost:6333/healthz

# Embedding server
curl http://localhost:8080/health

# LLM server
curl http://localhost:8000/v1/models
```

All three should return successful HTTP responses.

---

**Next:** [Installation →](/docs/getting-started/installation/)
