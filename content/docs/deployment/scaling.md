---
title: "Scaling"
description: "Scale each tier independently: embedding and LLM servers behind load balancers, Qdrant in distributed mode, and stateless application instances — plus the per-process limits that matter when you do."
weight: 5
tags: [deployment, scaling, horizontal, load-balancing, qdrant-cluster]
categories: [deployment]
difficulty: advanced
prerequisites: [/docs/deployment/docker/]
---

A MagicAF application holds no conversation or index state of its own — the vector store holds the index, and the model servers hold the models — so each tier scales on its own terms.

| Tier | How it scales | Usually the bottleneck when |
|---|---|---|
| LLM server | More GPUs per node (vLLM tensor parallelism), more nodes behind a load balancer | Almost always — generation dominates request time |
| Embedding server | Replicas behind a load balancer | Bulk indexing, or very high query rates |
| Qdrant | Distributed mode: sharding and replication | Collections in the tens of millions of vectors, or heavy filtering |
| Your application | More instances | Rarely — it mostly waits on the network |

## Model servers

MagicAF connects to one URL per service, so put a load balancer (nginx, HAProxy, Envoy, or a Kubernetes Service) in front of a pool of identical replicas and point `base_url` at it. vLLM batches concurrent requests on each node; scale out when time to first token (`llm_stream_ttft_seconds`) climbs under load. For a model too large for one GPU, raise `--tensor-parallel-size` — `LLM_GPU_COUNT` in the compose file — before adding nodes.

Every replica behind one URL must serve the **same model under the same name**, and every embedding replica the same embedding model, or results will be inconsistent.

## Qdrant

Qdrant runs as a cluster with built-in sharding and replication; follow [Qdrant's distributed deployment guide](https://qdrant.tech/documentation/guides/distributed_deployment/). MagicAF talks to any node over REST and needs no changes. For large collections, `recreate_with_quantization` creates a collection with scalar or binary quantization to cut memory.

## Application instances

Build one `RAGWorkflow` per process at startup and share it across requests — it is `Send + Sync`, and `run` takes `&self`:

```rust
let workflow = std::sync::Arc::new(build_workflow().await?);
// clone the Arc into each request handler
```

## Per-process limits

Each service client enforces its own resilience limits, configured per service. They apply **per process**: ten instances, each with the default limit of 10 concurrent requests, can send 100 at once.

| Setting | Where | Use it to |
|---|---|---|
| `rate_limit` | Every service config | Cap concurrent requests from this process, protecting a shared server |
| `circuit_breaker` | Every service config | Stop calling a failing service for a cool-down period |
| `retry` | Every service config | Retry transient failures with exponential backoff |
| `connection_pool` | Every service config | Bound idle connections and their lifetime |
| `parallel_batches` | `EmbeddingConfig` | Send several embedding batches at once during bulk indexing |

Size the per-process limits so that *instances × limit* stays within what each server can absorb. [Resilience](/docs/api-reference/core/resilience/) documents every field.
