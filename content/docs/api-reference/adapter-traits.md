---
title: "Adapter Traits"
description: "API reference for EvidenceFormatter, PromptBuilder, ResultParser, and their default implementations."
weight: 5
---

Adapter traits are the extension seam where your domain logic plugs into the RAG pipeline. MagicAF ships default implementations for rapid prototyping.

**Module:** `magicaf_core::adapters`

---

## `EvidenceFormatter`

```rust
#[async_trait]
pub trait EvidenceFormatter: Send + Sync {
    async fn format_evidence(&self, results: &[SearchResult]) -> Result<String>;
}
```

Converts raw vector search results into a text block for the LLM prompt.

| Parameter | Type | Description |
|-----------|------|-------------|
| `results` | `&[SearchResult]` | Search results from the vector store |

**Returns:** A formatted string ready for inclusion in the prompt.

### `DefaultEvidenceFormatter`

Pass-through formatter that pretty-prints each result's JSON payload:

```
--- Evidence 1 (score: 0.9500) ---
{
  "content": "...",
  "source": "..."
}
```

```rust
use magicaf_core::adapters::DefaultEvidenceFormatter;

let formatter = DefaultEvidenceFormatter;
```

---

## `PromptBuilder`

```rust
#[async_trait]
pub trait PromptBuilder: Send + Sync {
    async fn build_prompt(&self, query: &str, evidence: &str) -> Result<String>;
}
```

Assembles the final prompt from the user query and formatted evidence.

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `&str` | The user's original question |
| `evidence` | `&str` | Formatted evidence from the `EvidenceFormatter` |

### `DefaultPromptBuilder`

Wraps evidence in `<context>` XML tags and appends the query:

```
[optional system instruction]

<context>
[evidence]
</context>

Question: [query]
```

```rust
use magicaf_core::adapters::DefaultPromptBuilder;

// Without system instruction
let builder = DefaultPromptBuilder::new();

// With system instruction
let builder = DefaultPromptBuilder::new()
    .with_system("You are a helpful technical assistant.");
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `system_instruction` | `Option<String>` | Optional text prepended before the context block |

---

## `ResultParser<T>`

```rust
#[async_trait]
pub trait ResultParser<T>: Send + Sync {
    async fn parse_result(&self, raw_output: &str) -> Result<T>;
}
```

Parses the LLM's raw text output into a strongly-typed result.

| Parameter | Type | Description |
|-----------|------|-------------|
| `raw_output` | `&str` | Raw text from the LLM response |

**Type parameter `T`:** Your domain result type.

### `RawResultParser`

Returns the raw LLM output as a `String` — zero processing.

```rust
use magicaf_core::adapters::RawResultParser;

let parser = RawResultParser;
// ResultParser<String>
```

### `JsonResultParser<T>`

Deserializes the LLM output as JSON into any type implementing `DeserializeOwned`:

```rust
use magicaf_core::adapters::JsonResultParser;

#[derive(serde::Deserialize)]
struct MyResult {
    answer: String,
    confidence: f32,
}

let parser = JsonResultParser::<MyResult>::new();
// ResultParser<MyResult>
```

**Errors:** Returns `MagicError::SerializationError` if JSON parsing fails.

---

## Prelude Re-exports

All adapter types are available through the prelude:

```rust
use magicaf_core::prelude::*;

// Gives you:
// - EvidenceFormatter (trait)
// - PromptBuilder (trait)
// - ResultParser (trait)
// - DefaultEvidenceFormatter
// - DefaultPromptBuilder
// - RawResultParser
// - JsonResultParser
```
