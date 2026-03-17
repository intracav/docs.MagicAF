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
