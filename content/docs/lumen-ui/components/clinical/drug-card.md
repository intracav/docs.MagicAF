---
title: "DrugCard"
description: "RxNorm drug information card with ingredients, brand names, dose forms, and NDC codes."
weight: 2
tags: [lumen-ui, drug-card, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

DrugCard renders structured drug information from RxNorm lookups. It displays the drug name with its term type, RxCUI identifier, active ingredients as colored pills, brand name variants, dose form groups, and sample NDC codes. The card is typically populated from the `rxnorm_lookup` MCP tool result.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | *required* | Drug name (e.g., `"Lisinopril 10 MG Oral Tablet"`). |
| `rxcui` | `string` | — | RxNorm Concept Unique Identifier. Displayed as a badge in the header. |
| `tty` | `string` | — | Term type code (e.g., `"SCD"`, `"SBD"`, `"IN"`, `"BN"`). Rendered as a human-readable label. |
| `query` | `string` | — | Original search query that produced this result. |
| `ingredients` | `array<string>` | `[]` | Active ingredient names. Rendered as green-tinted pills. |
| `brand_names` | `array<string>` | `[]` | Known brand name variants. Rendered as blurple-tinted pills. |
| `dose_form_groups` | `array<string>` | `[]` | Dose form categories (e.g., `"Oral Tablet"`, `"Injectable"`). Rendered as muted pills. |
| `ndcs` | `array<string>` | `[]` | National Drug Code identifiers. Up to 5 are displayed in a code block. |

**Term type labels:**

| Code | Label |
|------|-------|
| `IN` | Ingredient |
| `PIN` | Precise Ingredient |
| `BN` | Brand Name |
| `SBD` | Branded Drug |
| `SCD` | Clinical Drug |
| `SBDG` | Branded Dose Group |
| `SCDG` | Clinical Dose Group |
| `GPCK` | Generic Pack |
| `BPCK` | Brand Pack |

## DSL Example

```
DrugCard(
  name="Lisinopril 10 MG Oral Tablet",
  rxcui="104377",
  tty="SCD",
  ingredients=["Lisinopril"],
  brand_names=["Prinivil", "Zestril"],
  dose_form_groups=["Oral Tablet"],
  ndcs=["00071-0210-23", "00071-0210-40"]
)
```

## JSON Example

```json
{
  "type": "drug_card",
  "props": {
    "name": "Lisinopril 10 MG Oral Tablet",
    "rxcui": "104377",
    "tty": "SCD",
    "ingredients": ["Lisinopril"],
    "brand_names": ["Prinivil", "Zestril"],
    "dose_form_groups": ["Oral Tablet"],
    "ndcs": ["00071-0210-23", "00071-0210-40"]
  }
}
```

## Composition

A drug card paired with interaction and adverse event data in a medication review:

```
Stack(direction="vertical", gap=16,
  DrugCard(
    name="Warfarin Sodium 5 MG Oral Tablet",
    rxcui="855332",
    tty="SCD",
    ingredients=["Warfarin Sodium"],
    brand_names=["Coumadin", "Jantoven"],
    dose_form_groups=["Oral Tablet"]
  ),
  DrugInteractions(
    drug="Warfarin",
    labels=[{brand:"Coumadin", generic:"warfarin sodium", interactions:"Aspirin increases bleeding risk. NSAIDs increase GI bleeding risk.", warnings:"Monitor INR closely with any medication change."}]
  ),
  AdverseEvents(
    drug="Warfarin",
    total_reports=28453,
    top_reactions=[{reaction:"Hemorrhage", count:8921}, {reaction:"INR increased", count:4102}]
  )
)
```

## Notes

- The header background uses a green accent (`#3DBF80`) at 8% opacity.
- Ingredient pills use green tint, brand name pills use blurple (`#5865F2`) tint, and dose form pills use the muted background color.
- NDC codes are displayed in a monospace code block, limited to the first 5 entries to keep the card compact.
- When `tty` is provided, it is automatically mapped to a human-readable label (e.g., `"SCD"` becomes `"Clinical Drug"`). Unrecognized codes are displayed as-is.
