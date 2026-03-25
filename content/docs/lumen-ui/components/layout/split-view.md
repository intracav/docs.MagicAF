---
title: "SplitView"
description: "Two-pane layout with adjustable width ratio."
weight: 10
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

SplitView divides its content area into two side-by-side panes with a configurable width ratio. The first child occupies the left pane and the second child occupies the right pane. Use SplitView for master-detail layouts, side-by-side comparisons, or any situation where two content areas should share horizontal space at a specific proportion.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `ratio` | number | `0.5` | Fraction of total width allocated to the left pane, from `0.0` to `1.0`. For example, `0.6` gives 60% to the left pane and 40% to the right. |
| `gap` | number | — | Space in logical pixels between the two panes. |

**Children:** Expects exactly 2 children. The first child renders in the left pane, the second in the right pane. If more than 2 children are provided, extras are ignored. If fewer than 2, the missing pane is empty.

## DSL Example

```
SplitView(ratio=0.6, gap=16,
  Card(title="Patient Information",
    Stack(direction="vertical", gap=8,
      KeyValue(items=[
        {key:"Name", value:"Maria Santos"},
        {key:"DOB", value:"1958-11-23"},
        {key:"MRN", value:"00482916"},
        {key:"PCP", value:"Dr. James Chen"}
      ])
    )
  ),
  Card(title="Clinical Notes",
    Markdown(content="Patient presents for evaluation of persistent lower back pain radiating to the left leg. Symptoms began 3 weeks ago without antecedent trauma. Pain is worse with sitting and improves with walking.")
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview — 60/40 Split</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">SplitView — ratio=0.6</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-split lm-split--horizontal" style="grid-template-columns: 60% 1fr;">
        <div class="lm-split__pane">
          <div class="lm-card__header" style="padding: 0 0 8px;">
            <div class="lm-card__title">Patient Information</div>
          </div>
          <div class="lm-kv">
            <span class="lm-kv__key">Name</span>
            <span class="lm-kv__value">Maria Santos</span>
            <span class="lm-kv__key">DOB</span>
            <span class="lm-kv__value">1958-11-23</span>
            <span class="lm-kv__key">MRN</span>
            <span class="lm-kv__value">00482916</span>
            <span class="lm-kv__key">PCP</span>
            <span class="lm-kv__value">Dr. James Chen</span>
          </div>
        </div>
        <div class="lm-split__pane">
          <div class="lm-card__header" style="padding: 0 0 8px;">
            <div class="lm-card__title">Clinical Notes</div>
          </div>
          <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">Patient presents for evaluation of persistent lower back pain radiating to the left leg. Symptoms began 3 weeks ago without antecedent trauma.</p>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "split_view",
  "props": {
    "ratio": 0.6,
    "gap": 16
  },
  "children": [
    {
      "type": "card",
      "title": "Patient Information",
      "children": [
        {
          "type": "key_value",
          "items": [
            {"key": "Name", "value": "Maria Santos"},
            {"key": "DOB", "value": "1958-11-23"},
            {"key": "MRN", "value": "00482916"}
          ]
        }
      ]
    },
    {
      "type": "card",
      "title": "Clinical Notes",
      "children": [
        {
          "type": "markdown",
          "content": "Patient presents for evaluation of persistent lower back pain."
        }
      ]
    }
  ]
}
```

## Composition

```
Card(title="Medication Reconciliation",
  SplitView(ratio=0.5, gap=16,
    Card(title="Home Medications", variant="outlined",
      ScrollArea(maxHeight=350,
        Table(
          columns=[{key:"drug", label:"Drug"}, {key:"dose", label:"Dose"}, {key:"route", label:"Route"}],
          rows=[
            {drug:"Lisinopril", dose:"10mg", route:"PO daily"},
            {drug:"Metformin", dose:"500mg", route:"PO BID"},
            {drug:"Atorvastatin", dose:"20mg", route:"PO QHS"},
            {drug:"Aspirin", dose:"81mg", route:"PO daily"},
            {drug:"Omeprazole", dose:"20mg", route:"PO daily"}
          ],
          striped=true
        )
      )
    ),
    Card(title="Inpatient Orders", variant="outlined",
      ScrollArea(maxHeight=350,
        Stack(direction="vertical", gap=8,
          Alert(title="New", message="Enoxaparin 40mg SQ daily — DVT prophylaxis", variant="info"),
          Alert(title="Held", message="Metformin — held for contrast study", variant="warning"),
          Alert(title="Continued", message="Lisinopril 10mg PO daily", variant="default"),
          Alert(title="Continued", message="Atorvastatin 20mg PO QHS", variant="default"),
          Alert(title="Continued", message="Aspirin 81mg PO daily", variant="default")
        )
      )
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview — Medication Reconciliation</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">SplitView — Med Reconciliation</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Medication Reconciliation</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-split lm-split--horizontal">
            <div class="lm-split__pane">
              <div class="lm-card__header" style="padding: 0 0 8px;">
                <div class="lm-card__title" style="font-size: 13px;">Home Medications</div>
              </div>
              <table class="lm-table lm-table--compact lm-table--striped">
                <thead>
                  <tr><th>Drug</th><th>Dose</th><th>Route</th></tr>
                </thead>
                <tbody>
                  <tr><td>Lisinopril</td><td>10mg</td><td>PO daily</td></tr>
                  <tr><td>Metformin</td><td>500mg</td><td>PO BID</td></tr>
                  <tr><td>Atorvastatin</td><td>20mg</td><td>PO QHS</td></tr>
                  <tr><td>Aspirin</td><td>81mg</td><td>PO daily</td></tr>
                  <tr><td>Omeprazole</td><td>20mg</td><td>PO daily</td></tr>
                </tbody>
              </table>
            </div>
            <div class="lm-split__pane">
              <div class="lm-card__header" style="padding: 0 0 8px;">
                <div class="lm-card__title" style="font-size: 13px;">Inpatient Orders</div>
              </div>
              <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
                <div class="lm-alert lm-alert--info" style="padding: 8px 12px;">
                  <span class="lm-alert__icon" style="font-size: 12px;">&#8505;</span>
                  <div class="lm-alert__content">
                    <div class="lm-alert__title" style="font-size: 12px;">New</div>
                    <div class="lm-alert__message" style="font-size: 11px;">Enoxaparin 40mg SQ daily</div>
                  </div>
                </div>
                <div class="lm-alert lm-alert--warning" style="padding: 8px 12px;">
                  <span class="lm-alert__icon" style="font-size: 12px;">&#9888;</span>
                  <div class="lm-alert__content">
                    <div class="lm-alert__title" style="font-size: 12px;">Held</div>
                    <div class="lm-alert__message" style="font-size: 11px;">Metformin &mdash; contrast study</div>
                  </div>
                </div>
                <div class="lm-alert" style="padding: 8px 12px;">
                  <div class="lm-alert__content">
                    <div class="lm-alert__title" style="font-size: 12px;">Continued</div>
                    <div class="lm-alert__message" style="font-size: 11px;">Lisinopril 10mg PO daily</div>
                  </div>
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

- On narrow viewports (mobile), SplitView collapses to a vertical stack with both panes at full width. The left pane renders above the right pane.
- A `ratio` of `0.5` produces two equal-width panes. Values like `0.3` (30/70) or `0.7` (70/30) are common for sidebar/main layouts.
- SplitView does not support more than two panes. For three or more columns, use Grid.
- Nesting SplitViews is possible but not recommended — use Grid for multi-column layouts instead.
- If `gap` is omitted, the panes are placed directly adjacent with no spacing.
