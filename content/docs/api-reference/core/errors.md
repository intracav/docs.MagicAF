---
title: "Error Handling"
description: "MagicError variants, numeric error codes, retryability, helper constructors, and the Result alias."
weight: 7
tags: [api, errors, error-codes, ffi, result-type, retryable]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/architecture/]
estimated_reading_time: "8 min"
last_reviewed: "2026-03-10"
---

All MagicAF operations return `Result<T, MagicError>`. The error type is designed for both Rust-native `?` propagation and FFI-friendly numeric codes.

**Module:** `magicaf_core::errors`

---

## `MagicError`

```rust
pub enum MagicError {
    EmbeddingError          { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    VectorStoreError        { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    LlmError                { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    ConfigError             { message: String },
    AdapterError            { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    HttpError               { message: String, status_code: Option<u16>, source: Option<...> },
    SerializationError      { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    HealthCheckFailed       { service: String },
    Internal                { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    CircuitOpen             { service: String },
    Shutdown,
    RateLimitExceeded       { service: String },
    PromptInjectionDetected { detail: String },
    Timeout                 { operation: String, elapsed_ms: u64 },
    ResponseTooLarge        { actual: usize, limit: usize },
    ResponseSchemaViolation { detail: String },
    AsrError                { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    AsrEmptyAudio,
    FipsNotActive           { detail: String },
}
```

### Variants

| Variant | Code | When |
|---------|------|------|
| `EmbeddingError` | `1000` | Embedding service returned an error or was unreachable |
| `VectorStoreError` | `2000` | Vector store returned an error or was unreachable |
| `LlmError` | `3000` | LLM service returned an error or was unreachable |
| `ConfigError` | `4000` | Configuration value was missing or invalid |
| `AdapterError` | `5000` | An adapter (formatter, builder, parser) failed |
| `HttpError` | `6000` | An HTTP request failed |
| `SerializationError` | `7000` | Serialization or deserialization failed |
| `HealthCheckFailed` | `8000` | A health check failed against an upstream service |
| `Internal` | `9000` | Unexpected internal error |
| `CircuitOpen` | `10000` | Circuit breaker is open — service calls are blocked |
| `Shutdown` | `11000` | Operation rejected because the system is shutting down |
| `RateLimitExceeded` | `12000` | Concurrency limit reached — could not acquire a permit |
| `PromptInjectionDetected` | `13000` | Prompt guard blocked a suspicious query |
| `Timeout` | `14000` | Operation timed out with `operation` name and `elapsed_ms` |
| `ResponseTooLarge` | `15000` | LLM response exceeded `max_output_length` |
| `ResponseSchemaViolation` | `16000` | LLM response failed JSON schema validation |
| `AsrError` | `17000` | Speech-to-text service error |
| `AsrEmptyAudio` | `18000` | Transcription attempted with empty audio |
| `FipsNotActive` | `19000` | FIPS mode required but not active on the system |

---

## Numeric Error Codes

Every variant maps to a stable `u32` code, suitable for FFI boundaries:

```rust
let code: u32 = error.error_code();
```

```rust
match error.error_code() {
    1000 => println!("Embedding issue"),
    2000 => println!("Vector store issue"),
    3000 => println!("LLM issue"),
    4000 => println!("Config issue"),
    6000 => println!("HTTP issue"),
    _    => println!("Other: {error}"),
}
```

---

## Helper Constructors

Convenient functions for creating errors without a source:

```rust
MagicError::embedding("Model not loaded")
MagicError::vector_store("Collection not found")
MagicError::llm("Empty response")
MagicError::config("missing 'base_url' field")
MagicError::adapter("Formatter produced empty output")
MagicError::http("Connection refused", Some(502))
MagicError::asr("Whisper endpoint unreachable")
MagicError::internal("Unexpected state")
```

---

## `Result<T>`

A convenience alias used throughout MagicAF:

```rust
pub type Result<T> = std::result::Result<T, MagicError>;
```

Use it in your adapters:

```rust
use magicaf_core::errors::Result;

async fn my_function() -> Result<String> {
    // ...
}
```

---

## Error Propagation

`MagicError` implements `std::error::Error` and `Display`, so it works with `?`, `anyhow`, and standard error handling:

```rust
// With ? operator
let vector = embedder.embed_single("text").await?;

// Pattern matching
match workflow.run("query", None).await {
    Ok(result) => println!("{}", result.result),
    Err(MagicError::LlmError { message, .. }) => {
        eprintln!("LLM failed: {message}");
    }
    Err(e) => eprintln!("Error {}: {e}", e.error_code()),
}
```

---

## HTTP Errors

`HttpError` includes an optional status code for fine-grained handling:

```rust
Err(MagicError::HttpError { message, status_code, .. }) => {
    match status_code {
        Some(429) => println!("Rate limited — retry later"),
        Some(503) => println!("Service unavailable"),
        Some(code) => println!("HTTP {code}: {message}"),
        None => println!("Connection error: {message}"),
    }
}
```

---

## Retryable Errors

The `is_retryable()` method determines whether an operation should be automatically retried:

```rust
pub fn is_retryable(&self) -> bool
```

**Retryable conditions:**
- `HttpError` with no status code (connection failures)
- `HttpError` with status `429` (rate limited), `502`, `503`, or `504` (server errors)
- `Timeout` errors

All other error variants are considered non-retryable. The [retry infrastructure](/docs/api-reference/core/resilience/) uses this method to decide whether to attempt another call.

---

## Resilience-Related Errors

These variants are produced by the resilience infrastructure:

```rust
// Circuit breaker is open — service is failing
Err(MagicError::CircuitOpen { service }) => {
    eprintln!("Circuit open for {service} — backing off");
}

// Rate limiter queue timeout
Err(MagicError::RateLimitExceeded { service }) => {
    eprintln!("Too many concurrent requests to {service}");
}

// Graceful shutdown in progress
Err(MagicError::Shutdown) => {
    eprintln!("System is shutting down");
}
```

---

## Security-Related Errors

These variants are produced by the [security primitives](/docs/api-reference/core/security/):

```rust
// Prompt injection detected and blocked
Err(MagicError::PromptInjectionDetected { detail }) => {
    eprintln!("Blocked: {detail}");
}

// LLM response exceeded length limit
Err(MagicError::ResponseTooLarge { actual, limit }) => {
    eprintln!("Response {actual} chars exceeds limit of {limit}");
}

// LLM response failed JSON schema validation
Err(MagicError::ResponseSchemaViolation { detail }) => {
    eprintln!("Invalid response structure: {detail}");
}

// FIPS mode not active on the system
Err(MagicError::FipsNotActive { detail }) => {
    eprintln!("FIPS required: {detail}");
}
```
