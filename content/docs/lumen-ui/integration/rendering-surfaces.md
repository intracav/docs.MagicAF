---
title: "Rendering Surfaces"
description: "The five places in the Lumen application where Lumen UI components are rendered — chat, artifacts, agents, workflows, and blueprints."
weight: 4
tags: [lumen-ui, surfaces, chat, agent, workflow, integration]
categories: [guide]
difficulty: intermediate
estimated_reading_time: "6 min"
last_reviewed: "2026-03-17"
---

Lumen UI components appear in five distinct surfaces across the application. Each surface has a slightly different integration pattern, but all use the same `LumenParser` + `LumenRenderer` pipeline.

## 1. Chat Messages

**Integration point:** `message_bubble.dart`

When the LLM includes `<lumen>` blocks in a chat response, the message renderer splits the response into text segments and component blocks:

```
Here are the lab reference ranges:     ← rendered as markdown

<lumen>                                ← parsed with LumenParser
LabRanges(results=[...])               ← rendered with LumenRenderer
</lumen>

The WBC count is within normal limits. ← rendered as markdown
```

During streaming, unclosed `<lumen>` tags are detected and the partial content is parsed with streaming recovery enabled.

## 2. Artifact Panel

**Integration point:** `artifact_panel.dart`

When a tool call produces an artifact (PDF, drug card, lab result, etc.), it is displayed in the artifact panel — a 480px side panel on desktop, a bottom sheet on mobile.

The `ArtifactAdapter.fromArtifact()` method converts the artifact's type and JSON content into a `LumenNode`, which is rendered with `LumenRenderer`.

```dart
final node = ArtifactAdapter.fromArtifact(
  type: artifact.type.name,
  content: artifact.content,
  title: artifact.title,
);
return LumenRenderer(nodes: [node]);
```

## 3. Agent Runs

**Integration point:** `agent_session_screen.dart`

Agent runs display two types of Lumen content:

- **Tool results** — MCP tool outputs wrapped in `__lumen__` envelopes are detected and rendered as components via `_LumenResultView`
- **AI responses** — Agent text responses containing `<lumen>` blocks are parsed and rendered inline

The `_LiveRunView` widget renders `ToolCallBlock` and `ArtifactCard` widgets (from the chat component library) alongside Lumen-rendered tool results.

## 4. Workflow Outputs

**Integration point:** `workflow_session_screen.dart`

Workflow nodes (MCP tool nodes in the DAG editor) produce output that may contain `__lumen__` envelopes. The `_LumenOutputPreview` widget detects envelopes and renders them:

```dart
final envelope = tryUnwrapLumenEnvelope(output);
if (envelope.isEnvelope) {
  final node = ArtifactAdapter.fromArtifact(
    type: envelope.type!,
    content: envelope.rawJson!,
  );
  return LumenRenderer(nodes: [node]);
}
```

Non-envelope outputs fall back to JSON syntax highlighting or plain text.

## 5. Blueprint Agents

**Integration point:** `blueprint_runner_screen.dart`

Blueprint agents (exported, shareable pipelines) render results progressively as each step completes. The `_BpLumenOutput` widget handles per-node results, rendering each tool's output as a Lumen component if an envelope is detected.

This surface supports the full range of clinical components — drug cards, lab ranges, triage assessments — as blueprints often chain multiple MCP tools together.

## Summary

| Surface | Source of Components | Streaming | Artifact Panel |
|---------|---------------------|-----------|----------------|
| Chat | `<lumen>` blocks in LLM text | Yes | Yes |
| Artifacts | `ArtifactAdapter` from tool results | No | Yes (is the panel) |
| Agent Runs | `__lumen__` envelopes + `<lumen>` blocks | Yes | Yes |
| Workflows | `__lumen__` envelopes from MCP nodes | No | No |
| Blueprints | `__lumen__` envelopes per step | Partial | No |

All five surfaces use the same parser, renderer, theme, and component registry. A component that works in chat works identically in a workflow or blueprint.

## Next Steps

- **[Envelope Protocol](/docs/lumen-ui/integration/envelope-protocol/)** — the `__lumen__` format
- **[Artifact Adapter](/docs/lumen-ui/integration/artifact-adapter/)** — type mapping for artifacts
- **[Component Reference](/docs/lumen-ui/components/)** — all available components
