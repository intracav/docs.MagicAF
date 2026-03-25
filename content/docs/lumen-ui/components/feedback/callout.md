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

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Callout Variants</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-callout" style="border-left:3px solid #5865F2; background:rgba(88,101,242,0.06); border-radius:8px; padding:12px 14px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:4px; color:#5865F2;">&#9432; Info</div>
<div class="lm-callout__body" style="font-size:13px; color:var(--text-secondary);">Consider checking renal function before starting ACE inhibitors in patients over 65.</div>
</div>

<div class="lm-callout" style="border-left:3px solid #F5A623; background:rgba(245,166,35,0.06); border-radius:8px; padding:12px 14px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:4px; color:#F5A623;">&#9888; Warning</div>
<div class="lm-callout__body" style="font-size:13px; color:var(--text-secondary);">Fluoroquinolones are associated with tendinitis, peripheral neuropathy, and CNS effects.</div>
</div>

<div class="lm-callout" style="border-left:3px solid #DA373C; background:rgba(218,55,60,0.06); border-radius:8px; padding:12px 14px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:4px; color:#DA373C;">&#9888; Black Box Warning</div>
<div class="lm-callout__body" style="font-size:13px; color:var(--text-secondary);"><strong>Warfarin</strong> requires regular INR monitoring. Target INR range: <strong>2.0 &ndash; 3.0</strong> for most indications. Risk of fatal bleeding events.</div>
</div>

<div class="lm-callout" style="border-left:3px solid #3BA55C; background:rgba(59,165,92,0.06); border-radius:8px; padding:12px 14px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:4px; color:#3BA55C;">&#10003; Clinical Pearl</div>
<div class="lm-callout__body" style="font-size:13px; color:var(--text-secondary);">Maintain consistent vitamin K intake while on warfarin. Report unusual bruising or bleeding promptly.</div>
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
<span class="lumen-demo__bar-title">Medication Counseling &mdash; Warfarin</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Medication Counseling &mdash; Warfarin</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-callout" style="border-left:3px solid #DA373C; background:rgba(218,55,60,0.06); border-radius:8px; padding:12px 14px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:4px; color:#DA373C;">High-Risk Medication</div>
<div class="lm-callout__body" style="font-size:13px; color:var(--text-secondary);">Warfarin requires regular INR monitoring. Target INR range: <strong>2.0 &ndash; 3.0</strong> for most indications.</div>
</div>

<div class="lm-callout" style="border-left:3px solid #3BA55C; background:rgba(59,165,92,0.06); border-radius:8px; padding:12px 14px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:6px; color:#3BA55C;">Patient Education Points</div>
<div class="lm-callout__body" style="font-size:13px; color:var(--text-secondary);">
&bull; Maintain consistent vitamin K intake<br>
&bull; Report unusual bruising or bleeding<br>
&bull; Avoid NSAIDs unless directed<br>
&bull; Carry a medical alert card
</div>
</div>

<div class="lm-callout" style="border-left:3px solid #5865F2; background:rgba(88,101,242,0.06); border-radius:8px; padding:12px 14px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:6px; color:#5865F2;">Next Lab Due</div>
<div class="lm-callout__body">
<div class="lm-stack lm-stack--horizontal lm-stack--gap-24">
<div class="lm-stat"><div class="lm-stat__label">INR Due</div><div class="lm-stat__value" style="font-size:18px;">2026-03-24</div></div>
<div class="lm-stat"><div class="lm-stat__label">Last INR</div><div class="lm-stat__value" style="font-size:18px;">2.4</div></div>
</div>
</div>
</div>

</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- Callout's `variant` uses `"danger"` instead of `"error"` — this differs from Alert's enum. Use `"danger"` for Callout, `"error"` for Alert.
- Callout's `variant` uses `"tip"` instead of `"success"` — use `"tip"` for best practices, clinical pearls, and positive guidance.
- When both `message` and children are provided, the message renders first, followed by the children.
- Callout is ideal for FDA black box warnings, clinical decision support tips, and protocol reminders where rich formatting is needed.
