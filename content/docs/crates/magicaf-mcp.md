---
title: "magicaf-mcp"
description: "A Model Context Protocol client: connect to MCP servers over stdio or streamable HTTP and register their tools on a ToolRegistry."
weight: 43
keywords: [magicaf-mcp, Model Context Protocol, MCP client, Rust MCP, stdio, streamable HTTP]
---

{{< crate-header "magicaf-mcp" >}}

`magicaf-mcp` connects to [Model Context Protocol](https://modelcontextprotocol.io/) servers and makes their tools ordinary MagicAF tools. Each remote tool is registered on a [`ToolRegistry`](/docs/crates/magicaf-tools/) as `mcp__<server>__<tool>`, so an agent calls it exactly like a local one.

It implements the tool surface of MCP: `initialize`, `tools/list`, and `tools/call`. Prompts, resources, roots, and sampling are not supported. It proposes protocol version `2025-06-18` and accepts whatever version the server answers with.

## Example

With `features = ["stdio"]`, given the path to an MCP server script:

```rust
use magicaf_mcp::{McpConfig, McpToolset};
use magicaf_tools::{ToolContext, ToolRegistry};

#[tokio::main]
async fn main() {
    let fixture = std::env::args().nth(1).expect("path to an MCP stdio server script");
    let toml_src = format!(r#"
enabled = true

[[servers]]
name = "local"
transport = {{ type = "stdio", command = "python3", args = ["{fixture}", "--mode", "ok"] }}
"#);
    let config: McpConfig = toml::from_str(&toml_src).expect("valid [mcp] section");

    let set = McpToolset::connect(config).await.expect("config validates");
    for s in set.statuses().await {
        println!("{} -> {} ({})", s.name, s.state.label(), s.transport);
    }

    let mut registry = ToolRegistry::new();
    let registration = set.register_into(&mut registry).await;
    println!("registered: {:?}", registration.names());

    let ctx = ToolContext::new(uuid::Uuid::nil(), "free");
    let out = registry
        .call("mcp__local__echo", serde_json::json!({"text": "hello"}), &ctx)
        .await
        .expect("call succeeds");
    println!("rendered: {:?}", out.metadata.get("rendered"));

    registration.dispose(&mut registry);
    set.shutdown().await;
}
```

## Connection states

`McpToolset::connect` validates the config and connects every enabled server concurrently. A server that fails does not fail the toolset; it reports a state instead:

| `state.label()` | Meaning |
|---|---|
| `connecting` | Handshake in progress |
| `populated` | Connected, with tools |
| `empty` | Connected, but the server offers no tools |
| `error` | Unreachable, timed out, protocol error — or its transport was not compiled in |

A server in `error` is registered as a single placeholder tool, `mcp__<server>__unavailable`, so the model learns the server exists but is down rather than silently losing it. `retry(server)` tries again; `McpRegistration::refresh` re-registers after tools change.

## Transports are opt-in

| Feature | Transport |
|---|---|
| `stdio` | Starts the server as a child process and talks over stdin/stdout. Only allowlisted environment variables are passed through. |
| `http` | Streamable HTTP. **Only loopback URLs are accepted** unless you set `allow_remote_http = true`. |

With no features, the crate links no transport at all. A server configured for a transport you did not compile in shows up in the `error` state, with a message naming the feature to enable.

## Configuration

The `[mcp]` section, all fields optional except `servers`:

```toml
enabled = true
call_timeout_ms = 60000        # per tools/call
max_concurrent_calls = 4
allow_remote_http = false

[[servers]]
name = "files"
transport = { type = "stdio", command = "mcp-files", args = ["--root", "/srv/data"] }
tool_allowlist = ["read_file", "list_dir"]

[[servers]]
name = "search"
transport = { type = "streamable-http", url = "http://127.0.0.1:7801/mcp", headers_from_env = { Authorization = "SEARCH_MCP_TOKEN" } }
```

Other limits: `connect_timeout_ms` (10 s), `list_timeout_ms` (10 s), `connect_attempts` (2), `max_tools_per_server` (512), `result_max_bytes` (256 KiB). Header and environment secrets are never serialized. Unknown keys are rejected.

## Related

- [`magicaf-tools`](/docs/crates/magicaf-tools/) — the registry MCP tools are added to
- [`magicaf-server`](/docs/crates/magicaf-server/) — the other direction: an MCP *server* endpoint
