---
title: "Composition Patterns"
description: "Proven patterns for composing Lumen UI components into dashboards, clinical summaries, comparisons, and other complex layouts."
weight: 2
tags: [lumen-ui, patterns, composition, dashboard, layout]
categories: [guide]
difficulty: intermediate
estimated_reading_time: "8 min"
last_reviewed: "2026-03-17"
---

Lumen UI components are designed to compose. This page shows proven patterns for building complex layouts from simple building blocks.

## Dashboard

A multi-panel layout with stats, charts, and tables:

```
Grid(columns=2,
  Card(title="Patient Census",
    Stack(direction="horizontal", gap=16,
      Stat(label="Total", value="142", trend="up", change="+5"),
      Stat(label="ICU", value="28", trend="neutral"),
      Stat(label="Discharged Today", value="12", trend="down", change="-3")
    )
  ),
  Card(title="Admissions Trend",
    LineChart(
      series=[{label:"Admissions", data:[{x:1,y:12},{x:2,y:15},{x:3,y:9},{x:4,y:18}]}],
      height=200
    )
  ),
  Card(title="Department Distribution",
    PieChart(
      data=[{label:"Cardiology",value:35},{label:"Neurology",value:25},{label:"Orthopedics",value:20},{label:"Other",value:20}],
      donut=true, height=200
    )
  ),
  Card(title="Recent Admissions",
    Table(
      columns=[{key:"name",label:"Patient"},{key:"dept",label:"Department"},{key:"time",label:"Admitted"}],
      rows=[{name:"J. Smith",dept:"Cardiology",time:"08:30"},{name:"A. Jones",dept:"Neurology",time:"09:15"}],
      compact=true
    )
  )
)
```

