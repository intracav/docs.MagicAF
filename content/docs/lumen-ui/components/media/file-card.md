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

## Notes

- **Type icon**: The component maps common extensions and MIME types (`pdf`, `docx`, `xlsx`, `csv`, `png`, `jpg`, `html`) to distinct icons. Unrecognized types fall back to a generic file icon.
- **No URL**: If `url` is omitted, the card renders as a non-interactive display-only attachment reference.
- **Size formatting**: The `size` prop is displayed as-is. The component does not perform byte-to-human conversion — provide a pre-formatted string.
- **Name truncation**: Long file names are truncated with an ellipsis to prevent layout overflow.
