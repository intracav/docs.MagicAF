---
title: "Error Handling"
description: "MagicError variants, numeric error codes, retryability, helper constructors, and the Result alias."
weight: 7
tags: [api, errors, error-codes, ffi, result-type, retryable]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/architecture/]
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
    Throttled               { message: String, status_code: u16, retry_after_ms: Option<u64> },
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
    // … plus speech, auth, database, tool, artifact, server, budget,
    //     and Reflex variants — all listed in the table below
}
```

### Variants and codes

Every variant maps to a stable numeric code through `error_code()`. Codes are grouped by area; a new variant gets a new code, and existing codes do not change.

| Area | Variant | Code |
|---|---|---|
| Services | `EmbeddingError` · `VectorStoreError` · `LlmError` | 1000 · 2000 · 3000 |
| Setup | `ConfigError` | 4000 |
| Adapters | `AdapterError` | 5000 |
| Transport | `HttpError` · `Throttled` | 6000 · 6001 |
| Data | `SerializationError` | 7000 |
| Health | `HealthCheckFailed` | 8000 |
| Other | `Internal` | 9000 |
| Resilience | `CircuitOpen` · `Shutdown` · `RateLimitExceeded` · `Timeout` | 10000 · 11000 · 12000 · 14000 |
| Guards | `PromptInjectionDetected` · `ResponseTooLarge` · `ResponseSchemaViolation` | 13000 · 15000 · 16000 |
| Speech | `AsrError` · `AsrEngineInit` · `AsrModelLoad` · `AsrModelIntegrity` · `AsrSessionClosed` · `AsrEmptyAudio` | 17000 · 17001 · 17002 · 17003 · 17004 · 18000 |
| Speech synthesis | `TtsError` · `TtsEmptyText` | 17500 · 17501 |
| Crypto | `FipsNotActive` | 19000 |
| Auth ([`magicaf-auth`](/docs/crates/magicaf-auth/)) | `AuthenticationFailed` · `TokenExpired` · `TokenRevoked` · `InsufficientPermission` · `MfaRequired` · `CertificateInvalid` · `LdapBindFailed` | 20000 – 20006 |
| Database ([`magicaf-db`](/docs/crates/magicaf-db/)) | `DatabaseError` · `RecordNotFound` · `DuplicateRecord` · `MigrationFailed` · `ConnectionPoolExhausted` | 21000 – 21004 |
| Tools ([`magicaf-tools`](/docs/crates/magicaf-tools/)) | `ToolNotFound` · `ToolExecutionFailed` · `ToolTierRestricted` · `ToolInputValidation` | 22000 – 22003 |
| Artifacts ([`magicaf-ui`](/docs/crates/magicaf-ui/)) | `InvalidArtifactType` · `ArtifactSchemaValidation` · `EnvelopeConstructionFailed` | 23000 – 23002 |
| Server ([`magicaf-server`](/docs/crates/magicaf-server/)) | `RequestBodyTooLarge` · `SseConnectionFailed` · `BackgroundTaskFailed` | 24000 – 24002 |
| Budgets | `BudgetExceeded` | 25000 |
| Decisions ([Reflex](/docs/reflex/)) | `ReflexInvalidRequest` · `ReflexUnknownQuestionSet` · `ReflexUnknownKey` | 26001 – 26003 |
| | `ReflexModelUnavailable` · `ReflexIntegrity` · `ReflexTimeout` · `ReflexBackendError` | 26101 – 26104 |

Reflex errors also have wire codes for the `magicaf.reflex.response/v2` protocol (1001–1003 and 2001–2004): `reflex_wire_code()`, `reflex_wire_name()`, and `MagicError::from_reflex_wire_code(code, detail)` convert in both directions.

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

## Helper constructors

Shorthand for creating errors without a source:

| Constructor | Produces |
|---|---|
| `embedding(msg)`, `vector_store(msg)`, `llm(msg)`, `config(msg)`, `adapter(msg)`, `asr(msg)`, `tts(msg)`, `internal(msg)` | The matching variant |
| `http(msg, status_code: Option<u16>)` | `HttpError` |
| `throttled(msg, status_code, retry_after: Option<&str>)` | `Throttled`, parsing a `Retry-After` header value |
| `database(msg)`, `not_found(entity)` | `DatabaseError`, `RecordNotFound` |
| `auth_failed(msg)`, `forbidden(detail)` | `AuthenticationFailed`, `InsufficientPermission` |
| `tool_failed(name, message)` | `ToolExecutionFailed` |

`retry_after_ms()` returns the server-requested delay carried by a `Throttled` error, if any.

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
- `HttpError` with no status code (the connection failed)
- `HttpError` with status 429, 500, 502, 503, 504, or 529
- `Throttled` — a 429, 503, or 529 from a streaming call, carrying any `Retry-After` delay
- `Timeout` and `ReflexTimeout`

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

// LLM response exceeded the size limit (in bytes)
Err(MagicError::ResponseTooLarge { actual, limit }) => {
    eprintln!("Response of {actual} bytes exceeds limit of {limit}");
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