**Key pattern:** `Grid` → `Card` → content component. The grid provides the layout, cards provide visual grouping, and content components (Stat, Chart, Table) provide the data.

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview -- Patient Census Dashboard</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Dashboard Pattern</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--2">
        <!-- Patient Census Card -->
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Patient Census</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-stack lm-stack--horizontal lm-stack--gap-24">
              <div class="lm-stat">
                <span class="lm-stat__label">Total</span>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">142</span>
                </div>
                <div class="lm-stat__change lm-stat__change--up">&#9650; +5</div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">ICU</span>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">28</span>
                </div>
                <div class="lm-stat__change lm-stat__change--neutral">&#8212; 0</div>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label">Discharged</span>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">12</span>
                </div>
                <div class="lm-stat__change lm-stat__change--down">&#9660; -3</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Admissions Trend Card -->
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Admissions Trend</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-bar-chart">
              <div class="lm-bar-chart__bars" style="height: 120px;">
                <div class="lm-bar-chart__bar-group">
                  <div class="lm-bar-chart__bar lm-chart-1" style="height: 48%;"><span class="lm-bar-chart__bar-value">12</span></div>
                  <span class="lm-bar-chart__bar-label">Mon</span>
                </div>
                <div class="lm-bar-chart__bar-group">
                  <div class="lm-bar-chart__bar lm-chart-1" style="height: 60%;"><span class="lm-bar-chart__bar-value">15</span></div>
                  <span class="lm-bar-chart__bar-label">Tue</span>
                </div>
                <div class="lm-bar-chart__bar-group">
                  <div class="lm-bar-chart__bar lm-chart-1" style="height: 36%;"><span class="lm-bar-chart__bar-value">9</span></div>
                  <span class="lm-bar-chart__bar-label">Wed</span>
                </div>
                <div class="lm-bar-chart__bar-group">
                  <div class="lm-bar-chart__bar lm-chart-1" style="height: 72%;"><span class="lm-bar-chart__bar-value">18</span></div>
                  <span class="lm-bar-chart__bar-label">Thu</span>
                </div>
                <div class="lm-bar-chart__bar-group">
                  <div class="lm-bar-chart__bar lm-chart-1" style="height: 56%;"><span class="lm-bar-chart__bar-value">14</span></div>
                  <span class="lm-bar-chart__bar-label">Fri</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Department Distribution Card -->
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Department Distribution</div>
          </div>
          <div class="lm-card__body">
            <div class="lm-pie-chart">
              <svg class="lm-pie-chart__svg" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="55" fill="none" stroke="#5865F2" stroke-width="20" stroke-dasharray="120.95 224.47" stroke-dashoffset="0" class="lm-pie-chart__slice"/>
                <circle cx="70" cy="70" r="55" fill="none" stroke="#3BA55C" stroke-width="20" stroke-dasharray="86.39 258.03" stroke-dashoffset="-120.95" class="lm-pie-chart__slice"/>
                <circle cx="70" cy="70" r="55" fill="none" stroke="#FAA61A" stroke-width="20" stroke-dasharray="69.12 275.31" stroke-dashoffset="-207.35" class="lm-pie-chart__slice"/>
                <circle cx="70" cy="70" r="55" fill="none" stroke="#9B59B6" stroke-width="20" stroke-dasharray="69.12 275.31" stroke-dashoffset="-276.46" class="lm-pie-chart__slice"/>
              </svg>
              <div class="lm-pie-chart__legend">
                <div class="lm-pie-chart__legend-item">
                  <span class="lm-pie-chart__legend-dot" style="background: #5865F2;"></span>
                  <span class="lm-pie-chart__legend-label">Cardiology</span>
                  <span class="lm-pie-chart__legend-value">35%</span>
                </div>
                <div class="lm-pie-chart__legend-item">
                  <span class="lm-pie-chart__legend-dot" style="background: #3BA55C;"></span>
                  <span class="lm-pie-chart__legend-label">Neurology</span>
                  <span class="lm-pie-chart__legend-value">25%</span>
                </div>
                <div class="lm-pie-chart__legend-item">
                  <span class="lm-pie-chart__legend-dot" style="background: #FAA61A;"></span>
                  <span class="lm-pie-chart__legend-label">Orthopedics</span>
                  <span class="lm-pie-chart__legend-value">20%</span>
                </div>
                <div class="lm-pie-chart__legend-item">
                  <span class="lm-pie-chart__legend-dot" style="background: #9B59B6;"></span>
                  <span class="lm-pie-chart__legend-label">Other</span>
                  <span class="lm-pie-chart__legend-value">20%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Recent Admissions Card -->
        <div class="lm-card">
          <div class="lm-card__header">
            <div class="lm-card__title">Recent Admissions</div>
          </div>
          <div class="lm-card__body">
            <table class="lm-table lm-table--compact">
              <thead>
                <tr><th>Patient</th><th>Department</th><th>Admitted</th></tr>
              </thead>
              <tbody>
                <tr><td>J. Smith</td><td>Cardiology</td><td>08:30</td></tr>
                <tr><td>A. Jones</td><td>Neurology</td><td>09:15</td></tr>
                <tr><td>M. Chen</td><td>Orthopedics</td><td>10:42</td></tr>
                <tr><td>R. Patel</td><td>Cardiology</td><td>11:20</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Tabbed View

Content organized into switchable tabs:

```
Tabs(labels=["Overview", "Vitals", "Labs", "Medications"],
  Card(title="Patient Overview",
    KeyValue(items=[
      {key:"Name", value:"Jane Doe"},
      {key:"Age", value:"68"},
      {key:"MRN", value:"MRN-12345"},
      {key:"Primary Dx", value:"CHF (I50.9)"}
    ])
  ),
  Card(title="Vital Signs",
    LineChart(
      series=[{label:"HR", data:[...]}, {label:"BP Systolic", data:[...]}],
      title="24-Hour Trend"
    )
  ),
  Card(title="Lab Results",
    LabRanges(results=[
      {name:"BNP", unit:"pg/mL", adult:"<100"},
      {name:"Troponin", unit:"ng/mL", adult:"<0.04"},
      {name:"Creatinine", unit:"mg/dL", adult:"0.7-1.3"}
    ])
  ),
  Card(title="Active Medications",
    Table(
      columns=[{key:"drug",label:"Medication"},{key:"dose",label:"Dose"},{key:"route",label:"Route"}],
      rows=[{drug:"Furosemide",dose:"40mg",route:"PO"},{drug:"Lisinopril",dose:"10mg",route:"PO"}]
    )
  )
)
```

**Key pattern:** `Tabs` with `labels` array, one child per tab. Each child is typically a `Card`.

