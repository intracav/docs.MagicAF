---
title: "Artifact Adapter"
description: "How the ArtifactAdapter converts 30+ legacy artifact types — from RxNorm lookups to FHIR resources — into renderable Lumen component trees."
weight: 3
tags: [lumen-ui, artifact, adapter, conversion, mapping]
categories: [guide]
difficulty: intermediate
prerequisites:
  - /docs/lumen-ui/integration/envelope-protocol/
estimated_reading_time: "7 min"
last_reviewed: "2026-03-17"
---

The `ArtifactAdapter` is the bridge between legacy artifact types (used by the Lumen server and MCP tools) and the Lumen component system. It converts a `ChatArtifact` — with a type string and JSON content — into a `LumenNode` tree that the renderer can display.

<div class="lumen-demo">
  <div class="lumen-demo__label">Before and After -- Legacy Artifact to Lumen Component</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">ArtifactAdapter Conversion</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-split lm-split--horizontal">
        <div class="lm-split__pane">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 10px;">Legacy Artifact (Raw JSON)</div>
          <div style="background: var(--entry); border-radius: 8px; padding: 12px; font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); line-height: 1.6; white-space: pre; overflow-x: auto;">type: <span style="color: #FAA61A;">"rxnorm"</span>
content: {
  <span style="color: #5865F2;">"name"</span>: "Metformin 500 MG",
  <span style="color: #5865F2;">"rxcui"</span>: "861004",
  <span style="color: #5865F2;">"tty"</span>: "SCD",
  <span style="color: #5865F2;">"dose_form_groups"</span>: [
    "Oral Tablet"
  ]
}</div>
        </div>
        <div class="lm-split__pane">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-tertiary); margin-bottom: 10px;">Rendered Component</div>
          <div class="lm-drug-card">
            <div class="lm-drug-card__header">
              <div class="lm-drug-card__name">Metformin 500 MG</div>
              <div class="lm-drug-card__rxcui">RxCUI: 861004</div>
            </div>
            <div class="lm-drug-card__body">
              <div>
                <div class="lm-drug-card__section-label">Term Type</div>
                <span style="font-size: 13px; color: var(--text-primary);">SCD</span>
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
  </div>
</div>

## Usage

```dart
import 'package:lumen_ui/lumen_ui.dart';

final node = ArtifactAdapter.fromArtifact(
  type: 'rxnorm',            // ArtifactType enum name
  content: jsonString,        // Raw JSON content from the server
  title: 'Lisinopril',       // Optional display title
  language: null,             // For code artifacts: language name
  metadata: null,             // Optional metadata map
);

// Render it
return LumenRenderer(nodes: [node]);
```

## Complete Type Mapping

### Clinical Types

| Server Type | ArtifactType | Lumen Component | Notes |
|-------------|-------------|-----------------|-------|
| `drug_card` | `rxnorm` | DrugCard | RxNorm drug information |
| `drug_interactions` | `interactions` | DrugInteractions | FDA interaction data |
| `lab_ranges` | `labRanges` | LabRanges | Reference ranges with normal/abnormal |
| `adverse_events` | `adverseEvents` | AdverseEvents | FDA adverse event reports |
| `drug_recalls` | `drugRecalls` | DrugRecalls | FDA recall notices |
| `iv_drip` | `ivDrip` | IVDrip | IV drip rate calculator |
| `renal_dose` | `renalDose` | RenalDose | Renal dose adjustments |
| `clinical_note` | `clinicalNote` | ClinicalNote | SOAP / H&P notes |
| `differential_dx` | `differentialDx` | DifferentialDx | Differential diagnosis list |
| `antimicrobial` | `antimicrobial` | Antimicrobial | Antibiotic selection guidance |
| `allergy_safety` | `allergyXReact` | AllergySafety | Allergy cross-reactivity |
| `guidelines` | `guidelines` | Guidelines | Practice guidelines |
| `cms_coverage` | `cmsCoverage` | CmsCoverage | CMS coverage policies |
| `clinical_trials` | `clinicalTrials` | ClinicalTrials | ClinicalTrials.gov results |
| `npi_result` | `npiResult` | NpiResult | NPI provider lookup |
| `hcpcs_codes` | `hcpcs` | HcpcsCodes | HCPCS/CPT codes |
| `triage_card` | `triage` | TriageCard | ESI triage assessment |

