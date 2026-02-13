---
title: "LlmService"
description: "API reference for the LlmService trait, OpenAI-compatible DTOs, and LocalLlmService."
weight: 3
---

## Trait Definition

```rust
#[async_trait]
pub trait LlmService: Send + Sync {
    async fn chat(&self, request: ChatRequest) -> Result<ChatResponse>;
    async fn generate(&self, prompt: &str, config: GenerationConfig) -> Result<String>;
    async fn health_check(&self) -> Result<()>;
}
```

**Module:** `magicaf_core::llm`

---

## Methods

### `chat`

```rust
async fn chat(&self, request: ChatRequest) -> Result<ChatResponse>
```

Send a structured chat completion request.

| Parameter | Type | Description |
|-----------|------|-------------|
| `request` | `ChatRequest` | The chat completion request payload |

**Returns:** `ChatResponse` containing the model's reply, usage statistics, and metadata.

**Errors:** `MagicError::LlmError`, `MagicError::HttpError`, `MagicError::SerializationError`

---

### `generate`

```rust
async fn generate(&self, prompt: &str, config: GenerationConfig) -> Result<String>
```

High-level convenience: turn a raw prompt into generated text.

| Parameter | Type | Description |
|-----------|------|-------------|
| `prompt` | `&str` | The input prompt |
| `config` | `GenerationConfig` | Generation parameters |

**Returns:** `String` — the generated text.

---

### `health_check`

```rust
async fn health_check(&self) -> Result<()>
```

Verify the upstream LLM server is reachable.

---

## DTO Types

### `ChatRole`

```rust
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ChatRole {
    System,
    User,
    Assistant,
    Other,
}
```

### `ChatMessage`

```rust
pub struct ChatMessage {
    pub role: ChatRole,
    pub content: String,
}
```

**Convenience constructors:**

```rust
ChatMessage::system("You are a helpful assistant.")
ChatMessage::user("What is MagicAF?")
ChatMessage::assistant("MagicAF is...")
```

### `ChatRequest`

```rust
pub struct ChatRequest {
    pub model: String,
    pub messages: Vec<ChatMessage>,
    pub temperature: Option<f32>,
    pub top_p: Option<f32>,
    pub max_tokens: Option<u32>,
    pub stop: Option<Vec<String>>,
}
```

Follows the OpenAI `/v1/chat/completions` request schema. The `model` field is auto-filled by `LocalLlmService` if left empty.

### `ChatResponse`

```rust
pub struct ChatResponse {
    pub id: String,
    pub object: String,
    pub created: u64,
    pub model: String,
    pub choices: Vec<ChatChoice>,
    pub usage: Option<Usage>,
}
```

**Helper method:**

```rust
// Extract the text of the first choice
let text: Option<&str> = response.first_content();
```

### `ChatChoice`

```rust
pub struct ChatChoice {
    pub index: u32,
    pub message: ChatMessage,
    pub finish_reason: Option<String>,
}
```

### `Usage`

```rust
pub struct Usage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}
```

---

## `LocalLlmService`

**Crate:** `magicaf-local-llm`

HTTP client that calls any server exposing an OpenAI-compatible `/v1/chat/completions` endpoint.

### Constructor

```rust
impl LocalLlmService {
    pub fn new(config: LlmConfig) -> Result<Self>
    pub fn model_name(&self) -> &str
}
```

### Compatible Servers

| Server | Command / Notes |
|--------|----------------|
| **vLLM** | `python -m vllm.entrypoints.openai.api_server --model ... --port 8000` |
| **llama.cpp** | `./llama-server -m model.gguf --port 8000` |
| **TGI** | Text Generation Inference with OpenAI-compatible mode |
| **LocalAI** | Drop-in OpenAI replacement |
| **Ollama** | With OpenAI compatibility layer enabled |
| **Custom** | Any HTTP server mirroring the OpenAI Chat Completions schema |

### Example

```rust
use magicaf_core::config::LlmConfig;
use magicaf_local_llm::LocalLlmService;

let llm = LocalLlmService::new(LlmConfig {
    base_url: "http://localhost:8000/v1".into(),
    model_name: "mistral-7b".into(),
    api_key: None,
    timeout_secs: 120,
})?;

// Structured chat
let response = llm.chat(ChatRequest {
    model: String::new(), // Auto-filled from config
    messages: vec![
        ChatMessage::system("You are helpful."),
        ChatMessage::user("Explain RAG."),
    ],
    temperature: Some(0.3),
    top_p: None,
    max_tokens: Some(1024),
    stop: None,
}).await?;

println!("{}", response.first_content().unwrap_or(""));

// Simple generation
let text = llm.generate("Explain RAG in one sentence.", GenerationConfig::default()).await?;
```
