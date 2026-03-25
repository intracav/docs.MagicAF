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

<div class="lumen-demo">
  <div class="lumen-demo__label">Five Rendering Surfaces</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Where Lumen Components Appear</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--3" style="gap: 12px;">
        <div class="lm-card" style="text-align: center; padding: 20px 12px;">
          <div style="font-size: 28px; margin-bottom: 8px;">💬</div>
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Chat Messages</div>
          <div style="font-size: 12px; color: var(--text-secondary);">&lt;lumen&gt; blocks inline with markdown</div>
          <div style="margin-top: 8px;">
            <span style="background: #3BA55C; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px;">Streaming</span>
          </div>
        </div>
        <div class="lm-card" style="text-align: center; padding: 20px 12px;">
          <div style="font-size: 28px; margin-bottom: 8px;">📋</div>
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Artifact Panel</div>
          <div style="font-size: 12px; color: var(--text-secondary);">480px side panel / bottom sheet</div>
          <div style="margin-top: 8px;">
            <span style="background: #5865F2; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px;">ArtifactAdapter</span>
          </div>
        </div>
        <div class="lm-card" style="text-align: center; padding: 20px 12px;">
          <div style="font-size: 28px; margin-bottom: 8px;">🤖</div>
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Agent Runs</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Envelopes + &lt;lumen&gt; blocks</div>
          <div style="margin-top: 8px;">
            <span style="background: #3BA55C; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px;">Streaming</span>
            <span style="background: #FAA61A; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px; margin-left: 4px;">Envelope</span>
          </div>
        </div>
      </div>
      <div class="lm-grid lm-grid--2" style="gap: 12px; margin-top: 12px;">
        <div class="lm-card" style="text-align: center; padding: 20px 12px;">
          <div style="font-size: 28px; margin-bottom: 8px;">⚡</div>
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Workflow Outputs</div>
          <div style="font-size: 12px; color: var(--text-secondary);">MCP tool node results in DAG editor</div>
          <div style="margin-top: 8px;">
            <span style="background: #FAA61A; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px;">Envelope</span>
          </div>
        </div>
        <div class="lm-card" style="text-align: center; padding: 20px 12px;">
          <div style="font-size: 28px; margin-bottom: 8px;">📐</div>
          <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Blueprint Agents</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Progressive step-by-step results</div>
          <div style="margin-top: 8px;">
            <span style="background: #FAA61A; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px;">Envelope</span>
            <span style="background: #9B59B6; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px; margin-left: 4px;">Partial</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Feature Comparison</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Surface Capabilities</span>
    </div>
    <div class="lumen-demo__content lm">
      <table class="lm-table lm-table--striped">
        <thead>
          <tr>
            <th>Surface</th>
            <th>Source</th>
            <th>Streaming</th>
            <th>Panel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Chat</strong></td>
            <td><code>&lt;lumen&gt;</code> blocks</td>
            <td><span style="color: #3BA55C; font-weight: 600;">Yes</span></td>
            <td><span style="color: #3BA55C; font-weight: 600;">Yes</span></td>
          </tr>
          <tr>
            <td><strong>Artifacts</strong></td>
            <td>ArtifactAdapter</td>
            <td><span style="color: var(--text-tertiary);">No</span></td>
            <td><span style="color: #5865F2; font-weight: 600;">Is the panel</span></td>
          </tr>
          <tr>
            <td><strong>Agent Runs</strong></td>
            <td>Envelopes + <code>&lt;lumen&gt;</code></td>
            <td><span style="color: #3BA55C; font-weight: 600;">Yes</span></td>
            <td><span style="color: #3BA55C; font-weight: 600;">Yes</span></td>
          </tr>
          <tr>
            <td><strong>Workflows</strong></td>
            <td><code>__lumen__</code> envelopes</td>
            <td><span style="color: var(--text-tertiary);">No</span></td>
            <td><span style="color: var(--text-tertiary);">No</span></td>
          </tr>
          <tr>
            <td><strong>Blueprints</strong></td>
            <td><code>__lumen__</code> per step</td>
            <td><span style="color: #FAA61A; font-weight: 600;">Partial</span></td>
            <td><span style="color: var(--text-tertiary);">No</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

All five surfaces use the same parser, renderer, theme, and component registry. A component that works in chat works identically in a workflow or blueprint.

## Next Steps

- **[Envelope Protocol](/docs/lumen-ui/integration/envelope-protocol/)** — the `__lumen__` format
- **[Artifact Adapter](/docs/lumen-ui/integration/artifact-adapter/)** — type mapping for artifacts
- **[Component Reference](/docs/lumen-ui/components/)** — all available components
