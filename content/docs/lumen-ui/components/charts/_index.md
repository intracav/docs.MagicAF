---
title: "Charts & Visualization"
description: "Interactive chart components powered by fl_chart — bar, line, area, pie, radar, scatter, gauge, and sparkline."
weight: 3
tags: [lumen-ui, charts, visualization]
categories: [component]
difficulty: beginner
estimated_reading_time: "2 min"
last_reviewed: "2026-03-17"
---

Charts & Visualization components render interactive, themed charts from structured data. All chart components are powered by [fl_chart](https://pub.dev/packages/fl_chart) under the hood, with automatic color assignment from the active theme's `chartColors` palette.

Charts accept data as arrays of objects (DSL) or JSON arrays. They are fully composable — embed them inside Cards, Grids, Tabs, or any layout component to build dashboards and clinical summaries.

## At a Glance

<div class="lumen-demo">
  <div class="lumen-demo__label">Live Preview</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Charts & Visualization — All 8 Types</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-grid lm-grid--4" style="gap:12px;">
        <!-- Bar Chart mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">BarChart</div>
          <div class="lm-bar-chart lm-animate-bars">
            <div class="lm-bar-chart__bars" style="height:48px;gap:3px;">
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-1" style="height:65%;"></div></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-2" style="height:90%;"></div></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-3" style="height:50%;"></div></div>
              <div class="lm-bar-chart__bar-group"><div class="lm-bar-chart__bar lm-chart-4" style="height:100%;"></div></div>
            </div>
          </div>
        </div>
        <!-- Line Chart mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">LineChart</div>
          <svg viewBox="0 0 80 48" style="width:100%;height:48px;">
            <polyline class="lm-line-chart__line" stroke="#5865F2" points="0,36 16,24 32,30 48,18 64,22 80,12"/>
            <polyline class="lm-line-chart__line" stroke="#3BA55C" points="0,24 16,28 32,20 48,26 64,18 80,22"/>
          </svg>
        </div>
        <!-- Area Chart mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">AreaChart</div>
          <svg viewBox="0 0 80 48" style="width:100%;height:48px;">
            <polygon class="lm-line-chart__area" fill="#5865F2" points="0,24 20,16 40,28 60,12 80,20 80,48 0,48"/>
            <polyline class="lm-line-chart__line" stroke="#5865F2" points="0,24 20,16 40,28 60,12 80,20"/>
          </svg>
        </div>
        <!-- Pie Chart mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">PieChart</div>
          <svg viewBox="0 0 48 48" style="width:48px;height:48px;display:block;margin:0 auto;">
            <circle cx="24" cy="24" r="18" fill="none" stroke="#5865F2" stroke-width="8" stroke-dasharray="40 73" stroke-dashoffset="0" transform="rotate(-90 24 24)"/>
            <circle cx="24" cy="24" r="18" fill="none" stroke="#3BA55C" stroke-width="8" stroke-dasharray="28 85" stroke-dashoffset="-40" transform="rotate(-90 24 24)"/>
            <circle cx="24" cy="24" r="18" fill="none" stroke="#FAA61A" stroke-width="8" stroke-dasharray="22 91" stroke-dashoffset="-68" transform="rotate(-90 24 24)"/>
            <circle cx="24" cy="24" r="18" fill="none" stroke="#ED4245" stroke-width="8" stroke-dasharray="23 90" stroke-dashoffset="-90" transform="rotate(-90 24 24)"/>
          </svg>
        </div>
        <!-- Radar Chart mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">RadarChart</div>
          <svg viewBox="0 0 48 48" style="width:48px;height:48px;display:block;margin:0 auto;">
            <polygon class="lm-radar-chart__grid" points="24,4 43,18 38,40 10,40 5,18"/>
            <polygon class="lm-radar-chart__area" fill="#5865F2" stroke="#5865F2" points="24,12 36,20 33,34 15,34 11,20"/>
          </svg>
        </div>
        <!-- Scatter Chart mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">ScatterChart</div>
          <svg viewBox="0 0 80 48" style="width:100%;height:48px;">
            <circle cx="12" cy="36" r="3" fill="#5865F2" opacity="0.8"/>
            <circle cx="28" cy="24" r="3" fill="#5865F2" opacity="0.8"/>
            <circle cx="38" cy="30" r="3" fill="#5865F2" opacity="0.8"/>
            <circle cx="52" cy="16" r="3" fill="#5865F2" opacity="0.8"/>
            <circle cx="64" cy="12" r="3" fill="#5865F2" opacity="0.8"/>
            <circle cx="72" cy="8" r="3" fill="#5865F2" opacity="0.8"/>
          </svg>
        </div>
        <!-- Gauge mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Gauge</div>
          <svg viewBox="0 0 60 36" style="width:60px;height:36px;display:block;margin:0 auto;">
            <path d="M 6,32 A 24,24 0 0,1 54,32" fill="none" stroke="var(--border)" stroke-width="5" stroke-linecap="round"/>
            <path d="M 6,32 A 24,24 0 0,1 54,32" fill="none" stroke="#3BA55C" stroke-width="5" stroke-linecap="round" stroke-dasharray="75.4" stroke-dashoffset="15"/>
            <text x="30" y="30" text-anchor="middle" style="font-size:10px;font-weight:800;fill:var(--text-primary);">98</text>
          </svg>
        </div>
        <!-- Sparkline mini -->
        <div class="lm-card lm-card--outlined" style="padding:10px;">
          <div style="font-size:10px;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Sparkline</div>
          <svg viewBox="0 0 80 24" style="width:100%;height:24px;margin-top:12px;">
            <polyline class="lm-sparkline__line" points="0,18 11,14 23,10 34,16 46,8 57,12 69,6 80,10"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</div>

---

<div class="card-grid">
<div class="card">

### [BarChart](/docs/lumen-ui/components/charts/bar-chart/)
Categorical bar chart for comparing discrete values across groups.

</div>
<div class="card">

### [LineChart](/docs/lumen-ui/components/charts/line-chart/)
Trend line chart with one or more series for continuous data over time.

</div>
<div class="card">

### [AreaChart](/docs/lumen-ui/components/charts/area-chart/)
Filled area chart — line chart variant with shaded regions beneath each series.

</div>
<div class="card">

### [PieChart](/docs/lumen-ui/components/charts/pie-chart/)
Pie or donut chart for proportional distribution of categorical data.

</div>
<div class="card">

### [RadarChart](/docs/lumen-ui/components/charts/radar-chart/)
Spider/radar chart for multi-axis comparison across two or more series.

</div>
<div class="card">

### [ScatterChart](/docs/lumen-ui/components/charts/scatter-chart/)
Scatter plot for correlation analysis between two continuous variables.

</div>
<div class="card">

### [Gauge](/docs/lumen-ui/components/charts/gauge/)
Semi-circular gauge for single-value display with configurable thresholds.

</div>
<div class="card">

### [Sparkline](/docs/lumen-ui/components/charts/sparkline/)
Compact inline trend line designed for embedding in stats, cards, or table cells.

</div>
</div>
