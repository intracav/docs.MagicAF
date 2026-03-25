---
title: "Theming"
description: "Lumen UI's zero-config theme system — semantic colors, typography, chart palettes, spacing, radii, shadows, and animations."
weight: 4
tags: [lumen-ui, theming, colors, typography, dark-mode]
categories: [concept]
difficulty: intermediate
estimated_reading_time: "8 min"
last_reviewed: "2026-03-17"
---

Lumen UI ships with a complete theme system that auto-detects light or dark mode from Flutter's context. No configuration is required for default usage.

## Zero-Config Usage

```dart
// Theme is auto-detected — no wrapper needed
LumenRenderer(nodes: result.nodes)
```

`LumenRenderer` reads `Theme.of(context).brightness` and constructs the appropriate `LumenThemeData` automatically. Dark mode uses a Discord-inspired palette; light mode uses a clean, high-contrast palette.

## Explicit Theme

To override the auto-detected theme:

```dart
LumenRenderer(
  nodes: result.nodes,
  theme: LumenThemeData.dark(),   // or LumenThemeData.light()
)
```

Or provide a fully custom theme:

```dart
LumenRenderer(
  nodes: result.nodes,
  theme: LumenThemeData(
    brightness: Brightness.dark,
    colors: LumenColors.dark().copyWith(
      primary: Color(0xFF00B4D8),
    ),
    typography: LumenTypography.standard(),
    chartColors: LumenChartColors.standard(),
  ),
)
```

## Theme Data Structure

```dart
LumenThemeData {
  brightness: Brightness,
  colors: LumenColors,              // 23 semantic color tokens
  typography: LumenTypography,      // 8 text styles
  chartColors: LumenChartColors,    // 8-color indexed palette
}
```

## Colors

`LumenColors` defines 23 semantic color tokens. Every component uses these tokens rather than hardcoded values.

### Semantic Color Tokens

<div class="lumen-demo">
  <div class="lumen-demo__label">Semantic Colors</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Semantic Color Swatches</span>
    </div>
    <div class="lumen-demo__content lm">
      <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
        <div style="text-align:center;">
          <div style="width:64px; height:64px; border-radius:12px; background:#5865F2; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:700; color:var(--text-primary);">Primary</div>
          <div style="font-size:10px; color:var(--text-tertiary);">#5865F2</div>
        </div>
        <div style="text-align:center;">
          <div style="width:64px; height:64px; border-radius:12px; background:#3BA55C; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:700; color:var(--text-primary);">Success</div>
          <div style="font-size:10px; color:var(--text-tertiary);">#3BA55C</div>
        </div>
        <div style="text-align:center;">
          <div style="width:64px; height:64px; border-radius:12px; background:#F5A623; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:700; color:var(--text-primary);">Warning</div>
          <div style="font-size:10px; color:var(--text-tertiary);">#F5A623</div>
        </div>
        <div style="text-align:center;">
          <div style="width:64px; height:64px; border-radius:12px; background:#DA373C; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:700; color:var(--text-primary);">Destructive</div>
          <div style="font-size:10px; color:var(--text-tertiary);">#DA373C</div>
        </div>
        <div style="text-align:center;">
          <div style="width:64px; height:64px; border-radius:12px; background:#5865F2; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:700; color:var(--text-primary);">Info</div>
          <div style="font-size:10px; color:var(--text-tertiary);">#5865F2</div>
        </div>
      </div>
    </div>
  </div>
</div>

### Dark Palette (Default)

<div class="lumen-demo">
  <div class="lumen-demo__label">Dark Theme Surface Colors</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Dark Palette</span>
    </div>
    <div class="lumen-demo__content lm" style="background:#313338;">
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#313338; border:1px solid #4a4b50; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#F2F3F5;">Background</div>
          <div style="font-size:10px; color:#B5BAC1;">#313338</div>
        </div>
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#2B2D31; border:1px solid #4a4b50; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#F2F3F5;">Card</div>
          <div style="font-size:10px; color:#B5BAC1;">#2B2D31</div>
        </div>
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#2B2D31; border:1px solid #4a4b50; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#F2F3F5;">Muted</div>
          <div style="font-size:10px; color:#B5BAC1;">#2B2D31</div>
        </div>
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#1E1F22; border:1px solid #4a4b50; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#F2F3F5;">Border</div>
          <div style="font-size:10px; color:#B5BAC1;">#1E1F22</div>
        </div>
      </div>
      <div style="margin-top:16px; padding:12px; background:#2B2D31; border-radius:8px; border:1px solid #1E1F22;">
        <span style="font-size:12px; color:#F2F3F5; font-weight:600;">Foreground: </span>
        <span style="font-size:12px; color:#F2F3F5;">#F2F3F5</span>
        <span style="margin:0 8px; color:#1E1F22;">|</span>
        <span style="font-size:12px; color:#B5BAC1; font-weight:600;">Muted FG: </span>
        <span style="font-size:12px; color:#B5BAC1;">#B5BAC1</span>
      </div>
    </div>
  </div>
