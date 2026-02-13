---
title: "Configuration"
description: "All configuration structs, their fields, defaults, and serialization options."
weight: 6
---

All configuration structs derive `Serialize` and `Deserialize`, so they can be loaded from JSON, TOML, YAML files, or environment variables.

**Module:** `magicaf_core::config`

---

## `EmbeddingConfig`

Configuration for the embedding service endpoint.

```rust
pub struct EmbeddingConfig {
    pub base_url: String,
    pub model_name: String,
    pub batch_size: usize,
    pub timeout_secs: u64,
    pub api_key: Option<String>,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL of the embedding server (e.g., `http://localhost:8080`) |
| `model_name` | `String` | — | Model identifier sent in the request |
| `batch_size` | `usize` | `32` | Maximum texts per batch request |
| `timeout_secs` | `u64` | `30` | HTTP request timeout in seconds |
| `api_key` | `Option<String>` | `None` | Optional bearer token for authenticated endpoints |

### Example

```rust
let config = EmbeddingConfig {
    base_url: "http://localhost:8080".into(),
    model_name: "bge-large-en-v1.5".into(),
    batch_size: 32,
    timeout_secs: 30,
    api_key: None,
};
```

### From JSON

```json
{
  "base_url": "http://localhost:8080",
  "model_name": "bge-large-en-v1.5",
  "batch_size": 64,
  "timeout_secs": 15
}
```

---

## `VectorStoreConfig`

Configuration for the vector database backend.

```rust
pub struct VectorStoreConfig {
    pub base_url: String,
    pub api_key: Option<String>,
    pub timeout_secs: u64,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL of the vector store (e.g., `http://localhost:6333`) |
| `api_key` | `Option<String>` | `None` | Optional API key |
| `timeout_secs` | `u64` | `30` | HTTP request timeout in seconds |

---

## `LlmConfig`

Configuration for the LLM service (OpenAI-compatible API).

```rust
pub struct LlmConfig {
    pub base_url: String,
    pub model_name: String,
    pub api_key: Option<String>,
    pub timeout_secs: u64,
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `base_url` | `String` | — | Base URL including `/v1` prefix (e.g., `http://localhost:8000/v1`) |
| `model_name` | `String` | — | Model identifier sent in the request payload |
| `api_key` | `Option<String>` | `None` | Optional bearer token |
| `timeout_secs` | `u64` | `120` | HTTP request timeout in seconds |

> **Note:** The `base_url` should include the `/v1` prefix if the server expects it. `LocalLlmService` appends `/chat/completions` to this URL.

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
