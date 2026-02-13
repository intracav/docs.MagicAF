---
title: "Tutorial: Air-Gapped Deployment"
description: "Walk through a complete prepare-transfer-build-verify cycle for deploying MagicAF in a disconnected defense lab."
weight: 3
tags: [tutorial, air-gapped, deployment, advanced, defense, classified, offline]
categories: [tutorial]
difficulty: advanced
prerequisites:
  - /docs/tutorials/custom-adapters/
  - /docs/deployment/docker/
estimated_reading_time: "20 min"
last_reviewed: "2026-02-12"
---

{{< difficulty "advanced" >}}

{{< prerequisites >}}
- You have completed [Tutorial: Custom Adapters](/docs/tutorials/custom-adapters/)
- You are familiar with Docker and `docker compose`
- You have access to both an internet-connected workstation and a disconnected target host
{{< /prerequisites >}}

## The Scenario

You are an engineer at a defense research lab. Your team has built a MagicAF-based document analysis pipeline that works perfectly on your internet-connected development machine. Now you need to deploy it to a classified network with **zero internet access** — no package registries, no container registries, no model hubs.

Everything that crosses the air gap must be transferred on approved physical media (USB drive, burned disc, or cross-domain solution). You need to prepare all artifacts on the connected side, transfer them, and verify the deployment on the disconnected side.

This tutorial walks through the complete cycle: **prepare → transfer → build → verify**.

---

## Phase 1 — Prepare (Internet-Connected Machine)

### 1.1 Vendor Rust Dependencies

Cargo normally downloads crates from crates.io. In an air-gapped environment, that is not possible. The `cargo vendor` command downloads all dependencies into a local directory:

```bash
cd /path/to/your-magicaf-project

# Download all crate dependencies into vendor/
cargo vendor > .cargo/config.toml
```

This creates two things:
- A `vendor/` directory containing every crate your project depends on
- A `.cargo/config.toml` that tells Cargo to use the vendor directory instead of the network

**Verify** that the project builds from vendored sources:

```bash
# This should succeed with no network access
cargo build --release --offline
```

If it fails, you have a missing dependency. Fix it while you still have internet.

### 1.2 Save Docker Images

Your deployment needs three container images. Save them as tarballs:

```bash
# Pull the exact versions you want
docker pull qdrant/qdrant:v1.9.4
docker pull ghcr.io/huggingface/text-embeddings-inference:1.2
docker pull vllm/vllm-openai:latest

# Save as tarballs
docker save qdrant/qdrant:v1.9.4 -o qdrant-v1.9.4.tar
docker save ghcr.io/huggingface/text-embeddings-inference:1.2 -o tei-1.2.tar
docker save vllm/vllm-openai:latest -o vllm-openai.tar
```

**Why pin versions?** On a classified network, you cannot easily fix "latest tag changed and broke everything." Pin every image to a specific version or digest.

### 1.3 Download Models

Download the model weights you need:

```bash
# Embedding model (~1.3 GB)
huggingface-cli download BAAI/bge-large-en-v1.5 \
    --local-dir ./transfer/models/embedding/bge-large-en-v1.5

# LLM model (~4.1 GB for Q4 quantized, ~14 GB for full weights)
huggingface-cli download mistralai/Mistral-7B-Instruct-v0.2 \
    --local-dir ./transfer/models/llm/Mistral-7B-Instruct-v0.2
```

For GGUF-quantized models (smaller, CPU-friendly):

```bash
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.Q4_K_M.gguf \
    -O ./transfer/models/llm/mistral-7b-instruct-v0.2.Q4_K_M.gguf
```

### 1.4 Compute Checksums

Integrity verification is mandatory for classified transfers. Generate checksums for everything:

```bash
cd ./transfer
find . -type f -exec sha256sum {} \; > MANIFEST.sha256
```

### 1.5 Assemble the Transfer Package

```
transfer/
├── MANIFEST.sha256
├── source/
│   ├── your-magicaf-project/    # Full source including vendor/
│   └── docker-compose.yml
├── images/
│   ├── qdrant-v1.9.4.tar
│   ├── tei-1.2.tar
│   └── vllm-openai.tar
└── models/
    ├── embedding/
    │   └── bge-large-en-v1.5/
    └── llm/
        └── Mistral-7B-Instruct-v0.2/
```

**Total size:** approximately 8–20 GB depending on model choices.

---

## Phase 2 — Transfer

Transfer the package to the air-gapped host using your organization's approved cross-domain transfer procedure. This typically involves:

1. Copying to approved removable media
2. Malware scanning at the transfer station
3. Importing onto the classified network
4. Verifying checksums on the other side

