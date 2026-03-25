---
title: "Layout"
description: "Components for structuring and organizing content — cards, grids, tabs, accordions, and more."
weight: 1
---

Layout components control how content is structured, grouped, and organized within a Lumen UI artifact. They provide containers, flow control, and spatial arrangement — everything between a raw value and a finished dashboard.

Most layout components accept children, making them the backbone of component composition.

<div class="lumen-demo">
  <div class="lumen-demo__label">Layout Component Showcase</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">10 Layout Components</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--2" style="gap: 12px;">
        <!-- Card -->
        <div class="lm-card" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Card</div>
            <p class="lm-card__description" style="font-size: 11px;">Container with title + variants</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-stack lm-stack--horizontal lm-stack--gap-8">
              <div class="lm-stat">
                <span class="lm-stat__label" style="font-size: 9px;">HR</span>
                <span class="lm-stat__value" style="font-size: 18px;">72</span>
              </div>
              <div class="lm-stat">
                <span class="lm-stat__label" style="font-size: 9px;">BP</span>
                <span class="lm-stat__value" style="font-size: 18px;">120/80</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Stack -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Stack</div>
            <p class="lm-card__description" style="font-size: 11px;">Vertical / horizontal flex</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-stack lm-stack--horizontal lm-stack--gap-4">
              <span class="lm-badge lm-badge--success" style="font-size: 10px;">Stable</span>
              <span class="lm-badge lm-badge--default" style="font-size: 10px;">Floor</span>
              <span class="lm-badge lm-badge--info" style="font-size: 10px;">Post-op</span>
            </div>
          </div>
        </div>
        <!-- Grid -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Grid</div>
            <p class="lm-card__description" style="font-size: 11px;">Multi-column layout</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-grid lm-grid--3" style="gap: 4px;">
              <div style="background: var(--accent-subtle, rgba(88,101,242,0.1)); border-radius: 4px; padding: 6px; text-align: center; font-size: 10px; color: var(--accent);">1</div>
              <div style="background: var(--accent-subtle, rgba(88,101,242,0.1)); border-radius: 4px; padding: 6px; text-align: center; font-size: 10px; color: var(--accent);">2</div>
              <div style="background: var(--accent-subtle, rgba(88,101,242,0.1)); border-radius: 4px; padding: 6px; text-align: center; font-size: 10px; color: var(--accent);">3</div>
            </div>
          </div>
        </div>
        <!-- Tabs -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Tabs</div>
            <p class="lm-card__description" style="font-size: 11px;">Switchable panels</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-tabs">
              <div class="lm-tabs__nav" style="margin-bottom: 6px;">
                <button class="lm-tabs__tab active" data-tab="idx-t1" style="padding: 4px 8px; font-size: 10px;">Info</button>
                <button class="lm-tabs__tab" data-tab="idx-t2" style="padding: 4px 8px; font-size: 10px;">Labs</button>
              </div>
              <div class="lm-tabs__panel active" data-tab="idx-t1">
                <p style="font-size: 11px; color: var(--text-secondary); margin: 0;">Patient overview data</p>
              </div>
              <div class="lm-tabs__panel" data-tab="idx-t2">
                <p style="font-size: 11px; color: var(--text-secondary); margin: 0;">Lab results table</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Accordion -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Accordion</div>
            <p class="lm-card__description" style="font-size: 11px;">Collapsible sections</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-accordion__item open" style="margin-bottom: 4px;">
              <button class="lm-accordion__trigger" style="padding: 6px 8px; font-size: 11px;">
                HPI
                <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 12px; height: 12px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="lm-accordion__body" style="padding: 0 8px 6px; font-size: 10px;">RUQ pain x 3 days</div>
            </div>
            <div class="lm-accordion__item" style="margin-bottom: 0;">
              <button class="lm-accordion__trigger" style="padding: 6px 8px; font-size: 11px;">
                Exam
                <svg class="lm-accordion__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 12px; height: 12px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div class="lm-accordion__body" style="padding: 0 8px 6px; font-size: 10px;">Murphy's sign positive</div>
            </div>
          </div>
        </div>
        <!-- Steps -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Steps</div>
            <p class="lm-card__description" style="font-size: 11px;">Progress indicator</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-steps" style="padding-left: 24px;">
              <div class="lm-steps__item lm-steps__item--completed" style="padding-bottom: 8px;">
                <div class="lm-steps__number" style="width: 16px; height: 16px; font-size: 9px; left: -24px;">&#10003;</div>
                <div class="lm-steps__title" style="font-size: 11px;">Intake</div>
              </div>
              <div class="lm-steps__item" style="padding-bottom: 8px;">
                <div class="lm-steps__number" style="width: 16px; height: 16px; font-size: 9px; left: -24px;">2</div>
                <div class="lm-steps__title" style="font-size: 11px; font-weight: 700;">Assessment</div>
              </div>
              <div class="lm-steps__item lm-steps__item--pending" style="padding-bottom: 0;">
                <div class="lm-steps__number" style="width: 16px; height: 16px; font-size: 9px; left: -24px;">3</div>
                <div class="lm-steps__title" style="font-size: 11px;">Plan</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Section -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Section</div>
            <p class="lm-card__description" style="font-size: 11px;">Titled content block</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-section" style="margin-bottom: 0;">
              <div class="lm-section__header" style="margin-bottom: 4px; cursor: default;">
                <div class="lm-section__title" style="font-size: 10px;">ASSESSMENT</div>
              </div>
              <div class="lm-section__body">
                <p style="font-size: 10px; color: var(--text-secondary); margin: 0;">Acute cholecystitis</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Separator -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">Separator</div>
            <p class="lm-card__description" style="font-size: 11px;">Divider with optional label</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-separator" style="margin: 4px 0;">
              <div class="lm-separator__line"></div>
              <span class="lm-separator__text" style="font-size: 9px;">DETAILS</span>
              <div class="lm-separator__line"></div>
            </div>
          </div>
        </div>
        <!-- ScrollArea -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">ScrollArea</div>
            <p class="lm-card__description" style="font-size: 11px;">Constrained scrollable region</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-scroll-area" style="max-height: 48px; padding: 4px 8px; font-size: 10px; color: var(--text-secondary);">
              <div>WBC: 7.2 K/uL</div>
              <div>RBC: 4.8 M/uL</div>
              <div>Hgb: 14.1 g/dL</div>
              <div>Hct: 42.3%</div>
              <div>Plt: 245 K/uL</div>
            </div>
          </div>
        </div>
        <!-- SplitView -->
        <div class="lm-card lm-card--outlined" style="min-height: 0;">
          <div class="lm-card__header">
            <div class="lm-card__title" style="font-size: 13px;">SplitView</div>
            <p class="lm-card__description" style="font-size: 11px;">Two-pane layout</p>
          </div>
          <div class="lm-card__body" style="padding: 8px 16px 12px;">
            <div class="lm-split lm-split--horizontal" style="border-radius: 4px;">
              <div class="lm-split__pane" style="padding: 6px; font-size: 10px; color: var(--text-secondary);">Left pane</div>
              <div class="lm-split__pane" style="padding: 6px; font-size: 10px; color: var(--text-secondary);">Right pane</div>
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