</div>

| Token | Hex | Purpose |
|-------|-----|---------|
| `primary` | `#5865F2` | Primary actions, links, active states |
| `primaryForeground` | `#FFFFFF` | Text on primary |
| `background` | `#313338` | Page background |
| `foreground` | `#F2F3F5` | Primary text |
| `card` | `#2B2D31` | Card/panel backgrounds |
| `cardForeground` | `#F2F3F5` | Text on cards |
| `muted` | `#2B2D31` | Subdued backgrounds |
| `mutedForeground` | `#B5BAC1` | Secondary text, captions |
| `accent` | `#404249` | Hover states, subtle emphasis |
| `accentForeground` | `#F2F3F5` | Text on accent |
| `border` | `#1E1F22` | Borders, dividers |
| `input` | `#1E1F22` | Input field borders |
| `ring` | `#5865F2` | Focus rings |
| `destructive` | Red | Error states, destructive actions |
| `destructiveForeground` | White | Text on destructive |
| `warning` | Amber | Warning states |
| `warningForeground` | White | Text on warning |
| `success` | Green | Success states, positive trends |
| `successForeground` | White | Text on success |
| `info` | Blue | Informational states |
| `infoForeground` | White | Text on info |
| `secondary` | — | Secondary actions |
| `secondaryForeground` | — | Text on secondary |

### Light Palette

<div class="lumen-demo">
  <div class="lumen-demo__label">Light Theme Surface Colors</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">Light Palette</span>
    </div>
    <div class="lumen-demo__content lm" style="background:#FFFFFF;">
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#FFFFFF; border:1px solid #E0E0E0; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#060607;">Background</div>
          <div style="font-size:10px; color:#888;">#FFFFFF</div>
        </div>
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#FFFFFF; border:1px solid #E0E0E0; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#060607;">Card</div>
          <div style="font-size:10px; color:#888;">#FFFFFF</div>
        </div>
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#F2F3F5; border:1px solid #E0E0E0; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#060607;">Muted</div>
          <div style="font-size:10px; color:#888;">#F2F3F5</div>
        </div>
        <div style="text-align:center;">
          <div style="width:100%; aspect-ratio:1; border-radius:8px; background:#E0E0E0; border:1px solid #ccc; margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:#060607;">Border</div>
          <div style="font-size:10px; color:#888;">#E0E0E0</div>
        </div>
      </div>
      <div style="margin-top:16px; padding:12px; background:#F2F3F5; border-radius:8px; border:1px solid #E0E0E0;">
        <span style="font-size:12px; color:#060607; font-weight:600;">Foreground: </span>
        <span style="font-size:12px; color:#060607;">#060607</span>
        <span style="margin:0 8px; color:#E0E0E0;">|</span>
        <span style="font-size:12px; color:#888; font-weight:600;">Muted FG: </span>
        <span style="font-size:12px; color:#888;">#6D6F78</span>
      </div>
    </div>
  </div>
</div>

The light palette follows the same token structure with high-contrast, light-background values.

## Typography

`LumenTypography` provides 8 text styles used consistently across all components:

| Style | Typical Use |
|-------|-------------|
| `headingXl` | Page-level headings, large stat values |
| `headingLg` | Section headings, card titles |
| `bodySmMedium` | Emphasized body text, labels |
| `bodySm` | Standard body text |
| `caption` | Secondary text, timestamps, metadata (medium weight) |
| `captionRegular` | Same size as caption, regular weight |
| `code` | Code blocks, monospaced content |
| `buttonSm` | Button labels, action text |

## Typography Scale

