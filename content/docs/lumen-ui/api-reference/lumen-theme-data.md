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
