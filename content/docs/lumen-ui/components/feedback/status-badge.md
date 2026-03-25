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

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">StatusBadge States</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">Provider Availability</div>
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">
<div class="lm-status-badge lm-status-badge--online"><span class="lm-status-badge__dot"></span> Dr. Martinez &mdash; Attending</div>
<div class="lm-status-badge lm-status-badge--busy"><span class="lm-status-badge__dot"></span> Dr. Kim &mdash; Fellow (in procedure)</div>
<div class="lm-status-badge lm-status-badge--away"><span class="lm-status-badge__dot"></span> Dr. Patel &mdash; Resident (post-call)</div>
<div class="lm-status-badge lm-status-badge--offline"><span class="lm-status-badge__dot"></span> Dr. Johnson &mdash; Off Service</div>
</div>
</div>

<hr style="border:none; border-top:1px solid var(--border); margin:0;">

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">System Connectivity</div>
<div class="lm-stack lm-stack--horizontal lm-stack--gap-16" style="flex-wrap:wrap;">
<div class="lm-status-badge lm-status-badge--online"><span class="lm-status-badge__dot"></span> EPIC &mdash; Connected</div>
<div class="lm-status-badge lm-status-badge--busy"><span class="lm-status-badge__dot"></span> Telemetry &mdash; Disconnected</div>
<div class="lm-status-badge lm-status-badge--away"><span class="lm-status-badge__dot"></span> Lab Interface &mdash; Degraded</div>
</div>
</div>

</div>
</div>
</div>
</div>

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Care Team Availability</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Care Team Availability</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">
<div class="lm-status-badge lm-status-badge--online"><span class="lm-status-badge__dot"></span> Dr. Martinez &mdash; Attending</div>
<div class="lm-status-badge lm-status-badge--busy"><span class="lm-status-badge__dot"></span> Dr. Kim &mdash; Fellow (in procedure)</div>
<div class="lm-status-badge lm-status-badge--away"><span class="lm-status-badge__dot"></span> Dr. Patel &mdash; Resident (post-call)</div>
<div class="lm-status-badge lm-status-badge--offline"><span class="lm-status-badge__dot"></span> Dr. Johnson &mdash; Off Service</div>
<hr style="border:none; border-top:1px solid var(--border); margin:4px 0;">
<div class="lm-stack lm-stack--horizontal lm-stack--gap-16" style="flex-wrap:wrap;">
<div class="lm-status-badge lm-status-badge--online"><span class="lm-status-badge__dot"></span> EPIC &mdash; Connected</div>
<div class="lm-status-badge lm-status-badge--busy"><span class="lm-status-badge__dot"></span> Telemetry &mdash; Disconnected</div>
<div class="lm-status-badge lm-status-badge--away"><span class="lm-status-badge__dot"></span> Lab Interface &mdash; Degraded</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The JSON type is `status_badge` (snake_case), matching the DSL name `StatusBadge` (PascalCase).
- StatusBadge is distinct from Badge. Badge is a filled label for categorization. StatusBadge is a dot-and-text indicator for real-time state.
- The dot renders at a fixed size regardless of text length. It pulses subtly for `online` and `busy` states to convey liveness.
- When `label` is omitted, only the colored dot renders — useful for compact status indicators in tables or lists.
