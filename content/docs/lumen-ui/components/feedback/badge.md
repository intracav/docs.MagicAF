---
title: "Badge"
description: "Inline label or tag for categorization and status indication."
weight: 3
tags: [lumen-ui, badge, feedback]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Badge renders a compact, inline label for tagging, categorizing, or indicating status. Badges are typically used inside cards, tables, or stacks to annotate items with short labels — severity levels, medication classes, order statuses, or diagnosis codes.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | string | — | **Required.** The label text displayed inside the badge. |
| `variant` | `"default"` \| `"secondary"` \| `"destructive"` \| `"outline"` \| `"success"` \| `"warning"` | `"default"` | Controls the color scheme. `default` is the primary accent color. `destructive` is red. `success` is green. `warning` is amber. `secondary` is muted. `outline` is transparent with a border. |

**Children:** No.

## DSL Example

```
Badge(text="Critical", variant="destructive")
```

## JSON Example

```json
{
  "type": "badge",
  "props": {
    "text": "Critical",
    "variant": "destructive"
  }
}
```

## Composition

```
Card(title="Active Orders",
  Table(
    columns=[
      {key:"order", label:"Order"},
      {key:"status", label:"Status"},
      {key:"priority", label:"Priority"}
    ],
    rows=[
      {order:"CBC with Diff", status:"Resulted", priority:"Routine"},
      {order:"CT Abdomen/Pelvis", status:"Pending", priority:"Stat"},
      {order:"Blood Culture x2", status:"Collected", priority:"Urgent"}
    ]
  )
)
```

Badges used inline with other components:

```
Card(title="Patient Allergies",
  Stack(direction="horizontal", gap=8,
    Badge(text="Penicillin — Anaphylaxis", variant="destructive"),
    Badge(text="Sulfa — Rash", variant="warning"),
    Badge(text="Latex — Contact Dermatitis", variant="secondary"),
    Badge(text="NKDA Verified", variant="success")
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
<span class="lumen-demo__bar-title">Badge Variants</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">All Variants</div>
<div class="lm-stack lm-stack--horizontal lm-stack--gap-8" style="flex-wrap:wrap;">
<span class="lm-badge lm-badge--default">Default</span>
<span class="lm-badge lm-badge--success">Success</span>
<span class="lm-badge lm-badge--warning">Warning</span>
<span class="lm-badge lm-badge--error">Critical</span>
<span class="lm-badge lm-badge--info">Info</span>
</div>
</div>

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">Clinical Use &mdash; Patient Allergies</div>
<div class="lm-stack lm-stack--horizontal lm-stack--gap-8" style="flex-wrap:wrap;">
<span class="lm-badge lm-badge--error">Penicillin &mdash; Anaphylaxis</span>
<span class="lm-badge lm-badge--warning">Sulfa &mdash; Rash</span>
<span class="lm-badge lm-badge--default">Latex &mdash; Contact</span>
<span class="lm-badge lm-badge--success">NKDA Verified</span>
</div>
</div>

<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:8px;">Order Statuses</div>
<div class="lm-stack lm-stack--horizontal lm-stack--gap-8" style="flex-wrap:wrap;">
<span class="lm-badge lm-badge--success">Resulted</span>
<span class="lm-badge lm-badge--warning">Pending</span>
<span class="lm-badge lm-badge--info">In Progress</span>
<span class="lm-badge lm-badge--error">Stat</span>
<span class="lm-badge lm-badge--default">Routine</span>
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
<span class="lumen-demo__bar-title">Active Orders</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Active Orders</div></div>
<div class="lm-card__body">
<table class="lm-table">
<thead><tr><th>Order</th><th>Status</th><th>Priority</th></tr></thead>
<tbody>
<tr><td>CBC with Diff</td><td><span class="lm-badge lm-badge--success">Resulted</span></td><td><span class="lm-badge lm-badge--default">Routine</span></td></tr>
<tr><td>CT Abdomen/Pelvis</td><td><span class="lm-badge lm-badge--warning">Pending</span></td><td><span class="lm-badge lm-badge--error">Stat</span></td></tr>
<tr><td>Blood Culture x2</td><td><span class="lm-badge lm-badge--info">Collected</span></td><td><span class="lm-badge lm-badge--warning">Urgent</span></td></tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
</div>

## Notes

- Badge is a leaf component — it does not accept children. The `text` prop controls its entire content.
- Keep badge text short (1-3 words). Badges are designed for labels, not sentences.
- Use `destructive` for critical or dangerous states, `warning` for caution, `success` for confirmed or positive states, and `secondary` for neutral metadata.
- The `outline` variant is useful when badges appear over colored backgrounds — it avoids visual competition with the container's color.
