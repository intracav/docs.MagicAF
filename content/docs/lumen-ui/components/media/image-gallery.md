---
title: "ImageGallery"
description: "Responsive grid of images with configurable column count and spacing."
weight: 2
tags: [lumen-ui, image-gallery, media]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `ImageGallery` component displays multiple images in a responsive grid layout. Each image can include alt text and an optional caption. Use it for multi-view imaging studies, photo sets, or any collection of related visuals.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `images` | `array` | *required* | Array of image objects. Each element has `src` (string, required), `alt` (string, optional), and `caption` (string, optional). |
| `columns` | `number` | `3` | Number of columns in the grid. |
| `gap` | `number` | — | Spacing in logical pixels between grid items. |

## DSL Example

```
ImageGallery(
  images=[
    {src:"img1.png", alt:"AP view"},
    {src:"img2.png", alt:"Lateral view"}
  ],
  columns=2
)
```

## JSON Example

```json
{
  "type": "image_gallery",
  "props": {
    "images": [
      {"src": "img1.png", "alt": "AP view"},
      {"src": "img2.png", "alt": "Lateral view"},
      {"src": "img3.png", "alt": "Oblique view", "caption": "Right oblique"}
    ],
    "columns": 3,
    "gap": 12
  }
}
```

## Composition

A gallery inside a `Card` alongside clinical notes:

```
Card(title="Imaging Study — Knee MRI",
  ImageGallery(
    images=[
      {src:"/images/knee_sagittal.png", alt:"Sagittal view", caption:"Sagittal T2"},
      {src:"/images/knee_coronal.png", alt:"Coronal view", caption:"Coronal STIR"},
      {src:"/images/knee_axial.png", alt:"Axial view", caption:"Axial PD"}
    ],
    columns=3,
    gap=8
  ),
  Markdown(content="**Impression:** No evidence of meniscal tear. Mild joint effusion noted.")
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
<span class="lumen-demo__bar-title">Image Gallery</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-image-gallery lm-image-gallery--3">
<div class="lm-image-gallery__item">
<div class="lm-image__placeholder" style="height:100px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;">
<span style="font-size:24px; opacity:0.3;">&#128444;</span>
<span style="font-size:10px; color:var(--text-tertiary);">Sagittal T2</span>
</div>
</div>
<div class="lm-image-gallery__item">
<div class="lm-image__placeholder" style="height:100px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;">
<span style="font-size:24px; opacity:0.3;">&#128444;</span>
<span style="font-size:10px; color:var(--text-tertiary);">Coronal STIR</span>
</div>
</div>
<div class="lm-image-gallery__item">
<div class="lm-image__placeholder" style="height:100px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;">
<span style="font-size:24px; opacity:0.3;">&#128444;</span>
<span style="font-size:10px; color:var(--text-tertiary);">Axial PD</span>
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
<span class="lumen-demo__bar-title">Imaging Study &mdash; Knee MRI</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Imaging Study &mdash; Knee MRI</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">
<div class="lm-image-gallery lm-image-gallery--3">
<div class="lm-image-gallery__item">
<div class="lm-image__placeholder" style="height:90px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;">
<span style="font-size:20px; opacity:0.3;">&#128444;</span>
<span style="font-size:10px; color:var(--text-tertiary);">Sagittal T2</span>
</div>
</div>
<div class="lm-image-gallery__item">
<div class="lm-image__placeholder" style="height:90px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;">
<span style="font-size:20px; opacity:0.3;">&#128444;</span>
<span style="font-size:10px; color:var(--text-tertiary);">Coronal STIR</span>
</div>
</div>
<div class="lm-image-gallery__item">
<div class="lm-image__placeholder" style="height:90px; display:flex; align-items:center; justify-content:center; flex-direction:column; gap:4px;">
<span style="font-size:20px; opacity:0.3;">&#128444;</span>
<span style="font-size:10px; color:var(--text-tertiary);">Axial PD</span>
</div>
</div>
</div>
<div style="font-size:13px; color:var(--text-secondary);"><strong>Impression:</strong> No evidence of meniscal tear. Mild joint effusion noted.</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- **Responsive behavior**: On narrow viewports, the grid may reduce its column count to avoid overly small images. The `columns` prop sets the maximum.
- **Image objects**: Each object in the `images` array follows the same property names as the `Image` component (`src`, `alt`, `caption`), but only `src` is required.
- **Empty state**: If the `images` array is empty, the component renders nothing.
- **Ordering**: Images render in array order, filling rows left to right.
