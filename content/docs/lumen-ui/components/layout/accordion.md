---
title: "Accordion"
description: "Collapsible sections for progressive disclosure of content."
weight: 5
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Accordion renders a series of collapsible sections. Each child component becomes a section, with its `title` prop used as the section header. Users click a header to expand or collapse its content. Use Accordion when content is too long to display at once and users only need one or a few sections at a time — for example, a review of systems, a multi-section clinical note, or a list of differential diagnoses.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `multiple` | bool | `false` | When `true`, multiple sections can be open simultaneously. When `false`, opening one section closes the others. |

**Children:** Yes. Each child is rendered as a collapsible section. The child component's `title` prop is extracted and used as the section header text. If a child has no `title`, its type name is used as a fallback.

## DSL Example

```
Accordion(multiple=true,
  Section(title="History of Present Illness",
    Markdown(content="Patient is a 54-year-old female presenting with 3 days of worsening right upper quadrant pain, associated with nausea and one episode of emesis.")
  ),
  Section(title="Physical Examination",
    Markdown(content="**Abdomen:** Soft, positive Murphy's sign, tenderness in RUQ without rebound or guarding. Bowel sounds present.")
  ),
  Section(title="Diagnostic Workup",
    Table(
      columns=[{key:"test", label:"Test"}, {key:"result", label:"Result"}, {key:"flag", label:"Flag"}],
      rows=[
        {test:"WBC", result:"13.2 K/uL", flag:"H"},
        {test:"Lipase", result:"42 U/L", flag:""},
        {test:"ALT", result:"68 U/L", flag:"H"},
        {test:"Alk Phos", result:"142 U/L", flag:"H"}
      ]
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview — Interactive Accordion (click to expand/collapse)</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Accordion — Clinical Note</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-accordion__item open">
        <button class="lm-accordion__trigger">
          History of Present Illness
          <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="lm-accordion__body">
          Patient is a 54-year-old female presenting with 3 days of worsening right upper quadrant pain, associated with nausea and one episode of emesis.
        </div>
      </div>
      <div class="lm-accordion__item">
        <button class="lm-accordion__trigger">
          Physical Examination
          <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="lm-accordion__body">
          <strong>Abdomen:</strong> Soft, positive Murphy's sign, tenderness in RUQ without rebound or guarding. Bowel sounds present.
        </div>
      </div>
      <div class="lm-accordion__item">
        <button class="lm-accordion__trigger">
          Diagnostic Workup
          <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="lm-accordion__body">
          <table class="lm-table lm-table--compact">
            <thead>
              <tr><th>Test</th><th>Result</th><th>Flag</th></tr>
            </thead>
            <tbody>
              <tr><td>WBC</td><td>13.2 K/uL</td><td class="flag-h">H</td></tr>
              <tr><td>Lipase</td><td>42 U/L</td><td></td></tr>
              <tr><td>ALT</td><td>68 U/L</td><td class="flag-h">H</td></tr>
              <tr><td>Alk Phos</td><td>142 U/L</td><td class="flag-h">H</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "accordion",
  "props": {
    "multiple": true
  },
  "children": [
    {
      "type": "section",
      "title": "History of Present Illness",
      "children": [
        {"type": "markdown", "content": "Patient is a 54-year-old female presenting with 3 days of worsening RUQ pain."}
      ]
    },
    {
      "type": "section",
      "title": "Physical Examination",
      "children": [
        {"type": "markdown", "content": "Abdomen: Soft, positive Murphy's sign, RUQ tenderness."}
      ]
    },
    {
      "type": "section",
      "title": "Diagnostic Workup",
      "children": [
        {
          "type": "table",
          "columns": [{"key": "test", "label": "Test"}, {"key": "result", "label": "Result"}],
          "rows": [{"test": "WBC", "result": "13.2 K/uL"}, {"test": "ALT", "result": "68 U/L"}]
        }
      ]
    }
  ]
}
```

## Composition

```
Card(title="Review of Systems",
  Accordion(multiple=false,
    Section(title="Constitutional",
      Markdown(content="Denies fever, chills, weight loss, or fatigue.")
    ),
    Section(title="Cardiovascular",
      Markdown(content="Denies chest pain, palpitations, orthopnea, or lower extremity edema.")
    ),
    Section(title="Respiratory",
      Markdown(content="Denies cough, dyspnea, wheezing, or hemoptysis.")
    ),
    Section(title="Gastrointestinal",
      Markdown(content="Reports nausea and one episode of non-bloody emesis. Denies diarrhea, constipation, melena.")
    ),
    Section(title="Musculoskeletal",
      Markdown(content="Denies joint pain, swelling, or stiffness.")
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview — Review of Systems (click sections)</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Accordion — Review of Systems</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Review of Systems</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-accordion__item open">
            <button class="lm-accordion__trigger">
              Constitutional
              <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="lm-accordion__body">
              Denies fever, chills, weight loss, or fatigue.
            </div>
          </div>
          <div class="lm-accordion__item">
            <button class="lm-accordion__trigger">
              Cardiovascular
              <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="lm-accordion__body">
              Denies chest pain, palpitations, orthopnea, or lower extremity edema.
            </div>
          </div>
          <div class="lm-accordion__item">
            <button class="lm-accordion__trigger">
              Respiratory
              <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="lm-accordion__body">
              Denies cough, dyspnea, wheezing, or hemoptysis.
            </div>
          </div>
          <div class="lm-accordion__item">
            <button class="lm-accordion__trigger">
              Gastrointestinal
              <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="lm-accordion__body">
              Reports nausea and one episode of non-bloody emesis. Denies diarrhea, constipation, melena.
            </div>
          </div>
          <div class="lm-accordion__item">
            <button class="lm-accordion__trigger">
              Musculoskeletal
              <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="lm-accordion__body">
              Denies joint pain, swelling, or stiffness.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- In single mode (`multiple=false`), the first section is open by default. In multiple mode, all sections start collapsed.
- Section headers show a chevron indicator that rotates to reflect open/closed state.
- Accordion expand/collapse state is local UI state and is not communicated back to the LLM.
- Children that are not Section components still work — the Accordion extracts the `title` prop from whatever component type is provided. However, using Section as the direct child is the recommended pattern.