```bash
# On the air-gapped host, after receiving the transfer package:
cd /path/to/transfer
sha256sum -c MANIFEST.sha256
```

Every checksum must pass. If any file is corrupted, request a re-transfer before proceeding.

---

## Phase 3 — Build (Air-Gapped Host)

### 3.1 Load Docker Images

```bash
docker load -i images/qdrant-v1.9.4.tar
docker load -i images/tei-1.2.tar
docker load -i images/vllm-openai.tar

# Verify they loaded
docker images | grep -E "qdrant|tei|vllm"
```

### 3.2 Start Infrastructure Services

Copy the `docker-compose.yml` and models directory, then bring up services:

```bash
cp source/docker-compose.yml /opt/magicaf/
cp -r models/ /opt/magicaf/models/

cd /opt/magicaf
docker compose up -d
```

Your `docker-compose.yml` should reference local model paths:

```yaml
version: "3.9"
services:
  qdrant:
    image: qdrant/qdrant:v1.9.4
    ports:
      - "127.0.0.1:6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  embedding:
    image: ghcr.io/huggingface/text-embeddings-inference:1.2
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - ./models/embedding/bge-large-en-v1.5:/data
    command: --model-id /data --port 80

  llm:
    image: vllm/vllm-openai:latest
    ports:
      - "127.0.0.1:8000:8000"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    volumes:
      - ./models/llm:/models
    command: >
      --model /models/Mistral-7B-Instruct-v0.2
      --served-model-name mistral-7b
      --host 0.0.0.0
      --port 8000

volumes:
  qdrant_data:
```

**Security note:** All ports bind to `127.0.0.1` — the services are only accessible from the local machine, not from the network.

### 3.3 Build the Application

```bash
cd /path/to/source/your-magicaf-project

# Build using vendored dependencies — no network needed
cargo build --release --offline
```

This compiles your entire application and all dependencies from the local `vendor/` directory. The `--offline` flag ensures Cargo does not attempt any network access.

---

## Phase 4 — Verify

### 4.1 Service Health Checks

```bash
# Qdrant
curl -s http://localhost:6333/healthz
# Expected: {"title":"qdrant - vectorass engine","version":"1.9.4"}

# Embedding server
curl -s http://localhost:8080/health
# Expected: {"status":"ok"}

# LLM server
curl -s http://localhost:8000/v1/models
# Expected: JSON listing the loaded model
```

### 4.2 Application Health Check

Add a health check to your application startup:

```rust
// Verify all services before processing any data
embedder.health_check().await
    .expect("Embedding service unreachable");
llm.health_check().await
    .expect("LLM service unreachable");

println!("All services healthy — ready to process queries");
```

### 4.3 End-to-End Test

Run a simple query to verify the entire pipeline works:

```bash
./target/release/your-app --query "Test query" --collection "test"
```

If the query returns a reasonable answer, your air-gapped deployment is operational.

---

## Troubleshooting

### `cargo build` fails with "can't find crate"

A dependency was missed during `cargo vendor`. Go back to the connected machine, run `cargo vendor` again after ensuring `Cargo.lock` is up to date, and re-transfer.

### Docker images fail to load

The tarball may be corrupted. Verify the SHA-256 checksum matches the manifest. If not, re-transfer.

### Embedding server starts but returns errors

Check that the model files are complete. Embedding models typically need several files (`config.json`, `model.safetensors`, `tokenizer.json`, etc.). An incomplete download will cause runtime errors.

### LLM server fails with "CUDA out of memory"

The model is too large for your GPU. Options:
- Use a quantized model (Q4_K_M reduces memory by ~4x)
- Use CPU inference with llama.cpp (slower but works without GPU)
- Use a smaller model (Phi-2, TinyLlama)

### Can I use Podman instead of Docker?

Yes. Replace `docker` commands with `podman` equivalents. `podman load`, `podman-compose`, and `podman save` work identically for this use case.

---

## Checklist

- [ ] `cargo build --release --offline` succeeds on the connected machine
- [ ] All Docker images saved with pinned versions
- [ ] Model weights downloaded completely
- [ ] SHA-256 manifest generated
- [ ] Checksums verified on the air-gapped host
- [ ] Docker images loaded successfully
- [ ] All three services pass health checks
- [ ] Application builds from vendored sources
- [ ] End-to-end test query returns a valid result
- [ ] All service ports bind to `127.0.0.1` only

---

## Next Steps

- **[Deployment: Security →](/docs/deployment/security/)** — hardening checklist for classified environments
- **[Deployment: Observability →](/docs/deployment/observability/)** — set up logging and monitoring
- **[Decision Guide: Deployment Strategy →](/docs/decision-guides/deployment-strategy/)** — compare deployment options
