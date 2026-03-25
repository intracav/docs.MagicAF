---
title: "AllergySafety"
description: "Allergy cross-reactivity and safety assessment with risk level and clinical recommendation."
weight: 12
tags: [lumen-ui, allergy-safety, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

AllergySafety renders a cross-reactivity safety assessment between a proposed drug and a known allergen. The header displays the drug name with a risk level badge (color-coded from green/safe to red/contraindicated), the type of prior reaction, and a clinical recommendation. Detail sections provide additional context such as cross-reactivity rates and alternative medications.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `drug` | `string` | — | Proposed drug name. Falls back to `allergen` for the header title. |
| `allergen` | `string` | — | Known allergen (server envelope format). Used as header title when `drug` is not provided. |
| `reaction_type` | `string` | — | Type of prior allergic reaction (e.g., `"Rash"`, `"Anaphylaxis"`, `"Urticaria"`, `"Angioedema"`). |
| `risk_level` | `string` | — | Cross-reactivity risk: `"Low"`, `"Safe"`, `"Moderate"`, `"Caution"`, `"High"`, `"Contraindicated"`. |
| `recommendation` | `string` | — | Clinical recommendation text displayed below the header. |
| `sections` | `array<object>` | `[]` | Array of detail sections. Each object has `title` (string) and `content` (string). |
| `content` | `string` | — | Fallback text content when recommendation and sections are not provided. |

**Risk level color mapping:**

| Risk Level | Color |
|------------|-------|
| High, Contraindicated | Destructive red |
| Moderate, Caution | Warning amber |
| Low, Safe | Success green |

**Reaction type color mapping:**

| Reaction Type | Color |
|---------------|-------|
| Anaphylaxis, Angioedema | Destructive red |
| Urticaria, Rash | Warning amber |
| Other | Muted foreground |

## DSL Example

```
AllergySafety(
  drug="Cefazolin",
  allergen="Penicillin",
  reaction_type="Rash",
  risk_level="Low",
  recommendation="Cephalosporins are generally safe in patients with penicillin allergy. Cross-reactivity rate is <2% for later-generation cephalosporins. Skin testing recommended if prior reaction was severe.",
  sections=[
    {title:"Cross-Reactivity Data", content:"First-generation cephalosporins (e.g., cefazolin): ~1% cross-reactivity\nSecond/third-generation: <0.5% cross-reactivity\nCarbapenems: <1% cross-reactivity"},
    {title:"Alternatives", content:"If high-risk: Vancomycin, Clindamycin, or Aztreonam"}
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
<span class="lumen-demo__bar-title">AllergySafety &mdash; Cefazolin vs Penicillin</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-allergy-safety">
<div class="lm-allergy-safety__header lm-allergy-safety__header--safe" style="padding:16px;border-radius:12px 12px 0 0;">
<div>
<div style="font-size:16px;font-weight:700;">Cefazolin</div>
<div style="font-size:13px;color:var(--text-secondary);margin-top:2px;">Known allergen: Penicillin &middot; Prior reaction: <span style="color:#F5A623;font-weight:600;">Rash</span></div>
</div>
<span class="lm-badge lm-badge--success" style="font-size:13px;padding:4px 14px;">Low Risk</span>
</div>
<div style="padding:16px;border:1px solid var(--border);border-top:0;border-radius:0 0 12px 12px;">
<div style="font-size:13px;color:var(--text-primary);line-height:1.6;margin-bottom:12px;">Cephalosporins are generally safe in patients with penicillin allergy. Cross-reactivity rate is &lt;2% for later-generation cephalosporins. Skin testing recommended if prior reaction was severe.</div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:6px;">Cross-Reactivity Data</div>
<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:12px;">
First-generation cephalosporins (e.g., cefazolin): ~1%<br>
Second/third-generation: &lt;0.5%<br>
Carbapenems: &lt;1%
</div>
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:6px;">Alternatives if High-Risk</div>
<div style="display:flex;flex-wrap:wrap;gap:6px;">
<span class="lm-badge lm-badge--default">Vancomycin</span>
<span class="lm-badge lm-badge--default">Clindamycin</span>
<span class="lm-badge lm-badge--default">Aztreonam</span>
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
  "type": "allergy_safety",
  "props": {
    "drug": "Cefazolin",
    "allergen": "Penicillin",
    "reaction_type": "Rash",
    "risk_level": "Low",
    "recommendation": "Cephalosporins are generally safe in patients with penicillin allergy. Cross-reactivity rate is <2%.",
    "sections": [
      {"title": "Cross-Reactivity Data", "content": "First-generation cephalosporins: ~1% cross-reactivity"},
      {"title": "Alternatives", "content": "If high-risk: Vancomycin, Clindamycin, or Aztreonam"}
    ]
  }
}
```

## Composition

Allergy safety check in a pre-operative antibiotic selection workflow:

```
Stack(direction="vertical", gap=16,
  FhirPatient(
    patient={name:"David Chen", dob:"1970-06-15", gender:"male"},
    allergies=["Penicillin - Anaphylaxis (2019)", "Codeine - Nausea"],
    conditions=["Right knee osteoarthritis - scheduled for TKA"]
  ),
  AllergySafety(
    drug="Cefazolin",
    allergen="Penicillin",
    reaction_type="Anaphylaxis",
    risk_level="Moderate",
    recommendation="Prior anaphylaxis to penicillin elevates concern. Consider skin testing before administration. If skin test positive or unavailable, use vancomycin 15mg/kg IV as surgical prophylaxis alternative.",
    sections=[
      {title:"Pre-Op Protocol", content:"Option A: Penicillin skin testing, administer cefazolin if negative\nOption B: Vancomycin 15mg/kg IV, begin 1-2h before incision"}
    ]
  ),
  Checklist(
    title="Pre-Op Antibiotic Checklist",
    items=[
      {text:"Allergy history reviewed", checked:true},
      {text:"Skin testing ordered", checked:false},
      {text:"Alternative antibiotic selected", checked:false},
      {text:"Anesthesia notified of allergy", checked:true}
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
<span class="lumen-demo__bar-title">Pre-Op Antibiotic Selection</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-fhir-patient">
<div class="lm-fhir-patient__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-fhir-patient__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">D</div>
<div>
<div class="lm-fhir-patient__name">David Chen</div>
<div class="lm-fhir-patient__mrn">DOB: 1970-06-15 &middot; Male &middot; Scheduled for TKA</div>
</div>
</div>
<div style="padding:12px 16px;">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#ED8936;margin-bottom:6px;">Allergies</div>
<div style="font-size:13px;color:var(--text-primary);">Penicillin &mdash; <span style="color:#DA373C;font-weight:600;">Anaphylaxis (2019)</span> &middot; Codeine &mdash; Nausea</div>
</div>
</div>
<div class="lm-allergy-safety">
<div class="lm-allergy-safety__header lm-allergy-safety__header--caution" style="padding:12px 16px;border-radius:8px 8px 0 0;">
<span style="font-weight:700;">Cefazolin vs Penicillin Anaphylaxis</span>
<span class="lm-badge lm-badge--warning">Moderate Risk</span>
</div>
<div style="padding:12px 16px;font-size:13px;color:var(--text-primary);line-height:1.6;border:1px solid var(--border);border-top:0;border-radius:0 0 8px 8px;">Prior anaphylaxis to penicillin elevates concern. Consider skin testing. If unavailable, use vancomycin 15mg/kg IV as alternative.</div>
</div>
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Pre-Op Antibiotic Checklist</div></div>
<div class="lm-card__body" style="padding:8px 16px;">
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Allergy history reviewed</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Skin testing ordered</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;">
<span class="lm-checklist__box"></span>
<span class="lm-checklist__text">Alternative antibiotic selected</span>
</div>
<div class="lm-checklist__item checked" style="cursor:pointer;">
<span class="lm-checklist__box">&#10003;</span>
<span class="lm-checklist__text">Anesthesia notified of allergy</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The header accent color is derived from the `risk_level`: green for Low/Safe, amber for Moderate/Caution, red for High/Contraindicated.
- When `risk_level` is not provided but `reaction_type` is, the badge color is based on the reaction severity (Anaphylaxis = red, Rash = amber).
- The `recommendation` text is displayed as body text below the header, outside of any collapsible section.
- Sections render as collapsible panels with the risk-level accent color.
- A clinical disclaimer is always included at the bottom.
