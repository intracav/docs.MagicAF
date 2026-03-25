---
title: "FollowUp"
description: "Row of tappable suggestion buttons for follow-up questions."
weight: 4
tags: [lumen-ui, follow-up, ai]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `FollowUp` component renders a horizontal row of suggestion buttons that the user can tap to send a follow-up message. The agent generates these suggestions to guide the conversation toward useful next steps. Use it at the end of an agent response to surface relevant follow-up questions or actions.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `suggestions` | `array` | *required* | Array of strings, each representing a suggested follow-up message. |

**Actions:** Tapping a suggestion dispatches a `sendMessage` action with the suggestion text as the message content.

## DSL Example

```
FollowUp(
  suggestions=[
    "What are the side effects?",
    "Check for drug interactions",
    "Show prescribing information"
  ]
)
```

## JSON Example

```json
{
  "type": "follow_up",
  "props": {
    "suggestions": [
      "What are the side effects?",
      "Check for drug interactions",
      "Show prescribing information"
    ]
  }
}
```

## Composition

Follow-up suggestions at the end of a clinical response:

```
Stack(direction="vertical", gap=12,
  Markdown(content="Lisinopril 10mg is an ACE inhibitor commonly prescribed for hypertension and heart failure. Starting dose is typically 5-10mg daily, titrated to a target of 20-40mg."),
  Card(title="Key Information", variant="outlined",
    KeyValue(items=[
      {label:"Drug Class", value:"ACE Inhibitor"},
      {label:"Route", value:"Oral"},
      {label:"Frequency", value:"Once daily"}
    ])
  ),
  FollowUp(suggestions=[
    "What are common side effects?",
    "Check interactions with current medications",
    "What monitoring is needed?",
    "Show dosing guidelines for renal impairment"
  ])
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
<span class="lumen-demo__bar-title">Follow-Up Suggestions</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">Lisinopril 10mg is an ACE inhibitor commonly prescribed for hypertension and heart failure. Starting dose is typically 5-10mg daily, titrated to a target of 20-40mg.</div>

<div class="lm-follow-up">
<button class="lm-follow-up__btn">What are the side effects?</button>
<button class="lm-follow-up__btn">Check for drug interactions</button>
<button class="lm-follow-up__btn">Show prescribing information</button>
</div>

</div>
</div>
</div>
</div>

> **Try it** — Hover over the suggestion buttons to see the interactive highlight effect.

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Clinical Response</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div style="font-size:13px; color:var(--text-primary); line-height:1.6;">Lisinopril 10mg is an ACE inhibitor commonly prescribed for hypertension and heart failure. Starting dose is typically 5-10mg daily, titrated to a target of 20-40mg.</div>

<div class="lm-card lm-card--outlined">
<div class="lm-card__header"><div class="lm-card__title">Key Information</div></div>
<div class="lm-card__body">
<div class="lm-kv">
<span class="lm-kv__key">Drug Class</span><span class="lm-kv__value">ACE Inhibitor</span>
<span class="lm-kv__key">Route</span><span class="lm-kv__value">Oral</span>
<span class="lm-kv__key">Frequency</span><span class="lm-kv__value">Once daily</span>
</div>
</div>
</div>

<div class="lm-follow-up">
<button class="lm-follow-up__btn">What are common side effects?</button>
<button class="lm-follow-up__btn">Check interactions with current meds</button>
<button class="lm-follow-up__btn">What monitoring is needed?</button>
<button class="lm-follow-up__btn">Renal impairment dosing</button>
</div>

</div>
</div>
</div>
</div>

## Notes

- **Horizontal scroll**: When suggestions exceed the available width, the row scrolls horizontally. Each button is rendered as a compact chip.
- **Action dispatch**: Tapping a suggestion sends the text as a new user message in the current conversation. The suggestion buttons disappear after one is tapped.
- **Suggestion count**: There is no hard limit, but 3-5 suggestions provide the best user experience. More than 6 tends to cause decision fatigue.
- **Placement**: Typically the last component in an agent response. Placing it mid-response is valid but uncommon.
- **Empty state**: If `suggestions` is an empty array, the component renders nothing.
