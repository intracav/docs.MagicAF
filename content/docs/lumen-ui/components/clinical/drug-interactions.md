---
title: "DrugInteractions"
description: "FDA drug interaction display with structured label data and severity-coded interaction pairs."
weight: 3
tags: [lumen-ui, drug-interactions, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

DrugInteractions renders FDA drug interaction data in two supported formats: structured interaction pairs (drug A / drug B with severity) and per-label cards with collapsible sections for interactions, contraindications, and warnings. The component is typically populated from the `drug_interactions` MCP tool. When both formats are present, structured interactions take precedence over legacy label cards.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `drug` | `string` | *required* | Primary drug name being checked for interactions. |
| `labels` | `array<object>` | *required* | Array of FDA label objects. Each object supports `brand`, `generic`, `manufacturer`, `interactions`, `contraindications`, and `warnings` fields. |
| `interaction_count` | `number` | — | Total number of known interactions. Displayed as a badge in the header. |
| `unresolved_drugs` | `array<string>` | `[]` | Drug names that could not be resolved in the FDA database. Shown as a warning banner. |

**Structured interaction objects** (in the `interactions` array within labels):

| Field | Type | Description |
|-------|------|-------------|
| `drug_a` | `string` | First drug in the interaction pair. |
| `drug_b` | `string` | Second drug in the interaction pair. |
| `severity` | `string` | Severity level: `"High"`, `"Major"`, `"Contraindicated"`, `"Moderate"`, or `"Minor"`. |
| `description` | `string` | Clinical description of the interaction. Rendered as markdown. |

## DSL Example

```
DrugInteractions(
  drug="Warfarin",
  labels=[
    {
      brand:"Coumadin",
      generic:"warfarin sodium",
      interactions:"Concurrent use with aspirin increases the risk of bleeding. NSAIDs may potentiate the anticoagulant effect.",
      contraindications:"Active pathological bleeding. Pregnancy (first and third trimesters).",
      warnings:"Monitor INR closely when initiating, discontinuing, or changing doses of interacting medications."
    }
  ]
)
```

## JSON Example

```json
{
  "type": "drug_interactions",
  "props": {
    "drug": "Warfarin",
    "interaction_count": 3,
    "labels": [
      {
        "brand": "Coumadin",
        "generic": "warfarin sodium",
        "interactions": "Concurrent use with aspirin increases the risk of bleeding.",
        "contraindications": "Active pathological bleeding.",
        "warnings": "Monitor INR closely when initiating or changing doses of interacting medications."
      }
    ]
  }
}
```

## Composition

Drug interaction results alongside a drug card and allergy safety check:

```
Stack(direction="vertical", gap=16,
  DrugCard(
    name="Clopidogrel 75 MG Oral Tablet",
    rxcui="309362",
    tty="SCD",
    ingredients=["Clopidogrel"]
  ),
  DrugInteractions(
    drug="Clopidogrel",
    interaction_count=2,
    labels=[
      {
        brand:"Plavix",
        generic:"clopidogrel bisulfate",
        interactions:"Omeprazole reduces the antiplatelet effect of clopidogrel by inhibiting CYP2C19.",
        warnings:"Avoid concomitant use with omeprazole or esomeprazole. Pantoprazole is a safer PPI alternative."
      }
    ]
  ),
  AllergySafety(
    drug="Clopidogrel",
    allergen="Aspirin",
    risk_level="Low",
    recommendation="Clopidogrel is not cross-reactive with aspirin. Safe to use in aspirin-allergic patients."
  )
)
```

## Notes

- The header uses an orange accent (`#ED8936`) and displays either the interaction count or label count as a badge.
- Label sections (Interactions, Contraindications, Warnings) render as collapsible panels, initially collapsed to keep the card compact.
- FDA label text is automatically normalized: bare numbered sections are bolded, bullet characters are converted to markdown lists.
- When `unresolved_drugs` is non-empty, a warning banner is shown below the header listing the drugs that could not be matched in the FDA database.
- Severity colors for structured interaction pairs: High/Major/Contraindicated = destructive red, Moderate = orange, Minor/other = warning yellow.
- A clinical disclaimer ("Sourced from FDA drug labels. Verify with a clinical pharmacist.") is always rendered at the bottom.
