---
title: "Actions"
description: "How Lumen UI components dispatch events back to the host application — forms, navigation, clipboard, and custom actions."
weight: 6
tags: [lumen-ui, actions, interactivity, forms, events]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/core-concepts/rendering/
estimated_reading_time: "5 min"
last_reviewed: "2026-03-17"
---

Lumen UI components are declarative and stateless, but they can still be interactive. When a user taps a button, changes a form field, or clicks a link, the component dispatches an **action** to the host application via the `LumenRenderContext`.

## Action Types

| Action | Trigger | Data |
|--------|---------|------|
| `sendMessage` | User taps a follow-up suggestion | `{ "message": "..." }` |
| `openUrl` | User taps a link or URL | `{ "url": "..." }` |
| `copyText` | User taps a copy button | `{ "text": "..." }` |
| `submitForm` | User changes a form field value | `{ "id": "field_id", "value": ... }` |
| `toggleState` | User toggles a checkbox or switch | `{ "id": "field_id", "value": true/false }` |
| `hostAction` | Custom action from any component | `{ "action": "...", ... }` |

## Handling Actions

Register an `onAction` callback on `LumenRenderer`:

```dart
LumenRenderer(
  nodes: result.nodes,
  onAction: (LumenAction action, Map<String, dynamic> data) {
    switch (action) {
      case LumenAction.sendMessage:
        chatProvider.send(data['message'] as String);
        break;
      case LumenAction.openUrl:
        launchUrl(Uri.parse(data['url'] as String));
        break;
      case LumenAction.copyText:
        Clipboard.setData(ClipboardData(text: data['text'] as String));
        break;
      case LumenAction.submitForm:
        formState[data['id']] = data['value'];
        break;
      case LumenAction.toggleState:
        formState[data['id']] = data['value'];
        break;
      case LumenAction.hostAction:
        handleCustomAction(data);
        break;
    }
  },
)
```

## Dispatching from Components

Inside a component builder, use the render context to dispatch:

```dart
Widget _buildFollowUp(LumenNode node, LumenThemeData theme, LumenRenderContext ctx) {
  final suggestions = node.listProp('suggestions').cast<String>();

  return Wrap(
    spacing: 8,
    children: suggestions.map((s) =>
      ActionChip(
        label: Text(s),
        onPressed: () => ctx.dispatch(LumenAction.sendMessage, {'message': s}),
      ),
    ).toList(),
  );
}
```

## Form Components

All form components (`Input`, `Select`, `Checkbox`, `RadioGroup`, `Slider`, `DatePicker`, `Toggle`, `TextArea`) dispatch `submitForm` when the user changes a value. The data always includes:

- `id` — the component's `id` prop (used to identify which field changed)
- `value` — the new value (string, number, or boolean depending on the component)

```
// DSL:
Input(id="patient_name", label="Patient Name", placeholder="Enter name")

// When user types "Jane Doe", dispatches:
// submitForm({ "id": "patient_name", "value": "Jane Doe" })
```

Checkboxes and Toggles dispatch `toggleState` instead:

```
Checkbox(id="consent", label="Patient consent obtained", checked=false)

// When user checks the box, dispatches:
// toggleState({ "id": "consent", "value": true })
```

## One-Way Data Flow

Actions flow **out** from components to the host. There is no mechanism for the host to push state back into a rendered component tree — the tree is a stateless snapshot. To update the UI after handling an action, re-parse and re-render with new data.

This is by design. The LLM generates the initial state; the host handles interactions and may trigger a new LLM call to produce updated output.

## Next Steps

- **[Forms Components](/docs/lumen-ui/components/forms/)** — all form components and their action behavior
- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — how the render context is constructed
- **[Integration](/docs/lumen-ui/integration/)** — how actions connect to the broader application
