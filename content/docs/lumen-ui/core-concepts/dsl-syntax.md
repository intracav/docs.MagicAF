---
title: "DSL Syntax"
description: "Complete reference for the Lumen DSL — the PascalCase function-call syntax used by LLMs to describe component trees."
weight: 1
tags: [lumen-ui, dsl, syntax, parser]
categories: [concept]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/introduction/
estimated_reading_time: "10 min"
last_reviewed: "2026-03-17"
---

The Lumen DSL is a purpose-built language for describing component trees. It uses PascalCase function-call syntax — compact enough for LLMs to produce efficiently, readable enough for humans to author and debug.

## Basic Syntax

A component is a PascalCase name followed by parentheses containing key-value props:

```
ComponentName(key=value, key=value)
```

Examples:

```
Alert(title="Low hemoglobin", variant="warning")
Stat(label="Heart Rate", value="72", unit="bpm")
Badge(text="Critical", variant="destructive")
```

## Prop Types

### Strings

Quoted with double quotes. Supports standard escape sequences.

```
Card(title="Patient Summary", description="Last updated 2026-03-17")
```

### Triple-Quoted Strings

For multi-line content, use triple double quotes:

```
Markdown(content="""
## Discharge Instructions

1. Take medications as prescribed
2. Follow up in 7 days
3. Call if symptoms worsen
""")
```

### Numbers

Integers and floating-point numbers, unquoted:

```
Gauge(value=98.6, min=95, max=105)
Grid(columns=3, gap=16)
```

### Booleans

`true` or `false`, unquoted:

```
Table(striped=true, compact=false)
Checkbox(checked=true, disabled=false)
```

### Arrays

Square brackets with comma-separated values:

```
Tabs(labels=["Overview", "Labs", "Medications"])
FollowUp(suggestions=["What are the side effects?", "Check interactions"])
```

### Objects

Curly braces with key-value pairs. Keys can be unquoted if they are simple identifiers:

```
Stat(label="WBC", value="7.2", trend="up", change="+0.3")
```

### Arrays of Objects

The most common complex type — used for table columns/rows, chart data, timeline events, etc.:

```
Table(
  columns=[{key:"test", label:"Test"}, {key:"value", label:"Result"}],
  rows=[
    {test:"WBC", value:"7.2 K/uL"},
    {test:"Hgb", value:"14.1 g/dL"}
  ]
)
```

## Nesting

Components can contain child components. Children appear after the props, separated by commas:

```
Card(title="Dashboard",
  Grid(columns=2,
    Stat(label="HR", value="72", unit="bpm"),
    Stat(label="BP", value="120/80", unit="mmHg")
  )
)
```

Nesting can go arbitrarily deep:

```
Tabs(labels=["Vitals", "Labs"],
  Card(title="Vital Signs",
    Stack(direction="vertical", gap=8,
      Stat(label="HR", value="72"),
      Stat(label="SpO2", value="98%")
    )
  ),
  Card(title="Lab Results",
    Table(columns=[...], rows=[...])
  )
)
```

## Variables

Assign a component tree to a variable with `$name = ...`, then reference it later:

```
$header = Stat(label="Total Patients", value="1,247")
$chart = BarChart(data=[{label:"Mon", value:42}, {label:"Tue", value:58}])

Card(title="Weekly Summary",
  $header,
  $chart
)
```

Variables are useful for reusing complex subtrees or improving readability.

## Comments

Single-line comments with `//`:

```
// Patient demographics section
Card(title="Demographics",
  KeyValue(items=[
    {key:"Name", value:"Jane Doe"},
    {key:"DOB", value:"1985-04-12"}  // Age: 41
  ])
)
```

Inline comments with `/* ... */`:

```
Grid(columns=2 /* responsive */,
  Card(title="Left"),
  Card(title="Right")
)
```

## PascalCase to snake_case

The DSL uses PascalCase for readability, but the internal component registry uses snake_case. The parser converts automatically:

| DSL Name | Registry Type |
|----------|---------------|
| `Card` | `card` |
| `BarChart` | `bar_chart` |
| `DrugCard` | `drug_card` |
| `LabRanges` | `lab_ranges` |
| `FhirPatient` | `fhir_patient` |
| `CodeBlock` | `code_block` |

## Multiple Root Components

A DSL input can contain multiple top-level components. They render sequentially:

```
Alert(title="Notice", message="New guidelines available", variant="info")

Card(title="Current Guidelines",
  Markdown(content="...")
)
```

## Embedding in LLM Output

In chat responses, LLMs wrap DSL content in `<lumen>` tags. Everything outside the tags is rendered as markdown:

```
Based on the RxNorm lookup, here is the drug information:

<lumen>
DrugCard(name="Lisinopril", rxcui="104377", tty="SCD",
  dose_form_groups=["Oral Tablet"])
</lumen>

The standard starting dose is 10mg daily.
```

## Parser Behavior

The DSL parser is a **recursive descent parser** with a separate tokenizer stage:

1. **Tokenizer** (`DslTokenizer`) — character-by-character lexical analysis producing tokens: identifier, string, number, `true`, `false`, `=`, `,`, `(`, `)`, `[`, `]`, `{`, `}`, `:`, `$`, EOF
2. **Parser** (`DslParser`) — consumes tokens and builds a `LumenNode` tree

The parser is designed for **streaming resilience**:

- Unclosed parentheses → node is marked `isPartial: true` but still renderable
- Unterminated strings → closed at end of input
- Missing commas → parser recovers and continues

## Next Steps

- **[JSON Format](/docs/lumen-ui/core-concepts/json-format/)** — the JSON alternative to the DSL
- **[Component Reference](/docs/lumen-ui/components/)** — see what components are available
- **[Language Specification](/docs/lumen-ui/advanced/language-specification/)** — formal grammar and edge cases
