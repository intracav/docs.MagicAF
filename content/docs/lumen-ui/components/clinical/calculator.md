---
title: "Calculator"
description: "Medical calculator result display with score, severity classification, and input breakdown."
weight: 5
tags: [lumen-ui, calculator, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Calculator renders the result of a medical scoring tool or clinical calculator. It displays the calculator name, computed score, severity classification with color-coded iconography, clinical interpretation, the input values used in the calculation, and optional methodology details. The severity determines the accent color of the result banner.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | *required* | Calculator or score name (e.g., `"CHA2DS2-VASc Score"`, `"MELD Score"`). |
| `score` | `string` | — | Computed score or result value. Rendered as a large heading. |
| `severity` | `string` | — | Severity classification. Determines the banner color and icon. See mapping below. |
| `interpretation` | `string` | — | Clinical interpretation of the score (e.g., risk level, recommended action). |
| `inputs` | `object` | `{}` | Key-value pairs of the input values used in the calculation. Keys are auto-formatted from snake_case. |
| `details` | `string` | — | Calculation methodology or formula description. |

**Severity color mapping:**

| Keywords | Color | Icon |
|----------|-------|------|
| `critical`, `immediate`, `severe`, `high` | Destructive red | Error |
| `moderate`, `medium`, `warning` | Warning amber | Warning |
| `low`, `normal`, `mild` | Success green | Check circle |
| Other / unset | Primary blue | Calculator |

## DSL Example

```
Calculator(
  name="CHA2DS2-VASc Score",
  score="3",
  severity="Moderate",
  interpretation="Annual stroke risk: 3.2%. Anticoagulation recommended.",
  inputs={age:72, sex:"Male", chf:true, hypertension:true, diabetes:false, stroke_hx:false, vascular_disease:false},
  details="1 point for age 65-74, CHF, hypertension, diabetes, vascular disease, female sex. 2 points for age >= 75, prior stroke/TIA."
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
<span class="lumen-demo__bar-title">Calculator &mdash; CHA2DS2-VASc</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-calculator">
<div class="lm-calculator__header">
<div class="lm-calculator__name">CHA2DS2-VASc Score</div>
</div>
<div class="lm-calculator__result" style="background:rgba(245,166,35,0.06);">
<div class="lm-calculator__score" style="color:#F5A623;">3</div>
<div style="display:inline-block;padding:2px 10px;border-radius:12px;background:rgba(245,166,35,0.1);color:#F5A623;font-size:12px;font-weight:600;margin-top:4px;">Moderate Risk</div>
<div class="lm-calculator__interpretation">Annual stroke risk: 3.2%. Anticoagulation recommended.</div>
</div>
<div style="padding:16px;">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:8px;">Inputs</div>
<div class="lm-kv">
<span class="lm-kv__key">Age</span><span class="lm-kv__value">72</span>
<span class="lm-kv__key">Sex</span><span class="lm-kv__value">Male</span>
<span class="lm-kv__key">CHF</span><span class="lm-kv__value" style="color:#3BA55C;">Yes</span>
<span class="lm-kv__key">Hypertension</span><span class="lm-kv__value" style="color:#3BA55C;">Yes</span>
<span class="lm-kv__key">Diabetes</span><span class="lm-kv__value" style="color:var(--text-tertiary);">No</span>
<span class="lm-kv__key">Stroke Hx</span><span class="lm-kv__value" style="color:var(--text-tertiary);">No</span>
<span class="lm-kv__key">Vascular Disease</span><span class="lm-kv__value" style="color:var(--text-tertiary);">No</span>
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
  "type": "calculator",
  "props": {
    "name": "CHA2DS2-VASc Score",
    "score": "3",
    "severity": "Moderate",
    "interpretation": "Annual stroke risk: 3.2%. Anticoagulation recommended.",
    "inputs": {
      "age": 72,
      "sex": "Male",
      "chf": true,
      "hypertension": true,
      "diabetes": false,
      "stroke_hx": false,
      "vascular_disease": false
    },
    "details": "1 point for age 65-74, CHF, hypertension, diabetes, vascular disease, female sex. 2 points for age >= 75, prior stroke/TIA."
  }
}
```

## Composition

A calculator result inside a cardiology assessment with triage context:

```
Stack(direction="vertical", gap=16,
  TriageCard(
    level=3,
    chief_complaint="Palpitations and lightheadedness, 3 episodes this week",
    expected_wait="45 min"
  ),
  Calculator(
    name="HAS-BLED Score",
    score="2",
    severity="Low",
    interpretation="Low bleeding risk. Benefits of anticoagulation likely outweigh risks.",
    inputs={hypertension:true, renal_disease:false, liver_disease:false, stroke_hx:false, bleeding_hx:false, labile_inr:false, age_over_65:true, drugs_alcohol:false}
  ),
  Calculator(
    name="CHA2DS2-VASc Score",
    score="4",
    severity="High",
    interpretation="Annual stroke risk: 4.0%. Oral anticoagulation strongly recommended.",
    inputs={age:76, sex:"Female", chf:false, hypertension:true, diabetes:true, stroke_hx:false, vascular_disease:false}
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
<span class="lumen-demo__bar-title">Cardiology Assessment &mdash; AFib Workup</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-triage lm-triage--3">
<div class="lm-triage__banner">
<span class="lm-triage__level-badge">ESI 3 &mdash; Urgent</span>
<span class="lm-triage__wait">45 min</span>
</div>
<div class="lm-triage__body">
<div>
<div class="lm-triage__row-label">Chief Complaint</div>
<div class="lm-triage__row-value">Palpitations and lightheadedness, 3 episodes this week</div>
</div>
</div>
</div>
<div class="lm-calculator">
<div class="lm-calculator__header"><div class="lm-calculator__name">HAS-BLED Score</div></div>
<div class="lm-calculator__result" style="background:rgba(59,165,92,0.06);">
<div class="lm-calculator__score" style="color:#3BA55C;">2</div>
<div style="display:inline-block;padding:2px 10px;border-radius:12px;background:rgba(59,165,92,0.1);color:#3BA55C;font-size:12px;font-weight:600;">Low Risk</div>
<div class="lm-calculator__interpretation">Low bleeding risk. Benefits of anticoagulation likely outweigh risks.</div>
</div>
</div>
<div class="lm-calculator">
<div class="lm-calculator__header"><div class="lm-calculator__name">CHA2DS2-VASc Score</div></div>
<div class="lm-calculator__result" style="background:rgba(218,55,60,0.06);">
<div class="lm-calculator__score" style="color:#DA373C;">4</div>
<div style="display:inline-block;padding:2px 10px;border-radius:12px;background:rgba(218,55,60,0.1);color:#DA373C;font-size:12px;font-weight:600;">High Risk</div>
<div class="lm-calculator__interpretation">Annual stroke risk: 4.0%. Oral anticoagulation strongly recommended.</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The `score` prop accepts both numbers and strings, allowing formatted values like `"42 mL/min/1.73m2"` or simple integers.
- Input keys are automatically formatted from snake_case to title case (e.g., `stroke_hx` becomes `"Stroke hx"`).
- A clinical disclaimer is always rendered at the bottom of the card.
- When `details` is not provided, the component falls back to any text content passed as the node body.
- The severity keyword matching is case-insensitive and uses substring matching (e.g., `"Moderate Risk"` matches the moderate tier).