<div class="lumen-demo">
  <div class="lumen-demo__label">Interactive Preview -- Patient Chart</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Tabbed View Pattern</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-tabs">
        <div class="lm-tabs__nav">
          <button class="lm-tabs__tab active" data-tab="overview">Overview</button>
          <button class="lm-tabs__tab" data-tab="vitals">Vitals</button>
          <button class="lm-tabs__tab" data-tab="labs">Labs</button>
          <button class="lm-tabs__tab" data-tab="meds">Medications</button>
        </div>
        <!-- Overview Tab -->
        <div class="lm-tabs__panel active" data-tab="overview">
          <div class="lm-card">
            <div class="lm-card__header">
              <div class="lm-card__title">Patient Overview</div>
            </div>
            <div class="lm-card__body">
              <div class="lm-kv">
                <span class="lm-kv__key">Name</span>
                <span class="lm-kv__value">Jane Doe</span>
                <span class="lm-kv__key">Age</span>
                <span class="lm-kv__value">68</span>
                <span class="lm-kv__key">MRN</span>
                <span class="lm-kv__value" style="font-family: var(--font-mono);">MRN-12345</span>
                <span class="lm-kv__key">Primary Dx</span>
                <span class="lm-kv__value">CHF (I50.9)</span>
                <span class="lm-kv__key">Allergies</span>
                <span class="lm-kv__value" style="color: #DA373C; font-weight: 600;">Penicillin, Sulfa</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Vitals Tab -->
        <div class="lm-tabs__panel" data-tab="vitals">
          <div class="lm-card">
            <div class="lm-card__header">
              <div class="lm-card__title">Vital Signs</div>
              <p class="lm-card__description">Last 24 hours</p>
            </div>
            <div class="lm-card__body">
              <div class="lm-stack lm-stack--horizontal lm-stack--gap-24" style="flex-wrap: wrap;">
                <div class="lm-stat">
                  <span class="lm-stat__label">Heart Rate</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value">78</span><span class="lm-stat__unit">bpm</span></div>
                </div>
                <div class="lm-stat">
                  <span class="lm-stat__label">Blood Pressure</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value">132/84</span><span class="lm-stat__unit">mmHg</span></div>
                </div>
                <div class="lm-stat">
                  <span class="lm-stat__label">SpO2</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value">96</span><span class="lm-stat__unit">%</span></div>
                </div>
                <div class="lm-stat">
                  <span class="lm-stat__label">Temp</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value">98.4</span><span class="lm-stat__unit">&#176;F</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Labs Tab -->
        <div class="lm-tabs__panel" data-tab="labs">
          <div class="lm-card">
            <div class="lm-card__header">
              <div class="lm-card__title">Lab Results</div>
            </div>
            <div class="lm-card__body">
              <table class="lm-table lm-table--compact">
                <thead><tr><th>Test</th><th>Result</th><th>Reference</th><th>Flag</th></tr></thead>
                <tbody>
                  <tr><td>BNP</td><td><strong>892</strong></td><td>&lt;100 pg/mL</td><td><span class="flag-h">H</span></td></tr>
                  <tr><td>Troponin</td><td>0.02</td><td>&lt;0.04 ng/mL</td><td></td></tr>
                  <tr><td>Creatinine</td><td><strong>1.6</strong></td><td>0.7-1.3 mg/dL</td><td><span class="flag-h">H</span></td></tr>
                  <tr><td>Potassium</td><td>4.1</td><td>3.5-5.0 mEq/L</td><td></td></tr>
                  <tr><td>Sodium</td><td><strong>132</strong></td><td>136-145 mEq/L</td><td><span class="flag-l">L</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Medications Tab -->
        <div class="lm-tabs__panel" data-tab="meds">
          <div class="lm-card">
            <div class="lm-card__header">
              <div class="lm-card__title">Active Medications</div>
            </div>
            <div class="lm-card__body">
              <table class="lm-table lm-table--compact">
                <thead><tr><th>Medication</th><th>Dose</th><th>Route</th><th>Frequency</th></tr></thead>
                <tbody>
                  <tr><td>Furosemide</td><td>40 mg</td><td>PO</td><td>BID</td></tr>
                  <tr><td>Lisinopril</td><td>10 mg</td><td>PO</td><td>Daily</td></tr>
                  <tr><td>Metoprolol</td><td>25 mg</td><td>PO</td><td>BID</td></tr>
                  <tr><td>Spironolactone</td><td>25 mg</td><td>PO</td><td>Daily</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Clinical Summary

A vertical stack of clinical components for a patient encounter:

