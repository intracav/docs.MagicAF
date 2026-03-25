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

## Component Showcase

<div class="lumen-demo">
<div class="lumen-demo__label">Interactive Showcase</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Lumen UI &mdash; Clinical Components</span>
</div>
<div class="lumen-demo__content">
<div class="lm">
<div class="lm-grid lm-grid--2" style="gap:16px;">

<!-- Drug Info -->
<div class="lm-card">
<div class="lm-card__header" style="background:rgba(61,191,128,0.06);">
<div class="lm-card__title" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:4px;">Drug Information</div>
<div style="font-size:15px;font-weight:700;color:var(--text-primary);">Warfarin Sodium 5 MG</div>
<div style="font-size:12px;color:var(--text-tertiary);font-family:var(--font-mono);">RxCUI: 855332</div>
</div>
<div class="lm-card__body" style="padding:10px 16px;">
<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;">
<span class="lm-drug-card__tag" style="background:rgba(88,101,242,0.1);color:#5865F2;font-size:11px;">Coumadin</span>
<span class="lm-drug-card__tag" style="background:rgba(88,101,242,0.1);color:#5865F2;font-size:11px;">Jantoven</span>
</div>
<div class="lm-interactions__item" style="padding:8px;margin-bottom:0;">
<span class="lm-interactions__severity lm-interactions__severity--high" style="font-size:10px;">High</span>
<div class="lm-interactions__desc" style="font-size:12px;">Aspirin increases bleeding risk</div>
</div>
</div>
</div>

<!-- Patient Assessment -->
<div class="lm-card">
<div class="lm-card__header" style="padding-bottom:8px;">
<div class="lm-card__title" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:4px;">Patient Assessment</div>
</div>
<div class="lm-card__body" style="padding:0 16px 10px;">
<div class="lm-triage lm-triage--2" style="border-radius:8px;margin-bottom:8px;">
<div class="lm-triage__banner" style="padding:8px 12px;">
<span class="lm-triage__level-badge" style="font-size:12px;padding:2px 8px;">ESI 2</span>
<span class="lm-triage__wait" style="font-size:12px;">Immediate</span>
</div>
</div>
<div style="display:flex;gap:8px;">
<div class="lm-calculator" style="flex:1;border-radius:8px;">
<div style="padding:8px;text-align:center;">
<div style="font-size:10px;color:var(--text-tertiary);">CHA2DS2-VASc</div>
<div style="font-size:20px;font-weight:800;color:#DA373C;">4</div>
<div style="font-size:10px;color:#DA373C;">High</div>
</div>
</div>
<div class="lm-calculator" style="flex:1;border-radius:8px;">
<div style="padding:8px;text-align:center;">
<div style="font-size:10px;color:var(--text-tertiary);">HAS-BLED</div>
<div style="font-size:20px;font-weight:800;color:#3BA55C;">2</div>
<div style="font-size:10px;color:#3BA55C;">Low</div>
</div>
</div>
</div>
</div>
</div>

<!-- Dosing & Safety -->
<div class="lm-card">
<div class="lm-card__header" style="padding-bottom:8px;">
<div class="lm-card__title" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:4px;">Dosing &amp; Safety</div>
</div>
<div class="lm-card__body" style="padding:0 16px 10px;">
<div style="text-align:center;margin-bottom:8px;">
<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0EA5E9;">NOREPINEPHRINE</div>
<div style="font-size:24px;font-weight:800;color:#0EA5E9;">15</div>
<div style="font-size:11px;color:var(--text-secondary);">mL/hr</div>
</div>
<div class="lm-renal-dose__stages" style="margin-bottom:6px;">
<div class="lm-renal-dose__stage lm-renal-dose__stage--1" style="font-size:10px;padding:2px 6px;">G1</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--2" style="font-size:10px;padding:2px 6px;">G2</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--3 active" style="font-size:10px;padding:2px 6px;">G3b</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--4" style="font-size:10px;padding:2px 6px;">G4</div>
<div class="lm-renal-dose__stage lm-renal-dose__stage--5" style="font-size:10px;padding:2px 6px;">G5</div>
</div>
<div class="lm-allergy-safety__header lm-allergy-safety__header--safe" style="padding:6px 10px;border-radius:6px;font-size:12px;">
<span style="font-weight:600;">Cefazolin</span>
<span class="lm-badge lm-badge--success" style="font-size:10px;">Safe</span>
</div>
</div>
</div>

<!-- Lab & Reference -->
<div class="lm-card">
<div class="lm-card__header" style="padding-bottom:8px;">
<div class="lm-card__title" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:4px;">Lab &amp; Reference</div>
</div>
<div class="lm-card__body" style="padding:0 16px 10px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
<span style="font-size:13px;font-weight:700;">WBC</span>
<span class="lm-badge lm-badge--default" style="font-size:10px;">K/uL</span>
</div>
<div class="lm-lab-range-bar" style="margin:4px 0;"><div class="lm-lab-range-bar__marker" style="left:50%;"></div></div>
<div class="lm-lab-range-bar__labels" style="font-size:10px;"><span>4.5</span><span>Normal</span><span>11.0</span></div>
<div style="margin-top:8px;">
<div class="lm-checklist__item checked" style="cursor:pointer;padding:4px 0;">
<span class="lm-checklist__box" style="font-size:12px;">&#10003;</span>
<span class="lm-checklist__text" style="font-size:12px;">Labs reviewed</span>
</div>
<div class="lm-checklist__item" style="cursor:pointer;padding:4px 0;">
<span class="lm-checklist__box" style="font-size:12px;"></span>
<span class="lm-checklist__text" style="font-size:12px;">Follow-up ordered</span>
</div>
</div>
</div>
</div>

<!-- Research (spans full width) -->
<div class="lm-card" style="grid-column:1/-1;">
<div class="lm-card__header" style="padding-bottom:8px;">
<div class="lm-card__title" style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary);margin-bottom:4px;">Research &amp; Lookup</div>
</div>
<div class="lm-card__body" style="padding:0 16px 10px;">
<div style="display:flex;gap:12px;flex-wrap:wrap;">
<div class="lm-trial" style="flex:1;min-width:200px;">
<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
<span class="lm-trial__nct" style="font-size:10px;">NCT04012345</span>
<span class="lm-trial__phase" style="font-size:10px;">Phase 3</span>
<span class="lm-badge lm-badge--success" style="font-size:10px;">Recruiting</span>
</div>
<div style="font-size:12px;font-weight:600;color:var(--text-primary);">GLP-1 RA vs SGLT2i in T2DM + HF</div>
</div>
<div style="flex:1;min-width:200px;">
<div class="lm-guidelines__item" style="border-left:3px solid #DA373C;padding-left:10px;">
<span class="lm-guidelines__level" style="font-size:10px;">Level A</span>
<div class="lm-guidelines__text" style="font-size:12px;">SGLT2i for all HFrEF patients</div>
<div class="lm-guidelines__source" style="font-size:10px;">AHA/ACC 2024</div>
</div>
<div class="lm-hcpcs__item" style="padding:6px 0;margin-top:6px;border:none;">
<span class="lm-hcpcs__code" style="font-size:10px;">99214</span>
<span class="lm-hcpcs__desc" style="font-size:11px;">Office visit, moderate MDM</span>
</div>
</div>
</div>
</div>
</div>

</div>
</div>
</div>
</div>
</div>

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
