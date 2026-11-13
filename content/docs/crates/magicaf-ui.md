---
title: "magicaf-ui"
description: "The artifact wire format: component types, artifact types, the envelope, prop schemas, and JSON Schema generation — the contract between MagicAF services and the clients that render them."
weight: 60
keywords: [magicaf-ui, Lumen artifacts, component DSL, JSON Schema, AI-generated UI, artifact envelope]
---

{{< crate-header "magicaf-ui" >}}

When a model or a tool produces something richer than text — a drug card, a chart, a checklist — the server has to tell the client *what* it is and *what data* it carries, in a form the client can validate and render. `magicaf-ui` is that contract. It defines the vocabulary of {{< stat "ui_component_types" >}} component types in {{< stat "ui_categories" >}} categories, a JSON envelope that wraps a component's props, a schema for every component's props, and the mapping to {{< stat "ui_artifact_types" >}} persistable artifact types.

It contains types only. It does not render anything and does not parse a text DSL.

## magicaf-ui and Lumen UI

The two are layers of one system:

| | magicaf-ui | Lumen UI |
|---|---|---|
| What it is | The wire contract, in Rust | Lumen's renderer for that contract, in Flutter |
| Owns | Type names, categories, the `__lumen__` envelope, prop schemas, the artifact mapping, the catalog text given to models | Widgets, theme, the text DSL parser, interaction |
| Used by | Servers and tools that *emit* artifacts | Clients that *display* them |

A component type is defined once here, exported to `lumen-registry.json`, and consumed by the Lumen app, where a drift test fails the build if the two disagree. The [Lumen UI section](/docs/lumen-ui/) documents each component as Lumen renders it, and [Lumen's own docs](https://docs.intracav.ai/chat/artifacts/) show artifacts from a user's point of view.

The vocabulary carries its origin: the envelope key is `__lumen__`, and 29 of the types are clinical. The contract is still usable outside Lumen — any client that understands the envelope and the schemas can render it.

## Example

```rust
use magicaf_ui::{all_schemas, ArtifactEnvelope, ComponentRegistry, ComponentType};
use serde_json::json;

fn main() {
    // A tool produced a drug card. Wrap it so any MagicAF client can render it.
    let envelope = ArtifactEnvelope::wrap_auto_raw(
        ComponentType::DrugCard,
        json!({ "name": "Metformin", "rxcui": "6809" }),
    );
    let wire = envelope.to_json();
    println!("{wire}");

    // On the receiving side, detect and decode the envelope.
    let decoded = ArtifactEnvelope::try_parse(&wire).expect("an artifact envelope");
    assert_eq!(decoded.lumen.component_type, ComponentType::DrugCard);

    // Every component type has a JSON Schema for its props.
    let registry = ComponentRegistry::default();
    let schemas = all_schemas(&registry);
    println!("{} component schemas", schemas.len());
}
```

Output:

```json
{"__lumen__":{"type":"drug_card","props":{"name":"Metformin","rxcui":"6809"}},"raw":"{\"name\":\"Metformin\",\"rxcui\":\"6809\"}"}
114 component schemas
```

## The envelope

```json
{
  "__lumen__": { "type": "<component_type>", "props": { ... } },
  "raw": "<plain-text fallback>"
}
```

`raw` is what a client that cannot render the component shows instead. `wrap_auto_raw` fills it with the serialized props; `wrap` lets you supply your own.

When the envelope is the output of a tool call, use `to_tool_output()` instead of `to_json()`. It appends an instruction telling the model not to repeat the data in its reply — the client is about to render it.

## Component types

| Category | Count | Types |
|---|---|---|
| `layout` | 10 | card, stack, separator, grid, tabs, accordion, steps, section, scroll_area, split_view |
| `data_display` | 16 | markdown, text, code_block, key_value, table, spreadsheet, slide_deck, document_view, roster, agent_deliverable, agent_board, stat, json_viewer, list_view, timeline, description_list |
| `charts` | 12 | chart, dashboard, metrics, bar_chart, line_chart, area_chart, pie_chart, radar_chart, scatter_chart, gauge, sparkline, mermaid |
| `forms` | 14 | input, select, checkbox, radio_group, slider, date_picker, toggle, text_area, choice, confirm, rating, quick_form, questionnaire, slider_set |
| `clinical` | 29 | anatomy_view, organ_view, vascular_access_view, ultrasound_view, checklist, triage_card, drug_card, drug_interactions, lab_ranges, calculator, differential_dx, clinical_note, fhir_patient, iv_drip, renal_dose, antimicrobial, allergy_safety, adverse_events, drug_recalls, clinical_trials, guidelines, npi_result, hcpcs_codes, cms_coverage, recommendations, icd10_results, cpt_results, pubmed_results, quiz_card |
| `media` | 6 | image, image_gallery, figure, file_card, pdf_viewer, html_embed |
| `feedback` | 7 | callout, badge, alert, progress, status_badge, empty_state, skeleton |
| `ai` | 7 | tool_call, tool_result, thinking_block, follow_up, source_card, streaming_text, lumen_component |
| `system` | 11 | web_search_results, web_page, web_crawl_result, web_extract_result, web_map_result, web_research_summary, postgres_result, transcript_view, email_sent, email_draft, http_response |
| `interactive` | 2 | app_link, app_tour |

Wire names are `snake_case`. One exception to the variant-name rule: `ComponentType::Quiz` serializes as `quiz_card`.

## Artifact types

{{< stat "ui_persistable_types" >}} component types can be saved as artifacts; `ComponentType::to_artifact_type()` returns `None` for the rest (layout, feedback, and most form controls are transient). The reverse mapping, `artifact_type_to_component`, is many-to-one: `pdf`, `pptx`, `excel`, `docx`, and `video` artifacts all render as a `file_card`, and `data`, `schedule`, and `db_table` all render as a `table`.

## Schemas and the model catalog

| Function | Returns |
|---|---|
| `component_json_schema(&def)` | A draft-07 JSON Schema for one component's props. Schemas set `additionalProperties: true`, so clients tolerate extra fields. |
| `all_schemas(&registry)` | A map from wire name to schema, for every registered type. |
| `ComponentRegistry::to_catalog()` | Markdown describing each component and its props, for inclusion in a model's system prompt. |

`to_catalog()` currently lists eight categories and omits `system` and `interactive`, so those 13 types are never offered to a model through the catalog. Tools still emit them directly.

## Regenerating the registry file

```bash
cargo run -p magicaf-ui --bin export_registry
```

This rewrites `lumen-registry.json` — an array of `{type, artifact_type, category}` entries with no props or descriptions. Commit it alongside any change to `ComponentType`; the drift test fails until you do.

## Related

- [Lumen UI](/docs/lumen-ui/) — every component as Lumen renders it, with props and examples
- [`magicaf-tools`](/docs/crates/magicaf-tools/) — `ToolOutput::artifact` attaches an artifact type to a tool result
- [`magicaf-server`](/docs/crates/magicaf-server/) — serves `GET /api/artifacts/schema/:component_type`
