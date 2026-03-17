---
title: "Composition Patterns"
description: "Proven patterns for composing Lumen UI components into dashboards, clinical summaries, comparisons, and other complex layouts."
weight: 2
tags: [lumen-ui, patterns, composition, dashboard, layout]
categories: [guide]
difficulty: intermediate
estimated_reading_time: "8 min"
last_reviewed: "2026-03-17"
---

Lumen UI components are designed to compose. This page shows proven patterns for building complex layouts from simple building blocks.

## Dashboard

A multi-panel layout with stats, charts, and tables:

```
Grid(columns=2,
  Card(title="Patient Census",
    Stack(direction="horizontal", gap=16,
      Stat(label="Total", value="142", trend="up", change="+5"),
      Stat(label="ICU", value="28", trend="neutral"),
      Stat(label="Discharged Today", value="12", trend="down", change="-3")
    )
  ),
  Card(title="Admissions Trend",
    LineChart(
      series=[{label:"Admissions", data:[{x:1,y:12},{x:2,y:15},{x:3,y:9},{x:4,y:18}]}],
      height=200
    )
  ),
  Card(title="Department Distribution",
    PieChart(
      data=[{label:"Cardiology",value:35},{label:"Neurology",value:25},{label:"Orthopedics",value:20},{label:"Other",value:20}],
      donut=true, height=200
    )
  ),
  Card(title="Recent Admissions",
    Table(
      columns=[{key:"name",label:"Patient"},{key:"dept",label:"Department"},{key:"time",label:"Admitted"}],
      rows=[{name:"J. Smith",dept:"Cardiology",time:"08:30"},{name:"A. Jones",dept:"Neurology",time:"09:15"}],
      compact=true
    )
  )
)
```

**Key pattern:** `Grid` → `Card` → content component. The grid provides the layout, cards provide visual grouping, and content components (Stat, Chart, Table) provide the data.

## Tabbed View

Content organized into switchable tabs:

```
Tabs(labels=["Overview", "Vitals", "Labs", "Medications"],
  Card(title="Patient Overview",
    KeyValue(items=[
      {key:"Name", value:"Jane Doe"},
      {key:"Age", value:"68"},
      {key:"MRN", value:"MRN-12345"},
      {key:"Primary Dx", value:"CHF (I50.9)"}
    ])
  ),
  Card(title="Vital Signs",
    LineChart(
      series=[{label:"HR", data:[...]}, {label:"BP Systolic", data:[...]}],
      title="24-Hour Trend"
    )
  ),
  Card(title="Lab Results",
    LabRanges(results=[
      {name:"BNP", unit:"pg/mL", adult:"<100"},
      {name:"Troponin", unit:"ng/mL", adult:"<0.04"},
      {name:"Creatinine", unit:"mg/dL", adult:"0.7-1.3"}
    ])
  ),
  Card(title="Active Medications",
    Table(
      columns=[{key:"drug",label:"Medication"},{key:"dose",label:"Dose"},{key:"route",label:"Route"}],
      rows=[{drug:"Furosemide",dose:"40mg",route:"PO"},{drug:"Lisinopril",dose:"10mg",route:"PO"}]
    )
  )
)
```

**Key pattern:** `Tabs` with `labels` array, one child per tab. Each child is typically a `Card`.

## Clinical Summary

A vertical stack of clinical components for a patient encounter:

```
Stack(direction="vertical", gap=16,
  TriageCard(level=3, label="Urgent", chief_complaint="Chest pain, 2h onset"),

  Section(title="Assessment",
    DifferentialDx(
      chief_complaint="Chest pain",
      diagnoses=[{name:"ACS", probability:"High"}, {name:"PE", probability:"Moderate"}]
    )
  ),

  Section(title="Workup",
    Grid(columns=2,
      LabRanges(results=[{name:"Troponin", unit:"ng/mL", adult:"<0.04"}]),
      Calculator(name="HEART Score", score=7, severity="High Risk",
        interpretation="Recommend admission and cardiology consult")
    )
  ),

  Section(title="Plan",
    Checklist(title="ED Workup", items=[
      {text:"12-lead ECG", checked:true},
      {text:"Troponin x2 (0h, 3h)", checked:true},
      {text:"Chest X-Ray", checked:false},
      {text:"Cardiology consult", checked:false}
    ])
  )
)
```

**Key pattern:** `Stack` → `Section` → clinical components. Sections provide semantic grouping with collapsible headers.

## Comparison

Side-by-side comparison using a split view or table:

```
SplitView(ratio=0.5,
  Card(title="Drug A: Lisinopril",
    Stack(direction="vertical",
      Stat(label="Efficacy", value="85%"),
      Stat(label="Side Effects", value="Low"),
      DrugCard(name="Lisinopril 10 MG Oral Tablet", rxcui="104377")
    )
  ),
  Card(title="Drug B: Losartan",
    Stack(direction="vertical",
      Stat(label="Efficacy", value="82%"),
      Stat(label="Side Effects", value:"Low"),
      DrugCard(name="Losartan 50 MG Oral Tablet", rxcui="979467")
    )
  )
)
```

**Key pattern:** `SplitView` with two children for side-by-side comparison. For more than two items, use a `Table` with comparison columns.

## Step-by-Step Guide

A sequential workflow or protocol:

```
Card(title="Sepsis Management Protocol",
  Steps(
    items=[
      {title:"Recognize", description:"qSOFA >= 2 or SIRS criteria", status:"completed"},
      {title:"Resuscitate", description:"30mL/kg crystalloid within 3h", status:"completed"},
      {title:"Cultures", description:"Blood cultures before antibiotics", status:"active"},
      {title:"Antibiotics", description:"Broad-spectrum within 1h", status:"pending"},
      {title:"Reassess", description:"Repeat lactate, MAP target > 65", status:"pending"}
    ],
    current=2
  ),
  Separator(),
  Callout(variant="warning", title="Time-sensitive",
    message="Antibiotic administration within 1 hour of sepsis recognition is associated with improved mortality.")
)
```

**Key pattern:** `Steps` inside a `Card`, with `Separator` and `Callout` for context.

## Agent Tool Results

Rendering AI tool call results:

```
Stack(direction="vertical", gap=12,
  ToolCall(name="rxnorm_lookup", status="completed", primaryArg="metformin", duration="0.3s"),
  ToolResult(tool="rxnorm_lookup", status="success", summary="Found 5 results",
    DrugCard(name="Metformin 500 MG Oral Tablet", rxcui="861004")
  ),

  ToolCall(name="drug_interactions", status="completed", primaryArg="metformin", duration="1.2s"),
  ToolResult(tool="drug_interactions", status="success",
    DrugInteractions(drug="Metformin", labels=[{brand:"Glucophage", generic:"metformin hydrochloride", interactions:["Contrast dye: risk of lactic acidosis"]}])
  ),

  FollowUp(suggestions=["Check renal dosing", "Show adverse events", "Find alternatives"])
)
```

**Key pattern:** `ToolCall` → `ToolResult` → component, followed by `FollowUp` suggestions.

## Next Steps

- **[Component Reference](/docs/lumen-ui/components/)** — detailed docs for each component
- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — the syntax used in these examples
