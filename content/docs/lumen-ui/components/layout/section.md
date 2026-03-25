---
title: "Section"
description: "Labeled content section with optional description and collapsible behavior."
weight: 7
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

Section creates a titled block of content with an optional description and optional collapse behavior. Unlike Card, which provides a visual container with borders and padding, Section is a lighter-weight organizational element — it adds a heading and optional description without introducing a new visual boundary. Use Section to divide long-form content into scannable segments within a card or page.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | — | **Required.** Section heading text. |
| `description` | string | — | Optional secondary text displayed below the title. |
| `collapsible` | bool | `false` | When `true`, the section can be collapsed by clicking the header. Content is visible by default. |

**Children:** Yes. Any components placed as children render inside the section body below the title and description.

## DSL Example

```
Section(title="Assessment", description="Clinical findings and impressions", collapsible=true,
  Markdown(content="""
  1. **Acute cholecystitis** — supported by RUQ pain, positive Murphy's sign, elevated WBC and ALP.
  2. **Cholelithiasis** — ultrasound confirms multiple gallstones with gallbladder wall thickening.
  """)
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview — Collapsible Section (click header to toggle)</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Section — Collapsible</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-section">
        <div class="lm-section__header">
          <div>
            <div class="lm-section__title">Assessment</div>
            <p style="font-size: 12px; color: var(--text-tertiary); margin: 2px 0 0;">Clinical findings and impressions</p>
          </div>
          <span class="lm-section__toggle">&#9660;</span>
        </div>
        <div class="lm-section__body">
          <ol style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Acute cholecystitis</strong> &mdash; supported by RUQ pain, positive Murphy's sign, elevated WBC and ALP.</li>
            <li><strong>Cholelithiasis</strong> &mdash; ultrasound confirms multiple gallstones with gallbladder wall thickening.</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "section",
  "props": {
    "title": "Assessment",
    "description": "Clinical findings and impressions",
    "collapsible": true
  },
  "children": [
    {
      "type": "markdown",
      "content": "1. **Acute cholecystitis** — supported by RUQ pain, positive Murphy's sign.\n2. **Cholelithiasis** — ultrasound confirms gallstones."
    }
  ]
}
```

## Composition

```
Card(title="Operative Note",
  Stack(direction="vertical", gap=16,
    Section(title="Pre-operative Diagnosis",
      Markdown(content="Acute cholecystitis with cholelithiasis.")
    ),
    Section(title="Procedure Performed",
      Markdown(content="Laparoscopic cholecystectomy.")
    ),
    Section(title="Findings", collapsible=true,
      Markdown(content="Gallbladder was distended and inflamed with adhesions to the omentum. Multiple pigmented stones identified. Cystic duct and artery identified, clipped, and divided. Critical view of safety achieved. Gallbladder removed from liver bed using electrocautery.")
    ),
    Section(title="Disposition", collapsible=true,
      Markdown(content="Patient transferred to PACU in stable condition. Estimated blood loss: 25 mL. No complications.")
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview — Operative Note (click collapsible headers)</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Section — Operative Note</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Operative Note</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
            <div class="lm-section">
              <div class="lm-section__header" style="cursor: default;">
                <div class="lm-section__title">Pre-operative Diagnosis</div>
              </div>
              <div class="lm-section__body">
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">Acute cholecystitis with cholelithiasis.</p>
              </div>
            </div>
            <div class="lm-section">
              <div class="lm-section__header" style="cursor: default;">
                <div class="lm-section__title">Procedure Performed</div>
              </div>
              <div class="lm-section__body">
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">Laparoscopic cholecystectomy.</p>
              </div>
            </div>
            <div class="lm-section">
              <div class="lm-section__header">
                <div class="lm-section__title">Findings</div>
                <span class="lm-section__toggle">&#9660;</span>
              </div>
              <div class="lm-section__body">
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">Gallbladder was distended and inflamed with adhesions to the omentum. Multiple pigmented stones identified. Cystic duct and artery identified, clipped, and divided. Critical view of safety achieved. Gallbladder removed from liver bed using electrocautery.</p>
              </div>
            </div>
            <div class="lm-section">
              <div class="lm-section__header">
                <div class="lm-section__title">Disposition</div>
                <span class="lm-section__toggle">&#9660;</span>
              </div>
              <div class="lm-section__body">
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">Patient transferred to PACU in stable condition. Estimated blood loss: 25 mL. No complications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- Section is the recommended direct child for Accordion. The Accordion component reads each child's `title` prop to generate its section headers.
- When `collapsible` is `true`, a chevron icon appears next to the title. Clicking the header toggles visibility of the children.
- Collapsible sections start expanded by default. There is no prop to control initial collapsed state — use Accordion if you need that control.
- Section does not add borders, background, or padding beyond the heading area. Wrap in a Card if you need visual containment.
