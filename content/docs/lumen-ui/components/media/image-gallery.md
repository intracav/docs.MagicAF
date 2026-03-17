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

## Notes

- **Responsive behavior**: On narrow viewports, the grid may reduce its column count to avoid overly small images. The `columns` prop sets the maximum.
- **Image objects**: Each object in the `images` array follows the same property names as the `Image` component (`src`, `alt`, `caption`), but only `src` is required.
- **Empty state**: If the `images` array is empty, the component renders nothing.
- **Ordering**: Images render in array order, filling rows left to right.