<div class="lumen-demo">
  <div class="lumen-demo__label">Type Scale</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LumenTypography</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">headingXl</span>
          <span style="font-size:28px; font-weight:800; letter-spacing:-0.02em; color:var(--text-primary); line-height:1.2;">Dashboard</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">headingLg</span>
          <span style="font-size:15px; font-weight:700; letter-spacing:-0.01em; color:var(--text-primary);">Patient Summary</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">bodySmMedium</span>
          <span style="font-size:14px; font-weight:500; color:var(--text-primary);">Emphasized body text</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">bodySm</span>
          <span style="font-size:14px; font-weight:400; color:var(--text-primary);">Standard body text for content</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">caption</span>
          <span style="font-size:12px; font-weight:500; color:var(--text-secondary);">Secondary metadata text</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">captionRegular</span>
          <span style="font-size:12px; font-weight:400; color:var(--text-secondary);">Timestamps, helper text</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0; border-bottom:1px solid var(--border);">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">code</span>
          <span style="font-size:13px; font-family:'SF Mono',Monaco,monospace; color:var(--text-primary);">monospaced content</span>
        </div>
        <div style="display:flex; align-items:baseline; gap:16px; padding:6px 0;">
          <span style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); width:110px; flex-shrink:0;">buttonSm</span>
          <span style="font-size:13px; font-weight:600; letter-spacing:0.01em; color:var(--text-primary);">Button Label</span>
        </div>
      </div>
    </div>
  </div>
</div>

## Chart Colors

<div class="lumen-demo">
  <div class="lumen-demo__label">Chart Color Palette</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LumenChartColors &mdash; 8 Indexed Colors</span>
    </div>
    <div class="lumen-demo__content lm">
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#5865F2; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[0]</div>
        </div>
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#3BA55C; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[1]</div>
        </div>
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#FAA61A; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[2]</div>
        </div>
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#ED4245; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[3]</div>
        </div>
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#9B59B6; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[4]</div>
        </div>
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#E91E63; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[5]</div>
        </div>
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#11806A; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[6]</div>
        </div>
        <div style="text-align:center;">
          <div style="width:48px; height:48px; border-radius:8px; background:#E67E22; margin-bottom:4px;"></div>
          <div style="font-size:10px; font-weight:600; color:var(--text-tertiary);">[7]</div>
        </div>
      </div>
      <div style="margin-top:12px;">
        <div class="lm-bar-chart">
          <div class="lm-bar-chart__bars" style="height:80px;">
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-1" style="height:60%;"></div>
              <span class="lm-bar-chart__bar-label">S1</span>
            </div>
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-2" style="height:80%;"></div>
              <span class="lm-bar-chart__bar-label">S2</span>
            </div>
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-3" style="height:45%;"></div>
              <span class="lm-bar-chart__bar-label">S3</span>
            </div>
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-4" style="height:70%;"></div>
              <span class="lm-bar-chart__bar-label">S4</span>
            </div>
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-5" style="height:55%;"></div>
              <span class="lm-bar-chart__bar-label">S5</span>
            </div>
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-6" style="height:35%;"></div>
              <span class="lm-bar-chart__bar-label">S6</span>
            </div>
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-7" style="height:90%;"></div>
              <span class="lm-bar-chart__bar-label">S7</span>
            </div>
            <div class="lm-bar-chart__bar-group">
              <div class="lm-bar-chart__bar lm-chart-8" style="height:50%;"></div>
              <span class="lm-bar-chart__bar-label">S8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

`LumenChartColors` provides an indexed palette of 8 colors for chart data series. Access by index — the palette wraps around for series beyond 8:

```dart
theme.chartColors[0]  // First series color
theme.chartColors[1]  // Second series color
theme.chartColors[7]  // Eighth series color
theme.chartColors[8]  // Wraps to first color
```

The palette is designed for accessibility — colors are distinguishable in both light and dark modes and remain identifiable for users with common color vision deficiencies.

## Spacing

<div class="lumen-demo">
  <div class="lumen-demo__label">Spacing Scale</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LumenSpacing</span>
    </div>
    <div class="lumen-demo__content lm">
      <div class="lm-stack lm-stack--vertical lm-stack--gap-8">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:11px; font-weight:600; color:var(--text-tertiary); width:28px; text-align:right;">s1</span>
          <div style="width:4px; height:16px; background:var(--accent); border-radius:2px;"></div>
          <span style="font-size:11px; color:var(--text-secondary);">4px</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:11px; font-weight:600; color:var(--text-tertiary); width:28px; text-align:right;">s2</span>
          <div style="width:8px; height:16px; background:var(--accent); border-radius:2px;"></div>
          <span style="font-size:11px; color:var(--text-secondary);">8px</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:11px; font-weight:600; color:var(--text-tertiary); width:28px; text-align:right;">s3</span>
          <div style="width:12px; height:16px; background:var(--accent); border-radius:2px;"></div>
          <span style="font-size:11px; color:var(--text-secondary);">12px</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:11px; font-weight:600; color:var(--text-tertiary); width:28px; text-align:right;">s4</span>
          <div style="width:16px; height:16px; background:var(--accent); border-radius:2px;"></div>
          <span style="font-size:11px; color:var(--text-secondary);">16px</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:11px; font-weight:600; color:var(--text-tertiary); width:28px; text-align:right;">s6</span>
          <div style="width:24px; height:16px; background:var(--accent); border-radius:2px;"></div>
          <span style="font-size:11px; color:var(--text-secondary);">24px</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:11px; font-weight:600; color:var(--text-tertiary); width:28px; text-align:right;">s8</span>
          <div style="width:32px; height:16px; background:var(--accent); border-radius:2px;"></div>
          <span style="font-size:11px; color:var(--text-secondary);">32px</span>
        </div>
      </div>
    </div>
  </div>