```
Stack(direction="vertical", gap=16,
  TriageCard(level=3, label="Urgent", chief_complaint="Chest pain, 2h onset"),

  Section(title="Assessment",
    DifferentialDx(
      chief_complaint="Chest pain",
      diagnoses=[{name:"ACS", probability:"High"}, {name:"PE", probability:"Moderate"}]
    )
  ),

  Section(title="Workup",
    Grid(columns=2,
      LabRanges(results=[{name:"Troponin", unit:"ng/mL", adult:"<0.04"}]),
      Calculator(name="HEART Score", score=7, severity="High Risk",
        interpretation="Recommend admission and cardiology consult")
    )
  ),

  Section(title="Plan",
    Checklist(title="ED Workup", items=[
      {text:"12-lead ECG", checked:true},
      {text:"Troponin x2 (0h, 3h)", checked:true},
      {text:"Chest X-Ray", checked:false},
      {text:"Cardiology consult", checked:false}
    ])
  )
)
```

**Key pattern:** `Stack` → `Section` → clinical components. Sections provide semantic grouping with collapsible headers.

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview -- ED Encounter Summary</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Clinical Summary Pattern</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
        <!-- Triage Card -->
        <div class="lm-triage lm-triage--3">
          <div class="lm-triage__banner">
            <span class="lm-triage__level-badge">ESI 3 &mdash; Urgent</span>
            <span class="lm-triage__wait">Wait: ~30 min</span>
          </div>
          <div class="lm-triage__body">
            <div>
              <div class="lm-triage__row-label">Chief Complaint</div>
              <div class="lm-triage__row-value">Chest pain, onset 2 hours ago. Substernal, pressure-like, radiating to left arm.</div>
            </div>
            <div>
              <div class="lm-triage__row-label">Vitals</div>
              <div class="lm-triage__row-value">HR 92, BP 145/90, SpO2 96%, RR 18, Temp 98.6&#176;F</div>
            </div>
          </div>
          <div class="lm-triage__footer">Clinical decision support — not a substitute for clinical judgment</div>
        </div>
        <!-- Assessment Section -->
        <div class="lm-section">
          <div class="lm-section__header">
            <span class="lm-section__title">Assessment</span>
            <span class="lm-section__toggle">&#9660;</span>
          </div>
          <div class="lm-section__body">
            <div class="lm-card">
              <div class="lm-card__header">
                <div class="lm-card__title">Differential Diagnosis</div>
                <p class="lm-card__description">Chest pain</p>
              </div>
              <div class="lm-card__body">
                <table class="lm-table lm-table--compact">
                  <thead><tr><th>Diagnosis</th><th>Probability</th><th>Key Workup</th></tr></thead>
                  <tbody>
                    <tr><td><strong>ACS</strong></td><td><span style="color: #DA373C; font-weight: 600;">High</span></td><td>ECG, troponin x2, cardiology consult</td></tr>
                    <tr><td><strong>PE</strong></td><td><span style="color: #FAA61A; font-weight: 600;">Moderate</span></td><td>D-dimer, CT-PA if positive</td></tr>
                    <tr><td>Musculoskeletal</td><td><span style="color: #3BA55C; font-weight: 600;">Low</span></td><td>Reproducible on palpation</td></tr>
                    <tr><td>GERD</td><td><span style="color: #3BA55C; font-weight: 600;">Low</span></td><td>Antacid trial</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <!-- Workup Section -->
        <div class="lm-section">
          <div class="lm-section__header">
            <span class="lm-section__title">Workup</span>
            <span class="lm-section__toggle">&#9660;</span>
          </div>
          <div class="lm-section__body">
            <div class="lm-grid lm-grid--2">
              <div class="lm-card">
                <div class="lm-card__header"><div class="lm-card__title">Labs</div></div>
                <div class="lm-card__body">
                  <table class="lm-table lm-table--compact">
                    <thead><tr><th>Test</th><th>Result</th><th>Flag</th></tr></thead>
                    <tbody>
                      <tr><td>Troponin I</td><td><strong>0.08</strong></td><td><span class="flag-h">H</span></td></tr>
                      <tr><td>D-dimer</td><td>0.42</td><td></td></tr>
                      <tr><td>BMP</td><td>Normal</td><td></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="lm-card" style="border-color: #DA373C;">
                <div class="lm-card__header"><div class="lm-card__title">HEART Score</div></div>
                <div class="lm-card__body" style="text-align: center;">
                  <div class="lm-stat" style="align-items: center;">
                    <span class="lm-stat__label">Total Score</span>
                    <div class="lm-stat__value-row"><span class="lm-stat__value lm-stat--danger" style="color: #DA373C;">7</span><span class="lm-stat__unit">/ 10</span></div>
                  </div>
                  <div style="margin-top: 8px; padding: 6px 12px; background: rgba(218,55,60,0.1); border-radius: 6px; font-size: 12px; font-weight: 600; color: #DA373C;">High Risk -- Recommend admission</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Plan Section -->
        <div class="lm-section">
          <div class="lm-section__header">
            <span class="lm-section__title">Plan</span>
            <span class="lm-section__toggle">&#9660;</span>
          </div>
          <div class="lm-section__body">
            <div class="lm-card">
              <div class="lm-card__header"><div class="lm-card__title">ED Workup Checklist</div></div>
              <div class="lm-card__body">
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <div class="lm-checklist__item checked" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <div style="width: 18px; height: 18px; border-radius: 4px; background: #3BA55C; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><span style="color: #fff; font-size: 12px; font-weight: 700;">&#10003;</span></div>
                    <span style="font-size: 13px; color: var(--text-primary); text-decoration: line-through; opacity: 0.7;">12-lead ECG</span>
                  </div>
                  <div class="lm-checklist__item checked" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <div style="width: 18px; height: 18px; border-radius: 4px; background: #3BA55C; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><span style="color: #fff; font-size: 12px; font-weight: 700;">&#10003;</span></div>
                    <span style="font-size: 13px; color: var(--text-primary); text-decoration: line-through; opacity: 0.7;">Troponin x2 (0h, 3h)</span>
                  </div>
                  <div class="lm-checklist__item" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <div style="width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border); flex-shrink: 0;"></div>
                    <span style="font-size: 13px; color: var(--text-primary);">Chest X-Ray</span>
                  </div>
                  <div class="lm-checklist__item" style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <div style="width: 18px; height: 18px; border-radius: 4px; border: 2px solid var(--border); flex-shrink: 0;"></div>
                    <span style="font-size: 13px; color: var(--text-primary);">Cardiology consult</span>
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

