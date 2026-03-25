---
title: "Feedback & Status"
description: "Components for alerts, progress indicators, status badges, and empty states."
weight: 7
---

Feedback components communicate system state, validation results, and contextual information to the user. They range from prominent alert banners to subtle inline badges. None of these components accept children unless noted — they are leaf-level indicators designed to be composed inside layout containers.

Use feedback components to surface drug interaction warnings, display treatment progress, indicate provider availability, or guide the user when no data is available.

## Component Showcase

<div class="lumen-demo">
<div class="lumen-demo__label">Interactive Showcase</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Feedback & Status Components</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<!-- Alert mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">Alert</div>
<div class="lm-alert lm-alert--warning">
<span class="lm-alert__icon">&#9888;</span>
<div class="lm-alert__content">
<div class="lm-alert__title">Drug Interaction Detected</div>
<div class="lm-alert__message">Lisinopril + Potassium may cause hyperkalemia.</div>
</div>
</div>
</div>

<!-- Callout mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">Callout</div>
<div class="lm-callout" style="border-left:3px solid #3BA55C; background:rgba(59,165,92,0.06); border-radius:8px; padding:10px 12px;">
<div class="lm-callout__title" style="font-weight:700; font-size:13px; margin-bottom:3px; color:#3BA55C;">Clinical Pearl</div>
<div class="lm-callout__body" style="font-size:12px; color:var(--text-secondary);">Check renal function before starting ACE inhibitors.</div>
</div>
</div>

<!-- Badge mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">Badge</div>
<div class="lm-stack lm-stack--horizontal lm-stack--gap-8" style="flex-wrap:wrap;">
<span class="lm-badge lm-badge--default">Default</span>
<span class="lm-badge lm-badge--success">Success</span>
<span class="lm-badge lm-badge--warning">Warning</span>
<span class="lm-badge lm-badge--error">Error</span>
<span class="lm-badge lm-badge--info">Info</span>
</div>
</div>

<!-- Progress mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">Progress</div>
<div class="lm-progress">
<div class="lm-progress__header"><span class="lm-progress__label">Treatment Progress</span><span class="lm-progress__percent">75%</span></div>
<div class="lm-progress__track"><div class="lm-progress__fill" style="width:75%; background:#3BA55C; transition:width 1.5s cubic-bezier(0.4,0,0.2,1);"></div></div>
</div>
</div>

<!-- StatusBadge mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">StatusBadge</div>
<div class="lm-stack lm-stack--horizontal lm-stack--gap-16" style="flex-wrap:wrap;">
<div class="lm-status-badge lm-status-badge--online"><span class="lm-status-badge__dot"></span> Online</div>
<div class="lm-status-badge lm-status-badge--busy"><span class="lm-status-badge__dot"></span> Busy</div>
<div class="lm-status-badge lm-status-badge--away"><span class="lm-status-badge__dot"></span> Away</div>
<div class="lm-status-badge lm-status-badge--offline"><span class="lm-status-badge__dot"></span> Offline</div>
</div>
</div>

<!-- EmptyState mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">EmptyState</div>
<div class="lm-empty-state" style="padding:16px 0;">
<div class="lm-empty-state__icon" style="font-size:24px; opacity:0.4;">&#128300;</div>
<div class="lm-empty-state__title" style="font-size:13px;">No Results</div>
<div class="lm-empty-state__message" style="font-size:12px;">Nothing to display here yet.</div>
</div>
</div>

</div>
</div>
</div>
</div>

---

<div class="card-grid">
<div class="card">

### [Alert →](/docs/lumen-ui/components/feedback/alert/)
Alert banner with variant-based styling for info, warning, error, and success states.

</div>
<div class="card">

### [Callout →](/docs/lumen-ui/components/feedback/callout/)
Highlighted information callout with optional children for rich content.

</div>
<div class="card">

### [Badge →](/docs/lumen-ui/components/feedback/badge/)
Inline label or tag for categorization and status indication.

</div>
<div class="card">

### [Progress →](/docs/lumen-ui/components/feedback/progress/)
Progress bar for visualizing completion percentage.

</div>
<div class="card">

### [StatusBadge →](/docs/lumen-ui/components/feedback/status-badge/)
Status indicator dot with label for presence and state display.

</div>
<div class="card">

### [EmptyState →](/docs/lumen-ui/components/feedback/empty-state/)
Placeholder for empty content areas with optional call-to-action.

</div>
</div>
