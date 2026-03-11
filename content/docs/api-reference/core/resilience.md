---
title: "Resilience"
description: "API reference for retry with exponential backoff, circuit breaker, and rate limiter — production-grade fault tolerance for all MagicAF services."
weight: 9
tags: [api, resilience, retry, circuit-breaker, rate-limiter, fault-tolerance]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/architecture/]
estimated_reading_time: "12 min"
last_reviewed: "2026-03-10"
---

MagicAF ships three composable resilience primitives used by every service client (embeddings, vector store, LLM, ASR). Each is configured per-service and emits OpenTelemetry metrics.

**Module:** `magicaf_core::retry`, `magicaf_core::circuit_breaker`, `magicaf_core::rate_limiter`

---

## Retry with Exponential Backoff

Automatic retry with exponential backoff and full jitter to prevent thundering-herd effects.

### `RetryConfig`

```rust
pub struct RetryConfig {
    pub max_attempts: u32,          // default: 3
    pub initial_delay_ms: u64,      // default: 100
    pub max_delay_ms: u64,          // default: 5_000
    pub multiplier: f64,            // default: 2.0
    pub jitter: bool,               // default: true
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `max_attempts` | `u32` | `3` | Total attempts including the initial call |
| `initial_delay_ms` | `u64` | `100` | Base delay before the first retry (ms) |
| `max_delay_ms` | `u64` | `5_000` | Upper bound on any single retry delay (ms) |
| `multiplier` | `f64` | `2.0` | Exponential backoff multiplier |
| `jitter` | `bool` | `true` | Add random jitter to prevent synchronized retries |

### `retry_with_backoff`

```rust
pub async fn retry_with_backoff<F, Fut, T>(
    config: &RetryConfig,
    operation_name: &str,
    f: F,
) -> Result<T>
where
    F: Fn() -> Fut + Send,
    Fut: Future<Output = Result<T>>,
```

Executes `f` up to `max_attempts` times. Only retries on retryable errors (see [`MagicError::is_retryable`](/docs/api-reference/core/errors/)).

**OTel metric:** Increments `magicaf.retry.count` counter on each retry attempt.

### `compute_delay`

```rust
pub fn compute_delay(config: &RetryConfig, attempt: u32) -> u64
```

Returns the delay in milliseconds for a given attempt number, applying the exponential multiplier, cap, and optional jitter.

### Example

```rust
use magicaf_core::retry::{RetryConfig, retry_with_backoff};

let config = RetryConfig {
    max_attempts: 5,
    initial_delay_ms: 200,
    max_delay_ms: 10_000,
    multiplier: 2.0,
    jitter: true,
};

let result = retry_with_backoff(&config, "embedding_call", || async {
    embedding_service.embed_single("hello").await
}).await?;
```

---

## Circuit Breaker

State-machine circuit breaker that prevents cascading failures by short-circuiting calls to a failing upstream service.

### `CircuitState`

```rust
pub enum CircuitState {
    Closed,     // Normal operation — requests pass through
    Open,       // Failing — requests are immediately rejected
    HalfOpen,   // Testing — limited requests allowed to probe recovery
}
```

### `CircuitBreakerConfig`

```rust
pub struct CircuitBreakerConfig {
    pub failure_threshold: u32,     // default: 5
    pub success_threshold: u32,     // default: 2
    pub timeout_secs: u64,          // default: 30
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `failure_threshold` | `u32` | `5` | Consecutive failures before opening the circuit |
| `success_threshold` | `u32` | `2` | Consecutive successes in HalfOpen before closing |
| `timeout_secs` | `u64` | `30` | Seconds to wait in Open state before transitioning to HalfOpen |

### `CircuitBreaker`

```rust
pub struct CircuitBreaker { /* ... */ }
```

#### Constructor

```rust
pub fn new(service: impl Into<String>, config: CircuitBreakerConfig) -> Self
```

#### Methods

```rust
/// Returns the current circuit state.
pub fn state(&self) -> CircuitState

/// Execute `f` through the circuit breaker.
/// Returns `MagicError::CircuitOpen` if the circuit is open.
pub async fn call<F, Fut, T>(&self, f: F) -> Result<T>
where
    F: FnOnce() -> Fut,
    Fut: Future<Output = Result<T>>,
```

**OTel metric:** Reports `magicaf.circuit_breaker.state` gauge (0=Closed, 1=Open, 2=HalfOpen).

### State Transitions

```
Closed ──[failure_threshold reached]──► Open
Open   ──[timeout_secs elapsed]──────► HalfOpen
HalfOpen ──[success_threshold met]───► Closed
HalfOpen ──[any failure]─────────────► Open
```

### Example

```rust
use magicaf_core::circuit_breaker::{CircuitBreaker, CircuitBreakerConfig};

let cb = CircuitBreaker::new("llm-service", CircuitBreakerConfig {
    failure_threshold: 3,
    success_threshold: 1,
    timeout_secs: 15,
});

let response = cb.call(|| async {
    llm.chat(request).await
}).await?;
```

---

## Rate Limiter

Semaphore-based concurrency limiter that caps the number of in-flight requests to a service.

### `RateLimitConfig`

```rust
pub struct RateLimitConfig {
    pub max_concurrent: usize,      // default: 10
    pub queue_timeout_ms: u64,      // default: 5_000
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `max_concurrent` | `usize` | `10` | Maximum simultaneous in-flight requests |
| `queue_timeout_ms` | `u64` | `5_000` | How long to wait for a permit before returning `RateLimitExceeded` |

### `RateLimiter`

```rust
pub struct RateLimiter { /* ... */ }
```

#### Constructor

```rust
pub fn new(service: impl Into<String>, config: &RateLimitConfig) -> Self
```

#### Methods

```rust
/// Acquire a permit. Returns `MagicError::RateLimitExceeded` on timeout.
/// The permit auto-releases when dropped.
pub async fn acquire(&self) -> Result<RateLimitPermit>
```

### `RateLimitPermit`

An RAII guard. When dropped, the semaphore slot is released and the OTel counter is decremented.

**OTel metric:** Reports `magicaf.rate_limiter.active` up-down counter.

### Example

```rust
use magicaf_core::rate_limiter::{RateLimiter, RateLimitConfig};

let limiter = RateLimiter::new("embedding-service", &RateLimitConfig {
    max_concurrent: 5,
    queue_timeout_ms: 3_000,
});

let _permit = limiter.acquire().await?;
// Permit is held until `_permit` is dropped
let result = embedding_service.embed_single("text").await?;
```

---

## Built-in Integration

Every MagicAF service client (`LocalLlmService`, `AnthropicLlmService`, `QdrantVectorStore`, `LocalEmbeddingService`, `WhisperAsrService`) composes all three primitives internally. You configure them via the service's config struct:

```rust
let config = LlmConfig {
    base_url: "http://localhost:8000/v1".into(),
    model_name: "mistral-7b".into(),
    // Resilience settings
    retry: RetryConfig {
        max_attempts: 5,
        initial_delay_ms: 200,
        ..Default::default()
    },
    circuit_breaker: CircuitBreakerConfig {
        failure_threshold: 3,
        timeout_secs: 15,
        ..Default::default()
    },
    rate_limit: RateLimitConfig {
        max_concurrent: 20,
        ..Default::default()
    },
    ..Default::default()
};
```

No manual wiring needed — the service handles retry → circuit breaker → rate limiter orchestration automatically.
