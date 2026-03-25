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

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Image Component</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Radiology</div><div class="lm-card__description">Chest X-Ray &mdash; AP View</div></div>
<div class="lm-card__body">
<div class="lm-image">
<div class="lm-image__placeholder" style="border-radius:8px; height:180px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:8px;">
<span style="font-size:36px; opacity:0.3;">&#128444;</span>
<span style="font-size:12px; color:var(--text-tertiary); font-weight:500;">chest_ap.png</span>
</div>
<div class="lm-image__caption">No acute cardiopulmonary process identified</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Composition Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Composition Demo</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Radiology Report</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Radiology</div><div class="lm-card__description">Chest X-Ray &mdash; AP View</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">
<div class="lm-image">
<div class="lm-image__placeholder" style="border-radius:8px; height:160px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:8px;">
<span style="font-size:32px; opacity:0.3;">&#128444;</span>
<span style="font-size:11px; color:var(--text-tertiary);">AP chest radiograph</span>
</div>
<div class="lm-image__caption">PA view, 2026-03-21</div>
</div>
<div style="font-size:13px; color:var(--text-secondary);"><strong>Impression:</strong> No acute cardiopulmonary process identified. Heart size normal. Lungs clear bilaterally.</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- **Aspect ratio**: When only `width` or `height` is specified (not both), the image scales proportionally to maintain its intrinsic aspect ratio.
- **Loading**: Images display a placeholder shimmer while the network image loads.
- **Caption placement**: The caption renders directly below the image in muted secondary text. It is not rendered if omitted.
- **Accessibility**: Always provide an `alt` value for clinical images. Screen readers rely on it, and it appears as fallback text if the image fails to load.
