---
title: "Configuration"
description: "All configuration structs, their fields, defaults, and serialization options — including resilience, TLS, connection pool, gateway, and ASR configs."
weight: 6
tags: [api, configuration, environment-variables, json, toml, tls, resilience]
categories: [reference]
difficulty: beginner
prerequisites: [/docs/getting-started/installation/]
estimated_reading_time: "12 min"
last_reviewed: "2026-03-10"
---

All configuration structs derive `Serialize` and `Deserialize`, so they can be loaded from JSON, TOML, YAML files, or environment variables.

**Module:** `magicaf_core::config`

---

## Infrastructure Configs

These configs are embedded in every service config and control cross-cutting concerns.

### `TlsConfig`

```rust
pub struct TlsConfig {
    pub enforce_https: bool,
    pub ca_cert_pem: Option<String>,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enforce_https` | `bool` | `false` | Reject non-HTTPS base URLs at construction time |
| `ca_cert_pem` | `Option<String>` | `None` | PEM-encoded CA certificate for self-signed servers |

### `ConnectionPoolConfig`

```rust
pub struct ConnectionPoolConfig {
    pub max_idle_per_host: usize,       // default: 10
    pub idle_timeout_secs: Option<u64>, // default: Some(90)
    pub max_connections: Option<usize>, // default: None (unlimited)
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `max_idle_per_host` | `usize` | `10` | Maximum idle connections per host |
| `idle_timeout_secs` | `Option<u64>` | `Some(90)` | Idle connection timeout; `None` disables |
| `max_connections` | `Option<usize>` | `None` | Total connection limit; `None` = unlimited |

### `RetryConfig`

See [Resilience](/docs/api-reference/core/resilience/) for full documentation.

```rust
pub struct RetryConfig {
    pub max_attempts: u32,          // default: 3
    pub initial_delay_ms: u64,      // default: 100
    pub max_delay_ms: u64,          // default: 5_000
    pub multiplier: f64,            // default: 2.0
    pub jitter: bool,               // default: true
}
```

### `CircuitBreakerConfig`

See [Resilience](/docs/api-reference/core/resilience/) for full documentation.

```rust
pub struct CircuitBreakerConfig {
    pub failure_threshold: u32,     // default: 5
    pub success_threshold: u32,     // default: 2
    pub timeout_secs: u64,          // default: 30
}
```

### `RateLimitConfig`

See [Resilience](/docs/api-reference/core/resilience/) for full documentation.

```rust
pub struct RateLimitConfig {
    pub max_concurrent: usize,      // default: 10
    pub queue_timeout_ms: u64,      // default: 5_000
}
```

---

## `EmbeddingConfig`

Configuration for the embedding service endpoint. Includes resilience, TLS, and connection pool settings.

```rust
pub struct EmbeddingConfig {
    pub base_url: String,
    pub model_name: String,
    pub batch_size: usize,
    pub connect_timeout_secs: u64,
    pub request_timeout_secs: u64,
    pub health_check_timeout_secs: u64,
    pub api_key: Option<SecretString>,
    pub retry: RetryConfig,
    pub circuit_breaker: CircuitBreakerConfig,
    pub rate_limit: RateLimitConfig,
    pub tls: TlsConfig,
    pub connection_pool: ConnectionPoolConfig,
    pub parallel_batches: usize,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL of the embedding server (e.g., `http://localhost:8080`) |
| `model_name` | `String` | — | Model identifier sent in the request |
| `batch_size` | `usize` | `32` | Maximum texts per batch request |
| `connect_timeout_secs` | `u64` | `5` | TCP connection timeout |
| `request_timeout_secs` | `u64` | `30` | HTTP request timeout |
| `health_check_timeout_secs` | `u64` | `5` | Health check timeout |
| `api_key` | `Option<SecretString>` | `None` | Optional bearer token (never serialized) |
| `retry` | `RetryConfig` | defaults | Retry with exponential backoff settings |
| `circuit_breaker` | `CircuitBreakerConfig` | defaults | Circuit breaker settings |
| `rate_limit` | `RateLimitConfig` | defaults | Concurrency limiter settings |
| `tls` | `TlsConfig` | defaults | TLS enforcement and CA cert |
| `connection_pool` | `ConnectionPoolConfig` | defaults | HTTP connection pool |
| `parallel_batches` | `usize` | `1` | Number of batch requests to send in parallel |

### Example

```rust
let config = EmbeddingConfig {
    base_url: "http://localhost:8080".into(),
    model_name: "bge-large-en-v1.5".into(),
    batch_size: 64,
    ..Default::default()
};
```

### From JSON

```json
{
  "base_url": "http://localhost:8080",
  "model_name": "bge-large-en-v1.5",
  "batch_size": 64,
  "request_timeout_secs": 15,
  "retry": { "max_attempts": 5 },
  "tls": { "enforce_https": true }
}
```

---

## `VectorStoreConfig`

Configuration for the vector database backend.

```rust
pub struct VectorStoreConfig {
    pub base_url: String,
    pub api_key: Option<SecretString>,
    pub connect_timeout_secs: u64,
    pub request_timeout_secs: u64,
    pub health_check_timeout_secs: u64,
    pub retry: RetryConfig,
    pub circuit_breaker: CircuitBreakerConfig,
    pub rate_limit: RateLimitConfig,
    pub tls: TlsConfig,
    pub connection_pool: ConnectionPoolConfig,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL of the vector store (e.g., `http://localhost:6333`) |
| `api_key` | `Option<SecretString>` | `None` | Optional API key |
| `connect_timeout_secs` | `u64` | `5` | TCP connection timeout |
| `request_timeout_secs` | `u64` | `30` | HTTP request timeout |
| `health_check_timeout_secs` | `u64` | `5` | Health check timeout |
| `retry` | `RetryConfig` | defaults | Retry settings |
| `circuit_breaker` | `CircuitBreakerConfig` | defaults | Circuit breaker settings |
| `rate_limit` | `RateLimitConfig` | defaults | Rate limiter settings |
| `tls` | `TlsConfig` | defaults | TLS settings |
| `connection_pool` | `ConnectionPoolConfig` | defaults | Connection pool settings |

---

## `LlmConfig`

Configuration for the LLM service.

```rust
pub struct LlmConfig {
    pub base_url: String,
    pub model_name: String,
    pub api_key: Option<SecretString>,
    pub connect_timeout_secs: u64,
    pub request_timeout_secs: u64,
    pub health_check_timeout_secs: u64,
    pub retry: RetryConfig,
    pub circuit_breaker: CircuitBreakerConfig,
    pub rate_limit: RateLimitConfig,
    pub tls: TlsConfig,
    pub connection_pool: ConnectionPoolConfig,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL including `/v1` prefix (e.g., `http://localhost:8000/v1`) |
| `model_name` | `String` | — | Model identifier sent in the request payload |
| `api_key` | `Option<SecretString>` | `None` | Optional bearer token (never serialized) |
| `connect_timeout_secs` | `u64` | `5` | TCP connection timeout |
| `request_timeout_secs` | `u64` | `120` | HTTP request timeout |
| `health_check_timeout_secs` | `u64` | `5` | Health check timeout |
| `retry` | `RetryConfig` | defaults | Retry settings |
| `circuit_breaker` | `CircuitBreakerConfig` | defaults | Circuit breaker settings |
| `rate_limit` | `RateLimitConfig` | defaults | Rate limiter settings |
| `tls` | `TlsConfig` | defaults | TLS settings |
| `connection_pool` | `ConnectionPoolConfig` | defaults | Connection pool settings |

> **Note:** The `base_url` should include the `/v1` prefix if the server expects it. `LocalLlmService` appends `/chat/completions` to this URL.

---

## `GatewayConfig`

Configuration for the multi-provider LLM gateway.

```rust
pub struct GatewayConfig {
    pub provider: LlmProvider,
    pub llm: LlmConfig,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `provider` | `LlmProvider` | `OpenAi` | Which LLM backend to route to |
| `llm` | `LlmConfig` | — | Connection and resilience settings |

### `LlmProvider`

```rust
pub enum LlmProvider {
    OpenAi,     // OpenAI, vLLM, llama.cpp, TGI, LocalAI (default)
    Anthropic,  // Anthropic Messages API
    Ollama,     // Ollama (OpenAI-compatible)
    DeepSeek,   // DeepSeek (OpenAI-compatible)
}
```

---

## `AsrEndpointConfig`

Configuration for speech-to-text (Whisper-compatible) endpoints.

```rust
pub struct AsrEndpointConfig {
    pub base_url: String,
    pub api_key: Option<SecretString>,
    pub connect_timeout_secs: u64,
    pub request_timeout_secs: u64,
    pub health_check_timeout_secs: u64,
    pub retry: RetryConfig,
    pub circuit_breaker: CircuitBreakerConfig,
    pub rate_limit: RateLimitConfig,
    pub tls: TlsConfig,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL of the ASR server |
| `api_key` | `Option<SecretString>` | `None` | Optional API key |
| `connect_timeout_secs` | `u64` | `5` | TCP connection timeout |
| `request_timeout_secs` | `u64` | `120` | HTTP request timeout (audio can be large) |
| `health_check_timeout_secs` | `u64` | `5` | Health check timeout |
| `retry` | `RetryConfig` | defaults | Retry settings |
| `circuit_breaker` | `CircuitBreakerConfig` | defaults | Circuit breaker settings |
| `rate_limit` | `RateLimitConfig` | defaults | Rate limiter settings |
| `tls` | `TlsConfig` | defaults | TLS settings |

---

## `GenerationConfig`

Parameters that control LLM text generation.

```rust
pub struct GenerationConfig {
    pub temperature: f32,
    pub top_p: f32,
    pub max_tokens: u32,
    pub stop_sequences: Vec<String>,
    pub system_prompt: Option<String>,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `temperature` | `f32` | `0.1` | Sampling temperature (0.0 = deterministic, 1.0+ = creative) |
| `top_p` | `f32` | `0.95` | Nucleus sampling threshold |
| `max_tokens` | `u32` | `2048` | Maximum tokens to generate |
| `stop_sequences` | `Vec<String>` | `[]` | Stop sequences that halt generation |
| `system_prompt` | `Option<String>` | `None` | System message prepended to the conversation |

### Using Defaults

```rust
let config = GenerationConfig::default();
// temperature: 0.1, top_p: 0.95, max_tokens: 2048
```

### Custom Configuration

```rust
let config = GenerationConfig {
    temperature: 0.3,
    top_p: 0.9,
    max_tokens: 4096,
    system_prompt: Some("You are a precise analyst.".into()),
    ..Default::default()
};
```

---

## `RagConfig`

Configuration for the RAG workflow engine. Useful when loading configuration from files.

```rust
pub struct RagConfig {
    pub collection_name: String,
    pub top_k: usize,
    pub min_score: Option<f32>,
    pub generation: GenerationConfig,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `collection_name` | `String` | — | Vector store collection to search |
| `top_k` | `usize` | `10` | Number of nearest-neighbor results |
| `min_score` | `Option<f32>` | `None` | Minimum similarity score (0.0–1.0) |
| `generation` | `GenerationConfig` | `Default` | LLM generation parameters |

---

## Loading from Files

All config structs support standard serde deserialization:

```rust
// From JSON file
let config: EmbeddingConfig = serde_json::from_str(&json_string)?;

// From TOML file
let config: LlmConfig = toml::from_str(&toml_string)?;
```

## Loading from Environment Variables

A common pattern for production deployments:

```rust
let config = EmbeddingConfig {
    base_url: std::env::var("EMBEDDING_URL")
        .unwrap_or_else(|_| "http://localhost:8080".into()),
    model_name: std::env::var("EMBEDDING_MODEL")
        .unwrap_or_else(|_| "bge-large-en-v1.5".into()),
    batch_size: 32,
    timeout_secs: 30,
    api_key: std::env::var("EMBEDDING_API_KEY").ok(),
};
```
