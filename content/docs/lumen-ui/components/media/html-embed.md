---
title: "HtmlEmbed"
description: "HTML content preview card for rendering external pages or inline HTML safely."
weight: 5
tags: [lumen-ui, html-embed, media]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `HtmlEmbed` component displays a preview card for HTML content. It can reference an external URL or contain inline HTML. For security, inline HTML is rendered as a sanitized preview rather than raw injection. Use it for patient portal links, generated reports, or external web content references.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | — | Display title for the embedded content. |
| `url` | `string` | — | URL of the external HTML page. When provided, the card links to this URL. |
| `content` | `string` | — | Inline HTML content string. Rendered as a sanitized preview. |

At least one of `url` or `content` should be provided. If both are present, `url` takes precedence as the primary link target, and `content` is used for the preview body.

## DSL Example

```
HtmlEmbed(
  title="Patient Portal",
  url="https://portal.example.com/patient/123"
)
```

## JSON Example

```json
{
  "type": "html_embed",
  "props": {
    "title": "Patient Portal",
    "url": "https://portal.example.com/patient/123"
  }
}
```

With inline content:

```json
{
  "type": "html_embed",
  "props": {
    "title": "Coverage Determination Letter",
    "content": "<h2>Notice of Coverage</h2><p>Your request for <strong>MRI Lumbar Spine</strong> has been approved...</p>"
  }
}
```

## Composition

An HTML embed alongside source documents:

```
Card(title="Insurance Response",
  HtmlEmbed(
    title="Coverage Determination Letter",
    content="<h2>Approved</h2><p>Prior authorization for CPT 72148 has been approved effective 2026-03-17.</p>"
  ),
  Separator(),
  Stack(direction="horizontal", gap=8,
    FileCard(name="auth_letter.pdf", type="pdf", size="180 KB", url="/docs/auth.pdf"),
    FileCard(name="clinical_notes.pdf", type="pdf", size="420 KB", url="/docs/notes.pdf")
  )
)
```

## Notes

- **Security**: Inline HTML in `content` is sanitized before rendering. Script tags, event handlers, and other potentially dangerous elements are stripped. The component is not suitable for arbitrary JavaScript execution.
- **URL behavior**: When `url` is provided, the card displays a link indicator. Tapping opens the URL in a new browser tab.
- **Fallback**: If neither `url` nor `content` is provided, the component renders a placeholder card with the title only.
- **Styling**: Inline HTML content inherits Lumen UI's typography and color theme. Custom CSS in the `content` string is ignored.
