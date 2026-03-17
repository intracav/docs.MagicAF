---
title: "DrugRecalls"
description: "FDA drug recall notices with classification severity, recall reason, and recalling firm."
weight: 14
tags: [lumen-ui, drug-recalls, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

DrugRecalls renders FDA drug recall data with classification-based severity indicators. Each recall is displayed with a color-coded left border (Class I = red, Class II = orange, Class III = amber), classification and status badges, the recalling firm, and the recall reason. A prominent Class I warning banner appears at the top when any Class I recall is present.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `drug` | `string` | *required* | Drug name being checked for recalls. |
| `total` | `number` | — | Total number of recalls found. |
| `has_class_1` | `bool` | `false` | Whether any Class I (most serious) recalls exist. Triggers a red warning banner. |
| `recalls` | `array<object>` | *required* | Array of recall objects. See fields below. |

**Recall object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `classification` | `string` | FDA recall class: `"Class I"`, `"Class II"`, or `"Class III"`. |
| `status` | `string` | Recall status (e.g., `"Ongoing"`, `"Terminated"`, `"Completed"`). |
| `severity` | `string` | Additional severity descriptor. |
| `reason` | `string` | Reason for the recall. |
| `recalling_firm` | `string` | Name of the manufacturer or distributor issuing the recall. |
| `product_description` | `string` | Description of the affected product. |

**Classification color mapping:**

| Classification | Color | Meaning |
|----------------|-------|---------|
| Class I | Destructive red | Serious adverse health consequences or death |
| Class II | Orange (`#ED8936`) | May cause temporary or reversible adverse effects |
| Class III | Warning amber | Not likely to cause adverse health consequences |

## DSL Example

```
DrugRecalls(
  drug="Metformin HCl Extended-Release",
  total=3,
  has_class_1=false,
  recalls=[
    {classification:"Class II", status:"Ongoing", reason:"NDMA impurity above acceptable daily intake limit", recalling_firm:"Apotex Corp", product_description:"Metformin HCl ER 500mg tablets"},
    {classification:"Class II", status:"Completed", reason:"Failed dissolution specifications", recalling_firm:"Granules Pharmaceuticals", product_description:"Metformin HCl ER 750mg tablets"},
    {classification:"Class III", status:"Terminated", reason:"Labeling error: incorrect expiration date", recalling_firm:"Teva Pharmaceuticals", product_description:"Metformin HCl ER 500mg tablets"}
  ]
)
```

## JSON Example

```json
{
  "type": "drug_recalls",
  "props": {
    "drug": "Metformin HCl Extended-Release",
    "total": 3,
    "has_class_1": false,
    "recalls": [
      {
        "classification": "Class II",
        "status": "Ongoing",
        "reason": "NDMA impurity above acceptable daily intake limit",
        "recalling_firm": "Apotex Corp",
        "product_description": "Metformin HCl ER 500mg tablets"
      },
      {
        "classification": "Class III",
        "status": "Terminated",
        "reason": "Labeling error: incorrect expiration date",
        "recalling_firm": "Teva Pharmaceuticals"
      }
    ]
  }
}
```

## Composition

Drug recalls as part of a comprehensive medication safety review:

```
Stack(direction="vertical", gap=16,
  DrugCard(
    name="Valsartan 160 MG Oral Tablet",
    rxcui="349483",
    tty="SCD",
    ingredients=["Valsartan"],
    brand_names=["Diovan"]
  ),
  DrugRecalls(
    drug="Valsartan",
    total=2,
    has_class_1=true,
    recalls=[
      {classification:"Class I", status:"Ongoing", reason:"Presence of NDMA, a probable human carcinogen, above acceptable intake limit", recalling_firm:"Major Pharmaceuticals"},
      {classification:"Class II", status:"Completed", reason:"NDEA impurity detected above acceptable levels", recalling_firm:"Torrent Pharmaceuticals"}
    ]
  ),
  AdverseEvents(
    drug="Valsartan",
    total_reports=8921,
    top_reactions=[{reaction:"Dizziness", count:1842}, {reaction:"Hypotension", count:1203}]
  )
)
```

## Notes

- When `has_class_1` is `true`, a red-tinted warning banner with a warning icon and "Class I Recall" text is displayed at the top of the card.
- Each recall item has a 3px left border colored by its classification.
- The status badge uses destructive red for "Ongoing" recalls and muted foreground for other statuses.
- The recall count badge is displayed in the header alongside the drug name.
- The `has_class_1` prop also checks the alternative key `has_class_1_recall` for compatibility with different server formats.
