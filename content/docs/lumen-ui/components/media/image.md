---
title: "Image"
description: "Single image display with optional caption, sizing controls, and rounded corners."
weight: 1
tags: [lumen-ui, image, media]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `Image` component renders a single image from a URL with optional caption text, explicit dimensions, and rounded corners. Use it to display diagnostic images, photos, charts, or any visual content within an artifact.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | `string` | *required* | URL of the image to display. |
| `alt` | `string` | — | Accessibility text describing the image content. |
| `caption` | `string` | — | Optional text displayed below the image. |
| `width` | `number` | — | Explicit width in logical pixels. If omitted, the image fills available width. |
| `height` | `number` | — | Explicit height in logical pixels. |
| `rounded` | `bool` | `false` | Apply rounded corners to the image. |

## DSL Example

```
Image(
  src="https://example.com/xray.png",
  alt="Chest X-Ray",
  caption="PA view, 2026-03-17",
  rounded=true
)
```

## JSON Example

```json
{
  "type": "image",
  "props": {
    "src": "https://example.com/xray.png",
    "alt": "Chest X-Ray",
    "caption": "PA view, 2026-03-17",
    "rounded": true
  }
}
```

## Composition

An `Image` inside a `Card` with a descriptive header:

```
Card(title="Radiology", description="Chest X-Ray — AP View",
  Image(
    src="https://imaging.example.com/chest_ap.png",
    alt="AP chest radiograph showing clear lung fields",
    caption="No acute cardiopulmonary process identified",
    rounded=true
  )
)
```

## Notes

- **Aspect ratio**: When only `width` or `height` is specified (not both), the image scales proportionally to maintain its intrinsic aspect ratio.
- **Loading**: Images display a placeholder shimmer while the network image loads.
- **Caption placement**: The caption renders directly below the image in muted secondary text. It is not rendered if omitted.
- **Accessibility**: Always provide an `alt` value for clinical images. Screen readers rely on it, and it appears as fallback text if the image fails to load.