## Comparison

Side-by-side comparison using a split view or table:

```
SplitView(ratio=0.5,
  Card(title="Drug A: Lisinopril",
    Stack(direction="vertical",
      Stat(label="Efficacy", value="85%"),
      Stat(label="Side Effects", value="Low"),
      DrugCard(name="Lisinopril 10 MG Oral Tablet", rxcui="104377")
    )
  ),
  Card(title="Drug B: Losartan",
    Stack(direction="vertical",
      Stat(label="Efficacy", value="82%"),
      Stat(label="Side Effects", value:"Low"),
      DrugCard(name="Losartan 50 MG Oral Tablet", rxcui="979467")
    )
  )
)
```

**Key pattern:** `SplitView` with two children for side-by-side comparison. For more than two items, use a `Table` with comparison columns.

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview -- Drug Comparison</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">SplitView Comparison Pattern</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-split lm-split--horizontal">
        <div class="lm-split__pane">
          <div class="lm-card">
            <div class="lm-card__header">
              <div class="lm-card__title">Drug A: Lisinopril</div>
              <p class="lm-card__description">ACE Inhibitor</p>
            </div>
            <div class="lm-card__body">
              <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
                <div class="lm-stat">
                  <span class="lm-stat__label">Efficacy</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value lm-stat--success" style="color: #3BA55C;">85%</span></div>
                </div>
                <div class="lm-stat">
                  <span class="lm-stat__label">Side Effects</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value" style="font-size: 20px;">Low</span></div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Common: dry cough (10%), dizziness, hyperkalemia. Rare: angioedema.</div>
                <div class="lm-drug-card__tags" style="margin-top: 4px;">
                  <span class="lm-drug-card__tag">Oral Tablet</span>
                  <span class="lm-drug-card__tag">Generic</span>
                  <span class="lm-drug-card__tag">$4/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-split__pane">
          <div class="lm-card">
            <div class="lm-card__header">
              <div class="lm-card__title">Drug B: Losartan</div>
              <p class="lm-card__description">ARB</p>
            </div>
            <div class="lm-card__body">
              <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
                <div class="lm-stat">
                  <span class="lm-stat__label">Efficacy</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value lm-stat--success" style="color: #3BA55C;">82%</span></div>
                </div>
                <div class="lm-stat">
                  <span class="lm-stat__label">Side Effects</span>
                  <div class="lm-stat__value-row"><span class="lm-stat__value" style="font-size: 20px;">Low</span></div>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Common: dizziness (3%), hyperkalemia. No cough. Preferred if ACE-I intolerant.</div>
                <div class="lm-drug-card__tags" style="margin-top: 4px;">
                  <span class="lm-drug-card__tag">Oral Tablet</span>
                  <span class="lm-drug-card__tag">Generic</span>
                  <span class="lm-drug-card__tag">$8/month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Step-by-Step Guide

