---
title: "Error Handling"
description: "MagicError variants, numeric error codes, helper constructors, and the Result alias."
weight: 7
---

All MagicAF operations return `Result<T, MagicError>`. The error type is designed for both Rust-native `?` propagation and FFI-friendly numeric codes.

**Module:** `magicaf_core::errors`

---

## `MagicError`

```rust
pub enum MagicError {
    EmbeddingError   { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    VectorStoreError { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    LlmError         { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    ConfigError      { message: String },
    AdapterError     { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    HttpError        { message: String, status_code: Option<u16>, source: Option<...> },
    SerializationError { message: String, source: Option<Box<dyn Error + Send + Sync>> },
    HealthCheckFailed  { service: String },
    Internal         { message: String, source: Option<Box<dyn Error + Send + Sync>> },
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
