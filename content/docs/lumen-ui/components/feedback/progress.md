---
title: "Progress"
description: "Progress bar for visualizing completion percentage."
weight: 4
tags: [lumen-ui, progress, feedback]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Progress renders a horizontal bar that fills proportionally to a given value, visualizing completion or capacity. Use it for treatment progress, protocol adherence rates, task completion, or any metric expressed as a percentage of a known total.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | number | — | **Required.** Current progress as a percentage (0-100). |
| `label` | string | — | Descriptive text displayed above the progress bar. |
| `variant` | `"default"` \| `"success"` \| `"warning"` \| `"error"` | `"default"` | Controls the fill color. `default` is the primary accent. `success` is green. `warning` is amber. `error` is red. |
| `showPercentage` | bool | `true` | Whether to display the numeric percentage next to the bar. |
| `height` | number | — | Height of the bar in logical pixels. Defaults to a standard size when omitted. |

**Children:** No.

## DSL Example

```
Progress(value=75, label="Treatment Progress", variant="success", showPercentage=true)
```

## JSON Example

```json
{
  "type": "progress",
  "props": {
    "value": 75,
    "label": "Treatment Progress",
    "variant": "success",
    "showPercentage": true
  }
}
```

## Composition

```
Card(title="Chemotherapy Protocol — Cycle 3 of 6",
  Stack(direction="vertical", gap=16,
    Progress(value=50, label="Overall Protocol Completion", variant="default"),
    Separator(),
    Stack(direction="vertical", gap=8,
      Progress(value=100, label="Day 1 — Cisplatin", variant="success"),
      Progress(value=100, label="Day 2 — Etoposide", variant="success"),
      Progress(value=60, label="Day 3 — Etoposide (in progress)", variant="warning"),
      Progress(value=0, label="Day 4 — Rest"),
      Progress(value=0, label="Day 5 — Labs")
    ),
    Separator(),
    Alert(title="On Track", message="Patient tolerating therapy well. No dose modifications required.", variant="success")
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
<span class="lumen-demo__bar-title">Progress Bars</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Treatment Progress</span><span class="lm-progress__percent">75%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:75%; background:var(--accent); transition:width 1.5s cubic-bezier(0.4,0,0.2,1);"></div></div>
</div>

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Protocol Adherence</span><span class="lm-progress__percent">100%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:100%; background:#3BA55C; transition:width 1.5s cubic-bezier(0.4,0,0.2,1) 0.15s;"></div></div>
</div>

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Medication Compliance</span><span class="lm-progress__percent">42%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:42%; background:#F5A623; transition:width 1.5s cubic-bezier(0.4,0,0.2,1) 0.3s;"></div></div>
</div>

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Critical Threshold Exceeded</span><span class="lm-progress__percent">18%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:18%; background:#DA373C; transition:width 1.5s cubic-bezier(0.4,0,0.2,1) 0.45s;"></div></div>
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
<span class="lumen-demo__bar-title">Chemotherapy Protocol &mdash; Cycle 3 of 6</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Chemotherapy Protocol &mdash; Cycle 3 of 6</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Overall Protocol Completion</span><span class="lm-progress__percent">50%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:50%; background:var(--accent); transition:width 1.5s cubic-bezier(0.4,0,0.2,1);"></div></div>
</div>

<hr style="border:none; border-top:1px solid var(--border); margin:4px 0;">

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Day 1 &mdash; Cisplatin</span><span class="lm-progress__percent">100%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:100%; background:#3BA55C;"></div></div>
</div>

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Day 2 &mdash; Etoposide</span><span class="lm-progress__percent">100%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:100%; background:#3BA55C;"></div></div>
</div>

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Day 3 &mdash; Etoposide (in progress)</span><span class="lm-progress__percent">60%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:60%; background:#F5A623;"></div></div>
</div>

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Day 4 &mdash; Rest</span><span class="lm-progress__percent">0%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:0%;"></div></div>
</div>

<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Day 5 &mdash; Labs</span><span class="lm-progress__percent">0%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:0%;"></div></div>
</div>

<hr style="border:none; border-top:1px solid var(--border); margin:4px 0;">

<div class="lm-alert lm-alert--success">
<span class="lm-alert__icon">&#10003;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">On Track</div>
<div class="lm-alert__message">Patient tolerating therapy well. No dose modifications required.</div>
</div>
</div>

</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The `value` prop is clamped to the 0-100 range. Values below 0 render as empty; values above 100 render as full.
- Use `variant` to encode meaning: `success` for completed or on-track, `warning` for approaching a threshold, `error` for off-track or critical.
- When `showPercentage` is false, only the bar is rendered — useful when the percentage is already displayed elsewhere or when the visual proportion is sufficient.
- The `height` prop allows thicker bars for prominence or thinner bars for compact layouts. If omitted, the renderer uses a default height appropriate for the current context.
