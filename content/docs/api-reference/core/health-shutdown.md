---
title: "Health & Shutdown"
description: "API reference for startup health gates, health reports, graceful shutdown handles, and signal handlers."
weight: 13
tags: [api, health-check, graceful-shutdown, startup, signal-handling]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/architecture/]
estimated_reading_time: "8 min"
last_reviewed: "2026-03-10"
---

MagicAF provides structured startup health verification and cooperative graceful shutdown primitives used across all services.

**Modules:** `magicaf_core::health`, `magicaf_core::shutdown`

---

## Health Gates

Verify that all upstream services are ready before accepting traffic.

### `NamedHealthcheck` Trait

```rust
#[async_trait]
pub trait NamedHealthcheck: Send + Sync {
    fn name(&self) -> &str;
    async fn check(&self) -> Result<()>;
}
```

All MagicAF service clients (`LocalEmbeddingService`, `QdrantVectorStore`, `LocalLlmService`, etc.) implement `health_check()`. Wrap them with `Named` to satisfy this trait.

### `Named<F>`

A wrapper that gives a name to any async health check function:

```rust
pub struct Named<F> {
    name: String,
    f: F,
}
```

### `HealthReport`

```rust
pub struct HealthReport {
    pub results: HashMap<String, std::result::Result<(), String>>,
}
```

#### Methods

```rust
/// Returns true if all services passed.
pub fn all_healthy(&self) -> bool

/// Returns Ok(()) if all healthy, or MagicError::HealthCheckFailed with details.
pub fn into_result(self) -> Result<()>
```

### `HealthGate`

```rust
pub struct HealthGate;
```

#### Methods

```rust
/// Check all services once.
pub async fn verify_all(
    services: &[&dyn NamedHealthcheck],
) -> Result<HealthReport>

/// Check all services with retries.
/// Default: 3 attempts, 1 second delay between attempts.
pub async fn verify_all_with_attempts(
    services: &[&dyn NamedHealthcheck],
    max_attempts: u32,
    delay_secs: u64,
) -> Result<HealthReport>
```

### Example

```rust
use magicaf_core::health::{HealthGate, Named};

// Create named health checks
let checks: Vec<Box<dyn NamedHealthcheck>> = vec![
    Box::new(Named::new("embedding", || embedding_service.health_check())),
    Box::new(Named::new("vector-store", || vector_store.health_check())),
    Box::new(Named::new("llm", || llm_service.health_check())),
];

let refs: Vec<&dyn NamedHealthcheck> = checks.iter().map(|c| c.as_ref()).collect();

// Verify all services with 5 attempts, 2-second delay
let report = HealthGate::verify_all_with_attempts(&refs, 5, 2).await?;
println!("All healthy: {}", report.all_healthy());
```

---

## Graceful Shutdown

Cooperative shutdown primitives for draining in-flight requests before stopping.

### `ShutdownHandle`

The sending side of the shutdown signal. Created once, typically at application startup.

```rust
pub struct ShutdownHandle { /* ... */ }
```

#### Constructor

```rust
pub fn new() -> (ShutdownHandle, ShutdownReceiver)
```

#### Methods

```rust
/// Trigger shutdown for all receivers.
pub fn trigger(&self)

/// Create a new receiver that listens for this handle's signal.
pub fn subscribe(&self) -> ShutdownReceiver

/// Check if shutdown has been triggered.
pub fn is_triggered(&self) -> bool

/// Create a guard that tracks an in-flight operation.
pub fn guard(&self) -> ShutdownGuard

/// Wait for all guards to be dropped, or timeout.
pub async fn drain(&self, timeout_secs: u64)
```

### `ShutdownReceiver`

The receiving side. Cloned and passed to services and background tasks.

```rust
pub struct ShutdownReceiver { /* ... */ }
```

#### Methods

```rust
/// Wait until shutdown is triggered.
pub async fn wait(&self)

/// Check if shutdown has been triggered (non-blocking).
pub fn is_shutdown(&self) -> bool

/// Create a guard for an in-flight operation.
pub fn guard(&self) -> ShutdownGuard
```

### `ShutdownGuard`

An RAII guard that tracks in-flight operations. The `drain()` method on `ShutdownHandle` waits for all guards to drop.

### `install_signal_handlers`

```rust
pub fn install_signal_handlers() -> ShutdownHandle
```

Spawns a background task that listens for `SIGTERM` and `SIGINT`, and triggers shutdown when received. Returns a `ShutdownHandle` for manual triggering and subscriber creation.

### Example

```rust
use magicaf_core::shutdown::{install_signal_handlers, ShutdownHandle};

// Install signal handlers (SIGTERM, SIGINT)
let shutdown = install_signal_handlers();

// Pass receivers to services
let rx = shutdown.subscribe();

// In a worker task
tokio::spawn(async move {
    loop {
        tokio::select! {
            _ = rx.wait() => {
                tracing::info!("Shutting down worker");
                break;
            }
            _ = do_work() => {}
        }
    }
});

// In the main task — wait for all in-flight operations
shutdown.drain(30).await; // 30-second timeout
```

### RAG Integration

The `RAGWorkflow` checks the shutdown receiver at the start of each `run()` call. If shutdown has been triggered, it returns immediately rather than starting a new pipeline execution.