A sequential workflow or protocol:

```
Card(title="Sepsis Management Protocol",
  Steps(
    items=[
      {title:"Recognize", description:"qSOFA >= 2 or SIRS criteria", status:"completed"},
      {title:"Resuscitate", description:"30mL/kg crystalloid within 3h", status:"completed"},
      {title:"Cultures", description:"Blood cultures before antibiotics", status:"active"},
      {title:"Antibiotics", description:"Broad-spectrum within 1h", status:"pending"},
      {title:"Reassess", description:"Repeat lactate, MAP target > 65", status:"pending"}
    ],
    current=2
  ),
  Separator(),
  Callout(variant="warning", title="Time-sensitive",
    message="Antibiotic administration within 1 hour of sepsis recognition is associated with improved mortality.")
)
```

**Key pattern:** `Steps` inside a `Card`, with `Separator` and `Callout` for context.

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview -- Sepsis Protocol</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Steps Pattern</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Sepsis Management Protocol</div>
          <p class="lm-card__description">SEP-1 Bundle Compliance</p>
        </div>
        <div class="lm-card__body">
          <div class="lm-steps">
            <div class="lm-steps__item lm-steps__item--completed">
              <div class="lm-steps__number">&#10003;</div>
              <div class="lm-steps__title">Recognize</div>
              <div class="lm-steps__desc">qSOFA &ge; 2 or SIRS criteria met. Lactate ordered.</div>
            </div>
            <div class="lm-steps__item lm-steps__item--completed">
              <div class="lm-steps__number">&#10003;</div>
              <div class="lm-steps__title">Resuscitate</div>
              <div class="lm-steps__desc">30 mL/kg crystalloid within 3 hours. 2L NS bolus started.</div>
            </div>
            <div class="lm-steps__item">
              <div class="lm-steps__number">3</div>
              <div class="lm-steps__title">Cultures</div>
              <div class="lm-steps__desc">Blood cultures x2 before antibiotics. Pending collection.</div>
            </div>
            <div class="lm-steps__item lm-steps__item--pending">
              <div class="lm-steps__number">4</div>
              <div class="lm-steps__title">Antibiotics</div>
              <div class="lm-steps__desc">Broad-spectrum within 1 hour of sepsis recognition.</div>
            </div>
            <div class="lm-steps__item lm-steps__item--pending">
              <div class="lm-steps__number">5</div>
              <div class="lm-steps__title">Reassess</div>
              <div class="lm-steps__desc">Repeat lactate if initial &gt; 2. MAP target &gt; 65 mmHg.</div>
            </div>
          </div>
          <!-- Separator -->
          <div class="lm-separator" style="margin: 16px 0;">
            <div class="lm-separator__line"></div>
          </div>
          <!-- Callout -->
          <div style="padding: 12px 16px; background: rgba(250,166,26,0.1); border: 1px solid rgba(250,166,26,0.25); border-radius: 8px; display: flex; gap: 10px; align-items: flex-start;">
            <span style="font-size: 16px; flex-shrink: 0;">&#9888;&#65039;</span>
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #FAA61A; margin-bottom: 2px;">Time-sensitive</div>
              <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Antibiotic administration within 1 hour of sepsis recognition is associated with improved mortality. Each hour of delay increases risk.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Agent Tool Results

Rendering AI tool call results:

