---
title: "magicaf-agent"
description: "An agent turn loop with an append-only session log, derived history, crash recovery, and deterministic replay. You bring the model, the tools, and the storage."
weight: 40
keywords: [magicaf-agent, Rust agent loop, agent framework, session event log, deterministic replay, tool calling]
---

{{< crate-header "magicaf-agent" >}}

`magicaf-agent` runs the part of an agent that is the same everywhere — stream a model's reply, dispatch the tool calls it asks for, feed results back, and stop for the right reason — and leaves everything product-specific to you. It has no built-in model, no tools, and no storage. Those are three traits you implement: `ModelProvider`, `ToolExecutor`, and `EventSink`.

Its organizing idea is the **session log**. Every observable thing that happens in a turn — a user message, a streamed delta, a tool call, a result, a compaction, the reason the turn ended — is appended to an ordered, append-only log. The chat history sent to the model is *derived* from that log, never stored separately, so you can replay any session exactly, recover cleanly from a crash, and know that the model saw precisely what the log says it saw.

## Example

A complete turn against a stand-in model:

```rust
use async_trait::async_trait;
use magicaf_agent::{
    derive_messages, render_transcript, run_turn, CancelToken, ChunkStream, Inbox, LoopConfig,
    ModelProvider, PromptSection, ProviderError, RawChunk, SessionLog, TurnContext, TurnEndReason,
};
use magicaf_core::llm::ChatMessage;

/// A stand-in model that always answers "Hello." — swap in a real provider.
struct Canned;

#[async_trait]
impl ModelProvider for Canned {
    async fn stream(&self, _history: Vec<ChatMessage>) -> Result<ChunkStream, ProviderError> {
        let chunks = vec![
            RawChunk { delta: "Hello.".into(), ..Default::default() },
            RawChunk { finish_reason: Some("stop".into()), ..Default::default() },
        ];
        Ok(Box::pin(futures::stream::iter(chunks.into_iter().map(Ok))))
    }
}

#[tokio::main]
async fn main() -> Result<(), magicaf_agent::AgentError> {
    let mut log = SessionLog::new("demo-session");
    let inbox = Inbox::new();
    inbox.followup("m1", "hi");

    let report = run_turn(TurnContext {
        log: &mut log,
        provider: &Canned,
        executor: None, // no tools this turn
        inbox: &inbox,
        cancel: &CancelToken::new(),
        compactor: None,
        config: &LoopConfig::default(),
        prompt: Some(vec![PromptSection {
            id: "mode:demo".into(),
            content: "You are terse.".into(),
            cache_breakpoint: false,
        }]),
    })
    .await?;

    assert_eq!(report.reason, TurnEndReason::Completed);
    // The log is the source of truth; chat history is derived from it.
    let history = derive_messages(log.events());
    println!("{} events, {} messages", log.len(), history.len());
    println!("{}", render_transcript(log.events()));
    Ok(())
}
```

`run_turn` only returns `Err` when the log itself cannot be written. A provider failure, a tool failure, or a cancellation is a normal outcome, reported in `TurnReport.reason`.

## Core pieces

| Item | What it is |
|---|---|
| `SessionLog` | The append-only event log for one session. `append`, `events`, `add_sink`; rebuild one with `from_events`. |
| `EventSink` | Receives every event as it is appended — persist to a database, stream to a UI. `RecordingSink` and `NullSink` are provided. |
| `ModelProvider` | Your model. One method: `stream(messages) -> ChunkStream`. |
| `ToolExecutor` | Your tools. `execute(call) -> ToolOutcome`, plus `has(name)`. Bridge [`magicaf-tools`](/docs/crates/magicaf-tools/) or [`magicaf-mcp`](/docs/crates/magicaf-mcp/) here. |
| `run_turn(TurnContext)` | Runs one turn to completion and returns a `TurnReport`. |
| `Inbox` | Messages waiting to enter the loop. `followup` and `steer` wake it; `inject` does not. |
| `derive_messages(events)` | The model-visible history for a log. `derive_messages_upto` stops at a given sequence number. |
| `recover(&mut log)` | After a crash, closes any open turn with an `interrupted` end event so the log is consistent. |
| `Compactor` | Shrinks history when it grows too large. `DigestCompactor` works without a model. |
| `Pipeline` | Middleware around tool execution: pre-execute, approval, guard, around, post-execute stages. Guards can only deny; approval fails closed. |
| `render_transcript(events)` | A human-readable dump of a log, for debugging. |

Turns end with one of `Completed`, `Blocked`, `MaxTokens`, `Aborted`, `Error`, or `Interrupted` (the last only from crash recovery).

## Configuration

`LoopConfig` is `Deserialize` with defaults and rejects unknown fields:

| Field | Default | Meaning |
|---|---|---|
| `max_steps` | `32` | Model calls allowed in one turn |
| `request_timeout_ms` | `300000` | Per model request |
| `request_retry` | 3 attempts, 500 ms → 8 s, ×2, jitter | Retry policy for model requests; honors `Retry-After` up to 60 s |
| `dispatch` | — | Tool concurrency and per-call timeout |
| `compaction` | — | When and how much to compact |

## Good to know

- The crate is runtime-agnostic about persistence and HTTP: a test forbids it from depending on `sqlx`, `axum`, or `tower` directly. It does reach an HTTP client transitively through `magicaf-core` and `magicaf-local-llm`.
- The event schema is versioned (`EVENT_SCHEMA_VERSION = 1`). Persist that version alongside stored logs.
- The crate has no unsafe code (`#![forbid(unsafe_code)]`).

## Related

- [`magicaf-tools`](/docs/crates/magicaf-tools/) — the tool trait and registry to put behind `ToolExecutor`
- [`magicaf-mcp`](/docs/crates/magicaf-mcp/) — tools from external MCP servers
- [`magicaf-routing`](/docs/crates/magicaf-routing/) — choose a model and decide when to escalate mid-loop
