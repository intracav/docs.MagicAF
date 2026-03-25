---
title: "Tabs"
description: "Tabbed container where each child maps to a labeled tab."
weight: 4
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Tabs organizes content into switchable panels. Each child component corresponds to one tab, and the `labels` prop provides the tab header text. Only the active tab's content is visible at a time. Use Tabs to present parallel views of related data — for example, different lab panels, medication categories, or clinical note sections.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `labels` | array of strings | — | **Required.** Tab header labels. The number of labels must match the number of children. |
| `defaultIndex` | number | `0` | Zero-based index of the tab that is selected on initial render. |

**Children:** Yes. Each child is the content for the corresponding tab. The first child renders under the first label, the second under the second label, and so on.

## DSL Example

```
Tabs(labels=["Overview", "Labs", "Medications"],
  Card(title="Patient Overview",
    Markdown(content="67-year-old male with HTN and T2DM. Presenting for routine follow-up.")
  ),
  Table(
    columns=[{key:"test", label:"Test"}, {key:"value", label:"Result"}, {key:"ref", label:"Reference"}],
    rows=[
      {test:"HbA1c", value:"7.1%", ref:"<7.0%"},
      {test:"Creatinine", value:"1.1 mg/dL", ref:"0.7-1.3"},
      {test:"eGFR", value:"72 mL/min", ref:">60"}
    ],
    striped=true
  ),
  Card(title="Active Medications",
    Stack(direction="vertical", gap=8,
      Markdown(content="- **Lisinopril** 10mg PO daily\n- **Metformin** 500mg PO BID\n- **Atorvastatin** 20mg PO QHS")
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview — Interactive Tabs (click to switch)</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Tabs — 3 Panels</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-tabs">
        <div class="lm-tabs__nav">
          <button class="lm-tabs__tab active" data-tab="overview">Overview</button>
          <button class="lm-tabs__tab" data-tab="labs">Labs</button>
          <button class="lm-tabs__tab" data-tab="meds">Medications</button>
        </div>
        <div class="lm-tabs__panel active" data-tab="overview">
          <div class="lm-card lm-card--ghost">
            <div class="lm-card__header">
              <div class="lm-card__title">Patient Overview</div>
            </div>
            <div class="lm-card__body">
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">67-year-old male with HTN and T2DM. Presenting for routine follow-up.</p>
            </div>
          </div>
        </div>
        <div class="lm-tabs__panel" data-tab="labs">
          <table class="lm-table lm-table--striped">
            <thead>
              <tr><th>Test</th><th>Result</th><th>Reference</th></tr>
            </thead>
            <tbody>
              <tr><td>HbA1c</td><td>7.1%</td><td>&lt;7.0%</td></tr>
              <tr><td>Creatinine</td><td>1.1 mg/dL</td><td>0.7-1.3</td></tr>
              <tr><td>eGFR</td><td>72 mL/min</td><td>&gt;60</td></tr>
            </tbody>
          </table>
        </div>
        <div class="lm-tabs__panel" data-tab="meds">
          <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
            <span class="lm-badge lm-badge--info">Lisinopril 10mg PO daily</span>
            <span class="lm-badge lm-badge--info">Metformin 500mg PO BID</span>
            <span class="lm-badge lm-badge--info">Atorvastatin 20mg PO QHS</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "tabs",
  "props": {
    "labels": ["Overview", "Labs", "Medications"],
    "defaultIndex": 0
  },
  "children": [
    {
      "type": "card",
      "title": "Patient Overview",
      "children": [
        {"type": "markdown", "content": "67-year-old male with HTN and T2DM."}
      ]
    },
    {
      "type": "table",
      "columns": [
        {"key": "test", "label": "Test"},
        {"key": "value", "label": "Result"}
      ],
      "rows": [
        {"test": "HbA1c", "value": "7.1%"},
        {"test": "Creatinine", "value": "1.1 mg/dL"}
      ]
    },
    {
      "type": "card",
      "title": "Active Medications",
      "children": [
        {"type": "markdown", "content": "- Lisinopril 10mg\n- Metformin 500mg"}
      ]
    }
  ]
}
```

## Composition

