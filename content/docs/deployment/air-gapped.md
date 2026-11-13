---
title: "Air-Gapped Setup"
description: "Prepare everything on a connected machine — toolchain, vendored crates including MagicAF, container images, and model weights — then build and run on a network with no internet."
weight: 2
keywords: [air-gapped, airgapped, offline AI, disconnected AI, isolated network deployment, cargo vendor, secure deployment]
tags: [deployment, air-gapped, offline, cargo-vendor]
categories: [deployment]
difficulty: advanced
prerequisites: [/docs/deployment/docker/]
---

MagicAF's services only call the endpoints you configure, so once everything they need is on the isolated host, nothing needs the internet. The work is in the preparation: on a connected machine, collect the toolchain, every crate, every container image, and every model, then carry them across.

{< callout type="info" title="What crosses the boundary" >}
| Artifact | Approximate size |
|---|---|
| Rust 1.91.1 standalone installer | 300 MB |
| Your application source with `vendor/` (includes MagicAF) | 200–500 MB |
| Container images: Qdrant, text-embeddings-inference, vLLM | 0.1 GB, 1 GB, 8–10 GB |
| Embedding model weights (bge-large-en-v1.5) | 1.3 GB |
| LLM weights | 4–15 GB for a 7B model, depending on precision |
{< /callout >}

## 1. The toolchain

`rustup` downloads toolchains, so on the isolated host use the standalone installer instead. Download `rust-1.91.1-<target>.tar.xz` (for example `x86_64-unknown-linux-gnu`) from the [standalone installers page](https://forge.rust-lang.org/infra/other-installation-methods.html#standalone-installers), verify its signature, and install it on the host:

```bash
tar xf rust-1.91.1-x86_64-unknown-linux-gnu.tar.xz
sudo ./rust-1.91.1-x86_64-unknown-linux-gnu/install.sh
rustc --version   # rustc 1.91.1
```

## 2. Vendor every crate

Run this in **your application's** directory on the connected machine, after `cargo build` succeeds there:

```bash
mkdir -p .cargo
cargo vendor --locked > .cargo/config.toml
```

`cargo vendor` copies every dependency into `vendor/` — including the MagicAF crates you depend on by git URL — and writes the source replacements to `.cargo/config.toml`. Prove it works before you transfer:

```bash
cargo build --release --offline --locked
```

Copy the whole project directory, `vendor/` and `.cargo/` included.

## 3. Save the container images

Use the exact tags from the compose file, and pin vLLM to a version rather than `latest`:

```bash
docker pull qdrant/qdrant:v1.12.4
docker pull ghcr.io/huggingface/text-embeddings-inference:cpu-1.5
docker pull vllm/vllm-openai:<version>

docker save qdrant/qdrant:v1.12.4 \
  ghcr.io/huggingface/text-embeddings-inference:cpu-1.5 \
  vllm/vllm-openai:<version> | gzip > magicaf-images.tar.gz
```

On the host: `docker load < magicaf-images.tar.gz`. If you pinned vLLM, set the same tag in the compose file.

## 4. Download the models

```bash
huggingface-cli download BAAI/bge-large-en-v1.5 --local-dir ./models/embedding
huggingface-cli download mistralai/Mistral-7B-Instruct-v0.2 --local-dir ./models/llm
find ./models -type f -exec sha256sum {} \; > MODEL_MANIFEST.sha256
```

Transfer `./models/` and the manifest, then on the host run `sha256sum -c MODEL_MANIFEST.sha256` before anything loads them.

## 5. Run the services from local weights

The repository's compose file downloads models from the Hugging Face Hub on first start. On an isolated host, add an override that mounts your local copies and tells both servers not to try the network:

```yaml
# deploy/docker/docker-compose.airgap.yml — serve weights from local disk,
# never from the Hugging Face Hub.
services:
  embedding:
    volumes:
      - ${EMBEDDING_MODEL_DIR:-/models/embedding}:/models/embedding:ro
    environment:
      - HF_HUB_OFFLINE=1
    command: >
      --model-id /models/embedding
      --port 80
      --max-client-batch-size 64
      --max-batch-tokens 16384
  llm:
    volumes:
      - ${LLM_MODEL_DIR:-/models/llm}:/models/llm:ro
    environment:
      - HF_HUB_OFFLINE=1
    command: >
      --model /models/llm
      --served-model-name ${MAGICAF_LLM_MODEL:-mistral-7b}
      --host 0.0.0.0
      --port 8000
      --max-model-len ${LLM_MAX_MODEL_LEN:-8192}
      --tensor-parallel-size ${LLM_GPU_COUNT:-1}
```

```bash
cd deploy/docker
EMBEDDING_MODEL_DIR=/srv/models/embedding LLM_MODEL_DIR=/srv/models/llm \
  docker compose -f docker-compose.yml -f docker-compose.airgap.yml --profile full up -d
```

`.env.example` mentions `EMBEDDING_MODEL_DIR` and `LLM_MODEL_DIR`, but the base compose file does not use them; this override is what wires them in.

## 6. Verify

```bash
make -C deploy docker-health
```

Then check from your application at startup, so a missing service fails fast instead of on the first request:

```rust
use magicaf_core::embeddings::EmbeddingService;
use magicaf_core::llm::LlmService;

embedder.health_check().await?;
store.health_check().await?;   // QdrantVectorStore
llm.health_check().await?;
```

`HealthGate` wraps checks like these with retries — three attempts, a second apart — and reports every service's status at once; see [Observability](/docs/deployment/observability/#health-checks).

## Without Docker

If the host cannot run containers, two options remain:

- **Native binaries.** `make -C deploy local-setup` downloads Qdrant, `llama.cpp`, and GGUF models for the current platform; run it on a connected machine of the same OS and architecture, transfer the result, and start the services with `make -C deploy local-start`.
- **No vector database.** `InMemoryVectorStore` keeps the index in your process and can `save` it to and `load` it from a file, so you can build the index on a connected machine and ship the file. See [Edge and mobile](/docs/deployment/edge-mobile/).

---

## FAQ

### How do I update models on an air-gapped network?

Follow the same transfer process: download the new model weights on the connected machine, compute checksums, transfer via approved media, verify checksums, and swap the model directory. Restart the embedding or LLM server to load the new weights. If you change the embedding model, you must also re-embed every document — vectors from different models are not comparable. Changing the LLM needs no re-indexing.

### What if the offline build tries to reach the network?

This typically happens when `Cargo.lock` is out of date. On the connected machine, run `cargo update` followed by `cargo vendor` to ensure all resolved dependencies are captured. Verify with `cargo build --release --offline` before transferring. If a build-time dependency (proc-macro, build script) triggers a network fetch, check for `build-dependencies` in your dependency tree with `cargo tree -e build`.

### Can I use Podman instead of Docker?

Yes. Podman is a drop-in replacement for Docker in this context. Replace `docker save` with `podman save`, `docker load` with `podman load`, and `docker compose` with `podman-compose`. All other steps remain the same. Podman's rootless mode also reduces what a compromised container can reach.

### How do I verify model integrity after transfer?

Generate SHA-256 checksums for all model files before transfer:

```bash
find ./models -type f -exec sha256sum {} \; > MODEL_MANIFEST.sha256
```

After transfer, verify on the air-gapped host:

```bash
sha256sum -c MODEL_MANIFEST.sha256
```

Your organization may require further procedures, such as two-person verification of transfer media.
