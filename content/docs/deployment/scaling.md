---
title: "Scaling"
description: "Horizontal scaling strategies for each MagicAF component."
weight: 5
---

MagicAF applications are stateless by design. Every component can be scaled independently.

## Scaling Strategy

| Component | Strategy | Notes |
|-----------|----------|-------|
| **Embedding** | Horizontal: N replicas behind a load balancer | CPU or GPU instances |
| **Qdrant** | Distributed mode (built-in clustering) | Sharding + replication |
| **LLM** | Horizontal: multiple GPU nodes behind a load balancer | vLLM supports tensor parallelism |
| **Application** | Horizontal: stateless, scale freely | Each instance gets its own `RAGWorkflow` |

## Embedding Service Scaling

Embedding is typically the most CPU/GPU-bound operation. Scale by running multiple replicas:

```yaml
services:
  embedding:
    image: ghcr.io/huggingface/text-embeddings-inference:1.2
    deploy:
      replicas: 3
    # ...
```

Use a load balancer (nginx, HAProxy, or service mesh) in front. MagicAF connects to a single URL, so point `EMBEDDING_URL` at the load balancer.

## Qdrant Scaling

Qdrant supports distributed mode with built-in sharding and replication:

```bash
# Start a Qdrant cluster
docker compose up -d qdrant-node-1 qdrant-node-2 qdrant-node-3
```

See the [Qdrant distributed deployment docs](https://qdrant.tech/documentation/guides/distributed_deployment/) for cluster configuration.

## LLM Scaling

For high-throughput deployments:

- **vLLM**: Supports tensor parallelism across multiple GPUs on a single node
- **Multiple nodes**: Run separate vLLM instances and load balance
- **Batching**: vLLM automatically batches concurrent requests for efficiency

```yaml
services:
  llm:
    image: vllm/vllm-openai:latest
    deploy:
      replicas: 2
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

## Application Scaling

MagicAF applications are stateless — each instance constructs its own `RAGWorkflow` with the same configuration:

```rust
// Each application instance creates its own workflow
let workflow = RAGWorkflow::builder()
    .embedding_service(LocalEmbeddingService::new(config)?)
    .vector_store(QdrantVectorStore::new(vector_config).await?)
    .llm_service(LocalLlmService::new(llm_config)?)
    // ...
    .build()?;
```

Scale horizontally with your orchestrator of choice (Kubernetes, Docker Swarm, systemd, etc.).
