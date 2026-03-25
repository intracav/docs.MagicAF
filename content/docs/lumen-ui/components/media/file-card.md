---
title: "FileCard"
description: "File attachment card showing name, type, size, and download link."
weight: 3
tags: [lumen-ui, file-card, media]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `FileCard` component renders a compact card representing a file attachment. It displays the file name, type icon, human-readable size, and an optional download URL. Use it for lab reports, discharge summaries, consent forms, or any downloadable document reference.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | *required* | File name to display (e.g., `"lab_results.pdf"`). |
| `type` | `string` | — | MIME type or file extension (e.g., `"pdf"`, `"application/pdf"`, `"xlsx"`). Drives the file-type icon. |
| `size` | `string` | — | Human-readable file size (e.g., `"2.4 MB"`). |
| `url` | `string` | — | Download URL. When provided, the card is tappable and opens the file. |

## DSL Example

```
FileCard(
  name="lab_results.pdf",
  type="pdf",
  size="2.4 MB",
  url="/files/lab_results.pdf"
)
```

## JSON Example

```json
{
  "type": "file_card",
  "props": {
    "name": "lab_results.pdf",
    "type": "pdf",
    "size": "2.4 MB",
    "url": "/files/lab_results.pdf"
  }
}
```

## Composition

Multiple file attachments in a card:

```
Card(title="Visit Documents",
  Stack(direction="vertical", gap=8,
    FileCard(name="History_and_Physical.pdf", type="pdf", size="1.2 MB", url="/docs/hp.pdf"),
    FileCard(name="Lab_Panel_CBC.xlsx", type="xlsx", size="340 KB", url="/docs/cbc.xlsx"),
    FileCard(name="EKG_Tracing.png", type="png", size="890 KB", url="/docs/ekg.png")
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
<span class="lumen-demo__bar-title">File Cards</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">

<div class="lm-file-card">
<div class="lm-file-card__icon" style="color:#DA373C;">&#128196;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">lab_results.pdf</div>
<div class="lm-file-card__meta">PDF &middot; 2.4 MB</div>
</div>
</div>

<div class="lm-file-card">
<div class="lm-file-card__icon" style="color:#3BA55C;">&#128196;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">Lab_Panel_CBC.xlsx</div>
<div class="lm-file-card__meta">XLSX &middot; 340 KB</div>
</div>
</div>

<div class="lm-file-card">
<div class="lm-file-card__icon" style="color:#5865F2;">&#128444;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">EKG_Tracing.png</div>
<div class="lm-file-card__meta">PNG &middot; 890 KB</div>
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
<span class="lumen-demo__bar-title">Visit Documents</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Visit Documents</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">
<div class="lm-file-card">
<div class="lm-file-card__icon" style="color:#DA373C;">&#128196;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">History_and_Physical.pdf</div>
<div class="lm-file-card__meta">PDF &middot; 1.2 MB</div>
</div>
</div>
<div class="lm-file-card">
<div class="lm-file-card__icon" style="color:#3BA55C;">&#128196;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">Lab_Panel_CBC.xlsx</div>
<div class="lm-file-card__meta">XLSX &middot; 340 KB</div>
</div>
</div>
<div class="lm-file-card">
<div class="lm-file-card__icon" style="color:#5865F2;">&#128444;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">EKG_Tracing.png</div>
<div class="lm-file-card__meta">PNG &middot; 890 KB</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- **Type icon**: The component maps common extensions and MIME types (`pdf`, `docx`, `xlsx`, `csv`, `png`, `jpg`, `html`) to distinct icons. Unrecognized types fall back to a generic file icon.
- **No URL**: If `url` is omitted, the card renders as a non-interactive display-only attachment reference.
- **Size formatting**: The `size` prop is displayed as-is. The component does not perform byte-to-human conversion — provide a pre-formatted string.
- **Name truncation**: Long file names are truncated with an ellipsis to prevent layout overflow.
