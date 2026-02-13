---
title: "Dialogue"
description: "Multi-turn conversational AI with built-in state management. Powered by DialoGPT with configurable temperature, sampling, and history tracking."
weight: 7
keywords: [dialogue, conversation, DialoGPT, chatbot, multi-turn, conversational AI]
---

The dialogue pipeline provides **multi-turn conversational AI** with built-in conversation state management. Each conversation tracks its own history, and the model generates contextually aware responses — all running in-process with no external API calls.

---

## Overview

**Module:** `magicaf_nlp::dialogue`
**Default Model:** DialoGPT (medium) — Microsoft research indicates human-comparable quality in single-turn Turing tests
**Task:** Multi-turn conversational response generation with state management

### When to Use

- ✅ You need an embedded conversational agent with no external dependencies
- ✅ You want built-in conversation state tracking (no manual history management)
- ✅ You're building air-gapped or offline chatbot applications
- ✅ You need lightweight, fast conversation for simple Q&A or small talk

### When Not to Use

- ❌ You need powerful, instruction-following responses (use `LlmService::chat` with a full LLM)
- ❌ You need domain-specific knowledge or factual accuracy (DialoGPT is a conversational model, not a knowledge base)
- ❌ You need long-context conversations (history window is configurable but limited)

### How This Differs from `LlmService::chat`

| | Dialogue (this module) | `LlmService::chat` |
|-|------------------------|---------------------|
| **Runtime** | In-process DialoGPT model | External API call to LLM server |
| **State** | Built-in `ConversationManager` | Stateless — caller manages history |
| **Model** | Conversation-specific (DialoGPT) | General-purpose LLM |
| **Dependencies** | libtorch / ONNX Runtime | HTTP server running |

---

## Quick Example

```rust
use magicaf_nlp::dialogue::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pipeline = DialoguePipeline::new(DialogueConfig::default()).await?;

    // Start a conversation
    let conv_id = pipeline.create_conversation("Hello! How are you?").await?;
    let response = pipeline.generate_response(&conv_id).await?;
    println!("Bot: {response}");

    // Continue the conversation
    pipeline.add_user_message(&conv_id, "Tell me a joke.").await?;
    let joke = pipeline.generate_response(&conv_id).await?;
    println!("Bot: {joke}");

    // View history
    let history = pipeline.get_history(&conv_id).await?;
    for turn in &history {
        println!("{:?}: {}", turn.role, turn.content);
    }

    Ok(())
}
```

---

## API Reference

### Types

#### `ConversationRole`

```rust
pub enum ConversationRole {
    User,
    Assistant,
}
```

#### `ConversationTurn`

```rust
pub struct ConversationTurn {
    pub role: ConversationRole,  // Who sent this message
    pub content: String,         // The message content
}
```

#### `DialogueConfig`

```rust
pub struct DialogueConfig {
    pub source: ModelSource,        // Where to load the model
    pub max_history: usize,         // Max history turns the model considers (default: 5)
    pub min_length: i64,            // Minimum response length in tokens (default: 1)
    pub max_length: i64,            // Maximum response length in tokens (default: 1000)
    pub temperature: f64,           // Sampling temperature (default: 1.0)
    pub top_k: i64,                 // Top-k sampling parameter (default: 50)
    pub repetition_penalty: f64,    // Repetition penalty (default: 1.3)
    pub device: Device,             // CPU or CUDA
}
```

### Configuration Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `max_history` | `5` | Number of previous turns the model sees |
| `min_length` | `1` | Minimum response length in tokens |
| `max_length` | `1000` | Maximum response length in tokens |
| `temperature` | `1.0` | Higher = more creative/random, lower = more focused |
| `top_k` | `50` | Limits sampling to top-k most likely tokens |
| `repetition_penalty` | `1.3` | Values > 1.0 discourage repeating previous tokens |

### Methods

#### `new(config: DialogueConfig) -> Result<Self>`

Creates a new dialogue pipeline with a `ConversationManager`. Model loading happens asynchronously on a background thread.

```rust
let pipeline = DialoguePipeline::new(DialogueConfig {
    source: ModelSource::Default,
    device: Device::Cpu,
    ..Default::default()
}).await?;
```

#### `create_conversation(initial_message) -> Result<Uuid>`

Starts a new conversation with an initial user message. Returns a unique conversation ID for subsequent interactions.

**Parameters:**
- `initial_message: &str` — the first user message

**Returns:** A `Uuid` conversation identifier.

```rust
let conv_id = pipeline.create_conversation("Hello!").await?;
```

#### `add_user_message(conversation_id, message) -> Result<()>`

Adds a user message to an existing conversation.

**Parameters:**
- `conversation_id: &Uuid` — the conversation to add the message to
- `message: &str` — the user's message

```rust
pipeline.add_user_message(&conv_id, "What's your favorite color?").await?;
```

#### `generate_response(conversation_id) -> Result<String>`

Generates the next assistant response for a conversation, considering the full conversation history (up to `max_history` turns).

**Parameters:**
- `conversation_id: &Uuid` — the conversation to generate a response for

