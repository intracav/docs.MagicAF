---
title: "magicaf-tools-code"
description: "Filesystem, search, and shell tools for agents — read, write, edit, glob, ls, grep, bash — each behind its own opt-in feature."
weight: 42
keywords: [magicaf-tools-code, coding agent tools, filesystem tools, bash tool, grep tool, Rust]
---

{{< crate-header "magicaf-tools-code" >}}

These are the tools a coding or operations agent needs to work in a directory. Each family sits behind a feature that is off by default, and nothing else in the workspace depends on this crate — so a deployment cannot end up with a `bash` tool unless someone deliberately enabled it.

Every tool returns canonical JSON, and separately renders a model-facing text view of that JSON with a pure function. You store the JSON; the model reads the text.

## Example

With `features = ["fs"]`:

```rust
use magicaf_tools::{SandboxPolicy, ToolContext, ToolRegistry};
use magicaf_tools_code::{CodeTools, CodeToolsConfig};

#[tokio::main]
async fn main() {
    let dir = tempfile::tempdir().unwrap();
    let root = dir.path().canonicalize().unwrap();
    std::fs::write(root.join("notes.txt"), "one\ntwo\nthree\n").unwrap();

    let tools = CodeTools::new(CodeToolsConfig::default()).expect("valid config");
    println!("compiled={:?} not_compiled={:?}", tools.names(), tools.missing());

    let ctx = ToolContext::new(uuid::Uuid::nil(), "free")
        .with_cwd(&root)
        .with_sandbox(SandboxPolicy::workspace_write(&root));

    // Canonical JSON, then the pure model-facing rendering.
    let args = serde_json::json!({ "path": "notes.txt" });
    let out = tools.run("read", &args, &ctx).await;
    assert!(!out.is_error, "{}", out.value);
    println!("{}", tools.render("read", &args, &out.value));

    // Or hand them to a ToolRegistry as ordinary McpTools.
    let mut registry = ToolRegistry::new();
    for t in tools.as_mcp_tools() {
        registry.register(t);
    }
    println!("registry has {} tools", registry.len());
}
```

`tools.names()` lists what was compiled in; `tools.missing()` lists what was not, so a host can tell the model which tools are unavailable and why.

## Tools

| Tool | Feature | Effect | Notes |
|---|---|---|---|
| `read` | `fs` | Read | Line-numbered, with offset and limit |
| `write` | `fs` | Write | Refused outside the `SandboxPolicy` writable roots |
| `edit` | `fs` | Write | Exact string replacement |
| `ls` | `fs` | Read | |
| `glob` | `fs` | Read | Skips `.git`, `node_modules`, `target`, `.venv`, `__pycache__` |
| `grep` | `search` | Read | Runs the ripgrep binary named by `grep_binary` |
| `bash` | `shell` | Shell | Cleared environment plus an allowlist; kills the whole process group on cancel |

Failures come back as `{"ok": false, "error": {"kind", "message"}}` with `is_error = true`, never as a panic.

## Isolation is your job

Write tools check the context's `SandboxPolicy` after resolving the path. `bash` applies no sandbox of its own: it runs under whatever argv prefix you set in `bash_wrapper` (for example a container runtime or `sandbox-exec`), and reports `bash_sandbox_label` — `"none"` by default — so logs show what isolation was in effect. Decide that before you enable `shell`.

## Configuration

`CodeToolsConfig` is `Deserialize` with defaults and rejects unknown fields. Selected defaults:

| Field | Default |
|---|---|
| `read_max_bytes`, `write_max_bytes` | 2 MiB |
| `glob_max_results`, `ls_max_entries` | 1000 |
| `grep_binary` / `grep_timeout_ms` | `"rg"` / 30 s |
| `bash_program` | `/bin/bash` |
| `bash_timeout_ms` / `bash_max_timeout_ms` | 120 s / 600 s |
| `bash_max_output_bytes` | 64 KiB |
| `bash_env_allowlist` | `PATH HOME LANG LC_ALL TERM TMPDIR` |

`CodeTools::new` validates the config and returns every violation at once.

## Related

- [`magicaf-tools`](/docs/crates/magicaf-tools/) — `as_mcp_tools()` registers these on a `ToolRegistry`
- [`magicaf-agent`](/docs/crates/magicaf-agent/) — the loop that calls them
