---
title: "LumenThemeData"
description: "API reference for LumenThemeData — the theme data structure with colors, typography, chart palettes, and factory constructors."
weight: 5
tags: [lumen-ui, api, theme, colors, typography]
categories: [api-reference]
difficulty: intermediate
estimated_reading_time: "5 min"
last_reviewed: "2026-03-17"
---

`LumenThemeData` is the composite theme object that controls the visual appearance of all Lumen UI components.

**Source:** `packages/lumen_ui/lib/src/core/theme/lumen_theme_data.dart`

## Constructor

```dart
LumenThemeData({
  required Brightness brightness,
  required LumenColors colors,
  required LumenTypography typography,
  required LumenChartColors chartColors,
})
```

## Factory Constructors

### `dark`

```dart
factory LumenThemeData.dark()
```

Creates a dark theme with the Discord-inspired color palette. This is the default theme.

### `light`

```dart
factory LumenThemeData.light()
```

Creates a light theme with high-contrast colors on a white background.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `brightness` | `Brightness` | `Brightness.dark` or `Brightness.light` |
| `colors` | `LumenColors` | 23 semantic color tokens |
| `typography` | `LumenTypography` | 8 text styles |
| `chartColors` | `LumenChartColors` | Indexed color palette for charts |

## LumenColors

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__label">Dark Theme Palette</div>
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px;">
        <div style="text-align: center;">
          <div style="width: 100%; height: 36px; border-radius: 6px; background: #5865F2; margin-bottom: 4px;"></div>
          <div style="font-size: 10px; font-weight: 600; color: var(--text-tertiary);">primary</div>
          <div style="font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono);">#5865F2</div>
        </div>
        <div style="text-align: center;">
          <div style="width: 100%; height: 36px; border-radius: 6px; background: #313338; border: 1px solid var(--border); margin-bottom: 4px;"></div>
          <div style="font-size: 10px; font-weight: 600; color: var(--text-tertiary);">background</div>
          <div style="font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono);">#313338</div>
        </div>
        <div style="text-align: center;">
          <div style="width: 100%; height: 36px; border-radius: 6px; background: #2B2D31; border: 1px solid var(--border); margin-bottom: 4px;"></div>
          <div style="font-size: 10px; font-weight: 600; color: var(--text-tertiary);">card</div>
          <div style="font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono);">#2B2D31</div>
        </div>
        <div style="text-align: center;">
          <div style="width: 100%; height: 36px; border-radius: 6px; background: #DA373C; margin-bottom: 4px;"></div>
          <div style="font-size: 10px; font-weight: 600; color: var(--text-tertiary);">destructive</div>
          <div style="font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono);">#DA373C</div>
        </div>
        <div style="text-align: center;">
          <div style="width: 100%; height: 36px; border-radius: 6px; background: #3BA55C; margin-bottom: 4px;"></div>
          <div style="font-size: 10px; font-weight: 600; color: var(--text-tertiary);">success</div>
          <div style="font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono);">#3BA55C</div>
        </div>
        <div style="text-align: center;">
          <div style="width: 100%; height: 36px; border-radius: 6px; background: #F5A623; margin-bottom: 4px;"></div>
          <div style="font-size: 10px; font-weight: 600; color: var(--text-tertiary);">warning</div>
          <div style="font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono);">#F5A623</div>
        </div>
      </div>
    </div>
  </div>
</div>

23 semantic color tokens used by all components:

| Token | Dark Value | Purpose |
|-------|-----------|---------|
| `primary` | `#5865F2` | Primary actions, links |
| `primaryForeground` | `#FFFFFF` | Text on primary |
| `background` | `#313338` | Page background |
| `foreground` | `#F2F3F5` | Primary text |
| `card` | `#2B2D31` | Card backgrounds |
| `cardForeground` | `#F2F3F5` | Text on cards |
| `muted` | `#2B2D31` | Subdued backgrounds |
| `mutedForeground` | `#B5BAC1` | Secondary text |
| `accent` | `#404249` | Hover/emphasis |
| `accentForeground` | `#F2F3F5` | Text on accent |
| `border` | `#1E1F22` | Borders, dividers |
| `input` | `#1E1F22` | Input borders |
| `ring` | `#5865F2` | Focus rings |
| `destructive` | Red | Errors, destructive actions |
| `destructiveForeground` | White | Text on destructive |
| `warning` | Amber | Warning states |
| `warningForeground` | White | Text on warning |
| `success` | Green | Success, positive |
| `successForeground` | White | Text on success |
| `info` | Blue | Informational |
| `infoForeground` | White | Text on info |
| `secondary` | — | Secondary actions |
| `secondaryForeground` | — | Text on secondary |

## LumenTypography

8 text styles:

| Style | Use |
|-------|-----|
| `headingXl` | Large headings, hero stat values |
| `headingLg` | Section headings, card titles |
| `bodySmMedium` | Emphasized body text, labels |
| `bodySm` | Standard body text |
| `caption` | Metadata, timestamps (medium weight) |
| `captionRegular` | Same size, regular weight |
| `code` | Monospaced code content |
| `buttonSm` | Button labels |

## LumenChartColors

<div class="lumen-demo lumen-demo--compact">
  <div class="lumen-demo__frame">
    <div class="lumen-demo__content lm">
      <div style="display: flex; gap: 6px; align-items: flex-end;">
        <div style="flex: 1; text-align: center;">
          <div style="height: 40px; border-radius: 4px 4px 0 0; background: #5865F2;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[0]</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 36px; border-radius: 4px 4px 0 0; background: #3BA55C;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[1]</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 32px; border-radius: 4px 4px 0 0; background: #FAA61A;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[2]</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 28px; border-radius: 4px 4px 0 0; background: #ED4245;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[3]</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 24px; border-radius: 4px 4px 0 0; background: #9B59B6;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[4]</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 20px; border-radius: 4px 4px 0 0; background: #E91E63;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[5]</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 16px; border-radius: 4px 4px 0 0; background: #11806A;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[6]</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="height: 12px; border-radius: 4px 4px 0 0; background: #E67E22;"></div>
          <div style="font-size: 10px; color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-mono);">[7]</div>
        </div>
      </div>
    </div>
  </div>
</div>

Indexed palette of 8 colors for chart data series:

```dart
theme.chartColors[0]  // First series
theme.chartColors[1]  // Second series
// ... wraps at index 8
```

## LumenTheme (InheritedWidget)

Access the theme from the widget tree:

```dart
final theme = LumenTheme.maybeOf(context);
```

`LumenRenderer` places a `LumenTheme` inherited widget in the tree, so all descendant components can access it.

## Supporting Constants

### LumenSpacing

| Token | Value |
|-------|-------|
| `s1` | 4.0 |
| `s2` | 8.0 |
| `s3` | 12.0 |
| `s4` | 16.0 |
| `s6` | 24.0 |
| `s8` | 32.0 |

### LumenRadii

| Token | Value |
|-------|-------|
| `sm` | 4.0 |
| `md` | 6.0 |
| `lg` | 8.0 |
| `full` | 9999.0 |

### LumenShadows

| Level | Use |
|-------|-----|
| `sm` | Cards |
| `md` | Elevated cards, dropdowns |
| `lg` | Modals, panels |

### LumenAnimations

| Token | Value |
|-------|-------|
| `fast` | 150ms |
| `normal` | 250ms |
| `slow` | 350ms |
| `curve` | easeInOut |

## See Also

- **[Theming](/docs/lumen-ui/core-concepts/theming/)** — theming concepts and usage
- **[LumenRenderer](/docs/lumen-ui/api-reference/lumen-renderer/)** — how theme is resolved
