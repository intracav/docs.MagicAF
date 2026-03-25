---
title: "Separator"
description: "Divider line with optional text label."
weight: 8
tags: [lumen-ui, component, layout]
categories: [component]
difficulty: beginner
estimated_reading_time: "2 min"
last_reviewed: "2026-03-17"
---

Separator renders a thin divider line to visually separate groups of content. It can optionally display a text label centered on the line. Use Separator between logical sections within a card or stack to improve scannability without introducing a full heading.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Direction of the divider line. Horizontal spans the full width; vertical spans the full height of its parent. |
| `label` | string | — | Optional text displayed centered on the divider line. The line breaks around the label text. |

**Children:** No. Separator is a leaf component.

## DSL Example

```
Separator(label="Additional Information")
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview — Separator Variants</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Separator — With and Without Label</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-16">
        <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">Content above the separator</p>
        <div class="lm-separator">
          <div class="lm-separator__line"></div>
        </div>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">Plain separator (no label)</p>
        <div class="lm-separator">
          <div class="lm-separator__line"></div>
          <span class="lm-separator__text">Additional Information</span>
          <div class="lm-separator__line"></div>
        </div>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">Labeled separator (text centered on line)</p>
      </div>
    </div>
  </div>
</div>

## JSON Example

```json
{
  "type": "separator",
  "props": {
    "label": "Additional Information"
  }
}
```

## Composition

```
Card(title="Discharge Summary",
  Stack(direction="vertical", gap=12,
    Section(title="Hospital Course",
      Markdown(content="Patient underwent uncomplicated laparoscopic cholecystectomy on hospital day 1. Post-operative course was unremarkable. Tolerating regular diet by POD1.")
    ),
    Separator(label="Discharge Instructions"),
    Markdown(content="""
    1. Resume normal diet as tolerated
    2. No heavy lifting (>10 lbs) for 2 weeks
    3. Incision care: keep clean and dry for 48 hours
    4. Follow up with surgery clinic in 2 weeks
    """),
    Separator(),
    Section(title="Medications at Discharge",
      Table(
        columns=[{key:"med", label:"Medication"}, {key:"dose", label:"Dose"}, {key:"freq", label:"Frequency"}],
        rows=[
          {med:"Acetaminophen", dose:"500mg", freq:"Q6H PRN"},
          {med:"Ondansetron", dose:"4mg", freq:"Q8H PRN"}
        ]
      )
    )
  )
)
```

<div class="lumen-demo">
  <div class="lumen-demo__label">Composition Preview — Discharge Summary</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Separator — In Discharge Summary</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-card">
        <div class="lm-card__header">
          <div class="lm-card__title">Discharge Summary</div>
        </div>
        <div class="lm-card__body">
          <div class="lm-stack lm-stack--vertical lm-stack--gap-12">
            <div class="lm-section">
              <div class="lm-section__header" style="cursor: default;">
                <div class="lm-section__title">Hospital Course</div>
              </div>
              <div class="lm-section__body">
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0;">Patient underwent uncomplicated laparoscopic cholecystectomy on hospital day 1. Post-operative course was unremarkable. Tolerating regular diet by POD1.</p>
              </div>
            </div>
            <div class="lm-separator">
              <div class="lm-separator__line"></div>
              <span class="lm-separator__text">Discharge Instructions</span>
              <div class="lm-separator__line"></div>
            </div>
            <ol style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Resume normal diet as tolerated</li>
              <li>No heavy lifting (&gt;10 lbs) for 2 weeks</li>
              <li>Incision care: keep clean and dry for 48 hours</li>
              <li>Follow up with surgery clinic in 2 weeks</li>
            </ol>
            <div class="lm-separator">
              <div class="lm-separator__line"></div>
            </div>
            <div class="lm-section">
              <div class="lm-section__header" style="cursor: default;">
                <div class="lm-section__title">Medications at Discharge</div>
              </div>
              <div class="lm-section__body">
                <table class="lm-table lm-table--compact">
                  <thead>
                    <tr><th>Medication</th><th>Dose</th><th>Frequency</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Acetaminophen</td><td>500mg</td><td>Q6H PRN</td></tr>
                    <tr><td>Ondansetron</td><td>4mg</td><td>Q8H PRN</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

## Notes

- A Separator with no props renders as a simple horizontal line — the most common usage.
- Vertical separators are useful inside horizontal Stacks or SplitViews to create a visual divider between panes.
- The label text is rendered in a muted foreground color with a small font size.
- Separator adds no additional spacing of its own. Control spacing with the parent Stack's `gap` or by adding explicit spacing.
