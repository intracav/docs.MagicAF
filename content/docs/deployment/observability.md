---
title: "Observability"
description: "Operate MagicAF in production: JSON logs, the built-in Prometheus metrics and what to alert on, startup health gating, and audit events."
weight: 4
tags: [deployment, observability, logging, metrics, health-checks, audit]
categories: [deployment]
difficulty: intermediate
---

MagicAF emits three kinds of signal: **structured logs** through `tracing`, **metrics** through OpenTelemetry with a Prometheus exporter, and **audit events** through an `AuditLogger` you choose. This page is about running them in production; the type-level reference is in [Observability (API)](/docs/api-reference/core/observability/).

## A production startup

```rust
use std::sync::Arc;

use magicaf_core::embeddings::{EmbeddingService, LocalEmbeddingService};
use magicaf_core::health::{HealthGate, Named, NamedHealthcheck};
use magicaf_core::llm::LlmService;
use magicaf_core::metrics::metrics_handler;
use magicaf_core::prelude::*;
use magicaf_core::telemetry::init_logging_with_metrics;
use magicaf_local_llm::LocalLlmService;
use magicaf_qdrant::QdrantVectorStore;
use serde_json::json;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // JSON logs filtered by RUST_LOG, plus a Prometheus registry for /metrics.
    let registry = init_logging_with_metrics();

    let embedder = Arc::new(LocalEmbeddingService::new(serde_json::from_value(json!({
        "base_url": "http://localhost:8080", "model_name": "bge-large-en-v1.5"
    }))?)?);
    let store = Arc::new(QdrantVectorStore::new(serde_json::from_value(json!({
        "base_url": "http://localhost:6333"
    }))?).await?);
    let llm = Arc::new(LocalLlmService::new(LlmConfig {
        base_url: "http://localhost:8000/v1".into(),
        model_name: "mistral-7b".into(),
        ..Default::default()
    })?);

    // Refuse to start until every dependency answers (3 attempts, 1 s apart).
    let (e, s, l) = (embedder.clone(), store.clone(), llm.clone());
    let embedding = Named::new("embedding", move || { let e = e.clone(); async move { e.health_check().await } });
    let qdrant = Named::new("qdrant", move || { let s = s.clone(); async move { s.health_check().await } });
    let model = Named::new("llm", move || { let l = l.clone(); async move { l.health_check().await } });
    let checks: [&dyn NamedHealthcheck; 3] = [&embedding, &qdrant, &model];
    let report = HealthGate::verify_all(&checks).await?;
    tracing::info!(?report.results, "dependencies ready");

    // Serve `metrics_handler(&registry)` as text/plain at GET /metrics.
    println!("{}", metrics_handler(&registry));
    Ok(())
}
```

## Logs

The `telemetry` helpers install a JSON subscriber filtered by `RUST_LOG`:

```bash
RUST_LOG=info,magicaf=debug ./my-app
```

Use `init_logging_with_pii_filter()` instead of `init_logging()` when logs may contain user text: it rewrites email addresses, US Social Security numbers, card numbers, and IPv4 addresses to placeholder tokens before writing. It is pattern-based — a safety net, not a guarantee — so still avoid logging raw content.

Logs go to stderr. In containers, let the runtime collect them; elsewhere, use your init system or a `tracing-appender` layer for files and rotation. To export traces to an OpenTelemetry collector, build your own subscriber with a `tracing-opentelemetry` layer rather than calling the helpers.

## Metrics

Mount `metrics_handler(&registry)` at `GET /metrics` and scrape it. The metrics that matter most in operation:

| Watch | Metric | Alert when |
|---|---|---|
| End-to-end latency | `rag_pipeline_duration_seconds` | p95 exceeds your latency budget |
| Model latency | `llm_request_duration_seconds`, `llm_stream_ttft_seconds` | Time to first token climbs — the model server is saturated |
| Retrieval latency | `vector_search_duration_seconds` | p95 above ~100 ms on Qdrant usually means memory pressure |
| Embedding health | `embedding_requests_total{status!="ok"}` | Any sustained error rate |
| Token spend | `llm_tokens_total` by `model` and `type` | Unexpected growth — a prompt or `top_k` change |
| Circuit breakers | `circuit_breaker_state` | Any value of 1 (open) |
| Retries | `retry_attempts_total` | Rising rate — a dependency is degrading before it fails |
| Prompt injection | `prompt_injection_detections_total` | Any spike |

The full list with labels is in the [API reference](/docs/api-reference/core/observability/#built-in-metrics).

## Health checks

Every service has an async `health_check()`. Gate startup on them with `HealthGate::verify_all`, as above, so a pod never reports ready while a dependency is down. For an orchestrator's readiness probe, run the same checks with a single attempt — `HealthGate::verify_all_with_attempts(&checks, 1, 0)` — so the probe answers quickly.

A failed gate returns a `ConfigError` naming each unhealthy service; `HealthReport.results` holds the per-service outcome.

## Audit events

Set `.audit_logger(...)` on a `RAGWorkflow` and every run emits an `AuditEvent`: the outcome (success, failure, or blocked), duration, collection, evidence count, and a **SHA-256 hash of the query** instead of the query itself — enough to correlate and count without storing user text.

| Logger | Writes |
|---|---|
| `TracingAuditLogger` | A structured `tracing` event, which flows to your logs |
| `JsonAuditLogger::new(path)` | One JSON object per line, appended to a file |
| Your own `AuditLogger` | Anywhere — a database, a message queue, a SIEM |

Prompt-injection blocks are audited as `Blocked`, so attempted misuse shows up alongside ordinary failures.
