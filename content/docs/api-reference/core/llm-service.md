---
title: "LlmService"
description: "API reference for the LlmService trait, OpenAI-compatible DTOs, tool calling, multi-provider gateway, and streaming."
weight: 3
tags: [api, llm, chat-completion, openai-compatible, anthropic, tool-calling, streaming]
categories: [reference]
difficulty: intermediate
prerequisites: [/docs/core-concepts/traits-and-interfaces/]
estimated_reading_time: "12 min"
last_reviewed: "2026-03-10"
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
    Tool,       // For tool call results
    Other,
}
```

### `ChatMessage`

```rust
pub struct ChatMessage {
    pub role: ChatRole,
    pub content: String,
    pub tool_calls: Option<Vec<ToolCall>>,   // Present when LLM invokes tools
    pub tool_call_id: Option<String>,        // Set on Tool role messages
    pub name: Option<String>,                // Tool name for Tool role messages
}
```

**Convenience constructors:**

```rust
ChatMessage::system("You are a helpful assistant.")
ChatMessage::user("What is MagicAF?")
ChatMessage::assistant("MagicAF is...")
ChatMessage::assistant_tool_calls(tool_calls)    // Assistant message with tool invocations
ChatMessage::tool_result("call_id", "fn_name", "result content")  // Tool result
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
    pub tools: Option<Vec<Tool>>,           // Available tools for function calling
    pub tool_choice: Option<ToolChoice>,    // Auto, None, or Required
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

**Helper methods:**

```rust
// Extract the text of the first choice
let text: Option<&str> = response.first_content();

// Check if the response contains tool calls
let has_tools: bool = response.has_tool_calls();

// Collect all tool calls from all choices
let calls: Vec<&ToolCall> = response.tool_calls();
```

### `ChatChoice`

```rust
pub struct ChatChoice {
    pub index: u32,
    pub message: ChatMessage,
    pub finish_reason: Option<String>,  // "stop", "tool_calls", "length"
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

### Tool-Calling Types

For full tool calling documentation including examples and streaming, see [Streaming & Tool Calling](/docs/api-reference/core/streaming/).

```rust
pub struct Tool {
    pub tool_type: String,              // Always "function"
    pub function: FunctionDefinition,
}
impl Tool {
    pub fn function(name: impl Into<String>, description: impl Into<String>, parameters: Value) -> Self
}

pub struct FunctionDefinition {
    pub name: String,
    pub description: Option<String>,
    pub parameters: serde_json::Value,  // JSON Schema
}

pub enum ToolChoice {
    Auto,       // LLM decides (default)
    None,       // Disable tool calling
    Required,   // Force a tool call
}

pub struct ToolCall {
    pub id: String,
    pub call_type: String,
    pub function: ToolCallFunction,
}

pub struct ToolCallFunction {
    pub name: String,
    pub arguments: String,              // JSON string
}
```

---

## Implementations

### `LocalLlmService`

**Crate:** `magicaf-local-llm`

HTTP client that calls any server exposing an OpenAI-compatible `/v1/chat/completions` endpoint. Includes built-in retry, circuit breaker, rate limiter, and OTel metrics.

```rust
impl LocalLlmService {
    pub fn new(config: LlmConfig) -> Result<Self>
    pub fn model_name(&self) -> &str
    pub async fn chat_stream(&self, request: ChatRequest)
        -> Result<Pin<Box<dyn Stream<Item = Result<StreamChunk>> + Send>>>
}
```

#### Compatible Servers

| Server | Command / Notes |
|--------|----------------|
| **vLLM** | `python -m vllm.entrypoints.openai.api_server --model ... --port 8000` |
| **llama.cpp** | `./llama-server -m model.gguf --port 8000` |
| **TGI** | Text Generation Inference with OpenAI-compatible mode |
| **LocalAI** | Drop-in OpenAI replacement |
| **Ollama** | With OpenAI compatibility layer enabled |
| **Custom** | Any HTTP server mirroring the OpenAI Chat Completions schema |

### `AnthropicLlmService`

**Crate:** `magicaf-local-llm`

Client for the Anthropic Messages API. Automatically translates between OpenAI and Anthropic wire formats, including tool calling.

```rust
impl AnthropicLlmService {
    pub fn new(config: LlmConfig) -> Result<Self>
    pub fn model_name(&self) -> &str
    pub async fn chat_stream(&self, request: ChatRequest)
        -> Result<Pin<Box<dyn Stream<Item = Result<StreamChunk>> + Send>>>
}
```

### `LlmGateway`

**Crate:** `magicaf-local-llm`

Multi-provider router that selects the correct backend based on `LlmProvider`. Drop-in replacement for any `LlmService`.

```rust
impl LlmGateway {
    pub fn new(config: GatewayConfig) -> Result<Self>
    pub fn provider(&self) -> &LlmProvider
    pub fn model_name(&self) -> &str
    pub async fn chat_stream(&self, request: ChatRequest)
        -> Result<Pin<Box<dyn Stream<Item = Result<StreamChunk>> + Send>>>
}
```

For full streaming and tool calling documentation, see [Streaming & Tool Calling](/docs/api-reference/core/streaming/).

### Example

```rust
use magicaf_core::config::LlmConfig;
use magicaf_local_llm::LocalLlmService;

let llm = LocalLlmService::new(LlmConfig {
    base_url: "http://localhost:8000/v1".into(),
    model_name: "mistral-7b".into(),
    ..Default::default()
})?;

// Structured chat
let response = llm.chat(ChatRequest {
    model: String::new(), // Auto-filled from config
    messages: vec![
        ChatMessage::system("You are helpful."),
        ChatMessage::user("Explain RAG."),
    ],
    temperature: Some(0.3),
    max_tokens: Some(1024),
    ..Default::default()
}).await?;

println!("{}", response.first_content().unwrap_or(""));

// Simple generation
let text = llm.generate("Explain RAG in one sentence.", GenerationConfig::default()).await?;
```
