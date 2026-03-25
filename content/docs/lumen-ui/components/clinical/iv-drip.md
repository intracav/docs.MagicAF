---
title: "IVDrip"
description: "IV drip rate calculator result with dose range check, titration table, and clinical notes."
weight: 9
tags: [lumen-ui, iv-drip, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

IVDrip renders the output of an IV drip rate calculation, displaying the drug name, calculated rate in mL/hr, dose delivered, dose range status (within/above/below range), order details, a titration table, and clinical notes. The hero section prominently displays the rate with a sky-blue accent, making it immediately readable at the bedside.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `drug` | `string` | *required* | Drug name. Displayed uppercase in the hero section. |
| `rate_ml_hr` | `number` | — | Calculated infusion rate in mL/hr. Displayed as a large heading. |
| `dose_delivered` | `string` | — | Dose being delivered at the current rate (e.g., `"0.1 mcg/kg/min"`). |
| `order` | `object` | `{}` | Order details as key-value pairs (e.g., `{dose: "0.1 mcg/kg/min", weight: "80 kg"}`). |
| `concentration` | `object` | `{}` | Concentration details (e.g., `{amount: "4mg", volume: "250mL"}`). |
| `dose_range_check` | `object` | `{}` | Range check result. Expects `status` field (`"WITHIN_RANGE"`, `"ABOVE_RANGE"`, `"BELOW_RANGE"`). |
| `titration_table` | `array<object>` | `[]` | Array of titration steps. Each object has `dose`, `rate_ml_hr`, and `label` fields. |
| `clinical_notes` | `array<string>` | `[]` | Clinical notes and warnings. Rendered with info icons. |

## DSL Example

```
IVDrip(
  drug="Norepinephrine",
  rate_ml_hr=15,
  dose_delivered="0.1 mcg/kg/min",
  order={dose:"0.1 mcg/kg/min", weight:"80 kg", target:"MAP > 65 mmHg"},
  concentration={amount:"4mg", volume:"250mL"},
  dose_range_check={status:"WITHIN_RANGE", min:"0.01 mcg/kg/min", max:"0.3 mcg/kg/min"},
  titration_table=[
    {dose:"0.05 mcg/kg/min", rate_ml_hr:7.5, label:"Starting"},
    {dose:"0.1 mcg/kg/min", rate_ml_hr:15, label:"Current"},
    {dose:"0.2 mcg/kg/min", rate_ml_hr:30, label:"Max usual"},
    {dose:"0.3 mcg/kg/min", rate_ml_hr:45, label:"Max"}
  ],
  clinical_notes=["Administer via central line only", "Monitor arterial blood pressure continuously", "Taper gradually - do not discontinue abruptly"]
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
<span class="lumen-demo__bar-title">IVDrip &mdash; Norepinephrine</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-card">
<div style="padding:16px;text-align:center;background:rgba(14,165,233,0.06);border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#0EA5E9;margin-bottom:4px;">NOREPINEPHRINE</div>
<div class="lm-iv-drip__rate">
<div class="lm-iv-drip__rate-value" style="color:#0EA5E9;">15</div>
<div class="lm-iv-drip__rate-unit">mL/hr</div>
</div>
<div style="font-size:13px;color:var(--text-secondary);">0.1 mcg/kg/min</div>
<div style="margin-top:8px;"><span class="lm-badge lm-badge--success">Within Range</span></div>
</div>
<div style="padding:16px;">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:8px;">Order Details</div>
<div class="lm-kv">
<span class="lm-kv__key">Dose</span><span class="lm-kv__value">0.1 mcg/kg/min</span>
<span class="lm-kv__key">Weight</span><span class="lm-kv__value">80 kg</span>
<span class="lm-kv__key">Target</span><span class="lm-kv__value">MAP &gt; 65 mmHg</span>
<span class="lm-kv__key">Concentration</span><span class="lm-kv__value">4mg / 250mL</span>
</div>
</div>
<div style="padding:0 16px 16px;">
<div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-tertiary);margin-bottom:8px;">Titration Table</div>
<table class="lm-table lm-table--compact">
<thead><tr><th>Dose</th><th>Rate</th><th>Level</th></tr></thead>
<tbody>
<tr><td>0.05 mcg/kg/min</td><td>7.5 mL/hr</td><td>Starting</td></tr>
<tr><td style="font-weight:600;">0.1 mcg/kg/min</td><td style="font-weight:600;">15 mL/hr</td><td><span class="lm-badge lm-badge--info" style="font-size:10px;">Current</span></td></tr>
<tr><td>0.2 mcg/kg/min</td><td>30 mL/hr</td><td>Max usual</td></tr>
<tr><td>0.3 mcg/kg/min</td><td>45 mL/hr</td><td>Max</td></tr>
</tbody>
</table>
</div>
<div style="padding:0 16px 16px;">
<div style="font-size:12px;color:var(--text-tertiary);line-height:1.6;">
&#9432; Administer via central line only<br>
&#9432; Monitor arterial blood pressure continuously<br>
&#9432; Taper gradually &mdash; do not discontinue abruptly
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
  "type": "iv_drip",
  "props": {
    "drug": "Norepinephrine",
    "rate_ml_hr": 15,
    "dose_delivered": "0.1 mcg/kg/min",
    "order": {"dose": "0.1 mcg/kg/min", "weight": "80 kg", "target": "MAP > 65 mmHg"},
    "dose_range_check": {"status": "WITHIN_RANGE"},
    "titration_table": [
      {"dose": "0.05 mcg/kg/min", "rate_ml_hr": 7.5, "label": "Starting"},
      {"dose": "0.1 mcg/kg/min", "rate_ml_hr": 15, "label": "Current"},
      {"dose": "0.2 mcg/kg/min", "rate_ml_hr": 30, "label": "Max usual"}
    ],
    "clinical_notes": ["Administer via central line only", "Monitor arterial blood pressure continuously"]
  }
}
```

## Composition

An IV drip calculator in an ICU medication management view:

```
Stack(direction="vertical", gap=16,
  IVDrip(
    drug="Vasopressin",
    rate_ml_hr=2.5,
    dose_delivered="0.04 units/min",
    order={dose:"0.04 units/min", indication:"Septic shock adjunct"},
    dose_range_check={status:"WITHIN_RANGE"},
    clinical_notes=["Fixed dose - do not titrate", "Use as second vasopressor with norepinephrine"]
  ),
  IVDrip(
    drug="Propofol",
    rate_ml_hr=20,
    dose_delivered="50 mcg/kg/min",
    order={dose:"50 mcg/kg/min", weight:"80 kg", target:"RASS -2"},
    dose_range_check={status:"WITHIN_RANGE", min:"5 mcg/kg/min", max:"80 mcg/kg/min"},
    clinical_notes=["Monitor triglycerides q48h", "Assess for propofol infusion syndrome if >48h"]
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
<span class="lumen-demo__bar-title">ICU Drip Management</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-card">
<div style="padding:12px 16px;text-align:center;background:rgba(14,165,233,0.06);border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#0EA5E9;">VASOPRESSIN</div>
<div class="lm-iv-drip__rate">
<div class="lm-iv-drip__rate-value" style="color:#0EA5E9;font-size:28px;">2.5</div>
<div class="lm-iv-drip__rate-unit">mL/hr &middot; 0.04 units/min</div>
</div>
<span class="lm-badge lm-badge--success" style="margin-top:4px;">Within Range</span>
</div>
<div style="padding:8px 16px;font-size:12px;color:var(--text-tertiary);">
&#9432; Fixed dose &mdash; do not titrate<br>
&#9432; Use as second vasopressor with norepinephrine
</div>
</div>
<div class="lm-card">
<div style="padding:12px 16px;text-align:center;background:rgba(14,165,233,0.06);border-bottom:1px solid var(--border);">
<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#0EA5E9;">PROPOFOL</div>
<div class="lm-iv-drip__rate">
<div class="lm-iv-drip__rate-value" style="color:#0EA5E9;font-size:28px;">20</div>
<div class="lm-iv-drip__rate-unit">mL/hr &middot; 50 mcg/kg/min &middot; Target RASS -2</div>
</div>
<span class="lm-badge lm-badge--success" style="margin-top:4px;">Within Range</span>
</div>
<div style="padding:8px 16px;font-size:12px;color:var(--text-tertiary);">
&#9432; Monitor triglycerides q48h<br>
&#9432; Assess for propofol infusion syndrome if &gt;48h
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- The hero section uses a sky-blue accent (`#0EA5E9`) with the drug name displayed in uppercase tracking.
- Dose range check badge colors: `WITHIN_RANGE` = success green, `ABOVE_RANGE` = destructive red, `BELOW_RANGE` = warning amber.
- The titration table renders as a collapsible section with a three-column layout (Dose, Rate, Level).
- Order details are displayed as labeled info rows with keys auto-formatted from snake_case.
- Clinical notes are rendered with info icons in a muted style at the bottom of the card.
- A clinical disclaimer is always included.
