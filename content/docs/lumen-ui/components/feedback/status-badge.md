---
title: "StatusBadge"
description: "Status indicator dot with label for presence and state display."
weight: 5
tags: [lumen-ui, status-badge, feedback]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

StatusBadge renders a small colored dot alongside a text label, indicating the current state of a person, system, or resource. It is commonly used for provider availability, device connectivity, service health, and patient acuity indicators.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `status` | `"online"` \| `"offline"` \| `"busy"` \| `"away"` \| `"error"` \| `"success"` \| `"warning"` | — | **Required.** Determines the dot color. `online`/`success` are green. `offline` is gray. `busy`/`error` are red. `away`/`warning` are amber. |
| `label` | string | — | Text displayed next to the status dot. |

**Children:** No.

## DSL Example

```
StatusBadge(status="online", label="Dr. Smith")
```

## JSON Example

```json
{
  "type": "status_badge",
  "props": {
    "status": "online",
    "label": "Dr. Smith"
  }
}
```

## Composition

```
Card(title="Care Team Availability",
  Stack(direction="vertical", gap=8,
    StatusBadge(status="online", label="Dr. Martinez — Attending"),
    StatusBadge(status="busy", label="Dr. Kim — Fellow (in procedure)"),
    StatusBadge(status="away", label="Dr. Patel — Resident (post-call)"),
    StatusBadge(status="offline", label="Dr. Johnson — Off Service"),
    Separator(),
    Stack(direction="horizontal", gap=16,
      StatusBadge(status="success", label="EPIC — Connected"),
      StatusBadge(status="error", label="Telemetry — Disconnected"),
      StatusBadge(status="warning", label="Lab Interface — Degraded")
    )
  )
)
```

## Notes

- The JSON type is `status_badge` (snake_case), matching the DSL name `StatusBadge` (PascalCase).
- StatusBadge is distinct from Badge. Badge is a filled label for categorization. StatusBadge is a dot-and-text indicator for real-time state.
- The dot renders at a fixed size regardless of text length. It pulses subtly for `online` and `busy` states to convey liveness.
- When `label` is omitted, only the colored dot renders — useful for compact status indicators in tables or lists.