### [Card →](/docs/lumen-ui/components/layout/card/)
Bordered container with optional title, description, and variant styling.

</div>
<div class="card">

### [Stack →](/docs/lumen-ui/components/layout/stack/)
Flex layout container for vertical or horizontal arrangement of children.

</div>
<div class="card">

### [Grid →](/docs/lumen-ui/components/layout/grid/)
Responsive multi-column grid layout.

</div>
<div class="card">

### [Tabs →](/docs/lumen-ui/components/layout/tabs/)
Tabbed container where each child maps to a labeled tab.

</div>
<div class="card">

### [Accordion →](/docs/lumen-ui/components/layout/accordion/)
Collapsible sections for progressive disclosure of content.

</div>
<div class="card">

### [Steps →](/docs/lumen-ui/components/layout/steps/)
Numbered step indicator for wizard flows and multi-stage processes.

</div>
<div class="card">

### [Section →](/docs/lumen-ui/components/layout/section/)
Labeled content section with optional description and collapsible behavior.

</div>
<div class="card">

### [Separator →](/docs/lumen-ui/components/layout/separator/)
Divider line with optional text label.

</div>
<div class="card">

### [ScrollArea →](/docs/lumen-ui/components/layout/scroll-area/)
Scrollable container with configurable maximum height and direction.

</div>
<div class="card">

### [SplitView →](/docs/lumen-ui/components/layout/split-view/)
Two-pane layout with adjustable width ratio.

</div>
</div>
