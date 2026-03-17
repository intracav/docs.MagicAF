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

## Notes

- **Relevance score**: The `score` prop (0-1) is rendered as a percentage badge or bar indicator. Higher scores appear more prominently. Omit it if relevance scoring is not applicable.
- **Snippet truncation**: Long snippets are truncated with an ellipsis after a few lines. The full snippet is visible on expansion or when navigating to the source URL.
- **Source badge**: The `source` prop renders as a colored badge next to the title, helping users quickly identify the origin (e.g., PubMed, institutional knowledge base, clinical guidelines).
- **URL behavior**: When `url` is provided, tapping the card opens the source in a new browser tab. Without a URL, the card is display-only.
- **RAG integration**: Source cards are typically generated from the retrieval step of a RAG pipeline. The `score` maps to the similarity/relevance score from vector search.
