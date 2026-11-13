---
title: "magicaf-tools"
description: "The tool contract: the McpTool trait, a tier-aware ToolRegistry that exports OpenAI and MCP tool lists, ToolContext, and the sandbox-policy vocabulary."
weight: 41
keywords: [magicaf-tools, tool calling, MCP tools, OpenAI function calling, tool registry, Rust]
---

{{< crate-header "magicaf-tools" >}}

Every tool in MagicAF — your own, the filesystem tools in [`magicaf-tools-code`](/docs/crates/magicaf-tools-code/), and the remote tools [`magicaf-mcp`](/docs/crates/magicaf-mcp/) discovers — implements one trait, `McpTool`, and lives in one `ToolRegistry`. The registry hands the model a tool list in OpenAI function-calling or MCP format, filtered to what the caller's tier allows, and routes calls back to the right tool.

## Example

```rust
use std::sync::Arc;

use async_trait::async_trait;
use magicaf_core::errors::Result;
use magicaf_tools::{McpTool, ToolCategory, ToolContext, ToolOutput, ToolRegistry, ToolTier};

struct Echo;

#[async_trait]
impl McpTool for Echo {
    fn name(&self) -> &str { "echo" }
    fn description(&self) -> &str { "Echo the input text back." }
    fn input_schema(&self) -> serde_json::Value {
        serde_json::json!({
            "type": "object",
            "properties": { "text": { "type": "string" } },
            "required": ["text"]
        })
    }
    fn tier(&self) -> ToolTier { ToolTier::Free }
    fn category(&self) -> ToolCategory { ToolCategory::System }
    async fn call(&self, input: serde_json::Value, _ctx: &ToolContext) -> Result<ToolOutput> {
        Ok(ToolOutput::data(input))
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let mut registry = ToolRegistry::new();
    registry.register(Arc::new(Echo));

    // Tool definitions in OpenAI function-calling format, filtered by tier.
    let defs = registry.to_openai_tools("free");
    println!("{}", serde_json::to_string_pretty(&defs).unwrap());

    // Call by name; the registry checks the caller's tier first.
    let ctx = ToolContext::new(uuid::Uuid::nil(), "free");
    let out = registry.call("echo", serde_json::json!({ "text": "hi" }), &ctx).await?;
    println!("{}", out.data);
    Ok(())
}
```

## Core types

| Item | What it is |
|---|---|
| `McpTool` | The tool trait: `name`, `description`, `input_schema` (JSON Schema), `tier`, `category`, and `async call(input, ctx)`. |
| `ToolOutput` | `data` (JSON), an optional `artifact_type` so a client can render the result with [`magicaf-ui`](/docs/crates/magicaf-ui/), and string `metadata`. |
| `ToolContext` | Who is calling and under what rules: `user_id`, `tier`, `cwd`, `sandbox`, `cancel`. `ToolContext::new` starts read-only with no network. |
| `ToolRegistry` | `register`, `unregister`, `get`, `call`, `available_for_tier`, `to_openai_tools(tier)`, `to_mcp_tools_list(tier)`. |
| `ToolTier` | `Free`, `Pro`, `Max`, `Enterprise`. A caller's tier string unlocks its tier and every tier below it. |
| `SandboxPolicy` | `read_only()`, `workspace_write(root)`, `danger_full_access()`, plus a `NetworkAccess` setting. |
| `JsonRpcRequest`, `JsonRpcResponse` | JSON-RPC 2.0 types for MCP transports. |

`ToolContext` is `#[non_exhaustive]`: build it with `new` and the `with_*` methods so new fields do not break your code.

## Sandbox policy is advice

`SandboxPolicy::permits_write(path)` is a lexical check — it compares path prefixes and does not resolve symlinks. Tools use it to decide what to refuse, but it is not an operating-system boundary. If tools run untrusted input, enforce isolation outside the process as well (a container, a separate user, a seccomp profile).

## The category features

The `tools-document`, `tools-system`, and `tools-web` features are reserved categories that contain no tools yet; enabling them adds nothing. `tools-clinical` contains ten lookup tools against public NLM, NCBI, ClinicalTrials.gov, and openFDA APIs. They are deprecated, have no retry, timeout, or rate limit, exist for standalone demos, and should not be used in new code. Build with `default-features = false` and bring your own tools.

## Related

- [`magicaf-tools-code`](/docs/crates/magicaf-tools-code/) — read, write, edit, glob, grep, bash
- [`magicaf-mcp`](/docs/crates/magicaf-mcp/) — register tools from MCP servers
- [`magicaf-agent`](/docs/crates/magicaf-agent/) — the loop that calls them
