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

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Action Demo</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Try These &mdash; Click to Trigger Actions</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
        <div>
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">sendMessage</div>
          <div class="lm-follow-up">
            <button class="lm-follow-up__btn">What are the side effects?</button>
            <button class="lm-follow-up__btn">Check drug interactions</button>
            <button class="lm-follow-up__btn">Show alternatives</button>
          </div>
        </div>
        <div class="lm-separator"><span class="lm-separator__line"></span><span class="lm-separator__text">Form Actions</span><span class="lm-separator__line"></span></div>
        <div>
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">toggleState</div>
          <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
            <div class="lm-toggle on">
              <div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div>
              <span>Enable auto-refresh</span>
            </div>
            <div class="lm-checkbox checked">
              <span class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></span>
              <span>Patient consent obtained</span>
            </div>
            <div class="lm-checkbox">
              <span class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></span>
              <span>Include historical data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

## Action Flow

<div class="lumen-demo">
  <div class="lumen-demo__label">Action Dispatch Pipeline</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Component &rarr; Action &rarr; Host App</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128073;</div>
          <span class="lm-pipeline__label">User Tap</span>
          <span class="lm-pipeline__sublabel">Button / Toggle</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127912;</div>
          <span class="lm-pipeline__label">Component</span>
          <span class="lm-pipeline__sublabel">onPressed</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128228;</div>
          <span class="lm-pipeline__label">ctx.dispatch</span>
          <span class="lm-pipeline__sublabel">LumenAction</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127968;</div>
          <span class="lm-pipeline__label">Host App</span>
          <span class="lm-pipeline__sublabel">onAction callback</span>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Form Components &amp; Their Actions</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Interactive Form Elements</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header"><div class="lm-card__title">Patient Intake Form</div></div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
            <div class="lm-form-group">
              <label class="lm-form-label">Patient Name</label>
              <input class="lm-input" type="text" placeholder="Enter name" value="Jane Doe" readonly>
              <span class="lm-form-hint">submitForm({ id: "patient_name", value: "Jane Doe" })</span>
            </div>
            <div class="lm-form-group">
              <label class="lm-form-label">Priority</label>
              <select class="lm-select">
                <option>Normal</option>
                <option>Urgent</option>
                <option>Emergent</option>
              </select>
              <span class="lm-form-hint">submitForm({ id: "priority", value: "Normal" })</span>
            </div>
            <div>
              <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
                <div class="lm-checkbox checked">
                  <span class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></span>
                  <span>Patient consent obtained</span>
                </div>
                <span class="lm-form-hint" style="margin-left:26px;">toggleState({ id: "consent", value: true })</span>
              </div>
            </div>
            <div>
              <div class="lm-toggle on">
                <div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div>
                <span>Allergy alert active</span>
              </div>
              <span class="lm-form-hint" style="margin-left:50px; display:block; margin-top:4px;">toggleState({ id: "allergy_alert", value: true })</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

Checkboxes and Toggles dispatch `toggleState` instead:

```
Checkbox(id="consent", label="Patient consent obtained", checked=false)

// When user checks the box, dispatches:
// toggleState({ "id": "consent", "value": true })
```

## One-Way Data Flow

<div class="lumen-demo">
  <div class="lumen-demo__label">Data Flow Direction</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">One-Way: Components &rarr; Host &rarr; LLM &rarr; New Tree</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#129302;</div>
          <span class="lm-pipeline__label">LLM</span>
          <span class="lm-pipeline__sublabel">Generates DSL</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127912;</div>
          <span class="lm-pipeline__label">Component</span>
          <span class="lm-pipeline__sublabel">Stateless tree</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128073;</div>
          <span class="lm-pipeline__label">User Action</span>
          <span class="lm-pipeline__sublabel">Tap / toggle</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127968;</div>
          <span class="lm-pipeline__label">Host App</span>
          <span class="lm-pipeline__sublabel">Handles action</span>
        </div>
        <span class="lm-pipeline__arrow">&#8635;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128260;</div>
          <span class="lm-pipeline__label">Re-render</span>
          <span class="lm-pipeline__sublabel">New LLM call</span>
        </div>
      </div>
    </div>
  </div>
</div>

Actions flow **out** from components to the host. There is no mechanism for the host to push state back into a rendered component tree — the tree is a stateless snapshot. To update the UI after handling an action, re-parse and re-render with new data.

This is by design. The LLM generates the initial state; the host handles interactions and may trigger a new LLM call to produce updated output.

## Next Steps

- **[Forms Components](/docs/lumen-ui/components/forms/)** — all form components and their action behavior
- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — how the render context is constructed
- **[Integration](/docs/lumen-ui/integration/)** — how actions connect to the broader application