```
Card(title="Encounter Summary",
  Tabs(labels=["Subjective", "Objective", "Assessment", "Plan"],
    Markdown(content="""
    Chief complaint: Fatigue and increased thirst x 2 weeks.
    HPI: Patient reports polyuria, polydipsia, and a 5-lb weight loss.
    """),
    Stack(direction="vertical", gap=12,
      Grid(columns=3, gap=12,
        Stat(label="Temp", value="36.8", unit="°C"),
        Stat(label="HR", value="82", unit="bpm"),
        Stat(label="BP", value="142/88", unit="mmHg")
      ),
      Table(
        columns=[{key:"test", label:"Test"}, {key:"value", label:"Result"}, {key:"flag", label:"Flag"}],
        rows=[
          {test:"Glucose (fasting)", value:"186 mg/dL", flag:"H"},
          {test:"HbA1c", value:"8.2%", flag:"H"}
        ]
      )
    ),
    Markdown(content="1. Uncontrolled type 2 diabetes mellitus\n2. Hypertension, stage 1"),
    Markdown(content="1. Start **Metformin** 500mg PO BID\n2. Increase **Lisinopril** to 20mg daily\n3. Diabetic education referral\n4. Follow-up in 3 months with repeat HbA1c")
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview — SOAP Note (click tabs)</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Tabs — Encounter Summary (SOAP)</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Encounter Summary</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-tabs">
            <div class="lm-tabs__nav">
              <button class="lm-tabs__tab active" data-tab="subjective">Subjective</button>
              <button class="lm-tabs__tab" data-tab="objective">Objective</button>
              <button class="lm-tabs__tab" data-tab="assessment">Assessment</button>
              <button class="lm-tabs__tab" data-tab="plan">Plan</button>
            </div>
            <div class="lm-tabs__panel active" data-tab="subjective">
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;"><strong>Chief complaint:</strong> Fatigue and increased thirst x 2 weeks.<br><strong>HPI:</strong> Patient reports polyuria, polydipsia, and a 5-lb weight loss.</p>
            </div>
            <div class="lm-tabs__panel" data-tab="objective">
              <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
                <div class="lm-grid lm-grid--3" style="gap: 12px;">
                  <div class="lm-stat">
                    <span class="lm-stat__label">Temp</span>
                    <div class="lm-stat__value-row">
                      <span class="lm-stat__value">36.8</span>
                      <span class="lm-stat__unit">&deg;C</span>
                    </div>
                  </div>
                  <div class="lm-stat">
                    <span class="lm-stat__label">HR</span>
                    <div class="lm-stat__value-row">
                      <span class="lm-stat__value">82</span>
                      <span class="lm-stat__unit">bpm</span>
                    </div>
                  </div>
                  <div class="lm-stat">
                    <span class="lm-stat__label">BP</span>
                    <div class="lm-stat__value-row">
                      <span class="lm-stat__value">142/88</span>
                      <span class="lm-stat__unit">mmHg</span>
                    </div>
                  </div>
                </div>
                <table class="lm-table">
                  <thead>
                    <tr><th>Test</th><th>Result</th><th>Flag</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Glucose (fasting)</td><td>186 mg/dL</td><td class="flag-h">H</td></tr>
                    <tr><td>HbA1c</td><td>8.2%</td><td class="flag-h">H</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="lm-tabs__panel" data-tab="assessment">
              <ol style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Uncontrolled type 2 diabetes mellitus</li>
                <li>Hypertension, stage 1</li>
              </ol>
            </div>
            <div class="lm-tabs__panel" data-tab="plan">
              <ol style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Start <strong>Metformin</strong> 500mg PO BID</li>
                <li>Increase <strong>Lisinopril</strong> to 20mg daily</li>
                <li>Diabetic education referral</li>
                <li>Follow-up in 3 months with repeat HbA1c</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- If the number of children does not match the number of labels, extra children are ignored and extra labels render empty tabs.
- Tab selection is local UI state — it is not persisted or communicated back to the LLM.
- During streaming, tabs render as soon as `labels` is parsed. Tab content fills in progressively as children arrive.
- Each tab panel can contain any component or composition of components. Deeply nested structures work fine.
