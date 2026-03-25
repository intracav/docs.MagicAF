---
title: "HcpcsCodes"
description: "HCPCS/CPT code listing with code badges and procedure descriptions."
weight: 18
tags: [lumen-ui, hcpcs-codes, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

HcpcsCodes renders a list of HCPCS (Healthcare Common Procedure Coding System) or CPT codes with color-coded code badges and selectable descriptions. Each code is displayed with an amber left border and a monospace code badge, making it easy to scan and reference. The component is typically populated from the `hcpcs_lookup` MCP tool.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `codes` | `array<object>` | *required* | Array of code objects. Each object has `code` (string) and `description` (string). Also accepts plain strings. |
| `header` | `string` | — | Descriptive header displayed above the code list. |

**Code object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` | HCPCS or CPT code (e.g., `"99213"`, `"J0290"`, `"G0108"`). |
| `description` | `string` | Procedure or service description. |

## DSL Example

```
HcpcsCodes(
  header="Office Visit Procedure Codes",
  codes=[
    {code:"99213", description:"Office or other outpatient visit, established patient, low medical decision making, 20-29 minutes"},
    {code:"99214", description:"Office or other outpatient visit, established patient, moderate medical decision making, 30-39 minutes"},
    {code:"99215", description:"Office or other outpatient visit, established patient, high medical decision making, 40-54 minutes"},
    {code:"99396", description:"Preventive medicine, established patient, 40-64 years"}
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
<span class="lumen-demo__bar-title">HcpcsCodes &mdash; Office Visit Procedures</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Office Visit Procedure Codes</div>
<div class="lm-stack lm-stack--vertical" style="gap:0;">
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">99213</span>
<span class="lm-hcpcs__desc">Office or other outpatient visit, established patient, low medical decision making, 20&ndash;29 minutes</span>
</div>
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">99214</span>
<span class="lm-hcpcs__desc">Office or other outpatient visit, established patient, moderate medical decision making, 30&ndash;39 minutes</span>
</div>
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">99215</span>
<span class="lm-hcpcs__desc">Office or other outpatient visit, established patient, high medical decision making, 40&ndash;54 minutes</span>
</div>
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">99396</span>
<span class="lm-hcpcs__desc">Preventive medicine, established patient, 40&ndash;64 years</span>
</div>
</div>
</div>
</div>
</div>
</div>

## JSON Example

```json
{
  "type": "hcpcs_codes",
  "props": {
    "header": "Office Visit Procedure Codes",
    "codes": [
      {"code": "99213", "description": "Office or other outpatient visit, established patient, low medical decision making"},
      {"code": "99214", "description": "Office or other outpatient visit, established patient, moderate medical decision making"},
      {"code": "99215", "description": "Office or other outpatient visit, established patient, high medical decision making"}
    ]
  }
}
```

## Composition

HCPCS codes alongside a CMS coverage determination for a prior authorization workflow:

```
Stack(direction="vertical", gap=16,
  HcpcsCodes(
    header="Applicable Procedure Codes",
    codes=[
      {code:"J7325", description:"Hyaluronan or derivative, Synvisc or Synvisc-One, for intra-articular injection, 1mg"},
      {code:"20610", description:"Arthrocentesis, aspiration and/or injection, major joint or bursa"},
      {code:"76942", description:"Ultrasonic guidance for needle placement, imaging supervision and interpretation"}
    ]
  ),
  CmsCoverage(
    title="Viscosupplementation for Knee Osteoarthritis",
    policy_id="L35014",
    coverage_status="Conditional",
    sections=[
      {title:"Coverage Criteria", content:"Patient must have failed conservative therapy including NSAIDs, physical therapy, and corticosteroid injections. Diagnosis of primary osteoarthritis of the knee (ICD-10 M17.x)."},
      {title:"Limitations", content:"Limited to 3 injection series per knee per year. Must be administered by a qualified provider."}
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
<span class="lumen-demo__bar-title">Prior Auth &mdash; Viscosupplementation</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">Applicable Procedure Codes</div>
<div class="lm-stack lm-stack--vertical" style="gap:0;">
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">J7325</span>
<span class="lm-hcpcs__desc">Hyaluronan, Synvisc/Synvisc-One, intra-articular injection, 1mg</span>
</div>
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">20610</span>
<span class="lm-hcpcs__desc">Arthrocentesis, aspiration and/or injection, major joint</span>
</div>
<div class="lm-hcpcs__item">
<span class="lm-hcpcs__code">76942</span>
<span class="lm-hcpcs__desc">Ultrasonic guidance for needle placement</span>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header" style="border-left:3px solid #3B82F6;padding-left:13px;">
<div class="lm-card__title" style="display:flex;align-items:center;gap:8px;">Viscosupplementation for Knee OA <span class="lm-badge lm-badge--warning">Conditional</span></div>
<div class="lm-card__description">LCD L35014</div>
</div>
<div class="lm-card__body">
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;">Patient must have failed conservative therapy including NSAIDs, physical therapy, and corticosteroid injections. Diagnosis of primary osteoarthritis of the knee (ICD-10 M17.x).</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- Each code row has a 3px amber left border (`#D69E2E`) for visual consistency.
- Code badges use amber-tinted background with monospace font at 11px.
- Descriptions are rendered as selectable text to support copy/paste workflows.
- When plain strings are passed instead of objects, they are treated as codes without descriptions.
- The header is optional and rendered in bold body text above the code list.
