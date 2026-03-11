---
title: "Observability"
description: "API reference for structured audit logging, OpenTelemetry metrics, and Prometheus integration."
weight: 12
tags: [api, observability, audit, metrics, opentelemetry, prometheus, logging]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/architecture/]
estimated_reading_time: "10 min"
last_reviewed: "2026-03-10"
---

MagicAF provides structured audit logging and OpenTelemetry-based metrics throughout all service clients. Every significant operation (RAG query, health check, GDPR deletion) produces auditable events, and all HTTP calls emit latency histograms and counters.

**Modules:** `magicaf_core::audit`, `magicaf_core::metrics`, `magicaf_core::telemetry`

---

## Audit Logging

### `AuditEventType`

```rust
pub enum AuditEventType {
    RagQuery,
    HealthCheck,
    ServiceStartup,
    ServiceShutdown,
    GdprDeletion {
        entity_id: String,
        collections_cleared: usize,
        collections_failed: usize,
    },
}
```

### `AuditOutcome`

```rust
pub enum AuditOutcome {
    Success,
    Failure { reason: String },
    Blocked { reason: String },
}
```

### `AuditEvent`

```rust
pub struct AuditEvent {
    pub timestamp: DateTime<Utc>,
    pub event_type: AuditEventType,
    pub query_hash: String,             // SHA-256 hex — never the raw query
    pub collection: Option<String>,
    pub evidence_count: Option<usize>,
    pub duration_ms: u64,
    pub outcome: AuditOutcome,
}
```

> **Privacy by design:** The `query_hash` field stores a SHA-256 digest of the query, never the raw text. This allows correlation and deduplication without storing sensitive input.

### `AuditLogger` Trait

```rust
#[async_trait]
pub trait AuditLogger: Send + Sync {
    async fn log(&self, event: &AuditEvent);
}
```

### Implementations

| Implementation | Destination | Format |
|---------------|-------------|--------|
| `TracingAuditLogger` | `tracing` framework (target: `audit`) | Structured fields at INFO level |
| `JsonAuditLogger` | File on disk | JSON-lines (one JSON object per line) |
| `NoopAuditLogger` | Nowhere | No-op for testing |

### `TracingAuditLogger`

Logs audit events as structured tracing spans at the `audit` target. Integrates with any tracing subscriber (stdout, file, OTLP).

```rust
use magicaf_core::audit::TracingAuditLogger;

let logger = TracingAuditLogger;
```

### `JsonAuditLogger`

Appends JSON-lines to a file using `tokio::task::spawn_blocking` for non-blocking I/O.

```rust
use magicaf_core::audit::JsonAuditLogger;

let logger = JsonAuditLogger::new("/var/log/magicaf/audit.jsonl");
```

### `hash_query`

```rust
pub fn hash_query(query: &str) -> String
```

Returns the SHA-256 hex digest of a query string. Used internally by the RAG workflow to populate `AuditEvent::query_hash`.

### Example

```rust
use magicaf_core::audit::{AuditEvent, AuditEventType, AuditOutcome, TracingAuditLogger, AuditLogger};

let logger = TracingAuditLogger;

logger.log(&AuditEvent {
    timestamp: chrono::Utc::now(),
    event_type: AuditEventType::RagQuery,
    query_hash: magicaf_core::audit::hash_query("What is MagicAF?"),
    collection: Some("documents".into()),
    evidence_count: Some(5),
    duration_ms: 142,
    outcome: AuditOutcome::Success,
}).await;
```

---

## OpenTelemetry Metrics

MagicAF uses the OpenTelemetry SDK with a Prometheus exporter to emit metrics from all service clients.

### `init_metrics`

```rust
pub fn init_metrics() -> prometheus::Registry
```

Initializes a Prometheus-backed OpenTelemetry meter provider and sets it as the global provider. Call once at application startup.

### `metrics_handler`

```rust
pub fn metrics_handler(registry: &prometheus::Registry) -> String
```

Renders all collected metrics as Prometheus text format, suitable for a `/metrics` HTTP endpoint.

### Built-in Metrics

All service clients automatically emit these metrics:

| Metric | Type | Labels | Source |
|--------|------|--------|--------|
| `magicaf.retry.count` | Counter | `operation` | `retry.rs` |
| `magicaf.circuit_breaker.state` | Gauge | `service` | `circuit_breaker.rs` |
| `magicaf.rate_limiter.active` | UpDownCounter | `service` | `rate_limiter.rs` |
| `magicaf.prompt_guard.detections` | Counter | — | `prompt_guard.rs` |
| `magicaf.llm.duration_seconds` | Histogram | `service` | LLM clients |
| `magicaf.llm.tokens_total` | Counter | `service` | LLM clients |
| `magicaf.vector_store.search_seconds` | Histogram | `service` | Qdrant client |
| `magicaf.vector_store.index_seconds` | Histogram | `service` | Qdrant client |

### Example: Exposing Metrics

```rust
use magicaf_core::metrics::{init_metrics, metrics_handler};
use axum::{Router, routing::get};

let registry = init_metrics();

let app = Router::new()
    .route("/metrics", get(move || {
        let r = registry.clone();
        async move { metrics_handler(&r) }
    }));
```

---

## Telemetry Initialization

The `telemetry` module provides helpers for initializing `tracing` subscribers with structured output.

```rust
use magicaf_core::telemetry::init_tracing;

// Initialize with JSON-formatted structured logging
init_tracing();
```

This sets up a `tracing_subscriber` with:
- JSON-formatted output for SIEM ingestion
- PII redaction layer (when combined with `PiiMakeWriter`)
- Timestamp and span context fields
