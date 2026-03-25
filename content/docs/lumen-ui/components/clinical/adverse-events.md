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

### Live Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">AdverseEvents &mdash; Metformin</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #ED8936;padding-left:13px;">
<div class="lm-card__title">METFORMIN &mdash; Adverse Events</div>
<div class="lm-card__description">15,234 total FAERS reports</div>
</div>
<div class="lm-card__body">
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
<span class="lm-badge lm-badge--error">89 Deaths</span>
<span class="lm-badge lm-badge--warning">1,842 Hospitalizations</span>
<span class="lm-badge" style="background:rgba(214,158,46,0.1);color:#D69E2E;">312 Life-threatening</span>
</div>
<div class="lm-adverse-events__chart">
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Nausea</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:100%;background:#DA373C;"></div></div>
<span class="lm-adverse-events__bar-count">3,421</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Diarrhea</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:85%;background:#ED8936;"></div></div>
<span class="lm-adverse-events__bar-count">2,891</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Abdominal Pain</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:35%;background:#F5A623;"></div></div>
<span class="lm-adverse-events__bar-count">1,205</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Vomiting</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:29%;background:#F5A623;"></div></div>
<span class="lm-adverse-events__bar-count">987</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Decreased Appetite</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:19%;background:#5865F2;"></div></div>
<span class="lm-adverse-events__bar-count">654</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Lactic Acidosis</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:12%;background:#DA373C;"></div></div>
<span class="lm-adverse-events__bar-count">412</span>
</div>
</div>
</div>
</div>
<div style="padding:8px 16px;font-size:11px;color:var(--text-tertiary);font-style:italic;border-top:1px solid var(--border);">FDA FAERS data &mdash; reports do not establish causation</div>
</div>
</div>
</div>
</div>

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

### Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Atorvastatin Safety Profile</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-drug-card">
<div class="lm-drug-card__header" style="background:rgba(61,191,128,0.08);">
<div class="lm-drug-card__name">Atorvastatin 40 MG Oral Tablet</div>
<div class="lm-drug-card__rxcui">RxCUI: 259255 &middot; Lipitor</div>
</div>
</div>
<div class="lm-adverse-events__chart">
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Myalgia</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:100%;background:#DA373C;"></div></div>
<span class="lm-adverse-events__bar-count">8,932</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Fatigue</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:26%;background:#F5A623;"></div></div>
<span class="lm-adverse-events__bar-count">2,341</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Arthralgia</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:21%;background:#F5A623;"></div></div>
<span class="lm-adverse-events__bar-count">1,876</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Rhabdomyolysis</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:14%;background:#DA373C;"></div></div>
<span class="lm-adverse-events__bar-count">1,247</span>
</div>
<div class="lm-adverse-events__bar-row">
<span class="lm-adverse-events__bar-label">Hepatotoxicity</span>
<div class="lm-adverse-events__bar-track"><div class="lm-adverse-events__bar-fill" style="width:10%;background:#DA373C;"></div></div>
<span class="lm-adverse-events__bar-count">892</span>
</div>
</div>
<div class="lm-interactions__item">
<span class="lm-interactions__severity lm-interactions__severity--high">High</span>
<div class="lm-interactions__desc">Concurrent use with gemfibrozil increases the risk of rhabdomyolysis. Monitor CK levels if myalgia develops.</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The header uses an orange accent (`#ED8936`) with the drug name displayed uppercase.
- Serious outcome badges are color-coded: deaths = destructive red, hospitalizations = orange, life-threatening = warning amber.
- The reactions chart is rendered as horizontal bars inside a collapsible "Top Reactions" section. Bar widths are proportional to the maximum count.
- Reaction names are truncated with ellipsis if they exceed the label width (100px).
- Up to 15 reactions are displayed in the chart; additional reactions are not shown.
- A clinical disclaimer is always included at the bottom.
