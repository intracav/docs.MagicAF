---
title: "Guidelines"
description: "Clinical practice guidelines with ranked recommendations, evidence levels, and supporting references."
weight: 16
tags: [lumen-ui, guidelines, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Guidelines renders clinical practice recommendations from authoritative sources (e.g., AHA, ACC, IDSA). Recommendations are displayed as numbered cards with priority-colored left borders and evidence level badges. The component also supports collapsible detail sections, free-text content fallback, and supporting PubMed evidence sources. A custom or default clinical disclaimer is rendered at the bottom.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | — | Guideline title or clinical condition. Falls back to `"Clinical Guidelines"`. |
| `source` | `string` | — | Issuing organization (e.g., `"AHA/ACC 2024"`, `"IDSA 2023"`). |
| `recommendations` | `array<object>` | `[]` | Structured recommendations. See fields below. |
| `sections` | `array<object>` | `[]` | Fallback detail sections. Each object has `title` (string) and `content` (string). |
| `content` | `string` | — | Fallback plain text when neither recommendations nor sections are available. |

**Recommendation object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | Recommendation title or short statement. |
| `description` | `string` | Detailed recommendation text. |
| `priority` | `string` | Priority level: `"High"`, `"Critical"`, `"Moderate"`, `"Medium"`, `"Low"`. |
| `evidence_level` | `string` | Evidence grade (e.g., `"Level A"`, `"Level B-R"`, `"Level C-EO"`). Displayed as a muted badge. |

**Additional server envelope fields:**

| Field | Type | Description |
|-------|------|-------------|
| `evidence_sources` | `array<object>` | PubMed references with `title`, `journal`, `year`, and `pmid` fields. |
| `disclaimer` | `string` | Custom disclaimer text. When provided, replaces the default clinical disclaimer. |

**Priority color mapping:**

| Priority | Left Border Color |
|----------|-------------------|
| High, Critical | Destructive red |
| Moderate, Medium | Orange (`#ED8936`) |
| Low / other | Success green |

## DSL Example

```
Guidelines(
  title="Hypertension Management in Adults",
  source="AHA/ACC 2024 Clinical Practice Guidelines",
  recommendations=[
    {title:"Blood Pressure Target", description:"Target BP < 130/80 mmHg for patients with established CVD or 10-year ASCVD risk >= 10%", priority:"High", evidence_level:"Level A"},
    {title:"First-Line Therapy", description:"Initiate with ACE inhibitor, ARB, calcium channel blocker, or thiazide diuretic", priority:"High", evidence_level:"Level A"},
    {title:"Combination Therapy", description:"If BP >20/10 mmHg above target, initiate two first-line agents from different classes", priority:"Moderate", evidence_level:"Level B-R"},
    {title:"Lifestyle Modifications", description:"DASH diet, sodium restriction <1500mg/day, regular aerobic exercise 150 min/week, weight management", priority:"Moderate", evidence_level:"Level A"}
  ]
)
```

## JSON Example

```json
{
  "type": "guidelines",
  "props": {
    "title": "Hypertension Management in Adults",
    "source": "AHA/ACC 2024 Clinical Practice Guidelines",
    "recommendations": [
      {"title": "Blood Pressure Target", "description": "Target BP < 130/80 mmHg for patients with established CVD", "priority": "High", "evidence_level": "Level A"},
      {"title": "First-Line Therapy", "description": "Initiate with ACE inhibitor, ARB, CCB, or thiazide diuretic", "priority": "High", "evidence_level": "Level A"},
      {"title": "Combination Therapy", "description": "If BP >20/10 mmHg above target, initiate two first-line agents", "priority": "Moderate", "evidence_level": "Level B-R"}
    ]
  }
}
```

## Composition

Guidelines alongside patient data and a calculator for a treatment decision:

```
Stack(direction="vertical", gap=16,
  FhirPatient(
    patient={name:"Helen Martinez", dob:"1960-02-28", gender:"female"},
    conditions=["Essential Hypertension", "Type 2 Diabetes", "CKD Stage 2"],
    medications=["Amlodipine 5mg daily"]
  ),
  Calculator(
    name="10-Year ASCVD Risk",
    score="18.2%",
    severity="High",
    interpretation="High cardiovascular risk. Aggressive BP management and statin therapy recommended.",
    inputs={age:66, sex:"Female", total_cholesterol:232, hdl:48, systolic_bp:152, smoker:false, diabetes:true}
  ),
  Guidelines(
    title="Hypertension in Diabetes",
    source="ADA Standards of Care 2024",
    recommendations=[
      {title:"BP Target in Diabetes", description:"Target < 130/80 mmHg if achievable without undue burden", priority:"High", evidence_level:"Level A"},
      {title:"ACE/ARB Preferred", description:"ACE inhibitor or ARB recommended as first-line in diabetes with albuminuria", priority:"High", evidence_level:"Level A"},
      {title:"Add Second Agent", description:"Current BP 152/94 on CCB monotherapy — add ACE inhibitor given CKD and diabetes", priority:"High"}
    ]
  )
)
```

## Notes

- The header uses a blurple accent (`#5865F2`) with a book icon and the guideline source displayed below the title.
- Recommendations are numbered sequentially with small blurple-tinted index badges.
- Each recommendation has a 3px left border colored by its priority level.
- When `evidence_sources` is provided (from the clinical_recommendations tool), a collapsible "Supporting Evidence" section displays PubMed references with title, journal, year, and PMID.
- The component supports three content fallback levels: recommendations (highest priority) > sections > content (plain text).
- The `title` prop also accepts `category_label` or `condition` from server envelope formats.
- The `source` prop also accepts `specialty` from server envelope formats.
