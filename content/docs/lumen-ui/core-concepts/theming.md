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

### Dark Palette (Default)

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

## Chart Colors

`LumenChartColors` provides an indexed palette of 8 colors for chart data series. Access by index — the palette wraps around for series beyond 8:

```dart
theme.chartColors[0]  // First series color
theme.chartColors[1]  // Second series color
theme.chartColors[7]  // Eighth series color
theme.chartColors[8]  // Wraps to first color
```

The palette is designed for accessibility — colors are distinguishable in both light and dark modes and remain identifiable for users with common color vision deficiencies.

## Spacing

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