**Returns:** The generated response text.

```rust
let response = pipeline.generate_response(&conv_id).await?;
println!("Bot: {response}");
```

#### `get_history(conversation_id) -> Result<Vec<ConversationTurn>>`

Retrieves the conversation history.

**Parameters:**
- `conversation_id: &Uuid` — the conversation to retrieve

**Returns:** A list of `ConversationTurn` entries.

```rust
let history = pipeline.get_history(&conv_id).await?;
for turn in &history {
    println!("{:?}: {}", turn.role, turn.content);
}
```

---

## Configuration

### Default Config

```rust
let config = DialogueConfig::default();
// Uses DialoGPT (medium)
// max_history: 5, temperature: 1.0, top_k: 50
// repetition_penalty: 1.3
```

### Creative Responses

```rust
let config = DialogueConfig {
    temperature: 1.5,           // More random/creative
    top_k: 100,                 // Wider sampling pool
    repetition_penalty: 1.5,    // Strongly discourage repetition
    ..Default::default()
};
```

### Focused, Predictable Responses

```rust
let config = DialogueConfig {
    temperature: 0.7,           // More deterministic
    top_k: 20,                  // Narrow sampling pool
    max_length: 200,            // Keep responses concise
    ..Default::default()
};
```

### Custom Model (Local)

```rust
use magicaf_nlp::config::{ModelSource, Device};

let config = DialogueConfig {
    source: ModelSource::Local {
        model_dir: "/opt/models/dialogpt-medium".into(),
    },
    device: Device::Cpu,
    ..Default::default()
};
```

**Required files:**
- `rust_model.ot` (PyTorch weights)
- `config.json` (model configuration)
- `vocab.json` and `merges.txt` (tokenizer files)

### GPU Acceleration

```rust
let config = DialogueConfig {
    source: ModelSource::Default,
    device: Device::Cuda(0),
    ..Default::default()
};
```

---

## Advanced Usage

### Multiple Concurrent Conversations

The pipeline manages multiple conversations simultaneously, each with its own history:

```rust
let conv_a = pipeline.create_conversation("Hi, I'm Alice!").await?;
let conv_b = pipeline.create_conversation("Hey, I'm Bob!").await?;

let response_a = pipeline.generate_response(&conv_a).await?;
let response_b = pipeline.generate_response(&conv_b).await?;

pipeline.add_user_message(&conv_a, "Tell me about Rust.").await?;
pipeline.add_user_message(&conv_b, "Tell me about Python.").await?;

// Each conversation maintains independent context
let resp_a = pipeline.generate_response(&conv_a).await?;
let resp_b = pipeline.generate_response(&conv_b).await?;
```

### Conversation Loop

Build a simple interactive chatbot:

```rust
use std::io::{self, Write};

let conv_id = pipeline.create_conversation("Hello!").await?;
let greeting = pipeline.generate_response(&conv_id).await?;
println!("Bot: {greeting}");

loop {
    print!("You: ");
    io::stdout().flush()?;

    let mut input = String::new();
    io::stdin().read_line(&mut input)?;
    let input = input.trim();

    if input == "quit" {
        break;
    }

    pipeline.add_user_message(&conv_id, input).await?;
    let response = pipeline.generate_response(&conv_id).await?;
    println!("Bot: {response}");
}
```

### Adjusting History Window

Control how much context the model sees:

```rust
// Short memory — fast, but less contextual
let config = DialogueConfig {
    max_history: 2,
    ..Default::default()
};

// Long memory — more contextual, but slower
let config = DialogueConfig {
    max_history: 10,
    ..Default::default()
};
```

---

## Performance

- **Model size:** ~350MB (DialoGPT medium)
- **Inference speed:** ~100–500ms per response on CPU
- **Memory:** ~1–2GB RAM
- **Concurrent conversations:** Managed internally, serialized per model thread

---

## Troubleshooting

### Repetitive Responses

If the bot repeats itself, increase the repetition penalty:

```rust
let config = DialogueConfig {
    repetition_penalty: 1.8,  // Stronger penalty (default: 1.3)
    ..Default::default()
};
```

### Generic or Unrelated Responses

DialoGPT is a general conversational model. It may not handle domain-specific topics well. For factual or specialised conversations, consider using `LlmService::chat` with a larger LLM.

### Response Too Long or Too Short

Adjust `min_length` and `max_length`:

```rust
let config = DialogueConfig {
    min_length: 10,    // At least 10 tokens
    max_length: 100,   // At most 100 tokens
    ..Default::default()
};
```

### Conversation Not Found

If `generate_response` returns "(conversation not found)", ensure you're using the correct `Uuid` returned by `create_conversation`.

---

## Next Steps

- **See Examples:** Check out [Use Cases & Examples](/docs/api-reference/nlp/use-cases/) for chatbot patterns
- **Explore Other Pipelines:** See [Pipelines](/docs/api-reference/nlp/pipelines/) for all available NLP tasks
- **Configuration:** Learn about [Setup & Configuration](/docs/api-reference/nlp/setup/)
