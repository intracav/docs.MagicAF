---
title: "LumenRenderContext"
description: "API reference for LumenRenderContext — the context object carrying action dispatch, streaming state, and rendering depth."
weight: 6
tags: [lumen-ui, api, context, actions]
categories: [api-reference]
difficulty: intermediate
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

`LumenRenderContext` is the context object passed through the rendering tree. It carries the action dispatch callback, streaming state, and current nesting depth.

**Source:** `packages/lumen_ui/lib/src/core/renderer/render_context.dart`

## Constructor

```dart
LumenRenderContext({
  required void Function(LumenAction, Map<String, dynamic>) dispatch,
  bool isStreaming = false,
  int depth = 0,
})
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `dispatch` | `Function` | Callback to dispatch actions to the host |
| `isStreaming` | `bool` | Whether the content is still being streamed |
| `depth` | `int` | Current nesting depth (0 = root, incremented for children) |

## Methods

### `dispatch`

```dart
void dispatch(LumenAction action, Map<String, dynamic> data)
```

Dispatches an action to the host application. Called by interactive components.

```dart
// In a follow-up button handler:
ctx.dispatch(LumenAction.sendMessage, {'message': 'What are the side effects?'});

// In a form input handler:
ctx.dispatch(LumenAction.submitForm, {'id': 'patient_name', 'value': 'Jane Doe'});
```

## LumenAction

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <table class="lm-table lm-table--compact">
        <thead><tr><th>Action</th><th>Trigger</th><th>Data</th></tr></thead>
        <tbody>
          <tr><td><code style="color: #5865F2;">sendMessage</code></td><td>FollowUp button tap</td><td><code>{message: "..."}</code></td></tr>
          <tr><td><code style="color: #3BA55C;">openUrl</code></td><td>Link tap</td><td><code>{url: "..."}</code></td></tr>
          <tr><td><code style="color: #FAA61A;">copyText</code></td><td>Copy action</td><td><code>{text: "..."}</code></td></tr>
          <tr><td><code style="color: #E91E63;">submitForm</code></td><td>Form field change</td><td><code>{id, value}</code></td></tr>
          <tr><td><code style="color: #9B59B6;">toggleState</code></td><td>Checkbox / toggle</td><td><code>{id, checked}</code></td></tr>
          <tr><td><code style="color: var(--text-tertiary);">hostAction</code></td><td>Custom handler</td><td><code>{...}</code></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

```dart
enum LumenAction {
  sendMessage,     // User wants to send a follow-up
  openUrl,         // User tapped a URL
  copyText,        // User wants to copy text
  submitForm,      // Form field value changed
  toggleState,     // Checkbox/toggle changed
  hostAction,      // Custom action
}
```

## Depth Tracking

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div style="font-family: var(--font-mono); font-size: 12px; line-height: 1.8;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="background: #5865F2; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; min-width: 50px; text-align: center;">depth 0</span>
          <span style="color: var(--text-primary);">Grid(columns=2)</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding-left: 20px;">
          <span style="background: #3BA55C; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; min-width: 50px; text-align: center;">depth 1</span>
          <span style="color: var(--text-secondary);">Card(title="Stats")</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding-left: 40px;">
          <span style="background: #FAA61A; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; min-width: 50px; text-align: center;">depth 2</span>
          <span style="color: var(--text-tertiary);">Stat(label="HR", value="72")</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; padding-left: 20px;">
          <span style="background: #3BA55C; color: #fff; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; min-width: 50px; text-align: center;">depth 1</span>
          <span style="color: var(--text-secondary);">Card(title="Chart")</span>
        </div>
      </div>
    </div>
  </div>
</div>

When `LumenRenderer.renderChildren()` creates a context for children, it increments `depth`:

```dart
// Inside renderChildren:
final childContext = LumenRenderContext(
  dispatch: context.dispatch,
  isStreaming: context.isStreaming,
  depth: context.depth + 1,
);
```

Components can use depth to adjust rendering — for example, nested cards might use a different background color or reduce padding.

## See Also

- **[Actions](/docs/lumen-ui/core-concepts/actions/)** — action types and handling patterns
- **[LumenRenderer](/docs/lumen-ui/api-reference/lumen-renderer/)** — how the context is created
- **[Forms Components](/docs/lumen-ui/components/forms/)** — components that dispatch actions