</div>

`LumenSpacing` constants used for padding and margins:

| Token | Value | Common Use |
|-------|-------|------------|
| `s1` | 4px | Tight spacing, icon gaps |
| `s2` | 8px | Compact padding, small gaps |
| `s3` | 12px | Standard padding |
| `s4` | 16px | Card padding, section gaps |
| `s6` | 24px | Large section spacing |
| `s8` | 32px | Page-level spacing |

## Radii

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__bar">
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__dot"></span>
      <span class="lumen-demo__bar-title">LumenRadii</span>
    </div>
    <div class="lumen-demo__content lm">
      <div style="display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
        <div style="text-align:center;">
          <div style="width:56px; height:56px; border-radius:4px; border:2px solid var(--accent); margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:var(--text-primary);">sm</div>
          <div style="font-size:10px; color:var(--text-tertiary);">4px</div>
        </div>
        <div style="text-align:center;">
          <div style="width:56px; height:56px; border-radius:6px; border:2px solid var(--accent); margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:var(--text-primary);">md</div>
          <div style="font-size:10px; color:var(--text-tertiary);">6px</div>
        </div>
        <div style="text-align:center;">
          <div style="width:56px; height:56px; border-radius:8px; border:2px solid var(--accent); margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:var(--text-primary);">lg</div>
          <div style="font-size:10px; color:var(--text-tertiary);">8px</div>
        </div>
        <div style="text-align:center;">
          <div style="width:56px; height:56px; border-radius:9999px; border:2px solid var(--accent); margin-bottom:6px;"></div>
          <div style="font-size:11px; font-weight:600; color:var(--text-primary);">full</div>
          <div style="font-size:10px; color:var(--text-tertiary);">9999px</div>
        </div>
      </div>
    </div>
  </div>
</div>

`LumenRadii` constants for border radius:

| Token | Value | Common Use |
|-------|-------|------------|
| `sm` | 4px | Badges, small elements |
| `md` | 6px | Buttons, inputs |
| `lg` | 8px | Cards, panels |
| `full` | 9999px | Pills, circular elements |

## Shadows

`LumenShadows` provides elevation levels:

| Level | Use |
|-------|-----|
| `sm` | Subtle depth for cards |
| `md` | Elevated cards, dropdowns |
| `lg` | Modals, floating panels |

## Animations

`LumenAnimations` defines curves and durations for consistent motion:

| Token | Value | Use |
|-------|-------|-----|
| `fast` | 150ms | Micro-interactions (hover, toggle) |
| `normal` | 250ms | Standard transitions |
| `slow` | 350ms | Panel slides, accordion expand |
| `curve` | easeInOut | Default animation curve |

## Accessing Theme in Components

Inside a component builder, the theme is passed as a parameter:

```dart
Widget _buildCard(LumenNode node, LumenThemeData theme, LumenRenderContext ctx) {
  return Container(
    padding: EdgeInsets.all(LumenSpacing.s4),
    decoration: BoxDecoration(
      color: theme.colors.card,
      borderRadius: BorderRadius.circular(LumenRadii.lg),
      border: Border.all(color: theme.colors.border),
    ),
    child: Text(
      node.stringProp('title'),
      style: theme.typography.headingLg.copyWith(
        color: theme.colors.cardForeground,
      ),
    ),
  );
}
```

From the widget tree, access the theme via the `LumenTheme` inherited widget:

```dart
final theme = LumenTheme.maybeOf(context);
```

## Next Steps

- **[Rendering](/docs/lumen-ui/core-concepts/rendering/)** — how themes are applied during rendering
- **[Component Reference](/docs/lumen-ui/components/)** — see themed components in action
