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

<div class="lumen-demo">
  <div class="lumen-demo__label">Rendered Output</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Basic Components</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <div class="lm-alert lm-alert--warning">
          <span class="lm-alert__icon">&#9888;</span>
          <div class="lm-alert__content">
            <div class="lm-alert__title">Low hemoglobin</div>
          </div>
        </div>
        <div class="lm-stat">
          <span class="lm-stat__label">Heart Rate</span>
          <div class="lm-stat__value-row">
            <span class="lm-stat__value">72</span>
            <span class="lm-stat__unit">bpm</span>
          </div>
        </div>
        <div>
          <span class="lm-badge lm-badge--error">Critical</span>
        </div>
      </div>
    </div>
  </div>
</div>

## Prop Types

### Strings

Quoted with double quotes. Supports standard escape sequences.

```
Card(title="Patient Summary", description="Last updated 2026-03-17")
```

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Patient Summary</div>
          <p class="lm-card__description">Last updated 2026-03-17</p>
        </div>
        <div class="lm-card__body" style="min-height: 24px;"></div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-gauge">
        <svg class="lm-gauge__svg" viewBox="0 0 180 100">
          <path class="lm-gauge__track" d="M 20 90 A 70 70 0 0 1 160 90" />
          <path class="lm-gauge__fill" d="M 20 90 A 70 70 0 0 1 160 90" stroke="#3BA55C" style="stroke-dasharray: 220; stroke-dashoffset: 70;" />
          <text class="lm-gauge__value" x="90" y="85">98.6</text>
        </svg>
        <span class="lm-gauge__label">Temperature</span>
      </div>
    </div>
  </div>
</div>

### Booleans

`true` or `false`, unquoted:

```
Table(striped=true, compact=false)
Checkbox(checked=true, disabled=false)
```

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
        <table class="lm-table lm-table--striped">
          <thead><tr><th>Test</th><th>Value</th><th>Flag</th></tr></thead>
          <tbody>
            <tr><td>WBC</td><td>7.2 K/uL</td><td></td></tr>
            <tr><td>Hgb</td><td>14.1 g/dL</td><td></td></tr>
            <tr><td>Plt</td><td>145 K/uL</td><td class="flag-l">L</td></tr>
          </tbody>
        </table>
        <div class="lm-checkbox checked">
          <span class="lm-checkbox__box"><span class="lm-checkbox__check">&#10003;</span></span>
          <span>Patient consent obtained</span>
        </div>
      </div>
    </div>
  </div>
</div>

### Arrays

Square brackets with comma-separated values:

```
Tabs(labels=["Overview", "Labs", "Medications"])
FollowUp(suggestions=["What are the side effects?", "Check interactions"])
```

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
        <div class="lm-tabs">
          <div class="lm-tabs__nav">
            <button class="lm-tabs__tab active" data-tab="overview">Overview</button>
            <button class="lm-tabs__tab" data-tab="labs">Labs</button>
            <button class="lm-tabs__tab" data-tab="meds">Medications</button>
          </div>
        </div>
        <div class="lm-follow-up">
          <button class="lm-follow-up__btn">What are the side effects?</button>
          <button class="lm-follow-up__btn">Check interactions</button>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
    </div>
    <div class="lumen-demo__content lm">
      <table class="lm-table">
        <thead><tr><th>Test</th><th>Result</th></tr></thead>
        <tbody>
          <tr><td>WBC</td><td>7.2 K/uL</td></tr>
          <tr><td>Hgb</td><td>14.1 g/dL</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">DSL &rarr; Rendered Output</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Nested Components</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Dashboard</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-grid lm-grid--2">
            <div class="lm-stat">
              <span class="lm-stat__label">HR</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">72</span>
                <span class="lm-stat__unit">bpm</span>
              </div>
            </div>
            <div class="lm-stat">
              <span class="lm-stat__label">BP</span>
              <div class="lm-stat__value-row">
                <span class="lm-stat__value">120/80</span>
                <span class="lm-stat__unit">mmHg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">Deep Nesting Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Tabs &gt; Card &gt; Stack &gt; Stat</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-tabs">
        <div class="lm-tabs__nav">
          <button class="lm-tabs__tab active" data-tab="dsl-vitals">Vitals</button>
          <button class="lm-tabs__tab" data-tab="dsl-labs">Labs</button>
        </div>
        <div class="lm-tabs__panel active" data-tab="dsl-vitals">
          <div class="lm-card">
            <div class="lm-card__header"><div class="lm-card__title">Vital Signs</div></div>
            <div class="lm-card__body">
              <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
                <div class="lm-stat">
                  <span class="lm-stat__label">HR</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value">72</span></div>
                </div>
                <div class="lm-stat">
                  <span class="lm-stat__label">SpO2</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value">98%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-tabs__panel" data-tab="dsl-labs">
          <div class="lm-card">
            <div class="lm-card__header"><div class="lm-card__title">Lab Results</div></div>
            <div class="lm-card__body">
              <table class="lm-table lm-table--striped">
                <thead><tr><th>Test</th><th>Value</th><th>Flag</th></tr></thead>
                <tbody>
                  <tr><td>WBC</td><td>7.2 K/uL</td><td></td></tr>
                  <tr><td>Hgb</td><td>14.1 g/dL</td><td></td></tr>
                  <tr><td>Na</td><td>138 mEq/L</td><td></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

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

<div class="lumen-demo">
  <div class="lumen-demo__label">How it looks in the chat UI</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Chat Response with Embedded Lumen</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <p style="font-size:14px; color:var(--text-primary); margin:0; line-height:1.6;">Based on the RxNorm lookup, here is the drug information:</p>
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Lisinopril</div>
            <p class="lm-card__description">RxCUI: 104377 &middot; SCD</p>
          </div>
          <div class="lm-card__body">
            <div class="lm-kv">
              <span class="lm-kv__key">Dose Forms</span>
              <span class="lm-kv__value">Oral Tablet</span>
              <span class="lm-kv__key">Drug Class</span>
              <span class="lm-kv__value">ACE Inhibitor</span>
            </div>
          </div>
        </div>
        <p style="font-size:14px; color:var(--text-primary); margin:0; line-height:1.6;">The standard starting dose is 10mg daily.</p>
      </div>
    </div>
  </div>
</div>

## Parser Behavior

<div class="lumen-demo">
  <div class="lumen-demo__label">Parser Pipeline</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">How DSL Text Becomes a Widget Tree</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-pipeline">
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128221;</div>
          <span class="lm-pipeline__label">DSL Text</span>
          <span class="lm-pipeline__sublabel">Raw string</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#9999;</div>
          <span class="lm-pipeline__label">Tokenizer</span>
          <span class="lm-pipeline__sublabel">DslTokenizer</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#127795;</div>
          <span class="lm-pipeline__label">Parser</span>
          <span class="lm-pipeline__sublabel">DslParser</span>
        </div>
        <span class="lm-pipeline__arrow">&#8594;</span>
        <div class="lm-pipeline__step">
          <div class="lm-pipeline__icon">&#128230;</div>
          <span class="lm-pipeline__label">LumenNode</span>
          <span class="lm-pipeline__sublabel">Tree output</span>
        </div>
      </div>
    </div>
  </div>
</div>

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
