---
title: "Envelope Protocol"
description: "The __lumen__ envelope format used by MCP tools on the server to send structured component data to the client."
weight: 2
tags: [lumen-ui, envelope, protocol, mcp, server]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/core-concepts/rendering/
estimated_reading_time: "6 min"
last_reviewed: "2026-03-17"
---

When MCP tools on the server produce structured data — drug information, lab ranges, clinical trials, etc. — they wrap the result in a **Lumen envelope**. This envelope tells the client exactly which component to render and with what props, while also including the raw data for the LLM to reference.

## Envelope Structure

```json
{
  "__lumen__": {
    "type": "drug_card",
    "props": {
      "name": "Lisinopril 10 MG Oral Tablet",
      "rxcui": "104377",
      "tty": "SCD",
      "dose_form_groups": ["Oral Tablet"]
    }
  },
  "raw": "{\"name\":\"Lisinopril 10 MG Oral Tablet\",\"rxcui\":\"104377\",...}"
}
\nThe Lumen client will render this — do NOT reproduce.
```

| Field | Purpose |
|-------|---------|
| `__lumen__` | Object containing `type` (component type) and `props` (component props) |
| `raw` | Stringified JSON of the original data — available for the LLM to reference |
| Trailing text | Instruction to the LLM not to reproduce the data as text |

## Server-Side Generation (Rust)

On the server, MCP tools use the `lumen_envelope` helper:

```rust
use crate::mcp::lumen_envelope;

let data = json!({
    "name": "Lisinopril 10 MG Oral Tablet",
    "rxcui": "104377",
    "tty": "SCD",
    "dose_form_groups": ["Oral Tablet"]
});

let raw = serde_json::to_string(&data)?;
let envelope = lumen_envelope("drug_card", data, &raw);
// Returns the JSON string with __lumen__ wrapper
```

The `lumen_envelope` function:

1. Wraps the data in a `{"__lumen__": {"type": ..., "props": ...}}` structure
2. Includes the `raw` field for LLM reference
3. Appends `\nThe Lumen client will render this — do NOT reproduce.` to prevent the LLM from duplicating the structured data as text

## Client-Side Handling

The client uses `tryUnwrapLumenEnvelope()` to detect and parse envelopes:

```dart
import 'package:lumen_ui/lumen_ui.dart';

final envelope = tryUnwrapLumenEnvelope(toolOutput);

if (envelope.isEnvelope) {
  // This is a Lumen envelope — render the component
  final node = ArtifactAdapter.fromArtifact(
    type: envelope.type!,        // e.g., 'drug_card'
    content: envelope.rawJson!,  // the raw JSON string
    title: envelope.title,
  );
  return LumenRenderer(nodes: [node]);
} else {
  // Not an envelope — render as plain text or markdown
  return MarkdownBody(data: toolOutput);
}
```

## Suffix Stripping

MCP tool responses sometimes include a `\nThe Lumen` suffix that should not be shown to the user. The client strips this:

```dart
// In lumen_envelope.dart
String _stripLumenSuffix(String text) {
  final idx = text.indexOf('\nThe Lumen');
  return idx >= 0 ? text.substring(0, idx) : text;
}
```

## Type Mapping

The `type` field in the envelope maps to Lumen component types via the `ArtifactAdapter`:

| Envelope Type | Component |
|---------------|-----------|
| `drug_card` | DrugCard |
| `drug_interactions` | DrugInteractions |
| `lab_ranges` | LabRanges |
| `adverse_events` | AdverseEvents |
| `drug_recalls` | DrugRecalls |
| `iv_drip` | IVDrip |
| `renal_dose` | RenalDose |
| `clinical_note` | ClinicalNote |
| `differential_dx` | DifferentialDx |
| `antimicrobial` | Antimicrobial |
| `allergy_safety` | AllergySafety |
| `guidelines` | Guidelines |
| `cms_coverage` | CmsCoverage |
| `clinical_trials` | ClinicalTrials |
| `npi_result` | NpiResult |
| `hcpcs_codes` | HcpcsCodes |
| `triage_card` | TriageCard |
| `lumen_component` | *Parsed directly as DSL/JSON* |

See the [Artifact Adapter](/docs/lumen-ui/integration/artifact-adapter/) page for the complete mapping.

## The `lumen_ui` MCP Tool

There is a special MCP tool called `lumen_ui` that allows the LLM to compose arbitrary component trees programmatically. Its input is a JSON component tree:

```json
{
  "title": "Patient Vitals Dashboard",
  "component": "grid",
  "props": { "columns": 2 },
  "children": [
    { "component": "stat", "props": { "label": "HR", "value": "72", "unit": "bpm" } },
    { "component": "gauge", "props": { "value": 98, "label": "SpO2", "unit": "%" } }
  ]
}
```

The server wraps this in a `lumen_component` envelope, and the client renders it by parsing the JSON tree with `LumenParser`.

## Next Steps

- **[Artifact Adapter](/docs/lumen-ui/integration/artifact-adapter/)** — full type mapping and conversion logic
- **[LLM Integration](/docs/lumen-ui/integration/llm-integration/)** — how the LLM learns about components
- **[Rendering Surfaces](/docs/lumen-ui/integration/rendering-surfaces/)** — where envelopes are handled in the app
