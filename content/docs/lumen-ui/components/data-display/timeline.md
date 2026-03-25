---
title: "Timeline"
description: "Vertical timeline with dated events, color-coded by variant."
weight: 8
tags: [lumen-ui, timeline, data-display]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `Timeline` component renders a vertical sequence of events with colored dots, connecting lines, optional dates, and descriptions. Each event can be assigned a variant that controls its dot color, making it suitable for patient histories, treatment plans, workflow progress, and audit trails.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `events` | `array` | *required* | Array of event objects. Each object supports: `title` (string, required), `date` (string, optional), `description` (string, optional), `variant` (enum, optional). |

### Event Object Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string` | *required* | Event title text. |
| `date` | `string` | — | Date or timestamp displayed in the left column. |
| `description` | `string` | — | Additional detail rendered below the title in muted text. |
| `variant` | `enum` | `"default"` | Dot color. Options: `default` (primary/blue), `success` (green), `warning` (amber), `error` (red), `info` (primary/blue). |

## DSL Example

```
Timeline(events=[
  {date:"2026-03-15", title:"Admitted", description:"Chief complaint: acute abdominal pain", variant:"info"},
  {date:"2026-03-15", title:"CT Scan", description:"Acute appendicitis confirmed", variant:"warning"},
  {date:"2026-03-16", title:"Appendectomy", description:"Laparoscopic, no complications", variant:"success"},
  {date:"2026-03-17", title:"Discharged", description:"Stable, tolerating oral intake", variant:"success"}
])
```

