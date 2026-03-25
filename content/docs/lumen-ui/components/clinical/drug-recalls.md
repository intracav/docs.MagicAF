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

### Live Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">DrugRecalls &mdash; Metformin HCl ER</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-card">
<div class="lm-card__header">
<div class="lm-card__title" style="display:flex;align-items:center;gap:8px;">Drug Recalls &mdash; Metformin HCl ER <span class="lm-badge lm-badge--warning">3 Recalls</span></div>
</div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">
<div class="lm-drug-recalls__item">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
<span class="lm-drug-recalls__class lm-drug-recalls__class--II">Class II</span>
<span class="lm-badge lm-badge--error" style="font-size:11px;">Ongoing</span>
</div>
<div style="font-size:13px;color:var(--text-primary);margin-bottom:4px;">NDMA impurity above acceptable daily intake limit</div>
<div style="font-size:12px;color:var(--text-tertiary);">Apotex Corp &middot; Metformin HCl ER 500mg tablets</div>
</div>
<div class="lm-drug-recalls__item">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
<span class="lm-drug-recalls__class lm-drug-recalls__class--II">Class II</span>
<span class="lm-badge" style="font-size:11px;background:var(--entry);color:var(--text-tertiary);">Completed</span>
</div>
<div style="font-size:13px;color:var(--text-primary);margin-bottom:4px;">Failed dissolution specifications</div>
<div style="font-size:12px;color:var(--text-tertiary);">Granules Pharmaceuticals &middot; Metformin HCl ER 750mg tablets</div>
</div>
<div class="lm-drug-recalls__item">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
<span class="lm-drug-recalls__class lm-drug-recalls__class--III">Class III</span>
<span class="lm-badge" style="font-size:11px;background:var(--entry);color:var(--text-tertiary);">Terminated</span>
</div>
<div style="font-size:13px;color:var(--text-primary);margin-bottom:4px;">Labeling error: incorrect expiration date</div>
<div style="font-size:12px;color:var(--text-tertiary);">Teva Pharmaceuticals &middot; Metformin HCl ER 500mg tablets</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

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

### Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Valsartan Safety Review</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-drug-card">
<div class="lm-drug-card__header" style="background:rgba(61,191,128,0.08);">
<div class="lm-drug-card__name">Valsartan 160 MG Oral Tablet</div>
<div class="lm-drug-card__rxcui">RxCUI: 349483 &middot; Clinical Drug (SCD)</div>
</div>
<div class="lm-drug-card__body">
<div>
<div class="lm-drug-card__section-label">Brand Names</div>
<div class="lm-drug-card__tags"><span class="lm-drug-card__tag" style="background:rgba(88,101,242,0.1);color:#5865F2;">Diovan</span></div>
</div>
</div>
</div>
<div class="lm-alert lm-alert--error">
<span class="lm-alert__icon">&#9888;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Class I Recall</div>
<div class="lm-alert__message">Serious adverse health consequences or death may result from use of this product.</div>
</div>
</div>
<div class="lm-drug-recalls__item">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
<span class="lm-drug-recalls__class lm-drug-recalls__class--I">Class I</span>
<span class="lm-badge lm-badge--error" style="font-size:11px;">Ongoing</span>
</div>
<div style="font-size:13px;color:var(--text-primary);margin-bottom:4px;">Presence of NDMA, a probable human carcinogen, above acceptable intake limit</div>
<div style="font-size:12px;color:var(--text-tertiary);">Major Pharmaceuticals</div>
</div>
<div class="lm-drug-recalls__item">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
<span class="lm-drug-recalls__class lm-drug-recalls__class--II">Class II</span>
<span class="lm-badge" style="font-size:11px;background:var(--entry);color:var(--text-tertiary);">Completed</span>
</div>
<div style="font-size:13px;color:var(--text-primary);margin-bottom:4px;">NDEA impurity detected above acceptable levels</div>
<div style="font-size:12px;color:var(--text-tertiary);">Torrent Pharmaceuticals</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- When `has_class_1` is `true`, a red-tinted warning banner with a warning icon and "Class I Recall" text is displayed at the top of the card.
- Each recall item has a 3px left border colored by its classification.
- The status badge uses destructive red for "Ongoing" recalls and muted foreground for other statuses.
- The recall count badge is displayed in the header alongside the drug name.
- The `has_class_1` prop also checks the alternative key `has_class_1_recall` for compatibility with different server formats.
