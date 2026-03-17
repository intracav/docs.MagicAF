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

## Notes

- **Horizontal scroll**: When suggestions exceed the available width, the row scrolls horizontally. Each button is rendered as a compact chip.
- **Action dispatch**: Tapping a suggestion sends the text as a new user message in the current conversation. The suggestion buttons disappear after one is tapped.
- **Suggestion count**: There is no hard limit, but 3-5 suggestions provide the best user experience. More than 6 tends to cause decision fatigue.
- **Placement**: Typically the last component in an agent response. Placing it mid-response is valid but uncommon.
- **Empty state**: If `suggestions` is an empty array, the component renders nothing.
