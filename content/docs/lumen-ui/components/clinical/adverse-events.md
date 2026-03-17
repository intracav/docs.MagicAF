---
title: "AdverseEvents"
description: "FDA adverse event reports with top reactions chart and serious outcome counts."
weight: 13
tags: [lumen-ui, adverse-events, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

AdverseEvents renders FDA Adverse Event Reporting System (FAERS) data for a given drug. The header displays the drug name and total report count. Serious outcome badges (deaths, hospitalizations, life-threatening events) are shown below the header. A horizontal bar chart visualizes the top adverse reactions by count, rendered inside a collapsible section.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `drug` | `string` | *required* | Drug name. Displayed uppercase in the header. |
| `total_reports` | `number` | — | Total number of adverse event reports in the FDA database. |
| `top_reactions` | `array<object>` | `[]` | Array of top adverse reactions. Each object has `reaction` (string) and `count` (number). Up to 15 are displayed. |
| `serious_outcomes` | `object` | `{}` | Serious outcome counts. Supports `death_reports`, `hospitalization_reports`, and `life_threatening_reports` fields. |
| `cases` | `array<object>` | `[]` | Individual case details (reserved for future expansion). |

## DSL Example

```
AdverseEvents(
  drug="Metformin",
  total_reports=15234,
  top_reactions=[
    {reaction:"Nausea", count:3421},
    {reaction:"Diarrhea", count:2891},
    {reaction:"Lactic Acidosis", count:412},
    {reaction:"Abdominal Pain", count:1205},
    {reaction:"Vomiting", count:987},
    {reaction:"Decreased Appetite", count:654}
  ],
  serious_outcomes={death_reports:89, hospitalization_reports:1842, life_threatening_reports:312}
)
```

## JSON Example

```json
{
  "type": "adverse_events",
  "props": {
    "drug": "Metformin",
    "total_reports": 15234,
    "top_reactions": [
      {"reaction": "Nausea", "count": 3421},
      {"reaction": "Diarrhea", "count": 2891},
      {"reaction": "Lactic Acidosis", "count": 412},
      {"reaction": "Abdominal Pain", "count": 1205},
      {"reaction": "Vomiting", "count": 987}
    ],
    "serious_outcomes": {
      "death_reports": 89,
      "hospitalization_reports": 1842,
      "life_threatening_reports": 312
    }
  }
}
```

## Composition

Adverse event data in a medication safety review alongside drug information:

```
Stack(direction="vertical", gap=16,
  DrugCard(
    name="Atorvastatin 40 MG Oral Tablet",
    rxcui="259255",
    tty="SCD",
    ingredients=["Atorvastatin Calcium"],
    brand_names=["Lipitor"]
  ),
  AdverseEvents(
    drug="Atorvastatin",
    total_reports=42156,
    top_reactions=[
      {reaction:"Myalgia", count:8932},
      {reaction:"Rhabdomyolysis", count:1247},
      {reaction:"Hepatotoxicity", count:892},
      {reaction:"Fatigue", count:2341},
      {reaction:"Arthralgia", count:1876}
    ],
    serious_outcomes={death_reports:234, hospitalization_reports:5621}
  ),
  DrugInteractions(
    drug="Atorvastatin",
    labels=[{brand:"Lipitor", generic:"atorvastatin calcium", interactions:"Concurrent use with gemfibrozil increases the risk of rhabdomyolysis.", warnings:"Monitor CK levels if myalgia develops."}]
  )
)
```

## Notes

- The header uses an orange accent (`#ED8936`) with the drug name displayed uppercase.
- Serious outcome badges are color-coded: deaths = destructive red, hospitalizations = orange, life-threatening = warning amber.
- The reactions chart is rendered as horizontal bars inside a collapsible "Top Reactions" section. Bar widths are proportional to the maximum count.
- Reaction names are truncated with ellipsis if they exceed the label width (100px).
- Up to 15 reactions are displayed in the chart; additional reactions are not shown.
- A clinical disclaimer is always included at the bottom.