```
Stack(direction="vertical", gap=12,
  ToolCall(name="rxnorm_lookup", status="completed", primaryArg="metformin", duration="0.3s"),
  ToolResult(tool="rxnorm_lookup", status="success", summary="Found 5 results",
    DrugCard(name="Metformin 500 MG Oral Tablet", rxcui="861004")
  ),

  ToolCall(name="drug_interactions", status="completed", primaryArg="metformin", duration="1.2s"),
  ToolResult(tool="drug_interactions", status="success",
    DrugInteractions(drug="Metformin", labels=[{brand:"Glucophage", generic:"metformin hydrochloride", interactions:["Contrast dye: risk of lactic acidosis"]}])
  ),

  FollowUp(suggestions=["Check renal dosing", "Show adverse events", "Find alternatives"])
)
```

**Key pattern:** `ToolCall` → `ToolResult` → component, followed by `FollowUp` suggestions.

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview -- Agent Tool Chain</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Tool Call / Result Pattern</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
        <!-- Tool Call 1 -->
        <div class="lm-tool-call" data-expandable style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--entry); border: 1px solid var(--border); border-radius: 8px; cursor: pointer;">
          <span style="color: #3BA55C; font-size: 14px;">&#10003;</span>
          <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">rxnorm_lookup</span>
          <span style="font-size: 12px; color: var(--text-tertiary);">&mdash; "metformin"</span>
          <span style="font-size: 11px; color: var(--text-tertiary); margin-left: auto;">0.3s</span>
        </div>
        <!-- Tool Result 1 -->
        <div style="margin-left: 20px; border-left: 2px solid var(--border); padding-left: 16px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); margin-bottom: 8px;">Result &mdash; 5 matches</div>
          <div class="lm-drug-card">
            <div class="lm-drug-card__header">
              <div class="lm-drug-card__name">Metformin 500 MG Oral Tablet</div>
              <div class="lm-drug-card__rxcui">RxCUI: 861004</div>
            </div>
            <div class="lm-drug-card__body">
              <div>
                <div class="lm-drug-card__section-label">Dose Forms</div>
                <div class="lm-drug-card__tags">
                  <span class="lm-drug-card__tag">Oral Tablet</span>
                  <span class="lm-drug-card__tag">Extended Release</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Tool Call 2 -->
        <div class="lm-tool-call" data-expandable style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--entry); border: 1px solid var(--border); border-radius: 8px; cursor: pointer;">
          <span style="color: #3BA55C; font-size: 14px;">&#10003;</span>
          <span style="font-size: 13px; font-weight: 600; color: var(--text-primary);">drug_interactions</span>
          <span style="font-size: 12px; color: var(--text-tertiary);">&mdash; "metformin"</span>
          <span style="font-size: 11px; color: var(--text-tertiary); margin-left: auto;">1.2s</span>
        </div>
        <!-- Tool Result 2 -->
        <div style="margin-left: 20px; border-left: 2px solid var(--border); padding-left: 16px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary); margin-bottom: 8px;">Result</div>
          <div class="lm-card lm-card--outlined">
            <div class="lm-card__header"><div class="lm-card__title">Drug Interactions</div></div>
            <div class="lm-card__body">
              <table class="lm-table lm-table--compact">
                <thead><tr><th>Interactant</th><th>Severity</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td>Contrast dye</td><td><span class="flag-c">Critical</span></td><td>Risk of lactic acidosis. Hold 48h before/after.</td></tr>
                  <tr><td>Alcohol</td><td><span class="flag-h">Major</span></td><td>Increased risk of lactic acidosis.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Follow Up -->
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
          <button style="padding: 6px 14px; font-size: 13px; font-weight: 500; border: 1px solid var(--border); border-radius: 20px; background: var(--entry); color: var(--accent); cursor: pointer; transition: all 0.15s ease;">Check renal dosing</button>
          <button style="padding: 6px 14px; font-size: 13px; font-weight: 500; border: 1px solid var(--border); border-radius: 20px; background: var(--entry); color: var(--accent); cursor: pointer; transition: all 0.15s ease;">Show adverse events</button>
          <button style="padding: 6px 14px; font-size: 13px; font-weight: 500; border: 1px solid var(--border); border-radius: 20px; background: var(--entry); color: var(--accent); cursor: pointer; transition: all 0.15s ease;">Find alternatives</button>
        </div>
      </div>
    </div>
  </div>
</div>

## Next Steps

- **[Component Reference](/docs/lumen-ui/components/)** — detailed docs for each component
- **[DSL Syntax](/docs/lumen-ui/core-concepts/dsl-syntax/)** — the syntax used in these examples
