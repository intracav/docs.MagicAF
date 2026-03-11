---
title: "Streaming & Tool Calling"
description: "API reference for SSE streaming, tool calling (function calling), and the multi-provider LLM gateway."
weight: 16
tags: [api, streaming, tool-calling, function-calling, anthropic, gateway, multi-provider]
categories: [reference]
difficulty: advanced
prerequisites: [/docs/api-reference/core/llm-service/]
estimated_reading_time: "14 min"
last_reviewed: "2026-03-10"
---

MagicAF supports streaming chat completions and tool calling (function calling) across multiple LLM providers through a unified API. The `LlmGateway` automatically translates between OpenAI and Anthropic wire formats.

**Crate:** `magicaf-local-llm`

---

## Multi-Provider Gateway

### `LlmProvider`

```rust
pub enum LlmProvider {
    OpenAi,     // OpenAI, Ollama, DeepSeek, vLLM, llama.cpp (default)
    Anthropic,  // Anthropic Messages API
    Ollama,     // Ollama (routed through OpenAI-compatible)
    DeepSeek,   // DeepSeek (routed through OpenAI-compatible)
}
```

### `GatewayConfig`

```rust
pub struct GatewayConfig {
    pub provider: LlmProvider,
    pub llm: LlmConfig,
}
```

### `LlmGateway`

```rust
pub struct LlmGateway { /* ... */ }
```

Routes requests to the correct backend based on the configured provider. Implements `LlmService` so it's a drop-in replacement for `LocalLlmService`.

#### Constructor

```rust
pub fn new(config: GatewayConfig) -> Result<Self>
```

#### Methods

```rust
pub fn provider(&self) -> &LlmProvider
pub fn model_name(&self) -> &str

/// Stream chat completions. Returns normalized StreamChunk items.
pub async fn chat_stream(
    &self,
    request: ChatRequest,
) -> Result<Pin<Box<dyn Stream<Item = Result<StreamChunk>> + Send>>>
```

### Example

```rust
use magicaf_core::config::{GatewayConfig, LlmConfig, LlmProvider};
use magicaf_local_llm::LlmGateway;

// OpenAI-compatible provider
let gateway = LlmGateway::new(GatewayConfig {
    provider: LlmProvider::OpenAi,
    llm: LlmConfig {
        base_url: "http://localhost:8000/v1".into(),
        model_name: "mistral-7b".into(),
        ..Default::default()
    },
})?;

// Anthropic provider
let gateway = LlmGateway::new(GatewayConfig {
    provider: LlmProvider::Anthropic,
    llm: LlmConfig {
        base_url: "https://api.anthropic.com/v1".into(),
        model_name: "claude-sonnet-4-20250514".into(),
        api_key: Some("sk-ant-...".into()),
        ..Default::default()
    },
})?;

// Both use the same LlmService trait
let response = gateway.chat(request).await?;
```

---

## `AnthropicLlmService`

Direct Anthropic Messages API client. Used internally by `LlmGateway` when `provider` is `Anthropic`.

```rust
pub struct AnthropicLlmService { /* ... */ }
```

### Constructor

```rust
pub fn new(config: LlmConfig) -> Result<Self>
```

### Features

- Automatic OpenAI → Anthropic format translation (system message extraction, content blocks)
- Tool calling with Anthropic's `tool_use` / `tool_result` block format
- SSE streaming with delta parsing
- Circuit breaker, rate limiter, retry (inherited from config)
- OTel histograms for latency and token counters
- HTTPS enforcement and custom CA cert support

### Wire Format Translation

| OpenAI Concept | Anthropic Equivalent |
|---------------|---------------------|
| `messages[0].role = "system"` | Top-level `system` field |
| `tools[].function` | `tools[].name` + `tools[].input_schema` |
| `tool_choice: "auto"` | `tool_choice: { type: "auto" }` |
| `choices[0].message.tool_calls` | `content[].type = "tool_use"` |
| `role: "tool"` message | `content[].type = "tool_result"` block |

---

## Streaming

### `StreamChunk`

```rust
pub struct StreamChunk {
    pub delta: String,                          // Text content delta
    pub finish_reason: Option<String>,          // "stop", "tool_calls", etc.
    pub tool_calls: Vec<StreamToolCall>,         // Incremental tool call fragments
}
```

### `StreamToolCall`

```rust
pub struct StreamToolCall {
    pub index: usize,                   // Tool call index in the array
    pub id: Option<String>,             // Tool call ID (first chunk only)
    pub name: Option<String>,           // Function name (first chunk only)
    pub arguments_delta: String,        // Incremental JSON argument fragment
}
```

