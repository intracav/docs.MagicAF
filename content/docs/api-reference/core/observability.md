---
title: "Observability"
description: "API reference for structured audit logging, OpenTelemetry metrics, and Prometheus integration."
weight: 12
tags: [api, observability, audit, metrics, opentelemetry, prometheus, logging]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/architecture/]
---

MagicAF provides structured audit events, OpenTelemetry metrics exported in Prometheus format, and JSON logging helpers. `RAGWorkflow` runs and GDPR deletions emit audit events; service clients record latency, token, retry, and resilience metrics.

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
    // Authentication events, for hosts using magicaf-auth
    AuthLogin { provider: String, user_id: String },
    AuthLogout { user_id: String },
    AuthFailed { provider: String, reason: String },
    AuthRoleChange { user_id: String, old_role: String, new_role: String, changed_by: String },
    AuthMfaVerified { user_id: String, method: String },
}
```

Serialized with `"type"` as the tag in `snake_case` — for example `{"type": "rag_query"}`. MagicAF itself emits `RagQuery` (from `RAGWorkflow`) and `GdprDeletion` (from `GdprService`). The other variants are for your host to emit — `HealthCheck` and `ServiceStartup`/`ServiceShutdown` at the obvious points, the `Auth*` events from your login flow.

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

### Built-in metrics

Instruments are created on the global meter provider, so they appear once you call `init_metrics` (or `init_logging_with_metrics`). Names are exactly as exported to Prometheus.

| Metric | Type | Labels | Recorded by |
|---|---|---|---|
| `rag_pipeline_duration_seconds` | Histogram | `collection` | `RAGWorkflow::run` |
| `embedding_request_duration_seconds` | Histogram | `model`, `status` | `LocalEmbeddingService` |
| `embedding_requests_total` | Counter | `model`, `status` | `LocalEmbeddingService` |
| `vector_search_duration_seconds` | Histogram | `collection` | `QdrantVectorStore` |
| `vector_index_duration_seconds` | Histogram | `collection` | `QdrantVectorStore` |
| `llm_request_duration_seconds` | Histogram | `model`, `type` | `LocalLlmService` |
| `llm_tokens_total` | Counter | `model`, `provider`, `type` (`prompt` / `completion`) | LLM clients |
| `llm_stream_first_byte_seconds` | Histogram | `model`, `provider`, `outcome` | Streaming calls with `chat_stream_timed` |
| `llm_stream_ttft_seconds` | Histogram | `model`, `provider`, `first` (text or thinking) | Streaming calls with `chat_stream_timed` |
| `llm_stream_duration_seconds` | Histogram | `model`, `provider`, `outcome` | Streaming calls with `chat_stream_timed` |
| `anthropic_request_duration_seconds` | Histogram | `model`, `type` | `AnthropicLlmService` |
| `anthropic_tokens_total` | Counter | `model`, `type` | `AnthropicLlmService` |
| `retry_attempts_total` | Counter | `service`, `attempt` | Retry wrapper |
| `circuit_breaker_state` | Gauge | `service` | Circuit breaker (0 closed, 1 open, 2 half-open) |
| `rate_limiter_active_requests` | Up-down counter | `service` | Rate limiter |
| `prompt_injection_detections_total` | Counter | `policy` | `PromptGuard` |

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

## Logging initialization

`magicaf_core::telemetry` sets up `tracing` with JSON output, filtered by `RUST_LOG` (default `info`). Each function installs the global subscriber, so call one, once, at startup.

| Function | Installs |
|---|---|
| `init_logging()` | JSON logs to stderr |
| `init_logging_with_pii_filter()` | JSON logs with email addresses, US Social Security numbers, card numbers, and IPv4 addresses replaced by `[EMAIL]`, `[SSN]`, `[CARD]`, and `[IP]` before they are written. Pattern-based, so treat it as a safety net, not a guarantee |
| `init_logging_with_metrics() -> prometheus::Registry` | `init_logging()` plus `init_metrics()`; mount the returned registry at `/metrics` |

```rust
use magicaf_core::metrics::metrics_handler;
use magicaf_core::telemetry::init_logging_with_metrics;

let registry = init_logging_with_metrics();
// later, in your /metrics handler:
let body = metrics_handler(&registry);
```

To send traces to an OpenTelemetry collector, build your own subscriber with a `tracing-opentelemetry` layer instead of calling these helpers; MagicAF's spans and events flow through whatever subscriber you install.
