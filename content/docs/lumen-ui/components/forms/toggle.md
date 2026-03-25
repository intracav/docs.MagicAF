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

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview — click to toggle</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Alert Preferences</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header">
          <div class="lm-card__title">Alert Preferences</div>
          <div class="lm-card__description">Configure notification settings for this patient</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical" style="gap:16px;">
            <div class="lm-stack lm-stack--horizontal" style="justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary);">Vital Sign Alerts</div>
                <div style="font-size:12px;color:var(--text-tertiary);margin-top:2px;">Notify when vitals exceed threshold</div>
              </div>
              <div class="lm-toggle on">
                <div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div>
              </div>
            </div>
            <div class="lm-stack lm-stack--horizontal" style="justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary);">Lab Result Alerts</div>
                <div style="font-size:12px;color:var(--text-tertiary);margin-top:2px;">Notify when critical labs are resulted</div>
              </div>
              <div class="lm-toggle on">
                <div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div>
              </div>
            </div>
            <div class="lm-stack lm-stack--horizontal" style="justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary);">Medication Reminders</div>
                <div style="font-size:12px;color:var(--text-tertiary);margin-top:2px;">Remind patient of upcoming doses</div>
              </div>
              <div class="lm-toggle">
                <div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div>
              </div>
            </div>
            <div style="height:1px;background:var(--border);margin:4px 0;"></div>
            <div class="lm-stack lm-stack--horizontal" style="justify-content:space-between;align-items:center;">
              <div>
                <div style="font-size:14px;font-weight:600;color:var(--text-primary);">Silent Mode</div>
                <div style="font-size:12px;color:var(--text-tertiary);margin-top:2px;">Suppress all non-critical notifications</div>
              </div>
              <div class="lm-toggle">
                <div class="lm-toggle__track"><div class="lm-toggle__thumb"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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
