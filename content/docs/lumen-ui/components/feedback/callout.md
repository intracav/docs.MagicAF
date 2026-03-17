---
title: "Callout"
description: "Highlighted information callout with optional children for rich content."
weight: 2
tags: [lumen-ui, callout, feedback]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Callout renders a highlighted block for surfacing supplementary information, clinical pearls, tips, or warnings. Unlike Alert, Callout accepts children, making it suitable for embedding structured content — lists, tables, or other components — inside an accented container.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `"info"` \| `"warning"` \| `"danger"` \| `"tip"` | — | **Required.** Controls the color scheme and icon. `info` is blue, `warning` is amber, `danger` is red, `tip` is green. |
| `title` | string | — | Optional heading text displayed at the top of the callout. |
| `message` | string | — | Body text displayed below the title. |

**Children:** Yes. Any components placed as children render inside the callout body below the title and message.

## DSL Example

```
Callout(variant="tip", title="Clinical Pearl", message="Consider checking renal function before starting ACE inhibitors")
```

## JSON Example

```json
{
  "type": "callout",
  "props": {
    "variant": "tip",
    "title": "Clinical Pearl",
    "message": "Consider checking renal function before starting ACE inhibitors"
  }
}
```

With children:

```json
{
  "type": "callout",
  "props": {
    "variant": "warning",
    "title": "Black Box Warning"
  },
  "children": [
    {
      "type": "markdown",
      "props": {
        "content": "**Fluoroquinolones** are associated with disabling and potentially irreversible adverse reactions including:\n- Tendinitis and tendon rupture\n- Peripheral neuropathy\n- CNS effects"
      }
    }
  ]
}
```

## Composition

```
Card(title="Medication Counseling — Warfarin",
  Stack(direction="vertical", gap=12,
    Callout(variant="danger", title="High-Risk Medication",
      Markdown(content="Warfarin requires regular INR monitoring. Target INR range: **2.0 – 3.0** for most indications.")
    ),
    Callout(variant="tip", title="Patient Education Points",
      Stack(direction="vertical", gap=4,
        Markdown(content="- Maintain consistent vitamin K intake\n- Report unusual bruising or bleeding\n- Avoid NSAIDs unless directed\n- Carry a medical alert card")
      )
    ),
    Callout(variant="info", title="Next Lab Due",
      Stack(direction="horizontal", gap=12,
        Stat(label="INR Due", value="2026-03-24"),
        Stat(label="Last INR", value="2.4")
      )
    )
  )
)
```

## Notes

- Callout's `variant` uses `"danger"` instead of `"error"` — this differs from Alert's enum. Use `"danger"` for Callout, `"error"` for Alert.
- Callout's `variant` uses `"tip"` instead of `"success"` — use `"tip"` for best practices, clinical pearls, and positive guidance.
- When both `message` and children are provided, the message renders first, followed by the children.
- Callout is ideal for FDA black box warnings, clinical decision support tips, and protocol reminders where rich formatting is needed.
