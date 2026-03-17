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

## Notes

- Individual providers display a person icon in the header; organizations display a building icon.
- The header uses a teal accent (`#38B2AC`) with the NPI number as a badge.
- Non-active NPI statuses (anything other than `"A"`) trigger an "Inactive" badge in destructive red.
- Gender codes `"M"` and `"F"` are automatically expanded to `"Male"` and `"Female"`.
- When `all_specialties` contains multiple entries, additional (non-primary) specialties are listed below the primary specialty with optional state licensure information.
- A clinical disclaimer is rendered at the bottom of the provider list.
