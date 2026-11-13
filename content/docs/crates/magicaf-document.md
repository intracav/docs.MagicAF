---
title: "magicaf-document"
description: "Document understanding for retrieval: native PDF text extraction, clients for self-hosted layout and OCR sidecars, a pluggable image captioner, and a structure-aware chunker."
weight: 51
keywords: [magicaf-document, PDF extraction, OCR, Tesseract, Marker PDF, document chunking, RAG ingestion]
---

{{< crate-header "magicaf-document" >}}

Getting documents into a retrieval system well comes down to three steps: pull the text out faithfully, recover what plain extraction loses (tables, figures, scanned pages), and cut the result into chunks that keep their context. `magicaf-document` covers each step and runs entirely on infrastructure you host — unless you choose to enable the external captioner.

## Example

```rust
use magicaf_document::{chunk_text_contextual, describe_image, extract_text_from_bytes, ChunkConfig, NoVisionCaptioner, VisionDocService};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let pdf: Vec<u8> = std::fs::read("policy.pdf")?;
    // 1. Fast path: vector PDF, no sidecar.
    let text = extract_text_from_bytes(&pdf)?;
    // 2. Layout-aware path via the Marker sidecar (None when URL empty).
    if let Some(svc) = VisionDocService::new("http://localhost:3009", 120) {
        svc.health().await?;
        let doc = svc.convert_pdf(&pdf).await?;
        println!("{} pages, {} tables", doc.pages.len(), doc.tables.len());
    }
    // 3. Chunk for RAG.
    let cfg = ChunkConfig::default();
    let chunks = chunk_text_contextual(&text, "Policy", cfg.target_chars, cfg.overlap_chars);
    for c in &chunks { println!("[{}/{}] {}", c.index + 1, c.total, c.section); }
    // OCR an image via the Tesseract sidecar; captioner off.
    let img = std::fs::read("scan.png")?;
    let d = describe_image(&img, "png", "http://localhost:3007", 30, &NoVisionCaptioner).await;
    println!("ocr: {} (empty={})", d.ocr_text, d.is_empty());
    Ok(())
}
```

## Extraction paths

| Path | Use it for | Needs |
|---|---|---|
| `extract_text_from_bytes` / `extract_text_from_path` | PDFs with a text layer — fast, in-process | Nothing |
| `VisionDocService::convert_pdf` | Layout: tables, figures, reading order, page markdown | The vision sidecar (Marker), default port 3009 |
| `describe_image` | Scanned pages and images | The OCR sidecar (Tesseract), default port 3007; optionally a captioner |

`VisionDocService::new(url, timeout_secs)` returns `None` for an empty URL, so a deployment without the sidecar simply skips that path. Timeouts are clamped to at least 15 seconds, and documents whose figures exceed 80 MB in total are rejected. `describe_image` never fails; it returns whatever OCR and captioning produced.

## Chunking

`chunk_text_contextual(text, doc_title, target_chars, overlap_chars)` splits on structure (headings, paragraphs, sentences) before size, and returns `ContextualChunk`s that carry the section heading, document title, position, and — with the `_with_pages` variant — the page range. The defaults (`ChunkConfig::default()`) are 1024 characters with 128 of overlap.

Embed `chunk.text` (which includes the title and section as context) and display `chunk.raw_text`.

## The sidecars

Dockerfiles for both live in the repository's `docker/` directory.

| Sidecar | Port | Limits (environment) | Memory |
|---|---|---|---|
| vision (marker-pdf 1.2.7) | 3009 | `VISION_MAX_BYTES` 60 MB, `VISION_MAX_PAGES` 200 | 1.5–3 GB |
| ocr (Tesseract) | 3007 | `OCR_MAX_BYTES` 20 MB, `OCR_LANG` | 150–300 MB |

## Image captions

`VisionCaptioner` is a trait: `caption(image_bytes, mime) -> String`. `NoVisionCaptioner` returns nothing. The `anthropic` feature adds `AnthropicCaptioner`, which sends images to Anthropic's API — do not enable it where documents must stay inside the network.

## Related

- [`magicaf-fetch`](/docs/crates/magicaf-fetch/) — getting documents from the web
- [The RAG pipeline](/docs/core-concepts/rag-pipeline/) — what happens to chunks after indexing