### Data Types

| Server Type | ArtifactType | Lumen Component | Notes |
|-------------|-------------|-----------------|-------|
| `icd10_results` | `icd10` | Table | Auto-generates columns from data |
| `cpt_results` | `cpt` | Table | Auto-generates columns from data |
| `pubmed_results` | `pubmedResults` | Timeline | Rendered as chronological entries |
| `data` / `dbTable` | `data` | Table | Columns inferred from first row |

### Document Types

| Server Type | ArtifactType | Lumen Component | Notes |
|-------------|-------------|-----------------|-------|
| `code` | `code` | CodeBlock | Syntax-highlighted with language |
| `document` | `document` | Markdown | Rendered as markdown |
| `pdf` | `pdf` | PdfViewer | PDF card with page count |
| `excel` | `excel` | FileCard | Download card |
| `pptx` | `pptx` | FileCard | Download card |
| `html` | `html` | HtmlEmbed | Preview card |

### Special Types

| Server Type | ArtifactType | Lumen Component | Notes |
|-------------|-------------|-----------------|-------|
| `lumenComponent` | `lumenComponent` | *Parsed directly* | JSON/DSL parsed as component tree |
| `quiz` | `quiz` | Checklist | Interactive checklist |
| `schedule` | `schedule` | Table | Tabular schedule view |

## Conversion Logic

The adapter follows a priority chain:

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Conversion Priority Chain</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div class="lm-steps">
        <div class="lm-steps__item lm-steps__item--completed">
          <div class="lm-steps__number">1</div>
          <div class="lm-steps__title">Known clinical type</div>
          <div class="lm-steps__desc">Maps to the specific clinical component (DrugCard, LabRanges, TriageCard, etc.) with typed props</div>
        </div>
        <div class="lm-steps__item lm-steps__item--completed">
          <div class="lm-steps__number">2</div>
          <div class="lm-steps__title">Known document type</div>
          <div class="lm-steps__desc">Maps to CodeBlock, Markdown, PdfViewer, FileCard, or HtmlEmbed</div>
        </div>
        <div class="lm-steps__item">
          <div class="lm-steps__number">3</div>
          <div class="lm-steps__title">JSON content</div>
          <div class="lm-steps__desc">Attempts to parse as component props for a generic component</div>
        </div>
        <div class="lm-steps__item lm-steps__item--pending">
          <div class="lm-steps__number">4</div>
          <div class="lm-steps__title">Plain text</div>
          <div class="lm-steps__desc">Wraps in a Markdown component</div>
        </div>
        <div class="lm-steps__item lm-steps__item--pending">
          <div class="lm-steps__number">5</div>
          <div class="lm-steps__title">Unknown type</div>
          <div class="lm-steps__desc">Renders as a Card with the artifact title and raw content</div>
        </div>
      </div>
    </div>
  </div>
</div>

### Data Table Auto-Inference

For `data` and `dbTable` types, the adapter automatically infers table columns from the first row of data:

```dart
// Input: [{"name": "WBC", "value": "7.2"}, {"name": "Hgb", "value": "14.1"}]
// Generated columns: [{key: "name", label: "Name"}, {key: "value", label: "Value"}]
```

### Lumen Component Passthrough

When the type is `lumenComponent`, the adapter passes the JSON content directly to `LumenParser.parse()`, which can handle both DSL and JSON component trees. This enables the `lumen_ui` MCP tool to compose arbitrary layouts.

## Fallback Strategies

The adapter is designed to always produce a renderable node:

| Scenario | Fallback |
|----------|----------|
| JSON parse fails | Render content as Markdown |
| Unknown type | Card with title and content |
| Empty content | Card with title only |
| Missing required props | Component renders with defaults |

## Next Steps

- **[Envelope Protocol](/docs/lumen-ui/integration/envelope-protocol/)** — how the server wraps data in envelopes
- **[Component Reference](/docs/lumen-ui/components/)** — detailed documentation for each component
- **[Rendering Surfaces](/docs/lumen-ui/integration/rendering-surfaces/)** — where artifacts are rendered
