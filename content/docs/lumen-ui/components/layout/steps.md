---
title: "Steps"
description: "Numbered step indicator for wizard flows and multi-stage processes."
weight: 6
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Steps renders a numbered progress indicator for multi-stage workflows. Each step displays a title, an optional description, and a status (pending, active, completed, or error). Use Steps to show where a patient is in a clinical pathway, the progress of a prior authorization request, or the stages of a diagnostic workup.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | array of objects | — | **Required.** Each object has: `title` (string, required), `description` (string, optional), `status` (string, optional). |
| `current` | number | — | Zero-based index of the currently active step. If provided, this overrides individual `status` values — steps before `current` are marked completed, the step at `current` is active, and steps after are pending. |

### Step Status Values

| Status | Appearance |
|--------|------------|
| `"pending"` | Dimmed circle with step number. |
| `"active"` | Highlighted circle with step number, bold title. |
| `"completed"` | Filled circle with checkmark. |
| `"error"` | Red circle with exclamation mark. |

**Children:** No. Steps is a self-contained data-driven component.

## DSL Example

```
Steps(
  items=[
    {title:"Patient Intake", description:"Demographics and insurance", status:"completed"},
    {title:"Clinical Assessment", description:"Vitals and chief complaint", status:"active"},
    {title:"Diagnostic Orders", description:"Labs and imaging", status:"pending"},
    {title:"Treatment Plan", status:"pending"}
  ],
  current=1
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Steps — Clinical Workflow</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-steps">
        <div class="lm-steps__item lm-steps__item--completed">
          <div class="lm-steps__number">&#10003;</div>
          <div class="lm-steps__title">Patient Intake</div>
          <div class="lm-steps__desc">Demographics and insurance</div>
        </div>
        <div class="lm-steps__item">
          <div class="lm-steps__number">2</div>
          <div class="lm-steps__title" style="font-weight: 700;">Clinical Assessment</div>
          <div class="lm-steps__desc">Vitals and chief complaint</div>
        </div>
        <div class="lm-steps__item lm-steps__item--pending">
          <div class="lm-steps__number">3</div>
          <div class="lm-steps__title">Diagnostic Orders</div>
          <div class="lm-steps__desc">Labs and imaging</div>
        </div>
        <div class="lm-steps__item lm-steps__item--pending">
          <div class="lm-steps__number">4</div>
          <div class="lm-steps__title">Treatment Plan</div>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "steps",
  "props": {
    "current": 1,
    "items": [
      {"title": "Patient Intake", "description": "Demographics and insurance", "status": "completed"},
      {"title": "Clinical Assessment", "description": "Vitals and chief complaint", "status": "active"},
      {"title": "Diagnostic Orders", "description": "Labs and imaging", "status": "pending"},
      {"title": "Treatment Plan", "status": "pending"}
    ]
  }
}
```

## Composition

```
Card(title="Prior Authorization Workflow",
  Stack(direction="vertical", gap=16,
    Steps(
      items=[
        {title:"Submit Request", status:"completed"},
        {title:"Clinical Review", description:"Peer-to-peer if needed", status:"completed"},
        {title:"Insurance Decision", status:"active"},
        {title:"Notification", description:"Patient and provider notified", status:"pending"}
      ],
      current=2
    ),
    Separator(),
    Alert(
      title="Awaiting Decision",
      message="Aetna clinical review completed. Decision expected within 48 hours.",
      variant="info"
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview — Prior Auth Workflow</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Steps — Prior Authorization</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Prior Authorization Workflow</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
            <div class="lm-steps">
              <div class="lm-steps__item lm-steps__item--completed">
                <div class="lm-steps__number">&#10003;</div>
                <div class="lm-steps__title">Submit Request</div>
              </div>
              <div class="lm-steps__item lm-steps__item--completed">
                <div class="lm-steps__number">&#10003;</div>
                <div class="lm-steps__title">Clinical Review</div>
                <div class="lm-steps__desc">Peer-to-peer if needed</div>
              </div>
              <div class="lm-steps__item">
                <div class="lm-steps__number">3</div>
                <div class="lm-steps__title" style="font-weight: 700;">Insurance Decision</div>
              </div>
              <div class="lm-steps__item lm-steps__item--pending">
                <div class="lm-steps__number">4</div>
                <div class="lm-steps__title">Notification</div>
                <div class="lm-steps__desc">Patient and provider notified</div>
              </div>
            </div>
            <div class="lm-separator">
              <div class="lm-separator__line"></div>
            </div>
            <div class="lm-alert lm-alert--info">
              <span class="lm-alert__icon">&#8505;</span>
              <div class="lm-alert__content">
                <div class="lm-alert__title">Awaiting Decision</div>
                <div class="lm-alert__message">Aetna clinical review completed. Decision expected within 48 hours.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- When `current` is provided, it takes precedence over individual `status` fields. This makes it easy to advance the indicator by changing a single number.
- If neither `current` nor individual `status` values are provided, all steps default to `"pending"`.
- Steps renders horizontally on wide viewports and vertically on narrow viewports.
- The `error` status is useful for indicating a step that failed or was rejected — for example, a denied prior authorization.
- Steps is display-only. It does not support click-to-navigate behavior.
