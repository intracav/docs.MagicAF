---
title: "CmsCoverage"
description: "CMS coverage determination display with policy ID, coverage status, and criteria sections."
weight: 19
tags: [lumen-ui, cms-coverage, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

CmsCoverage renders CMS (Centers for Medicare & Medicaid Services) coverage policy determinations. The header displays the policy title, identifier, and a color-coded coverage status badge (Covered = green, Not Covered = red, Conditional = amber). Detail sections provide coverage criteria, limitations, and documentation requirements. The component is typically populated from the `cms_coverage_lookup` MCP tool.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | — | Policy title or service name. Falls back to `"CMS Coverage"`. |
| `policy_id` | `string` | — | CMS policy identifier (e.g., LCD or NCD number). Displayed below the title. |
| `coverage_status` | `string` | — | Coverage determination: `"Covered"`, `"Approved"`, `"Not Covered"`, `"Denied"`, `"Conditional"`, `"Partial"`. |
| `sections` | `array<object>` | `[]` | Detail sections. Each object has `title` (string) and `content` (string). |
| `content` | `string` | — | Fallback plain text when sections are not provided. |

**Coverage status color mapping:**

| Status | Color |
|--------|-------|
| Covered, Approved | Success green |
| Not Covered, Denied | Destructive red |
| Conditional, Partial | Warning amber |
| Other | Muted foreground |

## DSL Example

```
CmsCoverage(
  title="Continuous Glucose Monitoring Systems",
  policy_id="L33822",
  coverage_status="Covered",
  sections=[
    {title:"Coverage Criteria", content:"Patient must have diabetes mellitus treated with insulin (3+ daily injections or insulin pump).\nPatient must perform self-monitoring of blood glucose 4+ times per day.\nPatient must have an in-person visit with prescribing provider within 6 months prior to ordering."},
    {title:"Covered Devices", content:"FDA-cleared therapeutic CGM systems including Dexcom G6/G7, FreeStyle Libre 2/3, and Medtronic Guardian Connect."},
    {title:"Limitations", content:"One receiver per 5 years unless device is no longer functional.\nSensors and transmitters replaced per manufacturer-specified intervals.\nNon-adjunctive (standalone) CGM requires therapeutic designation."},
    {title:"Documentation Requirements", content:"Written order from treating provider.\nMedical records supporting insulin regimen and SMBG frequency.\nCertification of in-person evaluation."}
  ]
)
```

## JSON Example

```json
{
  "type": "cms_coverage",
  "props": {
    "title": "Continuous Glucose Monitoring Systems",
    "policy_id": "L33822",
    "coverage_status": "Covered",
    "sections": [
      {"title": "Coverage Criteria", "content": "Patient must have diabetes mellitus treated with insulin (3+ daily injections or insulin pump)."},
      {"title": "Limitations", "content": "One receiver per 5 years unless device is no longer functional."},
      {"title": "Documentation Requirements", "content": "Written order from treating provider. Medical records supporting insulin regimen."}
    ]
  }
}
```

## Composition

CMS coverage in a prior authorization workflow with procedure codes and a checklist:

```
Stack(direction="vertical", gap=16,
  CmsCoverage(
    title="Knee Arthroplasty (Total Knee Replacement)",
    policy_id="NCD 150.10",
    coverage_status="Covered",
    sections=[
      {title:"Indications", content:"Severe knee osteoarthritis with functional impairment unresponsive to conservative management (PT, NSAIDs, injections) for at least 3 months."},
      {title:"Required Documentation", content:"1. Radiographic evidence of joint space narrowing or bone-on-bone\n2. Documented failure of conservative therapy\n3. Functional assessment (e.g., WOMAC or KOOS score)\n4. Medical clearance for surgery"}
    ]
  ),
  HcpcsCodes(
    header="Procedure Codes for Submission",
    codes=[
      {code:"27447", description:"Arthroplasty, knee, condyle and plateau; medial AND lateral compartments"},
      {code:"99213", description:"Pre-operative office visit"}
    ]
  ),
  Checklist(
    title="Prior Auth Documentation Checklist",
    items=[
      {text:"CMS coverage criteria met", checked:true},
      {text:"Imaging reports attached", checked:true},
      {text:"Conservative therapy documentation", checked:true},
      {text:"Functional assessment score", checked:false},
      {text:"Medical clearance letter", checked:false}
    ]
  )
)
```

## Notes

- The header uses a blue accent (`#3B82F6`) with a policy icon.
- The `title` prop also accepts `query` from server envelope format, and `coverage_status` also accepts `coverage_type`.
- Sections render as collapsible panels with the blue accent color, initially collapsed.
- When only `content` is provided without sections, the text is rendered as a single selectable block.
- The coverage status badge is displayed in the header row alongside the policy title.
