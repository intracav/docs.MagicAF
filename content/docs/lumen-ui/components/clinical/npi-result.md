---
title: "NpiResult"
description: "NPI provider lookup results with specialty, credentials, practice location, and contact details."
weight: 17
tags: [lumen-ui, npi-result, clinical]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

NpiResult renders provider lookup results from the NPI Registry. Each provider card displays a header with name, NPI number, and provider type (Individual or Organization), followed by detailed rows for specialty, credentials, practice location, phone, fax, and NPI issuance dates. Organization providers show an authorized official section. Multiple specialties are listed when available.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `providers` | `array<object>` | *required* | Array of provider objects. See fields below. |
| `header` | `string` | — | Descriptive header displayed above the provider cards. |

**Provider object fields:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Provider or organization name. |
| `npi` | `string` | 10-digit NPI number. Displayed as a teal badge. |
| `specialty` | `string` | Primary specialty or taxonomy description. |
| `taxonomy_code` | `string` | Taxonomy code (displayed alongside specialty). |
| `address` | `string` | Practice location address. |
| `phone` | `string` | Practice phone number. |
| `fax` | `string` | Practice fax number. |
| `gender` | `string` | Provider gender (`"M"` or `"F"`). Auto-formatted to full word. |
| `credential` | `string` | Professional credentials (e.g., `"MD"`, `"DO"`, `"NP"`). |
| `provider_type` | `string` | `"Individual"` or `"Organization"`. Determines the header icon. |
| `status` | `string` | NPI status. Non-active statuses display an "Inactive" badge. |
| `enumeration_date` | `string` | Date NPI was issued. |
| `last_updated` | `string` | Date NPI record was last updated. |
| `all_specialties` | `array<object>` | All specialties with `specialty`, `state`, and `primary` fields. |
| `authorized_official` | `object` | For organizations: `name` and `title` of the authorized official. |

## DSL Example

```
NpiResult(
  header="Cardiology Providers Near 90210",
  providers=[
    {name:"Dr. Jane A. Smith", npi:"1234567890", specialty:"Cardiovascular Disease", taxonomy_code:"207RC0000X", credential:"MD", gender:"F", provider_type:"Individual", address:"123 Medical Center Dr, Beverly Hills, CA 90210", phone:"310-555-0142", enumeration_date:"2005-06-15", status:"A"},
    {name:"Dr. Robert Chen", npi:"0987654321", specialty:"Interventional Cardiology", taxonomy_code:"207RI0011X", credential:"MD", gender:"M", provider_type:"Individual", address:"456 Heart Institute Blvd, Los Angeles, CA 90048", phone:"323-555-0198", status:"A"}
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
<span class="lumen-demo__bar-title">NpiResult &mdash; Cardiology Providers</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px;">Cardiology Providers Near 90210</div>
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">
<div class="lm-npi-result">
<div class="lm-npi-result__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-npi-result__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">JS</div>
<div style="flex:1;">
<div style="font-size:15px;font-weight:700;color:var(--text-primary);">Dr. Jane A. Smith, MD</div>
<div style="font-size:12px;color:var(--text-tertiary);font-family:var(--font-mono);">NPI: 1234567890</div>
</div>
<span class="lm-badge lm-badge--default" style="font-size:11px;">Individual</span>
</div>
<div style="padding:12px 16px;">
<div class="lm-kv">
<span class="lm-kv__key">Specialty</span><span class="lm-kv__value">Cardiovascular Disease (207RC0000X)</span>
<span class="lm-kv__key">Gender</span><span class="lm-kv__value">Female</span>
<span class="lm-kv__key">Address</span><span class="lm-kv__value">123 Medical Center Dr, Beverly Hills, CA 90210</span>
<span class="lm-kv__key">Phone</span><span class="lm-kv__value">310-555-0142</span>
</div>
</div>
</div>
<div class="lm-npi-result">
<div class="lm-npi-result__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-npi-result__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">RC</div>
<div style="flex:1;">
<div style="font-size:15px;font-weight:700;color:var(--text-primary);">Dr. Robert Chen, MD</div>
<div style="font-size:12px;color:var(--text-tertiary);font-family:var(--font-mono);">NPI: 0987654321</div>
</div>
<span class="lm-badge lm-badge--default" style="font-size:11px;">Individual</span>
</div>
<div style="padding:12px 16px;">
<div class="lm-kv">
<span class="lm-kv__key">Specialty</span><span class="lm-kv__value">Interventional Cardiology (207RI0011X)</span>
<span class="lm-kv__key">Address</span><span class="lm-kv__value">456 Heart Institute Blvd, Los Angeles, CA 90048</span>
<span class="lm-kv__key">Phone</span><span class="lm-kv__value">323-555-0198</span>
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
  "type": "npi_result",
  "props": {
    "header": "Cardiology Providers Near 90210",
    "providers": [
      {
        "name": "Dr. Jane A. Smith",
        "npi": "1234567890",
        "specialty": "Cardiovascular Disease",
        "taxonomy_code": "207RC0000X",
        "credential": "MD",
        "gender": "F",
        "provider_type": "Individual",
        "address": "123 Medical Center Dr, Beverly Hills, CA 90210",
        "phone": "310-555-0142",
        "status": "A"
      }
    ]
  }
}
```

