---
title: "Language Specification"
description: "Formal grammar, token types, and parsing rules for the Lumen DSL."
weight: 1
tags: [lumen-ui, dsl, grammar, specification, parser]
categories: [reference]
difficulty: advanced
prerequisites:
  - /docs/lumen-ui/core-concepts/dsl-syntax/
estimated_reading_time: "10 min"
last_reviewed: "2026-03-17"
---

This page defines the formal grammar and parsing rules for the Lumen DSL. It is intended as a reference for implementors and for understanding edge cases.

## Lexical Grammar

The `DslTokenizer` performs character-by-character lexical analysis, producing the following token types:

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Token Visualization</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Tokenized DSL Input</span>
    </div>
    <div class="lumen-demo__content lm">
      <div style="font-family: var(--font-mono); font-size: 13px; line-height: 2.4; word-spacing: 2px;">
        <span style="background: rgba(88,101,242,0.2); color: #5865F2; padding: 3px 6px; border-radius: 4px; font-weight: 600;">Card</span><span style="background: rgba(218,55,60,0.15); color: #DA373C; padding: 3px 4px; border-radius: 4px;">(</span><span style="background: rgba(59,165,92,0.15); color: #3BA55C; padding: 3px 6px; border-radius: 4px;">title</span><span style="background: rgba(250,166,26,0.15); color: #FAA61A; padding: 3px 4px; border-radius: 4px;">=</span><span style="background: rgba(233,30,99,0.15); color: #E91E63; padding: 3px 6px; border-radius: 4px;">"Summary"</span><span style="background: rgba(128,128,128,0.15); color: var(--text-tertiary); padding: 3px 4px; border-radius: 4px;">,</span> <span style="background: rgba(88,101,242,0.2); color: #5865F2; padding: 3px 6px; border-radius: 4px; font-weight: 600;">Stat</span><span style="background: rgba(218,55,60,0.15); color: #DA373C; padding: 3px 4px; border-radius: 4px;">(</span><span style="background: rgba(59,165,92,0.15); color: #3BA55C; padding: 3px 6px; border-radius: 4px;">value</span><span style="background: rgba(250,166,26,0.15); color: #FAA61A; padding: 3px 4px; border-radius: 4px;">=</span><span style="background: rgba(155,89,182,0.15); color: #9B59B6; padding: 3px 6px; border-radius: 4px;">42</span><span style="background: rgba(218,55,60,0.15); color: #DA373C; padding: 3px 4px; border-radius: 4px;">)</span><span style="background: rgba(218,55,60,0.15); color: #DA373C; padding: 3px 4px; border-radius: 4px;">)</span>
      </div>
      <div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; font-size: 11px;">
        <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 3px; background: rgba(88,101,242,0.3);"></span><span style="color: var(--text-tertiary);">identifier</span></span>
        <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 3px; background: rgba(233,30,99,0.3);"></span><span style="color: var(--text-tertiary);">string</span></span>
        <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 3px; background: rgba(155,89,182,0.3);"></span><span style="color: var(--text-tertiary);">number</span></span>
        <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 3px; background: rgba(250,166,26,0.3);"></span><span style="color: var(--text-tertiary);">equals</span></span>
        <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 3px; background: rgba(218,55,60,0.3);"></span><span style="color: var(--text-tertiary);">paren</span></span>
        <span style="display: inline-flex; align-items: center; gap: 4px;"><span style="width: 10px; height: 10px; border-radius: 3px; background: rgba(128,128,128,0.3);"></span><span style="color: var(--text-tertiary);">comma</span></span>
      </div>
    </div>
  </div>
</div>

| Token Type | Pattern | Examples |
|------------|---------|----------|
| `identifier` | `[A-Za-z_][A-Za-z0-9_]*` | `Card`, `title`, `bar_chart` |
| `string` | `"..."` or `"""..."""` | `"hello"`, `"""multi\nline"""` |
| `number` | `[0-9]+(\.[0-9]+)?` | `42`, `3.14`, `0` |
| `trueLit` | `true` | `true` |
| `falseLit` | `false` | `false` |
| `equals` | `=` | `=` |
| `comma` | `,` | `,` |
| `lparen` | `(` | `(` |
| `rparen` | `)` | `)` |
| `lbracket` | `[` | `[` |
| `rbracket` | `]` | `]` |
| `lbrace` | `{` | `{` |
| `rbrace` | `}` | `}` |
| `colon` | `:` | `:` |
| `dollar` | `$` | `$` |
| `eof` | End of input | -- |

### Comments

- `//` — consumes to end of line
- `/* ... */` — consumes to closing `*/`

