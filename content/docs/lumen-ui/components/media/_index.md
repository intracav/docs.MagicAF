---
title: "Media"
description: "Components for displaying images, files, PDFs, and embedded HTML content."
weight: 6
tags: [lumen-ui, media, components]
categories: [component]
difficulty: beginner
estimated_reading_time: "2 min"
last_reviewed: "2026-03-17"
---

Media components handle visual and file-based content within Lumen UI artifacts. Use them to display diagnostic images, attach downloadable files, embed PDF documents, or render external HTML previews. They are commonly composed inside layout components like `Card` or `Grid` to build clinical reports and patient-facing summaries.

## Component Showcase

<div class="lumen-demo">
<div class="lumen-demo__label">Interactive Showcase</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">Media Components</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-16">

<!-- Image mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">Image</div>
<div class="lm-image">
<div class="lm-image__placeholder" style="border-radius:8px; height:80px; display:flex; align-items:center; justify-content:center;">
<span style="font-size:24px; opacity:0.3;">&#128444;</span>
</div>
<div class="lm-image__caption">Chest X-Ray &mdash; PA view</div>
</div>
</div>

<!-- ImageGallery mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">ImageGallery</div>
<div class="lm-image-gallery lm-image-gallery--3">
<div class="lm-image-gallery__item"><div class="lm-image__placeholder" style="height:60px; display:flex; align-items:center; justify-content:center;"><span style="font-size:16px; opacity:0.3;">&#128444;</span></div></div>
<div class="lm-image-gallery__item"><div class="lm-image__placeholder" style="height:60px; display:flex; align-items:center; justify-content:center;"><span style="font-size:16px; opacity:0.3;">&#128444;</span></div></div>
<div class="lm-image-gallery__item"><div class="lm-image__placeholder" style="height:60px; display:flex; align-items:center; justify-content:center;"><span style="font-size:16px; opacity:0.3;">&#128444;</span></div></div>
</div>
</div>

<!-- FileCard mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">FileCard</div>
<div class="lm-file-card">
<div class="lm-file-card__icon" style="color:#DA373C;">&#128196;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">lab_results.pdf</div>
<div class="lm-file-card__meta">PDF &middot; 2.4 MB</div>
</div>
</div>
</div>

<!-- PdfViewer mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">PdfViewer</div>
<div class="lm-pdf-viewer">
<div class="lm-pdf-viewer__toolbar">
<span style="font-size:14px; color:#DA373C;">&#128196;</span>
<span style="font-weight:600; font-size:12px; flex:1;">Discharge Summary</span>
<span class="lm-badge lm-badge--default" style="font-size:10px;">3 pages</span>
</div>
</div>
</div>

<!-- HtmlEmbed mini -->
<div>
<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:6px;">HtmlEmbed</div>
<div class="lm-html-embed">
<div class="lm-html-embed__header">
<span class="lm-html-embed__globe">&#127760;</span>
<span class="lm-html-embed__url">portal.example.com</span>
</div>
</div>
</div>

</div>
</div>
</div>
</div>

---

<div class="card-grid">
<div class="card">

### [Image →](/docs/lumen-ui/components/media/image/)
Single image display with optional caption and rounded corners.

</div>
<div class="card">

### [ImageGallery →](/docs/lumen-ui/components/media/image-gallery/)
Responsive grid of images with configurable column count and spacing.

</div>
<div class="card">

### [FileCard →](/docs/lumen-ui/components/media/file-card/)
File attachment card showing name, type, size, and download link.

</div>
<div class="card">

### [PdfViewer →](/docs/lumen-ui/components/media/pdf-viewer/)
PDF document display card with title and page count metadata.

</div>
<div class="card">

### [HtmlEmbed →](/docs/lumen-ui/components/media/html-embed/)
HTML content preview card for rendering external pages or inline HTML safely.

</div>
</div>
