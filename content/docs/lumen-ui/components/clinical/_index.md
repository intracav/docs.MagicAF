---
title: "Clinical"
description: "20 healthcare-specialized components for clinical decision support — drug information, lab results, triage, FHIR patient data, dosing calculators, and more."
weight: 5
tags: [lumen-ui, clinical, healthcare]
categories: [component]
difficulty: beginner
estimated_reading_time: "2 min"
last_reviewed: "2026-03-17"
---

Clinical components render structured healthcare data into purpose-built cards, panels, and interactive widgets. Each component is designed around a specific clinical workflow — from ESI triage assessment to renal dose adjustment — and includes appropriate disclaimers, color-coded severity indicators, and collapsible detail sections.

All clinical components follow the same rendering conventions: themed cards with accent-colored headers, badge-based metadata, and a standard clinical disclaimer footer. They accept data from MCP tool results, FHIR endpoints, and FDA APIs.

---

### Drug Information

<div class="card-grid">
<div class="card">

### [DrugCard](/docs/lumen-ui/components/clinical/drug-card/)
RxNorm drug information with ingredients, brand names, dose forms, and NDC codes.

</div>
<div class="card">

### [DrugInteractions](/docs/lumen-ui/components/clinical/drug-interactions/)
FDA drug interaction data with collapsible label sections and severity badges.

</div>
<div class="card">

### [AdverseEvents](/docs/lumen-ui/components/clinical/adverse-events/)
FDA adverse event reports with top reactions chart and serious outcome counts.

</div>
<div class="card">

### [DrugRecalls](/docs/lumen-ui/components/clinical/drug-recalls/)
FDA drug recall notices with classification severity and recall details.

</div>
</div>

---

### Patient Assessment

<div class="card-grid">
<div class="card">

### [TriageCard](/docs/lumen-ui/components/clinical/triage-card/)
ESI triage assessment with color-coded acuity level, wait time, and action plan.

</div>
<div class="card">

### [Calculator](/docs/lumen-ui/components/clinical/calculator/)
Medical calculator result display with score, severity, interpretation, and inputs.

</div>
<div class="card">

### [DifferentialDx](/docs/lumen-ui/components/clinical/differential-dx/)
Ranked differential diagnosis list with likelihood, ICD-10 codes, and workup suggestions.

</div>
<div class="card">

### [ClinicalNote](/docs/lumen-ui/components/clinical/clinical-note/)
Structured clinical note viewer for SOAP notes, H&P, and discharge summaries.

</div>
<div class="card">

### [FhirPatient](/docs/lumen-ui/components/clinical/fhir-patient/)
FHIR patient summary with demographics, conditions, medications, allergies, and encounters.

</div>
</div>

---

### Dosing & Safety

<div class="card-grid">
<div class="card">

### [IVDrip](/docs/lumen-ui/components/clinical/iv-drip/)
IV drip rate calculator with dose range check, titration table, and clinical notes.

</div>
<div class="card">

### [RenalDose](/docs/lumen-ui/components/clinical/renal-dose/)
Renal dose adjustment with CrCl calculation, CKD staging, and FDA dosing guidance.

</div>
<div class="card">

### [Antimicrobial](/docs/lumen-ui/components/clinical/antimicrobial/)
Antibiotic selection guidance with spectrum, dosing, duration, and monitoring.

</div>
<div class="card">

### [AllergySafety](/docs/lumen-ui/components/clinical/allergy-safety/)
Allergy cross-reactivity and safety assessment with risk level and recommendation.

</div>
</div>

---

### Lab & Reference

<div class="card-grid">
<div class="card">

### [LabRanges](/docs/lumen-ui/components/clinical/lab-ranges/)
Lab reference ranges with demographic breakdowns and clinical notes.

</div>
<div class="card">

### [Checklist](/docs/lumen-ui/components/clinical/checklist/)
Interactive checklist with toggleable items, sections, and progress tracking.

</div>
</div>

---

### Research & Lookup

<div class="card-grid">
<div class="card">

### [ClinicalTrials](/docs/lumen-ui/components/clinical/clinical-trials/)
ClinicalTrials.gov search results with status, phase, and sponsor details.

</div>
<div class="card">

### [Guidelines](/docs/lumen-ui/components/clinical/guidelines/)
Practice guidelines with ranked recommendations, evidence levels, and supporting references.

</div>
<div class="card">

### [NpiResult](/docs/lumen-ui/components/clinical/npi-result/)
NPI provider lookup results with specialty, credentials, and practice location.

</div>
<div class="card">

### [HcpcsCodes](/docs/lumen-ui/components/clinical/hcpcs-codes/)
HCPCS/CPT code listing with code badges and procedure descriptions.

</div>
<div class="card">

### [CmsCoverage](/docs/lumen-ui/components/clinical/cms-coverage/)
CMS coverage determination with policy ID, coverage status, and criteria sections.

</div>
</div>
