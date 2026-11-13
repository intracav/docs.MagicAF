---
title: "Prerequisites"
description: "The Rust toolchain, source access, and the three local services a MagicAF retrieval pipeline talks to."
weight: 1
tags: [setup, rust, docker, infrastructure]
categories: [guide]
difficulty: beginner
---

A MagicAF retrieval pipeline is a Rust program that talks over HTTP to three services you run: an embedding server, a vector database, and an LLM server. This page gets all four pieces in place. Plan on about fifteen minutes, most of it downloading model weights.

## Rust 1.91

The workspace pins its toolchain in `rust-toolchain.toml` to **Rust 1.91.1**, and the crates use edition 2021. Older compilers will not build `magicaf-core`. Install with [rustup](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup toolchain install 1.91.1
rustc +1.91.1 --version   # rustc 1.91.1
```

Inside a checkout of the MagicAF repository, `rustup` selects 1.91.1 for you automatically.

## Source access

The MagicAF repository is private. Your crate depends on it by git URL, so the machine that runs `cargo build` needs read access to it. If you do not have access yet, see [Installation → Access](/docs/getting-started/installation/#access).

## The three local services

| Service | Port | What MagicAF calls | Software that works |
|---|---|---|---|
| Embedding server | `8080` | `POST {base_url}/v1/embeddings` | Hugging Face text-embeddings-inference, llama.cpp `--embedding`, vLLM |
| Vector database | `6333` | Qdrant REST API | Qdrant |
| LLM server | `8000` | `POST {base_url}/chat/completions`, with `/v1` in `base_url` | vLLM, llama.cpp, Ollama, TGI — anything OpenAI-compatible |

Note the asymmetry: the embedding client appends `/v1/embeddings` itself, while the LLM client expects `/v1` to be part of the base URL you give it (`http://localhost:8000/v1`).

### Start them with Docker Compose

The MagicAF repository ships a compose file with pinned images, health checks, and memory limits. From the repository root:

{{< tabs >}}
{{< tab "Full stack (GPU)" >}}
```bash
make -C deploy docker-full     # Qdrant + embeddings + vLLM (needs an NVIDIA GPU)
make -C deploy docker-health   # wait until all three report healthy
```
{{< /tab >}}
{{< tab "No GPU" >}}
```bash
make -C deploy docker-core     # Qdrant + embeddings only
```
Then run an LLM yourself — for example Ollama, which serves an OpenAI-compatible API on port 11434:
```bash
ollama pull mistral
ollama serve
```
Point MagicAF at `http://localhost:11434/v1` with `model_name: "mistral"`.
{{< /tab >}}
{{< tab "No Docker" >}}
```bash
make -C deploy local-setup     # downloads native Qdrant, llama.cpp, and GGUF models
make -C deploy local-start
make -C deploy local-status
```
{{< /tab >}}
{{< /tabs >}}

The compose profiles are `full`, `core`, and `minimal` (Qdrant only). A bare `docker compose up` starts nothing, because every service belongs to a profile — use the `make` targets or pass `--profile`.

| Image | Pinned version |
|---|---|
| Qdrant | `qdrant/qdrant:v1.12.4` |
| Embeddings | `ghcr.io/huggingface/text-embeddings-inference:cpu-1.5` serving `BAAI/bge-large-en-v1.5` |
| LLM | `vllm/vllm-openai` serving `mistralai/Mistral-7B-Instruct-v0.2` as `mistral-7b` |

The vLLM image is tagged `latest` in the compose file. For anything you need to reproduce — and always for air-gapped transfer — pin it to a specific version.

### Check they respond

```bash
curl -sf http://localhost:6333/healthz && echo qdrant ok
curl -sf http://localhost:8080/health  && echo embeddings ok
curl -sf http://localhost:8000/v1/models | head -c 200
```

MagicAF's own health checks only look for a 2xx status, so a plain-text body from Qdrant is expected.

## Hardware

| Tier | CPU | RAM | GPU | Good for |
|---|---|---|---|---|
| Minimum | 4 cores | 8 GB | none | Qdrant + embeddings, with a small LLM through Ollama |
| Development | 8 cores | 16 GB | 8 GB+ VRAM | The full stack with a quantized 7B model |
| Production | 16+ cores | 64 GB+ | 24 GB+ VRAM | FP16 models, concurrent users, large collections |

The compose file's default memory limits — 4 GB embeddings, 2 GB Qdrant, 32 GB LLM — are set in `deploy/docker/.env.example`. [Choosing Models](/docs/decision-guides/choosing-models/) maps specific models to hardware.

