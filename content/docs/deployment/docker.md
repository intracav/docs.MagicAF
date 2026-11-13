---
title: "Docker Compose"
description: "Run the embedding server, Qdrant, and an LLM server with the MagicAF repository's compose file, and package your own application as an image."
weight: 1
tags: [deployment, docker, compose, gpu, infrastructure]
categories: [deployment]
difficulty: beginner
prerequisites: [/docs/getting-started/prerequisites/]
---

The MagicAF repository ships a Docker Compose file for the three services a retrieval pipeline needs, with pinned images, health checks, restart policies, and memory limits. It lives at `deploy/docker/docker-compose.yml`, and the `deploy/Makefile` wraps it.

## Profiles

Every service belongs to a profile, so choose one — a bare `docker compose up` starts nothing.

| Profile | Starts | Needs |
|---|---|---|
| `full` | Qdrant, embeddings, vLLM | An NVIDIA GPU and the NVIDIA Container Toolkit |
| `core` | Qdrant, embeddings | CPU only — bring your own LLM server |
| `minimal` | Qdrant | Bring your own embedding and LLM servers |

```bash
make -C deploy docker-full       # or docker-core, docker-minimal
make -C deploy docker-health     # exits 0 when every running service is healthy
make -C deploy docker-ps
make -C deploy docker-logs
make -C deploy docker-down
```

The equivalent without `make` is `docker compose --profile full up -d`, run from `deploy/docker`.

## Services

| Service | Image | Host port | Health check | Memory limit |
|---|---|---|---|---|
| `qdrant` | `qdrant/qdrant:v1.12.4` | 6333 (REST), 6334 (gRPC) | `/healthz` | 2 GB |
| `embedding` | `ghcr.io/huggingface/text-embeddings-inference:cpu-1.5` | 8080 → container 80 | `/health` | 4 GB |
| `llm` | `vllm/vllm-openai:latest` | 8000 | `/health` | 32 GB |

`embedding` and `llm` wait for Qdrant to report healthy. The embedding server allows 60 seconds to start and vLLM three minutes, because both download weights on first run into the `embedding_cache` and `llm_cache` volumes.

## Configuration

Copy `deploy/docker/.env.example` to `deploy/docker/.env` and edit. The variables the compose file reads:

| Variable | Default | Controls |
|---|---|---|
| `EMBEDDING_MODEL_ID` | `BAAI/bge-large-en-v1.5` | The model the embedding server loads |
| `LLM_MODEL_ID` | `mistralai/Mistral-7B-Instruct-v0.2` | The model vLLM loads |
| `MAGICAF_LLM_MODEL` | `mistral-7b` | The name vLLM serves it under — use this as `model_name` in `LlmConfig` |
| `LLM_GPU_COUNT` | 1 | GPUs reserved, and vLLM's tensor-parallel size |
| `LLM_MAX_MODEL_LEN` | 8192 | Context length |
| `QDRANT_API_KEY` | empty | Qdrant API key; set the same value in `VectorStoreConfig.api_key` |
| `HF_TOKEN` | empty | For gated models on Hugging Face |
| `*_PORT`, `*_MEMORY_LIMIT`, `QDRANT_STORAGE_DIR` | see above | Host ports, limits, and where Qdrant stores data |

Pin `vllm/vllm-openai` to a specific version before production; `latest` will change under you.

## Connecting your application

From the host, use `localhost` and the published ports — the same URLs as [Prerequisites](/docs/getting-started/prerequisites/). From a container on the same compose network, use service names and **container** ports:

| Service | From the host | From inside the network |
|---|---|---|
| Embeddings | `http://localhost:8080` | `http://embedding:80` |
| Qdrant | `http://localhost:6333` | `http://qdrant:6333` |
| LLM | `http://localhost:8000/v1` | `http://llm:8000/v1` |

`.env.example` also defines `MAGICAF_EMBEDDING_URL`, `MAGICAF_QDRANT_URL`, `MAGICAF_LLM_URL`, and `MAGICAF_LLM_MODEL` with the in-network values. MagicAF does not read them itself; they are a convention for your application to load into its configs.

## Packaging your application

A multi-stage build that compiles your crate — with MagicAF fetched over SSH — and ships only the binary on a slim base:

```dockerfile
# syntax=docker/dockerfile:1
FROM rust:1.91-bookworm AS build
WORKDIR /src
# Cargo fetches MagicAF over SSH; BuildKit forwards your agent for this step only.
RUN mkdir -p -m 0700 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN --mount=type=ssh \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    CARGO_NET_GIT_FETCH_WITH_CLI=true cargo build --release --locked

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
RUN useradd --system --uid 10001 app
COPY --from=build /src/target/release/my-app /usr/local/bin/my-app
USER app
ENTRYPOINT ["/usr/local/bin/my-app"]
```

```bash
DOCKER_BUILDKIT=1 docker build --ssh default -t my-app .
```

`--ssh default` forwards your SSH agent to the one build step that fetches dependencies; the key never lands in an image layer. Replace `my-app` with your binary's name.

To build one of the workspace's own binaries — an example, or `magicaf-server` — from a MagicAF checkout, use `make -C deploy build-app APP=example-minimal-rag`. It runs `deploy/docker/Dockerfile.app`, passing the sibling `helixlang` checkout as a named build context because `magicaf-server` depends on it.

## Without a GPU

Use the `core` profile and run an LLM that works on CPU, such as Ollama or `llama.cpp`'s server. Both expose an OpenAI-compatible API; point `LlmConfig.base_url` at it with `/v1` on the end.

## Next

- [Air-gapped deployment](/docs/deployment/air-gapped/) — moving these images and models onto a network with no internet
- [Observability](/docs/deployment/observability/) — logs, metrics, and health checks
