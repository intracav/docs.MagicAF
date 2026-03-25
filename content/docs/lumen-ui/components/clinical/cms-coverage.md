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

### Live Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">CmsCoverage &mdash; CGM Systems</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #3B82F6;padding-left:13px;">
<div class="lm-card__title" style="display:flex;align-items:center;gap:8px;">Continuous Glucose Monitoring Systems <span class="lm-badge lm-badge--success">Covered</span></div>
<div class="lm-card__description">LCD L33822</div>
</div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Coverage Criteria</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Patient must have diabetes mellitus treated with insulin (3+ daily injections or insulin pump). Patient must perform SMBG 4+ times per day. In-person visit within 6 months prior to ordering.</div>
</div>
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Covered Devices</div>
<div style="display:flex;flex-wrap:wrap;gap:6px;">
<span class="lm-badge lm-badge--default">Dexcom G6/G7</span>
<span class="lm-badge lm-badge--default">FreeStyle Libre 2/3</span>
<span class="lm-badge lm-badge--default">Medtronic Guardian</span>
</div>
</div>
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Limitations</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">One receiver per 5 years unless device is no longer functional. Sensors and transmitters replaced per manufacturer-specified intervals.</div>
</div>
<div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:4px;">Documentation Requirements</div>
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Written order from treating provider. Medical records supporting insulin regimen and SMBG frequency. Certification of in-person evaluation.</div>
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

### Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Preview &mdash; Click checklist items to toggle</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Prior Auth &mdash; Total Knee Replacement</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #3B82F6;padding-left:13px;">
<div class="lm-card__title" style="display:flex;align-items:center;gap:8px;">Knee Arthroplasty (TKR) <span class="lm-badge lm-badge--success">Covered</span></div>
<div class="lm-card__description">NCD 150.10</div>
</div>
<div class="lm-card__body">
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Severe knee osteoarthritis with functional impairment unresponsive to conservative management for at least 3 months.</div>
</div>
</div>
<div class="lm-stack lm-stack--vertical" style="gap:0;">
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">27447</span>
<span class="lm-hcpcs__desc">Arthroplasty, knee, condyle and plateau; medial AND lateral compartments</span>
</div>
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">99213</span>
<span class="lm-hcpcs__desc">Pre-operative office visit</span>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Prior Auth Documentation Checklist</div></div>
<div class="lm-card__body" style="padding:8px 16px 16px;">
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">CMS coverage criteria met</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Imaging reports attached</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Conservative therapy documentation</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Functional assessment score</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Medical clearance letter</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The header uses a blue accent (`#3B82F6`) with a policy icon.
- The `title` prop also accepts `query` from server envelope format, and `coverage_status` also accepts `coverage_type`.
- Sections render as collapsible panels with the blue accent color, initially collapsed.
- When only `content` is provided without sections, the text is rendered as a single selectable block.
- The coverage status badge is displayed in the header row alongside the policy title.
