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

<div class="lumen-demo lumen-demo--split">
  <div class="lumen-demo__code">

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
  "raw": "{\"name\":\"Lisinopril...\"}"
}
```

  </div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Rendered Output</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-drug-card">
        <div class="lm-drug-card__header">
          <div class="lm-drug-card__name">Lisinopril 10 MG Oral Tablet</div>
          <div class="lm-drug-card__rxcui">RxCUI: 104377</div>
        </div>
        <div class="lm-drug-card__body">
          <div>
            <div class="lm-drug-card__section-label">Term Type</div>
            <span style="font-size: 13px; color: var(--text-primary);">SCD (Semantic Clinical Drug)</span>
          </div>
          <div>
            <div class="lm-drug-card__section-label">Dose Form</div>
            <div class="lm-drug-card__tags">
              <span class="lm-drug-card__tag">Oral Tablet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

The envelope JSON (left) is what the server sends. The component (right) is what the user sees. The LLM never reproduces the structured data as text.

| Field | Purpose |
|-------|---------|
| `__lumen__` | Object containing `type` (component type) and `props` (component props) |
| `raw` | Stringified JSON of the original data -- available for the LLM to reference |
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

<div class="lumen-demo">
  <div class="lumen-demo__label">Envelope Type to Component Mapping</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">17 Clinical Type Mappings</span>
    </div>
    <div class="lumen-demo__content lm">
      <table class="lm-table lm-table--compact lm-table--striped">
        <thead>
          <tr>
            <th>Envelope Type</th>
            <th>Component</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>drug_card</code></td><td>DrugCard</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>drug_interactions</code></td><td>DrugInteractions</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>lab_ranges</code></td><td>LabRanges</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>adverse_events</code></td><td>AdverseEvents</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>triage_card</code></td><td>TriageCard</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>differential_dx</code></td><td>DifferentialDx</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>clinical_note</code></td><td>ClinicalNote</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>iv_drip</code></td><td>IVDrip</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>renal_dose</code></td><td>RenalDose</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>antimicrobial</code></td><td>Antimicrobial</td><td><span style="background: rgba(88,101,242,0.15); color: #5865F2; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Clinical</span></td></tr>
          <tr><td><code>guidelines</code></td><td>Guidelines</td><td><span style="background: rgba(59,165,92,0.15); color: #3BA55C; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Reference</span></td></tr>
          <tr><td><code>cms_coverage</code></td><td>CmsCoverage</td><td><span style="background: rgba(59,165,92,0.15); color: #3BA55C; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Reference</span></td></tr>
          <tr><td><code>clinical_trials</code></td><td>ClinicalTrials</td><td><span style="background: rgba(59,165,92,0.15); color: #3BA55C; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Reference</span></td></tr>
          <tr><td><code>npi_result</code></td><td>NpiResult</td><td><span style="background: rgba(250,166,26,0.15); color: #FAA61A; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Lookup</span></td></tr>
          <tr><td><code>hcpcs_codes</code></td><td>HcpcsCodes</td><td><span style="background: rgba(250,166,26,0.15); color: #FAA61A; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Lookup</span></td></tr>
          <tr><td><code>lumen_component</code></td><td><em>Parsed directly</em></td><td><span style="background: rgba(233,30,99,0.15); color: #E91E63; padding: 1px 6px; border-radius: 3px; font-size: 11px; font-weight: 600;">Passthrough</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

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