Comments are discarded during tokenization.

### String Escapes

Inside double-quoted strings, standard escape sequences are supported:

| Sequence | Meaning |
|----------|---------|
| `\"` | Literal `"` |
| `\\` | Literal `\` |
| `\n` | Newline |
| `\t` | Tab |

Triple-quoted strings (`"""..."""`) do not process escapes — content is taken verbatim, including newlines.

## Syntactic Grammar

The parser is recursive descent. The grammar in pseudo-BNF:

```
program      → (assignment | component | variable)*

assignment   → '$' IDENT '=' component

component    → IDENT '(' arg_list? ')'

arg_list     → arg (',' arg)*

arg          → named_arg | component | variable | value

named_arg    → IDENT '=' value

variable     → '$' IDENT

value        → STRING | NUMBER | BOOLEAN | array | object | component

array        → '[' (value (',' value)*)? ']'

object       → '{' (pair (',' pair)*)? '}'

pair         → (IDENT | STRING) ':' value

BOOLEAN      → 'true' | 'false'
```

## PascalCase Conversion

Component names are converted from PascalCase to snake_case for registry lookup:

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <table class="lm-table lm-table--compact">
        <thead><tr><th>DSL (PascalCase)</th><th></th><th>Registry (snake_case)</th></tr></thead>
        <tbody>
          <tr><td><code style="color: #5865F2; font-weight: 600;">Card</code></td><td style="color: var(--text-tertiary);">&#8594;</td><td><code>card</code></td></tr>
          <tr><td><code style="color: #5865F2; font-weight: 600;">BarChart</code></td><td style="color: var(--text-tertiary);">&#8594;</td><td><code>bar_chart</code></td></tr>
          <tr><td><code style="color: #5865F2; font-weight: 600;">DrugCard</code></td><td style="color: var(--text-tertiary);">&#8594;</td><td><code>drug_card</code></td></tr>
          <tr><td><code style="color: #5865F2; font-weight: 600;">FhirPatient</code></td><td style="color: var(--text-tertiary);">&#8594;</td><td><code>fhir_patient</code></td></tr>
          <tr><td><code style="color: #5865F2; font-weight: 600;">IVDrip</code></td><td style="color: var(--text-tertiary);">&#8594;</td><td><code>iv_drip</code></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

The conversion inserts an underscore before each uppercase letter (except the first) and lowercases everything.

## Parsing Rules

### Component Resolution

When the parser encounters an identifier followed by `(`, it creates a component node:

1. Convert the identifier from PascalCase to snake_case → `node.type`
2. Parse arguments inside the parentheses
3. Named arguments (`key=value`) become props
4. Unnamed component/variable arguments become children
5. Return the `LumenNode`

### Argument Disambiguation

Inside a component's argument list, the parser disambiguates:

- `IDENT = value` → named prop
- `IDENT (` → child component (recursive)
- `$IDENT` → variable reference (resolved to its assigned value)
- Other values (string, number, bool, array, object) → positional children or text content

### Variable Scoping

Variables are global within a single parse invocation. A variable must be assigned before it is referenced. Unresolved variable references produce a parse error.

```
$stats = Stat(label="HR", value="72")
Card(title="Dashboard", $stats)  // OK — $stats is resolved

Card(title="Dashboard", $unknown)  // Error — $unknown not defined
```

## Streaming Recovery

The parser applies recovery when the input is incomplete:

### Unclosed Components

```
// Input:
Card(title="Test", Table(columns=[...], rows=[

// Recovery:
// - Table: rows array is closed, node marked isPartial
// - Card: closed, node marked isPartial
// - Both nodes are renderable
```

### Unterminated Strings

```
// Input:
Card(title="Test val

// Recovery:
// - String closed: title = "Test val"
// - Card closed, isPartial = true
```

### Unbalanced Brackets

The parser tracks bracket depth. At EOF, if the depth is positive, all open structures are implicitly closed.

## Error Reporting

Parse errors are collected in `LumenParseResult.errors` as `ParseError` objects:

```dart
ParseError {
  message: String,     // Human-readable error description
  position: int,       // Character offset in input
  line: int,           // Line number (1-based)
  column: int,         // Column number (1-based)
}
```

The parser continues after errors when possible (error recovery), so a single input may produce both nodes and errors.

## Next Steps

- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — practical guide to writing DSL
- **[JSON Format](/docs/lumen-ui/core-concepts/json-format/)** — the JSON alternative
- **[API Reference: LumenParser](/docs/lumen-ui/api-reference/lumen-parser/)** — parser API
