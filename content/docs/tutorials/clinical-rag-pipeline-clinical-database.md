---
title: "Tutorial: Building a Clinical RAG Pipeline over The Clinical Database"
description: "Build a healthcare RAG pipeline that grounds answers in The Clinical Database — a citable, clinician-reviewed clinical corpus — with citations back to canonical URLs."
weight: 4
tags: [tutorial, rag, healthcare, clinical, citations, grounding, intermediate, vector-search]
categories: [tutorial]
difficulty: intermediate
prerequisites:
  - /docs/tutorials/your-first-rag-pipeline/
estimated_reading_time: "25 min"
last_reviewed: "2026-08-09"
---

{{< difficulty "intermediate" >}}

{{< prerequisites >}}
- You have completed [Tutorial: Your First RAG Pipeline](/docs/tutorials/your-first-rag-pipeline/)
- Local services are running (Qdrant, embedding server, LLM server) — see [Prerequisites](/docs/getting-started/prerequisites/)
- Your project has `reqwest`, `scraper`, and `serde` in `Cargo.toml` alongside the MagicAF crates
{{< /prerequisites >}}

## What You Will Build

By the end of this tutorial, you will have a RAG pipeline that:

1. Discovers every page of [The Clinical Database](https://clinical-database.com) through its machine-readable indexes
2. Fetches and cleans each page, keeping the canonical URL attached to every chunk
3. Embeds and indexes the corpus in a vector store
4. Retrieves and reranks evidence for a clinical question
5. Generates an answer that **cites the exact source pages it used**

This is the same shape of system that [Lumen](https://docs.intracav.ai), Intracav's production clinical AI, uses The Clinical Database for — if you want to see what a finished assistant built on this corpus looks like, start there. Here, you will build the retrieval core yourself.

## Why Ground a Clinical Assistant in a Citable Corpus

A general-purpose LLM asked a clinical question will produce a fluent answer whether or not it knows the answer. In most domains that is an annoyance. In a clinical setting it is a hazard: the reader often cannot tell a remembered guideline from an invented one.

Grounding changes the contract. Instead of asking the model what it remembers, you retrieve passages from a known corpus and ask the model to answer **using only those passages** — and to say which ones it used. That gives you three properties a bare LLM cannot provide:

- **Bounded claims.** The answer can only contain what the corpus contains.
- **Citations.** Every statement traces to a page a clinician can open and read.
- **Provenance.** The corpus is versioned and time-stamped, so you can say *what* the system knew and *when*.

None of this works if the corpus itself is unverifiable. Which is why the choice of corpus matters as much as the pipeline.

## The Corpus: What The Clinical Database Publishes

[The Clinical Database](https://clinical-database.com) is an open clinical reference site — a sister property of MagicAF in the Intracav ecosystem. It publishes clinician-reviewed reference content organized by clinical department:

| Section | Content |
|---------|---------|
| Vascular Access | PICC lines, central venous catheters, midlines, ports, CLABSI prevention, INS standards, procedures, patient education |
| Critical Care (ICU) | Sepsis, mechanical ventilation, sedation, AKI/RRT, nutrition, VAP, VTE prophylaxis, transfusion |
| Emergency Medicine (ED) | ACS, stroke, airway/RSI, trauma, cardiac arrest, toxicology |
| Oncology | Febrile neutropenia, cancer-associated thrombosis, extravasation, pain, immunotherapy adverse events |
| Infection Prevention | Guideline development and prevention programs |
| Education | Training modules and continuing-education content |

Content types span guidelines, guides, step-by-step procedures, policies, resources, and patient education. Every page is free to read, quote, and cite without registration.

What makes it unusually good as a RAG corpus is that it is **built to be machine-read**:

| Surface | URL | What it gives you |
|---------|-----|-------------------|
| LLM index | [`/llms.txt`](https://clinical-database.com/llms.txt) | Curated map of the site with descriptions — sections, key pages, citation policy |
| JSON search index | [`/index.json`](https://clinical-database.com/index.json) | Every page as JSON: `title`, `section`, `url`, `description`, content summary |
| Sitemap | [`/sitemap.xml`](https://clinical-database.com/sitemap.xml) | Complete URL list with last-modified dates |
| Per-section RSS | e.g. [`/vascular-access/index.xml`](https://clinical-database.com/vascular-access/index.xml) | Change feed per department — poll it to keep your index fresh |
| JSON-LD | in every page's `<head>` | `datePublished`, `dateModified`, and `author` for provenance |

Every page has a **stable canonical URL**, and the site's citation guidelines ask you to cite that URL and prefer `dateModified` over the published date. That is exactly the metadata a citing RAG pipeline needs — so we will carry it through every stage.

---

## Step 1 — Discover the Corpus

`index.json` is the easiest crawl manifest: one request returns every page with its title, section, and URL. Define the entry shape and fetch it:

```rust
use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
struct IndexEntry {
    title: String,
    section: String,
    url: String,          // site-relative, e.g. "/vascular-access/guides/clabsi-prevention/"
    description: String,
}

const BASE: &str = "https://clinical-database.com";

async fn discover() -> anyhow::Result<Vec<IndexEntry>> {
    let entries: Vec<IndexEntry> = reqwest::get(format!("{BASE}/index.json"))
        .await?
        .json()
        .await?;
    println!("Discovered {} pages", entries.len());
    Ok(entries)
}
```

**Why not scrape the site map by hand?** The JSON index is maintained by the site itself, so new pages appear in your pipeline without code changes. If you need last-modified dates for incremental re-indexing, cross-reference `sitemap.xml`, or subscribe to the per-section RSS feeds and re-ingest only what changed.

## Step 2 — Fetch Pages and Strip the Chrome

The index gives you summaries; for retrieval quality you want the full article body. Fetch each page and extract the main content, discarding navigation, headers, and footers:

```rust
use scraper::{Html, Selector};

async fn fetch_article(client: &reqwest::Client, entry: &IndexEntry)
    -> anyhow::Result<String>
{
    let html = client
        .get(format!("{BASE}{}", entry.url))
        .send().await?
        .text().await?;

    let doc = Html::parse_document(&html);
    // The article body lives in <main>; fall back to <article>
    let selector = Selector::parse("main, article").unwrap();

    let text = doc.select(&selector)
        .flat_map(|node| node.text())
        .collect::<Vec<_>>()
        .join(" ");

    // Collapse whitespace
    Ok(text.split_whitespace().collect::<Vec<_>>().join(" "))
}
```

Be a polite crawler: reuse one `reqwest::Client`, fetch sequentially or with a small concurrency limit, and set a descriptive `User-Agent`. The site's `robots.txt` and `/.well-known/ai.txt` explicitly allow AI retrieval, but that is not a license to hammer it.

## Step 3 — Chunk with Provenance Attached

Whole articles are too long to embed as single vectors — retrieval works best on passages of a few hundred words. The critical decision here is not the chunk size; it is that **every chunk keeps its source metadata**. A chunk that has lost its canonical URL can never be cited.

```rust
struct Chunk {
    text: String,
    title: String,
    section: String,
    canonical_url: String,
}

fn chunk_article(entry: &IndexEntry, body: &str, max_words: usize) -> Vec<Chunk> {
    let words: Vec<&str> = body.split_whitespace().collect();
    words
        .chunks(max_words)
        .map(|w| Chunk {
            text: w.join(" "),
            title: entry.title.clone(),
            section: entry.section.clone(),
            canonical_url: format!("{BASE}{}", entry.url),
        })
        .collect()
}
```

A `max_words` of 300–400 is a reasonable starting point for `bge-large-en-v1.5`. For production you would chunk on paragraph and heading boundaries instead of raw word counts — see [Tutorial: Custom Adapters](/docs/tutorials/custom-adapters/) for how domain-aware processing slots into MagicAF.

## Step 4 — Embed and Index

Now the MagicAF part. Configure the [EmbeddingService](/docs/api-reference/core/embedding-service/) and [VectorStore](/docs/api-reference/core/vector-store/) exactly as in your first pipeline:

```rust
use magicaf_core::prelude::*;
use magicaf_core::embeddings::{EmbeddingService, LocalEmbeddingService};
use magicaf_core::vector_store::VectorStore;
use magicaf_qdrant::QdrantVectorStore;

let embedder = LocalEmbeddingService::new(EmbeddingConfig {
    base_url: "http://localhost:8080".into(),
    model_name: "bge-large-en-v1.5".into(),
    batch_size: 32,
    timeout_secs: 30,
    api_key: None,
})?;

let store = QdrantVectorStore::new(VectorStoreConfig {
    base_url: "http://localhost:6333".into(),
    api_key: None,
    timeout_secs: 30,
}).await?;

let collection = "clinical_database";
store.ensure_collection(collection, 1024).await?;
```

Then embed each batch of chunks and index them with the provenance carried in the payload:

```rust
async fn index_chunks(
    embedder: &impl EmbeddingService,
    store: &impl VectorStore,
    collection: &str,
    chunks: &[Chunk],
) -> anyhow::Result<()> {
    let texts: Vec<String> = chunks.iter().map(|c| c.text.clone()).collect();
    let embeddings = embedder.embed(&texts).await?;

    let payloads: Vec<serde_json::Value> = chunks.iter()
        .map(|c| serde_json::json!({
            "content": c.text,
            "title": c.title,
            "section": c.section,
            "canonical_url": c.canonical_url,
        }))
        .collect();

    store.index(collection, embeddings, payloads).await?;
    Ok(())
}
```

**Why put the URL in the payload rather than a side table?** Because the payload is what comes back from `search()` as part of each `SearchResult` — the evidence formatter (Step 6) can read it directly, with no join against any other datastore. The retrieval result *is* the citation.

## Step 5 — Retrieve and Rerank

Vector similarity is a good first pass but an imperfect judge of relevance. The standard fix is to over-retrieve, then let a cross-encoder re-score the candidates against the actual query. MagicAF ships this as a [Reranker](/docs/api-reference/core/reranking/):

```rust
use magicaf_core::rag::reranker::{CrossEncoderReranker, CrossEncoderConfig};

let reranker = CrossEncoderReranker::new(CrossEncoderConfig {
    base_url: "http://localhost:8787".into(),
    model_name: "cross-encoder/ms-marco-MiniLM-L-6-v2".into(),
    api_key: None,
    ..Default::default()
})?;
```

If you are not running a reranking server yet, `ScoreThresholdReranker { min_score: 0.7 }` gives you a simpler quality floor with zero infrastructure.

## Step 6 — Format Evidence So It Can Be Cited

The [DefaultEvidenceFormatter](/docs/api-reference/core/adapter-traits/) pretty-prints raw payloads, which is fine for debugging but not for citation. Write a formatter that numbers each source and surfaces its title and canonical URL:

```rust
use async_trait::async_trait;
use magicaf_core::adapters::EvidenceFormatter;
use magicaf_core::errors::Result;
use magicaf_core::vector_store::SearchResult;

pub struct CitedEvidenceFormatter;

#[async_trait]
impl EvidenceFormatter for CitedEvidenceFormatter {
    async fn format_evidence(&self, results: &[SearchResult]) -> Result<String> {
        let mut out = String::new();
        for (i, r) in results.iter().enumerate() {
            let title = r.payload["title"].as_str().unwrap_or("Untitled");
            let url = r.payload["canonical_url"].as_str().unwrap_or("");
            let content = r.payload["content"].as_str().unwrap_or("");
            out.push_str(&format!(
                "[{n}] {title}\nURL: {url}\n{content}\n\n",
                n = i + 1,
            ));
        }
        Ok(out)
    }
}
```

Now the LLM sees each passage labeled `[1]`, `[2]`, … with its URL — so it can be *instructed* to cite by number.

## Step 7 — Assemble the Workflow and Ask a Question

Wire everything into a [RAGWorkflow](/docs/api-reference/core/rag-workflow/). The system instruction does the last piece of work: it constrains the model to the evidence and demands citations back to the canonical URLs.

```rust
use magicaf_local_llm::LocalLlmService;

let llm = LocalLlmService::new(LlmConfig {
    base_url: "http://localhost:8000/v1".into(),
    model_name: "mistral-7b".into(),
    api_key: None,
    timeout_secs: 120,
})?;

let workflow = RAGWorkflow::builder()
    .embedding_service(embedder)
    .vector_store(store)
    .llm_service(llm)
    .evidence_formatter(CitedEvidenceFormatter)
    .prompt_builder(DefaultPromptBuilder::new().with_system(
        "You are a clinical reference assistant. Answer using ONLY the \
         numbered evidence provided. After every claim, cite the evidence \
         number in brackets, e.g. [1]. End with a 'Sources' list mapping \
         each cited number to its title and URL. If the evidence does not \
         answer the question, say so — do not answer from memory.",
    ))
    .result_parser(RawResultParser)
    .collection(collection)
    .top_k(20)                        // over-retrieve candidates
    .reranker(Box::new(reranker))     // re-score, keep the best
    .generation_config(GenerationConfig {
        temperature: 0.1,             // low temperature for reference answers
        max_tokens: 2048,
        ..Default::default()
    })
    .build()?;

let result = workflow
    .run("What are the core elements of a CLABSI prevention bundle?", None)
    .await?;

println!("{}", result.result);
println!("\nEvidence items used: {}", result.evidence_count);
```

A well-behaved run produces an answer whose claims each carry a bracketed citation, followed by a sources list pointing at pages like `https://clinical-database.com/vascular-access/guides/clabsi-prevention/` — a real page a clinician can open, read, and check the `dateModified` on.

You can also scope retrieval to one department with a vector store filter, since `section` is in every payload:

```rust
let filter = serde_json::json!({
    "must": [{ "key": "section", "match": { "value": "vascular-access" } }]
});
let result = workflow.run("How is a PICC removed safely?", Some(filter)).await?;
```

---

## Respect and Attribution

The Clinical Database is explicitly friendly to this use — its `robots.txt` and `/.well-known/ai.txt` allow AI retrieval, and all content is free to read, quote, and cite without registration. In return, follow its [citation guidelines](https://clinical-database.com/llms.txt):

- Cite the **stable canonical URL** of the specific page — which this pipeline preserves end to end.
- Prefer the `dateModified` from the page's JSON-LD over the published date when reporting how current a source is.
- Credit the listed authors for long quotations, and link back to the source page.
- For commercial reuse, contact the maintainers (hello@intracav.ai).

A pipeline that carries provenance from ingest through generation makes complying with all of this automatic — which is the point of building it this way.

## Where This Goes Next

You now have a grounded, citing clinical retrieval pipeline over a real corpus. From here:

- **[Tutorial: Custom Adapters →](/docs/tutorials/custom-adapters/)** — replace the default components with clinical-domain logic (structured answers, typed result parsing)
- **[Tutorial: Air-Gapped Deployment →](/docs/tutorials/air-gapped-deployment/)** — mirror the corpus via `sitemap.xml` on a connected machine and run this same pipeline fully offline
- **[API Reference: Reranking →](/docs/api-reference/core/reranking/)** — tune the retrieve-then-rerank stage
- **[Lumen docs →](https://docs.intracav.ai)** — what a production clinical assistant built on this corpus looks like
