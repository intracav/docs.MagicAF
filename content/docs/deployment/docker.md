---
title: "Docker Compose"
description: "Reference Docker Compose configuration for deploying all MagicAF infrastructure services."
weight: 1
---

A MagicAF deployment requires three local services. Here's a reference Docker Compose configuration that starts all of them.

## Infrastructure Components

| Service | Default Port | Purpose | Example Software |
|---------|-------------|---------|-----------------|
| Embedding server | `8080` | Dense vector embeddings | text-embeddings-inference, llama.cpp, vLLM |
| Vector database | `6333` | Similarity search | Qdrant |
| LLM server | `8000` | Chat completion / generation | vLLM, llama.cpp, TGI, Ollama |

All three communicate via HTTP REST. No gRPC, no cloud SDK, no vendor library is required at the network level.

## Reference `docker-compose.yml`

```yaml
version: "3.9"

services:
  qdrant:
    image: qdrant/qdrant:v1.9.4
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

  embedding:
    image: ghcr.io/huggingface/text-embeddings-inference:1.2
    ports:
      - "8080:80"
    volumes:
      - ./models/embedding:/data
    command: --model-id /data --port 80

  llm:
    image: vllm/vllm-openai:latest
    ports:
      - "8000:8000"
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

## Environment Variables

```bash
# Embedding service
EMBEDDING_URL=http://embedding:8080
EMBEDDING_MODEL=bge-large-en-v1.5

# Vector store
QDRANT_URL=http://qdrant:6333
# QDRANT_API_KEY=  (optional)

# LLM service
LLM_URL=http://llm:8000/v1
LLM_MODEL=mistral-7b
# LLM_API_KEY=  (optional)
```

> **Note:** When running inside Docker Compose, use service names (`qdrant`, `embedding`, `llm`) as hostnames. When running natively, use `localhost`.

## Starting Services

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f

# Stop
docker compose down
```

## GPU Configuration

The LLM service requires GPU access for reasonable inference speed. Modify the `deploy` section based on your hardware:

```yaml
# Single GPU
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]

# Specific GPU by ID
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          device_ids: ["0"]
          capabilities: [gpu]
```

For CPU-only deployment, remove the `deploy` section and use a CPU-compatible LLM server like Ollama or llama.cpp.

## Model Directory Structure

```
./models/
├── embedding/
│   └── bge-large-en-v1.5/    # HuggingFace model directory
└── llm/
    └── Mistral-7B-Instruct-v0.2/  # Model weights
```
