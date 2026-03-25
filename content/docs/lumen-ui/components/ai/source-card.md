---
title: "SourceCard"
description: "Citation card displaying a source document with title, snippet, and relevance score."
weight: 5
tags: [lumen-ui, source-card, ai]
categories: [component]
difficulty: beginner
estimated_reading_time: "3 min"
last_reviewed: "2026-03-17"
---

The `SourceCard` component renders a citation reference for a document the agent used to inform its response. It displays the document title, a text snippet, the source name, a relevance score, and an optional link. Use it to provide transparency and verifiability for agent-generated clinical information.

## Props

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | *required* | Title of the source document. |
| `url` | `string` | — | URL to the full source document. Makes the card tappable. |
| `snippet` | `string` | — | Excerpt from the source document, typically the most relevant passage. |
| `source` | `string` | — | Name or type of the source (e.g., `"PubMed"`, `"AHA"`, `"UpToDate"`). |
| `score` | `number` | — | Relevance score from 0 to 1. Displayed as a visual indicator. |

## DSL Example

```
SourceCard(
  title="ACC/AHA Hypertension Guidelines 2024",
  url="https://www.ahajournals.org/...",
  source="AHA",
  score=0.95,
  snippet="For patients with confirmed hypertension and cardiovascular risk..."
)
```

## JSON Example

```json
{
  "type": "source_card",
  "props": {
    "title": "ACC/AHA Hypertension Guidelines 2024",
    "url": "https://www.ahajournals.org/guidelines/hypertension-2024",
    "source": "AHA",
    "score": 0.95,
    "snippet": "For patients with confirmed hypertension and cardiovascular risk factors, initial therapy with an ACE inhibitor or ARB is recommended."
  }
}
```

## Composition

Source cards grouped in a sources section below an agent response:

```
Stack(direction="vertical", gap=12,
  Markdown(content="Current guidelines recommend initiating ACE inhibitor therapy for patients with hypertension and diabetes, targeting a blood pressure below 130/80 mmHg."),
  Section(title="Sources", collapsible=true,
    Stack(direction="vertical", gap=8,
      SourceCard(
        title="ACC/AHA Hypertension Guidelines 2024",
        source="AHA",
        score=0.95,
        snippet="For patients with diabetes, a BP target of <130/80 mmHg is recommended.",
        url="https://www.ahajournals.org/..."
      ),
      SourceCard(
        title="ADA Standards of Care 2025",
        source="ADA",
        score=0.88,
        snippet="ACE inhibitors are first-line antihypertensive agents in patients with diabetes and albuminuria.",
        url="https://diabetesjournals.org/..."
      ),
      SourceCard(
        title="JNC 8 Evidence Review",
        source="JAMA",
        score=0.72,
        snippet="In the general population aged ≥60 years, initiate treatment at SBP ≥150 mmHg."
      )
    )
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
<span class="lumen-demo__bar-title">Source Cards</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-8">

<div class="lm-source-card">
<div class="lm-source-card__content">
<div class="lm-source-card__title">ACC/AHA Hypertension Guidelines 2024</div>
<div class="lm-source-card__snippet">For patients with confirmed hypertension and cardiovascular risk factors, initial therapy with an ACE inhibitor or ARB is recommended.</div>
<div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
<span class="lm-source-card__source">AHA</span>
<span class="lm-source-card__relevance">95%</span>
</div>
</div>
</div>

<div class="lm-source-card">
<div class="lm-source-card__content">
<div class="lm-source-card__title">ADA Standards of Care 2025</div>
<div class="lm-source-card__snippet">ACE inhibitors are first-line antihypertensive agents in patients with diabetes and albuminuria.</div>
<div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
<span class="lm-source-card__source">ADA</span>
<span class="lm-source-card__relevance">88%</span>
</div>
</div>
</div>

<div class="lm-source-card">
<div class="lm-source-card__content">
<div class="lm-source-card__title">JNC 8 Evidence Review</div>
<div class="lm-source-card__snippet">In the general population aged &ge;60 years, initiate treatment at SBP &ge;150 mmHg.</div>
<div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
<span class="lm-source-card__source">JAMA</span>
<span class="lm-source-card__relevance">72%</span>
</div>
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
<span class="lumen-demo__bar-title">Agent Response with Sources</span>
</div>
<div class="lumen-demo__content lm">
<div class="lm-stack lm-stack--vertical lm-stack--gap-12">

<div style="font-size:13px; color:var(--text-primary); line-height:1.6;">Current guidelines recommend initiating ACE inhibitor therapy for patients with hypertension and diabetes, targeting a blood pressure below 130/80 mmHg.</div>

<div style="font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-tertiary); margin-bottom:-4px;">Sources</div>

<div class="lm-source-card">
<div class="lm-source-card__content">
<div class="lm-source-card__title">ACC/AHA Hypertension Guidelines 2024</div>
<div class="lm-source-card__snippet">For patients with diabetes, a BP target of &lt;130/80 mmHg is recommended.</div>
<div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
<span class="lm-source-card__source">AHA</span>
<span class="lm-source-card__relevance">95%</span>
</div>
</div>
</div>

<div class="lm-source-card">
<div class="lm-source-card__content">
<div class="lm-source-card__title">ADA Standards of Care 2025</div>
<div class="lm-source-card__snippet">ACE inhibitors are first-line antihypertensive agents in patients with diabetes and albuminuria.</div>
<div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
<span class="lm-source-card__source">ADA</span>
<span class="lm-source-card__relevance">88%</span>
</div>
</div>
</div>

</div>
</div>
</div>
</div>

## Notes

- **Relevance score**: The `score` prop (0-1) is rendered as a percentage badge or bar indicator. Higher scores appear more prominently. Omit it if relevance scoring is not applicable.
- **Snippet truncation**: Long snippets are truncated with an ellipsis after a few lines. The full snippet is visible on expansion or when navigating to the source URL.
- **Source badge**: The `source` prop renders as a colored badge next to the title, helping users quickly identify the origin (e.g., PubMed, institutional knowledge base, clinical guidelines).
- **URL behavior**: When `url` is provided, tapping the card opens the source in a new browser tab. Without a URL, the card is display-only.
- **RAG integration**: Source cards are typically generated from the retrieval step of a RAG pipeline. The `score` maps to the similarity/relevance score from vector search.
