---
title: "LabRanges"
description: "Lab reference range display with demographic breakdowns and clinical notes per test."
weight: 4
tags: [lumen-ui, lab-ranges, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

LabRanges renders lab reference ranges as individual test cards, each showing the test name, unit badge, demographic-specific ranges (adult, male, female, pediatric), and optional clinical notes. The component is typically populated from the `lab_reference_ranges` MCP tool and supports displaying multiple tests in a vertical stack.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `results` | `array<object>` | *required* | Array of lab test objects. Each object supports the fields listed below. |

**Lab test object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Test name (e.g., `"WBC"`, `"Hemoglobin"`). |
| `unit` | `string` | Unit of measurement (e.g., `"K/uL"`, `"g/dL"`). Displayed as a badge. |
| `adult` | `string` | Reference range for adults (e.g., `"4.5-11.0"`). |
| `male` | `string` | Reference range specific to males. |
| `female` | `string` | Reference range specific to females. |
| `pediatric` | `string` | Reference range for pediatric patients. |
| `notes` | `string` | Clinical notes or caveats about the test. |
| `aliases` | `array<string>` | Alternative names for the test. |

## DSL Example

```
LabRanges(
  results=[
    {name:"WBC", unit:"K/uL", adult:"4.5-11.0", notes:"Elevated in infection, stress, steroids"},
    {name:"Hemoglobin", unit:"g/dL", male:"13.5-17.5", female:"12.0-16.0"},
    {name:"Platelets", unit:"K/uL", adult:"150-400"},
    {name:"Creatinine", unit:"mg/dL", male:"0.7-1.3", female:"0.6-1.1", notes:"Varies with muscle mass and hydration"}
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
<span class="lumen-demo__bar-title">LabRanges &mdash; CBC &amp; BMP</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-lab-ranges__header">
<span class="lm-lab-ranges__name">WBC</span>
<span class="lm-badge lm-badge--default">K/uL</span>
</div>
</div>
<div class="lm-card__body">
<div class="lm-kv">
<span class="lm-kv__key">Adult</span><span class="lm-kv__value">4.5 &ndash; 11.0</span>
</div>
<div class="lm-lab-range-bar"><div class="lm-lab-range-bar__marker" style="left:50%;"></div></div>
<div class="lm-lab-range-bar__labels"><span>Low</span><span>Normal</span><span>High</span></div>
<div style="margin-top:8px;font-size:12px;color:var(--text-tertiary);display:flex;gap:4px;align-items:start;">&#9432; Elevated in infection, stress, steroids</div>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-lab-ranges__header">
<span class="lm-lab-ranges__name">Hemoglobin</span>
<span class="lm-badge lm-badge--default">g/dL</span>
</div>
</div>
<div class="lm-card__body">
<div class="lm-kv">
<span class="lm-kv__key">Male</span><span class="lm-kv__value">13.5 &ndash; 17.5</span>
<span class="lm-kv__key">Female</span><span class="lm-kv__value">12.0 &ndash; 16.0</span>
</div>
<div class="lm-lab-range-bar"><div class="lm-lab-range-bar__marker" style="left:55%;"></div></div>
<div class="lm-lab-range-bar__labels"><span>Low</span><span>Normal</span><span>High</span></div>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-lab-ranges__header">
<span class="lm-lab-ranges__name">Creatinine</span>
<span class="lm-badge lm-badge--default">mg/dL</span>
</div>
</div>
<div class="lm-card__body">
<div class="lm-kv">
<span class="lm-kv__key">Male</span><span class="lm-kv__value">0.7 &ndash; 1.3</span>
<span class="lm-kv__key">Female</span><span class="lm-kv__value">0.6 &ndash; 1.1</span>
</div>
<div class="lm-lab-range-bar"><div class="lm-lab-range-bar__marker" style="left:60%;"></div></div>
<div class="lm-lab-range-bar__labels"><span>Low</span><span>Normal</span><span>High</span></div>
<div style="margin-top:8px;font-size:12px;color:var(--text-tertiary);display:flex;gap:4px;align-items:start;">&#9432; Varies with muscle mass and hydration</div>
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
  "type": "lab_ranges",
  "props": {
    "results": [
      {"name": "WBC", "unit": "K/uL", "adult": "4.5-11.0", "notes": "Elevated in infection, stress, steroids"},
      {"name": "Hemoglobin", "unit": "g/dL", "male": "13.5-17.5", "female": "12.0-16.0"},
      {"name": "Platelets", "unit": "K/uL", "adult": "150-400"},
      {"name": "Creatinine", "unit": "mg/dL", "male": "0.7-1.3", "female": "0.6-1.1", "notes": "Varies with muscle mass and hydration"}
    ]
  }
}
```

## Composition

Lab ranges alongside a calculator and clinical note in a patient workup:

```
Stack(direction="vertical", gap=16,
  LabRanges(
    results=[
      {name:"BUN", unit:"mg/dL", adult:"7-20"},
      {name:"Creatinine", unit:"mg/dL", male:"0.7-1.3", female:"0.6-1.1"},
      {name:"GFR", unit:"mL/min/1.73m2", adult:">60", notes:"CKD staging based on sustained GFR reduction"}
    ]
  ),
  Calculator(
    name="CKD-EPI GFR",
    score="42 mL/min/1.73m2",
    severity="Moderate",
    interpretation="CKD Stage 3b. Consider nephrology referral.",
    inputs={age:68, sex:"Female", creatinine:1.4, race:"Non-Black"}
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
<span class="lumen-demo__bar-title">Renal Function Workup</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-lab-ranges__header">
<span class="lm-lab-ranges__name">BUN</span>
<span class="lm-badge lm-badge--default">mg/dL</span>
</div>
</div>
<div class="lm-card__body">
<div class="lm-kv"><span class="lm-kv__key">Adult</span><span class="lm-kv__value">7 &ndash; 20</span></div>
</div>
</div>
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-lab-ranges__header">
<span class="lm-lab-ranges__name">GFR</span>
<span class="lm-badge lm-badge--default">mL/min/1.73m&sup2;</span>
</div>
</div>
<div class="lm-card__body">
<div class="lm-kv"><span class="lm-kv__key">Adult</span><span class="lm-kv__value">&gt; 60</span></div>
<div style="margin-top:8px;font-size:12px;color:var(--text-tertiary);">&#9432; CKD staging based on sustained GFR reduction</div>
</div>
</div>
<div class="lm-calculator">
<div class="lm-calculator__header"><div class="lm-calculator__name">CKD-EPI GFR</div></div>
<div class="lm-calculator__result">
<div class="lm-calculator__score" style="color:#ED8936;">42</div>
<div style="font-size:13px;color:var(--text-secondary);">mL/min/1.73m&sup2;</div>
<div class="lm-calculator__interpretation">CKD Stage 3b. Consider nephrology referral.</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- Each test renders as an individual card with a green-tinted header (`#3DBF80` at 6% opacity).
- Demographic ranges are displayed in a striped table layout. The unit is repeated on each row for clarity.
- When `aliases` are provided, they are displayed below the test name in a smaller font (e.g., `"WBC"` with alias `"Leukocyte count"`).
- Notes are rendered with an info icon at the bottom of the card in a muted style.
- The component renders an empty widget if the `results` array is empty.
