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

## Notes

- If the number of children does not match the number of labels, extra children are ignored and extra labels render empty tabs.
- Tab selection is local UI state — it is not persisted or communicated back to the LLM.
- During streaming, tabs render as soon as `labels` is parsed. Tab content fills in progressively as children arrive.
- Each tab panel can contain any component or composition of components. Deeply nested structures work fine.