## Composition

NPI lookup results alongside referral documentation:

```
Stack(direction="vertical", gap=16,
  FhirPatient(
    patient={name:"Alice Thompson", dob:"1975-09-22", gender:"female", pcp:"Dr. Maria Gonzalez"},
    conditions=["Paroxysmal atrial fibrillation", "Hypertension"],
    medications=["Metoprolol 50mg BID", "Apixaban 5mg BID"]
  ),
  NpiResult(
    header="Electrophysiology Referral Options",
    providers=[
      {name:"Dr. Michael Park", npi:"1122334455", specialty:"Clinical Cardiac Electrophysiology", credential:"MD", provider_type:"Individual", address:"789 EP Center, Suite 300, Los Angeles, CA 90024", phone:"310-555-0256"},
      {name:"UCLA Cardiac Arrhythmia Center", npi:"5544332211", provider_type:"Organization", specialty:"Clinical Cardiac Electrophysiology", address:"757 Westwood Plaza, Los Angeles, CA 90095", phone:"310-555-0300", authorized_official:{name:"Dr. Susan Lee", title:"Medical Director"}}
    ]
  ),
  ClinicalNote(
    note_type="progress",
    provider="Dr. Maria Gonzalez",
    date="2026-03-17",
    content="Referring patient to EP for ablation evaluation given recurrent symptomatic AF on rate control. Anticoagulation current."
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
<span class="lumen-demo__bar-title">EP Referral Workflow</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">
<div class="lm-fhir-patient">
<div class="lm-fhir-patient__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-fhir-patient__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">A</div>
<div>
<div class="lm-fhir-patient__name">Alice Thompson</div>
<div class="lm-fhir-patient__mrn">DOB: 1975-09-22 &middot; Female &middot; PAF, HTN &middot; PCP: Dr. Gonzalez</div>
</div>
</div>
</div>
<div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">Electrophysiology Referral Options</div>
<div class="lm-npi-result">
<div class="lm-npi-result__header" style="background:rgba(56,178,172,0.06);">
<div class="lm-npi-result__avatar" style="background:rgba(56,178,172,0.15);color:#38B2AC;">MP</div>
<div style="flex:1;">
<div style="font-size:14px;font-weight:700;">Dr. Michael Park, MD</div>
<div style="font-size:12px;color:var(--text-tertiary);font-family:var(--font-mono);">NPI: 1122334455</div>
</div>
</div>
<div style="padding:8px 16px;">
<div class="lm-kv">
<span class="lm-kv__key">Specialty</span><span class="lm-kv__value">Clinical Cardiac Electrophysiology</span>
<span class="lm-kv__key">Phone</span><span class="lm-kv__value">310-555-0256</span>
</div>
</div>
</div>
<div class="lm-clinical-note">
<div style="padding:8px 16px;border-bottom:1px solid var(--border);display:flex;gap:8px;">
<span class="lm-badge" style="background:var(--entry);color:var(--text-secondary);font-size:11px;">Progress Note</span>
<span class="lm-badge" style="background:var(--entry);color:var(--text-secondary);font-size:11px;">Dr. Gonzalez</span>
</div>
<div class="lm-clinical-note__section">
<div class="lm-clinical-note__section-body">Referring patient to EP for ablation evaluation given recurrent symptomatic AF on rate control. Anticoagulation current.</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- Individual providers display a person icon in the header; organizations display a building icon.
- The header uses a teal accent (`#38B2AC`) with the NPI number as a badge.
- Non-active NPI statuses (anything other than `"A"`) trigger an "Inactive" badge in destructive red.
- Gender codes `"M"` and `"F"` are automatically expanded to `"Male"` and `"Female"`.
- When `all_specialties` contains multiple entries, additional (non-primary) specialties are listed below the primary specialty with optional state licensure information.
- A clinical disclaimer is rendered at the bottom of the provider list.
