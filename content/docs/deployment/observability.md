---
title: "Observability"
description: "Structured logging, health checks, and metrics for production MagicAF deployments."
weight: 4
tags: [deployment, logging, tracing, metrics, health-checks]
categories: [deployment]
difficulty: intermediate
prerequisites: [/docs/getting-started/quickstart/]
estimated_reading_time: "7 min"
last_reviewed: "2026-02-12"
---

MagicAF provides built-in observability through structured logging, health checks, and tracing instrumentation.

## Structured Logging

MagicAF uses the `tracing` ecosystem. All public methods are annotated with `#[instrument]` and emit structured spans with contextual fields.

### Basic Setup

```rust
tracing_subscriber::fmt()
    .json()
    .with_env_filter("info,magicaf=debug")
    .init();
```

This produces JSON-formatted log lines with fields like:

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "level": "INFO",
  "target": "magicaf_core::rag",
  "message": "Searching vector store",
  "span": { "collection": "my_docs" },
  "fields": { "top_k": 10 }
}
```

### Structured Fields

| Span | Fields |
|------|--------|
| `RAGWorkflow::run` | `collection` |
| `VectorStore::search` | `collection`, `limit` |
| `VectorStore::index` | `collection`, `count` |
| `EmbeddingService::embed` | `count` (number of inputs) |
| `LlmService::chat` | `model`, `messages` (count) |

### Production Configuration

For production, attach a subscriber that ships spans to your observability stack:

```rust
use tracing_subscriber::prelude::*;

tracing_subscriber::registry()
    .with(tracing_subscriber::fmt::layer().json())
    .with(tracing_subscriber::EnvFilter::from_default_env())
    // Add OpenTelemetry layer for distributed tracing
    // .with(tracing_opentelemetry::layer().with_tracer(tracer))
    .init();
```

## Health Checks

All infrastructure services expose health check methods:

```rust
// Check all services
embedder.health_check().await?;
llm.health_check().await?;
```

Integrate these into your orchestrator's readiness probes:

```rust
async fn readiness_check(
    embedder: &impl EmbeddingService,
    llm: &impl LlmService,
) -> bool {
    let embed_ok = embedder.health_check().await.is_ok();
    let llm_ok = llm.health_check().await.is_ok();
    embed_ok && llm_ok
}
```

Health check failures return `MagicError::HealthCheckFailed` with the service name and URL.

## Metrics

Instrument your application with `tracing` spans and export to Prometheus or OpenTelemetry:

```toml
[dependencies]
tracing-opentelemetry = "0.22"
opentelemetry = "0.21"
opentelemetry-prometheus = "0.14"
```

Key metrics to track:

| Metric | Source | What It Tells You |
|--------|--------|-------------------|
| Embedding latency | `embed` / `embed_single` spans | Model server performance |
| Search latency | `search` spans | Vector store performance |
| LLM latency | `chat` spans | Inference server performance |
| Token usage | `RAGResult.usage` | Cost and context window utilization |
| Evidence count | `RAGResult.evidence_count` | Retrieval quality |
| Error rate by code | `MagicError::error_code()` | Service reliability breakdown |

## Log Shipping

Ship logs to your SIEM / ELK / Splunk stack via:

- **stdout capture** — container orchestrators (Docker, Kubernetes) capture stdout
- **File output** — write to a log file with rotation
- **Direct export** — use `tracing-subscriber` layers for Jaeger, OTLP, etc.

### Example: File Output

```rust
use tracing_subscriber::fmt;
use std::fs::File;

let log_file = File::create("/var/log/magicaf/app.log")?;

tracing_subscriber::fmt()
    .json()
    .with_writer(log_file)
    .with_env_filter("info,magicaf=debug")
    .init();
```

## Audit Trail

MagicAF's adapter traits provide natural injection points for audit logging:

```rust
#[async_trait]
impl EvidenceFormatter for AuditedFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> Result<String> {
        // Log what evidence was retrieved (for audit trail)
        tracing::info!(
            evidence_count = results.len(),
            ids = ?results.iter().map(|r| &r.id).collect::<Vec<_>>(),
            "Evidence retrieved for RAG query"
        );

        // Proceed with formatting
        self.inner.format_evidence(results).await
    }
}
```
