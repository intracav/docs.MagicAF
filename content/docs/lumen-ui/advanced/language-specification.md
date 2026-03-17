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
| `eof` | End of input | — |

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

```
PascalCase → snake_case
─────────────────────────
Card       → card
BarChart   → bar_chart
DrugCard   → drug_card
FhirPatient → fhir_patient
IVDrip     → iv_drip
```

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
