---
title: "Installation"
description: "Add MagicAF to your Rust project and configure the environment."
weight: 2
---

## Add Dependencies

Add the MagicAF crates to your `Cargo.toml`:

```toml
[dependencies]
magicaf-core      = { path = "path/to/magicaf/magicaf-core" }
magicaf-qdrant    = { path = "path/to/magicaf/magicaf-qdrant" }
magicaf-local-llm = { path = "path/to/magicaf/magicaf-local-llm" }
tokio = { version = "1", features = ["full"] }
```

> **Note:** MagicAF is distributed as source. Replace the `path` values with the actual location of the MagicAF workspace on your system.

### Optional Dependencies

These are commonly used alongside MagicAF:

```toml
[dependencies]
anyhow = "1"                              # Ergonomic error handling
serde = { version = "1", features = ["derive"] }  # For custom result types
serde_json = "1"                          # JSON payloads
tracing = "0.1"                           # Structured logging
tracing-subscriber = { version = "0.3", features = ["json", "env-filter"] }
async-trait = "0.1"                       # For implementing adapter traits
```

## Environment Variables

Configure service endpoints via environment variables:

```bash
# Embedding service
export EMBEDDING_URL="http://localhost:8080"
export EMBEDDING_MODEL="bge-large-en-v1.5"

# Vector store
export QDRANT_URL="http://localhost:6333"
# export QDRANT_API_KEY=""  # Optional

# LLM service
export LLM_URL="http://localhost:8000/v1"
export LLM_MODEL="mistral-7b"
# export LLM_API_KEY=""     # Optional
```

> **Tip:** You can also hardcode configuration values directly in code or load them from JSON/TOML files. See [Configuration](/docs/api-reference/configuration/) for details.

## Verify Installation

Create a minimal `main.rs` to verify that crates link correctly:

```rust
use magicaf_core::prelude::*;

fn main() {
    println!("MagicAF version: OK");
    println!("Traits available: EmbeddingService, VectorStore, LlmService");
    println!("RAG engine: RAGWorkflow");
}
```

```bash
cargo run
```

If the build succeeds, your installation is ready.

---

**Next:** [Quickstart →](/docs/getting-started/quickstart/)
