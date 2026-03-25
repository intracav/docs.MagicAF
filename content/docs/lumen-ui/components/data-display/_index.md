---
title: "Data Display"
description: "Components for presenting data — tables, statistics, code, timelines, and structured text."
weight: 2
tags: [lumen-ui, data-display, components]
categories: [component]
difficulty: beginner
estimated_reading_time: "2 min"
last_reviewed: "2026-03-17"
---

The Data Display category contains 9 components for rendering structured information — from tabular data and key-value pairs to syntax-highlighted code and vertical timelines. These are the primary building blocks for presenting clinical results, patient records, and analytical output.

<div class="lumen-demo">
  <div class="lumen-demo__label">Data Display Components — Overview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Data Display Showcase</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--2" style="margin-bottom:16px;">
        <div class="lm-card">
          <div class="lm-card__header"><div class="lm-card__title">Lab Results (Table)</div></div>
          <div class="lm-card__body">
            <table class="lm-table lm-table--striped lm-table--compact">
              <thead><tr><th>Test</th><th>Result</th><th>Flag</th></tr></thead>
              <tbody>
                <tr><td>WBC</td><td class="flag-h">12.4 K/uL</td><td class="flag-h">H</td></tr>
                <tr><td>Hgb</td><td>14.1 g/dL</td><td></td></tr>
                <tr><td>Plt</td><td class="flag-l">138 K/uL</td><td class="flag-l">L</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="lm-card">
          <div class="lm-card__header"><div class="lm-card__title">Vitals (Stat)</div></div>
          <div class="lm-card__body">
            <div class="lm-grid lm-grid--2">
              <div class="lm-stat">
                <div class="lm-stat__label">Heart Rate</div>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">72</span>
                  <span class="lm-stat__unit">bpm</span>
                </div>
              </div>
              <div class="lm-stat lm-stat--danger">
                <div class="lm-stat__label">Temp</div>
                <div class="lm-stat__value-row">
                  <span class="lm-stat__value">101.2</span>
                  <span class="lm-stat__unit">&deg;F</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lm-grid lm-grid--2">
        <div class="lm-card">
          <div class="lm-card__header"><div class="lm-card__title">Encounter (Timeline)</div></div>
          <div class="lm-card__body">
            <div class="lm-timeline">
              <div class="lm-timeline__item">
                <div class="lm-timeline__dot" style="background:#5865F2;box-shadow:0 0 0 2px #5865F2;"></div>
                <div class="lm-timeline__date">03-15</div>
                <div class="lm-timeline__title">Admitted</div>
              </div>
              <div class="lm-timeline__item">
                <div class="lm-timeline__dot" style="background:#F5A623;box-shadow:0 0 0 2px #F5A623;"></div>
                <div class="lm-timeline__date">03-16</div>
                <div class="lm-timeline__title">Surgery</div>
              </div>
              <div class="lm-timeline__item">
                <div class="lm-timeline__dot" style="background:#3BA55C;box-shadow:0 0 0 2px #3BA55C;"></div>
                <div class="lm-timeline__date">03-17</div>
                <div class="lm-timeline__title">Discharged</div>
              </div>
            </div>
          </div>
        </div>
        <div class="lm-card">
          <div class="lm-card__header"><div class="lm-card__title">Patient (KeyValue)</div></div>
          <div class="lm-card__body">
            <div class="lm-kv">
              <span class="lm-kv__key">Name</span>
              <span class="lm-kv__value">Jane Doe</span>
              <span class="lm-kv__key">MRN</span>
              <span class="lm-kv__value">MRN-00412389</span>
              <span class="lm-kv__key">DOB</span>
              <span class="lm-kv__value">1985-04-12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

---

<div class="card-grid">
<div class="card">

### [Table →](/docs/lumen-ui/components/data-display/table/)
Data table with column headers, row striping, and flag-based cell coloring.

</div>
<div class="card">

### [KeyValue →](/docs/lumen-ui/components/data-display/key-value/)
Label-value pair display in stacked or inline layout with optional separators.

</div>
<div class="card">

### [Stat →](/docs/lumen-ui/components/data-display/stat/)
Big number KPI card with label, unit, trend arrow, and change indicator.

</div>
<div class="card">

### [Markdown →](/docs/lumen-ui/components/data-display/markdown/)
Renders markdown-formatted text with themed styling for headings, lists, tables, and code.

</div>
<div class="card">

### [CodeBlock →](/docs/lumen-ui/components/data-display/code-block/)
Syntax-highlighted code block with language detection, header, and copy button.

</div>
<div class="card">

### [JsonViewer →](/docs/lumen-ui/components/data-display/json-viewer/)
Collapsible, syntax-highlighted JSON viewer with copy support.

</div>
<div class="card">

### [ListView →](/docs/lumen-ui/components/data-display/list-view/)
Bulleted, numbered, or checklist-style list of items.

</div>
<div class="card">

### [Timeline →](/docs/lumen-ui/components/data-display/timeline/)
Vertical timeline with dated events, color-coded by variant.

</div>
<div class="card">

### [DescriptionList →](/docs/lumen-ui/components/data-display/description-list/)
Definition list with term-description pairs, rendered in a bordered list layout.

</div>
</div>
