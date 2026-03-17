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

## Notes

- The header accent color is derived from the `risk_level`: green for Low/Safe, amber for Moderate/Caution, red for High/Contraindicated.
- When `risk_level` is not provided but `reaction_type` is, the badge color is based on the reaction severity (Anaphylaxis = red, Rash = amber).
- The `recommendation` text is displayed as body text below the header, outside of any collapsible section.
- Sections render as collapsible panels with the risk-level accent color.
- A clinical disclaimer is always included at the bottom.
