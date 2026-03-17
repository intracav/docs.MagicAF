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

## Notes

- Badge is a leaf component — it does not accept children. The `text` prop controls its entire content.
- Keep badge text short (1-3 words). Badges are designed for labels, not sentences.
- Use `destructive` for critical or dangerous states, `warning` for caution, `success` for confirmed or positive states, and `secondary` for neutral metadata.
- The `outline` variant is useful when badges appear over colored backgrounds — it avoids visual competition with the container's color.
