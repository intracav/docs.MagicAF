---
title: "Toggle"
description: "Switch component for binary on/off state."
weight: 7
tags: [lumen-ui, toggle, forms]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Toggle renders a switch control for binary on/off settings. It is visually distinct from Checkbox — a sliding pill rather than a checkmark box — and is typically used for preferences, feature flags, and monitoring toggles. When flipped, Toggle dispatches a `toggleState` action with the field's `id` and the new boolean `value`.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | string | — | Unique identifier used in the dispatched action payload. |
| `label` | string | — | Label text displayed next to the toggle. |
| `checked` | bool | `false` | Whether the toggle is currently on. |
| `disabled` | bool | `false` | When true, the toggle is non-interactive and visually dimmed. |
| `description` | string | — | Help text displayed below the label in a muted style. |

**Children:** No.

**Action:** Dispatches `toggleState` with `{id, value}` via `LumenRenderContext`.

## DSL Example

```
Toggle(id="active_monitoring", label="Active Monitoring", description="Enable real-time vital sign alerts")
```

## JSON Example

```json
{
  "type": "toggle",
  "props": {
    "id": "active_monitoring",
    "label": "Active Monitoring",
    "checked": false,
    "description": "Enable real-time vital sign alerts"
  }
}
```

## Composition

```
Card(title="Alert Preferences",
  Stack(direction="vertical", gap=12,
    Toggle(id="vitals_alerts", label="Vital Sign Alerts", checked=true, description="Notify when vitals exceed threshold"),
    Toggle(id="lab_alerts", label="Lab Result Alerts", checked=true, description="Notify when critical labs are resulted"),
    Toggle(id="med_reminders", label="Medication Reminders", description="Remind patient of upcoming doses"),
    Separator(),
    Toggle(id="silent_mode", label="Silent Mode", description="Suppress all non-critical notifications"),
    Separator(),
    Alert(title="Note", message="Critical alerts (code blue, rapid response) cannot be silenced.", variant="info")
  )
)
```

## Notes

- Toggle and Checkbox both dispatch `toggleState`, but they serve different UX conventions. Use Toggle for settings and preferences. Use Checkbox for checklists and consent items.
- The `description` prop renders below the label and is useful for explaining what the toggle controls.
- When `disabled` is true, the toggle retains its visual state (on or off) but cannot be changed.
- Toggle renders as a sliding pill switch on all platforms — it does not fall back to a native control.
