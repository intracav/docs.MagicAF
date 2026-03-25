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

## Interactive Preview

<div class="lumen-demo">
<div class="lumen-demo__label">Live Preview</div>
<div class="lumen-demo__frame">
<div class="lumen-demo__bar">
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__dot"></span>
<span class="lumen-demo__bar-title">HTML Embed</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-html-embed">
<div class="lm-html-embed__header">
<span class="lm-html-embed__globe">&#127760;</span>
<span class="lm-html-embed__url">portal.example.com/patient/123</span>
</div>
<div class="lm-html-embed__body">
<div style="padding:16px;">
<div style="font-size:15px; font-weight:700; margin-bottom:8px; color:var(--text-primary);">Patient Portal</div>
<div style="font-size:13px; color:var(--text-secondary);">Access patient records, lab results, and appointment scheduling through the secure portal.</div>
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
<span class="lumen-demo__bar-title">Insurance Response</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-card">
<div class="lm-card__header"><div class="lm-card__title">Insurance Response</div></div>
<div class="lm-card__body">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div class="lm-html-embed">
<div class="lm-html-embed__header">
<span class="lm-html-embed__globe">&#127760;</span>
<span class="lm-html-embed__url">Coverage Determination Letter</span>
</div>
<div class="lm-html-embed__body">
<div style="padding:14px;">
<div style="font-size:15px; font-weight:700; margin-bottom:6px; color:#3BA55C;">Approved</div>
<div style="font-size:13px; color:var(--text-secondary);">Prior authorization for CPT 72148 has been approved effective 2026-03-21.</div>
</div>
</div>
</div>

<hr style="border:none; border-top:1px solid var(--border); margin:0;">

<div class="lm-stack lm-stack--horizontal lm-stack--gap-8">
<div class="lm-file-card" style="flex:1;">
<div class="lm-file-card__icon" style="color:#DA373C;">&#128196;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">auth_letter.pdf</div>
<div class="lm-file-card__meta">PDF &middot; 180 KB</div>
</div>
</div>
<div class="lm-file-card" style="flex:1;">
<div class="lm-file-card__icon" style="color:#DA373C;">&#128196;</div>
<div class="lm-file-card__info">
<div class="lm-file-card__name">clinical_notes.pdf</div>
<div class="lm-file-card__meta">PDF &middot; 420 KB</div>
</div>
</div>
</div>

</div>
</div>
</div>
</div>
</div>
</div>

## Notes

- **Security**: Inline HTML in `content` is sanitized before rendering. Script tags, event handlers, and other potentially dangerous elements are stripped. The component is not suitable for arbitrary JavaScript execution.
- **URL behavior**: When `url` is provided, the card displays a link indicator. Tapping opens the URL in a new browser tab.
- **Fallback**: If neither `url` nor `content` is provided, the component renders a placeholder card with the title only.
- **Styling**: Inline HTML content inherits Lumen UI's typography and color theme. Custom CSS in the `content` string is ignored.