## Live Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Timeline — Patient Encounter</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-timeline">
        <div class="lm-timeline__item">
          <div class="lm-timeline__dot" style="background:#5865F2;box-shadow:0 0 0 2px #5865F2;"></div>
          <div class="lm-timeline__date">2026-03-15</div>
          <div class="lm-timeline__title">Admitted</div>
          <div class="lm-timeline__desc">Chief complaint: acute abdominal pain, RLQ tenderness. Vitals stable on arrival.</div>
        </div>
        <div class="lm-timeline__item">
          <div class="lm-timeline__dot" style="background:#F5A623;box-shadow:0 0 0 2px #F5A623;"></div>
          <div class="lm-timeline__date">2026-03-15</div>
          <div class="lm-timeline__title">CT Abdomen/Pelvis</div>
          <div class="lm-timeline__desc">Findings consistent with acute appendicitis. No perforation or abscess.</div>
        </div>
        <div class="lm-timeline__item">
          <div class="lm-timeline__dot" style="background:#F5A623;box-shadow:0 0 0 2px #F5A623;"></div>
          <div class="lm-timeline__date">2026-03-16</div>
          <div class="lm-timeline__title">Laparoscopic Appendectomy</div>
          <div class="lm-timeline__desc">Procedure completed without complications. EBL &lt; 50 mL. Duration: 47 min.</div>
        </div>
        <div class="lm-timeline__item">
          <div class="lm-timeline__dot" style="background:#3BA55C;box-shadow:0 0 0 2px #3BA55C;"></div>
          <div class="lm-timeline__date">2026-03-16</div>
          <div class="lm-timeline__title">Post-Op Recovery</div>
          <div class="lm-timeline__desc">Patient stable, tolerating clear liquids, pain controlled with PO analgesics.</div>
        </div>
        <div class="lm-timeline__item">
          <div class="lm-timeline__dot" style="background:#3BA55C;box-shadow:0 0 0 2px #3BA55C;"></div>
          <div class="lm-timeline__date">2026-03-17</div>
          <div class="lm-timeline__title">Discharged</div>
          <div class="lm-timeline__desc">Stable, tolerating oral intake. Follow-up in 7 days with surgeon.</div>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "timeline",
  "props": {
    "events": [
      {
        "date": "2026-03-15",
        "title": "Admitted",
        "description": "Chief complaint: acute abdominal pain",
        "variant": "info"
      },
      {
        "date": "2026-03-16",
        "title": "Appendectomy",
        "description": "Laparoscopic, no complications",
        "variant": "success"
      },
      {
        "date": "2026-03-17",
        "title": "Discharged",
        "variant": "success"
      }
    ]
  }
}
```

## Composition

A patient encounter card with a timeline and summary stats:

```
Card(title="Encounter Timeline",
  Grid(columns=3, gap=12,
    Stat(label="Length of Stay", value="3", unit="days"),
    Stat(label="Procedures", value="1"),
    Stat(label="Complications", value="0", variant="success")
  ),
  Timeline(events=[
    {date:"03-15", title:"Admission", variant:"info"},
    {date:"03-15", title:"Labs Ordered", description:"CBC, BMP, Lipase", variant:"default"},
    {date:"03-15", title:"CT Abdomen", description:"Acute appendicitis", variant:"warning"},
    {date:"03-16", title:"Surgery", description:"Laparoscopic appendectomy", variant:"warning"},
    {date:"03-16", title:"Post-Op Stable", variant:"success"},
    {date:"03-17", title:"Discharge", description:"Home with instructions", variant:"success"}
  ])
)
```

## Composition Preview

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Card + Grid + Stat + Timeline — Encounter Summary</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card lm-card--elevated">
        <div class="lm-card__header"><div class="lm-card__title">Encounter Timeline</div></div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--3" style="margin-bottom:20px;">
            <div class="lm-stat">
              <div class="lm-stat__label">Length of Stay</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">3</span>
                <span class="lm-stat__unit">days</span>
              </div>
            </div>
            <div class="lm-stat">
              <div class="lm-stat__label">Procedures</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">1</span>
              </div>
            </div>
            <div class="lm-stat lm-stat--success">
              <div class="lm-stat__label">Complications</div>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">0</span>
              </div>
            </div>
          </div>
          <div class="lm-timeline">
            <div class="lm-timeline__item">
              <div class="lm-timeline__dot" style="background:#5865F2;box-shadow:0 0 0 2px #5865F2;"></div>
              <div class="lm-timeline__date">03-15</div>
              <div class="lm-timeline__title">Admission</div>
            </div>
            <div class="lm-timeline__item">
              <div class="lm-timeline__dot"></div>
              <div class="lm-timeline__date">03-15</div>
              <div class="lm-timeline__title">Labs Ordered</div>
              <div class="lm-timeline__desc">CBC, BMP, Lipase</div>
            </div>
            <div class="lm-timeline__item">
              <div class="lm-timeline__dot" style="background:#F5A623;box-shadow:0 0 0 2px #F5A623;"></div>
              <div class="lm-timeline__date">03-15</div>
              <div class="lm-timeline__title">CT Abdomen</div>
              <div class="lm-timeline__desc">Acute appendicitis</div>
            </div>
            <div class="lm-timeline__item">
              <div class="lm-timeline__dot" style="background:#F5A623;box-shadow:0 0 0 2px #F5A623;"></div>
              <div class="lm-timeline__date">03-16</div>
              <div class="lm-timeline__title">Surgery</div>
              <div class="lm-timeline__desc">Laparoscopic appendectomy</div>
            </div>
            <div class="lm-timeline__item">
              <div class="lm-timeline__dot" style="background:#3BA55C;box-shadow:0 0 0 2px #3BA55C;"></div>
              <div class="lm-timeline__date">03-16</div>
              <div class="lm-timeline__title">Post-Op Stable</div>
            </div>
            <div class="lm-timeline__item">
              <div class="lm-timeline__dot" style="background:#3BA55C;box-shadow:0 0 0 2px #3BA55C;"></div>
              <div class="lm-timeline__date">03-17</div>
              <div class="lm-timeline__title">Discharge</div>
              <div class="lm-timeline__desc">Home with instructions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- **Date column**: When `date` is present on any event, a 72px-wide left column is reserved for dates. The date is right-aligned and rendered in a muted caption style. If no events have a `date` field, the date column is omitted entirely.
- **Connecting line**: A vertical line connects each event dot to the next. The line is omitted after the last event.
- **Dot glow**: Each event dot has a subtle glow shadow matching its variant color for visual emphasis.
- **No date required**: Events without a `date` field still render correctly — the title and description appear next to the dot, but the date column is empty for that row.
- **Empty state**: If `events` is an empty array, the component renders nothing.
