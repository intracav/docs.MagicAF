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

1. **Known clinical type** → maps to the specific clinical component with typed props
2. **Known document type** → maps to CodeBlock, Markdown, PdfViewer, etc.
3. **JSON content** → attempts to parse as component props for a generic component
4. **Plain text** → wraps in a Markdown component
5. **Unknown type** → renders as a Card with the artifact title and raw content

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
