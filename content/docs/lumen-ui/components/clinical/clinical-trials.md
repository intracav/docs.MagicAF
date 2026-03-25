---
title: "ClinicalTrials"
description: "ClinicalTrials.gov search results with trial status, phase, sponsor, and summary."
weight: 15
tags: [lumen-ui, clinical-trials, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

ClinicalTrials renders search results from ClinicalTrials.gov as a list of trial cards. Each card displays the NCT identifier, recruitment status (color-coded), trial phase, title, sponsoring organization, and summary. An optional header can provide context about the search query.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `trials` | `array<object>` | *required* | Array of clinical trial objects. See fields below. |
| `header` | `string` | — | Descriptive header displayed above the trial list (e.g., `"Active Trials for Type 2 Diabetes"`). |

**Trial object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `nct_id` | `string` | ClinicalTrials.gov NCT identifier (e.g., `"NCT04012345"`). Displayed as a green badge. |
| `title` | `string` | Full trial title. Limited to 3 lines with ellipsis overflow. |
| `status` | `string` | Recruitment status (e.g., `"Recruiting"`, `"Active"`, `"Completed"`, `"Terminated"`, `"Withdrawn"`). |
| `phase` | `string` | Trial phase (e.g., `"Phase 1"`, `"Phase 2"`, `"Phase 3"`, `"Phase 4"`). Displayed as a purple badge. |
| `sponsor` | `string` | Sponsoring organization or institution. |
| `summary` | `string` | Brief trial description. Limited to 4 lines with ellipsis overflow. |

**Status color mapping:**

| Status | Color |
|--------|-------|
| Recruiting, Active | Success green |
| Completed | Info blue |
| Terminated, Withdrawn | Destructive red |
| Other | Muted foreground |

## DSL Example

```
ClinicalTrials(
  header="Active Trials for Type 2 Diabetes with SGLT2 Inhibitors",
  trials=[
    {nct_id:"NCT04012345", title:"Comparative Effectiveness of GLP-1 Receptor Agonists vs SGLT2 Inhibitors in Type 2 Diabetes with Heart Failure", status:"Recruiting", phase:"Phase 3", sponsor:"National Institutes of Health", summary:"Randomized controlled trial comparing cardiovascular outcomes of semaglutide vs empagliflozin in T2DM patients with HFrEF."},
    {nct_id:"NCT04098765", title:"Long-term Renal Outcomes with Dapagliflozin in CKD and Type 2 Diabetes", status:"Active", phase:"Phase 4", sponsor:"AstraZeneca", summary:"Post-marketing study evaluating eGFR decline over 5 years in CKD Stage 3-4 patients on dapagliflozin."},
    {nct_id:"NCT03876543", title:"SGLT2 Inhibitor Discontinuation in Elderly Patients", status:"Completed", phase:"Phase 2", sponsor:"Mayo Clinic"}
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
<span class="lumen-demo__bar-title">ClinicalTrials &mdash; SGLT2 Inhibitors</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Active Trials for Type 2 Diabetes with SGLT2 Inhibitors</div>
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">
<div class="lm-trial">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
<span class="lm-trial__nct">NCT04012345</span>
<span class="lm-trial__phase">Phase 3</span>
<span class="lm-badge lm-badge--success" style="font-size:11px;">Recruiting</span>
</div>
<div class="lm-trial__title">Comparative Effectiveness of GLP-1 Receptor Agonists vs SGLT2 Inhibitors in Type 2 Diabetes with Heart Failure</div>
<div style="font-size:12px;color:var(--text-tertiary);margin-top:6px;">National Institutes of Health</div>
<div style="font-size:12px;color:var(--text-secondary);margin-top:4px;line-height:1.5;">Randomized controlled trial comparing cardiovascular outcomes of semaglutide vs empagliflozin in T2DM patients with HFrEF.</div>
</div>
<div class="lm-trial">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
<span class="lm-trial__nct">NCT04098765</span>
<span class="lm-trial__phase">Phase 4</span>
<span class="lm-badge lm-badge--success" style="font-size:11px;">Active</span>
</div>
<div class="lm-trial__title">Long-term Renal Outcomes with Dapagliflozin in CKD and Type 2 Diabetes</div>
<div style="font-size:12px;color:var(--text-tertiary);margin-top:6px;">AstraZeneca</div>
</div>
<div class="lm-trial">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
<span class="lm-trial__nct">NCT03876543</span>
<span class="lm-trial__phase">Phase 2</span>
<span class="lm-badge lm-badge--info" style="font-size:11px;">Completed</span>
</div>
<div class="lm-trial__title">SGLT2 Inhibitor Discontinuation in Elderly Patients</div>
<div style="font-size:12px;color:var(--text-tertiary);margin-top:6px;">Mayo Clinic</div>
</div>
</div>
</div>
</div>
</div>
</div>

## JSON Example

```json
{
  "type": "clinical_trials",
  "props": {
    "header": "Active Trials for Type 2 Diabetes with SGLT2 Inhibitors",
    "trials": [
      {
        "nct_id": "NCT04012345",
        "title": "Comparative Effectiveness of GLP-1 Receptor Agonists vs SGLT2 Inhibitors in Type 2 Diabetes with Heart Failure",
        "status": "Recruiting",
        "phase": "Phase 3",
        "sponsor": "National Institutes of Health",
        "summary": "Randomized controlled trial comparing cardiovascular outcomes."
      },
      {
        "nct_id": "NCT04098765",
        "title": "Long-term Renal Outcomes with Dapagliflozin in CKD and Type 2 Diabetes",
        "status": "Active",
        "phase": "Phase 4",
        "sponsor": "AstraZeneca"
      }
    ]
  }
}
```

## Composition

Clinical trial results alongside practice guidelines for a treatment decision:

```
Stack(direction="vertical", gap=16,
  Guidelines(
    title="SGLT2 Inhibitor Use in Heart Failure",
    source="AHA/ACC/HFSA 2024",
    recommendations=[
      {title:"SGLT2i for HFrEF", description:"Recommended for all patients with HFrEF regardless of diabetes status", evidence_level:"Level A"},
      {title:"SGLT2i for HFpEF", description:"Reasonable to reduce hospitalization and cardiovascular death", evidence_level:"Level B"}
    ]
  ),
  ClinicalTrials(
    header="Supporting Trials",
    trials=[
      {nct_id:"NCT03036124", title:"EMPEROR-Preserved: Empagliflozin in HFpEF", status:"Completed", phase:"Phase 3", sponsor:"Boehringer Ingelheim"},
      {nct_id:"NCT03619213", title:"DELIVER: Dapagliflozin in HFpEF", status:"Completed", phase:"Phase 3", sponsor:"AstraZeneca"}
    ]
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
<span class="lumen-demo__bar-title">SGLT2i in Heart Failure &mdash; Guidelines + Trials</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #5865F2;padding-left:13px;">
<div class="lm-card__title">SGLT2 Inhibitor Use in Heart Failure</div>
<div class="lm-card__description">AHA/ACC/HFSA 2024</div>
</div>
<div class="lm-card__body">
<div class="lm-guidelines__item" style="border-left:3px solid #DA373C;padding-left:12px;margin-bottom:8px;">
<span class="lm-guidelines__level">Level A</span>
<div class="lm-guidelines__text">SGLT2i recommended for all patients with HFrEF regardless of diabetes status</div>
</div>
<div class="lm-guidelines__item" style="border-left:3px solid #ED8936;padding-left:12px;">
<span class="lm-guidelines__level">Level B</span>
<div class="lm-guidelines__text">SGLT2i reasonable to reduce hospitalization and cardiovascular death in HFpEF</div>
</div>
</div>
</div>
<div class="lm-trial">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
<span class="lm-trial__nct">NCT03036124</span>
<span class="lm-trial__phase">Phase 3</span>
<span class="lm-badge lm-badge--info" style="font-size:11px;">Completed</span>
</div>
<div class="lm-trial__title">EMPEROR-Preserved: Empagliflozin in HFpEF</div>
<div style="font-size:12px;color:var(--text-tertiary);margin-top:4px;">Boehringer Ingelheim</div>
</div>
<div class="lm-trial">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
<span class="lm-trial__nct">NCT03619213</span>
<span class="lm-trial__phase">Phase 3</span>
<span class="lm-badge lm-badge--info" style="font-size:11px;">Completed</span>
</div>
<div class="lm-trial__title">DELIVER: Dapagliflozin in HFpEF</div>
<div style="font-size:12px;color:var(--text-tertiary);margin-top:4px;">AstraZeneca</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- Each trial renders as an individual card with a bordered container.
- The NCT ID badge uses a green accent (`#3DBF80`), and the phase badge uses purple (`#8C66D9`).
- Trial titles are limited to 3 lines and summaries to 4 lines to keep the list scannable.
- The header is optional and rendered in bold body text above the trial cards.
- No clinical disclaimer is rendered on this component as it displays publicly available research data.