### Streaming Example

```rust
use futures::StreamExt;
use magicaf_local_llm::LlmGateway;

let mut stream = gateway.chat_stream(request).await?;

let mut full_text = String::new();
while let Some(chunk) = stream.next().await {
    let chunk = chunk?;
    full_text.push_str(&chunk.delta);
    print!("{}", chunk.delta); // Print as tokens arrive

    if let Some(reason) = &chunk.finish_reason {
        println!("\n[Finished: {reason}]");
    }
}
```

### Streaming Tool Calls

Tool calls arrive incrementally across multiple chunks. Accumulate the fragments:

```rust
use std::collections::HashMap;

let mut stream = gateway.chat_stream(request).await?;
let mut tool_calls: HashMap<usize, (String, String, String)> = HashMap::new(); // index → (id, name, args)

while let Some(chunk) = stream.next().await {
    let chunk = chunk?;
    for tc in &chunk.tool_calls {
        let entry = tool_calls.entry(tc.index).or_default();
        if let Some(id) = &tc.id { entry.0 = id.clone(); }
        if let Some(name) = &tc.name { entry.1 = name.clone(); }
        entry.2.push_str(&tc.arguments_delta);
    }
}

// Now tool_calls contains fully assembled function calls
for (_, (id, name, args)) in &tool_calls {
    println!("Call {name}({args}) [id={id}]");
}
```

---

## Tool Calling (Function Calling)

Define tools that the LLM can invoke, then handle the results in a tool-use loop.

### Defining Tools

```rust
use magicaf_core::llm::{Tool, FunctionDefinition, ToolChoice};

let tools = vec![
    Tool::function(
        "search_documents",
        "Search the document store for relevant information",
        serde_json::json!({
            "type": "object",
            "required": ["query"],
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum results to return",
                    "default": 5
                }
            }
        }),
    ),
];
```

### Tool-Calling Types

```rust
pub struct FunctionDefinition {
    pub name: String,
    pub description: Option<String>,
    pub parameters: serde_json::Value,  // JSON Schema
}

pub struct Tool {
    pub tool_type: String,              // Always "function"
    pub function: FunctionDefinition,
}

pub enum ToolChoice {
    Auto,       // LLM decides (default)
    None,       // Disable tool calling
    Required,   // Force a tool call
}

pub struct ToolCall {
    pub id: String,
    pub call_type: String,              // "function"
    pub function: ToolCallFunction,
}

pub struct ToolCallFunction {
    pub name: String,
    pub arguments: String,              // JSON string
}
```

### Tool-Use Loop

```rust
use magicaf_core::llm::{ChatMessage, ChatRequest, ToolChoice};

let mut messages = vec![
    ChatMessage::system("You are a research assistant."),
    ChatMessage::user("Find information about air-gapped deployments."),
];

loop {
    let request = ChatRequest {
        model: String::new(),
        messages: messages.clone(),
        tools: Some(tools.clone()),
        tool_choice: Some(ToolChoice::Auto),
        ..Default::default()
    };

    let response = gateway.chat(request).await?;

    if response.has_tool_calls() {
        // Add assistant message with tool calls
        let choice = &response.choices[0];
        messages.push(choice.message.clone());

        // Execute each tool call and add results
        for tool_call in response.tool_calls() {
            let result = execute_tool(&tool_call.function.name, &tool_call.function.arguments);
            messages.push(ChatMessage::tool_result(
                &tool_call.id,
                &tool_call.function.name,
                result,
            ));
        }
    } else {
        // Final response — no more tool calls
        println!("{}", response.first_content().unwrap_or(""));
        break;
    }
}
```

### `ChatResponse` Helper Methods

```rust
impl ChatResponse {
    /// Extract the text content of the first choice.
    pub fn first_content(&self) -> Option<&str>

    /// Check if the response contains any tool calls.
    pub fn has_tool_calls(&self) -> bool

    /// Collect all tool calls from all choices.
    pub fn tool_calls(&self) -> Vec<&ToolCall>
}
```

### `ChatMessage` Constructors

```rust
impl ChatMessage {
    pub fn system(content: impl Into<String>) -> Self
    pub fn user(content: impl Into<String>) -> Self
    pub fn assistant(content: impl Into<String>) -> Self
    pub fn assistant_tool_calls(tool_calls: Vec<ToolCall>) -> Self
    pub fn tool_result(
        tool_call_id: impl Into<String>,
        name: impl Into<String>,
        content: impl Into<String>,
    ) -> Self
}
```
